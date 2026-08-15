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

# Terminal states that --force is required to reprocess. `unavailable` is here
# because a private/deleted video does not come back: re-listing it on every run
# spends a request that counts against the same quota that gets us IP-blocked.
DONE_STATUSES = {"ingested", "quarantined", "unavailable"}

# Transcript failure reason -> episode status. Anything unmapped (missing
# captions, disabled captions) stays `no_transcript`, which is retryable.
REASON_STATUS = {
    "blocked": "blocked",
    "private": "unavailable",
    "unavailable": "unavailable",
    "age_restricted": "unavailable",
}

# Consecutive `blocked` episodes after which the run aborts. YouTube blocks an
# IP, not a video, so once it starts every remaining episode fails too — the
# previous behaviour marched through 104 videos and recorded 55 of them as
# `no_transcript`, which reads as "these podcasts have no captions" forever.
BLOCKED_ABORT_THRESHOLD = int(os.getenv("YT_BLOCKED_ABORT_THRESHOLD", "3"))


# ---------------------------------------------------------------- enumeration

# YouTube video IDs are exactly 11 chars of [A-Za-z0-9_-]. Playlist/channel IDs
# (PL…, UU…, OL…, RD…, LL…, FL…, UC…) are longer, so length alone separates
# them — this is the guard that catches a container ID leaking into a video slot.
VIDEO_ID_RE = re.compile(r"^[\w-]{11}$")


def is_video_id(value: Any) -> bool:
    return isinstance(value, str) and bool(VIDEO_ID_RE.match(value))


def enumerate_playlist(playlist_url: str) -> Dict[str, Any]:
    """Return {playlist_id, title, videos: [{video_id, url, title, duration}]}.

    Tries yt-dlp flat extraction first (fast, no per-video downloads), then
    falls back to pytube. A plain video URL is treated as a single-episode
    playlist.
    """
    try:
        import yt_dlp
        opts = {
            "quiet": True, "no_warnings": True,
            "extract_flat": "in_playlist",   # flatten entries; still resolve the container
            "skip_download": True,
            # We only ever want metadata. Without these, processing a bare video
            # URL aborts on format selection ("Requested format is not
            # available") before any metadata comes back.
            "ignore_no_formats_error": True,
            "format": None,
        }
        with yt_dlp.YoutubeDL(opts) as ydl:
            # NOTE: process=False must NOT be used here. For a playlist URL it
            # returns an unresolved {_type: "url", id: <PLAYLIST_ID>} stub with
            # no "entries" key, which the single-video fallback below then
            # mistakes for a video — sending the playlist ID down the pipeline
            # as a video ID. Processing resolves the stub into real entries;
            # extract_flat keeps it cheap (no per-video format resolution).
            info = ydl.extract_info(playlist_url, download=False)
        if info.get("_type") == "playlist":
            entries = list(info.get("entries") or [])
        elif info.get("_type") in (None, "video"):
            entries = [info]  # genuine single video
        else:
            raise ValueError(f"unresolved yt-dlp result: _type={info.get('_type')!r}")
        videos = []
        for e in entries:
            if not e:
                continue
            vid = e.get("id")
            if not is_video_id(vid):
                logger.warning(f"Skipping entry with non-video id {vid!r} ({e.get('title')!r})")
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
            m = re.search(r"[?&]v=([\w-]+)", url)
            if m and is_video_id(m.group(1)):
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


#: Per-attempt outcome keys. Cleared before each write so a later failed
#: attempt can't inherit an earlier success's fields — a `no_transcript` retry
#: was leaving the prior run's `fidelity` and `doc_id` in place, which reads as
#: though a fetch that never happened had produced a document.
_OUTCOME_KEYS = ("fidelity", "fidelity_verdict", "doc_id", "rag_status", "error", "issues")


def record(state: Dict[str, Any], video: Dict[str, Any], playlist_id: str, **fields) -> None:
    entry = state["videos"].setdefault(video["video_id"], {})
    for key in _OUTCOME_KEYS:
        entry.pop(key, None)
    entry.update({
        "title": video.get("title"),
        "url": video.get("url"),
        "playlist_id": playlist_id,
        "updated": datetime.now(timezone.utc).isoformat(),
        **fields,
    })


# ---------------------------------------------------------------- per-episode

def fetch_transcript(url: str) -> tuple:
    """Fetch transcript + metadata via the cookie-free transcript-api path.

    Returns (result | None, reason). The reason is what lets the caller tell an
    episode with no captions from an IP block, which is a run-level condition.
    """
    try:
        from lib.youtube_transcript_enhanced import get_metadata_and_transcript_api_first
        result = get_metadata_and_transcript_api_first(url)
        if result.get("ok") and result.get("transcript"):
            return result, "ok"
        return None, result.get("reason") or "no_captions"
    except Exception as e:
        logger.warning(f"Transcript fetch failed for {url}: {e}")
        return None, "error"


def _enrichment_outcome(result: Dict[str, Any]) -> tuple:
    """Grade LLM enrichment from a process_url result: (status, error_detail).

    Thin alias kept so this module's existing call sites read unchanged. The
    definition moved to lib/enrichment_status.py when main.py's direct path
    needed the same gate — one search order, two callers.
    """
    from lib.enrichment_status import enrichment_outcome

    return enrichment_outcome(result)


def process_episode(video: Dict[str, Any], playlist_id: str, state: Dict[str, Any],
                    args: argparse.Namespace, transcripts_dir: Path, reports_dir: Path) -> str:
    """Run one episode through fetch -> parse -> fidelity gate -> pipeline.

    Returns the resulting status string.
    """
    vid, url = video["video_id"], video["url"]

    fetched, reason = fetch_transcript(url)
    if not fetched:
        status = REASON_STATUS.get(reason, "no_transcript")
        record(state, video, playlist_id, status=status, error=f"transcript {reason}")
        return status

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
            # A doc_id only proves the transcript was stored. LLM enrichment
            # (classification, NER, embeddable texts) can fail independently —
            # and did, silently, for a whole run when OPENAI_API_KEY was
            # revoked. main.py already grades that as ok|hold|rejected|error;
            # surface it rather than reporting every stored transcript as a
            # successful ingestion.
            rag_status, enrich_errors = _enrichment_outcome(result)
            if rag_status not in ("ok", "unknown"):
                logger.warning(
                    "  enrichment %s for %s — %s", rag_status, vid, enrich_errors or "no detail")
                record(state, video, playlist_id, status="enrichment_failed",
                       fidelity=fidelity.score, fidelity_verdict=fidelity.verdict,
                       doc_id=result["doc_id"], rag_status=rag_status,
                       error=enrich_errors or f"rag_pipeline status={rag_status}")
                return "enrichment_failed"
            if rag_status == "unknown":
                logger.warning(
                    "  enrichment status not reported by the pipeline for %s — "
                    "recording rag_status=unknown, not treating as enriched", vid)
            record(state, video, playlist_id, status="ingested",
                   fidelity=fidelity.score, fidelity_verdict=fidelity.verdict,
                   doc_id=result["doc_id"], rag_status=rag_status)
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
        lines.append("| Episode | Status | Fidelity | Enrichment | Doc ID |")
        lines.append("|---------|--------|----------|------------|--------|")
        for ep in run["episodes"]:
            lines.append(
                f"| {ep['title'][:60]} | {ep['status']} | {ep.get('fidelity', '—')} "
                f"| {ep.get('rag_status', '—')} | {ep.get('doc_id', '—')} |")
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
                        help="Add LLM coherence pass to fidelity review (routed through the "
                             "shared fallback chain; pin a tier with FIDELITY_REVIEW_PROVIDER)")
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
    consecutive_blocked = 0
    aborted = False

    for playlist_url in urls:
        if aborted:
            break
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

            # Only a status that required YouTube to actually serve us caption
            # data clears the counter. `unavailable` must not: a private video
            # fails before any transcript request, so treating it as evidence
            # that egress works lets a playlist with private episodes sprinkled
            # through it reset the breaker forever while every real fetch fails.
            if status == "blocked":
                consecutive_blocked += 1
            elif status != "unavailable":
                consecutive_blocked = 0
            if consecutive_blocked >= BLOCKED_ABORT_THRESHOLD:
                from lib.youtube_transcript_enhanced import proxy_configured
                logger.error(
                    "Aborting: YouTube blocked %d consecutive transcript requests. This is an "
                    "IP-level block, not a property of these videos — continuing would record "
                    "the rest of the playlist as failures. Remedy: %s, then re-run (blocked "
                    "episodes are not terminal and will be retried).",
                    consecutive_blocked,
                    "rotate the proxy / wait out the block" if proxy_configured()
                    else "set YT_WEBSHARE_PROXY_USERNAME + YT_WEBSHARE_PROXY_PASSWORD (or YT_PROXY_URL)")
                aborted = True
                break

            if args.delay and i < len(videos):
                time.sleep(args.delay)
        runs.append(run)

    report_path = write_run_report(runs, counts, reports_dir)
    logger.info(f"Run report: {report_path}")
    logger.info(f"Summary: {json.dumps(counts)}")
    if aborted:
        return 2
    return 0 if not counts.get("failed") else 1


if __name__ == "__main__":
    sys.exit(main())
