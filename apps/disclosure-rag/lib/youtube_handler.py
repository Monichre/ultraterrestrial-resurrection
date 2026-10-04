#!/usr/bin/env python3
"""
Robust YouTube Handler with retry logic, fallback formats, and transcript extraction
Handles HTTP 403, fragment errors, and format unavailability issues
"""

import os
import sys
import json
import time
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime

import yt_dlp
from tenacity import retry, stop_after_attempt, wait_exponential_jitter, retry_if_exception_type

# Try to import optional dependencies
try:
    from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
    YOUTUBE_TRANSCRIPT_API_AVAILABLE = True
except ImportError:
    YOUTUBE_TRANSCRIPT_API_AVAILABLE = False
    TranscriptsDisabled = NoTranscriptFound = Exception

try:
    from faster_whisper import WhisperModel
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False

logger = logging.getLogger(__name__)

# Base headers for all requests
BASE_HEADERS = {
    "User-Agent": os.getenv("YTDLP_USER_AGENT", 
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"),
    "Accept-Language": os.getenv("YTDLP_ACCEPT_LANGUAGE", "en-US,en;q=0.9"),
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
}

# Format selection fallback chain
FORMAT_PRIMARY = "bv*[ext=mp4][vcodec^=avc1]+ba[ext=m4a]/b[ext=mp4]/best[ext=mp4]"
FORMAT_SECONDARY = "bv*+ba/b/best"
AUDIO_ONLY = "ba[ext=m4a]/bestaudio/best"


class YTJobError(Exception):
    """Custom exception for YouTube job errors"""
    pass


def _get_cookies_opts() -> Dict[str, Any]:
    """Get cookie configuration from environment.
    If YTDLP_DISABLE_COOKIES is truthy, do not use any cookies (no browser, no files).
    """
    opts: Dict[str, Any] = {}

    # Respect explicit disable flag (no browser/no file cookies)
    disable = os.getenv("YTDLP_DISABLE_COOKIES", "").strip().lower()
    if disable in {"1", "true", "yes", "on"}:
        logger.info("Cookies explicitly disabled via YTDLP_DISABLE_COOKIES")
        return opts

    # Try browser cookies first
    cookies_from_browser = os.getenv("YTDLP_COOKIES_FROM_BROWSER", "").strip()
    if cookies_from_browser:
        logger.info(f"Using cookies from browser: {cookies_from_browser}")
        opts["cookiesfrombrowser"] = (cookies_from_browser, None, None, None)
        return opts
    
    # Fall back to cookie file
    cookie_file = os.getenv("YTDLP_COOKIE_FILE", "").strip()
    if cookie_file and Path(cookie_file).exists():
        logger.info(f"Using cookie file: {cookie_file}")
        opts["cookiefile"] = cookie_file
        return opts
    
    # Try common locations for cookie file
    for path in ["secrets/youtube.cookies.txt", ".cookies.txt", "cookies.txt"]:
        if Path(path).exists():
            logger.info(f"Found cookie file at: {path}")
            opts["cookiefile"] = path
            return opts
    
    logger.warning("No cookies configured - proceeding without cookies")
    return opts


def _base_opts(skip_download: bool = False) -> Dict[str, Any]:
    """Base yt-dlp options with robust settings"""
    opts = {
        'quiet': False,
        'no_warnings': False,
        'extract_flat': False,
        'ignoreerrors': False,
        'no_check_certificate': True,
        'geo_bypass': True,
        'prefer_free_formats': False,
        
        # Retry settings
        'retries': 10,
        'fragment_retries': 100,
        'file_access_retries': 10,
        'retry_sleep_functions': {'http': lambda n: 2 ** n},
        
        # Fragment settings to avoid "fragment 1 not found"
        'concurrent_fragment_downloads': 1,
        
        # HTTP settings
        'http_headers': BASE_HEADERS,
        
        # Extractor settings - use tv_embedded client to avoid restrictions
        'extractor_args': {
            'youtube': {
                'player_client': ['tv_embedded', 'web', 'android'],
                'skip': ['dash', 'hls'] if skip_download else [],
            }
        },
        
        # Skip download if requested
        'skip_download': skip_download,
    }
    
    # Add cookie configuration
    opts.update(_get_cookies_opts())
    
    # Add user agent to avoid detection
    opts['user_agent'] = BASE_HEADERS["User-Agent"]
    
    return opts


def _is_403_error(err: Exception) -> bool:
    """Check if error is HTTP 403 Forbidden"""
    s = str(err).lower()
    return any(x in s for x in ["http error 403", "forbidden", "sign in to confirm"])


def _is_fragment_error(err: Exception) -> bool:
    """Check if error is fragment-related"""
    s = str(err).lower()
    return "fragment" in s and "not found" in s


def _is_format_error(err: Exception) -> bool:
    """Check if error is format-related"""
    s = str(err).lower()
    return "requested format" in s and "not available" in s


def extract_video_id(url: str) -> str:
    """Extract video ID from YouTube URL"""
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    if "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    if "shorts/" in url:
        return url.split("shorts/")[1].split("?")[0]
    return url


@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential_jitter(initial=2, max=20),
    retry=retry_if_exception_type((yt_dlp.utils.DownloadError, YTJobError))
)
def get_video_info_with_retry(url: str) -> Optional[Dict[str, Any]]:
    """Get video info with retry logic and fallback options"""
    ydl_opts = _base_opts(skip_download=True)
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            logger.info(f"Attempting to extract info for: {url}")
            info = ydl.extract_info(url, download=False)
            
            if not info:
                logger.error("Failed to extract video information")
                raise YTJobError("No video info extracted")
            
            return info
            
    except Exception as e:
        logger.error(f"Error extracting video info: {e}")
        
        # If 403 error and no cookies, suggest solution
        if _is_403_error(e) and not _get_cookies_opts():
            logger.error("HTTP 403 error - try configuring cookies:")
            logger.error("Set YTDLP_COOKIES_FROM_BROWSER=chrome in .env")
            logger.error("Or export cookies.txt and set YTDLP_COOKIE_FILE path")
        
        raise


def get_transcript_from_video_info(info: Dict[str, Any]) -> Optional[str]:
    """Extract transcript from video info using multiple methods"""
    video_id = info.get('id')
    if not video_id:
        return None
    
    transcript_text = None
    
    # Method 1: Try to get from subtitles/captions in info
    for subtitle_type in ['subtitles', 'automatic_captions']:
        if not transcript_text and info.get(subtitle_type, {}):
            # Try English first
            for lang_code in ['en', 'en-US', 'en-GB', 'en-CA', 'en-AU', 'en-IN']:
                if lang_code in info[subtitle_type]:
                    captions = info[subtitle_type][lang_code]
                    logger.info(f"Found {lang_code} {subtitle_type}")
                    
                    if isinstance(captions, list) and captions:
                        # Try to get VTT or SRT format
                        for fmt in captions:
                            if fmt.get('ext') in ['vtt', 'srt', 'srv3', 'srv2', 'srv1']:
                                import requests
                                try:
                                    # Add retry for caption download
                                    for attempt in range(3):
                                        try:
                                            response = requests.get(
                                                fmt['url'],
                                                headers=BASE_HEADERS,
                                                timeout=15
                                            )
                                            if response.status_code == 200:
                                                transcript_text = parse_vtt_content(response.text)
                                                if transcript_text:
                                                    logger.info(f"Successfully extracted transcript from {fmt['ext']}")
                                                    return transcript_text
                                                break
                                        except requests.exceptions.RequestException:
                                            if attempt < 2:
                                                time.sleep(2 ** attempt)
                                                continue
                                            raise
                                except Exception as e:
                                    logger.warning(f"Failed to download {fmt['ext']} captions: {e}")
                                    continue
    
    # Method 2: Try youtube-transcript-api
    if not transcript_text and YOUTUBE_TRANSCRIPT_API_AVAILABLE:
        try:
            logger.info(f"Trying youtube-transcript-api for video {video_id}")
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            if transcript_list:
                transcript_text = " ".join([item['text'] for item in transcript_list])
                logger.info(f"Successfully extracted transcript via API: {len(transcript_text)} chars")
                return transcript_text
        except (TranscriptsDisabled, NoTranscriptFound) as e:
            logger.warning(f"No transcript available via API: {e}")
        except Exception as e:
            logger.warning(f"Error using youtube-transcript-api: {e}")
    
    # Method 3: Check if we can use Whisper for audio transcription
    if not transcript_text and WHISPER_AVAILABLE:
        logger.info("No captions found - will need to download audio for Whisper transcription")
        # This will be handled by the calling function
        return None
    
    return transcript_text


def parse_vtt_content(content: str) -> str:
    """Parse VTT or SRT content to extract plain text"""
    import re
    
    if not content:
        return ""
    
    # Remove WEBVTT header if present
    content = re.sub(r'^WEBVTT.*?\n\n', '', content, flags=re.MULTILINE | re.DOTALL)
    
    # Split into caption blocks
    blocks = content.split('\n\n')
    transcript_parts = []
    
    for block in blocks:
        if '-->' in block:  # This is a caption block
            lines = block.split('\n')
            # Skip timestamp lines and extract text
            text_lines = []
            for line in lines:
                line = line.strip()
                if line and '-->' not in line and not line.isdigit():
                    # Remove HTML tags if present
                    line = re.sub('<[^>]+>', '', line)
                    # Remove speaker tags like [Music] or (applause)
                    line = re.sub(r'[\[\(][^\]\)]*[\]\)]', '', line)
                    text_lines.append(line)
            
            if text_lines:
                transcript_parts.append(' '.join(text_lines))
    
    return ' '.join(transcript_parts).strip()


def download_audio_for_whisper(url: str, output_dir: Path) -> Optional[Path]:
    """Download audio only for Whisper transcription"""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    ydl_opts = _base_opts(skip_download=False)
    ydl_opts.update({
        'format': AUDIO_ONLY,
        'outtmpl': str(output_dir / '%(id)s.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    })
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            video_id = info.get('id')
            
            # Look for the downloaded audio file
            for ext in ['mp3', 'm4a', 'wav', 'opus', 'webm']:
                audio_file = output_dir / f"{video_id}.{ext}"
                if audio_file.exists():
                    logger.info(f"Audio downloaded: {audio_file}")
                    return audio_file
            
            logger.error("Audio file not found after download")
            return None
            
    except Exception as e:
        logger.error(f"Error downloading audio: {e}")
        return None


def transcribe_with_whisper(audio_file: Path) -> Optional[str]:
    """Transcribe audio using Whisper"""
    if not WHISPER_AVAILABLE:
        logger.error("Whisper not installed - run: pip install faster-whisper")
        return None
    
    try:
        model_size = os.getenv("WHISPER_MODEL", "small")
        logger.info(f"Loading Whisper model: {model_size}")
        
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        logger.info(f"Transcribing audio file: {audio_file}")
        segments, info = model.transcribe(str(audio_file), vad_filter=True)
        
        transcript_parts = []
        for segment in segments:
            transcript_parts.append(segment.text.strip())
        
        transcript_text = " ".join(transcript_parts)
        logger.info(f"Whisper transcription complete: {len(transcript_text)} chars")
        
        return transcript_text
        
    except Exception as e:
        logger.error(f"Whisper transcription error: {e}")
        return None


def process_youtube_url(url: str) -> Dict[str, Any]:
    """
    Main function to process a YouTube URL with robust error handling
    Returns dict with video info and transcript
    """
    result = {
        "url": url,
        "success": False,
        "video_id": None,
        "title": None,
        "description": None,
        "duration": None,
        "upload_date": None,
        "channel": None,
        "transcript": None,
        "transcript_source": None,
        "error": None,
        "metadata": {}
    }
    
    try:
        # Step 1: Get video info with retry
        logger.info(f"Processing YouTube URL: {url}")
        info = get_video_info_with_retry(url)
        
        if not info:
            raise YTJobError("Failed to get video info")
        
        # Extract metadata
        result["video_id"] = info.get('id')
        result["title"] = info.get('title')
        result["description"] = info.get('description')
        result["duration"] = info.get('duration')
        result["upload_date"] = info.get('upload_date')
        result["channel"] = info.get('channel', info.get('uploader'))
        result["metadata"] = {
            "webpage_url": info.get('webpage_url', url),
            "view_count": info.get('view_count'),
            "like_count": info.get('like_count'),
            "categories": info.get('categories', []),
            "tags": info.get('tags', []),
            "chapters": info.get('chapters', []),
        }
        
        # Step 2: Get transcript with multiple fallback methods
        transcript = get_transcript_from_video_info(info)
        
        if transcript:
            result["transcript"] = transcript
            result["transcript_source"] = "captions"
            result["success"] = True
            logger.info(f"Successfully extracted transcript: {len(transcript)} chars")
        else:
            # Try Whisper as last resort
            if WHISPER_AVAILABLE:
                logger.info("Attempting audio download for Whisper transcription")
                
                # Create temporary directory for audio
                temp_dir = Path("data/youtube_temp") / result["video_id"]
                audio_file = download_audio_for_whisper(url, temp_dir)
                
                if audio_file:
                    transcript = transcribe_with_whisper(audio_file)
                    if transcript:
                        result["transcript"] = transcript
                        result["transcript_source"] = "whisper"
                        result["success"] = True
                        logger.info(f"Successfully transcribed with Whisper: {len(transcript)} chars")
                    
                    # Clean up audio file
                    try:
                        audio_file.unlink()
                        temp_dir.rmdir()
                    except:
                        pass
            
            if not result["transcript"]:
                logger.warning("No transcript could be extracted")
                result["error"] = "No transcript available"
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing YouTube URL: {e}")
        result["error"] = str(e)
        return result


# For backward compatibility with existing code
def get_video_info_and_transcript(url: str) -> Optional[Dict[str, Any]]:
    """
    Backward compatible function that returns metadata in expected format
    This is what lib/youtube.py expects
    """
    result = process_youtube_url(url)
    
    if not result["success"] and not result["transcript"]:
        return None
    
    # Return in format expected by existing code
    return {
        'title': result["title"],
        'id': result["video_id"],
        'webpage_url': url,
        'categories': result["metadata"].get("categories", []),
        'tags': result["metadata"].get("tags", []),
        'description': result["description"],
        'chapters': result["metadata"].get("chapters", []),
        'transcript': result["transcript"]
    }


if __name__ == "__main__":
    # Test the handler
    import sys
    
    if len(sys.argv) > 1:
        test_url = sys.argv[1]
    else:
        test_url = "https://www.youtube.com/watch?v=LGQkkHuwm6w"
    
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    print(f"\nTesting YouTube handler with: {test_url}")
    result = process_youtube_url(test_url)
    
    if result["success"]:
        print(f"\n✅ SUCCESS!")
        print(f"Title: {result['title']}")
        print(f"Video ID: {result['video_id']}")
        print(f"Channel: {result['channel']}")
        print(f"Duration: {result['duration']} seconds")
        print(f"Transcript Source: {result['transcript_source']}")
        print(f"Transcript Length: {len(result['transcript']) if result['transcript'] else 0} characters")
        if result['transcript']:
            print(f"Transcript Preview: {result['transcript'][:200]}...")
    else:
        print(f"\n❌ FAILED!")
        print(f"Error: {result['error']}")