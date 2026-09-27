"""Tests for lib.entity_resolution.

Pure extraction tests always run. Database tests run the real
003_entity_resolution.sql migration against a throwaway LOCAL Postgres database
(createdb/dropdb) and skip when no local server or extension is available.
The shared Neon database is never touched.
"""
import json
import shutil
import subprocess
import sys
import uuid
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from lib.entity_resolution import mentions, store  # noqa: E402

MIGRATION = Path(__file__).resolve().parents[3] / "packages/db/migrations/003_entity_resolution.sql"


def _pipeline(tmp_path: Path) -> Path:
    doc = {
        "analysis": {"extracted_data": {"metadata": {"source_url": "https://www.youtube.com/watch?v=q0N33jb7Bhk"}}},
        "ner_results": [
            {"chunk_id": "c01", "validation": {"verdict": "pass"}, "ner": {"entities": [
                {"type": "PERSONNEL", "name": "Bob Bigelow", "span_quote": "Bigelow funded NIDS", "aliases": ["Bigelow"]},
                {"type": "PERSONNEL", "name": "Jacques Vallée", "span_quote": "Vallée said"},
                {"type": "EVIDENCE", "name": "1997 memo", "span_quote": "the memo"},
            ]}},
            {"chunk_id": "c02", "validation": {"verdict": "fail"}, "ner": {"entities": [
                {"type": "PERSONNEL", "name": "Should Not Load"},
            ]}},
            {"chunk_id": "c03", "validation": {"verdict": "pass_with_warnings"}, "ner": {"entities": [
                {"type": "PERSONNEL", "name": "bob bigelow", "span_quote": "Bob again"},
                {"type": "ORGANIZATION", "name": "Brand New Org"},
            ]}},
        ],
    }
    p = tmp_path / "q0N33jb7Bhk" / "episode_rag_pipeline.json"
    p.parent.mkdir()
    p.write_text(json.dumps(doc))
    return p


# ---------------------------------------------------------------------------
# pure
# ---------------------------------------------------------------------------

def test_extract_skips_failed_chunks_by_default(tmp_path):
    found = list(mentions.extract_mentions(_pipeline(tmp_path), tmp_path))
    names = [m.entity_name for m in found]
    assert "Should Not Load" not in names
    assert len(found) == 5


def test_extract_include_failed(tmp_path):
    verdicts = mentions.DEFAULT_VERDICTS | {"fail"}
    found = list(mentions.extract_mentions(_pipeline(tmp_path), tmp_path, frozenset(verdicts)))
    assert len(found) == 6


def test_mention_fields(tmp_path):
    m = next(mentions.extract_mentions(_pipeline(tmp_path), tmp_path))
    assert m.table == "key_figures"
    assert m.chunk_index == 1
    assert m.video_id == "q0N33jb7Bhk"
    assert m.kb_path == "q0N33jb7Bhk/episode_rag_pipeline.json"
    assert m.metadata()["ner_aliases"] == ["Bigelow"]


def test_mention_keys_are_stable_and_distinct(tmp_path):
    p = _pipeline(tmp_path)
    a = [m.mention_key for m in mentions.extract_mentions(p, tmp_path)]
    b = [m.mention_key for m in mentions.extract_mentions(p, tmp_path)]
    assert a == b
    assert len(set(a)) == len(a)


def test_evidence_has_no_table():
    assert mentions.TYPE_TO_TABLE["EVIDENCE"] is None


# ---------------------------------------------------------------------------
# grounding (deterministic, no model)
# ---------------------------------------------------------------------------

def test_grounding_detects_a_quote_that_is_not_in_the_chunk():
    chunk = mentions._squash("Bigelow funded NIDS out of his own pocket.")
    assert mentions.grounding_of("Bigelow funded NIDS", "Bigelow", chunk) == (True, True)
    # the Ziusudra case: a confident verbatim quote that occurs nowhere
    assert mentions.grounding_of("Ziusudra survived the flood", "Ziusudra", chunk) == (False, False)


def test_grounding_is_whitespace_and_case_insensitive():
    chunk = mentions._squash("The  PENTAGON   ran\nthe program")
    quote_grounded, _ = mentions.grounding_of("the pentagon ran the program", None, chunk)
    assert quote_grounded is True


def test_grounding_unknown_without_chunk_text():
    assert mentions.grounding_of("anything", "anything", "") == (None, None)


def test_extract_records_grounding(tmp_path):
    # _pipeline() has no `chunks` array, so grounding is unknowable, not False.
    m = next(mentions.extract_mentions(_pipeline(tmp_path), tmp_path))
    assert m.quote_grounded is None
    assert m.metadata()["quote_grounded"] is None


def _pipeline_with_chunks(tmp_path: Path) -> Path:
    doc = {
        "chunks": [{"chunk_id": "c01", "text": "Bigelow funded NIDS in 1995."}],
        "ner_results": [{"chunk_id": "c01", "validation": {"verdict": "pass"}, "ner": {"entities": [
            {"type": "PERSONNEL", "name": "Bob Bigelow", "span_quote": "Bigelow funded NIDS"},
            {"type": "PERSONNEL", "name": "Ziusudra", "span_quote": "Ziusudra built the ark"},
        ]}}],
    }
    p = tmp_path / "chunked" / "episode_rag_pipeline.json"
    p.parent.mkdir()
    p.write_text(json.dumps(doc))
    return p


def test_extract_flags_ungrounded_quote(tmp_path):
    found = list(mentions.extract_mentions(_pipeline_with_chunks(tmp_path), tmp_path))
    by_name = {m.entity_name: m for m in found}
    assert by_name["Bob Bigelow"].quote_grounded is True
    assert by_name["Ziusudra"].quote_grounded is False


# ---------------------------------------------------------------------------
# auto-write gate (pure decision function)
# ---------------------------------------------------------------------------

def _cands(*scores):
    return [{"entity_id": f"rec_{i}", "label": "x", "score": s} for i, s in enumerate(scores)]


def test_gate_is_off_unless_write_mode_is_auto():
    status, note = store._auto_outcome("staging", "pass", True, _cands(0.99))
    assert status is None and "staging" in note


def test_gate_refuses_a_failed_verdict():
    status, note = store._auto_outcome("auto", "fail", True, _cands(0.99))
    assert status is None and "fail" in note


def test_gate_refuses_an_ungrounded_quote():
    status, note = store._auto_outcome("auto", "pass", False, _cands(0.99))
    assert status is None and "span_quote" in note


def test_gate_auto_matches_a_clear_winner():
    status, _ = store._auto_outcome("auto", "pass", True, _cands(0.97, 0.40))
    assert status == "matched"


def test_gate_refuses_a_close_second():
    status, note = store._auto_outcome("auto", "pass", True, _cands(0.97, 0.93))
    assert status is None and "ambiguous" in note


def test_gate_auto_creates_only_when_nothing_cleared_the_floor():
    assert store._auto_outcome("auto", "pass", True, [])[0] == "new"


def test_gate_does_not_auto_create_a_nickname_of_an_existing_row():
    # "Bob Bigelow" vs the seeded "Robert Bigelow" measures 0.444 on the live
    # database. Auto-creating it would duplicate a person who is already there.
    status, note = store._auto_outcome("auto", "pass", True, _cands(0.444))
    assert status is None and "ambiguous" in note


def test_gate_sends_the_middle_band_to_review():
    for score in (0.31, 0.444, 0.60, 0.727):
        status, note = store._auto_outcome("auto", "pass", True, _cands(score))
        assert status is None, f"{score} should need review, got {status}"
        assert "ambiguous" in note


def test_gate_allows_unknown_grounding():
    # None means "could not check", which must not block the older 68 episodes
    # whose pipeline files carry no `chunks` array.
    assert store._auto_outcome("auto", "pass", None, [])[0] == "new"


# ---------------------------------------------------------------------------
# database (local throwaway Postgres)
# ---------------------------------------------------------------------------

STUB_SCHEMA = """
CREATE TABLE documents (id text PRIMARY KEY, title text, url text);
CREATE TABLE document_entities (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  xata_createdat timestamptz DEFAULT now(), xata_updatedat timestamptz DEFAULT now(),
  document text REFERENCES documents(id) ON DELETE CASCADE,
  entity_type text, entity_name text, confidence real, context text, metadata jsonb);
CREATE TABLE key_figures (id text PRIMARY KEY, name text);
CREATE TABLE events (id text PRIMARY KEY, name text);
CREATE TABLE organizations (id text PRIMARY KEY, name text);
CREATE TABLE topics (id text PRIMARY KEY, name text);
CREATE TABLE artifacts (id text PRIMARY KEY, name text);
CREATE TABLE locations (id text PRIMARY KEY, name text);
CREATE TABLE testimonies (id text PRIMARY KEY, title text);
INSERT INTO documents VALUES ('doc_1', 'Bigelow & Knapp', 'https://www.youtube.com/watch?v=q0N33jb7Bhk');
INSERT INTO key_figures VALUES ('rec_bigelow', 'Robert Bigelow'), ('rec_vallee', 'Jacques Vallée'),
  ('rec_lazar', 'Bob Lazar');
"""


@pytest.fixture
def db():
    psycopg = pytest.importorskip("psycopg")
    if not (shutil.which("createdb") and shutil.which("dropdb")):
        pytest.skip("local Postgres client tools not installed")
    name = f"er_pytest_{uuid.uuid4().hex[:8]}"
    if subprocess.run(["createdb", name], capture_output=True).returncode != 0:
        pytest.skip("no local Postgres server")
    try:
        with psycopg.connect(dbname=name, autocommit=True) as setup:
            try:
                setup.execute(STUB_SCHEMA)
                setup.execute(MIGRATION.read_text())
            except psycopg.Error as e:
                pytest.skip(f"local Postgres lacks migration prerequisites: {e}")
        with psycopg.connect(dbname=name) as conn:
            yield conn
    finally:
        subprocess.run(["dropdb", "--if-exists", name], capture_output=True)


def _status(conn, name):
    return conn.execute(
        "SELECT status, resolved_entity_id FROM document_entities WHERE entity_name=%s ORDER BY id",
        (name,),
    ).fetchall()


def test_load_is_idempotent_and_links_document(db, tmp_path):
    found = list(mentions.extract_mentions(_pipeline(tmp_path), tmp_path))
    first = store.load_mentions(db, found, "load-1")
    second = store.load_mentions(db, found, "load-2")
    assert first == {"inserted": 5, "already_loaded": 0}
    assert second == {"inserted": 0, "already_loaded": 5}
    docs = {r[0] for r in db.execute("SELECT document FROM document_entities").fetchall()}
    assert docs == {"doc_1"}


def test_resolve_then_review_then_apply(db, tmp_path, monkeypatch):
    # Pin the mode: a sibling test module that loads .env would otherwise make
    # this depend on ENTITY_WRITE_MODE=auto being set there.
    monkeypatch.setenv("ENTITY_WRITE_MODE", "staging")
    store.load_mentions(db, list(mentions.extract_mentions(_pipeline(tmp_path), tmp_path)), "load")
    stats = store.resolve_pending(db, "resolve")
    # Vallée: exact alias (accent-insensitive). 1997 memo: EVIDENCE -> skipped.
    # Bob Bigelow x2 and Brand New Org: no exact alias -> review.
    # Default ENTITY_WRITE_MODE is `staging`, so nothing is auto-created here.
    assert stats == {"matched": 1, "skipped": 1, "needs_review": 3, "new": 0}
    assert _status(db, "Jacques Vallée") == [("matched", "rec_vallee")]

    # Bigelow is a fuzzy candidate, not an auto-match.
    cands = store.find_candidates(db, "key_figures", "Bob Bigelow")
    assert cands[0]["entity_id"] == "rec_bigelow"

    # Operator matches one "Bob Bigelow"; the other spelling cascades via the new alias.
    first_id = db.execute(
        "SELECT id FROM document_entities WHERE entity_name='Bob Bigelow'").fetchone()[0]
    cascaded = store.decide_match(db, first_id, "rec_bigelow", "review")
    assert cascaded == 1
    assert _status(db, "bob bigelow") == [("matched", "rec_bigelow")]
    assert db.execute(
        "SELECT source FROM entity_aliases WHERE entity_id='rec_bigelow' AND alias='Bob Bigelow'"
    ).fetchone() == ("human_review",)

    org_id = db.execute(
        "SELECT id FROM document_entities WHERE entity_name='Brand New Org'").fetchone()[0]
    assert store.decide_new(db, org_id, "review") == 1

    result = store.apply_decisions(db, "apply")
    assert result["matched_applied"] == 3
    assert [c["name"] for c in result["created"]] == ["Brand New Org"]
    new_id = result["created"][0]["entity_id"]
    assert db.execute("SELECT name FROM organizations WHERE id=%s", (new_id,)).fetchone() == ("Brand New Org",)
    # Re-applying does nothing.
    again = store.apply_decisions(db, "apply-2")
    assert again == {"matched_applied": 0, "created": []}


def test_auto_mode_creates_and_matches_without_a_human(db, tmp_path, monkeypatch):
    monkeypatch.setenv("ENTITY_WRITE_MODE", "auto")
    store.load_mentions(
        db, list(mentions.extract_mentions(_pipeline_with_chunks(tmp_path), tmp_path)), "load")
    stats = store.resolve_pending(db, "resolve")

    # "Bob Bigelow" scores 0.444 against the seeded "Robert Bigelow" — a real
    # variant, so it is held for a human rather than auto-created as a duplicate.
    held = db.execute(
        "SELECT status, decision_note FROM document_entities WHERE entity_name='Bob Bigelow'"
    ).fetchone()
    assert held[0] == "needs_review"
    assert "ambiguous" in held[1]

    # "Ziusudra" quotes text that is not in the chunk -> held for review even
    # though nothing in key_figures resembles it.
    zius = db.execute(
        "SELECT status, decision_note FROM document_entities WHERE entity_name='Ziusudra'"
    ).fetchone()
    assert zius[0] == "needs_review"
    assert "span_quote" in zius[1]
    assert stats["needs_review"] == 2 and stats["new"] == 0

    # Nothing was auto-decided, so apply creates nothing.
    assert store.apply_decisions(db, "apply")["created"] == []


def test_auto_mode_creates_an_entity_nothing_resembles(db, tmp_path, monkeypatch):
    monkeypatch.setenv("ENTITY_WRITE_MODE", "auto")
    doc = {
        "chunks": [{"chunk_id": "c01", "text": "Zorblax Industries filed the report."}],
        "ner_results": [{"chunk_id": "c01", "validation": {"verdict": "pass"}, "ner": {"entities": [
            {"type": "ORGANIZATION", "name": "Zorblax Industries",
             "span_quote": "Zorblax Industries filed the report"},
        ]}}],
    }
    p = tmp_path / "zorblax" / "episode_rag_pipeline.json"
    p.parent.mkdir()
    p.write_text(json.dumps(doc))
    store.load_mentions(db, list(mentions.extract_mentions(p, tmp_path)), "load")
    stats = store.resolve_pending(db, "resolve")
    assert stats["new"] == 1
    assert _status(db, "Zorblax Industries") == [("new", None)]

    created = store.apply_decisions(db, "apply")["created"]
    assert [c["name"] for c in created] == ["Zorblax Industries"]
    assert db.execute(
        "SELECT name FROM organizations WHERE id=%s", (created[0]["entity_id"],)
    ).fetchone() == ("Zorblax Industries",)


def test_auto_mode_holds_a_failed_verdict(db, tmp_path, monkeypatch):
    monkeypatch.setenv("ENTITY_WRITE_MODE", "auto")
    verdicts = mentions.DEFAULT_VERDICTS | {"fail"}
    found = list(mentions.extract_mentions(_pipeline(tmp_path), tmp_path, frozenset(verdicts)))
    store.load_mentions(db, found, "load")
    store.resolve_pending(db, "resolve")
    row = db.execute(
        "SELECT status, decision_note FROM document_entities WHERE entity_name='Should Not Load'"
    ).fetchone()
    assert row[0] == "needs_review"
    assert "fail" in row[1]


def test_ambiguous_exact_hits_go_to_review(db, tmp_path, monkeypatch):
    monkeypatch.setenv("ENTITY_WRITE_MODE", "staging")
    db.execute("INSERT INTO key_figures VALUES ('rec_vallee_2', 'Jacques Vallee')")
    db.execute("INSERT INTO entity_aliases (entity_table, entity_id, alias, source) "
               "VALUES ('key_figures', 'rec_vallee_2', 'Jacques Vallee', 'seed_name')")
    store.load_mentions(db, list(mentions.extract_mentions(_pipeline(tmp_path), tmp_path)), "load")
    store.resolve_pending(db, "resolve")
    row = db.execute(
        "SELECT status, decision_note FROM document_entities WHERE entity_name='Jacques Vallée'"
    ).fetchone()
    assert row == ("needs_review", "2 exact hits")
