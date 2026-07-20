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

from lib.prompt_loader import get_prompt, get_prompt_with_schema

load_dotenv()

logger = logging.getLogger(__name__)

MAX_NER_CHUNKS = int(os.getenv("RAG_PIPELINE_MAX_NER_CHUNKS", "8"))
MAX_SOURCE_CHARS = int(os.getenv("RAG_PIPELINE_MAX_SOURCE_CHARS", "24000"))
DEFAULT_CHUNK_TOKENS = os.getenv("RAG_PIPELINE_CHUNK_TOKENS", "512")


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
        self._openai = None
        self._anthropic = None
        self._init_clients()

    def _init_clients(self) -> None:
        openai_key = os.environ.get("OPENAI_API_KEY")
        anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
        if openai_key:
            try:
                from openai import OpenAI

                self._openai = OpenAI(api_key=openai_key)
            except Exception as exc:  # pragma: no cover
                logger.warning("OpenAI client unavailable: %s", exc)
        if anthropic_key:
            try:
                from anthropic import Anthropic

                self._anthropic = Anthropic(api_key=anthropic_key)
            except Exception as exc:  # pragma: no cover
                logger.warning("Anthropic client unavailable: %s", exc)

    def _truncate(self, text: str) -> str:
        if len(text) <= MAX_SOURCE_CHARS:
            return text
        return text[:MAX_SOURCE_CHARS] + "\n\n[TRUNCATED_FOR_PIPELINE]"

    def _call_llm(
        self,
        system_prompt: str,
        user_content: str,
        *,
        temperature: float = 0.1,
        max_tokens: int = 1200,
    ) -> str:
        providers = []
        if self.prefer_provider == "openai":
            providers = ["openai", "anthropic"]
        elif self.prefer_provider == "anthropic":
            providers = ["anthropic", "openai"]
        else:
            # Prefer Anthropic for structured extraction when available (matches ContentAnalysisEngine)
            providers = ["anthropic", "openai"]

        last_error: Optional[Exception] = None
        for provider in providers:
            try:
                if provider == "anthropic" and self._anthropic:
                    message = self._anthropic.messages.create(
                        model=os.getenv(
                            "RAG_PIPELINE_ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022"),
                        max_tokens=max_tokens,
                        temperature=temperature,
                        system=system_prompt,
                        messages=[{"role": "user", "content": user_content}],
                    )
                    return message.content[0].text
                if provider == "openai" and self._openai:
                    response = self._openai.chat.completions.create(
                        model=os.getenv(
                            "RAG_PIPELINE_OPENAI_MODEL", "gpt-4o-mini"),
                        temperature=temperature,
                        max_tokens=max_tokens,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_content},
                        ],
                    )
                    return response.choices[0].message.content or ""
            except Exception as exc:
                last_error = exc
                logger.warning("LLM provider %s failed: %s", provider, exc)

        if last_error:
            raise RuntimeError(
                f"All LLM providers failed: {last_error}") from last_error
        raise RuntimeError(
            "No LLM provider available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY."
        )

    def _run_prompt_json(
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

        user_content = user_fallback or (
            "Return valid JSON only, conforming to the instructions and schema."
        )
        raw = self._call_llm(
            system_prompt,
            user_content,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        parsed = _extract_json_payload(raw)
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
            classification = self._run_prompt_json(
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
            analysis = self._run_prompt_json(
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
            ingestion = self._run_prompt_json(
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
                        ner = self._run_prompt_json(
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
                            qa = self._run_prompt_json(
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
