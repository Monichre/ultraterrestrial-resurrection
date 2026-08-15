#!/usr/bin/env python3
"""
RAG prompt pipeline for disclosure-rag document processing.

Orchestrates registry prompts:
  document_classification → disclosure.content_analysis → rag_ingestion
  → disclosure.ner → validation

Chunk bodies remain Evidence-only (ADR-0001): never embed agent Inference.
"""
from __future__ import annotations

import json
import logging
import os
import re
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

from lib.llm_fallback import AllProvidersFailed, get_fallback
from lib.prompt_loader import get_prompt, get_prompt_with_schema

load_dotenv()

logger = logging.getLogger(__name__)

MAX_NER_CHUNKS = int(os.getenv("RAG_PIPELINE_MAX_NER_CHUNKS", "8"))
MAX_SOURCE_CHARS = int(os.getenv("RAG_PIPELINE_MAX_SOURCE_CHARS", "24000"))
DEFAULT_CHUNK_TOKENS = os.getenv("RAG_PIPELINE_CHUNK_TOKENS", "512")

#: Prompts that send their registry schema over the wire as a constraint.
#:
#: Deliberately NOT "every prompt that has a schema". Only `rag_ingestion` is
#: enabled, because it is the stage that was failing to parse and its schema
#: was written from that prompt's own OUTPUT JSON SHAPE block, field for field.
#: The others stay unconstrained until someone confirms their schema describes
#: everything the prompt can actually return — a schema and the prompt text it
#: belongs to drift apart independently, and the schema is the older artifact.
#:
#: Caution, measured but NOT explained (2026-08-10, video q0N33jb7Bhk):
#: `disclosure.content_analysis` output varies a lot run to run at
#: temperature 0.1 on a 60KB transcript. Across three single runs —
#:
#:     field                     08-09    schema on   schema off
#:     primary_claims               16            8            5
#:     key_findings                  7            0            4
#:     follow_up_needed              5            3            0
#:     entities_mentioned           17            0            0
#:     temporal_markers              8            0            0
#:     anomalous_claims_flagged      4            0            0
#:
#: Attaching the schema was first suspected as the cause; removing it did not
#: restore the three fields that are empty in both recent runs, so that
#: hypothesis is unsupported. Every condition here is n=1, including the
#: baseline. Something is suppressing those three fields relative to 08-09 and
#: it is not known what — do not read this table as evidence about schemas in
#: either direction.
SCHEMA_ENABLED_PROMPTS = {"rag_ingestion"}

#: Of those, the ones whose schema is also audited against OpenAI strict mode's
#: narrower dialect (additionalProperties:false everywhere, every property in
#: required) and may be sent with strict=True. Enforced by
#: tests/test_schema_strict_mode.py — add here and to STRICT_SCHEMAS together.
STRICT_SCHEMA_PROMPTS = {"rag_ingestion"}


@dataclass
class RagPipelineResult:
    status: str  # ok | hold | rejected | error
    classification: Dict[str, Any] = field(default_factory=dict)
    analysis: Dict[str, Any] = field(default_factory=dict)
    ingestion: Dict[str, Any] = field(default_factory=dict)
    chunks: List[Dict[str, Any]] = field(default_factory=list)
    ner_results: List[Dict[str, Any]] = field(default_factory=list)
    embeddable_texts: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    errors: List[str] = field(default_factory=list)
    prompts_used: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def _extract_json_payload(text: str) -> Any:
    """Parse JSON from a model response, tolerating markdown fences."""
    if not text:
        raise ValueError("empty model response")

    stripped = text.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", stripped, re.IGNORECASE)
    if fence:
        stripped = fence.group(1).strip()

    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        start = stripped.find("{")
        end = stripped.rfind("}")
        if start >= 0 and end > start:
            return json.loads(stripped[start: end + 1])
        start = stripped.find("[")
        end = stripped.rfind("]")
        if start >= 0 and end > start:
            return json.loads(stripped[start: end + 1])
        raise


class RagPromptPipeline:
    """Runs the registry-backed RAG / NER document processing pipeline."""

    def __init__(
        self,
        *,
        max_ner_chunks: int = MAX_NER_CHUNKS,
        run_ner: bool = True,
        run_validation: bool = True,
        prefer_provider: Optional[str] = None,
    ):
        self.max_ner_chunks = max_ner_chunks
        self.run_ner = run_ner
        self.run_validation = run_validation
        self.prefer_provider = (prefer_provider or os.getenv(
            "RAG_PIPELINE_PROVIDER") or "").lower()
        self._llm = get_fallback(self.prefer_provider or None)
        # Provenance of the tiers that actually served this run, so callers can
        # tell real enrichment from silent degradation.
        self.tiers_used: List[str] = []
        self.degraded = False
        #: Prompts that asked for schema enforcement and did not get it.
        self.unenforced_prompts: List[str] = []
        #: Prompts that needed a parse-repair round trip to return valid JSON.
        self.repaired_prompts: List[str] = []
        logger.info("LLM fallback chain: %s", self._llm.describe())

    def _truncate(self, text: str) -> str:
        if len(text) <= MAX_SOURCE_CHARS:
            return text
        return text[:MAX_SOURCE_CHARS] + "\n\n[TRUNCATED_FOR_PIPELINE]"

    def _complete_text(
        self,
        system_prompt: str,
        user_content: str,
        *,
        temperature: float = 0.1,
        max_tokens: int = 1200,
        schema: Optional[Dict[str, Any]] = None,
        schema_name: str = "response",
        strict: bool = False,
    ) -> str:
        result = self._llm.complete(
            system_prompt,
            user_content,
            temperature=temperature,
            max_tokens=max_tokens,
            schema=schema,
            schema_name=schema_name,
            strict=strict,
        )
        if result.tier_id not in self.tiers_used:
            self.tiers_used.append(result.tier_id)
        if result.degraded:
            self.degraded = True
        # A schema was asked for and the tier could not honour it. The answer
        # is real but unenforced, which is worth recording separately from a
        # routing fallback — it is the difference between "another tier served
        # this" and "this JSON came back on good behaviour".
        if schema is not None and not result.schema_enforced:
            self.unenforced_prompts.append(schema_name)
        return result.text

    def _run_registry_prompt(
        self,
        prompt_id: str,
        params: Dict[str, Any],
        *,
        user_fallback: str = "",
    ) -> Dict[str, Any]:
        payload = get_prompt_with_schema(prompt_id, params)
        system_prompt = payload["prompt"]
        runtime = (payload.get("meta") or {}).get("runtime") or {}
        temperature = float(runtime.get("temperature", 0.1))
        max_tokens = int(runtime.get("max_tokens", 1200))

        # load_prompt has always returned the resolved schema as its own payload
        # key; nothing read it, so every prompt was sent with the schema pasted
        # into the system text as prose and json.loads called on hope. Passing
        # it here is what makes the shape a requirement of the request — but
        # only for prompts whose schema is known to be complete enough to
        # constrain by. See SCHEMA_ENABLED_PROMPTS for what that cost when it
        # was applied indiscriminately.
        schema = payload.get("schema") if prompt_id in SCHEMA_ENABLED_PROMPTS else None
        strict = schema is not None and prompt_id in STRICT_SCHEMA_PROMPTS

        user_content = user_fallback or (
            "Return valid JSON only, conforming to the instructions and schema."
        )

        raw = self._complete_text(
            system_prompt,
            user_content,
            temperature=temperature,
            max_tokens=max_tokens,
            schema=schema,
            schema_name=prompt_id.replace(".", "_"),
            strict=strict,
        )

        try:
            parsed = _extract_json_payload(raw)
        except (ValueError, json.JSONDecodeError) as exc:
            # Second line of defence, and the one that would have saved the
            # 2026-08-09 run: schema enforcement is a request the provider may
            # decline, so malformed JSON is still reachable. One bad comma at
            # char 8455 of 12,052 was terminal — it emptied chunks, which
            # emptied the NER loop, which emptied embeddable_texts, and the run
            # still exited 0. Hand the parser's own complaint back and let the
            # model repair it once before giving up.
            logger.warning(
                "%s returned unparseable JSON (%s) — retrying once with the "
                "parser error fed back", prompt_id, exc,
            )
            repair = (
                f"{user_content}\n\n"
                f"Your previous response could not be parsed as JSON.\n"
                f"Parser error: {exc}\n"
                f"Return the corrected JSON only — no prose, no markdown fences."
            )
            raw = self._complete_text(
                system_prompt,
                repair,
                temperature=temperature,
                max_tokens=max_tokens,
                schema=schema,
                schema_name=prompt_id.replace(".", "_"),
                strict=strict,
            )
            parsed = _extract_json_payload(raw)
            self.repaired_prompts.append(prompt_id)

        if not isinstance(parsed, dict):
            return {"_raw_list": parsed, "_raw_text": raw}
        parsed["_raw_text"] = raw
        return parsed

    def process(
        self,
        source_text: str,
        *,
        provenance: str = "",
        filename_hint: str = "",
        content_type_override: Optional[str] = None,
        skip_ner: bool = False,
    ) -> RagPipelineResult:
        result = RagPipelineResult(status="ok")
        result.metadata = {
            "provenance": provenance,
            "filename_hint": filename_hint,
            "prompts_dir": str(
                __import__("lib.prompt_loader", fromlist=[
                           "PROMPTS_DIR"]).PROMPTS_DIR
            ),
        }

        if not source_text or not source_text.strip():
            result.status = "error"
            result.errors.append("empty source_text")
            return result

        text = self._truncate(source_text.strip())

        try:
            # --- Stage 1: classification ---
            result.prompts_used.append("document_classification")
            classification = self._run_registry_prompt(
                "document_classification",
                {
                    "source_text": text,
                    "filename_hint": filename_hint or "",
                },
            )
            classification.pop("_raw_text", None)
            result.classification = classification

            recommendation = str(
                classification.get("ingestion_recommendation") or "proceed"
            ).lower()
            content_type = content_type_override or classification.get(
                "content_type") or "unknown"

            if recommendation == "reject":
                result.status = "rejected"
                return result
            if recommendation == "hold_for_human_review":
                result.status = "hold"

            # --- Stage 2: content analysis ---
            result.prompts_used.append("disclosure.content_analysis")
            analysis = self._run_registry_prompt(
                "disclosure.content_analysis",
                {
                    "content_type": content_type,
                    "context_hint": provenance or "",
                    "source_text": text,
                },
            )
            analysis.pop("_raw_text", None)
            result.analysis = analysis

            # --- Stage 3: rag ingestion / chunking ---
            result.prompts_used.append("rag_ingestion")
            ingestion = self._run_registry_prompt(
                "rag_ingestion",
                {
                    "source_text": text,
                    "provenance": provenance or "",
                    "content_type": content_type,
                    "target_chunk_tokens": DEFAULT_CHUNK_TOKENS,
                },
            )
            ingestion.pop("_raw_text", None)
            result.ingestion = ingestion

            raw_chunks = ingestion.get("chunks") or []
            chunks: List[Dict[str, Any]] = []
            for chunk in raw_chunks:
                if not isinstance(chunk, dict):
                    continue
                body = (chunk.get("text") or "").strip()
                skip_reasons = chunk.get("do_not_embed_reasons") or []
                if not body or skip_reasons:
                    continue
                chunks.append(chunk)
            result.chunks = chunks

            # --- Stage 4: NER + validation ---
            ner_results: List[Dict[str, Any]] = []
            if self.run_ner and not skip_ner:
                for chunk in chunks[: self.max_ner_chunks]:
                    chunk_id = chunk.get(
                        "chunk_id") or f"c{len(ner_results)+1:02d}"
                    heading = chunk.get("heading_path") or ""
                    context = " | ".join(x for x in [provenance, heading] if x)
                    entry: Dict[str, Any] = {"chunk_id": chunk_id}

                    try:
                        result.prompts_used.append("disclosure.ner")
                        ner = self._run_registry_prompt(
                            "disclosure.ner",
                            {
                                "source_text": chunk.get("text") or "",
                                "context_hint": context,
                            },
                        )
                        ner.pop("_raw_text", None)
                        entry["ner"] = ner
                    except Exception as exc:
                        entry["ner_error"] = str(exc)
                        result.errors.append(f"ner:{chunk_id}:{exc}")

                    if self.run_validation and "ner" in entry:
                        try:
                            result.prompts_used.append("validation")
                            qa = self._run_registry_prompt(
                                "validation",
                                {
                                    "target": json.dumps(entry["ner"], ensure_ascii=False),
                                    "source_excerpt": (chunk.get("text") or "")[:2000],
                                    "schema_name": "entity",
                                },
                            )
                            qa.pop("_raw_text", None)
                            entry["validation"] = qa
                        except Exception as exc:
                            entry["validation_error"] = str(exc)
                            result.errors.append(
                                f"validation:{chunk_id}:{exc}")

                    ner_results.append(entry)

            result.ner_results = ner_results

            # --- Stage 5: embeddable Evidence texts ---
            blocked_ids = {
                e["chunk_id"]
                for e in ner_results
                if isinstance(e.get("validation"), dict)
                and e["validation"].get("safe_for_rag_index") is False
            }
            embeddable = []
            for chunk in chunks:
                cid = chunk.get("chunk_id")
                if cid in blocked_ids:
                    continue
                embeddable.append(chunk.get("text") or "")
            result.embeddable_texts = [t for t in embeddable if t.strip()]

            # Fallback: if model returned no chunks, keep whole doc as one Evidence unit
            if not result.embeddable_texts and recommendation != "reject":
                result.embeddable_texts = [text]
                result.errors.append(
                    "ingestion_produced_no_chunks; fell_back_to_full_text")

            index_recs = (ingestion.get("index_recommendations") or {}) if isinstance(
                ingestion, dict
            ) else {}
            result.metadata.update(
                {
                    "content_type": content_type,
                    "ingestion_recommendation": recommendation,
                    "priority": index_recs.get("priority"),
                    "chunk_count": len(result.chunks),
                    "embeddable_count": len(result.embeddable_texts),
                    "ner_chunk_count": len(result.ner_results),
                    "prompts_used": sorted(set(result.prompts_used)),
                    # Enrichment provenance. A caller grading this run needs to
                    # know not just that JSON came back but under what
                    # guarantee: which tiers served it, whether any prompt fell
                    # back to unenforced output, and whether any needed a
                    # parse-repair round trip.
                    "tiers_used": list(self.tiers_used),
                    "degraded": self.degraded,
                    "schema_unenforced_prompts": sorted(set(self.unenforced_prompts)),
                    "repaired_prompts": sorted(set(self.repaired_prompts)),
                }
            )
            return result

        except Exception as exc:
            logger.exception("RAG prompt pipeline failed")
            result.status = "error"
            result.errors.append(str(exc))
            return result


def process_document_for_rag(
    source_text: str,
    *,
    provenance: str = "",
    filename_hint: str = "",
    content_type_override: Optional[str] = None,
    skip_ner: bool = False,
    **pipeline_kwargs: Any,
) -> Dict[str, Any]:
    """Convenience entry point returning a plain dict."""
    pipeline = RagPromptPipeline(**pipeline_kwargs)
    return pipeline.process(
        source_text,
        provenance=provenance,
        filename_hint=filename_hint,
        content_type_override=content_type_override,
        skip_ner=skip_ner,
    ).to_dict()


def load_pipeline_prompts_smoke() -> Dict[str, Any]:
    """Load registry prompts without calling an LLM (CI / wiring check)."""
    ids = [
        "document_classification",
        "disclosure.content_analysis",
        "rag_ingestion",
        "disclosure.ner",
        "validation",
        "rag_grounded_answer",
    ]
    loaded = {}
    for prompt_id in ids:
        payload = get_prompt_with_schema(
            prompt_id, {"source_text": "smoke", "query": "q", "passages": "p"})
        loaded[prompt_id] = {
            "version": payload.get("version"),
            "prompt_chars": len(payload.get("prompt") or ""),
            "has_schema": payload.get("schema") is not None,
        }
    return loaded
