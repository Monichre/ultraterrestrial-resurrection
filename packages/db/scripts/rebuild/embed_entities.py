"""
SP2 Phase A: batch-embed all entity rows into their vector(1536) columns.

Uses text-embedding-3-small @ 1536 dims (locked decision).
Idempotent — only processes rows WHERE embedding IS NULL.

Reads OPENAI_API_KEY from env or ../../.env (root).
Reads DATABASE_URL  from env or ../../.env (packages/db/.env if missing).

Usage:
  python embed_entities.py [--dry-run] [--sightings]

  --dry-run    Print counts, skip API calls and DB writes
  --sightings  Also embed sightings.comments (43k rows, ~$0.04)
"""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# env loading (stdlib only — no dotenv dep)
# ---------------------------------------------------------------------------

def _load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, _, v = line.partition('=')
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        if k and k not in os.environ:
            os.environ[k] = v


_HERE = Path(__file__).resolve().parent
_load_dotenv(_HERE.parents[1] / ".env")   # packages/db/.env  → DATABASE_URL
_load_dotenv(_HERE.parents[3] / ".env")   # repo root .env    → OPENAI_API_KEY

MODEL = "text-embedding-3-small"
DIMS  = 1536
BATCH = 200   # inputs per OpenAI request (max 2048)

# ---------------------------------------------------------------------------
# Entity text specs: (table, col_select_sql, text_builder)
# text_builder(row_dict) → str; returns '' to skip
# ---------------------------------------------------------------------------

def _cat(*vals: str | None) -> str:
    return " ".join(v for v in vals if v and v.strip())


ENTITY_SPECS: list[tuple[str, str, object]] = [
    ("topics",
     "id, name, summary, description",
     lambda r: _cat(r["name"], r["summary"], r["description"])),

    ("key_figures",
     "id, name, bio, role",
     lambda r: _cat(r["name"], r["role"], r["bio"])),

    ("events",
     "id, name, title, summary, description",
     lambda r: _cat(r["name"], r["title"], r["summary"], r["description"])),

    ("organizations",
     "id, name, specialization, description, title",
     lambda r: _cat(r["name"], r["title"], r["specialization"], r["description"])),

    ("testimonies",
     "id, title, description, summary",
     lambda r: _cat(r["title"], r["description"], r["summary"])),

    ("artifacts",
     "id, name, description, origin",
     lambda r: _cat(r["name"], r["description"], r["origin"])),
]

SIGHTINGS_SPEC = (
    "sightings",
    "id, city, state, country, shape, comments",
    lambda r: _cat(r["comments"], r["shape"], r["city"], r["state"], r["country"]),
)


def _connect():
    url = os.getenv("DATABASE_URL")
    if not url:
        sys.exit("ERROR: DATABASE_URL not set")
    try:
        import psycopg
        from psycopg.rows import dict_row
        return psycopg.connect(url, row_factory=dict_row, autocommit=True)
    except ImportError:
        sys.exit('ERROR: pip install "psycopg[binary]"')


def _openai_client():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        sys.exit("ERROR: OPENAI_API_KEY not set")
    try:
        from openai import OpenAI
    except ImportError:
        sys.exit('ERROR: pip install openai')
    return OpenAI(api_key=key)


def _embed_batch(client, texts: list[str]) -> list[list[float]]:
    """Call OpenAI and return one vector per input text."""
    resp = client.embeddings.create(model=MODEL, input=texts, dimensions=DIMS)
    return [item.embedding for item in sorted(resp.data, key=lambda x: x.index)]


def run(include_sightings: bool = False, dry_run: bool = False) -> int:
    specs = list(ENTITY_SPECS)
    if include_sightings:
        specs.append(SIGHTINGS_SPEC)

    conn = _connect()
    client = None if dry_run else _openai_client()

    total_embedded = 0
    for table, cols, text_fn in specs:
        with conn.cursor() as cur:
            cur.execute(
                f'SELECT {cols} FROM "{table}" WHERE embedding IS NULL'
            )
            rows = cur.fetchall()

        if not rows:
            print(f"  {table:<20} 0 pending — skipping")
            continue

        # build (id, text) pairs, dropping rows with no meaningful text
        pairs = [(r["id"], text_fn(r).strip()) for r in rows]
        pairs = [(id_, txt) for id_, txt in pairs if txt]

        print(f"  {table:<20} {len(pairs):>6} rows to embed", flush=True)
        if dry_run:
            continue

        # process in batches: embed → write (short transaction, no idle-in-txn)
        for i in range(0, len(pairs), BATCH):
            batch = pairs[i : i + BATCH]
            ids   = [p[0] for p in batch]
            texts = [p[1] for p in batch]

            try:
                vectors = _embed_batch(client, texts)
            except Exception as exc:
                print(f"    ERROR batch {i//BATCH}: {exc}", file=sys.stderr)
                continue

            with conn.transaction():
                with conn.cursor() as cur:
                    for id_, vec in zip(ids, vectors):
                        cur.execute(
                            f'UPDATE "{table}" SET embedding = %s WHERE id = %s',
                            (vec, id_)
                        )
            total_embedded += len(batch)
            print(f"    {table} [{i+len(batch)}/{len(pairs)}]", flush=True)

            # gentle rate-limit pause between large batches
            if len(pairs) > BATCH and i + BATCH < len(pairs):
                time.sleep(0.3)

    if dry_run:
        print("\nDRY RUN — no API calls made")
    else:
        print(f"\nEMBED COMPLETE — {total_embedded} rows updated")
    return 0


if __name__ == "__main__":
    args = set(sys.argv[1:])
    sys.exit(run(
        include_sightings="--sightings" in args,
        dry_run="--dry-run" in args,
    ))
