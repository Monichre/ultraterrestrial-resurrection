"""Code-cut chunking: code owns chunk text, the rag_ingestion call only labels.

No LLM calls: the pipeline's `_run_registry_prompt` is replaced per test.
"""
import json
import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import processing.rag_prompt_pipeline as rpp  # noqa: E402
from processing.rag_prompt_pipeline import MAX_SOURCE_CHARS, RagPromptPipeline, cut_chunks  # noqa: E402


def _turns(n, size=400):
    return " ".join(f">> Speaker {i} says " + ("word " * (size // 5)) for i in range(n))


def _assert_covers(text, chunks):
    assert chunks, "expected chunks"
    assert chunks[0]["char_start"] == 0
    assert chunks[-1]["char_end"] == len(text)
    for a, b in zip(chunks, chunks[1:]):
        assert a["char_end"] == b["char_start"]
    for c in chunks:
        assert c["text"] == text[c["char_start"]:c["char_end"]].strip()


def test_spans_are_contiguous_and_cover_the_input():
    text = _turns(30)
    _assert_covers(text, cut_chunks(text))


def test_chunks_start_at_turn_boundaries_and_pack_to_target():
    text = _turns(30)
    chunks = cut_chunks(text, target_chars=1500, max_chars=2400)
    assert len(chunks) > 1
    assert all(c["text"].startswith(">>") for c in chunks)
    assert all(len(c["text"]) <= 1500 for c in chunks)
    # Packing, not one chunk per turn: the first chunk holds several turns.
    assert chunks[0]["text"].count(">>") >= 3


def test_short_window_is_one_chunk():
    text = ">> hello there. >> general kenobi."
    chunks = cut_chunks(text)
    assert [c["chunk_id"] for c in chunks] == ["c01"]
    assert chunks[0]["text"] == text


def test_oversize_turn_splits_at_sentence_ends_within_max():
    sentence = "This is a sentence about a light in the sky. "
    text = ">> " + sentence * 120  # one turn, ~5.4k chars
    chunks = cut_chunks(text, target_chars=1500, max_chars=2400)
    _assert_covers(text, chunks)
    assert len(chunks) >= 3
    assert all(len(c["text"]) <= 2400 for c in chunks)
    assert all(c["text"].endswith(".") for c in chunks)


def test_sentence_over_max_is_hard_split_at_whitespace():
    text = ">> " + "alpha " * 1000  # no sentence end at all, ~6k chars
    chunks = cut_chunks(text, target_chars=1500, max_chars=2400)
    _assert_covers(text, chunks)
    assert all(len(c["text"]) <= 2400 for c in chunks)
    # Cuts land on whitespace, never inside a word.
    assert all(c["text"].split()[-1] == "alpha" for c in chunks)


def test_text_without_markers_uses_sentence_packing():
    text = "A plain document sentence. " * 300
    chunks = cut_chunks(text, target_chars=1500, max_chars=2400)
    _assert_covers(text, chunks)
    assert len(chunks) > 1
    assert all(len(c["text"]) <= 1500 for c in chunks)
    assert all(c["text"].endswith(".") for c in chunks)


def test_chunk_ids_past_99():
    text = _turns(150, size=400)
    chunks = cut_chunks(text, target_chars=300, max_chars=2400)
    assert len(chunks) > 99
    assert chunks[0]["chunk_id"] == "c01"
    assert chunks[98]["chunk_id"] == "c99"
    assert chunks[99]["chunk_id"] == "c100"


def test_whitespace_only_spans_are_dropped():
    text = ">> a" + " " * 5000 + ">> b"
    chunks = cut_chunks(text, target_chars=1500, max_chars=2400)
    assert len(chunks) == 2
    assert " ".join(c["text"] for c in chunks) == ">> a >> b"
    assert [c["chunk_id"] for c in chunks] == ["c01", "c02"]


def test_empty_input_gives_no_chunks():
    assert cut_chunks("") == []


# ---------------------------------------------------------------------------
# pipeline
# ---------------------------------------------------------------------------

def _pipeline(responder):
    p = RagPromptPipeline.__new__(RagPromptPipeline)
    p.run_ner = True
    p.run_validation = True
    p.max_ner_chunks = 10
    p.tiers_used = []
    p.degraded = False
    p.unenforced_prompts = []
    p.repaired_prompts = []
    p.repair_attempted_prompts = []
    p.calls = []

    def fake(prompt_id, params, **kw):
        p.calls.append((prompt_id, params))
        return responder(prompt_id, params)

    p._run_registry_prompt = fake
    return p


def _responder(labels=None, label_exc=None, safe=True):
    def respond(prompt_id, params):
        if prompt_id == "document_classification":
            return {"ingestion_recommendation": "proceed", "content_type": "article"}
        if prompt_id == "rag_ingestion":
            if label_exc:
                raise label_exc
            return {"document": {}, "chunks": labels or [],
                    "index_recommendations": {"filters": [], "dedupe_keys": []},
                    "_raw_text": "x"}
        if prompt_id == "validation":
            return {"safe_for_rag_index": safe}
        return {}
    return respond


SOURCE = _turns(8, size=600)


def test_labels_merge_by_id_and_text_comes_from_code():
    labels = [
        {"chunk_id": "c01", "heading_path": "Opening", "entities_hint": ["Grusch"],
         "claims_hint": ["a claim"], "temporal_anchors": [], "spatial_anchors": [],
         "do_not_embed_reasons": [], "text": "MODEL REWROTE THIS"},
        {"chunk_id": "c99", "heading_path": "ghost", "do_not_embed_reasons": []},
    ]
    p = _pipeline(_responder(labels))
    result = p.process(SOURCE)

    expected = cut_chunks(SOURCE.strip()[:MAX_SOURCE_CHARS])
    assert [c["text"] for c in result.chunks] == [c["text"] for c in expected]
    first = result.chunks[0]
    assert first["heading_path"] == "Opening"
    assert first["entities_hint"] == ["Grusch"]
    assert first["char_start"] == 0 and "char_end" in first
    assert "heading_path" not in result.chunks[-1]  # unlabelled chunk kept, no hints
    assert all(c["chunk_id"] != "c99" for c in result.chunks)
    assert result.status == "ok"
    assert result.embeddable_texts == [c["text"] for c in expected]


def test_labelling_call_gets_code_chunks_as_compact_json_without_marker():
    long_source = SOURCE * 10  # well past MAX_SOURCE_CHARS
    assert len(long_source) > MAX_SOURCE_CHARS
    p = _pipeline(_responder())
    result = p.process(long_source)

    params = dict(p.calls)["rag_ingestion"]
    assert set(params) == {"chunks_json", "provenance", "content_type"}
    sent = json.loads(params["chunks_json"])
    assert set(sent[0]) == {"chunk_id", "text"}
    assert ", " not in params["chunks_json"][:20]  # compact separators
    assert "[TRUNCATED_FOR_PIPELINE]" not in params["chunks_json"]
    # Classification still sees the marked text.
    classify = dict(p.calls)["document_classification"]
    assert "[TRUNCATED_FOR_PIPELINE]" in classify["source_text"]

    md = result.metadata
    assert md["chunking"] == "code_cut"
    assert md["window_chars"] == MAX_SOURCE_CHARS
    assert md["code_chunk_count"] == len(sent)
    assert md["chunked_chars"] == sum(len(c["text"]) for c in sent)
    assert "priority" not in md


def test_label_failure_is_tolerated():
    p = _pipeline(_responder(label_exc=RuntimeError("boom")))
    result = p.process(SOURCE)
    assert result.status == "ok"
    assert any(e == "rag_ingestion_labels:boom" for e in result.errors)
    assert result.embeddable_texts == [c["text"] for c in cut_chunks(SOURCE.strip())]


def test_do_not_embed_chunk_is_excluded():
    labels = [{"chunk_id": "c01", "do_not_embed_reasons": ["sponsor read"]}]
    result = _pipeline(_responder(labels)).process(SOURCE)
    ids = [c["chunk_id"] for c in result.chunks]
    assert "c01" not in ids and ids
    assert result.status == "ok"


def test_all_excluded_holds_without_full_text_fallback():
    n = len(cut_chunks(SOURCE.strip()))
    labels = [{"chunk_id": f"c{i:02d}", "do_not_embed_reasons": ["ad"]}
              for i in range(1, n + 1)]
    result = _pipeline(_responder(labels)).process(SOURCE)
    assert result.status == "hold"
    assert result.embeddable_texts == []
    assert any("all_chunks_excluded" in e for e in result.errors)


def test_zero_code_chunks_falls_back_to_full_text(monkeypatch):
    monkeypatch.setattr(rpp, "cut_chunks", lambda text: [])
    result = _pipeline(_responder()).process(SOURCE)
    assert result.embeddable_texts == [SOURCE.strip()]
    assert any("fell_back_to_full_text" in e for e in result.errors)


def test_missing_chunk_id_is_synthesized_and_written_back_for_review(monkeypatch):
    monkeypatch.setattr(rpp, "cut_chunks", lambda text: [{"text": "no id here"}])
    result = _pipeline(_responder(safe=False)).process(SOURCE)
    chunk = result.chunks[0]
    assert chunk["chunk_id"] == "c01"
    assert chunk["review"]["safe_for_rag_index"] is False
    assert result.metadata["review_flagged_chunk_ids"] == ["c01"]
