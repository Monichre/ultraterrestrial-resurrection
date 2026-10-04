#!/usr/bin/env python3
"""Trace Map: a provenance-first graph of one processed source.

Implements `docs/TRACE_MAP_OUTPUT_SPEC.md` (schema `trace-map.v1`) as a
**deterministic** projection of artefacts the RAG prompt pipeline already
produces. No LLM call is made here. Everything in the graph is either copied
from a pipeline artefact or derived from text alignment against the timed
transcript segments.

Why deterministic-only:

The spec also describes Readings, Counter-readings, and Next Traces — an
interpretive layer. Nothing in the current chain emits those, and inventing
them is precisely the failure this platform exists to avoid. So they are
reported as *gaps* by `validate_trace_map`, not fabricated. A future
interpretive prompt can add them without changing anything here.

The one thing this module does that the pipeline cannot: it puts every claim,
entity, and piece of evidence back on the clock. Chunk text and NER
`span_quote`s are located inside the timed segment corpus, which turns
"Bigelow said X" into "Bigelow said X at 11:52-15:41, segments 49-92".

Entry points:

    build_trace_map(...)          -> dict   the canonical graph
    validate_trace_map(graph)     -> dict   {"errors": [...], "gaps": [...]}
    render_trace_map_markdown(g)  -> str    projection, graph-only by signature
    write_trace_map(...)          -> dict   both files + a summary
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import re
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional, Tuple

logger = logging.getLogger(__name__)

SCHEMA_VERSION = "trace-map.v1"

#: The only evidentiary states the spec permits. Absence means unassigned —
#: never implicitly Observed.
CANONICAL_STATES = (
    "Observed", "Corroborated", "Contested", "Inferred",
    "Speculative", "Resonant", "Unverified", "Disconfirmed",
)

#: NER wire types → the entity kinds the map records. Mirrors
#: packages/ai/prompts/schemas/output/entity.schema.json.
ENTITY_TYPES = ("PERSONNEL", "EVENT", "ORGANIZATION", "EVIDENCE", "LOCATION")

#: Minimum fragment length worth trying to locate. Shorter strings match
#: everywhere and would produce confident-looking garbage anchors.
MIN_ANCHOR_CHARS = 24

#: Prefix/suffix window used when a fragment does not match verbatim. The
#: chunker lightly rewrites whitespace and filler, so only 3 of 11 chunks match
#: exactly; matching the head and tail recovers the rest.
ANCHOR_WINDOW = 60


# --------------------------------------------------------------------------
# identity
# --------------------------------------------------------------------------

def _norm(text: Optional[str]) -> str:
    """Normalise for matching and hashing: whitespace, case, punctuation."""
    lowered = re.sub(r"\s+", " ", (text or "")).strip().lower()
    return re.sub(r"[^\w\s]", "", lowered).strip()


def _norm_match(text: Optional[str]) -> str:
    """Normalise for *locating* only — keeps punctuation out but not words."""
    return re.sub(r"\s+", " ", (text or "")).strip().lower()


def _hash(text: str, length: int = 12) -> str:
    """Content hash used in node IDs. Deterministic across reruns by design:
    the same claim in the same source must produce the same ID so two runs can
    be diffed. Never mix a timestamp in here."""
    return hashlib.sha256(_norm(text).encode("utf-8")).hexdigest()[:length]


def _sha256(text: str) -> str:
    return "sha256:" + hashlib.sha256((text or "").encode("utf-8")).hexdigest()


def _hhmmss(seconds: Optional[float]) -> str:
    if seconds is None:
        return "--:--"
    seconds = max(0, int(seconds))
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def _as_list(value: Any) -> List[Any]:
    """Coerce a field that should be a list. The chunker honours the declared
    array types today, but tier fallback can route a prompt to a provider that
    does not validate types at all, and a bare string here would otherwise be
    iterated character by character."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        stripped = value.strip()
        if stripped.startswith("[") and stripped.endswith("]"):
            try:
                parsed = json.loads(stripped)
                if isinstance(parsed, list):
                    return parsed
            except (ValueError, TypeError):
                pass
        return [value] if stripped else []
    return [value]


# --------------------------------------------------------------------------
# alignment
# --------------------------------------------------------------------------

class SegmentIndex:
    """Maps arbitrary text fragments back to timed transcript segments.

    Builds one normalised character corpus out of the segment sidecar and keeps
    a char-range → ordinal index alongside it. `locate()` returns the character
    span and the segment ordinals covering it, plus *how* the match was made,
    so a downstream reader can tell a verbatim quote from a recovered one.
    """

    def __init__(self, segments: Iterable[Dict[str, Any]]):
        self.segments: List[Dict[str, Any]] = [
            s for s in (segments or []) if isinstance(s, dict)
        ]
        self._by_ordinal: Dict[int, Dict[str, Any]] = {}
        self._ranges: List[Tuple[int, int, int]] = []  # (start, end, ordinal)

        buf: List[str] = []
        pos = 0
        for seg in self.segments:
            ordinal = seg.get("ordinal")
            if ordinal is None:
                continue
            self._by_ordinal[ordinal] = seg
            text = _norm_match(seg.get("text"))
            if not text:
                continue
            if buf:
                buf.append(" ")
                pos += 1
            self._ranges.append((pos, pos + len(text), ordinal))
            buf.append(text)
            pos += len(text)

        self.corpus = "".join(buf)

    def __bool__(self) -> bool:
        return bool(self.corpus)

    @property
    def total_chars(self) -> int:
        return len(self.corpus)

    @property
    def total_segments(self) -> int:
        return len(self._by_ordinal)

    def locate(self, fragment: str) -> Optional[Dict[str, Any]]:
        """Find `fragment` in the corpus. None when it cannot be placed."""
        frag = _norm_match(fragment)
        if len(frag) < MIN_ANCHOR_CHARS:
            return None

        hit = self.corpus.find(frag)
        if hit >= 0:
            return self._anchor(hit, hit + len(frag), "exact")

        window = min(ANCHOR_WINDOW, len(frag))
        head = self.corpus.find(frag[:window])
        tail = self.corpus.rfind(frag[-window:])
        if head >= 0 and tail >= 0 and tail + window > head:
            return self._anchor(head, tail + window, "prefix_suffix")
        if head >= 0:
            # Only the opening survived rewriting. Trust the start, take the
            # fragment's own length for the end, and say so.
            return self._anchor(head, min(head + len(frag), self.total_chars),
                                "prefix_only")
        return None

    def anchor_span(self, start: int, end: int, method: str) -> Dict[str, Any]:
        """Public constructor for an anchor over a known character span."""
        return self._anchor(start, end, method)

    def _anchor(self, start: int, end: int, method: str) -> Dict[str, Any]:
        ordinals = [o for (a, b, o) in self._ranges if b > start and a < end]
        first = self._by_ordinal.get(ordinals[0]) if ordinals else None
        last = self._by_ordinal.get(ordinals[-1]) if ordinals else None

        start_time = (first or {}).get("start")
        end_time = None
        if last is not None:
            last_start = last.get("start")
            last_dur = last.get("duration") or 0
            if last_start is not None:
                end_time = last_start + last_dur

        return {
            "charStart": start,
            "charEnd": end,
            "segmentStart": ordinals[0] if ordinals else None,
            "segmentEnd": ordinals[-1] if ordinals else None,
            "startSeconds": start_time,
            "endSeconds": end_time,
            "method": method,
            "excerpt": self.corpus[start:min(end, start + 240)],
        }


# --------------------------------------------------------------------------
# graph construction
# --------------------------------------------------------------------------

class _GraphBuilder:
    """Accumulates nodes and edges with de-duplication by ID."""

    def __init__(self, source_id: str):
        self.source_id = source_id
        self._nodes: Dict[str, Dict[str, Any]] = {}
        self._edges: Dict[Tuple[str, str, str], Dict[str, Any]] = {}
        self._order: List[str] = []

    def node(self, node_id: str, node_type: str, label: str,
             **fields: Any) -> str:
        existing = self._nodes.get(node_id)
        if existing is None:
            payload = {"id": node_id, "type": node_type, "label": label}
            payload.update({k: v for k, v in fields.items() if v is not None})
            self._nodes[node_id] = payload
            self._order.append(node_id)
        else:
            # Same node seen again (an entity mentioned in several chunks).
            # Fill blanks, never overwrite an established value.
            for key, value in fields.items():
                if value is not None and existing.get(key) is None:
                    existing[key] = value
        return node_id

    def edge(self, source: str, target: str, edge_type: str,
             **fields: Any) -> None:
        key = (source, target, edge_type)
        if key in self._edges:
            return
        payload = {"from": source, "to": target, "type": edge_type}
        payload.update({k: v for k, v in fields.items() if v is not None})
        self._edges[key] = payload

    def has(self, node_id: str) -> bool:
        return node_id in self._nodes

    def get(self, node_id: str) -> Optional[Dict[str, Any]]:
        return self._nodes.get(node_id)

    def ids_of_type(self, node_type: str) -> List[str]:
        return [n for n in self._order if self._nodes[n]["type"] == node_type]

    @property
    def nodes(self) -> List[Dict[str, Any]]:
        return [self._nodes[n] for n in self._order]

    @property
    def edges(self) -> List[Dict[str, Any]]:
        return list(self._edges.values())


def _extract_inner_quotes(text: str) -> List[str]:
    """Pull quoted spans out of an analysis sentence.

    `supporting_evidence` entries are written as a wrapper around a quotation:
    "Bigelow cites General De Brouwer's account: 'I'm just burning fuel...'".
    The wrapper is the analyst's prose and will never anchor; the quotation is
    source material and usually will. Only the quotation can be Evidence.
    """
    if not text:
        return []
    pattern = re.compile(r"['‘’“”\"]([^'‘’“”\"]{%d,})"
                         r"['‘’“”\"]" % MIN_ANCHOR_CHARS)
    return [m.strip() for m in pattern.findall(text) if m.strip()]


def build_trace_map(
    *,
    pipeline_result: Dict[str, Any],
    segments: Optional[Iterable[Dict[str, Any]]] = None,
    source_url: str = "",
    source_title: str = "",
    source_id: Optional[str] = None,
    source_type: str = "video",
    transcript_text: str = "",
    content_version: int = 1,
    methodology_version: str = "rag-prompt-pipeline/ADR-0001",
) -> Dict[str, Any]:
    """Project one pipeline result into a `trace-map.v1` graph.

    `segments` is the timed sidecar written at fetch time. Without it the map
    is still built — topics, claims, entities and open questions all survive —
    but nothing carries a timestamp and every anchor degrades to the chunk's
    own text. That state is reported honestly in `coverage.timed`.
    """
    # Documents and web articles have no timed sidecar, but they are still
    # citable — the spec allows a character range as a segment anchor. Fall
    # back to indexing the source text as one untimed segment so chunks anchor
    # by character offset. Without this the anchor test that decides Claim vs
    # Inference has nothing to test against, every claim is anchorless, and the
    # map fails validation on every local-file ingest.
    if not segments and (transcript_text or "").strip():
        segments = [{"ordinal": 0, "text": transcript_text,
                     "start": None, "duration": None}]
        timed = False
    else:
        timed = bool(segments)

    index = SegmentIndex(segments or [])
    raw_id = source_id or source_url or source_title or "unknown-source"
    sid = f"src:{_hash(raw_id, 16)}"
    g = _GraphBuilder(sid)

    ingestion = pipeline_result.get("ingestion") or {}
    document = ingestion.get("document") or {}
    analysis = pipeline_result.get("analysis") or {}
    extracted = analysis.get("extracted_data") or {}
    assessment = analysis.get("content_assessment") or {}
    classification = pipeline_result.get("classification") or {}
    chunks = [c for c in (pipeline_result.get("chunks") or [])
              if isinstance(c, dict)]
    ner_results = [n for n in (pipeline_result.get("ner_results") or [])
                   if isinstance(n, dict)]

    g.node(
        sid, "source",
        source_title or document.get("title_guess") or "Untitled source",
        url=source_url or document.get("provenance") or None,
        sourceType=source_type,
        contentType=document.get("content_type") or classification.get("content_type"),
        integrityFlags=_as_list(document.get("integrity_flags")),
        classificationMarks=_as_list(classification.get("classification_marks_detected")),
        ingestionRecommendation=classification.get("ingestion_recommendation"),
    )

    # ---- segments: one citation unit per chunk, resolved to real time ----
    anchors: Dict[str, Dict[str, Any]] = {}
    seg_ids: List[str] = []
    for chunk in chunks:
        chunk_id = chunk.get("chunk_id") or f"c{len(seg_ids) + 1:02d}"
        node_id = f"seg:{sid[4:]}:{chunk_id}"
        anchor = index.locate(chunk.get("text") or "") if index else None
        anchors[chunk_id] = anchor or {}
        seg_ids.append(node_id)
        g.node(
            node_id, "segment", chunk_id,
            chunkId=chunk_id,
            headingPath=chunk.get("heading_path"),
            evidentiaryDensity=chunk.get("evidentiary_density"),
            overlapNote=chunk.get("overlap_note"),
            temporalAnchors=_as_list(chunk.get("temporal_anchors")),
            spatialAnchors=_as_list(chunk.get("spatial_anchors")),
            anchor=anchor,
            excerpt=(chunk.get("text") or "")[:240],
        )
        g.edge(sid, node_id, "contains")

    # A chunk whose text was rewritten past recognition still sits *between*
    # its neighbours — source order is a fact even when the string match fails.
    # Fill the gap and label the anchor `interpolated` so nobody reads it as a
    # located quote.
    ordered_anchors = [
        anchors.get(c.get("chunk_id") or f"c{i + 1:02d}") or {}
        for i, c in enumerate(chunks)
    ]
    for position, chunk in enumerate(chunks):
        chunk_id = chunk.get("chunk_id") or f"c{position + 1:02d}"
        if anchors.get(chunk_id):
            continue
        before = next((a for a in reversed(ordered_anchors[:position]) if a),
                      None)
        after = next((a for a in ordered_anchors[position + 1:] if a), None)
        if not (before and after):
            continue
        start, end = before["charEnd"], after["charStart"]
        if end <= start:
            continue
        filled = index.anchor_span(start, end, "interpolated")
        anchors[chunk_id] = filled
        node = g.get(seg_ids[position])
        if node is not None:
            node["anchor"] = filled

    for earlier, later in zip(seg_ids, seg_ids[1:]):
        g.edge(earlier, later, "precedes")

    # ---- topics: the chunker's heading path is the source's own outline ----
    topic_of_chunk: Dict[str, str] = {}
    for position, chunk in enumerate(chunks):
        heading = (chunk.get("heading_path") or "").strip()
        if not heading:
            continue
        chunk_id = chunk.get("chunk_id") or f"c{position + 1:02d}"
        topic_id = f"top:{_hash(heading)}"
        first_time = not g.has(topic_id)
        g.node(topic_id, "topic", heading)
        g.edge(topic_id, seg_ids[position], "contains")
        g.edge(topic_id, seg_ids[position],
               "introduced_by" if first_time else "reappears_at")
        topic_of_chunk[chunk_id] = topic_id

    # ---- claims: chunk-scoped hints are anchored by construction ----------
    claim_ids: List[str] = []
    for position, chunk in enumerate(chunks):
        chunk_id = chunk.get("chunk_id") or f"c{position + 1:02d}"
        chunk_anchor = anchors.get(chunk_id) or None
        for text in _as_list(chunk.get("claims_hint")):
            if not isinstance(text, str) or not text.strip():
                continue
            if not chunk_anchor:
                # The parent chunk could not be located, so this assertion has
                # no source passage behind it. Same rule as an unanchorable
                # primary_claim: it is agent-produced, not a Claim. Applying
                # the rule uniformly is also what stops a chunk the aligner
                # missed from emitting anchorless Claims and failing the map.
                node_id = f"inf:{sid[4:]}:{_hash(text)}"
                g.node(node_id, "inference", text.strip(), state="Inferred",
                       basis=f"chunk.claims_hint[{chunk_id}]",
                       note="Parent chunk could not be located in the source.")
                g.edge(node_id, seg_ids[position], "based_on")
                continue
            node_id = f"clm:{sid[4:]}:{_hash(text)}"
            if not g.has(node_id):
                claim_ids.append(node_id)
            g.node(node_id, "claim", text.strip(), anchor=chunk_anchor,
                   claimSource="chunk.claims_hint")
            # The spec's asserting relationship: this passage contains it.
            g.edge(seg_ids[position], node_id, "asserts")
            topic_id = topic_of_chunk.get(chunk_id)
            if topic_id:
                g.edge(node_id, topic_id, "about")

    # ---- claims and inferences from the document-level analysis ----------
    # `primary_claims` are the analyst prompt's own restatements. Some are
    # near-verbatim and locate in the source; most are paraphrase. The spec is
    # unambiguous about the difference: a Claim needs an exact segment anchor,
    # and anything agent-produced is an Inference carrying [Inferred]. So the
    # anchor test decides the node type rather than being a quality score.
    for text in _as_list(extracted.get("primary_claims")):
        if not isinstance(text, str) or not text.strip():
            continue
        anchor = index.locate(text) if index else None
        if anchor:
            node_id = f"clm:{sid[4:]}:{_hash(text)}"
            if not g.has(node_id):
                claim_ids.append(node_id)
            g.node(node_id, "claim", text.strip(), anchor=anchor,
                   claimSource="analysis.primary_claims")
            owner = _segment_for_anchor(seg_ids, chunks, anchors, anchor)
            g.edge(owner or sid, node_id, "asserts")
        else:
            node_id = f"inf:{sid[4:]}:{_hash(text)}"
            g.node(node_id, "inference", text.strip(),
                   state="Inferred",
                   basis="analysis.primary_claims",
                   note="Restated by the analysis prompt; no verbatim span "
                        "located in the source, so it is not a Claim.")
            g.edge(node_id, sid, "based_on")

    # `key_findings` arrive as objects (event/date/attendees/...), never as
    # locatable prose. They are structured analyst output — Inference by the
    # same test, kept because they carry the meeting facts a reader wants.
    for finding in _as_list(extracted.get("key_findings")):
        if isinstance(finding, dict):
            label = (finding.get("event") or finding.get("title")
                     or json.dumps(finding, ensure_ascii=False)[:120])
            detail = finding
        elif isinstance(finding, str) and finding.strip():
            label, detail = finding.strip(), None
        else:
            continue
        node_id = f"inf:{sid[4:]}:{_hash(json.dumps(detail or label, sort_keys=True, ensure_ascii=False))}"
        g.node(node_id, "inference", label, state="Inferred",
               basis="analysis.key_findings", detail=detail)
        g.edge(node_id, sid, "based_on")

    # ---- evidence: only the quoted spans that actually locate -------------
    for stance, key in (("supporting", "supporting_evidence"),
                        ("contradictory", "contradictory_evidence")):
        for text in _as_list(extracted.get(key)):
            if not isinstance(text, str) or not text.strip():
                continue
            quotes = _extract_inner_quotes(text) or [text]
            placed = False
            for quote in quotes:
                anchor = index.locate(quote) if index else None
                if not anchor:
                    continue
                placed = True
                node_id = f"evd:{sid[4:]}:{_hash(quote)}"
                g.node(node_id, "evidence", quote.strip(), anchor=anchor,
                       stance=stance, context=text.strip(),
                       evidenceSource=f"analysis.{key}")
                owner = _segment_for_anchor(seg_ids, chunks, anchors, anchor)
                if owner:
                    chunk_id = (g.get(owner) or {}).get("chunkId")
                    topic_id = topic_of_chunk.get(chunk_id or "")
                    if topic_id:
                        g.edge(node_id, topic_id, "about")
            if not placed:
                # Unanchorable evidence is the analyst's own characterisation.
                # It does not get to be Evidence.
                node_id = f"inf:{sid[4:]}:{_hash(text)}"
                g.node(node_id, "inference", text.strip(), state="Inferred",
                       basis=f"analysis.{key}", stance=stance,
                       note="No quoted span located in the source.")
                g.edge(node_id, sid, "based_on")

    # ---- entities: NER output, each mention anchored by its span_quote ----
    for entry in ner_results:
        chunk_id = entry.get("chunk_id")
        seg_id = next((s for s in seg_ids
                       if (g.get(s) or {}).get("chunkId") == chunk_id), None)
        ner = entry.get("ner") or {}
        for ent in _as_list(ner.get("entities")):
            if not isinstance(ent, dict):
                continue
            name = (ent.get("name") or "").strip()
            etype = (ent.get("type") or "").strip().upper()
            if not name:
                continue
            node_id = f"ent:{sid[4:]}:{etype.lower()}:{_hash(name)}"
            state = ent.get("evidentiary_state")
            g.node(
                node_id, "entity", name,
                entityType=etype if etype in ENTITY_TYPES else (etype or None),
                role=ent.get("role"),
                aliases=_as_list(ent.get("aliases")) or None,
                credibilityTier=ent.get("credibility_tier"),
                credibilityNote=ent.get("credibility_note"),
                state=state if state in CANONICAL_STATES else None,
                unrecognisedState=None if state in CANONICAL_STATES else state,
                excerpt=(ent.get("span_quote") or "")[:240] or None,
                anchor=(index.locate(ent.get("span_quote") or "")
                        if index else None),
            )
            if seg_id:
                g.edge(seg_id, node_id, "mentions")

        # `analysis_summary.inferences` announces itself as agent reasoning.
        summary = ner.get("analysis_summary") or {}
        for text in _as_list(summary.get("inferences")):
            if not isinstance(text, str) or not text.strip():
                continue
            node_id = f"inf:{sid[4:]}:{_hash(text)}"
            g.node(node_id, "inference", text.strip(), state="Inferred",
                   basis=f"ner.analysis_summary[{chunk_id}]")
            g.edge(node_id, seg_id or sid, "based_on")

    # ---- the unresolved frontier ------------------------------------------
    for text in _as_list(assessment.get("follow_up_needed")):
        if not isinstance(text, str) or not text.strip():
            continue
        node_id = f"oq:{sid[4:]}:{_hash(text)}"
        g.node(node_id, "open_question", text.strip(),
               basis="analysis.content_assessment.follow_up_needed")
        g.edge(sid, node_id, "raises")

    # ---- coverage: the honest headline ------------------------------------
    covered = _merge_spans([a for a in anchors.values() if a])
    covered_chars = sum(end - start for start, end in covered)
    covered_ordinals = set()
    for node_id in seg_ids:
        anchor = (g.get(node_id) or {}).get("anchor") or {}
        first, last = anchor.get("segmentStart"), anchor.get("segmentEnd")
        if first is not None and last is not None:
            covered_ordinals.update(range(first, last + 1))

    coverage = {
        # `timed` means anchors carry timestamps, not merely that they exist.
        # A document indexed as one untimed segment anchors by character range
        # and must not be reported as timed.
        "timed": timed and bool(index),
        "charsAnchored": covered_chars,
        "charsTotal": index.total_chars,
        "fraction": round(covered_chars / index.total_chars, 4) if index.total_chars else 0.0,
        "segmentsCovered": len(covered_ordinals),
        "segmentsTotal": index.total_segments,
        "pipelineTruncatedAtChars": _pipeline_truncation_limit(),
        "chunkAnchorMethods": _count_methods(anchors.values()),
    }

    graph = {
        "schemaVersion": SCHEMA_VERSION,
        "sourceId": sid,
        "sourceType": source_type,
        "sourceUrl": source_url or document.get("provenance") or None,
        "sourceHash": _sha256(transcript_text or index.corpus),
        "contentVersion": content_version,
        "reviewState": "unreviewed",
        "nodes": g.nodes,
        "edges": g.edges,
        "views": {
            "sourceSpine": seg_ids,
            "topicRoots": g.ids_of_type("topic"),
            "claimRoots": g.ids_of_type("claim"),
            "openQuestionRoots": g.ids_of_type("open_question"),
        },
        "coverage": coverage,
        "generation": {
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "models": _as_list((pipeline_result.get("metadata") or {}).get("tiers_used")),
            "promptsUsed": _as_list((pipeline_result.get("metadata") or {}).get("prompts_used")),
            "methodologyVersion": methodology_version,
            "pipelineStatus": pipeline_result.get("status"),
            "degraded": (pipeline_result.get("metadata") or {}).get("degraded"),
        },
    }
    graph["validation"] = validate_trace_map(graph)
    return graph


def _segment_for_anchor(seg_ids, chunks, anchors, anchor) -> Optional[str]:
    """Which chunk-segment contains this character span, if any."""
    start = anchor.get("charStart")
    if start is None:
        return None
    for position, chunk in enumerate(chunks):
        span = anchors.get(chunk.get("chunk_id") or "")
        if not span:
            continue
        if span.get("charStart", 0) <= start < span.get("charEnd", 0):
            return seg_ids[position]
    return None


def _merge_spans(anchor_list: Iterable[Dict[str, Any]]) -> List[Tuple[int, int]]:
    spans = sorted(
        (a["charStart"], a["charEnd"]) for a in anchor_list
        if a.get("charStart") is not None and a.get("charEnd") is not None
    )
    merged: List[Tuple[int, int]] = []
    for start, end in spans:
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return merged


def _count_methods(anchor_list: Iterable[Dict[str, Any]]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    for anchor in anchor_list:
        method = (anchor or {}).get("method") or "unanchored"
        counts[method] = counts.get(method, 0) + 1
    return counts


def _pipeline_truncation_limit() -> int:
    """The chunker never sees more than this many characters, so a coverage
    fraction well under 1.0 is usually truncation rather than a bad chunker."""
    try:
        return int(os.getenv("RAG_PIPELINE_MAX_SOURCE_CHARS", "24000"))
    except (TypeError, ValueError):
        return 24000


# --------------------------------------------------------------------------
# validation
# --------------------------------------------------------------------------

#: Node types the spec defines but no current pipeline stage produces. Their
#: absence is a known limitation of the deterministic builder, not a defect in
#: the artefact — so it is reported separately from `errors`.
UNPRODUCED_TYPES = {
    "next_trace": "no pipeline stage proposes concrete next sources",
    "reading": "no interpretive stage exists; readings are never inferred here",
    "counter_reading": "paired with reading; unproduced for the same reason",
    "speaker": "diarisation is unavailable — the transcript carries '>>' turn "
               "markers but no speaker identities",
}


def validate_trace_map(graph: Dict[str, Any]) -> Dict[str, Any]:
    """Check a graph against the spec's gates.

    Two lists, deliberately:

    `errors` mean the artefact is *wrong* — a claim with no anchor, an
    inference typed as a claim, an evidentiary state outside the canonical
    eight. Any error means do not trust this map.

    `gaps` mean the spec asks for something this pipeline cannot produce. A map
    with gaps is honest and useful; a map with gaps silently filled in would
    not be. Fabricating a Next Trace to turn a gap green is the exact failure
    this whole artefact is meant to prevent.
    """
    errors: List[str] = []
    gaps: List[str] = []

    nodes = graph.get("nodes") or []
    edges = graph.get("edges") or []
    by_id = {n.get("id"): n for n in nodes if isinstance(n, dict)}
    by_type: Dict[str, List[Dict[str, Any]]] = {}
    for node in nodes:
        by_type.setdefault(node.get("type"), []).append(node)

    for node in by_type.get("claim", []):
        anchor = node.get("anchor") or {}
        if anchor.get("charStart") is None:
            errors.append(
                f"claim {node.get('id')} has no source segment anchor")

    for node in by_type.get("evidence", []):
        anchor = node.get("anchor") or {}
        if anchor.get("charStart") is None:
            errors.append(
                f"evidence {node.get('id')} has no provenance anchor")

    for node in nodes:
        state = node.get("state")
        if state is not None and state not in CANONICAL_STATES:
            errors.append(
                f"{node.get('id')} carries non-canonical evidentiary state "
                f"{state!r}")
        if node.get("unrecognisedState"):
            gaps.append(
                f"{node.get('id')} reported state "
                f"{node['unrecognisedState']!r}, outside the canonical eight — "
                "recorded but not adopted")
        if node.get("type") in ("inference", "reading", "counter_reading"):
            if node.get("state") != "Inferred":
                errors.append(
                    f"{node.get('id')} is agent-produced but does not carry "
                    "[Inferred]")

    for edge in edges:
        for end in ("from", "to"):
            if edge.get(end) not in by_id:
                errors.append(
                    f"edge {edge.get('type')} references unknown node "
                    f"{edge.get(end)!r}")

    spine = (graph.get("views") or {}).get("sourceSpine") or []
    if spine:
        missing = [s for s in spine if s not in by_id]
        if missing:
            errors.append(f"sourceSpine references unknown nodes: {missing}")
        precedes = {(e["from"], e["to"]) for e in edges
                    if e.get("type") == "precedes"}
        for earlier, later in zip(spine, spine[1:]):
            if (earlier, later) not in precedes:
                errors.append(
                    f"source order unreconstructable: no precedes edge "
                    f"{earlier} → {later}")
    elif by_type.get("segment"):
        errors.append("segments exist but sourceSpine is empty")

    readings = by_type.get("reading", [])
    paired = {e["from"] for e in edges if e.get("type") == "paired_with"}
    for node in readings:
        if node.get("id") not in paired:
            errors.append(
                f"reading {node.get('id')} has no counter-reading")

    for node_type, reason in UNPRODUCED_TYPES.items():
        if not by_type.get(node_type):
            gaps.append(f"no {node_type} nodes — {reason}")

    if not by_type.get("segment"):
        # A map with no spine is structurally valid — it asserts nothing false
        # — and completely useless. Without this the hollow 2026-08-09 run
        # produces 33 inference nodes, zero source material, and a clean bill
        # of health.
        gaps.append("no segments — the ingestion stage produced no chunks, so "
                    "this map has no source spine and nothing in it is "
                    "anchored to the source")
    if not by_type.get("claim"):
        gaps.append("no claims anchored to source material")

    if not by_type.get("open_question"):
        gaps.append("no open questions — the map manufactures closure it has "
                    "no basis for")

    if not any(e.get("type") in ("supports", "corroborates", "qualifies",
                                 "challenges", "contradicts", "disconfirms")
               for e in edges):
        gaps.append(
            "no evidence→claim edges — the analysis prompt emits supporting "
            "and contradictory evidence as flat lists with no target claim, "
            "so evidence carries a stance but names no claim it bears on")

    coverage = graph.get("coverage") or {}
    if not coverage.get("timed"):
        gaps.append("no timed segment sidecar — nothing in this map carries a "
                    "timestamp")
    fraction = coverage.get("fraction") or 0.0
    if coverage.get("timed") and fraction < 0.95:
        gaps.append(
            f"chunk coverage is {fraction:.0%} of the source "
            f"({coverage.get('charsAnchored')} of "
            f"{coverage.get('charsTotal')} chars); the pipeline truncates at "
            f"{coverage.get('pipelineTruncatedAtChars')} chars")

    return {"valid": not errors, "errors": errors, "gaps": gaps}


# --------------------------------------------------------------------------
# markdown projection
# --------------------------------------------------------------------------

#: Diagram nodes per Claim/Evidence subgraph. The spec caps these at ~10-12:
#: "A thousand-node hairball is technically a graph and practically a
#: confession of defeat."
MAX_SUBGRAPH_NODES = 12
MAX_SPINE_NODES = 14


def _mermaid_id(position: int) -> str:
    """Diagram-safe ID for the node at `position` in `nodes[]`.

    Canonical IDs (`seg:8f21…:c01`) contain colons and cannot go in a Mermaid
    graph. Positional IDs are safe and, paired with the trace index that every
    rendering emits, reverse-resolve exactly — which is the spec's gate: "a
    diagram node cannot be resolved to a canonical JSON node ID".
    """
    return f"n{position}"


def _mermaid_label(text: str, limit: int = 58) -> str:
    flat = re.sub(r"\s+", " ", text or "").strip()
    if len(flat) > limit:
        flat = flat[: limit - 1].rstrip() + "…"
    return flat.replace('"', "'").replace("[", "(").replace("]", ")")


def render_trace_map_markdown(graph: Dict[str, Any]) -> str:
    """Render the human-readable projection.

    Takes the graph and nothing else — by signature, not by convention. The
    spec makes "the Markdown projection contains semantic information absent
    from the JSON graph" an invalidating condition, and the cheapest way to
    guarantee that is to deny this function any other source of truth.
    """
    nodes = graph.get("nodes") or []
    edges = graph.get("edges") or []
    by_id = {n["id"]: n for n in nodes if isinstance(n, dict) and n.get("id")}
    position_of = {n["id"]: i for i, n in enumerate(nodes) if n.get("id")}
    views = graph.get("views") or {}
    coverage = graph.get("coverage") or {}
    generation = graph.get("generation") or {}
    validation = graph.get("validation") or validate_trace_map(graph)

    source = next((n for n in nodes if n.get("type") == "source"), {})
    out: List[str] = []
    add = out.append

    def label_of(node_id: str) -> str:
        return (by_id.get(node_id) or {}).get("label") or node_id

    def time_of(node_id: str) -> str:
        anchor = (by_id.get(node_id) or {}).get("anchor") or {}
        if anchor.get("startSeconds") is None:
            return ""
        return f"{_hhmmss(anchor['startSeconds'])}–{_hhmmss(anchor.get('endSeconds'))}"

    # 1. identity and provenance
    add(f"# Trace Map — {source.get('label', 'Untitled source')}")
    add("")
    add(f"- **Source ID:** `{graph.get('sourceId')}`")
    if source.get("url"):
        add(f"- **Source:** {source['url']}")
    add(f"- **Source type:** {graph.get('sourceType')} · "
        f"content type: {source.get('contentType') or 'unknown'}")
    add(f"- **Source hash:** `{graph.get('sourceHash')}`")
    add(f"- **Schema:** `{graph.get('schemaVersion')}` · "
        f"content version {graph.get('contentVersion')} · "
        f"review state **{graph.get('reviewState')}**")
    add(f"- **Generated:** {generation.get('createdAt')} · "
        f"methodology `{generation.get('methodologyVersion')}`")
    if generation.get("models"):
        add(f"- **Served by:** {', '.join(str(m) for m in generation['models'])}"
            f"{' (degraded)' if generation.get('degraded') else ''}")
    if source.get("integrityFlags"):
        add(f"- **Integrity flags:** {', '.join(source['integrityFlags'])}")
    if source.get("classificationMarks"):
        add(f"- **Classification marks in source:** "
            f"{', '.join(source['classificationMarks'])}")
    add("")

    # 2. legend
    add("## Legend")
    add("")
    add("| Marker | Meaning |")
    add("| --- | --- |")
    add("| **Source material** | `segment`, `claim`, `evidence`, `entity` — "
        "every one carries an exact character span and, where timing exists, "
        "a timestamp |")
    add("| **[Inferred]** | `inference` — produced by a model, never by the "
        "source. Never Evidence, never a Claim |")
    add("| **Frontier** | `open_question` — what this source cannot resolve |")
    add("| Solid arrow | source-derived relationship |")
    add("| Dotted arrow | agent-produced relationship |")
    add("")

    # coverage, stated before anything invites confidence in the graph
    add("## Coverage")
    add("")
    if coverage.get("timed"):
        add(f"The chunker anchored **{coverage.get('fraction', 0):.0%}** of the "
            f"source — {coverage.get('charsAnchored'):,} of "
            f"{coverage.get('charsTotal'):,} characters, "
            f"{coverage.get('segmentsCovered'):,} of "
            f"{coverage.get('segmentsTotal'):,} timed segments.")
        add("")
        add(f"The pipeline truncates its input at "
            f"{coverage.get('pipelineTruncatedAtChars'):,} characters, so a "
            "fraction below that ratio is expected; anything lower is the "
            "chunker skipping material.")
    else:
        add("**No timed segment sidecar.** Nothing in this map carries a "
            "timestamp, and anchors are character offsets into the transcript "
            "only. Re-fetch the source to recover timing.")
    methods = coverage.get("chunkAnchorMethods") or {}
    if methods:
        add("")
        add("Anchor methods across segments: "
            + ", ".join(f"`{k}` ×{v}" for k, v in sorted(methods.items())))
    add("")

    # 3. source spine
    spine = views.get("sourceSpine") or []
    add("## Source spine")
    add("")
    if not spine:
        add("_No segments — the ingestion stage produced no chunks._")
    else:
        shown = spine[:MAX_SPINE_NODES]
        add("```mermaid")
        add("flowchart TD")
        src_id = graph.get("sourceId")
        if src_id in position_of:
            add(f'  {_mermaid_id(position_of[src_id])}["{_mermaid_label(source.get("label", "Source"))}"]')
        previous = src_id
        for node_id in shown:
            node = by_id.get(node_id) or {}
            stamp = time_of(node_id)
            heading = node.get("headingPath") or node.get("label")
            text = f"{stamp} · {heading}" if stamp else str(heading)
            add(f'  {_mermaid_id(position_of[node_id])}["{_mermaid_label(text)}"]')
            if previous in position_of:
                add(f"  {_mermaid_id(position_of[previous])} --> "
                    f"{_mermaid_id(position_of[node_id])}")
            previous = node_id
        add("```")
        if len(spine) > MAX_SPINE_NODES:
            add("")
            add(f"_Showing the first {MAX_SPINE_NODES} of {len(spine)} "
                "segments; the full spine is in the trace index below._")
        add("")
        add("| Segment | Time | Chars | Heading | Density | Anchor |")
        add("| --- | --- | --- | --- | --- | --- |")
        for node_id in spine:
            node = by_id.get(node_id) or {}
            anchor = node.get("anchor") or {}
            char_range = (f"{anchor['charStart']}–{anchor['charEnd']}"
                          if anchor.get("charStart") is not None else "—")
            add(f"| `{node.get('chunkId')}` | {time_of(node_id) or '—'} | "
                f"{char_range} | {node.get('headingPath') or '—'} | "
                f"{node.get('evidentiaryDensity') or '—'} | "
                f"`{anchor.get('method', 'unanchored')}` |")
    add("")

    # 4. topic trees
    add("## Topics")
    add("")
    topics = views.get("topicRoots") or []
    if not topics:
        add("_The chunker emitted no heading paths, so no topic tree exists._")
    for topic_id in topics:
        node = by_id.get(topic_id) or {}
        intro = [e["to"] for e in edges
                 if e.get("type") == "introduced_by" and e.get("from") == topic_id]
        again = [e["to"] for e in edges
                 if e.get("type") == "reappears_at" and e.get("from") == topic_id]
        stamp = time_of(intro[0]) if intro else ""
        add(f"- **{node.get('label')}** — introduced at "
            f"{stamp or 'unknown time'} "
            f"(`{label_of(intro[0]) if intro else '—'}`)"
            + (f", recurs in {', '.join('`' + label_of(s) + '`' for s in again)}"
               if again else ""))
    add("")

    # 5. claim / evidence subgraphs, one per segment that asserts anything
    add("## Claims and evidence")
    add("")
    asserted: Dict[str, List[str]] = {}
    for edge in edges:
        if edge.get("type") == "asserts":
            asserted.setdefault(edge["from"], []).append(edge["to"])
    if not asserted:
        add("_No claims were extracted from this source._")
    for seg_id, claims in asserted.items():
        seg = by_id.get(seg_id) or {}
        heading = seg.get("headingPath") or seg.get("label") or seg_id
        stamp = time_of(seg_id)
        add(f"### {heading}" + (f" · {stamp}" if stamp else ""))
        add("")
        evidence = [
            n for n in nodes
            if n.get("type") == "evidence"
            and _within(n.get("anchor"), seg.get("anchor"))
        ]
        add("```mermaid")
        add("flowchart TD")
        budget = MAX_SUBGRAPH_NODES - 1
        add(f'  {_mermaid_id(position_of[seg_id])}["{_mermaid_label(str(heading))}"]')
        for claim_id in claims[:budget]:
            add(f'  {_mermaid_id(position_of[claim_id])}["{_mermaid_label(label_of(claim_id))}"]')
            add(f"  {_mermaid_id(position_of[seg_id])} --> "
                f"{_mermaid_id(position_of[claim_id])}")
            budget -= 1
        for node in evidence[: max(budget, 0)]:
            marker = "⊕" if node.get("stance") == "supporting" else "⊖"
            add(f'  {_mermaid_id(position_of[node["id"]])}'
                f'["{marker} {_mermaid_label(node.get("label", ""))}"]')
            add(f"  {_mermaid_id(position_of[node['id']])} -.-> "
                f"{_mermaid_id(position_of[seg_id])}")
        add("```")
        add("")
        if len(claims) > MAX_SUBGRAPH_NODES - 1:
            add(f"_{len(claims)} claims in this segment; "
                f"{MAX_SUBGRAPH_NODES - 1} shown. All appear in the trace "
                "index._")
            add("")
        if evidence:
            add("Evidence located in this segment carries a stance but names "
                "no target claim — the analysis stage does not emit that "
                "linkage. Co-location in the same passage is the only "
                "source-derived join available.")
            add("")

    # 6. frontier
    add("## Open questions")
    add("")
    questions = views.get("openQuestionRoots") or []
    if not questions:
        add("_None recorded. That is a gap, not closure — see limitations._")
    for question_id in questions:
        add(f"- {label_of(question_id)}")
    add("")
    add("### Next traces")
    add("")
    next_traces = [n for n in nodes if n.get("type") == "next_trace"]
    if not next_traces:
        add("_None. No stage in this pipeline proposes concrete next sources, "
            "so the frontier stops at the questions above rather than naming "
            "records to pull._")
    for node in next_traces:
        add(f"- {node.get('label')}")
    add("")

    # inferences, kept structurally separate from everything above
    inferences = [n for n in nodes if n.get("type") == "inference"]
    add("## Agent-produced readings [Inferred]")
    add("")
    if not inferences:
        add("_None._")
    else:
        add("Nothing below is Evidence or a Claim. Each is a model's "
            "restatement or interpretation, kept because it is useful and "
            "labelled because it is not source material.")
        add("")
        for node in inferences:
            add(f"- **[Inferred]** {node.get('label')} "
                f"— basis `{node.get('basis') or 'unstated'}`")
    add("")

    # 7. trace index — the reverse-resolution contract
    add("## Trace index")
    add("")
    add("Every diagram ID above resolves here. This table is the contract "
        "that makes the Mermaid views inspectable rather than decorative.")
    add("")
    add("| Diagram ID | Node ID | Type | Segments | Time | Label |")
    add("| --- | --- | --- | --- | --- | --- |")
    for position, node in enumerate(nodes):
        anchor = node.get("anchor") or {}
        seg_range = "—"
        if anchor.get("segmentStart") is not None:
            seg_range = f"{anchor['segmentStart']}–{anchor['segmentEnd']}"
        add(f"| `{_mermaid_id(position)}` | `{node.get('id')}` | "
            f"{node.get('type')} | {seg_range} | "
            f"{time_of(node.get('id', '')) or '—'} | "
            f"{_mermaid_label(node.get('label', ''), 90)} |")
    add("")
    add(f"**Edges:** {len(edges)} across "
        f"{len(sorted({e.get('type') for e in edges}))} types — "
        + ", ".join(f"`{t}`" for t in sorted({str(e.get("type")) for e in edges})))
    add("")

    # 8. limitations
    add("## Limitations")
    add("")
    if validation.get("errors"):
        add("**This map failed validation.** Do not treat it as sound:")
        add("")
        for problem in validation["errors"]:
            add(f"- ❌ {problem}")
        add("")
    for gap in validation.get("gaps") or []:
        add(f"- ⚠️ {gap}")
    if not validation.get("gaps"):
        add("_No gaps recorded._")
    add("")
    return "\n".join(out) + "\n"


def _within(inner: Optional[Dict[str, Any]],
            outer: Optional[Dict[str, Any]]) -> bool:
    """Is `inner`'s character span inside `outer`'s?"""
    if not inner or not outer:
        return False
    start, lower = inner.get("charStart"), outer.get("charStart")
    upper = outer.get("charEnd")
    if start is None or lower is None or upper is None:
        return False
    return lower <= start < upper


# --------------------------------------------------------------------------
# bundle integration
# --------------------------------------------------------------------------

def load_segments(segments_path: Optional[str]) -> List[Dict[str, Any]]:
    """Read a `*_segments.json` sidecar. Missing or unreadable → empty."""
    if not segments_path or not os.path.exists(segments_path):
        return []
    try:
        with open(segments_path, "r", encoding="utf-8") as handle:
            return json.load(handle).get("segments") or []
    except (OSError, ValueError, AttributeError) as exc:
        logger.warning("Unreadable segment sidecar %s: %s", segments_path, exc)
        return []


def write_trace_map(
    directory: str,
    stem: str,
    graph: Dict[str, Any],
) -> Dict[str, Any]:
    """Write `<stem>_trace_map.json` and `.md` and summarise what landed.

    The Markdown is rendered from the graph that was just written, never from
    the pipeline result — that is the spec's "generated only from
    trace-map.json" rule made structural.
    """
    os.makedirs(directory, exist_ok=True)
    json_path = os.path.join(directory, f"{stem}_trace_map.json")
    md_path = os.path.join(directory, f"{stem}_trace_map.md")

    with open(json_path, "w", encoding="utf-8") as handle:
        json.dump(graph, handle, indent=2, ensure_ascii=False)
    with open(md_path, "w", encoding="utf-8") as handle:
        handle.write(render_trace_map_markdown(graph))

    validation = graph.get("validation") or {}
    return {
        "json_path": json_path,
        "md_path": md_path,
        "node_count": len(graph.get("nodes") or []),
        "edge_count": len(graph.get("edges") or []),
        "coverage_fraction": (graph.get("coverage") or {}).get("fraction"),
        "valid": validation.get("valid", False),
        "error_count": len(validation.get("errors") or []),
        "gap_count": len(validation.get("gaps") or []),
    }


def build_and_write_trace_map(
    *,
    pipeline_result: Dict[str, Any],
    directory: str,
    stem: str,
    segments_path: Optional[str] = None,
    segments: Optional[Iterable[Dict[str, Any]]] = None,
    source_url: str = "",
    source_title: str = "",
    source_id: Optional[str] = None,
    source_type: str = "video",
    transcript_text: str = "",
) -> Dict[str, Any]:
    """Build a trace map from a pipeline result and stage it beside the bundle.

    Raises nothing the caller must handle beyond ordinary IO errors — callers
    wrap this best-effort, because a trace-map failure must never fail an
    otherwise good ingest. It must, however, be *reported*: a silent
    best-effort write is how a green tick ends up over an empty artefact.
    """
    graph = build_trace_map(
        pipeline_result=pipeline_result,
        segments=segments if segments is not None else load_segments(segments_path),
        source_url=source_url,
        source_title=source_title,
        source_id=source_id,
        source_type=source_type,
        transcript_text=transcript_text,
    )
    return write_trace_map(directory, stem, graph)
