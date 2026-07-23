#!/usr/bin/env python3
"""
YouTube Playlist Ingestion Pipeline

Takes one or more YouTube podcast playlist URLs, enumerates every episode,
and drives each one through the full Disclosure RAG pipeline:

  playlist URL(s)
    -> episode enumeration (yt-dlp flat extraction, pytube fallback)
    -> transcript fetch (lib/youtube_transcript_enhanced, cookie-free)
    -> transcript parse + clean (lib/transcript_fidelity.clean_transcript)
    -> fidelity review (lib/transcript_fidelity.review_transcript, optional LLM pass)
    -> quality gate (fail/below threshold -> quarantined for human review)
    -> main.process_url() -> KB storage, Upstash sync, NER entity extraction,
       vectorization (--upload -> OpenAI vector store), CocoIndex knowledge
       graph, Mem0 memory

Every episode outcome is checkpointed to a state file, so re-running the same
playlist resumes where it left off. Per-episode transcripts and fidelity
reports are saved under data/playlist_ingestion/ alongside a markdown run
report.

Usage (from apps/disclosure-rag/, venv active, .env loaded):

  python scripts/playlist_ingestion.py <PLAYLIST_URL> [<PLAYLIST_URL> ...]
  python scripts/playlist_ingestion.py --from-file playlists.txt --upload
  python scripts/playlist_ingestion.py <URL> --limit 5 --dry-run
  python scripts/playlist_ingestion.py <URL> --llm-review --min-fidelity 0.6
  python scripts/playlist_ingestion.py <URL> --force        # reprocess all
"""

import argparse
import json
import logging
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.transcript_fidelity import clean_transcript, review_transcript

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("playlist_ingestion")

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "data" / "playlist_ingestion"
DEFAULT_STATE_FILE = OUTPUT_DIR / "state.json"

# Terminal states that --force is required to reprocess
DONE_STATUSES = {"ingested", "quarantined"}


# ---------------------------------------------------------------- enumeration

def enumerate_playlist(playlist_url: str) -> Dict[str, Any]:
    """Return {playlist_id, title, videos: [{video_id, url, title, duration}]}.

    Tries yt-dlp flat extraction first (fast, no downloads, includes per-entry
    durations), then falls back to pytube. A plain video URL is treated as a
    single-episode playlist.
    """
    try:
        import yt_dlp
        opts = {"quiet": True, "no_warnings": True, "extract_flat": "in_playlist", "skip_download": True}
        with yt_dlp.YoutubeDL(opts) as ydl:
            # process=False skips format resolution entirely — metadata only,
            # works for playlists AND single videos even on older yt-dlp
            info = ydl.extract_info(playlist_url, download=False, process=False)
        entries = info.get("entries")
        entries = list(entries) if entries is not None else [info]  # generator when process=False
        videos = []
        for e in entries:
            if not e:
                continue
            vid = e.get("id")
            if not vid:
                continue
            videos.append({
                "video_id": vid,
                "url": f"https://www.youtube.com/watch?v={vid}",
                "title": e.get("title") or vid,
                "duration": e.get("duration"),
                "uploader": e.get("uploader") or e.get("channel"),
            })
        return {
            "playlist_id": info.get("id") or "unknown",
            "title": info.get("title") or playlist_url,
            "videos": videos,
        }
    except Exception as e:
        logger.warning(f"yt-dlp enumeration failed ({e}); trying pytube")

    try:
        from pytube import Playlist
        pl = Playlist(playlist_url)
        videos = []
        for url in pl.video_urls:
            m = re.search(r"[?&]v=([\w-]{6,})", url)
            if m:
                videos.append({"video_id": m.group(1), "url": url, "title": m.group(1), "duration": None,
                               "uploader": None})
        return {"playlist_id": getattr(pl, "playlist_id", "unknown"),
                "title": getattr(pl, "title", playlist_url), "videos": videos}
    except Exception as e:
        logger.error(f"Could not enumerate playlist {playlist_url}: {e}")
        return {"playlist_id": "unknown", "title": playlist_url, "videos": []}


# ---------------------------------------------------------------- state

def load_state(state_file: Path) -> Dict[str, Any]:
    if state_file.exists():
        try:
            return json.loads(state_file.read_text())
        except Exception as e:
            logger.warning(f"State file unreadable, starting fresh: {e}")
    return {"videos": {}}


def save_state(state: Dict[str, Any], state_file: Path) -> None:
    state_file.parent.mkdir(parents=True, exist_ok=True)
    tmp = state_file.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2, ensure_ascii=False))
    tmp.replace(state_file)


def record(state: Dict[str, Any], video: Dict[str, Any], playlist_id: str, **fields) -> None:
    entry = state["videos"].setdefault(video["video_id"], {})
    entry.update({
        "title": video.get("title"),
        "url": video.get("url"),
        "playlist_id": playlist_id,
        "updated": datetime.now(timezone.utc).isoformat(),
        **fields,
    })


# ---------------------------------------------------------------- per-episode

def fetch_transcript(url: str) -> Optional[Dict[str, Any]]:
    """Fetch transcript + metadata via the cookie-free transcript-api path."""
    try:
        from lib.youtube_transcript_enhanced import get_metadata_and_transcript_api_first
        result = get_metadata_and_transcript_api_first(url)
        if result.get("ok") and result.get("transcript"):
            return result
        return None
    except Exception as e:
        logger.warning(f"Transcript fetch failed for {url}: {e}")
        return None


def process_episode(video: Dict[str, Any], playlist_id: str, state: Dict[str, Any],
                    args: argparse.Namespace, transcripts_dir: Path, reports_dir: Path) -> str:
    """Run one episode through fetch -> parse -> fidelity gate -> pipeline.

    Returns the resulting status string.
    """
    vid, url = video["video_id"], video["url"]

    fetched = fetch_transcript(url)
    if not fetched:
        record(state, video, playlist_id, status="no_transcript")
        return "no_transcript"

    raw_transcript = fetched["transcript"]
    cleaned = clean_transcript(raw_transcript)
    transcripts_dir.mkdir(parents=True, exist_ok=True)
    (transcripts_dir / f"{vid}.txt").write_text(
        f"{fetched.get('title') or video['title']}\n{url}\n\n{cleaned}", encoding="utf-8")

    fidelity = review_transcript(
        transcript=raw_transcript,
        video_id=vid,
        segments=fetched.get("transcript_segments"),
        expected_duration_seconds=video.get("duration"),
        use_llm=args.llm_review,
    )
    reports_dir.mkdir(parents=True, exist_ok=True)
    (reports_dir / f"{vid}.fidelity.json").write_text(
        json.dumps(fidelity.to_dict(), indent=2, ensure_ascii=False))

    logger.info(f"  fidelity {fidelity.score:.2f} ({fidelity.verdict}) — {video['title'][:70]}")

    if fidelity.verdict == "fail" or fidelity.score < args.min_fidelity:
        record(state, video, playlist_id, status="quarantined",
               fidelity=fidelity.score, fidelity_verdict=fidelity.verdict,
               issues=fidelity.issues[:5])
        return "quarantined"

    if args.dry_run:
        record(state, video, playlist_id, status="dry_run",
               fidelity=fidelity.score, fidelity_verdict=fidelity.verdict)
        return "dry_run"

    # Full pipeline: KB storage, Upstash sync, NER, vectorize, CocoIndex KG, Mem0
    try:
        from main import process_url
        result = process_url(url, upload=args.upload, add_to_kb=not args.no_kb)
        if result and result.get("doc_id"):
            record(state, video, playlist_id, status="ingested",
                   fidelity=fidelity.score, fidelity_verdict=fidelity.verdict,
                   doc_id=result["doc_id"])
            return "ingested"
        record(state, video, playlist_id, status="failed",
               fidelity=fidelity.score, error="pipeline returned no doc_id")
        return "failed"
    except Exception as e:
        logger.error(f"Pipeline error for {vid}: {e}")
        record(state, video, playlist_id, status="failed",
               fidelity=fidelity.score, error=str(e))
        return "failed"


# ---------------------------------------------------------------- run report

def write_run_report(runs: List[Dict[str, Any]], counts: Dict[str, int], reports_dir: Path) -> Path:
    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    lines = [f"# Playlist Ingestion Run — {ts} UTC", ""]
    lines.append("| Status | Count |")
    lines.append("|--------|-------|")
    for status, n in sorted(counts.items()):
        lines.append(f"| {status} | {n} |")
    lines.append("")
    for run in runs:
        lines.append(f"## {run['title']} (`{run['playlist_id']}`)")
        lines.append("")
        lines.append("| Episode | Status | Fidelity | Doc ID |")
        lines.append("|---------|--------|----------|--------|")
        for ep in run["episodes"]:
            lines.append(f"| {ep['title'][:60]} | {ep['status']} | {ep.get('fidelity', '—')} | {ep.get('doc_id', '—')} |")
        lines.append("")
    reports_dir.mkdir(parents=True, exist_ok=True)
    path = reports_dir / f"run-{ts}.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


# ---------------------------------------------------------------- main

def main() -> int:
    parser = argparse.ArgumentParser(description="Ingest YouTube podcast playlists into the Disclosure RAG pipeline")
    parser.add_argument("playlists", nargs="*", help="One or more playlist (or video) URLs")
    parser.add_argument("--from-file", help="File with one playlist URL per line (# comments allowed)")
    parser.add_argument("--upload", action="store_true", help="Upload to OpenAI vector store (vectorization)")
    parser.add_argument("--no-kb", action="store_true", help="Skip knowledge base storage")
    parser.add_argument("--limit", type=int, default=0, help="Max new episodes to process per playlist")
    parser.add_argument("--force", action="store_true", help="Reprocess episodes already in the state file")
    parser.add_argument("--dry-run", action="store_true", help="Fetch + fidelity-review only; no ingestion")
    parser.add_argument("--min-fidelity", type=float, default=0.45,
                        help="Minimum fidelity score to ingest (default 0.45; below -> quarantined)")
    parser.add_argument("--llm-review", action="store_true",
                        help="Add LLM coherence pass to fidelity review (uses FIDELITY_REVIEW_MODEL)")
    parser.add_argument("--delay", type=float, default=2.0, help="Seconds between episodes (default 2)")
    parser.add_argument("--state-file", default=str(DEFAULT_STATE_FILE), help="Checkpoint state file path")
    args = parser.parse_args()

    urls = list(args.playlists)
    if args.from_file:
        for line in Path(args.from_file).read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                urls.append(line)
    if not urls:
        parser.error("No playlist URLs given (positional args or --from-file)")

    state_file = Path(args.state_file)
    state = load_state(state_file)
    transcripts_dir = OUTPUT_DIR / "transcripts"
    reports_dir = OUTPUT_DIR / "reports"

    counts: Dict[str, int] = {}
    runs: List[Dict[str, Any]] = []

    for playlist_url in urls:
        logger.info(f"Enumerating playlist: {playlist_url}")
        playlist = enumerate_playlist(playlist_url)
        videos = playlist["videos"]
        logger.info(f"Playlist '{playlist['title']}': {len(videos)} episodes")
        if not videos:
            counts["enumeration_failed"] = counts.get("enumeration_failed", 0) + 1
            continue

        run: Dict[str, Any] = {"playlist_id": playlist["playlist_id"], "title": playlist["title"], "episodes": []}
        processed = 0
        for i, video in enumerate(videos, 1):
            vid = video["video_id"]
            existing = state["videos"].get(vid, {})
            if not args.force and existing.get("status") in DONE_STATUSES:
                logger.info(f"[{i}/{len(videos)}] skip (already {existing['status']}): {video['title'][:70]}")
                counts["skipped"] = counts.get("skipped", 0) + 1
                continue
            if args.limit and processed >= args.limit:
                logger.info(f"--limit {args.limit} reached for this playlist")
                break

            logger.info(f"[{i}/{len(videos)}] processing: {video['title'][:70]}")
            status = process_episode(video, playlist["playlist_id"], state, args, transcripts_dir, reports_dir)
            counts[status] = counts.get(status, 0) + 1
            processed += 1
            save_state(state, state_file)

            entry = state["videos"].get(vid, {})
            run["episodes"].append({"title": video["title"], "status": status,
                                    "fidelity": entry.get("fidelity"), "doc_id": entry.get("doc_id")})
            if args.delay and i < len(videos):
                time.sleep(args.delay)
        runs.append(run)

    report_path = write_run_report(runs, counts, reports_dir)
    logger.info(f"Run report: {report_path}")
    logger.info(f"Summary: {json.dumps(counts)}")
    return 0 if not counts.get("failed") else 1


if __name__ == "__main__":
    sys.exit(main())
