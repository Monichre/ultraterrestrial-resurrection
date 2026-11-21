#!/usr/bin/env python3
"""
Enhanced YouTube Transcript API Integration
Cookie-free, stable transcript extraction using youtube-transcript-api
Replaces complex yt-dlp flows with simple, reliable HTTP-based approach

Failures are reported as a `reason` code (see REASON_* below) rather than a
bare None, because the caller needs to tell three very different things apart:
a video that genuinely has no captions, a video we are not allowed to read
(private/deleted), and YouTube blocking this IP — which is a property of the
run, not of the video, and must not be recorded against 100 episodes as
"no transcript".

Proxy environment (the documented remedy for an IP block; without one, a
blocked run cannot be rescued by retrying from the same address):

  YT_WEBSHARE_PROXY_USERNAME / YT_WEBSHARE_PROXY_PASSWORD  Webshare rotating
  YT_PROXY_URL (or YT_PROXY_HTTP_URL / YT_PROXY_HTTPS_URL) any HTTP(S) proxy
  YT_TRANSCRIPT_MAX_RETRIES  retries per video when blocked (default 2)
  YT_TRANSCRIPT_BACKOFF      seconds before the first retry (default 5)
"""

import json
import re
import os
import logging
import time
from typing import Optional, Dict, Any, List, Iterator, Tuple
from urllib.parse import urlparse, parse_qs, urlencode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from dotenv import load_dotenv

try:
    from youtube_transcript_api import (
        YouTubeTranscriptApi,
        CouldNotRetrieveTranscript,
        TranscriptsDisabled,
        NoTranscriptFound,
        VideoUnavailable,
        VideoUnplayable,
        InvalidVideoId,
        RequestBlocked,   # IpBlocked is a subclass; catching this covers both
        AgeRestricted,
        PoTokenRequired,
        TranscriptList,
        Transcript
    )
    YOUTUBE_TRANSCRIPT_API_AVAILABLE = True
except ImportError:
    YOUTUBE_TRANSCRIPT_API_AVAILABLE = False

load_dotenv()
logger = logging.getLogger(__name__)

# Configuration
DEFAULT_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
DEFAULT_EN_LANGS = ["en", "en-US", "en-GB", "en-CA", "en-AU", "en-IN"]
YT_TRANSCRIPT_API_FIRST = os.getenv("YT_TRANSCRIPT_API_FIRST", "true").lower() == "true"

YOUTUBE_HOSTS = {
    "www.youtube.com", "youtube.com", "m.youtube.com", "music.youtube.com",
    "youtu.be", "www.youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com",
}

# Why a transcript fetch produced nothing.
REASON_OK = "ok"
REASON_BLOCKED = "blocked"                          # YouTube refused this IP
REASON_PRIVATE = "private"                          # unplayable for us
REASON_UNAVAILABLE = "unavailable"                  # deleted / bad id
REASON_TRANSCRIPTS_DISABLED = "transcripts_disabled"
REASON_AGE_RESTRICTED = "age_restricted"
REASON_PO_TOKEN_REQUIRED = "po_token_required"
REASON_NO_CAPTIONS = "no_captions"                  # nothing in any language
REASON_API_UNAVAILABLE = "api_unavailable"
REASON_ERROR = "error"

#: Reasons that say nothing about the video itself, so the same video is worth
#: another attempt later (from a different IP, or once a proxy is configured).
RETRYABLE_REASONS = {REASON_BLOCKED, REASON_PO_TOKEN_REQUIRED, REASON_ERROR}

#: Reasons that will not change on a retry — re-fetching only burns quota.
TERMINAL_REASONS = {
    REASON_PRIVATE, REASON_UNAVAILABLE, REASON_TRANSCRIPTS_DISABLED,
    REASON_AGE_RESTRICTED, REASON_NO_CAPTIONS,
}


def _classify(exc: Exception) -> str:
    """Map a youtube-transcript-api exception to a REASON_* code.

    Order matters: IpBlocked subclasses RequestBlocked, and VideoUnplayable
    (a private video) is a *sibling* of VideoUnavailable, not a subclass —
    which is exactly why private videos used to surface as
    "Unexpected error fetching transcript" with a multi-line stderr dump.
    """
    if isinstance(exc, RequestBlocked):
        return REASON_BLOCKED
    if isinstance(exc, PoTokenRequired):
        return REASON_PO_TOKEN_REQUIRED
    if isinstance(exc, VideoUnplayable):
        return REASON_PRIVATE
    if isinstance(exc, (VideoUnavailable, InvalidVideoId)):
        return REASON_UNAVAILABLE
    if isinstance(exc, TranscriptsDisabled):
        return REASON_TRANSCRIPTS_DISABLED
    if isinstance(exc, AgeRestricted):
        return REASON_AGE_RESTRICTED
    if isinstance(exc, NoTranscriptFound):
        return REASON_NO_CAPTIONS
    return REASON_ERROR


def _short(exc: Exception) -> str:
    """First meaningful line of an exception message.

    The library's CouldNotRetrieveTranscript messages are ~15 lines of prose
    aimed at a human reading a traceback; logging them per video makes a run
    log unreadable and buries the one line that identifies the cause.
    """
    lines = [ln.strip() for ln in str(exc).splitlines() if ln.strip()]
    detail = next((ln for ln in lines if not ln.startswith("Could not retrieve")), "")
    return f"{type(exc).__name__}: {detail or (lines[0] if lines else 'no detail')}"[:300]


def _build_proxy_config():
    """Build a proxy config from the environment, or None if unconfigured."""
    username = os.getenv("YT_WEBSHARE_PROXY_USERNAME")
    password = os.getenv("YT_WEBSHARE_PROXY_PASSWORD")
    if username and password:
        from youtube_transcript_api.proxies import WebshareProxyConfig
        logger.info("Using Webshare rotating residential proxy for transcript fetches")
        return WebshareProxyConfig(proxy_username=username, proxy_password=password)

    generic = os.getenv("YT_PROXY_URL")
    http_url = os.getenv("YT_PROXY_HTTP_URL") or generic
    https_url = os.getenv("YT_PROXY_HTTPS_URL") or generic
    if http_url or https_url:
        from youtube_transcript_api.proxies import GenericProxyConfig
        logger.info("Using generic proxy for transcript fetches")
        return GenericProxyConfig(http_url=http_url, https_url=https_url)
    return None


_api_instance = None
_proxy_configured = False


def _api() -> "YouTubeTranscriptApi":
    """Memoized API client, so one requests Session is reused across a run."""
    global _api_instance, _proxy_configured
    if _api_instance is None:
        proxy_config = _build_proxy_config()
        _proxy_configured = proxy_config is not None
        _api_instance = YouTubeTranscriptApi(proxy_config=proxy_config)
    return _api_instance


def proxy_configured() -> bool:
    """True when transcript requests egress through a configured proxy."""
    _api()
    return _proxy_configured


def extract_video_id(url: str) -> Optional[str]:
    """
    Extract YouTube video ID from various URL formats
    
    Args:
        url: YouTube URL in various formats
        
    Returns:
        Video ID string or None if not found
    """
    try:
        p = urlparse(url)
        host = (p.hostname or "").lower()
        qs = parse_qs(p.query)
        
        if host not in YOUTUBE_HOSTS:
            return None
            
        # youtu.be format
        if "youtu.be" in host:
            video_id = p.path.lstrip("/")
            return video_id if video_id else None
            
        # YouTube Shorts format
        if p.path.startswith("/shorts/"):
            parts = p.path.split("/")
            return parts[2] if len(parts) > 2 else None
            
        # Standard watch URL
        if p.path == "/watch":
            return qs.get("v", [None])[0]
            
        # Embed format
        if p.path.startswith("/embed/") or p.path.startswith("/v/"):
            parts = p.path.split("/")
            return parts[2] if len(parts) > 2 else None
            
        return None
        
    except Exception as e:
        logger.warning(f"Error extracting video ID from {url}: {e}")
        return None


def fetch_oembed_metadata(url: str, timeout: float = 8.0) -> Dict[str, Any]:
    """
    Fetch minimal metadata using YouTube's oEmbed API
    
    Args:
        url: YouTube URL
        timeout: Request timeout in seconds
        
    Returns:
        Dictionary with metadata or error information
    """
    try:
        vid = extract_video_id(url)
        if not vid:
            return {"ok": False, "error": "no_video_id"}
            
        qs = urlencode({
            "format": "json", 
            "url": f"https://www.youtube.com/watch?v={vid}"
        })
        oembed_url = f"https://www.youtube.com/oembed?{qs}"
        
        req = Request(oembed_url, headers={
            "User-Agent": DEFAULT_UA, 
            "Accept-Language": "en-US,en;q=0.9"
        })
        
        with urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            
        return {
            "ok": True,
            "video_id": vid,
            "title": data.get("title"),
            "author_name": data.get("author_name"),
            "thumbnail_url": data.get("thumbnail_url"),
            "html": data.get("html", ""),
        }
        
    except (URLError, HTTPError, json.JSONDecodeError) as e:
        logger.warning(f"oEmbed fetch failed for {url}: {e}")
        return {"ok": False, "error": str(e)}
    except Exception as e:
        logger.error(f"Unexpected error in oEmbed fetch: {e}")
        return {"ok": False, "error": f"unexpected_error: {e}"}


def _candidates(transcript_list: "TranscriptList", langs: List[str]) -> Iterator[Tuple["Transcript", str]]:
    """Yield (transcript, description) in preference order, without fetching.

    Fetching is deliberately left to the caller so a failed fetch can be
    classified once, in one place, instead of being swallowed by a bare
    `except Exception: continue` inside each strategy.
    """
    seen = set()

    def take(transcript, description):
        key = (transcript.language_code, transcript.is_generated)
        if key in seen:
            return None
        seen.add(key)
        return transcript, description

    # 1: manual transcript in a preferred language
    for lang in langs:
        try:
            transcript = transcript_list.find_manually_created_transcript([lang])
        except CouldNotRetrieveTranscript:
            continue
        found = take(transcript, f"manual {transcript.language_code}")
        if found:
            yield found

    # 2: any manual transcript
    for transcript in transcript_list:
        if not transcript.is_generated:
            found = take(transcript, f"manual {transcript.language_code}")
            if found:
                yield found

    # 3: auto-generated in a preferred language
    for lang in langs:
        try:
            transcript = transcript_list.find_generated_transcript([lang])
        except CouldNotRetrieveTranscript:
            continue
        found = take(transcript, f"auto-generated {transcript.language_code}")
        if found:
            yield found

    # 4: translate something into English. Skipped for transcripts that are
    # already English — an en->en translate is a wasted round trip that the
    # earlier stages would have already returned on success. (It used to run,
    # and logged "Using translated transcript from en to en".)
    target = (langs[0] if langs else "en").split("-")[0]
    for transcript in transcript_list:
        if not transcript.is_translatable or transcript.language_code.split("-")[0] == target:
            continue
        try:
            translated = transcript.translate(target)
        except CouldNotRetrieveTranscript as e:
            logger.debug("Cannot translate %s->%s: %s", transcript.language_code, target, _short(e))
            continue
        yield translated, f"{transcript.language_code}->{target} translation"


def fetch_transcript_with_reason(
    video_id: str, languages: Optional[List[str]] = None
) -> Tuple[Optional[List[Dict[str, Any]]], str]:
    """Fetch a transcript, returning (segments, REASON_*).

    Preference order: manual in a preferred language, any manual,
    auto-generated in a preferred language, then translated into the preferred
    language.

    A block (RequestBlocked/IpBlocked) aborts immediately instead of walking
    the remaining candidates: every one of them would hit the same wall, and
    reporting the walk's end as "no suitable transcript" is what previously
    turned an IP ban into 55 episodes recorded as having no captions.
    """
    if not YOUTUBE_TRANSCRIPT_API_AVAILABLE:
        logger.warning("youtube-transcript-api not available")
        return None, REASON_API_UNAVAILABLE

    langs = languages or DEFAULT_EN_LANGS
    attempts = max(1, int(os.getenv("YT_TRANSCRIPT_MAX_RETRIES", "2")) + 1)
    backoff = float(os.getenv("YT_TRANSCRIPT_BACKOFF", "5"))

    for attempt in range(1, attempts + 1):
        segments, reason = _fetch_once(video_id, langs)
        if reason != REASON_BLOCKED or attempt == attempts:
            return segments, reason
        # Retrying only helps if egress can change; from a single blocked IP
        # it is a guaranteed-failing sleep, so don't pretend otherwise.
        if not proxy_configured():
            logger.error(
                "YouTube blocked this IP for %s and no proxy is configured — not retrying. "
                "Set YT_WEBSHARE_PROXY_USERNAME/PASSWORD or YT_PROXY_URL.", video_id)
            return None, REASON_BLOCKED
        wait = backoff * (2 ** (attempt - 1))
        logger.warning("Blocked on %s (attempt %d/%d); retrying in %.0fs via proxy",
                       video_id, attempt, attempts, wait)
        time.sleep(wait)

    return None, REASON_BLOCKED


def _fetch_once(video_id: str, langs: List[str]) -> Tuple[Optional[List[Dict[str, Any]]], str]:
    """One full pass over the candidate transcripts for a video."""
    try:
        transcript_list = _api().list(video_id)
    except CouldNotRetrieveTranscript as e:
        reason = _classify(e)
        log = logger.error if reason in (REASON_BLOCKED, REASON_ERROR) else logger.info
        log("No transcript list for %s (%s) — %s", video_id, reason, _short(e))
        return None, reason
    except Exception as e:
        logger.error("Unexpected error listing transcripts for %s: %s", video_id, _short(e))
        return None, REASON_ERROR

    last_reason = REASON_NO_CAPTIONS
    for transcript, description in _candidates(transcript_list, langs):
        try:
            segments = transcript.fetch()
        except CouldNotRetrieveTranscript as e:
            last_reason = _classify(e)
            if last_reason == REASON_BLOCKED:
                return None, REASON_BLOCKED
            logger.warning("Fetch failed for %s (%s): %s", video_id, description, _short(e))
            continue
        except Exception as e:
            last_reason = REASON_ERROR
            logger.error("Unexpected error fetching %s (%s): %s", video_id, description, _short(e))
            continue
        # Logged only after the bytes are in hand. The old code announced
        # "Found ... transcript" before fetch(), so a failed fetch produced a
        # log that claimed success and a result that said none was found.
        logger.info("Fetched %s transcript for %s (%d segments)",
                    description, video_id, len(segments))
        return segments, REASON_OK

    logger.warning("No usable transcript for %s (%s)", video_id, last_reason)
    return None, last_reason


def fetch_transcript_best_effort(video_id: str, languages: Optional[List[str]] = None) -> Optional[List[Dict[str, Any]]]:
    """Fetch a transcript, discarding the failure reason.

    Kept for callers that only care whether a transcript came back; prefer
    fetch_transcript_with_reason() so blocks can be told from missing captions.
    """
    segments, _ = fetch_transcript_with_reason(video_id, languages)
    return segments


def format_transcript_segments(segments: List[Dict[str, Any]]) -> str:
    """
    Format transcript segments into readable text
    
    Args:
        segments: List of transcript segments with text, start, duration
        
    Returns:
        Formatted transcript text
    """
    if not segments:
        return ""
        
    formatted_text = []
    for segment in segments:
        # Handle both dict format and FetchedTranscriptSnippet objects
        if hasattr(segment, 'text'):
            # FetchedTranscriptSnippet object
            text = segment.text.strip()
        else:
            # Dictionary format
            text = segment.get("text", "").strip()
            
        if text:
            formatted_text.append(text)
            
    return " ".join(formatted_text)


def get_metadata_and_transcript_api_first(url: str, languages: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Primary function: Get YouTube metadata and transcript using transcript-api-first approach
    
    Args:
        url: YouTube URL
        languages: Preferred language codes
        
    Returns:
        Dictionary with metadata, transcript, and processing information

    ═══ YT-CHAIN-09 · youtube_transcript_enhanced.py ::
        get_metadata_and_transcript_api_first() ══════════════════════════
    THE DOWNLOAD. The only two network hops in Phase 3:
      hop 1 → fetch_transcript_with_reason() → _fetch_once() → YouTubeTranscriptApi
      hop 2 → fetch_oembed_metadata()        → YouTube oEmbed endpoint
    Transcript first, metadata second, deliberately: for a private or deleted
    video the oEmbed call is a guaranteed 403, and fetching it first buried
    the real explanation under a scary HTTP error.
    PREV ← YT-CHAIN-08  get_video_info_and_transcript_enhanced()
    NEXT → returns up the stack to YT-CHAIN-06, which now holds the raw
           transcript and proceeds to Phase 4 (YT-CHAIN-10)
    ═══════════════════════════════════════════════════════════════════════
    """
    if not YOUTUBE_TRANSCRIPT_API_AVAILABLE:
        return {
            "ok": False, 
            "error": "youtube_transcript_api_not_available",
            "fallback_required": True
        }
        
    vid = extract_video_id(url)
    if not vid:
        return {"ok": False, "error": "no_video_id", "reason": REASON_UNAVAILABLE}

    # Transcript first: for a private or deleted video the oEmbed call is a
    # guaranteed 403/404, and fetching it first was logging a scary
    # "oEmbed fetch failed ... HTTP Error 403" ahead of the real explanation.
    transcript_segments, reason = fetch_transcript_with_reason(vid, languages)
    transcript_text = format_transcript_segments(transcript_segments or [])
    success = bool(transcript_text and transcript_text.strip())

    if success or reason not in (REASON_PRIVATE, REASON_UNAVAILABLE):
        meta = fetch_oembed_metadata(url)
    else:
        meta = {"ok": False, "error": f"skipped: video {reason}"}

    result = {
        "ok": success,
        "reason": reason,
        "retryable": reason in RETRYABLE_REASONS,
        "video_id": vid,
        "title": meta.get("title") if meta.get("ok") else f"YouTube Video {vid}",
        "uploader": meta.get("author_name") if meta.get("ok") else "",
        "thumbnail_url": meta.get("thumbnail_url") if meta.get("ok") else "",
        "transcript": transcript_text if success else None,
        "transcript_segments": transcript_segments if success else None,
        "source": "youtube-transcript-api",
        "metadata": {
            "video_id": vid,
            "url": url,
            "type": "youtube_transcript",
            "api_source": "youtube-transcript-api",
            "oembed_success": meta.get("ok", False),
            "transcript_available": success,
            "transcript_reason": reason,
            "segment_count": len(transcript_segments) if transcript_segments else 0
        }
    }

    if not success:
        # A yt-dlp/whisper fallback can rescue missing captions; it cannot
        # rescue a blocked IP or a video we have no access to.
        result["fallback_required"] = reason not in (REASON_BLOCKED, REASON_PRIVATE, REASON_UNAVAILABLE)
        result["error"] = f"no_transcript: {reason}"

    return result


def should_use_transcript_api_first() -> bool:
    """
    Check if youtube-transcript-api should be tried first
    
    Returns:
        True if transcript API should be used first
    """
    return YT_TRANSCRIPT_API_FIRST and YOUTUBE_TRANSCRIPT_API_AVAILABLE


# Compatibility functions for existing workflow
def get_video_info_and_transcript_enhanced(url: str) -> Optional[Dict[str, Any]]:
    """
    Enhanced wrapper that integrates with existing workflow
    
    This function maintains compatibility with the existing disclosure-rag workflow
    while providing the new transcript-api-first functionality.

    Args:
        url: YouTube URL

    Returns:
        Dictionary compatible with existing workflow or None if failed

    ═══ YT-CHAIN-08 · youtube_transcript_enhanced.py ::
        get_video_info_and_transcript_enhanced() ═════════════════════════
    Shape adapter. Reshapes the api-first result into the key names the
    older workflow expects (id/title/transcript/...).
    PREV ← YT-CHAIN-07  lib/youtube.py :: get_video_info_and_transcript()
    NEXT → YT-CHAIN-09  get_metadata_and_transcript_api_first()
    ═══════════════════════════════════════════════════════════════════════
    """
    if should_use_transcript_api_first():
        logger.info(f"Trying youtube-transcript-api first for {url}")
        
        result = get_metadata_and_transcript_api_first(url)
        
        if result.get("ok") and result.get("transcript"):
            logger.info(f"Successfully got transcript via youtube-transcript-api for {url}")
            
            # Convert to format expected by existing workflow
            return {
                "id": result["video_id"],
                "title": result["title"],
                "uploader": result["uploader"],
                "thumbnail": result["thumbnail_url"],
                "webpage_url": url,
                "transcript": result["transcript"],
                "transcript_segments": result.get("transcript_segments", []),
                "source": "youtube-transcript-api",
                "categories": [],  # Not available from oEmbed
                "tags": [],        # Not available from oEmbed
                "description": "", # Not available from oEmbed
                "chapters": [],    # Not available from oEmbed
                "metadata": result["metadata"]
            }
        else:
            logger.warning("youtube-transcript-api got no transcript for %s (%s)%s",
                           url, result.get("reason"),
                           ", fallback required" if result.get("fallback_required") else "")
            return None
    else:
        logger.info("youtube-transcript-api disabled or unavailable")
        return None


# Export main functions
__all__ = [
    'extract_video_id',
    'fetch_oembed_metadata', 
    'fetch_transcript_best_effort',
    'fetch_transcript_with_reason',
    'get_metadata_and_transcript_api_first',
    'get_video_info_and_transcript_enhanced',
    'should_use_transcript_api_first',
    'proxy_configured',
    'RETRYABLE_REASONS',
    'TERMINAL_REASONS',
    'REASON_BLOCKED',
    'REASON_PRIVATE',
    'REASON_UNAVAILABLE',
    'REASON_NO_CAPTIONS',
    'YOUTUBE_TRANSCRIPT_API_AVAILABLE'
]