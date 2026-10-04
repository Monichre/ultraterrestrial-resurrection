"""The enrichment gate must bite — a hollow run has to fail loudly.

On 2026-08-09 a live `dy <youtube-url>` run produced rich analysis, zero
chunks, zero NER results and zero embeddable texts, then exited 0 and printed
"🎉 PROCESSING COMPLETE!". Three separate status fields each reported a version
of success. Nothing tested the failure path, which is exactly why it stayed
invisible.

These tests exercise that path directly: the parse failure, the grading, and
the exit code.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


# -- grading ---------------------------------------------------------------

def test_failed_pipeline_is_graded_as_error():
    from lib.enrichment_status import OK_STATUSES, enrichment_outcome

    # The literal shape the 2026-08-09 run wrote.
    result = {
        "rag_pipeline": {
            "status": "error",
            "errors": ["Expecting ',' delimiter: line 69 column 6 (char 8455)"],
        }
    }
    status, detail = enrichment_outcome(result)
    assert status == "error"
    assert status not in OK_STATUSES
    assert "char 8455" in detail


def test_absent_status_is_unknown_not_success():
    """Absence read as success is the original defect."""
    from lib.enrichment_status import OK_STATUSES, enrichment_outcome

    status, _ = enrichment_outcome({"title": "some doc", "content": "..."})
    assert status == "unknown"
    assert status not in OK_STATUSES


def test_youtube_shaped_result_is_graded():
    """The YouTube path files status under metadata as well as top level."""
    from lib.enrichment_status import enrichment_outcome

    assert enrichment_outcome(
        {"metadata": {"rag_pipeline": {"status": "ok", "errors": []}}})[0] == "ok"


# -- the gate emits a failed stage -----------------------------------------

def test_process_url_emits_failed_stage_on_hollow_enrichment():
    """A URL run whose pipeline errored must produce a `failed` stage.

    main() exits 1 on any failed stage, so this is the whole exit-code fix.
    """
    import main

    hollow = {
        "title": "Some Video",
        "source": "https://youtu.be/q0N33jb7Bhk",
        "doc_id": None,
        "rag_pipeline": {
            "status": "error",
            "errors": ["Expecting ',' delimiter: line 69 column 6 (char 8455)"],
        },
        "embeddable_texts": [],
    }

    with patch.object(main, "_import_heavy_dependencies", lambda: None), \
            patch.object(main, "process_youtube_url_enhanced", lambda *a, **k: hollow):
        result = main.process_url("https://youtu.be/q0N33jb7Bhk", add_to_kb=False)

    stages = result["stage_report"]
    rag_stages = [s for s in stages if s["name"] == "RAG prompt pipeline"]
    assert rag_stages, f"no RAG stage emitted; got {[s['name'] for s in stages]}"
    assert rag_stages[0]["status"] == "failed", rag_stages[0]

    # And that stage is what makes main() exit non-zero.
    failed = [s for s in stages if s.get("status") == "failed"]
    assert failed, "a hollow run produced no failed stage — the gate does not bite"


def test_process_url_emits_success_stage_on_good_enrichment():
    """The gate must not fire on a healthy run."""
    import main

    good = {
        "title": "Some Video",
        "source": "https://youtu.be/q0N33jb7Bhk",
        "doc_id": None,
        "rag_pipeline": {"status": "ok", "errors": []},
        "embeddable_texts": ["chunk one", "chunk two"],
    }

    with patch.object(main, "_import_heavy_dependencies", lambda: None), \
            patch.object(main, "process_youtube_url_enhanced", lambda *a, **k: good):
        result = main.process_url("https://youtu.be/q0N33jb7Bhk", add_to_kb=False)

    stages = result["stage_report"]
    rag = [s for s in stages if s["name"] == "RAG prompt pipeline"][0]
    assert rag["status"] == "success", rag
    assert not [s for s in stages if s.get("status") == "failed"]


# -- the pipeline repairs malformed JSON instead of dying ------------------

def test_pipeline_retries_once_on_unparseable_json():
    """One bad comma used to be terminal. It must now cost one retry."""
    from processing.rag_prompt_pipeline import RagPromptPipeline

    good_payload = json.dumps({
        "document": {"title_guess": "t", "content_type": "youtube_video",
                     "language": "en", "provenance": "p", "integrity_flags": []},
        "chunks": [{"chunk_id": "c01", "heading_path": None, "text": "body",
                    "token_estimate": 10, "overlap_note": None,
                    "entities_hint": [], "claims_hint": [],
                    "temporal_anchors": [], "spatial_anchors": [],
                    "evidentiary_density": "high", "do_not_embed_reasons": []}],
        "index_recommendations": {"priority": "HIGH", "filters": [],
                                  "dedupe_keys": []},
    })

    calls = []

    def fake_complete(system_prompt, user_content, **kwargs):
        calls.append(user_content)
        # First call returns the malformed shape; the repair round succeeds.
        text = '{"chunks": [{"a": 1,, }]}' if len(calls) == 1 else good_payload
        return MagicMock(text=text, tier_id="test/tier", provider="test",
                         attempts=1, degraded=False, schema_enforced=True)

    with patch("processing.rag_prompt_pipeline.get_fallback") as get_fb:
        get_fb.return_value = MagicMock(
            complete=fake_complete, describe=lambda: "test/tier")
        pipeline = RagPromptPipeline()
        parsed = pipeline._run_registry_prompt("rag_ingestion", {
            "source_text": "x", "provenance": "p",
            "content_type": "youtube_video", "target_chunk_tokens": "512"})

    assert len(calls) == 2, "expected exactly one repair retry"
    assert "could not be parsed as JSON" in calls[1], \
        "the retry must feed the parser error back to the model"
    assert parsed["chunks"][0]["chunk_id"] == "c01"
    assert "rag_ingestion" in pipeline.repaired_prompts


def test_pipeline_gives_up_after_one_repair():
    """The retry is bounded — two bad responses still surface as a failure."""
    from processing.rag_prompt_pipeline import RagPromptPipeline

    def always_bad(system_prompt, user_content, **kwargs):
        return MagicMock(text='{"chunks": [{"a": 1,, }]}', tier_id="t",
                         provider="p", attempts=1, degraded=False,
                         schema_enforced=False)

    with patch("processing.rag_prompt_pipeline.get_fallback") as get_fb:
        get_fb.return_value = MagicMock(
            complete=always_bad, describe=lambda: "test/tier")
        pipeline = RagPromptPipeline()
        with pytest.raises((ValueError, json.JSONDecodeError)):
            pipeline._run_registry_prompt("rag_ingestion", {
                "source_text": "x", "provenance": "p",
                "content_type": "youtube_video", "target_chunk_tokens": "512"})
