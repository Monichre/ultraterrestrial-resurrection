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
import argparse
import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
import requests
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

# Import knowledge base service

# Import existing modules (fallback if enhanced fails)
# Import enhanced CocoIndex for enhanced vector search
try:
    from lib.cocoindex import create_live_cocoindex, BackendFactory
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

# Initialize processors
web_processor = WebContentProcessor()


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube video"""
    return any(domain in url.lower() for domain in ['youtube.com', 'youtu.be'])


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


def process_url(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a URL (web page or YouTube video) with enhanced mem0 integration"""
    logger.info(f"Processing URL: {url}")
    processing_steps = []

    if is_youtube_url(url):
        # Use enhanced YouTube processing
        processing_steps.append("YouTube transcript extraction")
        result = process_youtube_url_enhanced(url, upload, add_to_kb)
        content_type = "youtube_video"
    else:
        # Use enhanced web processing
        processing_steps.append("Web content extraction")
        result = process_web_url_enhanced(url, upload, add_to_kb)
        content_type = "web_article"

    # Add mem0 integration for web articles (YouTube already has it in generate_transcript)
    if result and not is_youtube_url(url):
        try:
            from lib.mem0_integration import add_web_article_memory
            processing_steps.append("Mem0 web article memory")
            add_web_article_memory(
                title=result.get('title', 'Unknown'),
                url=url,
                content=result.get('content', ''),
                summary=result.get('analysis', ''),
                tags=result.get('tags', [])
            )
        except Exception as e:
            logger.warning(f"Mem0 web article memory skipped: {e}")

    # Add CocoIndex knowledge graph processing if result has doc_id.
    # process_web_with_enhanced_workflow() already runs CocoIndex internally
    # (knowledge_base_service.py:~735-785); triggering it again here for web
    # results ran a second, global `cocoindex update` on every web ingestion.
    # The YouTube workflow has no internal CocoIndex step, so it still needs
    # this pass.
    if result and result.get('doc_id') and add_to_kb and is_youtube_url(url):
        try:
            from lib.terminal_display import display
            display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
            display.start_spinner(
                "📊 Building knowledge graph with CocoIndex...")
            processing_steps.append("Knowledge graph construction")

            cocoindex_result = trigger_cocoindex_processing(result['doc_id'])
            if cocoindex_result and cocoindex_result.get('status') == 'success':
                entities_count = cocoindex_result.get('entities_processed', 0)
                relationships_count = cocoindex_result.get(
                    'relationships_processed', 0)
                display.stop_spinner(
                    f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                result['cocoindex_processing'] = cocoindex_result

                # Add knowledge graph memory
                try:
                    from lib.mem0_integration import add_knowledge_graph_memory
                    processing_steps.append("Mem0 knowledge graph memory")
                    add_knowledge_graph_memory(
                        doc_id=result['doc_id'],
                        entities_processed=entities_count,
                        relationships_processed=relationships_count,
                        kg_results=cocoindex_result
                    )
                except Exception as e:
                    logger.warning(f"Mem0 knowledge graph memory skipped: {e}")
            else:
                display.stop_spinner(
                    "⚠️ Knowledge graph processing skipped or failed")
                if cocoindex_result:
                    result['cocoindex_processing'] = cocoindex_result

        except Exception as e:
            display.stop_spinner("❌ Knowledge graph processing failed")
            logger.error(f"CocoIndex processing failed: {e}")
            # Don't fail the entire process if CocoIndex processing fails

    # Add comprehensive processing summary to memory
    if result and result.get('doc_id'):
        try:
            from lib.mem0_integration import add_processing_summary_memory
            final_status = "success" if result.get('doc_id') else "failed"
            add_processing_summary_memory(
                doc_id=result['doc_id'],
                title=result.get('title', 'Unknown'),
                content_type=content_type,
                processing_steps=processing_steps,
                final_status=final_status
            )
        except Exception as e:
            logger.warning(f"Mem0 processing summary skipped: {e}")

    return result


def process_file(file_path: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a local file with enhanced mem0 integration"""
    logger.info(f"Processing file: {file_path}")
    processing_steps = ["File content extraction"]

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
            display.stop_spinner(
                f"✅ RAG pipeline status={rag_pipeline.get('status')} "
                f"embeddable={len(data['embeddable_texts'])}"
            )
            processing_steps.append("RAG prompt pipeline")
        except Exception as e:
            logger.warning(f"RAG prompt pipeline skipped: {e}")

        # Upload if requested
        if upload:
            upload_result = upload_file_to_openai(file_path)
            data['upload_results'] = upload_result
            processing_steps.append("OpenAI vector store upload")

            # The queue reopens its file arguments as UTF-8 text, so a raw
            # PDF path would crash it - hand it the extracted text instead.
            queue_content_path = file_path
            if is_pdf:
                import tempfile
                with tempfile.NamedTemporaryFile(
                        mode='w', encoding='utf-8', suffix='.txt',
                        prefix=Path(file_path).stem + '_extracted_',
                        delete=False) as tf:
                    tf.write(content)
                    queue_content_path = tf.name

            # Add to queue
            add_processed_content_to_queue(
                data['metadata'], queue_content_path, queue_content_path)

        # Add to knowledge base
        if add_to_kb:
            doc_type = 'research' if is_pdf else 'case_file'
            doc_id = add_to_knowledge_base(data, doc_type)
            data['doc_id'] = doc_id
            processing_steps.append("Knowledge base storage")

            # Add file content to mem0 memory
            try:
                from lib.mem0_integration import add_file_content_memory
                processing_steps.append("Mem0 file content memory")
                add_file_content_memory(
                    title=title,
                    file_path=file_path,
                    content=content,
                    file_type=Path(file_path).suffix,
                    tags=[doc_type]
                )
            except Exception as e:
                logger.warning(f"Mem0 file content memory skipped: {e}")

            # Entity Extraction (similar to YouTube workflow)
            if doc_id:
                try:
                    from lib.terminal_display import display
                    display.print_stage("🧠 ENTITY PROCESSING", "🧠")
                    processing_steps.append("Entity extraction")

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

                            total_entities = entity_results.get(
                                'total_entities', 0)
                            total_matches = entity_results.get(
                                'total_matches', 0)
                            display.stop_spinner(
                                f"✅ Extracted {total_entities} entities, found {total_matches} Xata matches")
                            logger.info(
                                f"Entity processing complete: {entity_results.get('status', 'unknown')}")
                            logger.info(
                                f"Extracted {total_entities} entities, found {total_matches} Xata matches")

                            # Add entity extraction to mem0 memory
                            try:
                                from lib.mem0_integration import add_entity_extraction_memory
                                processing_steps.append(
                                    "Mem0 entity extraction memory")
                                add_entity_extraction_memory(
                                    doc_id=doc_id,
                                    entities=entity_results.get(
                                        'entities', []),
                                    total_matches=total_matches,
                                    processing_results=entity_results
                                )
                            except Exception as e:
                                logger.warning(
                                    f"Mem0 entity extraction memory skipped: {e}")

                        except Exception as e:
                            display.stop_spinner("❌ Entity processing failed")
                            logger.error(f"Entity processing failed: {e}")
                            # Don't fail the entire process if entity extraction fails
                    else:
                        logger.warning(
                            f"Could not find document info for entity processing: {doc_id}")

                except Exception as e:
                    logger.error(f"Error setting up entity processing: {e}")

            # Trigger CocoIndex knowledge graph processing after entity extraction
            if doc_id:
                try:
                    from lib.terminal_display import display
                    display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
                    display.start_spinner(
                        "📊 Building knowledge graph with CocoIndex...")
                    processing_steps.append("Knowledge graph construction")

                    cocoindex_result = trigger_cocoindex_processing(doc_id)
                    if cocoindex_result and cocoindex_result.get('status') == 'success':
                        entities_count = cocoindex_result.get(
                            'entities_processed', 0)
                        relationships_count = cocoindex_result.get(
                            'relationships_processed', 0)
                        display.stop_spinner(
                            f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                        data['cocoindex_processing'] = cocoindex_result

                        # Add knowledge graph to mem0 memory
                        try:
                            from lib.mem0_integration import add_knowledge_graph_memory
                            processing_steps.append(
                                "Mem0 knowledge graph memory")
                            add_knowledge_graph_memory(
                                doc_id=doc_id,
                                entities_processed=entities_count,
                                relationships_processed=relationships_count,
                                kg_results=cocoindex_result
                            )
                        except Exception as e:
                            logger.warning(
                                f"Mem0 knowledge graph memory skipped: {e}")
                    else:
                        display.stop_spinner(
                            "⚠️ Knowledge graph processing skipped or failed")
                        if cocoindex_result:
                            data['cocoindex_processing'] = cocoindex_result

                except Exception as e:
                    display.stop_spinner("❌ Knowledge graph processing failed")
                    logger.error(f"CocoIndex processing failed: {e}")
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
                    processing_steps.append("File relocation")

                except Exception as e:
                    # Non-fatal, but surfaced in the result so callers can see
                    # the file is still sitting in processing_queue.
                    logger.error(f"Failed to move file to files: {e}")
                    data['metadata']['relocation_failed'] = str(e)
                    processing_steps.append("File relocation FAILED")

            # Add comprehensive processing summary to memory
            if doc_id:
                try:
                    from lib.mem0_integration import add_processing_summary_memory
                    final_status = "success" if doc_id else "failed"
                    add_processing_summary_memory(
                        doc_id=doc_id,
                        title=title,
                        content_type="file",
                        processing_steps=processing_steps,
                        final_status=final_status
                    )
                except Exception as e:
                    logger.warning(f"Mem0 processing summary skipped: {e}")

        return data

    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return None


def main():
    """Main function with enhanced integration"""
    # Import display for cool terminal output
    from lib.terminal_display import display

    parser = argparse.ArgumentParser(
        description="Enhanced Disclosure RAG Content Processor")
    parser.add_argument("input", nargs="?", help="URL or file path to process")
    parser.add_argument("--upload", action="store_true",
                        help="Upload to OpenAI vector store")
    parser.add_argument("--no-kb", action="store_true",
                        help="Skip adding to knowledge base")
    parser.add_argument("--status", action="store_true",
                        help="Show integration status")

    args = parser.parse_args()

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

        if 'doc_id' in result:
            print(f"   Document ID: {result['doc_id']}")

        if args.upload and 'upload_results' in result:
            print(f"   OpenAI Upload: ✅")

        if 'queue_result' in result:
            print(f"   QStash Queue: ✅")

        # Show CocoIndex knowledge graph results
        if 'cocoindex_processing' in result:
            kg_result = result['cocoindex_processing']
            if kg_result.get('status') == 'success':
                entities = kg_result.get('entities_processed', 0)
                relationships = kg_result.get('relationships_processed', 0)
                print(
                    f"   Knowledge Graph: ✅ ({entities} entities, {relationships} relationships)")
            elif kg_result.get('status') == 'skipped':
                print(
                    f"   Knowledge Graph: ⚠️ Skipped ({kg_result.get('reason', 'unknown')})")
            else:
                print(f"   Knowledge Graph: ❌ Failed")

        # Show Mem0 integration status
        try:
            from lib.mem0_integration import _is_enabled
            if _is_enabled():
                print(f"   Mem0 Memory: ✅ Contextual memories added")
            else:
                print(f"   Mem0 Memory: ⚠️ Disabled or no API key")
        except Exception:
            print(f"   Mem0 Memory: ❌ Integration not available")
    else:
        print(f"\n❌ Processing failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()
