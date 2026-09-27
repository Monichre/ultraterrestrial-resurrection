#!/usr/bin/env python3
"""Backfill locations.embedding — text-embedding-3-small @ 1536 dims.

Requires 004_locations_embedding.sql to have been applied (the script checks
and exits with a clear message if the column is missing).

Resumable by construction: it only ever selects rows WHERE embedding IS NULL,
so an interrupted run is continued by running it again. Dry run by default.

    python3 scripts/backfill_location_embeddings.py              # dry run
    python3 scripts/backfill_location_embeddings.py --limit 200 --commit
    python3 scripts/backfill_location_embeddings.py --commit     # all 13,933

Embedded text is the place-identity string "name, city, state, country" with
empty parts dropped — locations carries no description/summary column. See the
004 migration header for why that composition and not something richer.
"""
from __future__ import annotations

import argparse
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.db.postgres_client import connect  # noqa: E402

MODEL = "text-embedding-3-small"
DIMS = 1536
BATCH = 128
# text-embedding-3-small list price, USD per 1M input tokens (2026-09-27).
# Only used for the printed estimate; nothing branches on it.
USD_PER_1M_TOKENS = 0.02


def place_text(name: str | None, city: str | None, state: str | None, country: str | None) -> str:
    """"name, city, state, country" with blank parts dropped and dupes removed."""
    parts: list[str] = []
    for part in (name, city, state, country):
        cleaned = (part or "").strip()
        if cleaned and cleaned.lower() not in {p.lower() for p in parts}:
            parts.append(cleaned)
    return ", ".join(parts)


def to_vector_literal(values: list[float]) -> str:
    """pgvector input format. Bound as a plain string and cast with ::vector."""
    return "[" + ",".join(repr(float(v)) for v in values) + "]"


def require_column(conn) -> None:
    exists = conn.execute(
        """SELECT 1 FROM information_schema.columns
           WHERE table_name = 'locations' AND column_name = 'embedding'"""
    ).fetchone()
    if not exists:
        sys.exit(
            "locations.embedding does not exist. Apply the migration first:\n"
            '  psql "$DATABASE_URL" -f packages/db/migrations/004_locations_embedding.sql'
        )


def embed(client, texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(model=MODEL, input=texts)
    # Modern SDK returns objects, and `data` is not guaranteed to be ordered.
    ordered = sorted(response.data, key=lambda d: d.index)
    vectors = [d.embedding for d in ordered]
    for vector in vectors:
        if len(vector) != DIMS:
            raise RuntimeError(f"expected {DIMS} dims, got {len(vector)}")
    return vectors


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--commit", action="store_true", help="write to the database (default: dry run)")
    ap.add_argument("--limit", type=int, help="stop after this many rows")
    ap.add_argument("--batch", type=int, default=BATCH, help=f"rows per API call (default {BATCH})")
    args = ap.parse_args()

    with connect(autocommit=False, read_only=not args.commit) as conn:
        require_column(conn)
        total, embedded = conn.execute(
            "SELECT count(*), count(embedding) FROM locations").fetchone()
        rows = conn.execute(
            """SELECT id, name, city, state, country FROM locations
               WHERE embedding IS NULL AND coalesce(trim(name), '') <> ''
               ORDER BY id"""
        ).fetchall()
        if args.limit:
            rows = rows[: args.limit]

        nameless = conn.execute(
            """SELECT count(*) FROM locations
               WHERE embedding IS NULL AND coalesce(trim(name), '') = ''"""
        ).fetchone()[0]

        print(f"locations: {total} rows, {embedded} already embedded")
        print(f"to process: {len(rows)}" + (f"  (--limit {args.limit})" if args.limit else ""))
        if nameless:
            print(f"skipping {nameless} row(s) with a blank name — nothing to embed")
        if not rows:
            print("nothing to do")
            return

        est_tokens = sum(len(place_text(*r[1:])) for r in rows) / 4
        print(f"rough estimate: ~{est_tokens/1000:.0f}k tokens, "
              f"~${est_tokens/1_000_000*USD_PER_1M_TOKENS:.4f}")

        if not args.commit:
            print("\nDRY RUN — no API calls, no writes. Sample of what would be embedded:")
            for row in rows[:5]:
                print(f"  {row[0][:18]:20} {place_text(*row[1:])!r}")
            print("\nre-run with --commit to write")
            return

        if not os.getenv("OPENAI_API_KEY"):
            sys.exit("OPENAI_API_KEY is not set")
        from openai import OpenAI  # imported late so a dry run needs no SDK

        client = OpenAI()
        done = failed = 0
        started = time.time()
        for start in range(0, len(rows), args.batch):
            chunk = rows[start : start + args.batch]
            texts = [place_text(*r[1:]) for r in chunk]
            try:
                vectors = embed(client, texts)
            except Exception as exc:  # one bad batch must not lose the run
                failed += len(chunk)
                print(f"  batch at {start} FAILED: {type(exc).__name__}: {exc}")
                conn.rollback()
                continue
            for (row_id, *_), vector in zip(chunk, vectors):
                conn.execute(
                    "UPDATE locations SET embedding = %s::vector WHERE id = %s",
                    (to_vector_literal(vector), row_id),
                )
            conn.commit()  # commit per batch so an interrupt keeps prior work
            done += len(chunk)
            print(f"  {done}/{len(rows)}  ({time.time()-started:.0f}s)")

        total, embedded = conn.execute(
            "SELECT count(*), count(embedding) FROM locations").fetchone()
        print(f"\nwrote {done}, failed {failed}")
        print(f"locations now: {embedded}/{total} embedded")


if __name__ == "__main__":
    main()
