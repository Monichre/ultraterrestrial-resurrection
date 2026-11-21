"""RAG index stage: the validation reviewer advises, it does not gate.

User ruling, October 8th, 2026: safe_for_rag_index=false no longer drops a
chunk. Every chunk is embeddable and carries the reviewer verdict as a
"review" note. Chunks the labelling call marked do_not_embed (sponsor reads)
stay excluded, and if that excludes all of them the run holds instead of
falling back to the full source text. Chunk text comes from code (cut_chunks),
so these tests pin the cut to a fixed list.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest  # noqa: E402

import processing.rag_prompt_pipeline as rpp  # noqa: E402
from processing.rag_prompt_pipeline import RagPromptPipeline  # noqa: E402

SOURCE = "Full source text that validation said must not be indexed."


def _pipeline(responses):
    """A pipeline with no LLM: each registry prompt returns a canned dict."""
    p = RagPromptPipeline.__new__(RagPromptPipeline)
    p.run_ner = True
    p.run_validation = True
    p.max_ner_chunks = 10
    p.tiers_used = []
    p.degraded = False
    p.unenforced_prompts = []
    p.repaired_prompts = []
    p.repair_attempted_prompts = []
    p._run_registry_prompt = lambda prompt_id, params, **kw: dict(
        responses[prompt_id])
    return p


def _responses(labels, safe):
    return {
        "document_classification": {"ingestion_recommendation": "proceed",
                                    "content_type": "article"},
        "disclosure.content_analysis": {},
        "rag_ingestion": {"chunks": labels},
        "disclosure.ner": {"entities": []},
        "validation": {"safe_for_rag_index": safe},
    }


CHUNKS = [{"chunk_id": "c01", "text": "first chunk"},
          {"chunk_id": "c02", "text": "second chunk"}]


@pytest.fixture
def cut(monkeypatch):
    """Pin what code cuts; returns a setter so a test can change it."""
    def set_chunks(chunks):
        monkeypatch.setattr(rpp, "cut_chunks", lambda text: [dict(c) for c in chunks])
    set_chunks(CHUNKS)
    return set_chunks


def test_flagged_chunks_stay_embeddable_with_review_notes(cut):
    result = _pipeline(_responses([], safe=False)).process(SOURCE)
    assert result.embeddable_texts == ["first chunk", "second chunk"]
    assert result.status == "ok"
    assert [c["review"]["safe_for_rag_index"] for c in result.chunks] == [False, False]
    assert result.metadata["review_flagged_chunk_ids"] == ["c01", "c02"]


def test_all_do_not_embed_chunks_hold_without_full_text_fallback(cut):
    cut([{"chunk_id": "c01", "text": "sponsor read"}])
    ads = [{"chunk_id": "c01",
            "do_not_embed_reasons": ["advertisement / sponsor read"]}]
    result = _pipeline(_responses(ads, safe=True)).process(SOURCE)
    assert result.embeddable_texts == []
    assert result.status == "hold"
    assert any("all_chunks_excluded" in e for e in result.errors)


def test_zero_chunks_still_falls_back_to_full_text(cut):
    cut([])
    result = _pipeline(_responses([], safe=True)).process(SOURCE)
    assert result.embeddable_texts == [SOURCE]
    assert result.status == "ok"


def test_safe_chunks_are_embeddable(cut):
    result = _pipeline(_responses([], safe=True)).process(SOURCE)
    assert result.embeddable_texts == ["first chunk", "second chunk"]
    assert result.status == "ok"


def test_partial_flag_keeps_all_chunks_and_notes_the_flagged_one(cut):
    responses = _responses([], safe=True)
    p = _pipeline(responses)
    calls = {"n": 0}

    def fake(prompt_id, params, **kw):
        if prompt_id == "validation":
            calls["n"] += 1
            return {"safe_for_rag_index": calls["n"] != 1}  # block c01 only
        return dict(responses[prompt_id])

    p._run_registry_prompt = fake
    result = p.process(SOURCE)
    assert result.embeddable_texts == ["first chunk", "second chunk"]
    assert result.status == "ok"
    assert result.metadata["review_flagged_chunk_ids"] == ["c01"]
    assert result.chunks[1]["review"]["safe_for_rag_index"] is True


# ---------------------------------------------------------------------------
# --upload must not index a document the RAG gate did not pass (local files)
# ---------------------------------------------------------------------------

import pytest  # noqa: E402
from unittest.mock import MagicMock  # noqa: E402


@pytest.mark.parametrize("rag_status,uploaded", [
    ("hold", False), ("rejected", False), ("error", False), ("ok", True),
])
def test_process_file_upload_gated_on_rag_status(
        monkeypatch, tmp_path, rag_status, uploaded):
    import main

    monkeypatch.setattr(main, "_deps_loaded", True)
    monkeypatch.setattr(main, "display", MagicMock())
    monkeypatch.setattr(main, "ContentAnalysisEngine", MagicMock(
        return_value=MagicMock(process_for_rag=MagicMock(return_value={
            "status": rag_status,
            "embeddable_texts": ["chunk"] if rag_status == "ok" else [],
            "metadata": {},
        }))))
    upload = MagicMock(return_value={"status": "uploaded_and_indexed"})
    monkeypatch.setattr(main, "upload_file_to_openai", upload)

    src = tmp_path / "note.txt"
    src.write_text("some research content", encoding="utf-8")
    result = main.process_file(str(src), upload=True, add_to_kb=False)

    assert upload.called is uploaded
    stage = {s["name"]: s for s in result["stage_report"]}[
        "OpenAI vector store upload"]
    assert stage["status"] == ("success" if uploaded else "skipped")
