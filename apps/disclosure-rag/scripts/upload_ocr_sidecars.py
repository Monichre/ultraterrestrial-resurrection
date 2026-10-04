#!/usr/bin/env python3
"""Upload OCR sidecar .txt files for the 25 ready_for_reupload gap entries
to the OpenAI vector store (UFO_DATA_STORE_ID).

Reads packages/knowledge-base/metadata/vector-store-gap-report.json, uploads
each .txt sidecar via files.create + vector_stores.files.create, and writes
an upload-results sidecar next to the gap report.

Dry run:  python scripts/upload_ocr_sidecars.py --dry-run
Live:     python scripts/upload_ocr_sidecars.py
"""
import json
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

REPO_ROOT = Path(__file__).resolve().parents[3]
GAP_REPORT = REPO_ROOT / "packages/knowledge-base/metadata/vector-store-gap-report.json"
SIDECAR_DIR = REPO_ROOT / "packages/knowledge-base/derived/ocr/gap"
RESULTS_OUT = REPO_ROOT / "packages/knowledge-base/metadata/vector-store-upload-results.json"

API_KEY = os.environ.get("OPENAI_API_KEY")
STORE_ID = os.environ.get("UFO_DATA_STORE_ID")

DRY = "--dry-run" in sys.argv


def main() -> int:
    if not API_KEY:
        print("ERROR: OPENAI_API_KEY not set", file=sys.stderr)
        return 2
    if not STORE_ID:
        print("ERROR: UFO_DATA_STORE_ID not set", file=sys.stderr)
        return 2

    with GAP_REPORT.open() as f:
        report = json.load(f)

    ready = [e for e in report["entries"] if e.get("ocr_status") == "ready_for_reupload"]

    # Dedupe by OCR sha256 — some gap entries point at the same underlying
    # document (e.g. "Eric Davis meeting with Adm Wilson.pdf" and
    # "Eric-Davis-meeting-with-Adm-Wilson.pdf"; the HHRG-118 SD003 pair;
    # the Lodge of Light / Bulletin no 2 pair). Upload each unique text once;
    # record every source filename against it.
    by_sha: dict[str, list[dict]] = {}
    for e in ready:
        by_sha.setdefault(e["ocr"]["sha256"], []).append(e)

    # Pick the first sidecar path per sha group as the file to upload.
    unique = sorted(by_sha.items(), key=lambda kv: kv[1][0]["ocr"]["sidecar"])
    print(f"Store:  {STORE_ID}")
    print(f"Ready:  {len(ready)} gap entries -> {len(unique)} unique texts (sha256-deduped)")
    print(f"Mode:   {'DRY-RUN' if DRY else 'LIVE'}")
    print()

    if DRY:
        for sha, group in unique:
            name = group[0]["ocr"]["sidecar"].split("gap/")[-1]
            sidecar = SIDECAR_DIR / name
            exists = sidecar.exists()
            size = sidecar.stat().st_size if exists else 0
            sources = ", ".join(e["filename"] for e in group)
            print(f"  [{'OK' if exists else 'MISSING'}] {name}  {size:>7} B  <- {sources}")
        print(f"\nDry run complete. {len(unique)} unique files would be uploaded.")
        return 0

    client = OpenAI(api_key=API_KEY)

    results = []
    ok = 0
    failed = 0

    for i, (sha, group) in enumerate(unique, 1):
        name = group[0]["ocr"]["sidecar"].split("gap/")[-1]
        sidecar = SIDECAR_DIR / name
        if not sidecar.exists():
            print(f"[{i:>2}/{len(unique)}] MISSING  {name}  -> skip")
            for e in group:
                results.append({
                    "source_filename": e["filename"],
                    "sidecar": str(sidecar),
                    "status": "sidecar_missing",
                })
            failed += len(group)
            continue

        print(f"[{i:>2}/{len(unique)}] Uploading {name} ({sidecar.stat().st_size} B) ... ", end="", flush=True)
        try:
            with sidecar.open("rb") as fh:
                file_resp = client.files.create(file=fh, purpose="assistants")
            vs_file = client.vector_stores.files.create(
                vector_store_id=STORE_ID,
                file_id=file_resp.id,
            )
            print(f"OK  file={file_resp.id}  vs_file={vs_file.id}")
            for e in group:
                results.append({
                    "source_filename": e["filename"],
                    "sidecar": str(sidecar),
                    "sidecar_sha256": sha,
                    "openai_file_id": file_resp.id,
                    "vector_store_file_id": vs_file.id,
                    "status": "uploaded_and_indexed",
                })
            ok += len(group)
        except Exception as exc:
            print(f"FAIL  {exc}")
            for e in group:
                results.append({
                    "source_filename": e["filename"],
                    "sidecar": str(sidecar),
                    "status": "failed",
                    "error": str(exc),
                })
            failed += len(group)

        # be gentle
        time.sleep(0.5)

    summary = {
        "store": STORE_ID,
        "uploaded_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "total": len(ready),
        "ok": ok,
        "failed": failed,
        "results": results,
    }
    RESULTS_OUT.write_text(json.dumps(summary, indent=2))
    print()
    print(f"Done. ok={ok}  failed={failed}  total={len(ready)}")
    print(f"Results: {RESULTS_OUT}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
