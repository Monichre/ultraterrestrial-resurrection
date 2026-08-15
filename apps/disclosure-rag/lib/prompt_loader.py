"""Bridge to packages/ai/prompts YAML registry for disclosure-rag."""
from __future__ import annotations

import os
import sys
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[3]


def _resolve_prompts_dir() -> Path:
    env = os.getenv("PROMPTS_DIR")
    if env:
        return Path(env)

    candidates = [
        _REPO_ROOT / "packages" / "ai" / "prompts",
        _REPO_ROOT / "packages" / "prompts",  # legacy
    ]
    for cand in candidates:
        if cand.exists() and (cand / "registry.yaml").exists():
            return cand

    # Prefer ai/prompts even if missing so import errors are clear
    return _REPO_ROOT / "packages" / "ai" / "prompts"


_PROMPTS_DIR = _resolve_prompts_dir()
if str(_PROMPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_PROMPTS_DIR))

from prompt_helpers import get_prompt, get_prompt_with_schema  # noqa: E402
from yaml_loader import list_prompts  # noqa: E402

__all__ = ["get_prompt", "get_prompt_with_schema",
           "PROMPTS_DIR", "list_registered_prompts"]

PROMPTS_DIR = _PROMPTS_DIR


def list_registered_prompts():
    """Return registry entries from packages/ai/prompts."""
    return list_prompts(str(PROMPTS_DIR))
