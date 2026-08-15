#!/usr/bin/env python3
"""Capability-aware LLM router — reads llm_routing.yaml and routes tasks to tiers.

Replaces the hardcoded FRONTIER_FALLBACK_CHAIN in llm_fallback.py with a
config-driven router that:

1. Matches tasks to tiers by declared capabilities (structured_output, reasoning)
2. Caches SchemaUnsupported per-tier (skip schema on tiers that reject it)
3. Persists dead-tier status to disk with TTL (skip known-dead endpoints)
4. Falls through preferred → fallback → last-resort chains per task

The router is a view over the config file — it does not duplicate state.
lib/llm_fallback.py remains the execution engine; this module tells it
which tiers to try, in what order, for each task.
"""

from __future__ import annotations

import json
import logging
import os
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

import yaml

logger = logging.getLogger(__name__)

# ── Config path ───────────────────────────────────────────────────────

_REPO_ROOT = Path(__file__).resolve().parents[3]
_CONFIG_PATH = _REPO_ROOT / "packages" / "ai" / "prompts" / "llm_routing.yaml"


# ── Data classes ──────────────────────────────────────────────────────

@dataclass(frozen=True)
class TierConfig:
    """One tier declaration from llm_routing.yaml."""
    id: str
    provider: str
    kind: str  # openai_compat | anthropic | google
    model: str
    env_keys: Sequence[str]
    base_url: Optional[str]
    structured_output: bool
    reasoning: bool
    streaming: bool
    vision: bool
    cost_tier: int
    latency_tier: int
    max_retries: int
    reasoning_headroom_tokens: int
    notes: str = ""

    def api_key(self) -> Optional[str]:
        for key in self.env_keys:
            value = os.environ.get(key)
            if value:
                return value
        return None


@dataclass
class TaskConfig:
    """One task declaration from llm_routing.yaml."""
    id: str
    prompt_id: Optional[str]
    requires_structured_output: bool
    requires_reasoning: bool
    requires_vision: bool
    max_tokens: int
    temperature: float
    schema_strict: bool = False
    preferred_tiers: List[str] = field(default_factory=list)
    fallback_tiers: List[str] = field(default_factory=list)


@dataclass
class CacheConfig:
    dead_tier_ttl_seconds: int = 3600
    dead_tier_path: str = ".cache/llm_dead_tiers.json"
    schema_capability_ttl_seconds: int = 86400
    schema_capability_path: str = ".cache/llm_schema_capabilities.json"


# ── Persistent caches ─────────────────────────────────────────────────

class DeadTierCache:
    """Dead-tier cache persisted to disk with TTL.

    A tier marked dead within the TTL window is skipped without probing.
    After the TTL expires, the tier is re-probed (it may have been fixed).
    """

    def __init__(self, path: Path, ttl_seconds: int) -> None:
        self._path = path
        self._ttl = ttl_seconds
        self._dead: Dict[str, float] = {}  # tier_id -> timestamp
        self._load()

    def _load(self) -> None:
        if not self._path.exists():
            return
        try:
            data = json.loads(self._path.read_text())
            now = time.time()
            self._dead = {
                k: v for k, v in data.items()
                if isinstance(v, (int, float)) and (now - v) < self._ttl
            }
            # If we filtered out expired entries, rewrite the file
            if len(self._dead) != len(data):
                self._save()
        except (json.JSONDecodeError, OSError) as e:
            logger.warning("Failed to load dead-tier cache: %s", e)

    def _save(self) -> None:
        try:
            self._path.parent.mkdir(parents=True, exist_ok=True)
            self._path.write_text(json.dumps(self._dead, indent=2))
        except OSError as e:
            logger.warning("Failed to save dead-tier cache: %s", e)

    def is_dead(self, tier_id: str) -> bool:
        ts = self._dead.get(tier_id)
        if ts is None:
            return False
        if time.time() - ts > self._ttl:
            # Expired — re-probe
            del self._dead[tier_id]
            self._save()
            return False
        return True

    def mark_dead(self, tier_id: str, reason: str = "") -> None:
        self._dead[tier_id] = time.time()
        self._save()
        logger.info("Tier %s marked dead (TTL %ds): %s", tier_id, self._ttl, reason)

    def clear(self) -> None:
        self._dead.clear()
        self._save()


class SchemaCapabilityCache:
    """Caches which tiers support structured output.

    Once a tier rejects response_format (SchemaUnsupported), we skip the
    schema attempt on every subsequent call to that tier — no more
    re-discovering the same rejection on every structured call.
    """

    def __init__(self, path: Path, ttl_seconds: int) -> None:
        self._path = path
        self._ttl = ttl_seconds
        # tier_id -> {"supports": bool, "timestamp": float}
        self._caps: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self) -> None:
        if not self._path.exists():
            return
        try:
            data = json.loads(self._path.read_text())
            now = time.time()
            self._caps = {
                k: v for k, v in data.items()
                if isinstance(v, dict) and (now - v.get("timestamp", 0)) < self._ttl
            }
            if len(self._caps) != len(data):
                self._save()
        except (json.JSONDecodeError, OSError) as e:
            logger.warning("Failed to load schema capability cache: %s", e)

    def _save(self) -> None:
        try:
            self._path.parent.mkdir(parents=True, exist_ok=True)
            self._path.write_text(json.dumps(self._caps, indent=2))
        except OSError as e:
            logger.warning("Failed to save schema capability cache: %s", e)

    def supports_structured_output(self, tier_id: str) -> Optional[bool]:
        """Returns True/False if cached, None if unknown."""
        entry = self._caps.get(tier_id)
        if entry is None:
            return None
        if time.time() - entry.get("timestamp", 0) > self._ttl:
            del self._caps[tier_id]
            self._save()
            return None
        return entry.get("supports")

    def set_supports_structured_output(self, tier_id: str, supports: bool) -> None:
        self._caps[tier_id] = {"supports": supports, "timestamp": time.time()}
        self._save()

    def clear(self) -> None:
        self._caps.clear()
        self._save()


# ── Router ────────────────────────────────────────────────────────────

class LLMRouter:
    """Config-driven task-to-tier router with persistent caching."""

    def __init__(self, config_path: Path = _CONFIG_PATH) -> None:
        self._config_path = config_path
        self._tiers: Dict[str, TierConfig] = {}
        self._tasks: Dict[str, TaskConfig] = {}
        self._cache_config = CacheConfig()
        self._defaults: Dict[str, Any] = {}
        self._load_config()

        # Initialize caches relative to the disclosure-rag app directory
        app_dir = Path(__file__).resolve().parent.parent
        self._dead_cache = DeadTierCache(
            app_dir / self._cache_config.dead_tier_path,
            self._cache_config.dead_tier_ttl_seconds,
        )
        self._schema_cache = SchemaCapabilityCache(
            app_dir / self._cache_config.schema_capability_path,
            self._cache_config.schema_capability_ttl_seconds,
        )

    def _load_config(self) -> None:
        if not self._config_path.exists():
            raise FileNotFoundError(f"LLM routing config not found: {self._config_path}")
        with open(self._config_path) as f:
            config = yaml.safe_load(f)

        for tier_data in config.get("tiers", []):
            caps = tier_data.get("capabilities", {})
            tier = TierConfig(
                id=tier_data["id"],
                provider=tier_data.get("provider", ""),
                kind=tier_data.get("kind", "openai_compat"),
                model=tier_data.get("model", ""),
                env_keys=tier_data.get("env_keys", []),
                base_url=tier_data.get("base_url"),
                structured_output=caps.get("structured_output", False),
                reasoning=caps.get("reasoning", False),
                streaming=caps.get("streaming", False),
                vision=caps.get("vision", False),
                cost_tier=tier_data.get("cost_tier", 3),
                latency_tier=tier_data.get("latency_tier", 3),
                max_retries=tier_data.get("max_retries", 1),
                reasoning_headroom_tokens=tier_data.get("reasoning_headroom_tokens", 4096),
                notes=tier_data.get("notes", ""),
            )
            self._tiers[tier.id] = tier

        for task_data in config.get("tasks", []):
            reqs = task_data.get("requires", {})
            task = TaskConfig(
                id=task_data["id"],
                prompt_id=task_data.get("prompt_id"),
                requires_structured_output=reqs.get("structured_output", False),
                requires_reasoning=reqs.get("reasoning", False),
                requires_vision=reqs.get("vision", False),
                max_tokens=task_data.get("max_tokens", 1200),
                temperature=task_data.get("temperature", 0.1),
                schema_strict=task_data.get("schema_strict", False),
                preferred_tiers=task_data.get("preferred_tiers", []),
                fallback_tiers=task_data.get("fallback_tiers", []),
            )
            self._tasks[task.id] = task

        cache_data = config.get("cache", {})
        self._cache_config = CacheConfig(
            dead_tier_ttl_seconds=cache_data.get("dead_tier_ttl_seconds", 3600),
            dead_tier_path=cache_data.get("dead_tier_path", ".cache/llm_dead_tiers.json"),
            schema_capability_ttl_seconds=cache_data.get("schema_capability_ttl_seconds", 86400),
            schema_capability_path=cache_data.get("schema_capability_path", ".cache/llm_schema_capabilities.json"),
        )

        self._defaults = config.get("defaults", {})

    # ── Public API ────────────────────────────────────────────────────

    def get_tier(self, tier_id: str) -> Optional[TierConfig]:
        return self._tiers.get(tier_id)

    def get_all_tiers(self) -> List[TierConfig]:
        return list(self._tiers.values())

    def get_task(self, task_id: str) -> Optional[TaskConfig]:
        return self._tasks.get(task_id)

    def get_task_for_prompt(self, prompt_id: str) -> Optional[TaskConfig]:
        """Find a task by its prompt_id."""
        for task in self._tasks.values():
            if task.prompt_id == prompt_id:
                return task
        return None

    def is_tier_dead(self, tier_id: str) -> bool:
        return self._dead_cache.is_dead(tier_id)

    def mark_tier_dead(self, tier_id: str, reason: str = "") -> None:
        self._dead_cache.mark_dead(tier_id, reason)

    def tier_supports_structured_output(self, tier_id: str) -> Optional[bool]:
        """Check cached schema capability. Returns None if unknown."""
        return self._schema_cache.supports_structured_output(tier_id)

    def set_tier_schema_capability(self, tier_id: str, supports: bool) -> None:
        self._schema_cache.set_supports_structured_output(tier_id, supports)

    def get_ordered_tiers_for_task(self, task_id: str) -> List[TierConfig]:
        """Return tiers in priority order for a task, filtering dead tiers.

        Order: preferred_tiers → fallback_tiers → last_resort_tiers
        Dead tiers and tiers without credentials are skipped.
        """
        task = self._tasks.get(task_id)
        if task is None:
            # Unknown task — return all enabled tiers in config order
            return [t for t in self._tiers.values()
                    if t.api_key() and not self.is_tier_dead(t.id)]

        ordered_ids = task.preferred_tiers + task.fallback_tiers
        # Add last-resort tiers from defaults
        ordered_ids.extend(self._defaults.get("last_resort_tiers", []))

        seen = set()
        result: List[TierConfig] = []
        for tier_id in ordered_ids:
            if tier_id in seen:
                continue
            seen.add(tier_id)
            tier = self._tiers.get(tier_id)
            if tier is None:
                continue
            if not tier.api_key():
                continue
            if self.is_tier_dead(tier_id):
                continue
            result.append(tier)

        return result

    def get_task_params(self, task_id: str) -> Dict[str, Any]:
        """Get runtime parameters for a task, merged with defaults."""
        task = self._tasks.get(task_id)
        if task is None:
            return {
                "max_tokens": self._defaults.get("max_tokens", 1200),
                "temperature": self._defaults.get("temperature", 0.1),
            }
        return {
            "max_tokens": task.max_tokens,
            "temperature": task.temperature,
            "schema_strict": task.schema_strict,
            "requires_structured_output": task.requires_structured_output,
            "requires_reasoning": task.requires_reasoning,
        }

    def should_send_schema(
        self, tier_id: str, task_id: str, schema: Optional[Dict[str, Any]]
    ) -> bool:
        """Decide whether to send schema to this tier for this task.

        Returns False if:
        - No schema provided
        - Task doesn't require structured output
        - Tier is known to not support structured output (cached)
        - Tier is declared as not supporting structured output in config
        """
        if schema is None:
            return False
        task = self._tasks.get(task_id)
        if task and not task.requires_structured_output:
            return False
        tier = self._tiers.get(tier_id)
        if tier and not tier.structured_output:
            return False
        # Check cached capability (from runtime rejections)
        cached = self._schema_cache.supports_structured_output(tier_id)
        if cached is False:
            return False
        return True

    def describe(self) -> str:
        """Human-readable summary of the router state."""
        lines = ["LLM Router:"]
        lines.append(f"  Tiers: {len(self._tiers)} declared, "
                     f"{sum(1 for t in self._tiers.values() if t.api_key())} with credentials")
        lines.append(f"  Tasks: {len(self._tasks)}")
        dead = [tid for tid in self._tiers if self.is_tier_dead(tid)]
        lines.append(f"  Dead tiers: {dead if dead else 'none'}")
        no_schema = [tid for tid in self._tiers
                     if self._schema_cache.supports_structured_output(tid) is False]
        lines.append(f"  No structured output (cached): {no_schema if no_schema else 'none'}")
        return "\n".join(lines)


# ── Module-level singleton ────────────────────────────────────────────

_ROUTER: Optional[LLMRouter] = None


def get_router() -> LLMRouter:
    """Process-wide router singleton."""
    global _ROUTER
    if _ROUTER is None:
        _ROUTER = LLMRouter()
    return _ROUTER
