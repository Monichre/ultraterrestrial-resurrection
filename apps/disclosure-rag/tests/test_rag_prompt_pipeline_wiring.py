"""Smoke tests for RAG prompt pipeline wiring (no LLM calls)."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def test_prompt_loader_resolves_ai_prompts():
    from lib.prompt_loader import PROMPTS_DIR, get_prompt, list_registered_prompts

    assert PROMPTS_DIR.name == "prompts"
    assert "ai" in PROMPTS_DIR.parts
    assert (PROMPTS_DIR / "registry.yaml").exists()

    ids = {p["id"] for p in list_registered_prompts()}
    for required in (
        "disclosure.ner",
        "disclosure.content_analysis",
        "document_classification",
        "rag_ingestion",
        "rag_grounded_answer",
        "validation",
    ):
        assert required in ids, f"missing registry id: {required}"

    ner = get_prompt("disclosure.ner", {
                     "context_hint": "wiring-test", "source_text": "x"})
    assert "Named Entity" in ner or "ENTITY" in ner or "Key Figure" in ner
    assert "wiring-test" in ner or "Optional context" in ner


def test_load_pipeline_prompts_smoke():
    from processing.rag_prompt_pipeline import load_pipeline_prompts_smoke

    loaded = load_pipeline_prompts_smoke()
    assert len(loaded) >= 5
    for prompt_id, meta in loaded.items():
        assert meta["prompt_chars"] > 50, prompt_id
        assert meta["version"]


def test_content_analysis_engine_exposes_process_for_rag():
    from processing.content_analysis import ContentAnalysisEngine

    assert hasattr(ContentAnalysisEngine, "process_for_rag")
    assert hasattr(ContentAnalysisEngine, "analyze_content_with_rag_pipeline")
