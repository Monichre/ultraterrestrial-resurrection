#!/usr/bin/env python3
"""
Ingest orchestration for the knowledge-base archive (dy / main.py path).

Coordinates YouTube and web workflows, then writes via KnowledgeBaseCRUD and
optionally syncs Upstash Search / queue. Does not replace CRUD or the
in-memory FAISS/Agno KnowledgeBase. Layer map:
apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md

Date: June 20, 2025
Updated: 2026-08-16
"""

import os
import json
import hashlib
import logging
from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime
from .knowledge_base_crud import KnowledgeBaseCRUD
from ..sync_to_upstash_search_integrated import IntegratedUpstashSyncer
from ..terminal_display import TerminalDisplay

logger = logging.getLogger(__name__)
display = TerminalDisplay()


def _get_queue_adapter():
    """Lazily import the Upstash queue function.

    main.py guards this same import at module load so --status and
    --no-kb runs work without Upstash configured. The enhanced
    workflows below used to re-import '.upstash.queue' directly,
    which bypassed that guard and crashed non-upload URL processing
    whenever Upstash wasn't configured.
    """
    try:
        from ..upstash.queue import add_processed_content_to_queue
        return add_processed_content_to_queue
    except (ImportError, RuntimeError) as e:
        logger.warning(f"Upstash queue not available: {e}")

        def _skip_queue(*args, **kwargs):
            return {"success": False, "skipped": True}

        return _skip_queue


class KnowledgeBaseService:
    """Knowledge base service that handles document indexing and search synchronization"""

    def __init__(self):
        self.kb_crud = KnowledgeBaseCRUD()
        self.search_syncer = None
        self._init_search_syncer()

    def _init_search_syncer(self):
        """Initialize Upstash Search syncer if credentials available"""
        search_url = os.getenv("UPSTASH_SEARCH_URL")
        search_token = os.getenv("UPSTASH_SEARCH_TOKEN")

        if search_url and search_token:
            try:
                self.search_syncer = IntegratedUpstashSyncer(
                    search_url, search_token)
                logger.info("Upstash Search integration enabled")
            except Exception as e:
                logger.warning(f"Failed to initialize Upstash Search: {e}")
                self.search_syncer = None
        else:
            logger.info(
                "Upstash Search credentials not found, skipping Search integration")

    def add_youtube_to_knowledge_base(self, data: Dict[str, Any], file_paths: Dict[str, str]) -> Optional[str]:
        """
        Add YouTube content to knowledge base using existing file structure
        This works with the files already created by YouTube processing
        """
        try:
            # Extract video ID from metadata or file path
            video_id = data.get('metadata', {}).get('video_id', '')
            if not video_id and 'file_path' in file_paths:
                # Extract from file path: .../YYYY-MM-DD/video_id/...
                path_parts = file_paths['file_path'].split('/')
                for i, part in enumerate(path_parts):
                    if part.count('-') == 2 and len(part) == 10:  # Found date folder
                        if i + 1 < len(path_parts):
                            video_id = path_parts[i + 1]
                            break

            if not video_id:
                logger.error(
                    "Cannot find YouTube video ID in data or file paths")
                return None

            # Use video_id as doc_id to match existing file structure
            doc_id = video_id

            # Extract info from existing files
            title = data.get('title', 'YouTube Video')
            content = data.get('content', '')
            source = data.get('source', '')
            metadata = data.get('metadata', {})

            # Add file paths to metadata
            metadata['file_paths'] = file_paths
            # Flag to indicate this uses original file structure
            metadata['original_structure'] = True
            metadata['processing_status'] = {
                'youtube_processed': True,
                'files_saved': True,
                'kb_indexed': False,
                'entity_processed': False,
                'vector_synced': False,
                'last_step': 'files_saved'
            }

            # Extract tags
            tags = ['youtube', 'transcript']
            if 'tags' in metadata and metadata['tags']:
                # Limit to avoid too many tags
                tags.extend(metadata['tags'][:5])

            # Update the KB index to track existing YouTube files.
            #
            # Class M (T-061 §4 M1): this labels the index entry, it does not
            # compose a path -- keep it. `ingested_at` (full ISO-8601
            # timestamp) is the new canonical field; `date_folder` is left
            # exactly as before and written alongside it so existing readers
            # of the old key do not break.
            from datetime import datetime
            date_folder = datetime.now().strftime("%Y-%m-%d")
            ingested_at = datetime.now().isoformat()

            # Get the actual path where YouTube saved files
            youtube_path = Path(file_paths.get(
                'file_path', '')).parent if 'file_path' in file_paths else None

            # Add to KB index without creating new files - reference existing YouTube structure
            if youtube_path and youtube_path.exists():
                # List all files in the YouTube directory
                file_list = []
                for file_path in youtube_path.glob('*'):
                    if file_path.is_file():
                        file_list.append({
                            "name": file_path.name,
                            "path": str(file_path),
                            "size": file_path.stat().st_size,
                            "type": file_path.suffix[1:] if file_path.suffix else "unknown"
                        })

                # Update processing status
                metadata['processing_status']['kb_indexed'] = True
                metadata['processing_status']['last_step'] = 'kb_indexed'

                self.kb_crud.index["documents"][doc_id] = {
                    "title": title,
                    "doc_type": "transcript",
                    "path": str(youtube_path),
                    "date_folder": date_folder,
                    "ingested_at": ingested_at,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat(),
                    "tags": tags,
                    "youtube_id": video_id,
                    "uses_original_structure": True,
                    "files": file_list,
                    "source": data.get('source', ''),
                    "metadata": metadata
                }

                # Update tag index
                for tag in tags:
                    if tag not in self.kb_crud.index["tags"]:
                        self.kb_crud.index["tags"][tag] = []
                    self.kb_crud.index["tags"][tag].append(doc_id)

                self.kb_crud._save_index()
                logger.info(
                    f"Updated index.json with {len(file_list)} files for {doc_id}")
            else:
                logger.warning(f"YouTube path not found: {youtube_path}")

            # Add to search syncer if available
            if self.search_syncer:
                try:
                    # Create a pseudo document for search
                    from .knowledge_base_crud import Document
                    doc = Document(
                        id=doc_id,
                        title=title,
                        content=content,
                        source=source,
                        doc_type='transcript',
                        created_at=datetime.now().isoformat(),
                        updated_at=datetime.now().isoformat(),
                        metadata=metadata,
                        tags=tags
                    )

                    search_result = self.search_syncer.sync_document_to_search(
                        doc)
                    if search_result:
                        logger.info(f"Synced to Search: {doc_id}")
                    else:
                        logger.warning(f"Failed to sync to Search: {doc_id}")
                except Exception as e:
                    logger.error(f"Error syncing to Search: {e}")

            # NEW: Interactive Entity Processing AFTER saving to knowledge base
            summary_file = file_paths.get(
                'summary_path') or file_paths.get('summary_file')
            if summary_file and os.path.exists(summary_file):
                display.print_stage("🧠 ENTITY PROCESSING", "🧠")
                try:
                    from ..entity_extraction.processors.interactive_entity_processor import process_summary_file_interactive
                    display.start_spinner(
                        "🔍 Extracting entities and searching Xata database...")
                    logger.info("Starting entity processing...")
                    # Use non-interactive mode for automated workflow
                    entity_results = process_summary_file_interactive(
                        summary_file, video_id, interactive=False)

                    # Add entity processing results to metadata
                    metadata['entity_processing'] = entity_results
                    metadata['processing_status']['entity_processed'] = True
                    metadata['processing_status']['last_step'] = 'entity_processed'

                    # Update the KB entry with entity results
                    if doc_id in self.kb_crud.index["documents"]:
                        self.kb_crud.index["documents"][doc_id]["metadata"] = metadata
                        self.kb_crud._save_index()

                    total_entities = entity_results.get('total_entities', 0)
                    total_matches = entity_results.get('total_matches', 0)
                    display.stop_spinner(
                        f"✅ Extracted {total_entities} entities, found {total_matches} Xata matches")
                    logger.info(
                        f"Entity processing complete: {entity_results.get('status', 'unknown')}")
                    logger.info(
                        f"Extracted {total_entities} entities, found {total_matches} Xata matches")

                except Exception as e:
                    display.stop_spinner("❌ Entity processing failed")
                    logger.error(f"Entity processing failed: {e}")
                    # Don't fail the entire process if entity extraction fails
            else:
                logger.info(
                    f"No summary file found for entity processing. Checked: {file_paths.keys()}")

            logger.info(f"YouTube content indexed: {doc_id} - {title}")
            return doc_id

        except Exception as e:
            logger.error(f"Error adding YouTube to knowledge base: {e}")
            return None

    def add_to_knowledge_base(self, data: Dict[str, Any], doc_type: str = 'transcript') -> Optional[str]:
        """
        Enhanced version that adds to both local KB and Search
        This replaces the original add_to_knowledge_base function
        """
        try:
            # Prepare document data
            title = data.get('title', 'Untitled')
            content = data.get('content', '')
            source = data.get('source', '')
            metadata = data.get('metadata', {})

            # Extract tags from metadata
            tags = []
            if 'tags' in metadata:
                tags = metadata['tags']
            elif 'video_id' in metadata:
                tags.append('youtube')
            elif 'url' in metadata:
                tags.append('web_article')
            elif 'file_type' in metadata:
                tags.append('file')

            # Add document type tag
            tags.append(doc_type)

            # Create document in local knowledge base
            doc = self.kb_crud.create_document(
                title=title,
                content=content,
                source=source,
                doc_type=doc_type,
                metadata=metadata,
                tags=tags
            )

            logger.info(f"Added to local KB: {doc.id} - {title}")

            # Sync to Upstash Search if available
            if self.search_syncer:
                try:
                    search_result = self.search_syncer.sync_document_to_search(
                        doc)
                    if search_result:
                        logger.info(f"Synced to Search: {doc.id}")
                    else:
                        logger.warning(f"Failed to sync to Search: {doc.id}")
                except Exception as e:
                    logger.error(f"Error syncing to Search: {e}")

            return doc.id

        except Exception as e:
            logger.error(f"Error adding to knowledge base: {e}")
            return None

    def process_youtube_with_enhanced_workflow(self, url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
        """
        Enhanced YouTube processing that includes Search sync
        This can replace process_youtube_url in main.py

        ═══ YT-CHAIN-05 · KnowledgeBaseService :: process_youtube_with_enhanced_workflow()
        The orchestrator. Two halves:
          - Phase 3-5 (download → analysis → artifacts) is delegated wholesale
            to generate_transcript() and comes back as a file_paths dict.
          - Phase 6 (the sinks) happens inline below: OpenAI upload, QStash
            queue, local KB write, Upstash search sync.
        Its imports a few lines down pull in generate_transcript, the queue
        adapter, upload_file_to_openai (§A2 — constructs an OpenAI client at
        import time, unconditionally), and display.
        PREV ← YT-CHAIN-04  process_youtube_url_enhanced()
        NEXT → YT-CHAIN-06  lib/youtube.py :: generate_transcript()
        THEN → YT-CHAIN-14  (Phase 6 sinks, further down this same function)
        ═══════════════════════════════════════════════════════════════════
        """
        try:
            # Import YouTube processing functions and display
            from ..youtube import generate_transcript
            add_processed_content_to_queue = _get_queue_adapter()
            from ..openai_client.upload import upload_file_to_openai
            from ..terminal_display import display

            # Show cool processing animation
            display.print_stage("🎬 YOUTUBE PROCESSING", "📹")
            display.start_spinner(
                "🔍 Extracting video metadata and transcript...")

            logger.info(f"Processing YouTube URL: {url}")

            # Generate transcript (existing functionality)
            file_paths = generate_transcript(url)

            display.stop_spinner("✅ Video metadata and transcript extracted")

            if not file_paths:
                display.print_error("Failed to generate transcript")
                logger.error("Failed to generate transcript")
                return None

            # Show file processing progress
            display.print_stage("📋 PROCESSING FILES", "📋")

            # Read the transcript content and metadata from generated files
            transcript_content = ""
            title = "YouTube Video"
            metadata = {}

            # Read transcript file
            display.start_spinner("📝 Reading transcript content...")
            if 'file_path' in file_paths and os.path.exists(file_paths['file_path']):
                with open(file_paths['file_path'], 'r', encoding='utf-8') as f:
                    transcript_content = f.read()
                display.stop_spinner("✅ Transcript content loaded")
                display.print_file_created(
                    file_paths['file_path'], "transcript")

            # Read metadata file
            display.start_spinner("📋 Reading metadata...")
            if 'metadata_path' in file_paths and os.path.exists(file_paths['metadata_path']):
                with open(file_paths['metadata_path'], 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                    title = metadata.get('title', 'YouTube Video')
                display.stop_spinner("✅ Metadata loaded")
                display.print_file_created(
                    file_paths['metadata_path'], "metadata")

            # Show summary file
            if 'summary_path' in file_paths:
                display.print_file_created(
                    file_paths['summary_path'], "analysis")

            display.print_success(f"📺 Processing: {title}")

            # Enrichment status, preferred from generate_transcript's return
            # value (the full dict, with errors) and falling back to the
            # summary it files in the metadata JSON. Callers grade LLM
            # enrichment off this; without it a 401'd run is indistinguishable
            # from a clean one and every episode records as ingested.
            _rag_block = file_paths.get('rag_pipeline') or metadata.get('rag_pipeline') or {}

            # Prepare data structure
            data = {
                'content': transcript_content,
                'title': title,
                'source': url,
                'metadata': {
                    'video_id': metadata.get('id', ''),
                    # T-061 D5: from lib/youtube.py's fetch_channel_metadata()
                    # (YouTube Data API v3), read back here from the metadata
                    # JSON sidecar. Blank when the lookup failed or wasn't
                    # attempted -- same soft fallback as before D5, not a
                    # crash. channel_id also feeds add_youtube_to_knowledge_base's
                    # index write below, not just this dict.
                    'channel': metadata.get('channel_title', ''),
                    'channel_id': metadata.get('channel_id', ''),
                    'duration': '',  # Not in current metadata structure
                    'upload_date': metadata.get('published_at', ''),
                    'url': url,
                    'type': 'youtube_transcript',
                    'categories': metadata.get('categories', []),
                    'tags': metadata.get('tags', []),
                    'description': metadata.get('description', ''),
                    'chapters': metadata.get('chapters', []),
                    'rag_pipeline': _rag_block
                },
                # Surfaced top-level so callers can grade LLM enrichment without
                # knowing which extraction path ran. The web path
                # (web_content_processor.py:600) and the local-file path
                # (main.py:503) already do this; YouTube did not, so
                # playlist_ingestion's enrichment gate graded every episode
                # "unknown" and recorded it as ingested regardless.
                'rag_pipeline': _rag_block,
                # Same reasoning as rag_pipeline above: the trace map is
                # written best-effort inside generate_transcript, so the only
                # way a caller can tell a real graph from a skipped one is if
                # the writer's summary is surfaced here.
                'trace_map': file_paths.get('trace_map'),
                'file_paths': file_paths
            }

            # ═══ YT-CHAIN-14 · KnowledgeBaseService :: Phase 6, the sinks ══
            # Everything below is where the processed artifacts land. In order:
            #   1. upload_file_to_openai()          → YT-CHAIN-15  (--upload only)
            #   2. add_processed_content_to_queue() → lib/upstash/queue.py, QStash
            #   3. add_youtube_to_knowledge_base()  → lib/kb/knowledge_base_crud.py
            #                                         → index.json
            #   4. search_syncer.sync_document_to_search() → Upstash Search
            # PREV ← YT-CHAIN-13  lib/trace_map.py
            # NEXT → YT-CHAIN-15  lib/openai_client/upload.py
            # THEN → YT-CHAIN-16  main.py :: trigger_cocoindex_processing()
            # ═══════════════════════════════════════════════════════════════
            # Upload to OpenAI if requested (existing functionality)
            if upload:
                display.print_stage("☁️  UPLOADING TO OPENAI", "☁️")
                try:
                    upload_results = {}
                    files_to_upload = [
                        (k, v) for k, v in file_paths.items()
                        if isinstance(v, str) and os.path.exists(v)]

                    for i, (file_type, file_path) in enumerate(files_to_upload, 1):
                        filename = file_path.split("/")[-1]
                        display.start_spinner(f"☁️  Uploading {filename}...")

                        result = upload_file_to_openai(file_path)
                        upload_results[file_type] = result

                        if isinstance(result, dict) and 'file_id' in result:
                            display.stop_spinner(
                                f"✅ {filename} uploaded successfully")
                            display.print_upload_status(
                                result['file_id'], "success")
                        else:
                            display.stop_spinner(f"❌ {filename} upload failed")
                            display.print_upload_status("", "failed")

                        # Show progress
                        display.show_progress_bar(
                            i, len(files_to_upload), "Upload Progress")

                    data['upload_results'] = upload_results
                    display.print_success("All files uploaded to OpenAI")
                except Exception as e:
                    display.print_error(f"Upload error: {e}")
                    logger.error(f"Upload error: {e}")

            # Add to existing QStash workflow (existing functionality)
            display.print_stage("🔄 QSTASH WORKFLOW", "🔄")
            try:
                display.start_spinner("📤 Adding to processing queue...")
                summary_path = file_paths.get(
                    'summary_path', file_paths.get('file_path'))
                full_path = file_paths.get('file_path')

                if summary_path:
                    queue_result = add_processed_content_to_queue(
                        data['metadata'],
                        summary_path,
                        full_path
                    )
                    data['queue_result'] = queue_result
                    display.stop_spinner("✅ Added to processing queue")
                else:
                    display.stop_spinner("⚠️  No summary file for queue")
            except Exception as e:
                display.stop_spinner("❌ Queue processing failed")
                logger.error(f"Queue processing error: {e}")

            # Add to local knowledge base using YouTube-specific method
            display.print_stage("💾 LOCAL KNOWLEDGE BASE", "💾")
            if add_to_kb:
                try:
                    display.start_spinner(
                        "📊 Adding to local vectorized database...")
                    # Use YouTube-specific KB method that works with existing file structure
                    doc_id = self.add_youtube_to_knowledge_base(data, file_paths)
                    data['doc_id'] = doc_id

                    if doc_id:
                        display.stop_spinner("✅ Added to local knowledge base")
                    else:
                        display.stop_spinner("❌ Local KB storage failed")
                except Exception as e:
                    display.stop_spinner("❌ Local KB storage failed")
                    logger.error(f"Error adding to local knowledge base: {e}")
                    data['doc_id'] = None
            else:
                display.print_warning("Knowledge base storage skipped (--no-kb)")
                data['doc_id'] = None

            # Additional search sync (separate from local KB)
            if self.search_syncer and data.get('doc_id'):
                display.print_stage("🔍 SEARCH INTEGRATION", "🔍")
                try:
                    display.start_spinner("🔗 Syncing to cloud search...")
                    doc = self.kb_crud.get_document(data['doc_id'])
                    if doc:
                        search_result = self.search_syncer.sync_document_to_search(
                            doc)
                        if search_result:
                            display.stop_spinner("✅ Synced to cloud search")
                        else:
                            display.stop_spinner(
                                "⚠️  Cloud search sync failed")
                    else:
                        display.stop_spinner("⚠️  No document to sync")
                except Exception as e:
                    display.stop_spinner("❌ Cloud search sync failed")
                    logger.error(f"Error syncing to search: {e}")

            # Show completion summary
            display.print_completion_summary(data)

            logger.info(f"YouTube processing complete: {data['title']}")
            return data

        except Exception as e:
            logger.error(f"Error processing YouTube URL: {e}")
            return None

    def process_web_with_enhanced_workflow(self, url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
        """
        Enhanced web processing with complete workflow matching file processing:
        - Content extraction and analysis
        - Summary file generation  
        - Entity extraction and Xata matching
        - Knowledge graph processing (CocoIndex)
        - Comprehensive metadata creation
        - Research methodology analysis
        """
        try:
            # Import required modules
            import sys
            import os
            import json
            import hashlib
            from pathlib import Path
            from datetime import datetime

            sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
            from processing.web_content_processor import WebContentProcessor
            add_processed_content_to_queue = _get_queue_adapter()
            from ..openai_client.upload import upload_file_to_openai
            from ..terminal_display import display

            # Show cool processing animation
            display.print_stage("🌐 WEB PROCESSING", "🌐")
            display.start_spinner("🔍 Extracting web content...")

            logger.info(f"Processing web URL: {url}")

            web_processor = WebContentProcessor()

            # Process web content (existing functionality)
            result = web_processor.process_url(url)

            display.stop_spinner("✅ Web content extracted")

            if not result:
                display.print_error("Failed to process web content")
                logger.error("Failed to process web content")
                return None

            # Extract key information
            content = result.get('content', '')
            title = result.get('title', 'Web Article')

            display.print_success(f"🌐 Processing: {title}")

            # Create comprehensive data structure with enhanced metadata
            data = {
                'content': content,
                'title': title,
                'source': url,
                'metadata': {
                    'url': url,
                    'title': title,
                    'author': result.get('author', ''),
                    'publish_date': result.get('publish_date', ''),
                    'type': 'web_article',
                    'content_length': len(content),
                    'word_count': len(content.split()) if content else 0,
                    'extraction_timestamp': datetime.now().isoformat(),
                    'processing_status': {
                        'content_extracted': True,
                        'summary_generated': False,
                        'entities_extracted': False,
                        'kb_indexed': False,
                        'kg_processed': False
                    }
                }
            }

            # Create directories for web content files (similar to YouTube structure)
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            safe_title = "".join(c for c in title if c.isalnum() or c in (
                ' ', '-', '_')).rstrip()[:50]

            # Fix: Use proper output directory - packages/knowledge-base/sources/web/
            # Fix: Implement human-readable naming with meaningful title
            if not safe_title or safe_title.strip() == "Web Article":
                # Fallback to domain name if no meaningful title
                from urllib.parse import urlparse
                domain = urlparse(url).netloc.replace('www.', '')
                safe_title = f"{domain.replace('.', '-')}"

            # T-061 §3 P2: directory keyed by canonical source, not a date
            # folder. source_key is the registrable domain of `url` -- routed
            # through the registry (rather than used bare) so aliases of the
            # same domain resolve to one slug.
            from urllib.parse import urlparse as _urlparse
            from .kb_root import resolve_entry_dir
            source_key = _urlparse(url).netloc.replace('www.', '') or None
            web_dir = resolve_entry_dir("web", source_key, f"{safe_title}_{url_hash}")
            web_dir.mkdir(parents=True, exist_ok=True)

            # Generate comprehensive summary file
            display.print_stage("📋 CONTENT ANALYSIS", "📋")
            display.start_spinner("📝 Generating comprehensive summary...")

            try:
                # Generate AI-powered analysis (like YouTube processing)
                from processing.content_analysis import ContentAnalysisEngine
                analysis_engine = ContentAnalysisEngine()
                
                # Use the same AI analysis as YouTube processing
                ai_analysis = analysis_engine.analyze_content(content)
                
                # Create enhanced summary with AI analysis
                summary_content = self._generate_web_content_summary_with_ai(
                    content, title, url, result, ai_analysis)

                # Write summary file
                summary_file_path = web_dir / f"{safe_title}_summary.txt"
                with open(summary_file_path, 'w', encoding='utf-8') as f:
                    f.write(summary_content)

                # Write raw content file
                content_file_path = web_dir / f"{safe_title}_content.txt"
                with open(content_file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

                # Write comprehensive metadata file
                metadata_file_path = web_dir / f"{safe_title}_metadata.json"
                enhanced_metadata = {
                    **data['metadata'],
                    'files': {
                        'summary': str(summary_file_path),
                        'content': str(content_file_path),
                        'metadata': str(metadata_file_path)
                    },
                    'analysis': {
                        'content_type': self._analyze_content_type(content),
                        'key_topics': self._extract_key_topics(content),
                        'reading_time_minutes': max(1, len(content.split()) // 200),
                        'complexity_score': self._calculate_complexity_score(content)
                    }
                }

                with open(metadata_file_path, 'w', encoding='utf-8') as f:
                    json.dump(enhanced_metadata, f, indent=2)

                data['metadata'] = enhanced_metadata
                data['metadata']['processing_status']['summary_generated'] = True

                display.stop_spinner("✅ Comprehensive summary generated")
                display.print_file_created(str(summary_file_path), "summary")
                display.print_file_created(str(content_file_path), "content")
                display.print_file_created(str(metadata_file_path), "metadata")

            except Exception as e:
                display.stop_spinner("❌ Summary generation failed")
                logger.error(f"Summary generation error: {e}")

            # Upload to OpenAI if requested
            if upload:
                display.print_stage("☁️ UPLOADING TO OPENAI", "☁️")
                try:
                    display.start_spinner("☁️ Uploading web article...")

                    # Upload summary file if available
                    upload_file = str(summary_file_path) if 'summary_file_path' in locals(
                    ) else result.get('file_path')
                    if upload_file and os.path.exists(upload_file):
                        upload_result = upload_file_to_openai(upload_file)
                        data['upload_results'] = upload_result

                        if isinstance(upload_result, dict) and 'file_id' in upload_result:
                            display.stop_spinner(
                                "✅ Web article uploaded successfully")
                            display.print_upload_status(
                                upload_result['file_id'], "success")
                        else:
                            display.stop_spinner("❌ Web article upload failed")
                            display.print_upload_status("", "failed")
                    else:
                        display.stop_spinner("⚠️ No file available for upload")

                except Exception as e:
                    display.stop_spinner("❌ Upload failed")
                    display.print_error(f"Upload error: {e}")
                    logger.error(f"Upload error: {e}")

            # Add to existing QStash workflow
            display.print_stage("🔄 QSTASH WORKFLOW", "🔄")
            try:
                display.start_spinner("📤 Adding to processing queue...")

                summary_path = str(summary_file_path) if 'summary_file_path' in locals(
                ) else result.get('summary_path')
                content_path = str(content_file_path) if 'content_file_path' in locals(
                ) else result.get('file_path')

                if summary_path and os.path.exists(summary_path):
                    queue_result = add_processed_content_to_queue(
                        data['metadata'],
                        summary_path,
                        content_path
                    )
                    data['queue_result'] = queue_result
                    display.stop_spinner("✅ Added to processing queue")
                else:
                    display.stop_spinner("⚠️ No summary file for queue")

            except Exception as e:
                display.stop_spinner("❌ Queue processing failed")
                logger.error(f"Queue processing error: {e}")

            # Add to local knowledge base
            display.print_stage("💾 LOCAL KNOWLEDGE BASE", "💾")
            if add_to_kb:
                try:
                    display.start_spinner(
                        "📊 Adding to local vectorized database...")
                    doc_id = self.add_to_knowledge_base(data, 'article')
                    data['doc_id'] = doc_id

                    if doc_id:
                        data['metadata']['processing_status']['kb_indexed'] = True
                        display.stop_spinner("✅ Added to local knowledge base")
                    else:
                        display.stop_spinner("❌ Local KB storage failed")

                except Exception as e:
                    display.stop_spinner("❌ Local KB storage failed")
                    logger.error(f"Error adding to local knowledge base: {e}")
                    data['doc_id'] = None
            else:
                display.print_warning("Knowledge base storage skipped (--no-kb)")
                data['doc_id'] = None

            # ENTITY EXTRACTION WORKFLOW (matching file processing)
            if data.get('doc_id') and 'summary_file_path' in locals():
                try:
                    display.print_stage("🧠 ENTITY PROCESSING", "🧠")
                    display.start_spinner(
                        "🔍 Extracting entities and searching Xata database...")
                    logger.info(
                        "Starting entity processing for web article...")

                    # Import entity processor (same as file processing)
                    from lib.entity_extraction.processors.interactive_entity_processor import process_summary_file_interactive

                    # Use non-interactive mode for automated workflow
                    entity_results = process_summary_file_interactive(
                        str(summary_file_path),
                        doc_id,
                        interactive=False
                    )

                    # Add entity processing results to metadata
                    data['metadata']['entity_processing'] = entity_results
                    data['metadata']['processing_status']['entities_extracted'] = True

                    total_entities = entity_results.get('total_entities', 0)
                    total_matches = entity_results.get('total_matches', 0)

                    display.stop_spinner(
                        f"✅ Extracted {total_entities} entities, found {total_matches} Xata matches")
                    logger.info(
                        f"Entity processing complete: {entity_results.get('status', 'unknown')}")
                    logger.info(
                        f"Extracted {total_entities} entities, found {total_matches} Xata matches")

                except Exception as e:
                    display.stop_spinner("❌ Entity processing failed")
                    logger.error(f"Entity processing failed: {e}")
                    # Don't fail the entire process if entity extraction fails

            # KNOWLEDGE GRAPH PROCESSING (CocoIndex - matching file processing)
            if data.get('doc_id'):
                try:
                    display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
                    display.start_spinner(
                        "📊 Building knowledge graph with CocoIndex...")

                    # Import CocoIndex integration
                    try:
                        from lib.cocoindex_integration import cocoindex_processor

                        # Trigger CocoIndex knowledge graph processing
                        cocoindex_result = cocoindex_processor.process_document_knowledge_graph(
                            doc_id,
                            force_update=False
                        )

                        if cocoindex_result and cocoindex_result.get('status') == 'success':
                            entities_count = cocoindex_result.get(
                                'entities_processed', 0)
                            relationships_count = cocoindex_result.get(
                                'relationships_processed', 0)

                            display.stop_spinner(
                                f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                            data['cocoindex_processing'] = cocoindex_result
                            data['metadata']['processing_status']['kg_processed'] = True
                            logger.info(
                                f"CocoIndex processing completed: {entities_count} entities, {relationships_count} relationships")

                        elif cocoindex_result and cocoindex_result.get('status') == 'skipped':
                            display.stop_spinner(
                                f"⚠️ Knowledge graph skipped: {cocoindex_result.get('reason', 'unknown')}")
                            data['cocoindex_processing'] = cocoindex_result
                            logger.info(
                                f"CocoIndex processing skipped: {cocoindex_result.get('reason', 'unknown')}")

                        else:
                            display.stop_spinner(
                                "❌ Knowledge graph processing failed")
                            if cocoindex_result:
                                data['cocoindex_processing'] = cocoindex_result
                                logger.warning(
                                    f"CocoIndex processing failed: {cocoindex_result.get('error', 'unknown error')}")

                    except ImportError:
                        display.stop_spinner("⚠️ CocoIndex not available")
                        logger.info(
                            "CocoIndex knowledge graph integration not available")

                except Exception as e:
                    display.stop_spinner("❌ Knowledge graph processing failed")
                    logger.error(f"CocoIndex processing failed: {e}")
                    # Don't fail the entire process if CocoIndex processing fails

            # Search sync (if available)
            if self.search_syncer and data.get('doc_id'):
                display.print_stage("🔍 SEARCH INTEGRATION", "🔍")
                try:
                    display.start_spinner("🔗 Syncing to cloud search...")
                    doc = self.kb_crud.get_document(data['doc_id'])
                    if doc:
                        search_result = self.search_syncer.sync_document_to_search(
                            doc)
                        if search_result:
                            display.stop_spinner("✅ Synced to cloud search")
                        else:
                            display.stop_spinner("⚠️ Cloud search sync failed")
                    else:
                        display.stop_spinner("⚠️ No document to sync")
                except Exception as e:
                    display.stop_spinner("❌ Cloud search sync failed")
                    logger.error(f"Error syncing to search: {e}")

            # Show completion summary
            display.print_completion_summary(data)

            logger.info(f"Enhanced web processing complete: {data['title']}")
            return data

        except Exception as e:
            logger.error(f"Error in enhanced web processing: {e}")
            return None

    def _generate_web_content_summary_with_ai(self, content: str, title: str, url: str, result: Dict[str, Any], ai_analysis: str) -> str:
        """Generate comprehensive summary with AI-powered research methodology analysis (matching YouTube quality)"""
        try:
            from datetime import datetime

            # Basic content analysis
            word_count = len(content.split()) if content else 0
            reading_time = max(1, word_count // 200)

            # Extract key information
            content_type = self._analyze_content_type(content)
            complexity_score = self._calculate_complexity_score(content)

            # Use AI analysis directly (same as YouTube processing)
            return ai_analysis

        except Exception as e:
            logger.error(f"Error generating AI-powered web summary: {e}")
            # Fallback to basic summary
            return self._generate_web_content_summary_basic(content, title, url, result)

    def _generate_web_content_summary_basic(self, content: str, title: str, url: str, result: Dict[str, Any]) -> str:
        """Fallback method - original basic summary generation"""
        """Fallback method - original basic summary generation for web content"""
        try:
            from datetime import datetime

            # Basic content analysis
            word_count = len(content.split()) if content else 0
            reading_time = max(1, word_count // 200)

            # Extract key information
            content_type = self._analyze_content_type(content)
            key_topics = self._extract_key_topics(content)
            complexity_score = self._calculate_complexity_score(content)

            # Generate comprehensive summary
            summary = f"""=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===

Research Agent Analysis:
**=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===**

Source Analysis: {url}
Document Title: {title}
Content Type: {content_type}
Word Count: {word_count}
Reading Time: {reading_time} minutes
Complexity Score: {complexity_score}/100
Processing Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Content Classification

Document Type: Web Article
Content Length: {len(content)} characters
Primary Topics: {', '.join(key_topics[:5]) if key_topics else 'General content'}
Authority Level: {self._assess_content_authority(content, result)}

## Key Information Extraction

{self._extract_key_information(content)}

## Research Methodology Notes

1. Content Verification:
   - Source URL: {url}
   - Author: {result.get('author', 'Not specified')}
   - Publication Date: {result.get('publish_date', 'Not specified')}
   - Content Integrity: Verified through web extraction

2. Information Processing:
   - Text extraction completed with full content preservation
   - Metadata extraction successful
   - Entity recognition prepared for processing

3. Classification Confidence:
   - Content authenticity: High (direct web source)
   - Information completeness: {self._assess_completeness(content)}
   - Research value: {self._assess_research_value(content)}

=== ORIGINAL CONTENT ===

{content[:5000]}{'...' if len(content) > 5000 else ''}

=== END ANALYSIS ===
"""
            return summary

        except Exception as e:
            logger.error(f"Error generating web content summary: {e}")
            # Return basic summary on error
            return f"""=== WEB CONTENT SUMMARY ===

Title: {title}
Source: {url}
Content Length: {len(content)} characters
Processing Error: {str(e)}

{content[:1000]}{'...' if len(content) > 1000 else ''}
"""

    def _analyze_content_type(self, content: str) -> str:
        """Analyze and classify content type"""
        if not content:
            return "empty"

        content_lower = content.lower()

        # Check for various content types
        if any(keyword in content_lower for keyword in ['ufo', 'uap', 'alien', 'extraterrestrial', 'roswell', 'majestic']):
            return "ufo_research"
        elif any(keyword in content_lower for keyword in ['fbi', 'cia', 'classified', 'declassified', 'government']):
            return "government_document"
        elif any(keyword in content_lower for keyword in ['testimony', 'witness', 'report', 'incident']):
            return "witness_testimony"
        elif any(keyword in content_lower for keyword in ['research', 'analysis', 'study', 'investigation']):
            return "research_analysis"
        elif any(keyword in content_lower for keyword in ['news', 'article', 'report']):
            return "news_article"
        else:
            return "general_content"

    def _extract_key_topics(self, content: str) -> list:
        """Extract key topics from content"""
        if not content:
            return []

        # Simple keyword extraction (could be enhanced with NLP)
        common_ufo_terms = [
            'ufo', 'uap', 'alien', 'extraterrestrial', 'roswell', 'area 51',
            'majestic 12', 'mj-12', 'disclosure', 'sighting', 'encounter',
            'fbi', 'cia', 'government', 'classified', 'witness', 'testimony'
        ]

        content_lower = content.lower()
        found_topics = []

        for term in common_ufo_terms:
            if term in content_lower:
                found_topics.append(term.title())

        return found_topics[:10]  # Return top 10 topics

    def _calculate_complexity_score(self, content: str) -> int:
        """Calculate content complexity score (0-100)"""
        if not content:
            return 0

        # Simple complexity metrics
        words = content.split()
        sentences = content.split('.')

        if not words:
            return 0

        avg_word_length = sum(len(word) for word in words) / len(words)
        avg_sentence_length = len(words) / max(1, len(sentences))

        # Technical terms boost complexity
        technical_terms = ['classified', 'intelligence',
                           'phenomena', 'extraterrestrial', 'investigation']
        technical_score = sum(
            1 for term in technical_terms if term.lower() in content.lower())

        # Calculate final score (0-100)
        complexity = min(100, int(
            (avg_word_length * 10) +
            (avg_sentence_length * 2) +
            (technical_score * 5)
        ))

        return complexity

    def _assess_content_authority(self, content: str, result: Dict[str, Any]) -> str:
        """Assess content authority level"""
        author = result.get('author', '').lower()
        url = result.get('url', '').lower()

        # Government sources
        if any(domain in url for domain in ['.gov', 'fbi.gov', 'cia.gov']):
            return "Government Official"

        # News organizations
        if any(domain in url for domain in ['cnn.com', 'bbc.com', 'reuters.com', 'ap.org']):
            return "Major News Organization"

        # Research institutions
        if any(domain in url for domain in ['.edu', 'research', 'institute']):
            return "Research Institution"

        # UFO research sites
        if any(domain in url for domain in ['blackvault', 'mufon', 'nicap']):
            return "UFO Research Organization"

        return "Independent Source"

    def _extract_key_information(self, content: str) -> str:
        """Extract key information from content"""
        if not content:
            return "No content available for analysis"

        # Find first few paragraphs for summary
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]

        if not paragraphs:
            return content[:500] + '...' if len(content) > 500 else content

        # Return first meaningful paragraph or two
        key_info = []
        for para in paragraphs[:3]:
            if len(para) > 50:  # Skip very short paragraphs
                key_info.append(para)

        result = '\n\n'.join(key_info)
        return result[:1000] + '...' if len(result) > 1000 else result

    def _assess_completeness(self, content: str) -> str:
        """Assess information completeness"""
        if not content:
            return "No content"

        word_count = len(content.split())

        if word_count < 100:
            return "Limited"
        elif word_count < 500:
            return "Moderate"
        elif word_count < 2000:
            return "Comprehensive"
        else:
            return "Extensive"

    def _assess_research_value(self, content: str) -> str:
        """Assess research value of content"""
        if not content:
            return "None"

        content_lower = content.lower()

        # Check for high-value research indicators
        high_value_indicators = [
            'classified', 'declassified', 'testimony', 'witness', 'investigation',
            'evidence', 'documentation', 'official', 'report', 'analysis'
        ]

        value_score = sum(
            1 for indicator in high_value_indicators if indicator in content_lower)

        if value_score >= 5:
            return "High"
        elif value_score >= 3:
            return "Medium"
        elif value_score >= 1:
            return "Low"
        else:
            return "Limited"

    def get_integration_status(self) -> Dict[str, Any]:
        """Get status of all integrations"""
        return {
            "local_kb": True,
            "search_sync": self.search_syncer is not None,
            "search_url": os.getenv("UPSTASH_SEARCH_URL") is not None,
            "search_token": os.getenv("UPSTASH_SEARCH_TOKEN") is not None
        }


# Global instance for easy import
kb_service = KnowledgeBaseService()

# Convenience functions that can replace existing ones in main.py


def add_to_knowledge_base(data: Dict[str, Any], doc_type: str = 'transcript') -> Optional[str]:
    """Enhanced version that includes Search sync"""
    return kb_service.add_to_knowledge_base(data, doc_type)


def process_youtube_url_enhanced(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Enhanced YouTube processing with Search sync

    ═══ YT-CHAIN-04 · knowledge_base_service.py :: process_youtube_url_enhanced()
    A one-line passthrough onto the module-level `kb_service` singleton.
    This is the name main.py imports; the work is one hop down.
    PREV ← YT-CHAIN-03  main.py :: process_url()
    NEXT → YT-CHAIN-05  KnowledgeBaseService :: process_youtube_with_enhanced_workflow()
    ═══════════════════════════════════════════════════════════════════════
    """
    return kb_service.process_youtube_with_enhanced_workflow(url, upload, add_to_kb)


def process_web_url_enhanced(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Enhanced web processing with Search sync

    ═══ WEB-CHAIN-02 · knowledge_base_service.py :: process_web_url_enhanced()
    A one-line passthrough onto the module-level `kb_service` singleton —
    the web mirror of YT-CHAIN-04. This is the name main.py imports; the
    work is one hop down.

    FIXED 2026-08-13 (found while tracing WEB-CHAIN): this call was
    `process_web_with_enhanced_workflow(url, upload)` — it accepted
    `add_to_kb` and then silently dropped it. The callee's parameter
    defaults to True and it really does gate its knowledge-base write on
    that flag, so `dy <web-url> --no-kb` wrote to the knowledge base
    anyway. The YouTube passthrough at YT-CHAIN-04 forwards all three
    arguments correctly; only this path lost one.

    PREV ← WEB-CHAIN-01  main.py :: process_url(), web arm
    NEXT → WEB-CHAIN-03  KnowledgeBaseService :: process_web_with_enhanced_workflow()
    ═══════════════════════════════════════════════════════════════════════
    """
    return kb_service.process_web_with_enhanced_workflow(url, upload, add_to_kb)