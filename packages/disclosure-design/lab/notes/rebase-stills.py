#!/usr/bin/env python3
"""Re-base the stills pixel dataset onto CURRENT on-disk paths.

The user moved/renamed files mid-flight. This script reconciles
notes/stills-pixel-sample.json (471 old records) with a fresh walk of the
vault and produces a rebased dataset where every record's `path` is a path
that exists on disk TODAY.

Match order per current file:
  1. exact relative path
  2. unique basename among old records
  3. exact byte-size among unmatched old records (renames keep content)
  4. otherwise NEW -> fresh Pillow sample via notes/sample-stills.py logic

Old records that match nothing are reported MISSING (deleted from disk).

Also detects byte-identical duplicate groups among current files.

Outputs (in notes/):
  stills-pixel-sample.json / .jsonl / .csv   (rebased in place)
  stills-cluster-summary.json                (recomputed on current paths)
  stills-vision-sample.json                  (paths rebased by basename)
  stills-rebase-report.json                  (moved/renamed/new/missing/dupes)
"""

from __future__ import annotations

import csv
import importlib.util
import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path("/Users/liamellis/Desktop/disclosure-design-references")
NOTES = ROOT / "notes"

spec = importlib.util.spec_from_file_location("sample_stills", NOTES / "sample-stills.py")
ss = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ss)


def load_old():
    data = json.loads((NOTES / "stills-pixel-sample.json").read_text(encoding="utf-8"))
    return data["stills"]


def main() -> int:
    old_recs = load_old()
    old_by_path = {r["path"]: r for r in old_recs}
    old_by_base: dict[str, list[dict]] = defaultdict(list)
    for r in old_recs:
        old_by_base[Path(r["path"]).name].append(r)

    current_paths = [p.relative_to(ROOT).as_posix() for p in ss.list_stills()]

    matched_old: set[str] = set()  # old paths consumed
    moved: list[dict] = []
    renamed: list[dict] = []
    new_files: list[str] = []
    records: list[dict] = []

    # pass 1+2: exact path, then unique basename
    deferred: list[str] = []
    for rel in current_paths:
        if rel in old_by_path and rel not in matched_old:
            rec = dict(old_by_path[rel])
            matched_old.add(rel)
            records.append(rec)
            continue
        base = Path(rel).name
        candidates = [r for r in old_by_base.get(base, []) if r["path"] not in matched_old]
        if len(candidates) == 1:
            rec = dict(candidates[0])
            moved.append({"from": rec["path"], "to": rel})
            rec["path"] = rel
            matched_old.add(candidates[0]["path"])
            records.append(rec)
            continue
        deferred.append(rel)

    # pass 3: byte-size match for renamed files
    unmatched_old = [r for r in old_recs if r["path"] not in matched_old]
    old_by_bytes: dict[int, list[dict]] = defaultdict(list)
    for r in unmatched_old:
        old_by_bytes[r.get("bytes", -1)].append(r)

    still_deferred: list[str] = []
    for rel in deferred:
        size = (ROOT / rel).stat().st_size
        candidates = [r for r in old_by_bytes.get(size, []) if r["path"] not in matched_old]
        if len(candidates) == 1:
            rec = dict(candidates[0])
            renamed.append({"from": rec["path"], "to": rel, "bytes": size})
            rec["path"] = rel
            matched_old.add(candidates[0]["path"])
            records.append(rec)
        else:
            still_deferred.append(rel)

    # pass 4: genuinely new files -> fresh sample
    for rel in still_deferred:
        try:
            rec = ss.sample_image(ROOT / rel)
            rec["vision_sampled"] = False
            rec["vision_pass"] = None
            records.append(rec)
            new_files.append(rel)
        except Exception as exc:  # noqa: BLE001
            records.append({"path": rel, "ok": False, "error": f"{type(exc).__name__}: {exc}",
                            "cluster": ss.cluster_key(rel)})
            new_files.append(rel)

    missing = [r["path"] for r in old_recs if r["path"] not in matched_old]

    # dupe detection among current files (byte-identical)
    by_bytes: dict[int, list[str]] = defaultdict(list)
    for rel in current_paths:
        by_bytes[(ROOT / rel).stat().st_size].append(rel)
    dupes = [sorted(v) for v in by_bytes.values() if len(v) > 1]

    # recompute clusters on current paths
    for rec in records:
        if rec.get("ok"):
            rec["cluster"] = ss.cluster_key(rec["path"])
    clusters: dict[str, list[dict]] = defaultdict(list)
    for rec in records:
        clusters[rec["cluster"]].append(rec)
    cluster_summary = []
    for name, recs in sorted(clusters.items(), key=lambda kv: -len(kv[1])):
        ok_recs = [r for r in recs if r.get("ok")]
        cluster_summary.append({
            "cluster": name,
            "n": len(recs),
            "vision_n": sum(1 for r in recs if r.get("vision_sampled")),
            "mean_luma": round(sum(r["mean_luma"] for r in ok_recs) / max(len(ok_recs), 1), 1),
            "files": sorted(r["path"] for r in recs),
        })

    # rebase vision-sample path lists by basename
    vision = json.loads((NOTES / "stills-vision-sample.json").read_text(encoding="utf-8"))
    cur_by_base: dict[str, str] = {}
    for rel in current_paths:
        cur_by_base.setdefault(Path(rel).name, rel)
    def rebase_vp(p: str) -> str:
        return cur_by_base.get(Path(p).name, p)
    vision["this_pass"] = sorted({rebase_vp(p) for p in vision["this_pass"]})
    vision["prior_19"] = sorted({rebase_vp(p) for p in vision["prior_19"]})
    (NOTES / "stills-vision-sample.json").write_text(json.dumps(vision, indent=1), encoding="utf-8")

    # write rebased pixel sample (json + jsonl + csv)
    records.sort(key=lambda r: r["path"].lower())
    payload = {
        "generated": "2026-08-13",
        "rebased": True,
        "root": str(ROOT),
        "count": len(records),
        "ok_count": sum(1 for r in records if r.get("ok")),
        "error_count": sum(1 for r in records if not r.get("ok")),
        "errors": [r for r in records if not r.get("ok")],
        "stills": records,
        "clusters": cluster_summary,
        "vision_total_unique": len(set(vision["this_pass"]) | set(vision["prior_19"])),
    }
    (NOTES / "stills-pixel-sample.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    with (NOTES / "stills-pixel-sample.jsonl").open("w", encoding="utf-8") as fh:
        for rec in records:
            fh.write(json.dumps(rec, separators=(",", ":")) + "\n")
    fieldnames = ["path", "ok", "cluster", "width", "height", "bytes", "format", "median",
                  "dominant", "chroma_peak", "mean_luma", "swatch_1", "swatch_2", "swatch_3",
                  "swatch_4", "swatch_5", "error"]
    with (NOTES / "stills-pixel-sample.csv").open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for rec in records:
            sw = rec.get("swatches") or []
            writer.writerow({
                "path": rec.get("path"), "ok": rec.get("ok"), "cluster": rec.get("cluster"),
                "width": rec.get("width"), "height": rec.get("height"), "bytes": rec.get("bytes"),
                "format": rec.get("format"), "median": rec.get("median"),
                "dominant": rec.get("dominant"), "chroma_peak": rec.get("chroma_peak"),
                "mean_luma": rec.get("mean_luma"),
                **{f"swatch_{i+1}": (sw[i]["hex"] if len(sw) > i else "") for i in range(5)},
                "error": rec.get("error", ""),
            })
    (NOTES / "stills-cluster-summary.json").write_text(json.dumps(cluster_summary, indent=1), encoding="utf-8")

    report = {
        "generated": "2026-08-13",
        "current_on_disk": len(current_paths),
        "old_records": len(old_recs),
        "unchanged": len(records) - len(moved) - len(renamed) - len(new_files),
        "moved": moved,
        "renamed": renamed,
        "new": new_files,
        "missing": missing,
        "dupe_groups": dupes,
        "clusters": len(cluster_summary),
    }
    (NOTES / "stills-rebase-report.json").write_text(json.dumps(report, indent=1), encoding="utf-8")

    print(json.dumps({
        "current": len(current_paths), "old": len(old_recs),
        "unchanged": report["unchanged"], "moved": len(moved), "renamed": len(renamed),
        "new": len(new_files), "missing": len(missing),
        "dupe_groups": len(dupes), "clusters": len(cluster_summary),
    }, indent=1))
    if missing:
        print("MISSING:", json.dumps(missing, indent=1))
    if new_files:
        print("NEW:", json.dumps(new_files, indent=1))
    if renamed:
        print("RENAMED:", json.dumps(renamed, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
