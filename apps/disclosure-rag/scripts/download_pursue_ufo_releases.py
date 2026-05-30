#!/usr/bin/env python3
"""Download all official PURSUE / war.gov UFO release bundles.

Targets the public Department of War PURSUE page:
  https://www.war.gov/ufo/

The site is Akamai-protected and rejects normal curl/requests from this host.
This script uses curl_cffi browser TLS impersonation, saves the official CSV
manifest, downloads the public release bundle ZIPs, extracts them safely, and
writes verification summaries.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import shutil
import sys
import time
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse

try:
    from curl_cffi import requests
except Exception as exc:  # pragma: no cover
    raise SystemExit(
        "curl_cffi is required because war.gov blocks normal curl/requests. "
        "Install with: python3 -m pip install --user curl_cffi\n"
        f"Original import error: {exc}"
    )

DEFAULT_OUT = Path(
    "/Users/liamellis/Desktop/01_ACTIVE/ultraterrestrial-resurrection/apps/disclosure-rag/data/government/pursue_war_gov"
)

PURSUE_URL = "https://www.war.gov/ufo/"
CSV_URL = "https://www.war.gov/Portals/1/Interactive/2026/UFO/uap-data.csv"

BUNDLES = [
    {
        "release": "release_01",
        "kind": "documents",
        "url": "https://www.war.gov/medialink/ufo/bundle/Release_1.zip",
        "filename": "Release_1.zip",
        "expected_bytes": 1223976178,
    },
    {
        "release": "release_01",
        "kind": "videos",
        "url": "https://d34w7g4gy10iej.cloudfront.net/uapvideos.zip",
        "filename": "uapvideos.zip",
        "expected_bytes": 1334665058,
    },
    {
        "release": "release_02",
        "kind": "documents",
        "url": "https://www.war.gov/medialink/ufo/052226/release_02/release_02_document_bundle.zip",
        "filename": "release_02_document_bundle.zip",
        "expected_bytes": 69986448,
    },
    {
        "release": "release_02",
        "kind": "videos",
        "url": "https://d34w7g4gy10iej.cloudfront.net/uap052226.zip",
        "filename": "uap052226.zip",
        "expected_bytes": 5644377817,
    },
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/zip,application/octet-stream,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": PURSUE_URL,
}


@dataclass
class DownloadResult:
    name: str
    url: str
    path: str
    expected_bytes: int | None
    actual_bytes: int
    sha256: str
    status: str


def log(message: str) -> None:
    print(time.strftime("[%Y-%m-%d %H:%M:%S]"), message, flush=True)


def chrome_get(url: str, *, headers: dict | None = None, stream: bool = False, timeout: int = 120):
    merged = dict(HEADERS)
    if headers:
        merged.update(headers)
    return requests.get(
        url,
        headers=merged,
        impersonate="chrome124",
        stream=stream,
        timeout=timeout,
        allow_redirects=True,
    )


def sha256_file(path: Path, chunk_size: int = 1024 * 1024 * 8) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()


def save_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def fetch_manifest(out_dir: Path) -> list[dict[str, str]]:
    metadata_dir = out_dir / "metadata"
    metadata_dir.mkdir(parents=True, exist_ok=True)

    log(f"Fetching official CSV manifest: {CSV_URL}")
    r = chrome_get(CSV_URL, headers={"Accept": "text/csv,*/*"}, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"CSV fetch failed: HTTP {r.status_code}; {r.text[:200]!r}")

    csv_bytes = r.content
    csv_path = metadata_dir / "uap-data.csv"
    csv_path.write_bytes(csv_bytes)
    csv_text = csv_bytes.decode("utf-8-sig", errors="replace")

    rows = list(csv.DictReader(csv_text.splitlines()))
    records = [dict(row) for row in rows if any((v or "").strip() for v in row.values())]

    records_path = metadata_dir / "records.json"
    records_path.write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding="utf-8")

    by_type: dict[str, int] = {}
    by_release: dict[str, int] = {}
    for rec in records:
        typ = (rec.get("Type") or "UNKNOWN").strip() or "UNKNOWN"
        rel = (rec.get("Release Date") or "UNKNOWN").strip() or "UNKNOWN"
        by_type[typ] = by_type.get(typ, 0) + 1
        by_release[rel] = by_release.get(rel, 0) + 1

    summary = {
        "source_page": PURSUE_URL,
        "csv_url": CSV_URL,
        "record_count": len(records),
        "by_type": by_type,
        "by_release": by_release,
        "fetched_at_epoch": int(time.time()),
    }
    (metadata_dir / "manifest_summary.json").write_text(
        json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    log(f"Manifest saved: {len(records)} records; by type {by_type}; by release {by_release}")
    return records


def download_file(url: str, dest: Path, expected_bytes: int | None = None) -> DownloadResult:
    dest.parent.mkdir(parents=True, exist_ok=True)
    part = dest.with_suffix(dest.suffix + ".part")

    if dest.exists() and expected_bytes and dest.stat().st_size == expected_bytes:
        digest = sha256_file(dest)
        log(f"Already complete: {dest.name} ({dest.stat().st_size:,} bytes)")
        return DownloadResult(dest.name, url, str(dest), expected_bytes, dest.stat().st_size, digest, "already_complete")

    mode = "wb"
    headers = {"Accept": "application/zip,application/octet-stream,*/*"}
    existing = part.stat().st_size if part.exists() else 0
    if existing:
        headers["Range"] = f"bytes={existing}-"
        mode = "ab"
        log(f"Resuming {dest.name} at {existing:,} bytes")
    else:
        log(f"Downloading {dest.name}")

    r = chrome_get(url, headers=headers, stream=True, timeout=300)
    if r.status_code not in (200, 206):
        body = b""
        try:
            body = r.content[:300]
        except Exception:
            pass
        raise RuntimeError(f"Download failed {dest.name}: HTTP {r.status_code}; {body!r}")

    if existing and r.status_code == 200:
        log(f"Server ignored Range for {dest.name}; restarting partial")
        mode = "wb"
        existing = 0

    total_header = r.headers.get("content-length")
    expected_total = expected_bytes or (int(total_header) + existing if total_header and total_header.isdigit() else None)
    downloaded = existing
    last_log = time.time()
    started = time.time()

    with part.open(mode + ("" if "b" in mode else "b")) as f:
        for chunk in r.iter_content(chunk_size=1024 * 1024 * 4):
            if not chunk:
                continue
            f.write(chunk)
            downloaded += len(chunk)
            now = time.time()
            if now - last_log >= 15:
                if expected_total:
                    pct = downloaded / expected_total * 100
                    log(f"  {dest.name}: {downloaded:,}/{expected_total:,} bytes ({pct:.1f}%)")
                else:
                    log(f"  {dest.name}: {downloaded:,} bytes")
                last_log = now

    part_size = part.stat().st_size
    if expected_bytes and part_size != expected_bytes:
        raise RuntimeError(
            f"Size mismatch for {dest.name}: expected {expected_bytes:,}, got {part_size:,}"
        )

    part.replace(dest)
    elapsed = max(time.time() - started, 0.001)
    digest = sha256_file(dest)
    log(f"Finished {dest.name}: {part_size:,} bytes, sha256={digest[:16]}..., {part_size/elapsed/1024/1024:.1f} MiB/s")
    return DownloadResult(dest.name, url, str(dest), expected_bytes, part_size, digest, "downloaded")


def safe_extract(zip_path: Path, dest_dir: Path) -> list[str]:
    dest_dir.mkdir(parents=True, exist_ok=True)
    extracted: list[str] = []
    root = dest_dir.resolve()
    with zipfile.ZipFile(zip_path) as zf:
        members = zf.infolist()
        log(f"Extracting {zip_path.name}: {len(members)} zip members -> {dest_dir}")
        for info in members:
            name = info.filename
            if not name or name.endswith("/"):
                continue
            target = (dest_dir / name).resolve()
            if root not in [target, *target.parents]:
                raise RuntimeError(f"Unsafe ZIP member path blocked: {name}")
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists() and target.stat().st_size == info.file_size:
                extracted.append(str(target))
                continue
            with zf.open(info) as src, target.open("wb") as dst:
                shutil.copyfileobj(src, dst, length=1024 * 1024 * 8)
            extracted.append(str(target))
    return extracted


def classify_files(paths: Iterable[Path]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for path in paths:
        if not path.is_file():
            continue
        ext = path.suffix.lower() or "[no_ext]"
        counts[ext] = counts.get(ext, 0) + 1
    return dict(sorted(counts.items()))


def build_readme(out_dir: Path, records: list[dict[str, str]], download_results: list[DownloadResult], extracted: dict[str, list[str]]) -> None:
    file_paths = [p for p in out_dir.rglob("*") if p.is_file()]
    extracted_paths = [p for p in file_paths if "/_archives/" not in str(p) and "/metadata/" not in str(p)]
    readme = f"""# PURSUE / war.gov UFO release archive

Source: {PURSUE_URL}

Downloaded by: scripts/download_pursue_ufo_releases.py
Downloaded at epoch: {int(time.time())}

## Official manifest

- CSV: metadata/uap-data.csv
- Parsed JSON: metadata/records.json
- Manifest rows: {len(records)}

## Official bundle archives

"""
    for result in download_results:
        rel = Path(result.path).relative_to(out_dir)
        readme += f"- {rel} — {result.actual_bytes:,} bytes — sha256 {result.sha256}\n"

    readme += "\n## Extracted payload summary\n\n"
    for key, files in extracted.items():
        readme += f"- {key}: {len(files)} files\n"

    readme += f"\nTotal extracted payload files: {len(extracted_paths)}\n"
    readme += f"Extracted file extensions: {json.dumps(classify_files(extracted_paths), indent=2)}\n"

    readme += "\n## Notes\n\n"
    readme += "- The war.gov document endpoints are Akamai-protected; normal curl returned 403 from this host. curl_cffi Chrome impersonation succeeded.\n"
    readme += "- The CloudFront video bundles were publicly accessible without the war.gov WAF hop.\n"
    readme += "- Archives are retained under _archives/ so the official originals remain reproducible.\n"

    save_text(out_dir / "README.md", readme)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--no-extract", action="store_true", help="Download archives/manifest only; do not extract ZIPs")
    parser.add_argument("--skip-download", action="store_true", help="Use existing archives and only extract/verify")
    args = parser.parse_args(argv)

    out_dir = args.out.expanduser().resolve()
    archives_dir = out_dir / "_archives"
    out_dir.mkdir(parents=True, exist_ok=True)

    usage = shutil.disk_usage(out_dir)
    log(f"Output: {out_dir}")
    log(f"Disk free before: {usage.free:,} bytes ({usage.free/1024/1024/1024:.1f} GiB)")

    records = fetch_manifest(out_dir)

    download_results: list[DownloadResult] = []
    for bundle in BUNDLES:
        dest = archives_dir / bundle["release"] / bundle["kind"] / bundle["filename"]
        if args.skip_download:
            if not dest.exists():
                raise FileNotFoundError(dest)
            download_results.append(
                DownloadResult(
                    dest.name,
                    bundle["url"],
                    str(dest),
                    bundle.get("expected_bytes"),
                    dest.stat().st_size,
                    sha256_file(dest),
                    "existing_skip_download",
                )
            )
        else:
            download_results.append(download_file(bundle["url"], dest, bundle.get("expected_bytes")))

        results_path = out_dir / "metadata" / "download_results.json"
        results_path.write_text(json.dumps([asdict(r) for r in download_results], indent=2), encoding="utf-8")

    extracted: dict[str, list[str]] = {}
    if not args.no_extract:
        for bundle in BUNDLES:
            archive = archives_dir / bundle["release"] / bundle["kind"] / bundle["filename"]
            dest_dir = out_dir / bundle["release"] / bundle["kind"]
            key = f"{bundle['release']}/{bundle['kind']}"
            extracted[key] = safe_extract(archive, dest_dir)

    (out_dir / "metadata" / "extraction_results.json").write_text(
        json.dumps(extracted, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    build_readme(out_dir, records, download_results, extracted)

    usage_after = shutil.disk_usage(out_dir)
    payload_files = [p for p in out_dir.rglob("*") if p.is_file() and "/_archives/" not in str(p) and "/metadata/" not in str(p)]
    archive_files = [p for p in (out_dir / "_archives").rglob("*") if p.is_file()] if (out_dir / "_archives").exists() else []

    summary = {
        "output_dir": str(out_dir),
        "official_manifest_records": len(records),
        "archive_count": len(archive_files),
        "archive_bytes": sum(p.stat().st_size for p in archive_files),
        "payload_file_count": len(payload_files),
        "payload_bytes": sum(p.stat().st_size for p in payload_files),
        "payload_extensions": classify_files(payload_files),
        "disk_free_after_bytes": usage_after.free,
        "download_results": [asdict(r) for r in download_results],
    }
    (out_dir / "metadata" / "verification_summary.json").write_text(
        json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    log("Verification summary:")
    log(json.dumps(summary, indent=2)[:4000])
    log("DONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
