#!/usr/bin/env python3
"""
SP1 CSV loader — Ultraterrestrial data-platform rebuild.

Loads the clean relational data from packages/db/docs/exports/*.csv into the
Postgres schema defined by migrations/rebuild/0001_init.sql.

Host-agnostic: connects via DATABASE_URL (Supabase / Neon / local / anything
Postgres 16 + pgvector). Schema is vanilla Postgres; no host-isms here.

Modes:
  --dry-run   Parse, dedup, transform every CSV in memory and report counts.
              Needs only the stdlib — no DB, no host required.
  --load      Apply transforms and bulk-INSERT into DATABASE_URL (psycopg).
              Idempotent: ON CONFLICT (id) DO NOTHING.
  --verify    Run row-count + FK-integrity + node/edge checks against the DB.

Spec: docs/design/data-platform-rebuild-spec.md (Sub-project 1).
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

# CSV exports live here; resolve relative to this file so cwd doesn't matter.
EXPORTS = (Path(__file__).resolve().parents[2] / "docs" / "exports")

csv.field_size_limit(10_000_000)  # sightings.comments / bios can be large

# True deduplicated counts from the firsthand verify-swarm audit (2026-06-09).
# documents intentionally 0 in SP1 (corrupted embeddings → re-ingest in SP2).
EXPECTED = {
    "sightings": 43481, "locations": 13933, "events": 595, "key_figures": 465,
    "testimonies": 178, "documents": 0, "topics": 91, "organizations": 40,
    # NOTE: spec said 259; the actual export has 36 distinct ids (clean 7× dup,
    # 9-field rows, no corruption — verified 2026-06-15). 36 is correct.
    "artifacts": 36,
}

# --------------------------------------------------------------------------- #
# Value transforms
# --------------------------------------------------------------------------- #
def s(v):
    """Clean scalar: '' / whitespace / literal NULL markers -> None."""
    if v is None:
        return None
    v = v.strip()
    if v == "" or v == "\\N" or v == "NULL":
        return None
    return v


def decode_commas(v):
    """sightings.comments encodes ',' as &#44 (and sometimes &#44; / &amp;#44;)."""
    v = s(v)
    if v is None:
        return None
    return (v.replace("&amp;#44;", ",").replace("&#44;", ",").replace("&#44", ","))


_ARR_QUOTE = re.compile(r"(?<!\\)'")

def arr(v):
    """Python-repr list literal ['a','b'] / [] -> list[str] (text[]). None if empty."""
    v = s(v)
    if v is None:
        return None
    if not (v.startswith("[") and v.endswith("]")):
        # bare single value -> singleton array
        return [v]
    try:
        parsed = json.loads(_ARR_QUOTE.sub('"', v))
    except json.JSONDecodeError:
        return None
    if not isinstance(parsed, list):
        return None
    out = [str(x).strip() for x in parsed if str(x).strip()]
    return out or None


def jsonb(v):
    """JSON object/array text -> compact json string for psycopg Json wrap. None if empty/{}."""
    v = s(v)
    if v is None or v == "{}" or v == "[]":
        return None
    try:
        return json.loads(v)
    except json.JSONDecodeError:
        return None


def ts(v):
    """ISO-8601 timestamp passthrough (Postgres parses it). None if empty."""
    return s(v)


def num(v):
    """Numeric passthrough as string; None if empty/non-numeric."""
    v = s(v)
    if v is None:
        return None
    try:
        float(v)
        return v
    except ValueError:
        return None


# --------------------------------------------------------------------------- #
# Table specs:  table -> (csv_file, node_type|None, label_src|None, columns)
# columns: list of (db_col, csv_col, transform)
# --------------------------------------------------------------------------- #
TABLES = [
    ("topics", "topics", "topic", "name", [
        ("name", "name", s), ("summary", "summary", s), ("photo", "photo", s),
        ("photos", "photos", arr), ("title", "title", s),
    ]),
    # key_figures sourced from key-figures.csv (has photo data personnel.csv lacks)
    ("key_figures", "key-figures", "key_figure", "name", [
        ("name", "name", s), ("bio", "bio", s), ("role", "role", s),
        ("photo", "photo", arr), ("rank", "rank", num),
        ("credibility", "credibility", num), ("popularity", "popularity", num),
        ("authority", "authority", num),
    ]),
    ("events", "events", "event", "name", [
        ("name", "name", s), ("description", "description", s),
        ("location", "location", s), ("latitude", "latitude", num),
        ("longitude", "longitude", num), ("date", "date", ts),
        ("photos", "photos", arr), ("metadata", "metadata", jsonb),
        ("title", "title", s), ("summary", "summary", s),
        ("category", "category", arr),
    ]),
    ("organizations", "organizations", "organization", "name", [
        ("name", "name", s), ("specialization", "specialization", s),
        ("description", "description", s), ("photo", "photo", s),
        ("image", "image", s), ("title", "title", s),
    ]),
    ("sightings", "sightings", "sighting", "city", [
        ("occurred_at", "date", ts), ("city", "city", s), ("state", "state", s),
        ("country", "country", s), ("shape", "shape", s),
        ("duration_seconds", "duration_seconds", num),
        ("duration_hours_min", "duration_hours_min", s),
        ("comments", "comments", decode_commas), ("date_posted", "date_posted", ts),
        ("latitude", "latitude", num), ("longitude", "longitude", num),
    ]),
    ("locations", "locations", "location", "name", [
        ("name", "name", s), ("city", "city", s), ("state", "state", s),
        ("latitude", "latitude", num), ("longitude", "longitude", num),
        ("coordinates", "coordinates", s),
        ("google_maps_location_id", "google-maps-location-id", s),
    ]),
    # testimonies: csv has claim/context, no title/description -> description<-claim
    ("testimonies", "testimonies", "testimony", "summary", [
        ("description", "claim", s), ("summary", "summary", s),
        ("date", "date", ts), ("event", "event", s), ("witness", "witness", s),
        ("organization", "organization", s),
    ]),
    ("artifacts", "artifacts", "artifact", "name", [
        ("name", "name", s), ("description", "description", s),
        ("origin", "origin", s), ("date", "date", ts),
        ("images", "images", arr),  # 'photos' col folded below if images empty
    ]),
    # users/app tables
    ("users", "users", None, None, [
        ("auth_id", "external_id", s), ("email", "email", s), ("name", "name", s),
    ]),
    ("user_notes", "user-notes", None, None, [
        ("user", "user", s), ("note_title", "name", s), ("note", "content", s),
    ]),
    ("mindmaps", "mindmaps", None, None, [
        ("user", "user", s), ("graph_data", "json", jsonb),
    ]),
    ("summary_files", "summary-files", None, None, [
        ("document", "document", s), ("content", "content", s),
    ]),
    # junctions
    ("event_subject_matter_experts", "event-subject-matter-experts", None, None, [
        ("event", "event", s), ("subject_matter_expert", "subject-matter-expert", s),
    ]),
    ("topic_subject_matter_experts", "topic-subject-matter-experts", None, None, [
        ("topic", "topic", s), ("subject_matter_expert", "subject-matter-expert", s),
    ]),
    ("organization_members", "organization-members", None, None, [
        ("member", "member", s), ("organization", "organization", s),
    ]),
    ("topics_testimonies", "topics-testimonies", None, None, [
        ("topic", "topic", s), ("testimony", "testimony", s),
    ]),
    ("event_topic_subject_matter_experts", "event-topic-subject-matter-experts", None, None, [
        ("event", "event", s), ("topic", "topic", s),
        ("subject_matter_expert", "subject-matter-expert", s),
    ]),
    # user_saved_* (drop note/note-title; schema only has user/<entity>/theory)
    ("user_saved_events", "user-saved-events", None, None, [
        ("user", "user", s), ("event", "event", s), ("theory", "theory", s),
    ]),
    ("user_saved_topics", "user-saved-topics", None, None, [
        ("user", "user", s), ("topic", "topic", s), ("theory", "theory", s),
    ]),
    ("user_saved_organizations", "user-saved-organizations", None, None, [
        ("user", "user", s), ("organization", "organization", s), ("theory", "theory", s),
    ]),
    ("user_saved_sightings", "user-saved-sightings", None, None, [
        ("user", "user", s), ("sighting", "sighting", s), ("theory", "theory", s),
    ]),
    ("user_saved_testimonies", "user-saved-testimonies", None, None, [
        ("user", "user", s), ("testimony", "testimony", s), ("theory", "theory", s),
    ]),
    ("user_saved_key_figure", "user-saved-key-figure", None, None, [
        ("user", "user", s), ("key_figure", "key-figure", s), ("theory", "theory", s),
    ]),
]

# composite-key dedup for junctions (no meaningful single id beyond rec_*)
JUNCTION_KEYS = {
    "event_subject_matter_experts": ("event", "subject_matter_expert"),
    "topic_subject_matter_experts": ("topic", "subject_matter_expert"),
    "organization_members": ("member", "organization"),
    "topics_testimonies": ("topic", "testimony"),
    "event_topic_subject_matter_experts": ("event", "topic", "subject_matter_expert"),
}


def parse_table(spec):
    """Return (rows, raw_count, dup_skipped, header_echo) for one table spec."""
    table, csv_file, _ntype, _lsrc, cols = spec
    path = EXPORTS / f"{csv_file}.csv"
    rows, seen = [], set()
    raw = dup = echo = 0
    junc_key = JUNCTION_KEYS.get(table)
    with open(path, newline="") as fh:
        for r in csv.DictReader(fh):
            rid = (r.get("id") or "").strip()
            if rid == "id":            # interior header-echo row
                echo += 1
                continue
            if not rid:
                continue
            raw += 1
            # dedup key: composite for junctions, else rec_* id
            if junc_key:
                key = tuple((r.get(k.replace("_", "-")) or r.get(k) or "").strip()
                            for k in [c[1] for c in cols if c[0] in junc_key])
            else:
                key = rid
            if key in seen:
                dup += 1
                continue
            seen.add(key)
            out = {"id": rid}
            for db_col, csv_col, fn in cols:
                out[db_col] = fn(r.get(csv_col))
            # artifacts: fold photos into images when images empty
            if table == "artifacts" and out.get("images") is None:
                out["images"] = arr(r.get("photos"))
            rows.append(out)
    return rows, raw, dup, echo


def main():
    ap = argparse.ArgumentParser(description="SP1 CSV loader")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--dry-run", action="store_true")
    g.add_argument("--load", action="store_true")
    g.add_argument("--verify", action="store_true")
    ap.add_argument("--only", help="comma-sep table names to limit to")
    args = ap.parse_args()

    only = set(args.only.split(",")) if args.only else None
    specs = [t for t in TABLES if not only or t[0] in only]

    if args.dry_run:
        return dry_run(specs)
    if args.load:
        from db_ops import load as do_load
        return do_load(specs, parse_table)
    if args.verify:
        from db_ops import verify as do_verify
        return do_verify(EXPECTED)


def dry_run(specs):
    print(f"DRY RUN — exports: {EXPORTS}\n")
    print(f"{'table':<36}{'rows':>8}{'raw':>9}{'dups':>8}{'echo':>6}{'expect':>8}  ok")
    print("-" * 84)
    ids_by_type = {}
    ok_all = True
    for spec in specs:
        table, _f, ntype, lsrc, _c = spec
        try:
            rows, raw, dup, echo = parse_table(spec)
        except FileNotFoundError:
            print(f"{table:<36}{'MISSING FILE':>40}")
            ok_all = False
            continue
        exp = EXPECTED.get(table)
        ok = "" if exp is None else ("✓" if len(rows) == exp else "✗")
        if exp is not None and len(rows) != exp:
            ok_all = False
        print(f"{table:<36}{len(rows):>8}{raw:>9}{dup:>8}{echo:>6}"
              f"{(exp if exp is not None else ''):>8}  {ok}")
        if ntype:
            ids_by_type[ntype] = {r["id"] for r in rows}

    # node + edge projection (what --load would seed)
    node_ids = set()
    for ids in ids_by_type.values():
        node_ids |= ids
    print(f"\nnodes (entity rows across {len(ids_by_type)} types): {len(node_ids)}")

    edges = count_edges(specs, node_ids)
    print(f"edges (structural, both endpoints present): {edges}")
    print("\n" + ("ALL EXPECTED COUNTS MATCH ✓" if ok_all
                  else "SOME COUNTS DIVERGE ✗ — investigate above"))
    return 0 if ok_all else 1


# edge rel definitions: (table, src_col, dst_col, rel_type) — junctions + 3-way decompose
EDGE_DEFS = [
    ("event_subject_matter_experts", "event", "subject_matter_expert", "event_sme"),
    ("topic_subject_matter_experts", "topic", "subject_matter_expert", "topic_sme"),
    ("organization_members", "member", "organization", "member_of"),
    ("topics_testimonies", "topic", "testimony", "topic_testimony"),
    ("event_topic_subject_matter_experts", "event", "topic", "event_topic"),
    ("event_topic_subject_matter_experts", "event", "subject_matter_expert", "event_sme"),
    ("event_topic_subject_matter_experts", "topic", "subject_matter_expert", "topic_sme"),
    ("testimonies", "id", "event", "testifies_about"),
    ("testimonies", "id", "witness", "witnessed_by"),
    ("testimonies", "id", "organization", "testimony_org"),
]


def count_edges(specs, node_ids):
    by_table = {t[0]: t for t in specs}
    total = 0
    cache = {}
    for table, src_col, dst_col, _rel in EDGE_DEFS:
        if table not in by_table:
            continue
        if table not in cache:
            cache[table] = parse_table(by_table[table])[0]
        for r in cache[table]:
            src = r["id"] if src_col == "id" else r.get(src_col)
            dst = r.get(dst_col)
            if src and dst and src in node_ids and dst in node_ids:
                total += 1
    return total


if __name__ == "__main__":
    sys.exit(main())
