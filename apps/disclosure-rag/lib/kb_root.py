"""Single source of truth for the knowledge-base archive root.

Before this module every writer computed the root independently by walking
`__file__` upward and appending `packages/knowledge-base` — four separate copies
(`data_formatter.py`, `knowledge_base_service.py`, `knowledge_base_crud.py`,
`main.py`). That made the archive root unoverridable, so there was no way to
exercise the real write path without mutating the production archive.

`DISCLOSURE_RAG_KB_PATH` overrides the root for the whole process. The benchmark
harness (`scripts/benchmark_pipeline.py`) sets it to a temp directory so ingest
checks measure real writes against a sandbox archive.
"""

from __future__ import annotations

import os
from pathlib import Path

# lib/kb_root.py -> disclosure-rag -> apps -> repo root
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent

ENV_VAR = "DISCLOSURE_RAG_KB_PATH"


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
