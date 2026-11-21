"""Database side of entity resolution. Every function takes an open psycopg conn.

Name matching always goes through the SQL function entity_normalize() — never
a Python copy (see 003_entity_resolution.sql header).
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Iterable

from psycopg.types.json import Jsonb

from .mentions import Mention

TRIGRAM_FLOOR = 0.3
CANDIDATE_LIMIT = 5

# ── auto-write gate ────────────────────────────────────────────────────────
# `resolve` may decide `matched` or `new` without a human when the evidence is
# strong. What counts as strong is deliberately NOT the NER stage's own
# `confidence` field: on 2026-09-27 the three newest episodes produced 148
# validation issues across 22 chunks, 15 of them under a FABRICATED_* code
# (FABRICATED_EVIDENCE, FABRICATED_SOURCE_ATTRIBUTES, FABRICATED_QUOTE_COMPLETION
# and others). A model's self-assessment cannot gate a database write.
#
# ⚠️ What those issues are NOT: proof that named entities were invented. An
# earlier reading of this data claimed "Ziusudra", "Shuruppak" and "Younger
# Dryas" occur zero times in the transcript. That was wrong — the transcript is
# auto-transcribed, so it carries "Zasudra", "Shirupac"/"Sherupac" and "younger
# drius"/"younger dus". The NER stage was normalizing garbled ASR output, which
# is correct behaviour. The validator's own code for it, UNSUPPORTED_NAME_
# NORMALIZATION, means "not verbatim in the source", not "made up". Do not
# tighten this gate on the assumption that normalization equals fabrication.
#
# The gate is a conjunction of three signals the model does not author:
#   1. validation verdict   — a separate pass, must not be `fail`
#   2. quote_grounded       — span_quote is literally in the chunk (mentions.py)
#   3. trigram/alias score  — computed in Postgres against existing rows
#
# Thresholds are env-overridable so a run can be made stricter without a code
# change. Names mirror the pre-existing EntityCreator contract
# (lib/entity_extraction/core/entity_creator.py), which gated Xata writes the
# same way before Xata was retired.
#   ENTITY_WRITE_MODE=off|staging|auto   off/staging => never auto-decide
#
# The thresholds below are set from measured similarity on real name variants
# (entity_normalize + pg_trgm, live database 2026-09-27):
#
#     Jacques Vallee   vs Jacques Vallée        1.000   (accents: exact anyway)
#     Bob Bigelow      vs Bigelow              0.727
#     Lue Elizondo     vs Luis Elizondo        0.688
#     Harry Reid       vs Senator Harry Reid   0.579
#     Bob Bigelow      vs Robert Bigelow       0.444   <-- SAME PERSON
#     Ziusudra         vs Robert Bigelow       0.000
#
# That 0.444 is the number that matters: a nickname for someone already in the
# table scores *below* any plausible "nothing matches" cutoff. An earlier draft
# used 0.45 and would have auto-created a duplicate "Bob Bigelow" beside the
# existing "Robert Bigelow" — the exact defect the database already carries 5 of.
# So auto-`new` fires only when NOTHING clears TRIGRAM_FLOOR, i.e. the candidate
# list came back empty. Everything between the floor and AUTO_MATCH_SCORE is a
# human's call, which is where real variants land.
AUTO_MATCH_SCORE = float(os.getenv("ENTITY_AUTO_MATCH_SCORE", "0.92"))
AUTO_MATCH_MARGIN = float(os.getenv("ENTITY_AUTO_MATCH_MARGIN", "0.15"))
AUTO_NEW_MAX_SCORE = float(os.getenv("ENTITY_AUTO_NEW_MAX_SCORE", str(TRIGRAM_FLOOR)))
# Auto-write needs POSITIVE evidence from both programmatic checks. A missing
# verdict (no validation ran) or unknown grounding (no chunk text to check) is
# absence of evidence, so those mentions go to review, not to the database.
GATED_VERDICTS = frozenset({"pass", "pass_with_warnings"})


def write_mode() -> str:
    """off | staging | auto. Anything but `auto` keeps every decision human."""
    return os.getenv("ENTITY_WRITE_MODE", "staging").strip().lower()


def _auto_outcome(
    mode: str,
    verdict: str | None,
    quote_grounded: bool | None,
    candidates: list[dict[str, Any]],
    record_decision: str | None = None,
) -> tuple[str | None, str]:
    """Decide `matched` / `new` / None (=review) for a non-exact mention.

    Returns (status, note). The note always records WHY, so a row's provenance
    survives in decision_note whichever way it went.

    record_decision comes from the NER stage (ner.v1.yaml 4.0.0): only
    `record_candidate` may be auto-written. `context_only` and `needs_review`
    always go to a human. None means pre-4.0.0 output and keeps the old gate.
    """
    if mode != "auto":
        return None, f"write_mode={mode}: human decides"
    if record_decision is not None and record_decision != "record_candidate":
        return None, f"record_decision={record_decision}: human decides"
    if verdict not in GATED_VERDICTS:
        return None, f"verdict={verdict}: not auto-writable"
    if quote_grounded is False:
        return None, "span_quote not found in its chunk"
    if quote_grounded is None:
        return None, "grounding unknown: no chunk text to check the quote against"

    top = candidates[0]["score"] if candidates else 0.0
    second = candidates[1]["score"] if len(candidates) > 1 else 0.0
    if top >= AUTO_MATCH_SCORE and (top - second) >= AUTO_MATCH_MARGIN:
        return "matched", f"auto: trigram {top:.2f} (next {second:.2f})"
    if top < AUTO_NEW_MAX_SCORE:
        return "new", f"auto: no candidate above {AUTO_NEW_MAX_SCORE:.2f} (top {top:.2f})"
    return None, f"ambiguous: top {top:.2f}, next {second:.2f}"

# Tables seeded into entity_aliases. locations is matched against its own rows
# (13,933 gazetteer names were deliberately not seeded).
ALIAS_TABLES = {"key_figures", "events", "organizations", "topics", "artifacts"}


def new_run_id(stage: str) -> str:
    return f"{stage}-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}"


# ---------------------------------------------------------------------------
# load
# ---------------------------------------------------------------------------

def _document_id_for(conn, video_id: str | None) -> str | None:
    if not video_id:
        return None
    row = conn.execute(
        "SELECT id FROM documents WHERE url LIKE %s ORDER BY id LIMIT 1",
        (f"%{video_id}%",),
    ).fetchone()
    return row[0] if row else None


def load_mentions(conn, mentions: Iterable[Mention], run_id: str) -> dict[str, int]:
    """Insert mentions as `pending`. Idempotent on metadata.mention_key."""
    stats = {"inserted": 0, "already_loaded": 0}
    doc_cache: dict[str | None, str | None] = {}
    for m in mentions:
        if m.video_id not in doc_cache:
            doc_cache[m.video_id] = _document_id_for(conn, m.video_id)
        cur = conn.execute(
            """
            INSERT INTO document_entities
              (document, entity_type, entity_name, confidence, context, metadata,
               chunk_index, status, run_id)
            SELECT %s, %s, %s, %s, %s, %s, %s, 'pending', %s
            WHERE NOT EXISTS (
              SELECT 1 FROM document_entities WHERE metadata->>'mention_key' = %s)
            """,
            (doc_cache[m.video_id], m.entity_type, m.entity_name, m.confidence,
             m.quote, Jsonb(m.metadata()), m.chunk_index, run_id, m.mention_key),
        )
        stats["inserted" if cur.rowcount else "already_loaded"] += 1
    return stats


# ---------------------------------------------------------------------------
# resolve
# ---------------------------------------------------------------------------

def exact_hits(conn, table: str, name: str) -> list[str]:
    sql = """SELECT entity_id FROM entity_aliases
             WHERE entity_table = %s AND alias_normalized = entity_normalize(%s)"""
    params: tuple = (table, name)
    if table == "locations":
        sql += " UNION SELECT id FROM locations WHERE entity_normalize(name) = entity_normalize(%s)"
        params = (table, name, name)
    elif table not in ALIAS_TABLES:
        return []
    return [r[0] for r in conn.execute(sql, params).fetchall()]


def find_candidates(conn, table: str, name: str, limit: int = CANDIDATE_LIMIT) -> list[dict[str, Any]]:
    """Ranked trigram candidates: [{entity_id, label, score}]."""
    if table in ALIAS_TABLES:
        rows = conn.execute(
            """
            SELECT entity_id, alias, max(similarity(alias_normalized, entity_normalize(%s))) AS s
            FROM entity_aliases
            WHERE entity_table = %s
              AND similarity(alias_normalized, entity_normalize(%s)) >= %s
            GROUP BY entity_id, alias
            ORDER BY s DESC LIMIT %s
            """,
            (name, table, name, TRIGRAM_FLOOR, limit),
        ).fetchall()
    elif table == "locations":
        rows = conn.execute(
            """
            SELECT id, name, similarity(entity_normalize(name), entity_normalize(%s)) AS s
            FROM locations
            WHERE entity_normalize(name) %% entity_normalize(%s)
              AND similarity(entity_normalize(name), entity_normalize(%s)) >= %s
            ORDER BY s DESC LIMIT %s
            """,
            (name, name, name, TRIGRAM_FLOOR, limit),
        ).fetchall()
    else:
        rows = []
    seen, out = set(), []
    for entity_id, label, score in rows:
        if entity_id in seen:
            continue
        seen.add(entity_id)
        out.append({"entity_id": entity_id, "label": label, "score": round(float(score), 3)})
    return out


def _table_for_type(entity_type: str | None) -> str | None:
    from .mentions import TYPE_TO_TABLE
    return TYPE_TO_TABLE.get((entity_type or "").upper())


def resolve_pending(conn, run_id: str, statuses: tuple[str, ...] = ("pending",)) -> dict[str, int]:
    """Decide what code can decide; queue the rest for review.

    exactly one exact alias hit   -> matched (auto)
    no entity table (EVIDENCE)    -> skipped (auto)
    strong trigram + grounded     -> matched (auto)   } ENTITY_WRITE_MODE=auto
    no near candidate + grounded  -> new     (auto)   } only; see _auto_outcome
    anything else                 -> needs_review, candidates stored in metadata

    `new` still creates nothing here — `apply` is the only stage that inserts
    entity rows, so an auto-`new` remains reversible until then.
    """
    stats = {"matched": 0, "skipped": 0, "needs_review": 0, "new": 0}
    mode = write_mode()
    rows = conn.execute(
        """SELECT id, entity_type, entity_name, metadata->>'verdict',
                  metadata->>'quote_grounded', metadata->>'record_decision'
           FROM document_entities WHERE status = ANY(%s)""",
        (list(statuses),),
    ).fetchall()
    now = datetime.now(timezone.utc)
    for mention_id, etype, name, verdict, quote_grounded_raw, record_decision in rows:
        table = _table_for_type(etype)
        if table is None:
            conn.execute(
                """UPDATE document_entities SET status='skipped', decided_by='auto',
                   decided_at=%s, decision_note=%s, run_id=%s WHERE id=%s""",
                (now, f"{etype}: no entity table (Claims not built)", run_id, mention_id),
            )
            stats["skipped"] += 1
            continue
        hits = exact_hits(conn, table, name)
        if len(hits) == 1:
            conn.execute(
                """UPDATE document_entities SET status='matched', resolved_table=%s,
                   resolved_entity_id=%s, match_score=1.0, decided_by='auto',
                   decided_at=%s, decision_note='exact alias', run_id=%s WHERE id=%s""",
                (table, hits[0], now, run_id, mention_id),
            )
            stats["matched"] += 1
            continue
        candidates = find_candidates(conn, table, name)
        top_score = candidates[0]["score"] if candidates else None

        # Ambiguous exact hits are never auto-decided: two rows both legitimately
        # carry this alias, and picking one is exactly the judgement call a
        # human is here for.
        if hits:
            auto_status, note = None, f"{len(hits)} exact hits"
        else:
            quote_grounded = (
                None if quote_grounded_raw is None else quote_grounded_raw == "true")
            auto_status, note = _auto_outcome(
                mode, verdict, quote_grounded, candidates, record_decision)

        if auto_status == "matched":
            conn.execute(
                """UPDATE document_entities SET status='matched', resolved_table=%s,
                   resolved_entity_id=%s, match_score=%s, decided_by='auto',
                   decided_at=%s, decision_note=%s, run_id=%s,
                   metadata = coalesce(metadata, '{}'::jsonb)
                              || jsonb_build_object('candidates', %s::jsonb)
                   WHERE id=%s""",
                (table, candidates[0]["entity_id"], top_score, now, note, run_id,
                 Jsonb(candidates), mention_id),
            )
            # Record the spelling so the next occurrence is an exact lookup, and
            # sweep in any other open mention of the same name.
            conn.execute(
                """INSERT INTO entity_aliases (entity_table, entity_id, alias, source, mention_id)
                   VALUES (%s, %s, %s, 'auto_match', %s)
                   ON CONFLICT ON CONSTRAINT uq_entity_alias DO NOTHING""",
                (table, candidates[0]["entity_id"], name, mention_id),
            )
            _cascade(conn, table, name, run_id)
            stats["matched"] += 1
            continue

        if auto_status == "new":
            conn.execute(
                """UPDATE document_entities SET status='new', resolved_table=%s,
                   match_score=%s, decided_by='auto', decided_at=%s,
                   decision_note=%s, run_id=%s,
                   metadata = coalesce(metadata, '{}'::jsonb)
                              || jsonb_build_object('candidates', %s::jsonb)
                   WHERE id=%s""",
                (table, top_score, now, note, run_id, Jsonb(candidates), mention_id),
            )
            stats["new"] += 1
            continue

        conn.execute(
            """UPDATE document_entities SET status='needs_review', resolved_table=%s,
               match_score=%s, decision_note=%s, run_id=%s,
               metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('candidates', %s::jsonb)
               WHERE id=%s""",
            (table, top_score, note, run_id, Jsonb(candidates), mention_id),
        )
        stats["needs_review"] += 1
    return stats


# ---------------------------------------------------------------------------
# review decisions (called by review_cli; one committed decision each)
# ---------------------------------------------------------------------------

def _mention(conn, mention_id: str):
    row = conn.execute(
        "SELECT resolved_table, entity_name, entity_type FROM document_entities WHERE id=%s",
        (mention_id,),
    ).fetchone()
    if row is None:
        raise ValueError(f"mention {mention_id} not found")
    table, name, etype = row
    table = table or _table_for_type(etype)
    if table is None:
        raise ValueError(f"mention {mention_id} ({etype}) has no entity table")
    return table, name


def _cascade(conn, table: str, name: str, run_id: str) -> int:
    """Re-resolve other open mentions of the same name now that an alias exists."""
    cur = conn.execute(
        """
        UPDATE document_entities d SET status='matched', resolved_table=%s,
          resolved_entity_id=a.entity_id, match_score=1.0, decided_by='auto',
          decided_at=now(), decision_note='exact alias (after review)', run_id=%s
        FROM (SELECT min(entity_id) AS entity_id FROM entity_aliases
              WHERE entity_table=%s AND alias_normalized=entity_normalize(%s)
              HAVING count(DISTINCT entity_id) = 1) a
        WHERE d.status IN ('pending','needs_review')
          AND d.resolved_table IS NOT DISTINCT FROM %s
          AND d.entity_name_normalized = entity_normalize(%s)
        """,
        (table, run_id, table, name, table, name),
    )
    return cur.rowcount


def decide_match(conn, mention_id: str, entity_id: str, run_id: str, note: str | None = None) -> int:
    """Operator says: this mention is entity_id. Records the alias. Returns cascaded count."""
    table, name = _mention(conn, mention_id)
    conn.execute(
        """UPDATE document_entities SET status='matched', resolved_table=%s,
           resolved_entity_id=%s, decided_by='human', decided_at=now(),
           decision_note=%s, run_id=%s WHERE id=%s""",
        (table, entity_id, note, run_id, mention_id),
    )
    conn.execute(
        """INSERT INTO entity_aliases (entity_table, entity_id, alias, source, mention_id)
           VALUES (%s, %s, %s, 'human_review', %s)
           ON CONFLICT ON CONSTRAINT uq_entity_alias DO NOTHING""",
        (table, entity_id, name, mention_id),
    )
    return _cascade(conn, table, name, run_id)


def decide_new(conn, mention_id: str, run_id: str, note: str | None = None) -> int:
    """Operator says: a new entity. Same-name open mentions follow. Returns count marked."""
    table, name = _mention(conn, mention_id)
    cur = conn.execute(
        """UPDATE document_entities SET status='new', resolved_table=%s,
           decided_by='human', decided_at=now(), decision_note=%s, run_id=%s
           WHERE id=%s OR (status IN ('pending','needs_review')
             AND resolved_table IS NOT DISTINCT FROM %s
             AND entity_name_normalized = entity_normalize(%s))""",
        (table, note, run_id, mention_id, table, name),
    )
    return cur.rowcount


def decide_skip(conn, mention_id: str, run_id: str, note: str | None = None) -> None:
    conn.execute(
        """UPDATE document_entities SET status='skipped', decided_by='human',
           decided_at=now(), decision_note=%s, run_id=%s WHERE id=%s""",
        (note, run_id, mention_id),
    )


# ---------------------------------------------------------------------------
# apply
# ---------------------------------------------------------------------------

def apply_decisions(conn, run_id: str) -> dict[str, Any]:
    """Write decided mentions. The only stage that creates entity rows.

    matched -> stamp applied_at (the mention row is the document<->entity link)
    new     -> one entity row per (table, normalized name), alias recorded,
               every mention in the group linked and stamped
    Caller owns the transaction: roll back for a dry run.
    """
    now = datetime.now(timezone.utc)
    matched = conn.execute(
        """UPDATE document_entities SET applied_at=%s, run_id=%s
           WHERE status='matched' AND applied_at IS NULL AND resolved_entity_id IS NOT NULL""",
        (now, run_id),
    ).rowcount
    groups = conn.execute(
        """SELECT resolved_table, entity_name_normalized, min(entity_name), array_agg(id)
           FROM document_entities
           WHERE status='new' AND applied_at IS NULL AND resolved_table IS NOT NULL
           GROUP BY 1, 2 ORDER BY 1, 2"""
    ).fetchall()
    created: list[dict[str, str]] = []
    for table, _norm, name, mention_ids in groups:
        if table not in ALIAS_TABLES | {"locations"}:
            continue
        # Table name comes from the CHECK-constrained allowlist above, never input.
        entity_id = conn.execute(
            f"INSERT INTO {table} (id, name) VALUES (gen_random_uuid()::text, %s) RETURNING id",
            (name,),
        ).fetchone()[0]
        conn.execute(
            """INSERT INTO entity_aliases (entity_table, entity_id, alias, source, mention_id)
               VALUES (%s, %s, %s, 'human_review', %s)
               ON CONFLICT ON CONSTRAINT uq_entity_alias DO NOTHING""",
            (table, entity_id, name, mention_ids[0]),
        )
        conn.execute(
            """UPDATE document_entities SET resolved_entity_id=%s, applied_at=%s, run_id=%s
               WHERE id = ANY(%s)""",
            (entity_id, now, run_id, mention_ids),
        )
        created.append({"table": table, "entity_id": entity_id, "name": name})
    return {"matched_applied": matched, "created": created}
