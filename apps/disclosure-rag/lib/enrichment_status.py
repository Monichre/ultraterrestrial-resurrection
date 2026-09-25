"""Single definition of "did LLM enrichment actually happen on this run?".

Every ingestion path produces a `rag_pipeline` block, but files it in a
different place, so grading it needs one search order that knows all of them.
This lived inside scripts/playlist_ingestion.py, where only the playlist path
could reach it — main.py's direct `dy <url>` path had no gate at all and
reported success on a run whose retrieval layer came back empty.

main.py cannot import from scripts/ (playlist_ingestion imports main, so it
would be circular), which is why this is a lib module rather than a helper
shared by proximity.
"""
from __future__ import annotations

from typing import Any, Dict, Tuple

#: Statuses from RagPipelineResult that mean enrichment genuinely succeeded.
OK_STATUSES = {"ok"}
#: Statuses that are a deliberate, recorded decision — not a failure.
HELD_STATUSES = {"hold", "rejected", "skipped"}


def enrichment_outcome(result: Dict[str, Any]) -> Tuple[str, str]:
    """Grade LLM enrichment from a process_url/process_file result.

    Returns (status, error_detail).

    The status lives in a different place depending on which path ran:
    `process_file` sets `result['rag_pipeline']` and
    `result['metadata']['rag_pipeline']`; the YouTube path (lib/youtube.py)
    files it under the transcript's file metadata and
    knowledge_base_service surfaces it at both levels.

    Returns "unknown" when no signal is found. That matters: reporting
    `ingested` on absence is precisely how a run of documents whose enrichment
    had 401'd got recorded as successful.
    """
    for container in (result, result.get("metadata") or {}, result.get("file_metadata") or {}):
        rag = container.get("rag_pipeline") if isinstance(container, dict) else None
        if isinstance(rag, dict) and rag.get("status"):
            return rag["status"], "; ".join(rag.get("errors") or [])[:300]

    for stage in result.get("stage_report") or []:
        if isinstance(stage, dict) and "RAG prompt pipeline" in (stage.get("name") or ""):
            raw = stage.get("status") or "unknown"
            return {"success": "ok", "failed": "error"}.get(raw, raw), (stage.get("detail") or "")[:300]

    return "unknown", ""
