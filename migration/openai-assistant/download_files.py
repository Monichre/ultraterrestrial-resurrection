#!/usr/bin/env python3
"""
Download all files from the OpenAI vector store.

Usage:
    export OPENAI_API_KEY=sk-...
    python3 download_files.py [--workers 10] [--output-dir files/]

Reads vector_store_files_metadata.json and downloads each file's content
from the OpenAI Files API, preserving original filenames with dedup.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from collections import Counter

SCRIPT_DIR = Path(__file__).parent
METADATA_FILE = SCRIPT_DIR / "vector_store_files_metadata.json"
DEFAULT_OUTPUT = SCRIPT_DIR / "files"
PROGRESS_FILE = SCRIPT_DIR / "download_progress.json"


def load_metadata():
    with open(METADATA_FILE) as f:
        return json.load(f)


def load_progress():
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            return set(json.load(f))
    return set()


def save_progress(completed_ids):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(sorted(completed_ids), f)


def dedup_filename(output_dir: Path, filename: str, file_id: str) -> Path:
    """Generate unique filename, appending file_id prefix if collision."""
    target = output_dir / filename
    if not target.exists():
        return target
    stem = target.stem
    suffix = target.suffix
    return output_dir / f"{stem}_{file_id[:8]}{suffix}"


def download_file(api_key: str, file_meta: dict, output_dir: Path) -> dict:
    """Download a single file from OpenAI Files API."""
    file_id = file_meta["id"]
    filename = file_meta.get("filename", f"{file_id}.bin")

    target = dedup_filename(output_dir, filename, file_id)

    url = f"https://api.openai.com/v1/files/{file_id}/content"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {api_key}"
    })

    retries = 3
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                content = resp.read()
            target.write_bytes(content)
            return {"id": file_id, "filename": str(target.name), "size": len(content), "status": "ok"}
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = min(2 ** attempt * 2, 30)
                time.sleep(wait)
                continue
            return {"id": file_id, "filename": filename, "error": f"HTTP {e.code}: {e.reason}", "status": "failed"}
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return {"id": file_id, "filename": filename, "error": str(e), "status": "failed"}

    return {"id": file_id, "filename": filename, "error": "max retries", "status": "failed"}


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Download OpenAI vector store files")
    parser.add_argument("--workers", type=int, default=10, help="Parallel download workers")
    parser.add_argument("--output-dir", type=str, default=str(DEFAULT_OUTPUT))
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: Set OPENAI_API_KEY environment variable")
        sys.exit(1)

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    metadata = load_metadata()
    completed_ids = load_progress()

    # Filter to only assistants-purpose files that haven't been downloaded
    to_download = [m for m in metadata if m["id"] not in completed_ids and m.get("purpose") == "assistants"]
    if not to_download:
        # Fallback: download all if none match assistants purpose
        to_download = [m for m in metadata if m["id"] not in completed_ids]

    print(f"Total files: {len(metadata)}")
    print(f"Already downloaded: {len(completed_ids)}")
    print(f"Remaining: {len(to_download)}")
    print(f"Output: {output_dir}")
    print(f"Workers: {args.workers}")
    print()

    if not to_download:
        print("Nothing to download!")
        return

    results = []
    failed = []
    start = time.time()

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(download_file, api_key, meta, output_dir): meta
            for meta in to_download
        }

        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            results.append(result)

            if result["status"] == "ok":
                completed_ids.add(result["id"])
            else:
                failed.append(result)

            if i % 50 == 0 or i == len(to_download):
                elapsed = time.time() - start
                rate = i / elapsed if elapsed > 0 else 0
                print(f"  [{i}/{len(to_download)}] {rate:.1f} files/sec, {len(failed)} errors", flush=True)
                save_progress(completed_ids)

    save_progress(completed_ids)

    # Summary
    elapsed = time.time() - start
    ok = sum(1 for r in results if r["status"] == "ok")
    total_bytes = sum(r.get("size", 0) for r in results if r["status"] == "ok")

    print(f"\nDone in {elapsed:.0f}s")
    print(f"Downloaded: {ok}/{len(to_download)} ({total_bytes / 1024 / 1024:.1f} MB)")
    if failed:
        print(f"Failed: {len(failed)}")
        for f in failed[:10]:
            print(f"  {f['filename']}: {f['error']}")

    # Save results
    with open(SCRIPT_DIR / "download_results.json", "w") as f:
        json.dump(results, f, indent=2)


if __name__ == "__main__":
    main()
