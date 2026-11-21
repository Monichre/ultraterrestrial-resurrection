"""T-075 prompt contract consumers (no LLM calls, no database).

ner.v1.yaml 4.0.0 / validation.yaml 2.0.0 changed three things the pipeline has
to honour: validation sees the full chunk plus provenance, span_quote is checked
verbatim by code, and record_decision survives into entity resolution where it
gates auto-writes.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from lib.entity_resolution import mentions, store  # noqa: E402
from processing.rag_prompt_pipeline import RagPromptPipeline, check_span_quotes  # noqa: E402


# ---------------------------------------------------------------------------
# check_span_quotes
# ---------------------------------------------------------------------------

CHUNK = ">> GRUSCH: I was briefed on the Roswell crash\nin 1947 by a colleague."


def test_span_check_accepts_exact_and_whitespace_only_differences():
    ner = {"entities": [
        {"name": "Roswell crash", "span_quote": "the Roswell crash in 1947"},
        {"name": "David Grusch", "span_quote": "GRUSCH: I was briefed"},
    ]}
    out = check_span_quotes(ner, CHUNK)
    assert out["checked"] == 2 and out["verbatim"] == 2
    assert out["not_verbatim"] == [] and out["missing_quote"] == []


def test_span_check_rejects_recased_paraphrased_and_missing_quotes():
    ner = {
        "entities": [
            {"name": "Roswell", "span_quote": "the roswell crash"},      # re-cased
            {"name": "Colleague", "span_quote": "told by a colleague"},  # paraphrase
            {"name": "Grusch", "span_quote": "   "},                     # blank
            {"name": "Nobody"},                                          # absent
        ],
        "statements": [
            {"statement": "Grusch was briefed", "speaker": "David Grusch",
             "about": ["Roswell"], "span_quote": "I was briefed on the Roswell crash"},
            {"statement": "invented", "speaker": None, "about": [],
             "span_quote": "the craft was recovered intact"},
        ],
    }
    out = check_span_quotes(ner, CHUNK)
    assert out["checked"] == 4 and out["verbatim"] == 1
    assert {i["item"] for i in out["not_verbatim"]} == {"Roswell", "Colleague", "invented"}
    assert {i["item"] for i in out["missing_quote"]} == {"Grusch", "Nobody"}


def test_span_check_tolerates_non_dict_ner():
    assert check_span_quotes(None, CHUNK)["checked"] == 0


# ---------------------------------------------------------------------------
# pipeline wiring: validation inputs and span_check
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


def _respond(prompt_id, params):
    if prompt_id == "document_classification":
        return {"content_type": "media"}
    if prompt_id == "rag_ingestion":
        return {"document": {}, "chunks": [],
                "index_recommendations": {"filters": [], "dedupe_keys": []}}
    if prompt_id == "disclosure.ner":
        first_words = " ".join(params["source_text"].split()[:4])
        return {"entities": [
            {"type": "PERSONNEL", "name": "Speaker", "span_quote": first_words,
             "record_decision": "context_only"},
            {"type": "EVENT", "name": "Made up", "span_quote": "not in the chunk at all",
             "record_decision": "record_candidate"},
        ], "statements": []}
    if prompt_id == "validation":
        return {"verdict": "pass", "issues": [], "safe_for_rag_index": True}
    return {}


SOURCE = "\n".join(
    f">> SPEAKER{i}: " + ("word " * 450).strip() + "." for i in range(10))
PROVENANCE = "Title: Test episode | URL: https://youtu.be/AAAAAAAAAAA"


def test_validation_gets_full_chunk_and_provenance():
    p = _pipeline(_respond)
    result = p.process(SOURCE, provenance=PROVENANCE)

    chunks = {c["chunk_id"]: c["text"] for c in result.chunks}
    validation_calls = [params for pid, params in p.calls if pid == "validation"]
    assert validation_calls, "validation never ran"
    long_chunks = 0
    for (pid, params), entry in zip(
            [c for c in p.calls if c[0] == "validation"], result.ner_results):
        assert set(params) >= {"target", "source_text", "provenance"}
        assert "source_excerpt" not in params
        assert params["provenance"] == PROVENANCE
        assert params["source_text"] == chunks[entry["chunk_id"]]
        long_chunks += len(params["source_text"]) > 2000
    assert long_chunks, "fixture never produced a chunk past the old 2,000-char cut"

    classification = dict(p.calls)["document_classification"]
    assert classification["provenance"] == PROVENANCE


def test_span_check_is_attached_to_each_ner_result_and_review():
    p = _pipeline(_respond)
    result = p.process(SOURCE, provenance=PROVENANCE)
    for entry in result.ner_results:
        check = entry["span_check"]
        assert check["checked"] == 2 and check["verbatim"] == 1
        assert check["not_verbatim"] == [{"kind": "entity", "item": "Made up"}]
    reviewed = [c for c in result.chunks if "review" in c]
    assert reviewed and all(c["review"]["span_check"]["verbatim"] == 1 for c in reviewed)
    assert all("safe_for_db_write" not in c["review"] for c in reviewed)


# ---------------------------------------------------------------------------
# entity resolution: record_decision persists and gates auto-writes
# ---------------------------------------------------------------------------

def _pipeline_file(tmp_path):
    doc = {
        "chunks": [{"chunk_id": "c01", "text": "Bigelow funded NIDS. UAP retrieval programs were described by Grusch."}],
        "ner_results": [{"chunk_id": "c01", "validation": {"verdict": "pass"}, "ner": {"entities": [
            {"type": "PERSONNEL", "name": "Bob Bigelow", "span_quote": "Bigelow funded NIDS",
             "record_decision": "record_candidate", "record_decision_note": "named key figure"},
            {"type": "EVIDENCE", "record_type_hint": "Topic",
             "name": "UAP retrieval programs described by Grusch",
             "span_quote": "UAP retrieval programs were described by Grusch",
             "record_decision": "context_only"},
            {"type": "ORGANIZATION", "name": "NIDS", "span_quote": "NIDS",
             "record_decision": "credibility_9"},
            {"type": "EVIDENCE", "record_type_hint": "Sighting", "name": "A sighting",
             "span_quote": "Bigelow", "record_decision": "needs_review"},
        ]}}],
    }
    p = tmp_path / "chunked" / "episode_rag_pipeline.json"
    p.parent.mkdir()
    p.write_text(json.dumps(doc))
    return p


def test_record_decision_and_hint_survive_into_mention_metadata(tmp_path):
    found = {m.entity_name: m for m in mentions.extract_mentions(_pipeline_file(tmp_path), tmp_path)}
    bigelow = found["Bob Bigelow"]
    assert bigelow.record_decision == "record_candidate"
    assert bigelow.metadata()["record_decision"] == "record_candidate"
    assert bigelow.metadata()["record_decision_note"] == "named key figure"

    topic = found["UAP retrieval programs described by Grusch"]
    assert topic.entity_type == "TOPIC" and topic.table == "topics"
    assert topic.metadata()["record_type_hint"] == "Topic"

    assert found["NIDS"].record_decision is None  # unknown value is not trusted
    assert found["A sighting"].entity_type == "EVIDENCE" and found["A sighting"].table is None


def _cands(*scores):
    return [{"entity_id": f"e{i}", "label": "x", "score": s} for i, s in enumerate(scores)]


def test_auto_outcome_sends_non_candidates_to_review():
    for decision in ("context_only", "needs_review"):
        status, note = store._auto_outcome("auto", "pass", True, [], decision)
        assert status is None and decision in note
        status, _ = store._auto_outcome("auto", "pass", True, _cands(0.99), decision)
        assert status is None


def test_auto_outcome_keeps_existing_gate_for_candidates_and_legacy_rows():
    assert store._auto_outcome("auto", "pass", True, [], "record_candidate")[0] == "new"
    assert store._auto_outcome("auto", "pass", True, [], None)[0] == "new"
    assert store._auto_outcome("auto", "pass", True, _cands(0.99), "record_candidate")[0] == "matched"
    assert store._auto_outcome("staging", "pass", True, [], "record_candidate")[0] is None
