"""
SP2 Phase B: ingest source files into documents / document_chunks / embeddings.

Discovers three source types from packages/knowledge-base/sources/:
  transcripts/{date}/{yt_id}/   — YouTube transcripts (*.txt + *Summary.txt)
  files/                        — PDFs (requires pymupdf)
  web/{date}/{slug}/            — web article text files

For each source:
  1. Extract title + summary + full content
  2. INSERT INTO documents (ON CONFLICT url DO NOTHING → idempotent)
  3. Chunk content (~512 tokens / 50-token overlap, by word count approx)
  4. Embed each chunk with text-embedding-3-small @ 1536 dims
  5. INSERT INTO document_chunks
  6. Embed document summary → documents.embedding

Reads OPENAI_API_KEY from env or repo-root .env.
Reads DATABASE_URL  from env or packages/db/.env.

Usage:
  python ingest.py [--dry-run] [--limit N] [--type transcripts|files|web]

  --dry-run    Discover + parse, no DB writes or API calls
  --limit N    Process at most N documents (for testing)
  --type X     Only process one source type
"""
from __future__ import annotations

import os
import re
import sys
import time
import hashlib
from pathlib import Path
from typing import Iterator

# ---------------------------------------------------------------------------
# env
# ---------------------------------------------------------------------------

def _load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, _, v = line.partition('=')
        k = k.strip(); v = v.strip().strip('"').strip("'")
        if k and k not in os.environ:
            os.environ[k] = v


_HERE    = Path(__file__).resolve().parent
_DB_ENV  = _HERE.parents[1] / ".env"
_ROOT_ENV = _HERE.parents[3] / ".env"
_load_dotenv(_DB_ENV)
_load_dotenv(_ROOT_ENV)

_SOURCES = _HERE.parents[3] / "packages" / "knowledge-base" / "sources"

MODEL = "text-embedding-3-small"
DIMS  = 1536

# chunk params (word-based approx; 1 token ≈ 0.75 words)
CHUNK_WORDS   = 380   # ≈ 512 tokens
OVERLAP_WORDS = 38    # ≈ 50 tokens


# ---------------------------------------------------------------------------
# chunking
# ---------------------------------------------------------------------------

def _chunk_text(text: str) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + CHUNK_WORDS, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start = end - OVERLAP_WORDS
    return chunks


def _word_count(text: str) -> int:
    return len(text.split())


# ---------------------------------------------------------------------------
# source discovery
# ---------------------------------------------------------------------------

def _stable_id(path_key: str) -> str:
    """Deterministic doc id from a path key (hex-stable across runs)."""
    return "doc_" + hashlib.sha1(path_key.encode()).hexdigest()[:16]


def _read_safe(path: Path) -> str:
    try:
        return path.read_text(errors="replace").replace("\x00", "").strip()
    except Exception:
        return ""


def _extract_url(text: str) -> str | None:
    m = re.search(r'https?://[^\s]+', text)
    return m.group(0).rstrip('.,)') if m else None


def _extract_title(text: str, fallback: str) -> str:
    first = text.strip().splitlines()[0] if text.strip() else ""
    # strip markdown headings
    first = re.sub(r'^#+\s*', '', first).strip()
    if 3 < len(first) < 200 and not first.startswith('http'):
        return first
    return fallback


def discover_transcripts() -> Iterator[dict]:
    base = _SOURCES / "transcripts"
    if not base.exists():
        return
    for date_dir in sorted(base.iterdir()):
        if not date_dir.is_dir():
            continue
        for yt_dir in sorted(date_dir.iterdir()):
            if not yt_dir.is_dir():
                continue
            yt_id = yt_dir.name
            txts = sorted(yt_dir.glob("*.txt"))
            if not txts:
                continue
            # split summary vs body
            summaries = [f for f in txts if "Summary" in f.name or "summary" in f.name]
            bodies    = [f for f in txts if f not in summaries]

            summary_text = _read_safe(summaries[0]) if summaries else ""
            body_text    = _read_safe(bodies[0])    if bodies    else (summary_text if not summaries else "")

            if not body_text and not summary_text:
                continue

            url = _extract_url(body_text or summary_text)
            if not url:
                url = f"https://www.youtube.com/watch?v={yt_id}" if re.match(r'^[\w-]{11}$', yt_id) else None

            title = _extract_title(body_text or summary_text, yt_id)

            yield {
                "id":          _stable_id(f"transcript:{date_dir.name}/{yt_id}"),
                "title":       title,
                "summary":     summary_text[:4000] or None,
                "content":     body_text or summary_text,
                "url":         url,
                "source_type": "transcript",
                "metadata":    {"date": date_dir.name, "yt_id": yt_id},
            }


def discover_files() -> Iterator[dict]:
    base = _SOURCES / "files"
    if not base.exists():
        return
    for f in sorted(base.rglob("*.pdf")):
        text = _pdf_text(f)
        if not text:
            continue
        title = _extract_title(text, f.stem)
        yield {
            "id":          _stable_id(f"file:{f.name}"),
            "title":       title,
            "summary":     None,
            "content":     text,
            "url":         None,
            "source_type": "pdf",
            "metadata":    {"filename": f.name, "path": str(f.relative_to(_SOURCES))},
        }


def discover_web() -> Iterator[dict]:
    base = _SOURCES / "web"
    if not base.exists():
        return
    for date_dir in sorted(base.iterdir()):
        if not date_dir.is_dir():
            continue
        for slug_dir in sorted(date_dir.iterdir()):
            if not slug_dir.is_dir():
                continue
            txts = sorted(slug_dir.glob("*.txt")) + sorted(slug_dir.glob("*.md"))
            for f in txts:
                text = _read_safe(f)
                if not text:
                    continue
                url   = _extract_url(text)
                title = _extract_title(text, f.stem)
                yield {
                    "id":          _stable_id(f"web:{date_dir.name}/{slug_dir.name}/{f.name}"),
                    "title":       title,
                    "summary":     None,
                    "content":     text,
                    "url":         url,
                    "source_type": "web",
                    "metadata":    {"date": date_dir.name, "slug": slug_dir.name},
                }


def _pdf_text(path: Path) -> str:
    try:
        import fitz  # pymupdf
        doc = fitz.open(str(path))
        text = "\n".join(page.get_text() for page in doc).strip()
        return text.replace("\x00", "")  # strip NUL bytes — Postgres text rejects them
    except Exception as exc:
        print(f"  WARN: could not read {path.name}: {exc}", file=sys.stderr)
        return ""


def all_sources(only_type: str | None = None) -> Iterator[dict]:
    if only_type in (None, "transcripts"):
        yield from discover_transcripts()
    if only_type in (None, "files"):
        yield from discover_files()
    if only_type in (None, "web"):
        yield from discover_web()


# ---------------------------------------------------------------------------
# DB + OpenAI helpers
# ---------------------------------------------------------------------------

def _connect():
    url = os.getenv("DATABASE_URL")
    if not url:
        sys.exit("ERROR: DATABASE_URL not set")
    try:
        import psycopg
        from psycopg.types.json import Jsonb
        # autocommit=True: no implicit transaction; we open explicit transactions
        # only around DB writes, so long API calls don't hold idle transactions
        # (prevents Neon's idle_in_transaction_session_timeout from killing us)
        return psycopg.connect(url, autocommit=True), Jsonb
    except ImportError:
        sys.exit('ERROR: pip install "psycopg[binary]"')


def _openai():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        sys.exit("ERROR: OPENAI_API_KEY not set")
    try:
        from openai import OpenAI
    except ImportError:
        sys.exit('ERROR: pip install openai')
    return OpenAI(api_key=key)


def _embed(client, texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    resp = client.embeddings.create(model=MODEL, input=texts, dimensions=DIMS)
    return [item.embedding for item in sorted(resp.data, key=lambda x: x.index)]


# ---------------------------------------------------------------------------
# main run
# ---------------------------------------------------------------------------

def run(dry_run: bool = False, limit: int | None = None, only_type: str | None = None) -> int:
    conn, Jsonb = _connect()
    client = None if dry_run else _openai()

    total_docs   = 0
    total_chunks = 0

    # collect existing doc ids to skip (idempotent)
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM documents")
        existing_ids = {r[0] for r in cur.fetchall()}

    for doc in all_sources(only_type):
        if limit is not None and total_docs >= limit:
            break
        if doc["id"] in existing_ids:
            continue

        content = doc["content"]
        chunks  = _chunk_text(content)
        n_chunks = len(chunks)
        print(f"  [{doc['source_type']}] {doc['title'][:60]:<60} {n_chunks} chunks", flush=True)

        if dry_run:
            total_docs   += 1
            total_chunks += n_chunks
            continue

        # embed summary (or first 800 chars of content if no summary)
        summary_text = doc["summary"] or content[:800]
        doc_vec = _embed(client, [summary_text])[0] if summary_text.strip() else None

        # embed chunks
        chunk_vecs: list[list[float]] = []
        for i in range(0, len(chunks), 100):
            batch = chunks[i:i+100]
            chunk_vecs.extend(_embed(client, batch))
            if i + 100 < len(chunks):
                time.sleep(0.2)

        with conn.transaction():
            with conn.cursor() as cur:
                # insert document
                cur.execute(
                    'INSERT INTO documents '
                    '(id, title, summary, url, source_type, metadata, embedding) '
                    'VALUES (%s,%s,%s,%s,%s,%s,%s) '
                    'ON CONFLICT (id) DO NOTHING',
                    (doc["id"], doc["title"], doc["summary"],
                     doc["url"], doc["source_type"],
                     Jsonb(doc["metadata"]) if doc["metadata"] else None,
                     doc_vec)
                )
                # insert chunks
                for idx, (chunk, vec) in enumerate(zip(chunks, chunk_vecs)):
                    cur.execute(
                        'INSERT INTO document_chunks '
                        '(document, chunk_index, content, tokens, embedding) '
                        'VALUES (%s,%s,%s,%s,%s)',
                        (doc["id"], idx, chunk, _word_count(chunk), vec)
                    )

        existing_ids.add(doc["id"])
        total_docs   += 1
        total_chunks += n_chunks

    suffix = " (DRY RUN)" if dry_run else ""
    print(f"\nINGEST COMPLETE{suffix}: {total_docs} docs, {total_chunks} chunks")
    return 0


if __name__ == "__main__":
    args = sys.argv[1:]
    dry_run   = "--dry-run" in args
    only_type = None
    limit     = None
    for i, a in enumerate(args):
        if a == "--type" and i + 1 < len(args):
            only_type = args[i + 1]
        if a == "--limit" and i + 1 < len(args):
            limit = int(args[i + 1])
    sys.exit(run(dry_run=dry_run, limit=limit, only_type=only_type))
