#!/usr/bin/env python3
"""Staged entity resolution CLI. Routed by main.sh as:

  dy load-mentions [PATH ...] [--include-failed] [--commit]
  dy resolve [--recheck] [--commit]
  dy review [--table key_figures]
  dy apply [--commit]

load/resolve/apply are DRY RUNS unless --commit: they run inside a transaction
and roll back, printing what would change. review commits each decision.
Target is DATABASE_URL (falls back to packages/db/.env = the shared Neon DB).
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from lib.db import connect  # noqa: E402
from lib.entity_resolution import mentions as mentions_mod  # noqa: E402
from lib.entity_resolution import store  # noqa: E402

KB_ROOT = ROOT.parent.parent / "packages" / "knowledge-base"


def _finish(conn, commit: bool, result: dict) -> None:
    if commit:
        conn.commit()
        result["committed"] = True
    else:
        conn.rollback()
        result["committed"] = False
        result["note"] = "dry run: rolled back; pass --commit to write"
    print(json.dumps(result, indent=2, default=str))


def cmd_load(args) -> None:
    paths = [Path(p) for p in args.paths] or sorted(KB_ROOT.glob("sources/**/*_rag_pipeline.json"))
    verdicts = mentions_mod.DEFAULT_VERDICTS | ({"fail"} if args.include_failed else set())
    found = []
    for p in paths:
        p = p.resolve()
        kb_root = KB_ROOT if KB_ROOT in p.parents else None
        found.extend(mentions_mod.extract_mentions(p, kb_root, frozenset(verdicts)))
    run_id = store.new_run_id("load")
    with connect() as conn:
        stats = store.load_mentions(conn, found, run_id)
        _finish(conn, args.commit, {"run_id": run_id, "files": len(paths), "mentions": len(found), **stats})


def cmd_resolve(args) -> None:
    statuses = ("pending", "needs_review") if args.recheck else ("pending",)
    run_id = store.new_run_id("resolve")
    with connect() as conn:
        stats = store.resolve_pending(conn, run_id, statuses)
        _finish(conn, args.commit, {"run_id": run_id, **stats})


def cmd_review(args) -> None:
    from lib.entity_resolution.review_cli import run_review
    run_id = store.new_run_id("review")
    with connect() as conn:
        stats = run_review(conn, run_id, args.table)
        print(json.dumps({"run_id": run_id, **stats}, indent=2))


def cmd_apply(args) -> None:
    run_id = store.new_run_id("apply")
    with connect() as conn:
        result = store.apply_decisions(conn, run_id)
        _finish(conn, args.commit, {"run_id": run_id, **result})


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("load-mentions", help="queue NER mentions from *_rag_pipeline.json as pending")
    p.add_argument("paths", nargs="*", help="pipeline JSON files (default: every one under the KB)")
    p.add_argument("--include-failed", action="store_true", help="also load chunks whose validation verdict is fail")
    p.add_argument("--commit", action="store_true")
    p.set_defaults(func=cmd_load)

    p = sub.add_parser("resolve", help="auto-match exact aliases; queue the rest for review")
    p.add_argument("--recheck", action="store_true", help="also re-resolve needs_review mentions")
    p.add_argument("--commit", action="store_true")
    p.set_defaults(func=cmd_resolve)

    p = sub.add_parser("review", help="decide needs_review mentions interactively")
    p.add_argument("--table", help="only this entity table")
    p.set_defaults(func=cmd_review)

    p = sub.add_parser("apply", help="create entities for `new` decisions; stamp applied_at")
    p.add_argument("--commit", action="store_true")
    p.set_defaults(func=cmd_apply)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
