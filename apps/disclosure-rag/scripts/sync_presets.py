#!/usr/bin/env python3
"""Sync registry prompts to OpenRouter Presets.

Reads the prompt registry and routing config, then pushes each task's
configuration (model, system prompt, params) to OpenRouter as a preset
via POST /api/v1/presets/{slug}/chat/completions.

Once created, the presets can be referenced in the routing config as:
  model: "@preset/disclosure-classification"

Presets can then be updated server-side without code changes.

Usage:
  python scripts/sync_presets.py --dry-run    # show what would be pushed
  python scripts/sync_presets.py              # push to OpenRouter
  python scripts/sync_presets.py --task rag_ingestion  # push one task

Requires OPENROUTER_API_KEY in environment.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

import httpx
import yaml

# Repo paths
REPO_ROOT = Path(__file__).resolve().parents[3]
ROUTING_CONFIG = REPO_ROOT / "packages/ai/prompts/llm_routing.yaml"
REGISTRY_FILE = REPO_ROOT / "packages/ai/prompts/registry.yaml"
PROMPTS_DIR = REPO_ROOT / "packages/ai/prompts"


def load_routing_config() -> Dict[str, Any]:
    with open(ROUTING_CONFIG) as f:
        return yaml.safe_load(f)


def load_registry() -> Dict[str, Any]:
    with open(REGISTRY_FILE) as f:
        return yaml.safe_load(f)


def get_task_config(routing: Dict[str, Any], task_id: str) -> Optional[Dict[str, Any]]:
    for task in routing.get("tasks", []):
        if task["id"] == task_id:
            return task
    return None


def get_tier_config(routing: Dict[str, Any], tier_id: str) -> Optional[Dict[str, Any]]:
    for tier in routing.get("tiers", []):
        if tier["id"] == tier_id:
            return tier
    return None


def get_prompt_template(registry: Dict[str, Any], prompt_id: str) -> Optional[str]:
    """Load the system prompt for a given prompt_id from the registry."""
    prompts_list = registry.get("prompts", [])
    if isinstance(prompts_list, dict):
        # Dict format
        prompt_entry = prompts_list.get(prompt_id)
    else:
        # List format (actual registry.yaml format)
        prompt_entry = None
        for p in prompts_list:
            if p.get("id") == prompt_id:
                prompt_entry = p
                break
    if not prompt_entry:
        return None
    # Try to load the template file
    file_path = prompt_entry.get("file") or prompt_entry.get("template")
    if file_path:
        full_path = PROMPTS_DIR / file_path
        if full_path.exists():
            with open(full_path) as f:
                template_data = yaml.safe_load(f)
                # Template files use various field names for the prompt
                if isinstance(template_data, dict):
                    return (
                        template_data.get("system_prompt")
                        or template_data.get("system")
                        or template_data.get("prompt")
                        or template_data.get("template")
                    )
    # Fall back to inline
    return prompt_entry.get("system_prompt") or prompt_entry.get("prompt") or prompt_entry.get("template_text")


def build_preset_body(
    task: Dict[str, Any],
    routing: Dict[str, Any],
    registry: Dict[str, Any],
) -> Dict[str, Any]:
    """Build the request body for creating a preset from a task config."""
    # Get the first preferred tier's model
    preferred = task.get("preferred_tiers", [])
    if not preferred:
        raise ValueError(f"Task {task['id']} has no preferred tiers")

    tier = get_tier_config(routing, preferred[0])
    if not tier:
        raise ValueError(f"Tier {preferred[0]} not found in config")

    # Get the system prompt from the registry
    prompt_id = task.get("prompt_id")
    system_prompt = None
    if prompt_id:
        system_prompt = get_prompt_template(registry, prompt_id)

    # Build the preset body
    body: Dict[str, Any] = {
        "model": tier["model"],
        "temperature": task.get("temperature", 0.1),
    }
    max_tokens = task.get("max_tokens")
    if max_tokens:
        body["max_tokens"] = max_tokens

    if system_prompt:
        body["messages"] = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "placeholder"},
        ]

    # Add provider routing preferences based on tier
    provider_prefs: Dict[str, Any] = {}
    if tier.get("base_url") and "openrouter" in (tier.get("base_url") or ""):
        provider_prefs["sort"] = "price"
    if provider_prefs:
        body["provider"] = provider_prefs

    return body


def slugify_task_id(task_id: str) -> str:
    """Convert a task ID to a preset slug."""
    return task_id.replace(".", "-").replace("_", "-").lower()


def push_preset(
    slug: str,
    body: Dict[str, Any],
    api_key: str,
    dry_run: bool = False,
) -> bool:
    """Push a preset to OpenRouter."""
    url = f"https://openrouter.ai/api/v1/presets/{slug}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    if dry_run:
        print(f"  [DRY RUN] Would POST to {url}")
        print(f"  [DRY RUN] Body: {json.dumps(body, indent=2)[:500]}")
        return True

    try:
        resp = httpx.post(url, json=body, headers=headers, timeout=30)
        if resp.status_code < 400:
            data = resp.json()
            preset = data.get("data", {})
            print(f"  OK: preset '{preset.get('name')}' slug='{preset.get('slug')}' "
                  f"version={preset.get('designated_version', {}).get('version')}")
            return True
        else:
            print(f"  FAIL: HTTP {resp.status_code}: {resp.text[:200]}")
            return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync registry prompts to OpenRouter Presets")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be pushed without making requests")
    parser.add_argument("--task", type=str, help="Sync only this task ID (e.g. rag_ingestion)")
    parser.add_argument("--list", action="store_true", help="List tasks that would be synced")
    args = parser.parse_args()

    routing = load_routing_config()
    registry = load_registry()

    # Find preset tiers in the routing config
    preset_tiers = [t for t in routing.get("tiers", []) if t.get("kind") == "openrouter_preset"]

    if not preset_tiers:
        print("No openrouter_preset tiers found in routing config.")
        return 1

    print(f"Found {len(preset_tiers)} preset tiers:")
    for t in preset_tiers:
        slug = t.get("preset_slug", slugify_task_id(t["id"]))
        print(f"  {t['id']} -> @preset/{slug}")

    if args.list:
        return 0

    # Map preset tiers to task configs
    tasks_to_sync: List[tuple] = []
    for pt in preset_tiers:
        slug = pt.get("preset_slug", slugify_task_id(pt["id"]))
        # Find the matching task
        task_id = None
        for task in routing.get("tasks", []):
            # Match by slug pattern: disclosure-classification -> document_classification
            task_slug = slugify_task_id(task["id"])
            if task_slug == slug or slug in task_slug or task_slug in slug:
                task_id = task["id"]
                break
        if not task_id:
            print(f"\nWARNING: No task found for preset tier {pt['id']} (slug={slug})")
            continue
        if args.task and task_id != args.task:
            continue
        task_config = get_task_config(routing, task_id)
        if task_config:
            tasks_to_sync.append((task_id, slug, task_config))

    if not tasks_to_sync:
        print("\nNo tasks to sync.")
        return 0

    api_key = os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key and not args.dry_run:
        print("\nERROR: OPENROUTER_API_KEY not set in environment")
        return 1

    print(f"\n{'DRY RUN: ' if args.dry_run else ''}Syncing {len(tasks_to_sync)} presets:")
    success = 0
    for task_id, slug, task_config in tasks_to_sync:
        print(f"\n  {task_id} -> @preset/{slug}")
        try:
            body = build_preset_body(task_config, routing, registry)
            if push_preset(slug, body, api_key, dry_run=args.dry_run):
                success += 1
        except Exception as e:
            print(f"  ERROR building preset: {e}")

    print(f"\n{'DRY RUN: ' if args.dry_run else ''}{success}/{len(tasks_to_sync)} presets synced.")
    return 0 if success == len(tasks_to_sync) else 1


if __name__ == "__main__":
    sys.exit(main())
