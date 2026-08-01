#!/usr/bin/env python3
"""
Enhanced main.py with Upstash Search integration
Your existing daily workflow + automatic Search sync for frontend
Date: June 20, 2025

Usage (same as before):
  python main_enhanced.py "https://youtube.com/watch?v=..."
  python main_enhanced.py "https://some-article.com"
  python main_enhanced.py /path/to/document.pdf --upload
"""

import argparse
import os
import sys
import json
import logging
from pathlib import Path
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Heavy, slow-loading dependencies (faiss via cocoindex, mem0, OpenAI clients,
# etc.) are imported lazily via _import_heavy_dependencies() below instead of
# at module load time, so `--help` and simple argparse errors don't pay for
# them (T-045 M1). The names below are module globals populated on first
# call; declared here so static readers can see what process_url/process_file
# depend on.
WebContentProcessor = None
ContentAnalysisEngine = None
upload_file_to_openai = None
kb_service = None
process_youtube_url_enhanced = None
process_web_url_enhanced = None
add_to_knowledge_base = None
display = None
web_processor = None
ENHANCED_COCOINDEX_AVAILABLE = False
COCOINDEX_KG_AVAILABLE = False
cocoindex_processor = None
UPSTASH_QUEUE_AVAILABLE = False
add_processed_content_to_queue = None

_deps_loaded = False


def _import_heavy_dependencies() -> None:
    """Import heavy dependencies on first use, not at module load.

    Idempotent so it's safe to call from main(), process_url(), and
    process_file() alike - the latter two are also imported directly by
    scripts/playlist_ingestion.py (`from main import process_url`), which
    never calls main() and would otherwise hit NameError on these globals.
    """
    global _deps_loaded
    if _deps_loaded:
        return

    global WebContentProcessor, ContentAnalysisEngine, upload_file_to_openai
    global kb_service, process_youtube_url_enhanced, process_web_url_enhanced
    global add_to_knowledge_base, display, web_processor
    global ENHANCED_COCOINDEX_AVAILABLE, COCOINDEX_KG_AVAILABLE, cocoindex_processor
    global UPSTASH_QUEUE_AVAILABLE, add_processed_content_to_queue

    from processing.web_content_processor import WebContentProcessor
    from processing.content_analysis import ContentAnalysisEngine
    from lib.openai_client.upload import upload_file_to_openai
    from lib.knowledge_base_service import (
        kb_service,
        process_youtube_url_enhanced,
        process_web_url_enhanced,
        add_to_knowledge_base
    )
    from lib.terminal_display import display

    # Import enhanced CocoIndex for enhanced vector search
    try:
        from lib.cocoindex import create_live_cocoindex, BackendFactory  # noqa: F401
        ENHANCED_COCOINDEX_AVAILABLE = True
        logger.info("Enhanced CocoIndex available")
    except ImportError:
        ENHANCED_COCOINDEX_AVAILABLE = False
        logger.warning("Enhanced CocoIndex not available")

    # Import CocoIndex knowledge graph integration
    try:
        from lib.cocoindex_integration import cocoindex_processor
        COCOINDEX_KG_AVAILABLE = True
        logger.info("CocoIndex knowledge graph integration available")
    except ImportError as e:
        COCOINDEX_KG_AVAILABLE = False
        logger.warning(f"CocoIndex knowledge graph integration not available: {e}")

    # Import Upstash queue (fails at import time if UPSTASH_VECTOR_REST_URL/TOKEN
    # are unset) - guard it so --status and non-upload runs still work without
    # Upstash configured.
    try:
        from lib.upstash.queue import add_processed_content_to_queue
        UPSTASH_QUEUE_AVAILABLE = True
    except (ImportError, RuntimeError) as e:
        UPSTASH_QUEUE_AVAILABLE = False
        logger.warning(f"Upstash queue not available: {e}")

        def add_processed_content_to_queue(*args, **kwargs):
            logger.warning("Skipping Upstash queue - not configured")
            return {"success": False, "skipped": True}

    # Initialize processors (kept as-is: constructed but unused elsewhere in
    # this module today - preserved rather than removed, out of scope here)
    web_processor = WebContentProcessor()

    _deps_loaded = True


_YOUTUBE_HOSTNAMES = {"youtube.com", "youtu.be"}


def is_youtube_url(url: str) -> bool:
    """Check if URL's hostname is a YouTube domain (not a substring match).

    A substring check (`'youtube.com' in url`) accepts hostile URLs like
    `https://evil.com/?x=youtube.com/watch` - parse the hostname instead.
    """
    try:
        hostname = (urlparse(url).hostname or "").lower()
    except ValueError:
        return False
    if hostname.startswith("www."):
        hostname = hostname[4:]
    return hostname in _YOUTUBE_HOSTNAMES or hostname.endswith(".youtube.com")


def trigger_cocoindex_processing(doc_id: str, force_update: bool = False) -> Optional[Dict[str, Any]]:
    """Trigger CocoIndex knowledge graph processing for a document"""
    if not COCOINDEX_KG_AVAILABLE:
        logger.info("CocoIndex KG processing skipped - not available")
        return None

    try:
        logger.info(
            f"Triggering CocoIndex knowledge graph processing for document: {doc_id}")
        result = cocoindex_processor.process_document_knowledge_graph(
            doc_id, force_update)

        if result.get('status') == 'success':
            entities_count = result.get('entities_processed', 0)
            relationships_count = result.get('relationships_processed', 0)
            logger.info(
                f"CocoIndex processing completed: {entities_count} entities, {relationships_count} relationships")
        elif result.get('status') == 'skipped':
            logger.info(
                f"CocoIndex processing skipped: {result.get('reason', 'unknown')}")
        else:
            logger.warning(
                f"CocoIndex processing failed: {result.get('error', 'unknown error')}")

        return result

    except Exception as e:
        logger.error(f"Error triggering CocoIndex processing: {e}")
        return None


def _detail(value: Any, limit: int = 200) -> str:
    """Coerce any value into a short, printable string.

    Prevents raw API-response objects (e.g. queue_result['qstash_response'])
    from leaking into printed output the way `data['file_paths']` values did
    (T-045 H7's "Files Created" bug) - every stage detail must be a plain
    string here, not whatever shape an upstream dict happened to contain.
    """
    if value is None:
        return ""
    text = value if isinstance(value, str) else str(value)
    return text if len(text) <= limit else text[:limit - 1] + "…"


def _stage(name: str, ok: bool, detail: Any = "") -> Dict[str, str]:
    return {"name": name, "status": "success" if ok else "failed", "detail": _detail(detail)}


def _skipped(name: str, reason: Any = "") -> Dict[str, str]:
    return {"name": name, "status": "skipped", "detail": _detail(reason)}


def _unknown(name: str, reason: Any = "") -> Dict[str, str]:
    """Stage outcome we have no positive evidence for either way.

    Used when an upstream dict's shape doesn't match anything we recognize -
    other agents are actively changing those shapes; defaulting to unknown
    instead of guessing ✅ is the whole point of this fix (T-045 H7).
    """
    return {"name": name, "status": "unknown", "detail": _detail(reason)}


def _call_mem0(name: str, fn, *args, **kwargs) -> Dict[str, str]:
    """Call a mem0_integration function, tracking its real outcome.

    mem0_integration's add_* functions all return None whether they were
    skipped (mem0 disabled) or succeeded, and internally swallow nothing -
    exceptions do propagate. Checking `_is_enabled()` first lets us tell
    "skipped, not configured" apart from "attempted"; catching the call
    lets us tell "attempted, failed" apart from "attempted, succeeded".
    """
    try:
        from lib.mem0_integration import _is_enabled
    except Exception as e:
        return _skipped(name, f"mem0 integration module not available: {e}")

    if not _is_enabled():
        return _skipped(name, "mem0 disabled or no API key")

    try:
        fn(*args, **kwargs)
        return _stage(name, True)
    except Exception as e:
        logger.warning(f"{name} skipped: {e}")
        return _stage(name, False, str(e))


def _summarize_queue_result(queue_result: Optional[Dict[str, Any]]) -> Dict[str, str]:
    """Interpret add_processed_content_to_queue()'s return value truthfully.

    Two call sites disagree on shape: the real implementation
    (lib/upstash/queue.py) returns {"qstash_response": ..., "vector_upload":
    {...}} with no top-level "success" key, while the not-configured fallback
    (_import_heavy_dependencies, above) returns {"success": False, "skipped":
    True}. A naive `.get('success')` check is falsy for a *successful* real
    call - that mismatch is exactly the kind of thing that turns into a false
    ✅ or false ❌. Recognize both shapes explicitly; anything else is unknown.
    """
    name = "QStash queue enqueue"
    if not isinstance(queue_result, dict):
        return _unknown(name, "no result returned")
    if queue_result.get("skipped"):
        return _skipped(name, "queue not configured")
    if queue_result.get("success") is False:
        return _stage(name, False, queue_result.get("error", ""))
    vector_upload = queue_result.get("vector_upload")
    if isinstance(vector_upload, dict) and vector_upload.get("success") is False:
        return _stage(name, False, "vector DB upload failed")
    if "qstash_response" in queue_result or queue_result.get("success"):
        return _stage(name, True)
    return _unknown(name, "unrecognized queue result shape")


_STAGE_ICONS = {"success": "✅", "skipped": "⚠️", "failed": "❌", "unknown": "❔"}


def _print_stage_report(stages: List[Dict[str, str]]) -> None:
    """Print each pipeline stage's real outcome - never presence-check a key
    and print ✅ for it (T-045 H7). Pulled out as a standalone function so it
    can be exercised without running a real pipeline, e.g.:

        python -c "import main; main._print_stage_report([
            {'name': 'Entity extraction', 'status': 'failed', 'detail': '401 invalid key'},
        ])"
    """
    if not stages:
        return
    print("\n📋 \033[1mPipeline stages:\033[0m")
    for stage in stages:
        icon = _STAGE_ICONS.get(stage.get("status"), "❔")
        line = f"   {icon} {stage.get('name', 'unknown stage')}"
        detail = stage.get("detail")
        if detail:
            line += f": {detail}"
        print(line)


def process_url(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a URL (web page or YouTube video) with enhanced mem0 integration"""
    _import_heavy_dependencies()
    logger.info(f"Processing URL: {url}")
    stages: List[Dict[str, str]] = []
    youtube = is_youtube_url(url)

    if youtube:
        result = process_youtube_url_enhanced(url, upload, add_to_kb)
        content_type = "youtube_video"
        stages.append(_stage("YouTube transcript extraction", result is not None))
    else:
        result = process_web_url_enhanced(url, upload, add_to_kb)
        content_type = "web_article"
        stages.append(_stage("Web content extraction", result is not None))

    if result is None:
        return None

    # Add mem0 integration for web articles (YouTube already has it in generate_transcript)
    if not youtube:
        try:
            from lib.mem0_integration import add_web_article_memory
            stages.append(_call_mem0(
                "Mem0 web article memory", add_web_article_memory,
                title=result.get('title', 'Unknown'),
                url=url,
                content=result.get('content', ''),
                summary=result.get('analysis', ''),
                tags=result.get('tags', [])
            ))
        except ImportError as e:
            stages.append(_skipped("Mem0 web article memory", f"module unavailable: {e}"))

    # Add CocoIndex knowledge graph processing if result has doc_id.
    # process_web_with_enhanced_workflow() already runs CocoIndex internally
    # (knowledge_base_service.py:~735-785); triggering it again here for web
    # results ran a second, global `cocoindex update` on every web ingestion.
    # The YouTube workflow has no internal CocoIndex step, so it still needs
    # this pass.
    if result.get('doc_id') and add_to_kb and youtube:
        try:
            display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
            display.start_spinner(
                "📊 Building knowledge graph with CocoIndex...")

            cocoindex_result = trigger_cocoindex_processing(result['doc_id'])
            if cocoindex_result and cocoindex_result.get('status') == 'success':
                entities_count = cocoindex_result.get('entities_processed', 0)
                relationships_count = cocoindex_result.get(
                    'relationships_processed', 0)
                display.stop_spinner(
                    f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                result['cocoindex_processing'] = cocoindex_result
                stages.append(_stage(
                    "Knowledge graph construction", True,
                    f"{entities_count} entities, {relationships_count} relationships"))

                try:
                    from lib.mem0_integration import add_knowledge_graph_memory
                    stages.append(_call_mem0(
                        "Mem0 knowledge graph memory", add_knowledge_graph_memory,
                        doc_id=result['doc_id'],
                        entities_processed=entities_count,
                        relationships_processed=relationships_count,
                        kg_results=cocoindex_result
                    ))
                except ImportError as e:
                    stages.append(_skipped("Mem0 knowledge graph memory", f"module unavailable: {e}"))
            elif cocoindex_result and cocoindex_result.get('status') == 'skipped':
                display.stop_spinner(
                    f"⚠️ Knowledge graph processing skipped: {cocoindex_result.get('reason', 'unknown')}")
                result['cocoindex_processing'] = cocoindex_result
                stages.append(_skipped(
                    "Knowledge graph construction", cocoindex_result.get('reason', 'unknown')))
            else:
                display.stop_spinner("❌ Knowledge graph processing failed")
                if cocoindex_result:
                    result['cocoindex_processing'] = cocoindex_result
                stages.append(_stage(
                    "Knowledge graph construction", False,
                    (cocoindex_result or {}).get('error', 'unknown error')))

        except Exception as e:
            display.stop_spinner("❌ Knowledge graph processing failed")
            logger.error(f"CocoIndex processing failed: {e}")
            stages.append(_stage("Knowledge graph construction", False, str(e)))
            # Don't fail the entire process if CocoIndex processing fails

    # Add comprehensive processing summary to memory
    if result.get('doc_id'):
        try:
            from lib.mem0_integration import add_processing_summary_memory
            final_status = "success" if result.get('doc_id') else "failed"
            stages.append(_call_mem0(
                "Mem0 processing summary memory", add_processing_summary_memory,
                doc_id=result['doc_id'],
                title=result.get('title', 'Unknown'),
                content_type=content_type,
                processing_steps=[s['name'] for s in stages],
                final_status=final_status
            ))
        except ImportError as e:
            stages.append(_skipped("Mem0 processing summary memory", f"module unavailable: {e}"))

    result['stage_report'] = stages
    return result


def process_file(file_path: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a local file with enhanced mem0 integration"""
    _import_heavy_dependencies()
    logger.info(f"Processing file: {file_path}")
    stages: List[Dict[str, str]] = []

    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None

    is_pdf = file_path.lower().endswith('.pdf')

    try:
        # Read file content - PDFs need text extraction, everything else is
        # read as text (main.py's docstring advertises PDF support, but this
        # used to unconditionally open() in text mode, which raises
        # UnicodeDecodeError on any real PDF).
        if is_pdf:
            from PyPDF2 import PdfReader
            reader = PdfReader(file_path)
            content = "\n\n".join(
                page.extract_text() or "" for page in reader.pages)
            if not content.strip():
                logger.error(f"No extractable text in PDF: {file_path}")
                return None
        else:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                logger.error(
                    f"File is not valid UTF-8 text and not a .pdf: {file_path}")
                return None

        # Extract title from filename
        title = Path(file_path).stem.replace(
            '_', ' ').replace('-', ' ').title()

        # If it's a markdown file and starts with #, use that as title
        if file_path.endswith('.md') and content.startswith('#'):
            first_line = content.split('\n')[0]
            title = first_line.strip('#').strip()

        # Create data structure
        data = {
            'content': content,
            'title': title,
            'source': file_path,
            'file_path': file_path,
            'metadata': {
                'title': title,
                'source': file_path,
                'type': 'file',
                'file_type': Path(file_path).suffix
            }
        }
        stages.append(_stage("File content extraction", True))

        # Registry-backed RAG / NER pipeline (Evidence chunks for indexing)
        try:
            display.print_stage("🧬 RAG PROMPT PIPELINE", "🧬")
            display.start_spinner(
                "Running classification → chunk → NER → validation...")
            rag_pipeline = ContentAnalysisEngine().process_for_rag(
                content,
                provenance=file_path,
                filename_hint=title,
            )
            data['rag_pipeline'] = rag_pipeline
            data['embeddable_texts'] = rag_pipeline.get(
                'embeddable_texts') or []
            data['metadata']['rag_pipeline'] = {
                'status': rag_pipeline.get('status'),
                'chunk_count': (rag_pipeline.get('metadata') or {}).get('chunk_count'),
                'embeddable_count': (rag_pipeline.get('metadata') or {}).get('embeddable_count'),
                'ingestion_recommendation': (rag_pipeline.get('metadata') or {}).get(
                    'ingestion_recommendation'
                ),
            }
            rag_out = Path(file_path).with_name(
                f"{Path(file_path).stem}_rag_pipeline.json"
            )
            with open(rag_out, 'w', encoding='utf-8') as f:
                json.dump(rag_pipeline, f, indent=2, ensure_ascii=False)

            # status is ok | hold | rejected | error (RagPipelineResult) -
            # only "ok" is a real success; don't print ✅ for the rest.
            rag_status = rag_pipeline.get('status')
            if rag_status == 'ok':
                display.stop_spinner(
                    f"✅ RAG pipeline ok, embeddable={len(data['embeddable_texts'])}")
                stages.append(_stage(
                    "RAG prompt pipeline", True,
                    f"embeddable={len(data['embeddable_texts'])}"))
            elif rag_status in ('hold', 'rejected'):
                display.stop_spinner(f"⚠️ RAG pipeline status={rag_status}")
                stages.append(_skipped("RAG prompt pipeline", f"status={rag_status}"))
            else:
                errors = "; ".join(rag_pipeline.get('errors') or []) or "unknown error"
                display.stop_spinner(f"❌ RAG pipeline failed: {errors}")
                stages.append(_stage("RAG prompt pipeline", False, errors))
        except Exception as e:
            logger.warning(f"RAG prompt pipeline skipped: {e}")
            stages.append(_stage("RAG prompt pipeline", False, str(e)))

        # Upload if requested
        if upload:
            upload_result = upload_file_to_openai(file_path)
            data['upload_results'] = upload_result
            upload_status = isinstance(upload_result, dict) and upload_result.get('status')
            if upload_status in ('uploaded_and_indexed', 'uploaded_only'):
                stages.append(_stage("OpenAI vector store upload", True, upload_status))
            elif upload_status:
                stages.append(_stage(
                    "OpenAI vector store upload", False,
                    upload_result.get('error', upload_status)))
            else:
                stages.append(_unknown("OpenAI vector store upload", "unrecognized upload result shape"))

            # The queue reopens its file arguments as UTF-8 text, so a raw
            # PDF path would crash it - hand it the extracted text instead.
            queue_content_path = file_path
            temp_extracted_path: Optional[str] = None
            if is_pdf:
                import tempfile
                with tempfile.NamedTemporaryFile(
                        mode='w', encoding='utf-8', suffix='.txt',
                        prefix=Path(file_path).stem + '_extracted_',
                        delete=False) as tf:
                    tf.write(content)
                    temp_extracted_path = tf.name
                queue_content_path = temp_extracted_path

            # Add to queue. Previously this call's return value was
            # discarded (unlike the YouTube/web paths, which do capture
            # queue_result) and the call wasn't guarded, so a QStash error
            # here would abort the whole file - now it's non-fatal and
            # tracked like every other stage (T-045 H7).
            try:
                queue_result = add_processed_content_to_queue(
                    data['metadata'], queue_content_path, queue_content_path)
                data['queue_result'] = queue_result
                stages.append(_summarize_queue_result(queue_result))
            except Exception as e:
                data['queue_result'] = {"success": False, "error": str(e)}
                stages.append(_stage("QStash queue enqueue", False, str(e)))
                logger.error(f"Queue processing error: {e}")
            finally:
                if temp_extracted_path:
                    try:
                        os.unlink(temp_extracted_path)
                    except OSError as e:
                        logger.warning(f"Failed to remove temp file {temp_extracted_path}: {e}")

        # Add to knowledge base
        if add_to_kb:
            doc_type = 'research' if is_pdf else 'case_file'
            doc_id = add_to_knowledge_base(data, doc_type)
            data['doc_id'] = doc_id
            stages.append(_stage("Knowledge base storage", bool(doc_id)))

            # Add file content to mem0 memory
            try:
                from lib.mem0_integration import add_file_content_memory
                stages.append(_call_mem0(
                    "Mem0 file content memory", add_file_content_memory,
                    title=title,
                    file_path=file_path,
                    content=content,
                    file_type=Path(file_path).suffix,
                    tags=[doc_type]
                ))
            except ImportError as e:
                stages.append(_skipped("Mem0 file content memory", f"module unavailable: {e}"))

            # Entity Extraction (similar to YouTube workflow)
            if doc_id:
                try:
                    display.print_stage("🧠 ENTITY PROCESSING", "🧠")

                    # Create summary file in the files directory (mirrors YouTube workflow).
                    # Read through kb_service's own KnowledgeBaseCRUD instance -
                    # a second, separately-constructed instance here loaded its
                    # in-memory index before this document was written and
                    # would never see it (doc_info always None for new docs).
                    doc_info = kb_service.kb_crud.get_document(doc_id)
                    if doc_info:
                        doc_dir = Path(doc_info.metadata.get(
                            'file_path', '')).parent
                        summary_file_path = doc_dir / \
                            f"{Path(file_path).stem}_summary.txt"

                        # Write content summary to file (for entity processing)
                        with open(summary_file_path, 'w', encoding='utf-8') as f:
                            f.write(content)

                        try:
                            from lib.entity_extraction.processors.interactive_entity_processor import process_summary_file_interactive
                            display.start_spinner(
                                "🔍 Extracting entities and searching Xata database...")
                            logger.info(
                                "Starting entity processing for file...")

                            # Use non-interactive mode for automated workflow
                            entity_results = process_summary_file_interactive(
                                str(summary_file_path), doc_id, interactive=False)

                            # Add entity processing results to metadata
                            data['metadata']['entity_processing'] = entity_results

                            # status is completed | no_entities | error - only
                            # "completed" is a real success; don't print ✅
                            # for a call that returned zero entities because
                            # the underlying extraction call actually failed
                            # (e.g. an invalid OpenAI key surfaces here as
                            # status="no_entities", not as an exception).
                            entity_status = entity_results.get('status')
                            total_entities = entity_results.get(
                                'total_entities', 0)
                            total_matches = entity_results.get(
                                'total_matches', 0)
                            if entity_status == 'completed':
                                display.stop_spinner(
                                    f"✅ Extracted {total_entities} entities, found {total_matches} Xata matches")
                                stages.append(_stage(
                                    "Entity extraction", True,
                                    f"{total_entities} entities, {total_matches} Xata matches"))
                            elif entity_status == 'no_entities':
                                display.stop_spinner("⚠️ No entities extracted")
                                stages.append(_skipped("Entity extraction", "no entities extracted"))
                            else:
                                err = entity_results.get('error', 'unknown error')
                                display.stop_spinner(f"❌ Entity extraction failed: {err}")
                                stages.append(_stage("Entity extraction", False, err))
                            logger.info(
                                f"Entity processing complete: {entity_status}")

                            # Add entity extraction to mem0 memory
                            try:
                                from lib.mem0_integration import add_entity_extraction_memory
                                stages.append(_call_mem0(
                                    "Mem0 entity extraction memory", add_entity_extraction_memory,
                                    doc_id=doc_id,
                                    entities=entity_results.get(
                                        'entities', []),
                                    total_matches=total_matches,
                                    processing_results=entity_results
                                ))
                            except ImportError as e:
                                stages.append(_skipped("Mem0 entity extraction memory", f"module unavailable: {e}"))

                        except Exception as e:
                            display.stop_spinner("❌ Entity processing failed")
                            logger.error(f"Entity processing failed: {e}")
                            stages.append(_stage("Entity extraction", False, str(e)))
                            # Don't fail the entire process if entity extraction fails
                    else:
                        logger.warning(
                            f"Could not find document info for entity processing: {doc_id}")
                        stages.append(_stage(
                            "Entity extraction", False,
                            "document info not found (index may not have picked up the new doc yet)"))

                except Exception as e:
                    logger.error(f"Error setting up entity processing: {e}")
                    stages.append(_stage("Entity extraction", False, str(e)))

            # Trigger CocoIndex knowledge graph processing after entity extraction
            if doc_id:
                try:
                    display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
                    display.start_spinner(
                        "📊 Building knowledge graph with CocoIndex...")

                    cocoindex_result = trigger_cocoindex_processing(doc_id)
                    if cocoindex_result and cocoindex_result.get('status') == 'success':
                        entities_count = cocoindex_result.get(
                            'entities_processed', 0)
                        relationships_count = cocoindex_result.get(
                            'relationships_processed', 0)
                        display.stop_spinner(
                            f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                        data['cocoindex_processing'] = cocoindex_result
                        stages.append(_stage(
                            "Knowledge graph construction", True,
                            f"{entities_count} entities, {relationships_count} relationships"))

                        # Add knowledge graph to mem0 memory
                        try:
                            from lib.mem0_integration import add_knowledge_graph_memory
                            stages.append(_call_mem0(
                                "Mem0 knowledge graph memory", add_knowledge_graph_memory,
                                doc_id=doc_id,
                                entities_processed=entities_count,
                                relationships_processed=relationships_count,
                                kg_results=cocoindex_result
                            ))
                        except ImportError as e:
                            stages.append(_skipped("Mem0 knowledge graph memory", f"module unavailable: {e}"))
                    elif cocoindex_result and cocoindex_result.get('status') == 'skipped':
                        display.stop_spinner(
                            f"⚠️ Knowledge graph processing skipped: {cocoindex_result.get('reason', 'unknown')}")
                        data['cocoindex_processing'] = cocoindex_result
                        stages.append(_skipped(
                            "Knowledge graph construction", cocoindex_result.get('reason', 'unknown')))
                    else:
                        display.stop_spinner("❌ Knowledge graph processing failed")
                        if cocoindex_result:
                            data['cocoindex_processing'] = cocoindex_result
                        stages.append(_stage(
                            "Knowledge graph construction", False,
                            (cocoindex_result or {}).get('error', 'unknown error')))

                except Exception as e:
                    display.stop_spinner("❌ Knowledge graph processing failed")
                    logger.error(f"CocoIndex processing failed: {e}")
                    stages.append(_stage("Knowledge graph construction", False, str(e)))
                    # Don't fail the entire process if CocoIndex processing fails

            # Move successfully processed files from processing_queue to files.
            # Containment is checked on the resolved path, so the move must
            # also operate on the resolved path - moving the raw argument
            # would relocate a symlink instead of the queued file.
            processing_queue_dir = (
                Path(__file__).parent / "data" / "processing_queue").resolve()
            resolved_source = Path(file_path).resolve()
            if doc_id and resolved_source.is_relative_to(processing_queue_dir):
                try:
                    import shutil
                    files_dir = str(
                        Path(__file__).parent.parent.parent
                        / "packages" / "knowledge-base" / "sources" / "files"
                    )

                    # Create files directory if it doesn't exist
                    os.makedirs(files_dir, exist_ok=True)

                    destination_path = os.path.join(
                        files_dir, resolved_source.name)

                    shutil.move(str(resolved_source), destination_path)
                    logger.info(
                        f"Moved processed file from processing_queue to files: {resolved_source.name}")

                    # Update the data source to reflect new location
                    data['source'] = destination_path
                    data['metadata']['source'] = destination_path
                    stages.append(_stage("File relocation", True, destination_path))

                except Exception as e:
                    # Non-fatal, but surfaced in the result so callers can see
                    # the file is still sitting in processing_queue.
                    logger.error(f"Failed to move file to files: {e}")
                    data['metadata']['relocation_failed'] = str(e)
                    stages.append(_stage("File relocation", False, str(e)))

            # Add comprehensive processing summary to memory
            if doc_id:
                try:
                    from lib.mem0_integration import add_processing_summary_memory
                    final_status = "success" if doc_id else "failed"
                    stages.append(_call_mem0(
                        "Mem0 processing summary memory", add_processing_summary_memory,
                        doc_id=doc_id,
                        title=title,
                        content_type="file",
                        processing_steps=[s['name'] for s in stages],
                        final_status=final_status
                    ))
                except ImportError as e:
                    stages.append(_skipped("Mem0 processing summary memory", f"module unavailable: {e}"))

        data['stage_report'] = stages
        return data

    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return None


def _validate_credentials(require_upload: bool) -> List[Dict[str, str]]:
    """Presence/shape checks only - never logs or prints key material.

    OPENAI_API_KEY missing is a hard error: the RAG prompt pipeline and
    entity extraction both call OpenAI, and a run without it silently
    produces hollow records (T-045 H7's root cause). Shape mismatch is a
    heuristic, downgraded to a warning rather than a hard failure - a
    present-but-revoked key (the actual 8-day outage this was written for)
    looks perfectly well-formed and can only be caught by an API call,
    which this function deliberately does not make.
    """
    issues: List[Dict[str, str]] = []

    openai_key = os.environ.get("OPENAI_API_KEY", "")
    if not openai_key.strip():
        issues.append({"level": "error", "message":
                        "OPENAI_API_KEY is not set - RAG pipeline analysis and entity "
                        "extraction will fail"})
    elif not openai_key.startswith("sk-") or len(openai_key) < 20:
        issues.append({"level": "warning", "message":
                        "OPENAI_API_KEY is set but doesn't look like a standard OpenAI "
                        "key (expected sk-... format) - may be a proxy/gateway key, or "
                        "may simply be wrong. Presence/shape checks cannot detect a "
                        "revoked or expired key; only a real API call can."})

    if require_upload and not os.environ.get("QSTASH_TOKEN", "").strip():
        issues.append({"level": "warning", "message":
                        "QSTASH_TOKEN is not set - queue enqueue will be skipped"})

    if not os.environ.get("MEM0_API_KEY", "").strip():
        issues.append({"level": "warning", "message":
                        "MEM0_API_KEY is not set - contextual memory writes will be skipped"})

    return issues


def _print_credential_issues(issues: List[Dict[str, str]]) -> None:
    if not issues:
        return
    print("\n🔐 \033[1mCredential check:\033[0m")
    for issue in issues:
        icon = "❌" if issue["level"] == "error" else "⚠️"
        print(f"   {icon} {issue['message']}")


def _build_dry_run_plan(input_path: str, upload: bool, add_to_kb: bool) -> List[str]:
    """Derive the plan from actually inspecting the input, not a static
    list - so dry-run output reflects what THIS input would really do
    (existence, PDF-vs-text, processing_queue containment, youtube-vs-web
    routed through the real is_youtube_url()).
    """
    lines: List[str] = []
    queue_url = "https://www.ultraterrestrial.app/api/workflow/processing"

    if input_path.startswith(('http://', 'https://')):
        youtube = is_youtube_url(input_path)
        lines.append(f"Input: {input_path} (detected as {'YouTube' if youtube else 'web'} URL)")
        lines.append(
            f"Would run: {'YouTube transcript extraction' if youtube else 'Web content extraction'}")
        if add_to_kb:
            lines.append("Would write: knowledge base entry + summary/metadata files "
                          "under packages/knowledge-base/")
            lines.append("Would run: entity extraction (OpenAI) + Xata matching")
            if youtube:
                lines.append("Would run: CocoIndex knowledge graph construction")
            else:
                lines.append("CocoIndex knowledge graph: runs internally as part of web "
                              "content extraction above, not a separate step")
            lines.append("Would write: mem0 contextual memory entries (if MEM0_API_KEY set)")
        else:
            lines.append("Knowledge base write, entity extraction, knowledge graph: "
                          "SKIPPED (--no-kb)")
        if upload:
            lines.append("Would call: OpenAI Files API upload + vector store indexing")
            lines.append(f"Would POST to QStash queue: {queue_url}")
        return lines

    path = Path(input_path)
    exists = path.exists()
    is_pdf = input_path.lower().endswith('.pdf')
    lines.append(f"Input: {input_path} (file, exists={exists}, "
                 f"type={'PDF' if is_pdf else 'text'})")
    if not exists:
        lines.append("File does not exist - a real run would fail immediately")
        return lines

    rag_out = path.with_name(f"{path.stem}_rag_pipeline.json")
    lines.append(f"Would write: {rag_out} (RAG prompt pipeline output)")

    if upload:
        lines.append("Would call: OpenAI Files API upload + vector store indexing")
        if is_pdf:
            lines.append("Would create, use, and delete a temp extracted-text file for "
                          "the queue call")
        lines.append(f"Would POST to QStash queue: {queue_url}")

    if add_to_kb:
        lines.append("Would write: knowledge base entry under packages/knowledge-base/")
        lines.append(f"Would write: {path.with_name(f'{path.stem}_summary.txt')} "
                      "(entity extraction summary)")
        lines.append("Would run: entity extraction (OpenAI) + Xata matching")
        lines.append("Would run: CocoIndex knowledge graph construction")

        processing_queue_dir = (
            Path(__file__).parent / "data" / "processing_queue").resolve()
        try:
            in_queue = path.resolve().is_relative_to(processing_queue_dir)
        except OSError:
            in_queue = False
        if in_queue:
            dest = (Path(__file__).parent.parent.parent / "packages" / "knowledge-base"
                     / "sources" / "files" / path.resolve().name)
            lines.append(f"Would move file to: {dest}")

        lines.append("Would write: mem0 contextual memory entries (if MEM0_API_KEY set)")
    else:
        lines.append("Knowledge base write, entity extraction, knowledge graph, "
                      "relocation: SKIPPED (--no-kb)")

    return lines


def main():
    """Main function with enhanced integration"""
    parser = argparse.ArgumentParser(
        description="Enhanced Disclosure RAG Content Processor")
    parser.add_argument("input", nargs="?", help="URL or file path to process")
    parser.add_argument("--upload", action="store_true",
                        help="Upload to OpenAI vector store")
    parser.add_argument("--no-kb", action="store_true",
                        help="Skip adding to knowledge base")
    parser.add_argument("--status", action="store_true",
                        help="Show integration status")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print the processing plan without writing files, "
                             "uploading to OpenAI, or enqueueing to QStash")

    # argparse exits here for --help / bad args, before any heavy import runs.
    args = parser.parse_args()

    _import_heavy_dependencies()

    # Show cool header
    display.print_header()

    if args.status:
        status = kb_service.get_integration_status()
        print(f"\n🔧 Integration Status:")
        print(f"   Local KB: {'✅' if status['local_kb'] else '❌'}")
        print(f"   Search Sync: {'✅' if status['search_sync'] else '❌'}")
        print(f"   Search URL: {'✅' if status['search_url'] else '❌'}")
        print(f"   Search Token: {'✅' if status['search_token'] else '❌'}")
        print(f"   CocoIndex KG: {'✅' if COCOINDEX_KG_AVAILABLE else '❌'}")

        # Check Mem0 integration status
        try:
            from lib.mem0_integration import _is_enabled, _get_api_key
            mem0_enabled = _is_enabled()
            mem0_key = bool(_get_api_key())
            print(f"   Mem0 Integration: {'✅' if mem0_enabled else '❌'}")
            print(f"   Mem0 API Key: {'✅' if mem0_key else '❌'}")
        except Exception:
            print(f"   Mem0 Integration: ❌ (Module not available)")

        if COCOINDEX_KG_AVAILABLE:
            try:
                # Get CocoIndex processor status
                kg_status = cocoindex_processor.get_processing_status()
                if kg_status.get('status') == 'success' and 'statistics' in kg_status:
                    stats = kg_status['statistics']
                    print(
                        f"   KG Documents: {stats.get('total_documents', 0)}")
                    print(f"   KG Entities: {stats.get('total_entities', 0)}")
                    print(
                        f"   KG Relationships: {stats.get('total_relationships', 0)}")
            except Exception as e:
                logger.debug(f"Could not get CocoIndex status: {e}")

        if not status['search_sync']:
            print(f"\n💡 To enable Search sync, set environment variables:")
            print(f"   export UPSTASH_SEARCH_URL=your_url")
            print(f"   export UPSTASH_SEARCH_TOKEN=your_token")

        if not COCOINDEX_KG_AVAILABLE:
            print(f"\n💡 To enable CocoIndex knowledge graph:")
            print(f"   pip install cocoindex")
            print(f"   Configure PostgreSQL and Neo4j connections")

        try:
            from lib.mem0_integration import _is_enabled
            if not _is_enabled():
                print(f"\n💡 To enable Mem0 integration, set environment variables:")
                print(f"   export MEM0_API_KEY=your_key")
                print(f"   export MEM0_USER_ID=your_user_id (optional)")
        except Exception:
            print(f"\n💡 Mem0 integration not available")

        return

    # Check if input is required but not provided
    if not args.input:
        print(f"\n❌ Error: Input URL or file path is required when not using --status")
        parser.print_help()
        sys.exit(1)

    # Process input
    input_path = args.input.strip()
    add_to_kb = not args.no_kb

    cred_issues = _validate_credentials(require_upload=args.upload)

    if args.dry_run:
        print("\n🧪 \033[1mDRY RUN\033[0m - no files will be written, nothing will be "
              "uploaded, nothing will be queued.\n")
        for line in _build_dry_run_plan(input_path, args.upload, add_to_kb):
            print(f"   • {line}")
        _print_credential_issues(cred_issues)
        return

    hard_errors = [i for i in cred_issues if i["level"] == "error"]
    if hard_errors:
        print("\n❌ \033[1mCannot proceed - missing required credentials:\033[0m")
        _print_credential_issues(cred_issues)
        sys.exit(1)
    _print_credential_issues(cred_issues)

    # Show URL/file detection
    if input_path.startswith(('http://', 'https://')):
        url_type = "youtube" if is_youtube_url(input_path) else "web"
        display.print_url_detected(input_path, url_type)
        result = process_url(input_path, args.upload, add_to_kb)
    else:
        display.print_url_detected(input_path, "file")
        result = process_file(input_path, args.upload, add_to_kb)

    if result:
        print(f"\n✅ Processing complete!")
        print(f"   Title: {result.get('title', 'Unknown')}")
        print(f"   Source: {result.get('source', 'Unknown')}")

        if result.get('doc_id'):
            print(f"   Document ID: {result['doc_id']}")

        # Every stage below reports what actually happened - success,
        # skipped, or failed - rather than presence-checking a key and
        # printing ✅ regardless of outcome (T-045 H7).
        _print_stage_report(result.get('stage_report', []))
    else:
        print(f"\n❌ Processing failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()
