#!/usr/bin/env python3
"""T-048 H1 — backfill `content_hash` and relativize `path` in the archive index.

The writers were fixed first (`KnowledgeBaseCRUD.put_index_entry`), so this is a
one-time data pass, not a recurring chore. Running it before the writer fix is
what H0 did, and the audit's verdict on that was blunt: "H0 normalized the
existing data but never fixed the writer, so each new ingest reintroduces the
defect... re-normalizing the data without it just resets a counter."

What it does, per index record:

1. **`path` -> archive-relative.** Absolute machine-specific paths are not
   portable and were the H0 regression.
2. **`content_hash` -> md5 of the record's content file.** md5, matching
   `KnowledgeBaseCRUD._content_hash`; see that method for why not sha256.

Picking the content file is the only judgement call, because the archive has no
single naming convention -- `<camelCase>.txt`, `<domain>_content.txt`,
`metadata.json` with an inline `content` field, all present. The order below
prefers the most authoritative source available and refuses to guess when a
directory is ambiguous or empty; skipped records are reported, never silently
hashed to something plausible.

**A record whose directory is shared with another record is skipped, never
hashed.** 404 of 581 index records point at a directory some other record also
claims -- 285 distinct directories for 581 records, with 31 `case_file` records
all pointing at the `sources/files` tree root. There is no per-record content to
hash in a shared directory: any picker assigns one file's digest to every record
sharing the path, which would mint hundreds of duplicate values in the one field
whose purpose is to be unique, and which H2's Neon bridge will read as identity.
A wrong hash is strictly worse than a missing one -- a missing one is visibly
missing, a wrong one silently collapses two distinct documents into one. So the
collision map is computed first and those records are reported, not filled.

The `doc_id` self-check that surfaced that finding is retained as a *report*, not
as a gate. For a record whose `doc_id` is 12 hex chars, that id was minted as
`md5(content)[:12]` (`KnowledgeBaseCRUD._generate_id`), so a sole-owner record
should satisfy `md5(file)[:12] == doc_id`. Historically it usually does not,
because ingest hashed an in-memory `content` string that is not byte-identical to
what landed on disk. Do not try to reverse-engineer the historical derivation --
it has no payoff here. YouTube records key on `video_id` (D6), so the check does
not apply to them at all.

Usage:
    python scripts/backfill_content_hash.py            # dry run, prints a report
    python scripts/backfill_content_hash.py --apply    # writes index.json
"""

import argparse
import hashlib
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
KB_ROOT = Path(os.environ.get("DISCLOSURE_RAG_KB_PATH") or
                REPO_ROOT / "packages" / "knowledge-base")
INDEX = KB_ROOT / "metadata" / "index.json"

HEX12 = re.compile(r"^[0-9a-f]{12}$")
# Derived artifacts the pipeline writes beside the content; never the content.
DERIVED_SUFFIXES = ("summary.txt", "summary.md", "_metadata.json",
                    "_rag_pipeline.json", "_trace_map.json")
SKIP_NAMES = {"_ingest.json", "entity_processing_results.json", "metadata.json"}


def _under(p: Path) -> bool:
    try:
        p.relative_to(KB_ROOT)
        return True
    except ValueError:
        return False


def md5_text(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()


def is_derived(name: str) -> bool:
    low = name.lower()
    return low in SKIP_NAMES or low.endswith(DERIVED_SUFFIXES)


def pick_content(doc_dir: Path):
    """(text, source_label) for a record's content, or (None, reason)."""
    if not doc_dir.exists():
        return None, "dir-missing"
    if not doc_dir.is_dir():
        return None, "path-not-a-dir"

    # 1. metadata.json's inline `content` is what create_document() hashed.
    meta = doc_dir / "metadata.json"
    if meta.is_file():
        try:
            data = json.loads(meta.read_text())
            if isinstance(data, dict) and data.get("content"):
                return data["content"], "metadata.json:content"
        except (json.JSONDecodeError, UnicodeDecodeError):
            pass

    files = [f for f in doc_dir.iterdir() if f.is_file() and not is_derived(f.name)]
    for ext in (".txt", ".md"):
        cands = [f for f in files if f.suffix.lower() == ext]
        if not cands:
            continue
        # Largest wins; name breaks ties so repeat runs agree. Duplicate
        # same-size .txt pairs exist in the archive (identical bytes under two
        # slugged names), so a tie is not a defect -- it just needs an order.
        cands.sort(key=lambda f: (-f.stat().st_size, f.name))
        try:
            return cands[0].read_text(encoding="utf-8"), cands[0].name
        except UnicodeDecodeError:
            return None, "content-not-utf8"
    return None, "no-content-file"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true",
                    help="write index.json (default is a dry run)")
    args = ap.parse_args()

    index = json.loads(INDEX.read_text())
    docs = index["documents"]

    # Collision map first: which resolved directories are claimed by more than
    # one doc_id. Built before anything is written so the skip decision below
    # sees the whole index, not the records processed so far.
    claimants = {}
    for doc_id, rec in docs.items():
        p = Path(str(rec.get("path", "")))
        key = str(p.relative_to(KB_ROOT)) if p.is_absolute() and _under(p) else str(p)
        claimants.setdefault(key, []).append(doc_id)
    shared = {k: v for k, v in claimants.items() if len(v) > 1}

    stats = Counter()
    id_mismatches = []
    skipped = []
    digests = {}

    for doc_id, rec in docs.items():
        stats["records"] += 1

        raw_path = rec.get("path", "")
        p = Path(raw_path)
        if p.is_absolute():
            try:
                rec["path"] = str(p.relative_to(KB_ROOT))
                stats["path-relativized"] += 1
            except ValueError:
                stats["path-outside-archive"] += 1
        doc_dir = KB_ROOT / rec["path"] if not Path(rec["path"]).is_absolute() \
            else Path(rec["path"])

        if rec.get("content_hash"):
            stats["hash-already-present"] += 1
            continue

        if len(claimants.get(rec["path"], [])) > 1:
            n = len(claimants[rec["path"]])
            stats["skip:dir-shared"] += 1
            skipped.append((doc_id, rec.get("doc_type"),
                            f"dir-shared-by-{n}", rec.get("path")))
            continue

        text, label = pick_content(doc_dir)
        if text is None:
            stats[f"skip:{label}"] += 1
            skipped.append((doc_id, rec.get("doc_type"), label, rec.get("path")))
            continue

        digest = md5_text(text)
        rec["content_hash"] = digest
        stats["hash-backfilled"] += 1
        digests.setdefault(digest, []).append(doc_id)

        if HEX12.match(doc_id):
            if digest[:12] == doc_id:
                stats["id-check-pass"] += 1
            else:
                stats["id-check-FAIL"] += 1
                id_mismatches.append((doc_id, digest[:12], label, rec.get("path")))
        else:
            stats["id-check-n/a (source-keyed, D6)"] += 1

    print(f"archive root: {KB_ROOT}")
    print(f"index:        {INDEX}\n")
    for k, v in sorted(stats.items(), key=lambda kv: (-kv[1], kv[0])):
        print(f"  {v:5d}  {k}")

    dupes = {d: ids for d, ids in digests.items() if len(ids) > 1}
    if dupes:
        print(f"\n  !! {len(dupes)} digest(s) written to more than one record — "
              f"these must be resolved before any UNIQUE constraint:")
        for d, ids in list(dupes.items())[:20]:
            print(f"    {d}  {ids}")
    else:
        print("\n  every backfilled digest is unique across the records written.")

    print(f"\n  directory collisions in the index: {len(shared)} director"
          f"{'y' if len(shared) == 1 else 'ies'} claimed by "
          f"{sum(len(v) for v in shared.values())} records "
          f"({len(claimants)} distinct paths for {len(docs)} records).")

    if id_mismatches:
        print(f"\n  doc_id mismatches ({len(id_mismatches)}) — "
              f"content differs from what minted the id:")
        for doc_id, got, label, path in id_mismatches[:20]:
            print(f"    {doc_id} != {got}  [{label}]  {path}")
        if len(id_mismatches) > 20:
            print(f"    ... and {len(id_mismatches) - 20} more")

    if skipped:
        print(f"\n  no hash written ({len(skipped)}):")
        for doc_id, dtype, reason, path in skipped[:20]:
            print(f"    {doc_id}  {dtype or '?':<12} {reason:<18} {path}")
        if len(skipped) > 20:
            print(f"    ... and {len(skipped) - 20} more")

    if args.apply:
        tmp = INDEX.parent / f"{INDEX.name}.tmp"
        tmp.write_text(json.dumps(index, indent=2))
        os.replace(tmp, INDEX)
        print(f"\nWROTE {INDEX}")
    else:
        print("\nDRY RUN — nothing written. Re-run with --apply.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
