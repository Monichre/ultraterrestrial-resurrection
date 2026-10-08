#!/usr/bin/env python3
"""Pixel-sample every png/jpg/webp still in the vault. Stream JSONL, then JSON+CSV."""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageStat

ROOT = Path("/Users/liamellis/Desktop/disclosure-design-references")
OUT_DIR = ROOT / "notes"
EXTS = {".png", ".jpg", ".jpeg", ".webp"}
SKIP_DIR_NAMES = {".git", "node_modules", ".ok", ".specstory"}
THUMB = 160
N_SWATCHES = 5
QUANT = 8


def hex_rgb(rgb: tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def luma(rgb: tuple[int, int, int]) -> float:
    r, g, b = rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def sat(rgb: tuple[int, int, int]) -> float:
    r, g, b = [c / 255.0 for c in rgb]
    mx, mn = max(r, g, b), min(r, g, b)
    if mx <= 0:
        return 0.0
    return (mx - mn) / mx


def dist2(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return sum((x - y) ** 2 for x, y in zip(a, b))


def cluster_key(rel: str) -> str:
    if rel.startswith("design/") or rel.startswith("vision/"):
        return f"dir:{Path(rel).parent.as_posix()}"
    name = Path(rel).name
    if name.startswith("u7869492466_"):
        stem = name[len("u7869492466_") :]
        m = re.search(r"_[0-9a-f]{8}-[0-9a-f]{4}-", stem, re.I)
        if m:
            stem = stem[: m.start()]
        return "mj:" + stem[:80]
    if name.startswith("Liam_Ellis_"):
        stem = name[len("Liam_Ellis_") :]
        m = re.search(r"_[0-9a-f]{8}-[0-9a-f]{4}-", stem, re.I)
        if m:
            stem = stem[: m.start()]
        return "le:" + stem[:80]
    if name.startswith("cosmic-portals"):
        return "root:cosmic-portals"
    if name.upper().startswith("IMG_"):
        return "root:phone-jpg"
    if name.endswith(".webp") and re.match(r"^\d+-img-", name):
        return "root:numbered-webp"
    return f"root:other:{name[:48]}"


def list_stills() -> list[Path]:
    out: list[Path] = []
    for p in ROOT.rglob("*"):
        if not p.is_file():
            continue
        parts = p.relative_to(ROOT).parts
        if any(part.startswith(".") or part in SKIP_DIR_NAMES for part in parts[:-1]):
            continue
        if p.suffix.lower() in EXTS:
            out.append(p)
    return sorted(out, key=lambda x: x.relative_to(ROOT).as_posix().lower())


def sample_image(path: Path) -> dict:
    rel = path.relative_to(ROOT).as_posix()
    rec: dict = {
        "path": rel,
        "bytes": path.stat().st_size,
        "cluster": cluster_key(rel),
        "ok": False,
    }
    with Image.open(path) as im:
        rec["format"] = im.format
        rec["mode"] = im.mode
        rec["width"], rec["height"] = im.size
        rgb = im.convert("RGB")
        thumb = rgb.copy()
        thumb.thumbnail((THUMB, THUMB), Image.Resampling.BOX)
        median = ImageStat.Stat(thumb).median
        rec["median"] = hex_rgb(tuple(median))
        rec["mean_luma"] = round(luma(tuple(int(x) for x in ImageStat.Stat(thumb).mean)), 1)
        q = thumb.quantize(colors=QUANT, method=Image.Quantize.MEDIANCUT)
        palette = q.getpalette() or []
        counts: dict[int, int] = defaultdict(int)
        for idx in q.getdata():
            counts[int(idx)] += 1
        total = sum(counts.values()) or 1
        ranked = sorted(counts.items(), key=lambda kv: -kv[1])
        swatches: list[dict] = []
        used: list[tuple[int, int, int]] = []
        for idx, n in ranked:
            r, g, b = palette[idx * 3 : idx * 3 + 3]
            rgb_t = (int(r), int(g), int(b))
            if any(dist2(rgb_t, u) < 18 * 18 * 3 for u in used):
                continue
            used.append(rgb_t)
            swatches.append(
                {
                    "hex": hex_rgb(rgb_t),
                    "share": round(n / total, 4),
                    "sat": round(sat(rgb_t), 3),
                    "luma": round(luma(rgb_t), 1),
                }
            )
            if len(swatches) >= N_SWATCHES:
                break
        rec["dominant"] = swatches[0]["hex"] if swatches else rec["median"]
        chroma = max(swatches, key=lambda s: s["sat"] * (0.25 + s["share"]), default=None)
        rec["chroma_peak"] = chroma["hex"] if chroma else rec["median"]
        rec["swatches"] = swatches
        rec["ok"] = True
    return rec


def main() -> int:
    stills = list_stills()
    jsonl_path = OUT_DIR / "stills-pixel-sample.jsonl"
    json_path = OUT_DIR / "stills-pixel-sample.json"
    csv_path = OUT_DIR / "stills-pixel-sample.csv"
    errors: list[dict] = []
    rows: list[dict] = []

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with jsonl_path.open("w", encoding="utf-8") as stream:
        for i, path in enumerate(stills, 1):
            try:
                rec = sample_image(path)
            except Exception as exc:  # noqa: BLE001 — catalog corrupt files
                rec = {
                    "path": path.relative_to(ROOT).as_posix(),
                    "ok": False,
                    "error": f"{type(exc).__name__}: {exc}",
                    "cluster": cluster_key(path.relative_to(ROOT).as_posix()),
                }
                errors.append(rec)
            rows.append(rec)
            stream.write(json.dumps(rec, separators=(",", ":")) + "\n")
            if i % 25 == 0 or i == len(stills):
                print(f"{i}/{len(stills)}", rec.get("path", ""), rec.get("dominant", rec.get("error")), flush=True)

    payload = {
        "generated": "2026-08-13",
        "root": str(ROOT),
        "count": len(rows),
        "ok_count": sum(1 for r in rows if r.get("ok")),
        "error_count": len(errors),
        "errors": errors,
        "stills": rows,
    }
    json_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    fieldnames = [
        "path",
        "ok",
        "cluster",
        "width",
        "height",
        "bytes",
        "format",
        "median",
        "dominant",
        "chroma_peak",
        "mean_luma",
        "swatch_1",
        "swatch_2",
        "swatch_3",
        "swatch_4",
        "swatch_5",
        "error",
    ]
    with csv_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for rec in rows:
            sw = rec.get("swatches") or []
            writer.writerow(
                {
                    "path": rec.get("path"),
                    "ok": rec.get("ok"),
                    "cluster": rec.get("cluster"),
                    "width": rec.get("width"),
                    "height": rec.get("height"),
                    "bytes": rec.get("bytes"),
                    "format": rec.get("format"),
                    "median": rec.get("median"),
                    "dominant": rec.get("dominant"),
                    "chroma_peak": rec.get("chroma_peak"),
                    "mean_luma": rec.get("mean_luma"),
                    "swatch_1": sw[0]["hex"] if len(sw) > 0 else "",
                    "swatch_2": sw[1]["hex"] if len(sw) > 1 else "",
                    "swatch_3": sw[2]["hex"] if len(sw) > 2 else "",
                    "swatch_4": sw[3]["hex"] if len(sw) > 3 else "",
                    "swatch_5": sw[4]["hex"] if len(sw) > 4 else "",
                    "error": rec.get("error", ""),
                }
            )
    print(json.dumps({"ok_count": payload["ok_count"], "error_count": payload["error_count"], "count": payload["count"]}))
    return 0 if payload["ok_count"] == payload["count"] else 1


if __name__ == "__main__":
    sys.exit(main())
