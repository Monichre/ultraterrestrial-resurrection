"""Convenience helpers for loading prompts from the YAML registry."""
from __future__ import annotations

from functools import lru_cache
from typing import Any, Dict, Optional

from yaml_loader import load_prompt


@lru_cache(maxsize=32)
def get_prompt_text(prompt_id: str, params_key: str = "") -> str:
    """Load and cache a rendered prompt string by registry id or alias."""
    params: Optional[Dict[str, Any]] = None
    if params_key:
        import json
        params = json.loads(params_key)
    return load_prompt(prompt_id, params)["prompt"]


def get_prompt(prompt_id: str, params: Optional[Dict[str, Any]] = None) -> str:
    """Load a rendered prompt string (uncached when params are provided)."""
    if params:
        return load_prompt(prompt_id, params)["prompt"]
    return get_prompt_text(prompt_id)


def get_prompt_with_schema(
    prompt_id: str, params: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Load full prompt payload including optional JSON schema."""
    return load_prompt(prompt_id, params)
