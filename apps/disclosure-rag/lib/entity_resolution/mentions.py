"""Pull NER mentions out of a *_rag_pipeline.json. Pure: no database access."""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterator

# NER wire enum (packages/ai/prompts/sets/disclosure/ner.v1.yaml) -> Neon table.
# EVIDENCE has no entity table: it is a testimony/document/claim, and Claims do
# not exist yet. resolve marks those `skipped` so they stay recoverable.
TYPE_TO_TABLE: dict[str, str | None] = {
    "PERSONNEL": "key_figures",
    "ORGANIZATION": "organizations",
    "EVENT": "events",
    "TOPIC": "topics",
    "LOCATION": "locations",
    "ARTIFACT": "artifacts",
    "EVIDENCE": None,
}

# Chunk verdicts from the pipeline's validation pass. `fail` chunks are left out
# by default: their entities did not pass the pipeline's own db-write gate.
DEFAULT_VERDICTS = frozenset({"pass", "pass_with_warnings", None})

_YOUTUBE_ID = re.compile(r"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})")
_CHUNK_NUM = re.compile(r"(\d+)$")


@dataclass
class Mention:
    entity_type: str
    entity_name: str
    quote: str | None
    confidence: float | None
    chunk_id: str | None
    chunk_index: int | None
    kb_path: str
    verdict: str | None
    mention_key: str
    video_id: str | None = None
    attributes: dict[str, Any] = field(default_factory=dict)
    aliases: list[str] = field(default_factory=list)
    evidentiary_state: str | None = None

    @property
    def table(self) -> str | None:
        return TYPE_TO_TABLE.get(self.entity_type)

    def metadata(self) -> dict[str, Any]:
        return {
            "mention_key": self.mention_key,
            "kb_path": self.kb_path,
            "chunk_id": self.chunk_id,
            "verdict": self.verdict,
            "video_id": self.video_id,
            "attributes": self.attributes,
            "ner_aliases": self.aliases,
            "evidentiary_state": self.evidentiary_state,
        }


def chunk_index_of(chunk_id: str | None) -> int | None:
    """'c07' -> 7. KB chunk numbering, not document_chunks.chunk_index."""
    if not chunk_id:
        return None
    m = _CHUNK_NUM.search(chunk_id)
    return int(m.group(1)) if m else None


def video_id_of(pipeline: dict[str, Any], path: Path) -> str | None:
    url = (
        ((pipeline.get("analysis") or {}).get("extracted_data") or {})
        .get("metadata", {})
        .get("source_url")
    )
    if url:
        m = _YOUTUBE_ID.search(url)
        if m:
            return m.group(1)
    # Transcript folders are named by video id: sources/transcripts/<channel>/<id>/
    parent = path.parent.name
    return parent if re.fullmatch(r"[A-Za-z0-9_-]{11}", parent) else None


def _mention_key(kb_path: str, chunk_id: str | None, position: int, etype: str, name: str) -> str:
    raw = f"{kb_path}|{chunk_id}|{position}|{etype}|{name}"
    return hashlib.md5(raw.encode("utf-8")).hexdigest()


def extract_mentions(
    path: Path,
    kb_root: Path | None = None,
    verdicts: frozenset = DEFAULT_VERDICTS,
) -> Iterator[Mention]:
    pipeline = json.loads(Path(path).read_text(encoding="utf-8"))
    kb_path = str(path.relative_to(kb_root)) if kb_root else str(path)
    vid = video_id_of(pipeline, Path(path))
    for result in pipeline.get("ner_results") or []:
        verdict = (result.get("validation") or {}).get("verdict")
        if verdict not in verdicts:
            continue
        chunk_id = result.get("chunk_id")
        for position, ent in enumerate((result.get("ner") or {}).get("entities") or []):
            etype = (ent.get("type") or "").upper()
            name = (ent.get("name") or "").strip()
            if not etype or not name:
                continue
            yield Mention(
                entity_type=etype,
                entity_name=name,
                quote=ent.get("span_quote"),
                confidence=ent.get("confidence"),
                chunk_id=chunk_id,
                chunk_index=chunk_index_of(chunk_id),
                kb_path=kb_path,
                verdict=verdict,
                mention_key=_mention_key(kb_path, chunk_id, position, etype, name),
                video_id=vid,
                attributes=ent.get("attributes") or {},
                aliases=list(ent.get("aliases") or []),
                evidentiary_state=ent.get("evidentiary_state"),
            )
