from processing.web_content_processor import WebContentProcessor
from dotenv import load_dotenv
from processing.content_analysis import ContentAnalysisEngine
import concurrent.futures
import csv
import datetime
import json
import os
import re
from concurrent.futures import ThreadPoolExecutor

import requests
import streamlit as st
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Load environment variables
load_dotenv()
directory = os.environ.get('TRANSCRIPT_DIRECTORY_PATH')

# Lazy initialization to prevent environment variable loading issues
analyzer = None
web_processor = None


def get_analyzer():
    global analyzer
    if analyzer is None:
        analyzer = ContentAnalysisEngine()
    return analyzer


def get_web_processor():
    global web_processor
    if web_processor is None:
        web_processor = WebContentProcessor()
    return web_processor


def detect_transcript_language(text):
    """Detect if transcript is actually in English despite YouTube labeling"""
    if not text or len(text.strip()) < 50:
        return 'too_short'

    # Count different character types
    korean_count = sum(1 for char in text if '\uAC00' <= char <= '\uD7A3')
    chinese_count = sum(1 for char in text if '\u4E00' <= char <= '\u9FFF')
    japanese_count = sum(1 for char in text if '\u3040' <=
                         char <= '\u309F' or '\u30A0' <= char <= '\u30FF')
    english_count = sum(1 for char in text if char.isalpha()
                        and ord(char) < 128)

    total_alpha_chars = sum(1 for char in text if char.isalpha())
    if total_alpha_chars < 30:  # Lowered threshold for better detection
        return 'too_short'

    # Calculate if this is actually English
    if korean_count > total_alpha_chars * 0.1:
        return 'korean'
    elif chinese_count > total_alpha_chars * 0.1:
        return 'chinese'
    elif japanese_count > total_alpha_chars * 0.1:
        return 'japanese'
    elif english_count > total_alpha_chars * 0.7:
        return 'english'
    else:
        return 'mixed'


def get_folder_path_from_metadata(metadata):
    """Helper function to get the correct folder path based on metadata.

    T-061 §3 P3 / D1 / D2: previously composed
    `<TRANSCRIPT_DIRECTORY_PATH or cwd>/<YYYY-MM-DD>/<id>` -- ignoring
    DISCLOSURE_RAG_KB_PATH entirely (this was the one writer that escaped the
    kb_root consolidation, so the benchmark sandbox override could not
    redirect it) and falling back to the process's current working directory
    when the env var was unset (a transcript could land wherever the process
    happened to be started from). Now routed through resolve_entry_dir(), so
    DISCLOSURE_RAG_KB_PATH redirects this writer along with every other one.

    source_key is the video's channel_id, populated by fetch_channel_metadata()
    (T-061 D5) before this function is called. When the lookup itself failed
    (no GOOGLE_API_KEY, quota, network, or a deleted/private video), metadata
    simply carries no channel_id -- this still resolves to None and the entry
    lands under "unresolved/", the same soft-fallback behavior as before D5
    was closed, never a crash.
    """
    if directory:
        print(
            "⚠️ TRANSCRIPT_DIRECTORY_PATH is set but no longer used as the "
            "archive root; transcripts are written under kb_root()'s "
            "sources/transcripts/ tree. Set DISCLOSURE_RAG_KB_PATH instead "
            "to redirect the archive root."
        )

    from .kb.kb_root import resolve_entry_dir
    source_key = (metadata or {}).get('channel_id') or None

    if metadata and metadata.get('id'):
        entry_id = metadata['id']
    elif metadata and metadata.get('title'):
        entry_id = clean_string(metadata['title'])
    else:
        entry_id = 'unknown'

    return str(resolve_entry_dir("transcripts", source_key, entry_id))


YOUTUBE_DATA_API_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"
# YouTube Data API v3's own limit for a single videos.list `id` parameter.
YOUTUBE_DATA_API_BATCH_SIZE = 50


def fetch_channel_metadata(video_ids):
    """Look up channel_id, channel_title, and published_at for YouTube video
    ids via the YouTube Data API v3 (T-061 D5 -- youtube-transcript-api alone
    returns no channel info at all, so before this every transcript resolved
    to sources/transcripts/unresolved/, transcripts being the largest tree).

    Batches up to YOUTUBE_DATA_API_BATCH_SIZE ids per call.

    Fails soft in every direction -- no GOOGLE_API_KEY, quota exhaustion, a
    network error, or a deleted/private video (simply absent from the
    response's `items`) all degrade to that id being missing from the
    returned dict. This function never raises. Callers must treat a missing
    id exactly like "no channel info available" (source_key=None ->
    "unresolved/"), never abort an ingest or lose a transcript over a failed
    metadata lookup.

    Never logs the API key: exceptions are reported by type only
    (`type(e).__name__`), never by str(e) -- `requests`' own exception
    messages (e.g. HTTPError, ConnectionError) embed the full request URL,
    which carries `key=<GOOGLE_API_KEY>` as a query param.

    Returns {video_id: {"channel_id": str, "channel_title": str,
    "published_at": str}}, one entry per id YouTube actually returned data
    for.
    """
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print(
            "⚠️ GOOGLE_API_KEY not set; channel metadata lookup skipped -- "
            "source resolves to 'unresolved/'."
        )
        return {}

    ids = [vid for vid in dict.fromkeys(video_ids) if vid]
    if not ids:
        return {}

    results = {}
    for i in range(0, len(ids), YOUTUBE_DATA_API_BATCH_SIZE):
        batch = ids[i:i + YOUTUBE_DATA_API_BATCH_SIZE]
        try:
            resp = requests.get(
                YOUTUBE_DATA_API_VIDEOS_URL,
                params={"part": "snippet", "id": ",".join(batch), "key": api_key},
                timeout=15,
            )
            resp.raise_for_status()
            payload = resp.json()
        except requests.RequestException as e:
            print(
                f"⚠️ YouTube Data API channel lookup failed for a batch of "
                f"{len(batch)} video(s) ({type(e).__name__}); those entries "
                f"resolve to 'unresolved/'."
            )
            continue
        except ValueError as e:
            # resp.json() failed to parse -- treat like any other soft failure.
            print(
                f"⚠️ YouTube Data API returned an unparseable response "
                f"({type(e).__name__}); batch resolves to 'unresolved/'."
            )
            continue

        for item in (payload.get("items") or []):
            vid = item.get("id")
            if not vid:
                continue
            snippet = item.get("snippet") or {}
            results[vid] = {
                "channel_id": snippet.get("channelId"),
                "channel_title": snippet.get("channelTitle"),
                "published_at": snippet.get("publishedAt"),
            }
        # Any id absent from `items` (deleted/private video, or a partial
        # response) is simply missing from `results` -- same "unresolved"
        # fallback as a hard failure, not a special case to handle here.

    return results


def to_camel_case(snake_str):
    components = snake_str.split('-')
    return components[0] + ''.join(x.title() for x in components[1:])


def clean_string(input_string):
    cleaned_string = re.sub(r'[^a-zA-Z0-9]+', '-',
                            input_string).strip('-').lower()
    camel_case_string = to_camel_case(cleaned_string)
    return camel_case_string


def format_metadata(metadata):
    """Format metadata into a readable string"""
    formatted_text = []

    # Add title and URL
    formatted_text.append(f"# {metadata['title']}")
    formatted_text.append(f"[Video Link]({metadata['webpage_url']})")
    formatted_text.append(f"**ID**: {metadata['id']}")

    # Add categories if present
    if metadata.get('categories'):
        formatted_text.append(
            f"**Categories**: {', '.join(metadata['categories'])}")

    # Add tags if present
    if metadata.get('tags'):
        formatted_text.append(f"**Tags**: {', '.join(metadata['tags'])}")

    # Add description if present
    if metadata.get('description'):
        formatted_text.append("\n## Description")
        formatted_text.append(metadata['description'])

    # Add chapters if present
    if metadata.get('chapters') and metadata['chapters']:
        formatted_text.append("\n## Chapters")
        for chapter in metadata['chapters']:
            start_time = chapter.get('start_time', 0)
            title = chapter.get('title', 'Untitled')
            formatted_text.append(f"- **{title}** at {start_time}s")

    return "\n".join(formatted_text)


def get_video_info_and_transcript(url):
    """Get video information and transcript using youtube-transcript-api only

    ═══ YT-CHAIN-07 · lib/youtube.py :: get_video_info_and_transcript() ═══
    A thin wrapper. The yt-dlp path is gone — this is transcript-api only,
    so an ImportError here means no transcript at all, not a slower route.
    PREV ← YT-CHAIN-06  generate_transcript()
    NEXT → YT-CHAIN-08  lib/youtube_transcript_enhanced.py ::
                        get_video_info_and_transcript_enhanced()
    ═══════════════════════════════════════════════════════════════════════
    """
    try:
        # Use youtube-transcript-api (cookie-free, fast, reliable)
        try:
            from .youtube_transcript_enhanced import get_video_info_and_transcript_enhanced
            enhanced_result = get_video_info_and_transcript_enhanced(url)
            if enhanced_result and enhanced_result.get('transcript'):
                print("✅ Successfully extracted transcript using youtube-transcript-api")
                return enhanced_result
            else:
                print("⚠️ youtube-transcript-api failed - no transcript available")
                return None
        except ImportError:
            print("❌ youtube-transcript-api module not available")
            return None
        except Exception as e:
            print(f"❌ youtube-transcript-api error: {e}")
            return None

    except Exception as e:
        print(f"Error: {e}")
        return None


def write_transcript_to_file(title, transcript, url, analysis, metadata=None):
    """Write transcript to file with updated path structure"""
    video_title = clean_string(title)
    file_name = f"{video_title}.txt"
    folder_path = get_folder_path_from_metadata(metadata)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, file_name)

    with open(file_path, "w", encoding='utf-8') as file:
        if title:
            file.write(f"{title}\n\n")
        if url:
            file.write(f"{url}\n\n")
        if analysis:
            file.write(analysis)
            file.write("\n\n")
        file.write(transcript)

    print(f"Transcript saved to {file_name}")
    return file_path


def write_transcript_segments_to_file(title, segments, metadata=None):
    """Persist timed transcript segments beside the flat transcript.

    The fetch returns `{text, start, duration}` per segment and
    format_transcript_segments() throws the timing away one line later, so the
    persisted `.txt` carries no timestamps at all (`grep -cE '[0-9]{1,2}:[0-9]{2}'`
    on it returns 0). Everything downstream — chunks, claims, entities — is
    therefore un-citable: there is no way to point from an extracted claim back
    at the moment in the source that supports it.

    Timing exists only at fetch time. A source ingested without it must be
    re-fetched to ever carry citations, which is why this is captured now even
    though nothing consumes it yet.

    Returns the sidecar path, or None when the fetch produced no segments (the
    yt-dlp/VTT and plain-text paths, which have no timing to preserve).
    """
    if not segments:
        return None

    from .transcript_fidelity import _seg_field

    records = []
    for ordinal, seg in enumerate(segments):
        text = (seg.get("text", "") if hasattr(seg, "get")
                else getattr(seg, "text", "")) or ""
        try:
            start = _seg_field(seg, "start")
            duration = _seg_field(seg, "duration")
        except (TypeError, ValueError):
            # A segment with unreadable timing is still real text. Keep it with
            # null timing rather than dropping it, so the sidecar's ordinals
            # stay aligned with the transcript they came from.
            start = duration = None
        records.append({
            "ordinal": ordinal,
            "text": text.strip(),
            "start": start,
            "duration": duration,
        })

    folder_path = get_folder_path_from_metadata(metadata)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, f"{clean_string(title)}_segments.json")
    with open(file_path, "w", encoding='utf-8') as f:
        json.dump({
            "video_id": (metadata or {}).get("id"),
            "segment_count": len(records),
            "segments": records,
        }, f, indent=2, ensure_ascii=False)

    print(f"Transcript segments saved to {os.path.basename(file_path)}")
    return file_path


def write_metadata_to_json(metadata, title):
    """Write metadata to a JSON file with updated path structure"""
    video_title = clean_string(title)
    file_name = f"{video_title}_metadata.json"
    folder_path = get_folder_path_from_metadata(metadata)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, file_name)

    with open(file_path, "w", encoding='utf-8') as file:
        json.dump(metadata, file, indent=2, ensure_ascii=False)

    print(f"Metadata saved to {file_name}")
    return file_path


def generate_transcript(url):
    """Generate transcript using only youtube-transcript-api

    ═══ YT-CHAIN-06 · lib/youtube.py :: generate_transcript() ═════════════
    Does Phases 3, 4 and 5 of the chain in one function:
      Phase 3 (download)  → YT-CHAIN-07  get_video_info_and_transcript()
      Phase 4 (analysis)  → YT-CHAIN-10  analyze_content()      [OpenRouter]
                          → YT-CHAIN-11  process_for_rag()      [OpenRouter]
      Phase 5 (artifacts) → YT-CHAIN-12  write_transcript_to_file() et al
    NO LLM has been called until Phase 4. Returns a file_paths dict.
    PREV ← YT-CHAIN-05  KnowledgeBaseService :: process_youtube_with_enhanced_workflow()
    NEXT → YT-CHAIN-07  lib/youtube.py :: get_video_info_and_transcript()
    ═══════════════════════════════════════════════════════════════════════
    """
    metadata = get_video_info_and_transcript(url)
    if not metadata or not metadata.get('title'):
        print("❌ Failed to extract video information")
        return None

    name = metadata['title']
    print("========================METADATA=========================")

    # If transcript is missing at this point, abort gracefully (downstream expects transcript)
    if not metadata.get('transcript'):
        print("❌ Failed to generate transcript")
        return None

    # T-061 D5: channel lookup, merged into `metadata` before anything below
    # reads it for path resolution (get_folder_path_from_metadata(), called
    # by write_transcript_to_file() a few lines down, is the first reader).
    # fetch_channel_metadata() fails soft -- a failed lookup just leaves
    # metadata without a channel_id, which resolves to "unresolved/" exactly
    # as before D5 was closed. Never blocks or fails the transcript itself.
    video_id = metadata.get('id')
    if video_id:
        channel_info = fetch_channel_metadata([video_id]).get(video_id, {})
        if channel_info.get('channel_id'):
            print(
                f"✅ Channel resolved: "
                f"{channel_info.get('channel_title') or channel_info['channel_id']}"
            )
        else:
            print("⚠️ No channel metadata resolved for this video; source resolves to 'unresolved/'.")
        metadata.update({k: v for k, v in channel_info.items() if v})

    analyzer = get_analyzer()
    try:
        analysis = analyzer.analyze_content(metadata['transcript'])
        if analysis is None:
            print("❌ Content analysis failed - likely API key issue")
            return None
    except Exception as e:
        print(f"❌ Content analysis error: {e}")
        return None

    rag_pipeline = {'status': 'skipped', 'errors': []}
    try:
        rag_pipeline = analyzer.process_for_rag(
            metadata['transcript'],
            provenance=metadata.get('webpage_url', url),
            filename_hint=name,
        )
        print(
            f"RAG pipeline status={rag_pipeline.get('status')} "
            f"embeddable={len(rag_pipeline.get('embeddable_texts') or [])}"
        )
    except Exception as e:
        print(f"⚠️ RAG pipeline skipped: {e}")
        rag_pipeline = {'status': 'error', 'errors': [str(e)]}

    chapters = []
    if metadata.get('chapters'):
        for chapter in metadata['chapters']:
            if 'title' in chapter:
                chapters.append({'title': chapter['title']})

    summary_title = f"{name} Summary"
    file_metadata = {
        'title': name,
        'url': metadata.get('webpage_url', url),
        'id': metadata.get('id'),
        # T-061 D5: from fetch_channel_metadata() above (None when the
        # lookup failed or wasn't attempted -- the corpus has never had
        # published_at before, worth capturing now that it's available).
        'channel_id': metadata.get('channel_id'),
        'channel_title': metadata.get('channel_title'),
        'published_at': metadata.get('published_at'),
        'categories': metadata.get('categories', []),
        'tags': metadata.get('tags', []),
        'description': metadata.get('description'),
        'chapters': chapters,
        # How many timed segments the sidecar holds. 0 means this source was
        # ingested without timing and can never carry claim-level citations
        # without a re-fetch — worth being able to see per document.
        'transcript_segment_count': len(metadata.get('transcript_segments') or []),
        'rag_pipeline': {
            'status': rag_pipeline.get('status'),
            'embeddable_count': len(rag_pipeline.get('embeddable_texts') or []),
            'prompts_used': (rag_pipeline.get('metadata') or {}).get('prompts_used'),
            # Carried so a caller grading enrichment can say *why* it failed.
            # Without this the status arrives bare and a 401 reads the same as
            # any other non-ok result.
            'errors': rag_pipeline.get('errors') or [],
        },
    }

    # ═══ YT-CHAIN-12 · lib/youtube.py :: Phase 5, artifact writes ══════════
    # All local file I/O, no network. In order:
    #   write_transcript_to_file()          → the transcript
    #   write_transcript_segments_to_file() → timed sidecar (best-effort)
    #   write_transcript_to_file() again    → Summary.txt, body = `analysis`
    #                                         from YT-CHAIN-10
    #   json.dump()                         → *_rag_pipeline.json
    # PREV ← YT-CHAIN-11  process_for_rag()
    # NEXT → YT-CHAIN-13  lib/trace_map.py :: build_and_write_trace_map()
    # ═══════════════════════════════════════════════════════════════════════
    file_path = write_transcript_to_file(
        name, metadata['transcript'], url, None, metadata)
    print(file_path)

    # Timed segments, captured here because fetch time is the only place they
    # exist. Best-effort: a missing sidecar must never fail an otherwise good
    # ingest, since nothing reads it yet.
    segments_path = None
    try:
        segments_path = write_transcript_segments_to_file(
            name, metadata.get('transcript_segments'), metadata)
    except Exception as e:
        print(f"⚠️ Transcript segment sidecar skipped: {e}")

    summary_path = write_transcript_to_file(
        summary_title, analysis, url, None, metadata)
    print(summary_path)

    rag_pipeline_path = os.path.join(
        os.path.dirname(file_path),
        f"{clean_string(name)}_rag_pipeline.json",
    )
    with open(rag_pipeline_path, 'w', encoding='utf-8') as f:
        json.dump(rag_pipeline, f, indent=2, ensure_ascii=False)
    print(rag_pipeline_path)

    # Trace Map: the provenance graph of this one source
    # (docs/TRACE_MAP_OUTPUT_SPEC.md). Built deterministically from the
    # pipeline result plus the timed sidecar written a few lines up — this is
    # the only place both exist together, and the alignment it does is what
    # turns an extracted claim back into a citable moment in the source.
    #
    # Best-effort like the sidecar, but never silent: the summary comes back to
    # the caller so a run can be graded on whether the map is real rather than
    # merely written.
    #
    # ═══ YT-CHAIN-13 · lib/trace_map.py :: build_and_write_trace_map() ═════
    # Needs the YT-CHAIN-11 pipeline result AND the YT-CHAIN-12 timed sidecar
    # together — this function is the only place in the chain where both
    # exist. That alignment is what turns an extracted claim back into a
    # citable moment in the source.
    # PREV ← YT-CHAIN-12  Phase 5 artifact writes
    # NEXT → YT-CHAIN-14  knowledge_base_service.py Phase 6 sinks
    #        (via return to YT-CHAIN-06 → YT-CHAIN-05)
    # ═══════════════════════════════════════════════════════════════════════
    trace_map = None
    try:
        from .trace_map import build_and_write_trace_map

        trace_map = build_and_write_trace_map(
            pipeline_result=rag_pipeline,
            directory=os.path.dirname(file_path),
            stem=clean_string(name),
            # The sidecar, not metadata['transcript_segments'] — the raw fetch
            # objects carry no ordinal, and the map's whole anchor scheme is
            # ordinal-based. Reading the file also means the map is built from
            # the same artefact a reviewer can open.
            segments_path=segments_path,
            source_url=metadata.get('webpage_url', url),
            source_title=name,
            source_id=metadata.get('id'),
            source_type="video",
            transcript_text=metadata.get('transcript') or "",
        )
        print(
            f"Trace map: {trace_map['node_count']} nodes / "
            f"{trace_map['edge_count']} edges, "
            f"{(trace_map['coverage_fraction'] or 0):.0%} coverage, "
            f"{trace_map['error_count']} errors, "
            f"{trace_map['gap_count']} gaps"
        )
        print(trace_map['json_path'])
    except Exception as e:
        print(f"⚠️ Trace map skipped: {e}")
        trace_map = {"error": str(e)}
    file_metadata['trace_map'] = trace_map

    # Write summary to Mem0 memory (best-effort, no failures propagated)
    try:
        from .mem0_integration import add_youtube_summary_memory
    except Exception:
        try:
            from lib.mem0_integration import add_youtube_summary_memory
        except Exception:
            add_youtube_summary_memory = None

    if add_youtube_summary_memory:
        try:
            add_youtube_summary_memory(
                title=name,
                video_url=metadata.get('webpage_url', url),
                video_id=metadata.get('id'),
                summary_text=analysis or "",
                tags=metadata.get('tags', [])
            )
        except Exception as e:
            print(f"⚠️ Mem0 write skipped: {e}")

    metadata_file_name = f"{clean_string(name)}_metadata.json"
    metadata_path = os.path.join(
        os.path.dirname(file_path), metadata_file_name)
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(file_metadata, f, indent=2, ensure_ascii=False)

    return {
        'file_path': file_path,
        'summary_path': summary_path,
        'metadata_path': metadata_path,
        'rag_pipeline_path': rag_pipeline_path,
        'segments_path': segments_path,
        'trace_map': trace_map,
        'rag_pipeline': rag_pipeline,
        'embeddable_texts': rag_pipeline.get('embeddable_texts') or [],
    }


def parse_file_and_generate_transcript(file_path, max_workers=5):
    # Read URLs from file
    try:
        file_extension = os.path.splitext(file_path)[1].lower()
        urls = []

        with open(file_path, 'r', encoding='utf-8') as file:
            if file_extension == '.csv':
                reader = csv.DictReader(file)
                urls = [row['url'] for row in reader if 'url' in row]
            elif file_extension == '.json':
                data = json.load(file)
                if isinstance(data, list):
                    urls = [item['url'] for item in data if isinstance(
                        item, dict) and 'url' in item]
                elif isinstance(data, dict) and 'urls' in data:
                    urls = data['urls']
            else:
                raise ValueError(
                    f"Unsupported file extension: {file_extension}. Please use .csv or .json files.")

        if not urls:
            raise ValueError("No valid URLs found in the input file")

        # Helper function to detect YouTube URLs
        def is_youtube_url(url):
            youtube_patterns = [
                r'youtube\.com/watch\?v=',
                r'youtu\.be/',
                r'youtube\.com/shorts/',
                r'youtube\.com/playlist\?list='
            ]
            return any(re.search(pattern, url) for pattern in youtube_patterns)

        # Process URLs in parallel
        results = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {}

            # Separate YouTube URLs from other URLs
            for url in urls:
                if is_youtube_url(url):
                    # For YouTube URLs, use generate_transcript
                    future = executor.submit(generate_transcript, url)
                else:
                    # For other URLs, use web_processor.process_url
                    future = executor.submit(
                        get_web_processor().process_url, url)

                future_to_url[future] = url

            for future in concurrent.futures.as_completed(future_to_url):
                result = future.result()
                if result:
                    results.append(result)

        return results

    except Exception as e:
        print(f"Error processing file {file_path}: {str(e)}")
        return []
