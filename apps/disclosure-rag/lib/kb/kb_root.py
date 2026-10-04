"""Single source of truth for the knowledge-base archive root.

Before this module every writer computed the root independently by walking
`__file__` upward and appending `packages/knowledge-base` — four separate copies
(`data_formatter.py`, `knowledge_base_service.py`, `knowledge_base_crud.py`,
`main.py`). That made the archive root unoverridable, so there was no way to
exercise the real write path without mutating the production archive.

`DISCLOSURE_RAG_KB_PATH` overrides the root for the whole process. The benchmark
harness (`scripts/benchmark_pipeline.py`) sets it to a temp directory so ingest
checks measure real writes against a sandbox archive.

How service / CRUD / vector KnowledgeBase differ:
apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

# lib/kb/kb_root.py -> lib -> disclosure-rag -> apps -> repo root
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent

ENV_VAR = "DISCLOSURE_RAG_KB_PATH"

KNOWN_TREES = ("transcripts", "web", "files")
UNRESOLVED = "unresolved"

# T-061 Phase 2: metadata/source-registry.json is a Phase 0/1 artifact that
# maps a stable identifier (channel_id, web domain, or an alias of either) to
# a canonical slug. It lives at a fixed repo path, not under the (possibly
# sandboxed) archive root -- DISCLOSURE_RAG_KB_PATH redirects where entries
# are written, not where the registry itself is read from.
_SOURCE_REGISTRY_PATH = _REPO_ROOT / "packages" / "knowledge-base" / "metadata" / "source-registry.json"

_registry_cache: Optional[dict] = None


def kb_root() -> Path:
    """Absolute path to the knowledge-base archive root."""
    override = os.environ.get(ENV_VAR, "").strip()
    if override:
        return Path(override).expanduser().resolve()
    return _REPO_ROOT / "packages" / "knowledge-base"


def sources_root() -> Path:
    """Absolute path to the intake/archive `sources/` tree."""
    return kb_root() / "sources"


def relativize(path: Path | str) -> str:
    """Return `path` relative to the archive root when it lives inside it.

    Paths are persisted relative so the archive survives being moved or cloned
    (`ingestion-hardening.md` §3.4: "Paths stored **relative**, always"). Paths
    outside the archive are returned unchanged.
    """
    p = Path(path)
    try:
        return str(p.resolve().relative_to(kb_root().resolve()))
    except ValueError:
        return str(path)


def _load_source_registry() -> dict:
    """Build (and cache, per process) a lookup of raw identifier -> canonical slug.

    Each registry entry is keyed by its own slug and carries a `channel_id`
    (youtube_channel) or `domain` (web_domain), plus any `aliases`. This
    flattens all of those into one dict so `resolve_entry_dir` can look up
    whatever a caller happens to have on hand (a channel_id, a domain, an
    alias, or the slug itself) with a single `dict.get`.

    A missing or unreadable registry file is not an error -- it is the
    expected state before Phase 0/1 lands the file -- so it caches an empty
    lookup and every source_key falls through to `UNRESOLVED` (helper rule
    #1: unknown is not a guess).
    """
    global _registry_cache
    if _registry_cache is not None:
        return _registry_cache

    lookup: dict = {}
    try:
        with open(_SOURCE_REGISTRY_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        for slug, entry in (data.get("sources") or {}).items():
            canonical = entry.get("slug") or slug
            lookup[slug] = canonical
            for key in ("channel_id", "domain"):
                value = entry.get(key)
                if value:
                    lookup[value] = canonical
            for alias in entry.get("aliases") or []:
                if alias:
                    lookup[alias] = canonical
    except FileNotFoundError:
        logger.warning(
            "Source registry not found at %s; resolve_entry_dir() will route "
            "every entry to '%s' until it exists.", _SOURCE_REGISTRY_PATH, UNRESOLVED
        )
    except (json.JSONDecodeError, OSError) as e:
        logger.warning(
            "Source registry at %s unreadable (%s); resolve_entry_dir() will "
            "route every entry to '%s'.", _SOURCE_REGISTRY_PATH, e, UNRESOLVED
        )

    _registry_cache = lookup
    return lookup


def resolve_entry_dir(tree: str, source_key: Optional[str], entry_id: str) -> Path:
    """Absolute directory for one archive entry, keyed by canonical source.

    Replaces the date-folder layout: `sources/<tree>/<YYYY-MM-DD>/<entry_id>/`
    becomes `sources/<tree>/<source_slug>/<entry_id>/`.

    tree:       "transcripts" | "web" | "files"
    source_key: a raw identifier looked up in metadata/source-registry.json
                (channel_id, web domain, or a registered alias/slug); None,
                empty, or a key absent from the registry all resolve to
                "unresolved" -- never guess a source.
    entry_id:   videoId, <slug>-<hash8>, or filename stem

    Computes a path only; callers create the directory (no mkdir here, so
    this stays side-effect-free and testable). Routed through kb_root() via
    sources_root(), so DISCLOSURE_RAG_KB_PATH keeps redirecting every writer.
    """
    if tree not in KNOWN_TREES:
        raise ValueError(
            f"resolve_entry_dir: unknown tree {tree!r}; must be one of {KNOWN_TREES}"
        )

    slug = UNRESOLVED
    if source_key:
        slug = _load_source_registry().get(source_key, UNRESOLVED)

    return sources_root() / tree / slug / entry_id
