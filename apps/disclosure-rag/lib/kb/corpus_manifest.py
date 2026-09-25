"""Corpus identity index — "do we already have this?" before re-ingesting.

T-061 / T-059. Ingest was re-fetching material the archive already held: 56
YouTube videos existed under two or three different date folders, and one web
article was filed three times. Nothing checked first, because there was nothing
to check against.

The index is keyed by **stable identity**, never by path. T-061 moved every file
in the archive; a path-keyed index would have been invalidated wholesale by that
migration, while every identity below survived it untouched.

Three identity kinds, in order of preference:

    videoId   YouTube's own id. Survives retitling and re-uploads to a
              different channel.
    url       Canonical source URL for web articles.
    sha256    Content hash. The fallback for files that carry no external
              identity at all.

Coverage: `corpus-manifest.json` indexes `packages/knowledge-base/sources/`
(the curated archive). `corpus-manifest-intake.json`, a sibling file loaded
and merged in here transparently, indexes `apps/disclosure-rag/corpus/intake/`
(the raw intake dump — 14k+ PDFs, ~29GB, mostly no videoId/URL, so by_sha256
only). Split into two files because the intake index alone runs ~14k entries;
keeping it out of corpus-manifest.json keeps that file's diffs reviewable.
Callers never need to know about the split — `already_have()` and `stats()`
see one merged view. On sha256 collision between the two files, the curated
archive's entry wins (it is the canonical location).

Usage from an ingest path::

    from lib.kb.corpus_manifest import already_have

    hit = already_have(youtube_id="8TYMQOUDQBo")
    if hit:
        print(f"skip — already at {hit['path']}")

CLI::

    python -m lib.kb.corpus_manifest --youtube 8TYMQOUDQBo
    python -m lib.kb.corpus_manifest --url https://example.com/article
    python -m lib.kb.corpus_manifest --file some.pdf
    python -m lib.kb.corpus_manifest --stats
"""

from __future__ import annotations

import hashlib
import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

from .kb_root import kb_root

MANIFEST_NAME = "corpus-manifest.json"
INTAKE_MANIFEST_NAME = "corpus-manifest-intake.json"


def manifest_path() -> Path:
    return kb_root() / "metadata" / MANIFEST_NAME


def intake_manifest_path() -> Path:
    return kb_root() / "metadata" / INTAKE_MANIFEST_NAME


def _load_json(p: Path) -> dict:
    """Missing or corrupt file degrades to `{}`, never raises.

    A broken index can only fail to dedupe — it must never block an ingest.
    """
    try:
        with open(p, encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        return {}
    except (json.JSONDecodeError, OSError):
        return {}


@lru_cache(maxsize=1)
def _load() -> dict:
    """Load and merge the manifest + intake-manifest once per process.

    `by_youtube_id` and `by_url` come from the curated archive only (the
    intake dump carries neither). `by_sha256` is the union of both files;
    on a hash collision the curated archive's entry wins, since it names the
    canonical location and the intake copy is the one worth flagging as
    redundant, not the one worth pointing ingest at.
    """
    m = dict(_load_json(manifest_path()))
    intake = _load_json(intake_manifest_path())

    merged_sha = dict(intake.get("by_sha256", {}))
    merged_sha.update(m.get("by_sha256", {}))
    m["by_sha256"] = merged_sha
    return m


def sha256_file(path: str | Path, chunk: int = 1 << 20) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for block in iter(lambda: fh.read(chunk), b""):
            h.update(block)
    return h.hexdigest()


def already_have(
    youtube_id: Optional[str] = None,
    url: Optional[str] = None,
    file_path: Optional[str | Path] = None,
) -> Optional[dict[str, Any]]:
    """Return the existing archive entry for this identity, or None.

    Checks in identity-strength order and returns on the first hit. The returned
    dict carries at least `path` when the entry was located on disk, plus
    whatever provenance the manifest holds (channel, publish date, collection).
    A returned entry with no `path` means the identity is known but its bytes
    are not currently on disk — for YouTube that usually means the video went
    private, which is worth surfacing rather than silently re-fetching.
    """
    m = _load()
    if not m:
        return None

    if youtube_id:
        hit = m.get("by_youtube_id", {}).get(youtube_id)
        if hit:
            return {"identity": "youtube_id", "value": youtube_id, **hit}

    if url:
        by_url = m.get("by_url", {})
        hit = by_url.get(url)
        if hit is None:
            # tolerate trailing-slash and scheme drift, which is the common
            # way the same article arrives looking like two different URLs
            norm = url.rstrip("/").replace("https://", "").replace("http://", "")
            norm = norm[4:] if norm.startswith("www.") else norm
            for k, v in by_url.items():
                kn = k.rstrip("/").replace("https://", "").replace("http://", "")
                kn = kn[4:] if kn.startswith("www.") else kn
                if kn == norm:
                    hit = v
                    break
        if hit:
            return {"identity": "url", "value": url, **hit}

    if file_path:
        digest = sha256_file(file_path)
        hit = m.get("by_sha256", {}).get(digest)
        if hit:
            return {"identity": "sha256", "value": digest, **hit}

    return None


def stats() -> dict[str, int]:
    """`file_hashes` is the merged curated-archive + intake total; the two
    per-tree counts are broken out separately since intake dwarfs the
    curated archive (thousands of PDFs vs. dozens of files) and collapsing
    them would hide that the corpus is mostly unreviewed intake."""
    m = _load()
    curated = _load_json(manifest_path())
    intake = _load_json(intake_manifest_path())
    return {
        "youtube_ids": len(m.get("by_youtube_id", {})),
        "urls": len(m.get("by_url", {})),
        "file_hashes": len(m.get("by_sha256", {})),
        "file_hashes_curated": len(curated.get("by_sha256", {})),
        "file_hashes_intake": len(intake.get("by_sha256", {})),
    }


def _main() -> None:
    import argparse

    ap = argparse.ArgumentParser(description="Query the corpus identity index.")
    ap.add_argument("--youtube", help="videoId to check")
    ap.add_argument("--url", help="source URL to check")
    ap.add_argument("--file", help="local file to check by content hash")
    ap.add_argument("--stats", action="store_true")
    a = ap.parse_args()

    if a.stats or not (a.youtube or a.url or a.file):
        s = stats()
        print(f"manifest: {manifest_path()}")
        for k, v in s.items():
            print(f"  {k:12} {v}")
        if not any(s.values()):
            print("  (empty or missing — dedupe is inactive, ingest will not be blocked)")
        return

    hit = already_have(youtube_id=a.youtube, url=a.url, file_path=a.file)
    if hit:
        where = hit.get("path") or "NOT ON DISK"
        print(f"HAVE IT  via {hit['identity']}  ->  {where}")
        for k in ("channel_title", "published_at", "collection", "title", "status"):
            if hit.get(k):
                print(f"   {k}: {hit[k]}")
    else:
        print("NOT IN CORPUS — safe to ingest")


if __name__ == "__main__":
    _main()
