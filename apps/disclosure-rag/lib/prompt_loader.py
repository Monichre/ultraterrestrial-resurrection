"""Bridge to packages/prompts YAML registry for disclosure-rag."""
from __future__ import annotations

import sys
from pathlib import Path

_PROMPTS_DIR = Path(__file__).resolve().parents[3] / "packages" / "prompts"
if str(_PROMPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_PROMPTS_DIR))

from prompt_helpers import get_prompt, get_prompt_with_schema  # noqa: E402

__all__ = ["get_prompt", "get_prompt_with_schema", "PROMPTS_DIR"]

PROMPTS_DIR = _PROMPTS_DIR
