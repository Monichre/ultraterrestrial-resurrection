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

# ner.v1.yaml 4.0.0 sends Topic and Artifact on the EVIDENCE wire type with the
# domain name in record_type_hint; route those back to their own tables.
# Document, Testimony, Sighting and uncertain Events stay EVIDENCE (skipped,
# recoverable): sightings are matched on date + place, never on name.
HINT_TO_TYPE: dict[str, str] = {"Topic": "TOPIC", "Artifact": "ARTIFACT"}

# record_decision values (ner.v1.yaml 4.0.0). Only record_candidate may be
# auto-written; the other two always go to a human. None = pre-4.0.0 output.
RECORD_DECISIONS = frozenset({"record_candidate", "context_only", "needs_review"})

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
    quote_grounded: bool | None = None
    name_grounded: bool | None = None
    record_type_hint: str | None = None
    record_decision: str | None = None
    record_decision_note: str | None = None

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
            "quote_grounded": self.quote_grounded,
            "name_grounded": self.name_grounded,
            "record_type_hint": self.record_type_hint,
            "record_decision": self.record_decision,
            "record_decision_note": self.record_decision_note,
        }


def _squash(text: str | None) -> str:
    """Lowercase, collapse whitespace. Used only for containment checks."""
    return " ".join((text or "").lower().split())


def chunk_texts_of(pipeline: dict[str, Any]) -> dict[str, str]:
    """{chunk_id: squashed chunk text} from the pipeline's own `chunks` array.

    The NER stage was shown these texts, so they are the ground truth a quote
    has to be found in. Keys mirror ner_results[].chunk_id ('c01', 'c02', ...).
    """
    out: dict[str, str] = {}
    for chunk in pipeline.get("chunks") or []:
        key = chunk.get("chunk_id") or chunk.get("id")
        if key:
            out[key] = _squash(chunk.get("text") or chunk.get("content"))
    return out


def grounding_of(quote: str | None, name: str | None, chunk_text: str) -> tuple[bool | None, bool | None]:
    """Is the span_quote — and the name — literally present in the chunk?

    Deterministic, no model involved — but read the caveat before trusting it as
    a fabrication signal. Measured over the knowledge base on 2026-09-27: 15% of
    quotes in the three newest episodes (33 of 217) and 18% in the older 68 are
    not literal substrings of their chunk.

    ⚠️ A failed check is NOT proof of invention. These transcripts are
    auto-transcribed, so proper nouns arrive mangled ("Zasudra" for Ziusudra,
    "younger drius" for Younger Dryas, "Shirupac" for Shuruppak). A model that
    correctly normalizes those will quote the normalized spelling and fail an
    exact-substring test. So treat `False` as "not verbatim — a human should
    look", which is exactly how store._auto_outcome uses it, and never as
    "fabricated".

    `name_grounded` is reported but deliberately NOT used as a gate — NER
    normalizes names ("Robert Bigelow" for a transcript's "Bigelow"), so only
    ~55% of names appear verbatim and a false negative rate that high would
    send legitimate entities to review.

    Returns (quote_grounded, name_grounded); either is None when the check
    cannot be made (no quote, or the chunk text is unavailable).
    """
    if not chunk_text:
        return None, None
    squashed_quote = _squash(quote)
    squashed_name = _squash(name)
    return (
        (squashed_quote in chunk_text) if squashed_quote else None,
        (squashed_name in chunk_text) if squashed_name else None,
    )


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
    chunk_text_by_id = chunk_texts_of(pipeline)
    for result in pipeline.get("ner_results") or []:
        verdict = (result.get("validation") or {}).get("verdict")
        if verdict not in verdicts:
            continue
        chunk_id = result.get("chunk_id")
        chunk_text = chunk_text_by_id.get(chunk_id or "", "")
        for position, ent in enumerate((result.get("ner") or {}).get("entities") or []):
            etype = (ent.get("type") or "").upper()
            name = (ent.get("name") or "").strip()
            if not etype or not name:
                continue
            hint = ent.get("record_type_hint")
            if etype == "EVIDENCE" and hint in HINT_TO_TYPE:
                etype = HINT_TO_TYPE[hint]
            decision = ent.get("record_decision")
            if decision not in RECORD_DECISIONS:
                decision = None
            quote_grounded, name_grounded = grounding_of(
                ent.get("span_quote"), name, chunk_text)
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
                quote_grounded=quote_grounded,
                name_grounded=name_grounded,
                record_type_hint=hint,
                record_decision=decision,
                record_decision_note=ent.get("record_decision_note"),
            )
