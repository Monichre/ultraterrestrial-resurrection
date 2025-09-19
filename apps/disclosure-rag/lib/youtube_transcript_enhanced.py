#!/usr/bin/env python3
"""
Enhanced YouTube Transcript API Integration
Cookie-free, stable transcript extraction using youtube-transcript-api
Replaces complex yt-dlp flows with simple, reliable HTTP-based approach
"""

import json
import re
import os
import logging
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse, parse_qs, urlencode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from dotenv import load_dotenv

try:
    from youtube_transcript_api import (
        YouTubeTranscriptApi, 
        TranscriptsDisabled, 
        NoTranscriptFound, 
        VideoUnavailable,
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


def fetch_transcript_best_effort(video_id: str, languages: Optional[List[str]] = None) -> Optional[List[Dict[str, Any]]]:
    """
    Fetch transcript with intelligent fallback strategy
    
    Strategy:
    1. Prefer manual transcripts in desired languages
    2. Fall back to any manual transcript
    3. Use auto-generated in desired languages
    4. Try translation if available
    
    Args:
        video_id: YouTube video ID
        languages: Preferred language codes (defaults to English variants)
        
    Returns:
        List of transcript segments or None if unavailable
    """
    if not YOUTUBE_TRANSCRIPT_API_AVAILABLE:
        logger.warning("youtube-transcript-api not available")
        return None
        
    langs = languages or DEFAULT_EN_LANGS
    
    try:
        # Create API instance and get transcript list
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        
        # Strategy 1: Prefer manual transcripts in desired languages
        for lang in langs:
            try:
                transcript = transcript_list.find_transcript([lang])
                if not transcript.is_generated:
                    logger.info(f"Found manual transcript in {lang} for {video_id}")
                    return transcript.fetch()
            except Exception:
                continue
                
        # Strategy 2: Any manual transcript
        for transcript in transcript_list:
            if not transcript.is_generated:
                logger.info(f"Found manual transcript in {transcript.language_code} for {video_id}")
                return transcript.fetch()
                
        # Strategy 3: Auto-generated in desired languages
        for lang in langs:
            try:
                transcript = transcript_list.find_transcript([lang])
                logger.info(f"Found auto-generated transcript in {lang} for {video_id}")
                return transcript.fetch()
            except Exception:
                continue
                
        # Strategy 4: Try translation if available
        try:
            first_transcript = next(iter(transcript_list))
            if first_transcript.is_translatable:
                logger.info(f"Using translated transcript from {first_transcript.language_code} to en for {video_id}")
                return first_transcript.translate("en").fetch()
        except Exception:
            pass
            
        logger.warning(f"No suitable transcript found for {video_id}")
        return None
        
    except (NoTranscriptFound, TranscriptsDisabled, VideoUnavailable) as e:
        logger.warning(f"Transcript unavailable for {video_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching transcript for {video_id}: {e}")
        return None


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
    """
    if not YOUTUBE_TRANSCRIPT_API_AVAILABLE:
        return {
            "ok": False, 
            "error": "youtube_transcript_api_not_available",
            "fallback_required": True
        }
        
    vid = extract_video_id(url)
    if not vid:
        return {"ok": False, "error": "no_video_id"}
        
    # Fetch metadata
    meta = fetch_oembed_metadata(url)
    
    # Fetch transcript
    transcript_segments = fetch_transcript_best_effort(vid, languages)
    transcript_text = format_transcript_segments(transcript_segments or [])
    
    # Determine success
    success = bool(transcript_text and transcript_text.strip())
    
    result = {
        "ok": success,
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
            "segment_count": len(transcript_segments) if transcript_segments else 0
        }
    }
    
    if not success:
        result["fallback_required"] = True
        result["error"] = "no_transcript_available"
        
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
            logger.warning(f"youtube-transcript-api failed for {url}, fallback required")
            return None
    else:
        logger.info("youtube-transcript-api disabled or unavailable")
        return None


# Export main functions
__all__ = [
    'extract_video_id',
    'fetch_oembed_metadata', 
    'fetch_transcript_best_effort',
    'get_metadata_and_transcript_api_first',
    'get_video_info_and_transcript_enhanced',
    'should_use_transcript_api_first',
    'YOUTUBE_TRANSCRIPT_API_AVAILABLE'
]