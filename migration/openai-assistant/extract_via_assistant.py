#!/usr/bin/env python3
"""
Extract vector store file contents via the OpenAI Assistants API.

OpenAI blocks direct file downloads for purpose=assistants files.
This script uses the assistant's file_search to extract content
by querying specific filenames and capturing the cited text.

For text files (.txt, .md, .json): extracts full content via targeted queries.
For PDFs/DOCX: extracts searchable text content (may not capture images/formatting).

Usage:
    export OPENAI_API_KEY=sk-...
    python3 extract_via_assistant.py [--batch-size 20] [--output-dir files/]
"""

import json
import os
import sys
import time
from pathlib import Path
from openai import OpenAI

SCRIPT_DIR = Path(__file__).parent
METADATA_FILE = SCRIPT_DIR / "vector_store_files_metadata.json"
DEFAULT_OUTPUT = SCRIPT_DIR / "files"
PROGRESS_FILE = SCRIPT_DIR / "extract_progress.json"

ASSISTANT_ID = "asst_sdNxYC9p05iGpeKXtL496cyh"


def load_progress():
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"extracted": {}, "failed": [], "skipped": []}


def save_progress(progress):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f, indent=2)


def extract_file_content(client, filename, file_id, output_dir):
    """Use the assistant to read and output a file's content."""
    thread = client.beta.threads.create()

    try:
        # Ask the assistant to output the full content of a specific file
        prompt = (
            f'Output the COMPLETE, VERBATIM content of the file named "{filename}" '
            f"from your vector store. Do not summarize, analyze, or modify the content "
            f"in any way. Output the raw text exactly as it appears in the file. "
            f"If the file is very long, output as much as you can."
        )

        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=prompt,
        )

        run = client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id=ASSISTANT_ID,
            timeout=120,
        )

        if run.status != "completed":
            return None, f"Run status: {run.status}"

        messages = client.beta.threads.messages.list(thread_id=thread.id)
        content_parts = []
        citations = []

        for msg in messages.data:
            if msg.role == "assistant":
                for block in msg.content:
                    if hasattr(block, "text"):
                        content_parts.append(block.text.value)
                        if block.text.annotations:
                            for ann in block.text.annotations:
                                if hasattr(ann, "file_citation"):
                                    citations.append({
                                        "file_id": ann.file_citation.file_id,
                                        "quote": getattr(ann.file_citation, "quote", None),
                                    })

        full_content = "\n".join(content_parts)

        if not full_content.strip():
            return None, "Empty response"

        # Save the extracted content
        safe_filename = filename.replace("/", "_").replace("\\", "_")
        if safe_filename.startswith("_"):
            safe_filename = safe_filename.lstrip("_")

        output_path = output_dir / safe_filename
        output_path.write_text(full_content, encoding="utf-8")

        return str(output_path), None

    finally:
        try:
            client.beta.threads.delete(thread.id)
        except Exception:
            pass


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--batch-size", type=int, default=20)
    parser.add_argument("--output-dir", type=str, default=str(DEFAULT_OUTPUT))
    parser.add_argument("--file-types", type=str, default="txt,md,json",
                        help="Comma-separated file extensions to extract (default: txt,md,json)")
    parser.add_argument("--all-types", action="store_true",
                        help="Extract all file types including PDFs")
    args = parser.parse_args()

    client = OpenAI()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    with open(METADATA_FILE) as f:
        metadata = json.load(f)

    progress = load_progress()
    extracted_ids = set(progress["extracted"].keys())

    # Filter by file type
    allowed_exts = set(f".{e}" for e in args.file_types.split(",")) if not args.all_types else None

    to_extract = []
    for m in metadata:
        fid = m["id"]
        fn = m.get("filename", "")
        ext = Path(fn).suffix.lower()

        if fid in extracted_ids:
            continue
        if allowed_exts and ext not in allowed_exts:
            continue
        to_extract.append(m)

    print(f"Total files: {len(metadata)}")
    print(f"Already extracted: {len(extracted_ids)}")
    print(f"To extract this run: {len(to_extract)}")
    print(f"File types: {'all' if args.all_types else args.file_types}")
    print()

    if not to_extract:
        print("Nothing to extract!")
        return

    # Process in batches
    batch = to_extract[: args.batch_size]
    print(f"Processing batch of {len(batch)} files...")
    print()

    for i, m in enumerate(batch, 1):
        fid = m["id"]
        fn = m.get("filename", f"{fid}.txt")
        size = m.get("bytes", 0)

        print(f"[{i}/{len(batch)}] {fn} ({size} bytes)...", end=" ", flush=True)

        try:
            path, error = extract_file_content(client, fn, fid, output_dir)
            if error:
                print(f"FAILED: {error}")
                progress["failed"].append({"id": fid, "filename": fn, "error": error})
            else:
                extracted_size = os.path.getsize(path)
                print(f"OK ({extracted_size} bytes)")
                progress["extracted"][fid] = {
                    "filename": fn,
                    "output_path": str(path),
                    "extracted_size": extracted_size,
                    "original_size": size,
                }
        except Exception as e:
            print(f"ERROR: {e}")
            progress["failed"].append({"id": fid, "filename": fn, "error": str(e)})

        save_progress(progress)
        time.sleep(1)  # Rate limit courtesy

    print(f"\nBatch complete. Extracted: {len(progress['extracted'])}, Failed: {len(progress['failed'])}")
    print(f"Run again to continue extraction (progress is saved).")


if __name__ == "__main__":
    main()
