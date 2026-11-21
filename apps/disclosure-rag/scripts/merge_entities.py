#!/usr/bin/env python3
"""Merge a duplicate entity row into the one being kept.

    python3 scripts/merge_entities.py key_figures <keep_id> <drop_id>              # dry run
    python3 scripts/merge_entities.py key_figures <keep_id> <drop_id> --commit
    python3 scripts/merge_entities.py key_figures <keep_id> <drop_id> --name "Marc D'Antonio" --commit

One transaction per merge. Order matters, because every junction FK is
ON DELETE CASCADE — deleting the duplicate first would delete its links:

  1. copy into the kept row any column it has empty and the duplicate has
  2. repoint every reference (FK columns, entity_aliases, document_entities),
     first deleting rows that would collide with a UNIQUE the kept row already has
  3. delete the duplicate
  4. clear the kept row's embedding if any text was copied in, so the embedder
     rebuilds it from the merged text

Dry run executes all of it and rolls back, so its counts are the real ones.
Back up first: the script does not.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.db.postgres_client import connect  # noqa: E402

# (referencing table, column, other columns of its UNIQUE constraint).
# An empty tuple means no UNIQUE involves the column: repoint without dedupe.
REFS: dict[str, list[tuple[str, str, tuple[str, ...]]]] = {
    "key_figures": [
        ("documents", "author", ()),
        ("testimonies", "witness", ()),
        ("event_subject_matter_experts", "subject_matter_expert", ("event",)),
        ("topic_subject_matter_experts", "subject_matter_expert", ("topic",)),
        ("event_topic_subject_matter_experts", "subject_matter_expert", ("event", "topic")),
        ("organization_members", "member", ("organization",)),
        ("user_saved_key_figure", "key_figure", ()),
    ],
    "organizations": [
        ("documents", "organization", ()),
        ("testimonies", "organization", ()),
        ("organization_members", "organization", ("member",)),
        ("user_saved_organizations", "organization", ()),
    ],
}
# Never copied from the duplicate.
SKIP_COLUMNS = {"id", "name", "embedding", "xata_createdat", "xata_updatedat", "xata_version"}
TEXT_TYPES = {"text", "character varying"}


def merge(conn, table: str, keep: str, drop: str, new_name: str | None) -> dict[str, int]:
    stats: dict[str, int] = {}
    for entity_id in (keep, drop):
        if not conn.execute(f"SELECT 1 FROM {table} WHERE id = %s", (entity_id,)).fetchone():
            raise SystemExit(f"{table}.{entity_id} does not exist")

    cols = conn.execute(
        """SELECT column_name, data_type FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = %s
             AND is_generated = 'NEVER' AND generation_expression IS NULL""",
        (table,),
    ).fetchall()
    copied: list[str] = []
    for col, dtype in cols:
        if col in SKIP_COLUMNS:
            continue
        empty = f"(k.\"{col}\" IS NULL" + (f" OR k.\"{col}\" = ''" if dtype in TEXT_TYPES else "") + ")"
        filled = f"(d.\"{col}\" IS NOT NULL" + (f" AND d.\"{col}\" <> ''" if dtype in TEXT_TYPES else "") + ")"
        n = conn.execute(
            f"""UPDATE {table} k SET "{col}" = d."{col}" FROM {table} d
                WHERE k.id = %s AND d.id = %s AND {empty} AND {filled}""",
            (keep, drop),
        ).rowcount
        if n:
            copied.append(col)
    stats["fields_copied"] = len(copied)

    for ref_table, ref_col, unique_with in REFS[table]:
        if unique_with:
            match = " AND ".join(f'o."{c}" IS NOT DISTINCT FROM r."{c}"' for c in unique_with)
            stats[f"{ref_table}.{ref_col} deduped"] = conn.execute(
                f"""DELETE FROM {ref_table} r WHERE r."{ref_col}" = %s
                    AND EXISTS (SELECT 1 FROM {ref_table} o WHERE o."{ref_col}" = %s AND {match})""",
                (drop, keep),
            ).rowcount
        stats[f"{ref_table}.{ref_col}"] = conn.execute(
            f'UPDATE {ref_table} SET "{ref_col}" = %s WHERE "{ref_col}" = %s', (keep, drop)
        ).rowcount

    stats["entity_aliases deduped"] = conn.execute(
        """DELETE FROM entity_aliases a WHERE a.entity_table = %s AND a.entity_id = %s
           AND EXISTS (SELECT 1 FROM entity_aliases o WHERE o.entity_table = a.entity_table
                       AND o.entity_id = %s AND o.alias_normalized = a.alias_normalized)""",
        (table, drop, keep),
    ).rowcount
    stats["entity_aliases"] = conn.execute(
        "UPDATE entity_aliases SET entity_id = %s WHERE entity_table = %s AND entity_id = %s",
        (keep, table, drop),
    ).rowcount
    stats["document_entities"] = conn.execute(
        "UPDATE document_entities SET resolved_entity_id = %s WHERE resolved_entity_id = %s",
        (keep, drop),
    ).rowcount

    stats["deleted"] = conn.execute(f"DELETE FROM {table} WHERE id = %s", (drop,)).rowcount

    if new_name:
        conn.execute(f"UPDATE {table} SET name = %s WHERE id = %s", (new_name, keep))
    text_copied = any(dtype in TEXT_TYPES for col, dtype in cols if col in copied)
    if text_copied or new_name:
        conn.execute(f"UPDATE {table} SET embedding = NULL WHERE id = %s", (keep,))
        stats["embedding_cleared"] = 1
    return {k: v for k, v in stats.items() if v}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("table", choices=sorted(REFS))
    ap.add_argument("keep")
    ap.add_argument("drop")
    ap.add_argument("--name", help="rename the kept row")
    ap.add_argument("--commit", action="store_true", help="write (default: dry run, rolled back)")
    args = ap.parse_args()
    if args.keep == args.drop:
        raise SystemExit("keep and drop are the same id")

    with connect(autocommit=False) as conn:
        stats = merge(conn, args.table, args.keep, args.drop, args.name)
        if args.commit:
            conn.commit()
        else:
            conn.rollback()
    print(("COMMITTED " if args.commit else "DRY RUN ") + f"{args.table} {args.drop} -> {args.keep}: {stats}")


if __name__ == "__main__":
    main()
