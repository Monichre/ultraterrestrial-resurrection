#!/usr/bin/env python3
"""
Knowledge Base Service
Handles document indexing, entity extraction, and search synchronization
Integrates with Upstash Search and Xata for comprehensive data management
Date: June 20, 2025
Updated: June 25, 2025
"""

import os
import json
import hashlib
import logging
from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime
from .knowledge_base_crud import KnowledgeBaseCRUD
from .sync_to_upstash_search_integrated import IntegratedUpstashSyncer
from .terminal_display import TerminalDisplay

logger = logging.getLogger(__name__)
display = TerminalDisplay()


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

            # Update the KB index to track existing YouTube files
            from datetime import datetime
            date_folder = datetime.now().strftime("%Y-%m-%d")

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
                    from .interactive_entity_processor import process_summary_file_interactive
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

    def process_youtube_with_enhanced_workflow(self, url: str, upload: bool = False) -> Optional[Dict[str, Any]]:
        """
        Enhanced YouTube processing that includes Search sync
        This can replace process_youtube_url in main.py
        """
        try:
            # Import YouTube processing functions and display
            from .youtube import generate_transcript
            from .upstash.queue import add_processed_content_to_queue
            from .openai_client.upload import upload_file_to_openai
            from .terminal_display import display

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

            # Prepare data structure
            data = {
                'content': transcript_content,
                'title': title,
                'source': url,
                'metadata': {
                    'video_id': metadata.get('id', ''),
                    'channel': '',  # Not in current metadata structure
                    'duration': '',  # Not in current metadata structure
                    'upload_date': '',  # Not in current metadata structure
                    'url': url,
                    'type': 'youtube_transcript',
                    'categories': metadata.get('categories', []),
                    'tags': metadata.get('tags', []),
                    'description': metadata.get('description', ''),
                    'chapters': metadata.get('chapters', [])
                },
                'file_paths': file_paths
            }

            # Upload to OpenAI if requested (existing functionality)
            if upload:
                display.print_stage("☁️  UPLOADING TO OPENAI", "☁️")
                try:
                    upload_results = {}
                    files_to_upload = [
                        (k, v) for k, v in file_paths.items() if os.path.exists(v)]

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

    def process_web_with_enhanced_workflow(self, url: str, upload: bool = False) -> Optional[Dict[str, Any]]:
        """
        Enhanced web processing that includes Search sync
        This can replace process_url for web content in main.py
        """
        try:
            # Import web processing and display
            import sys
            import os
            sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
            from processing.web_content_processor import WebContentProcessor
            from .upstash.queue import add_processed_content_to_queue
            from .openai_client.upload import upload_file_to_openai
            from .terminal_display import display

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

            display.print_success(
                f"🌐 Processing: {result.get('title', 'Web Article')}")

            # Prepare data structure
            data = {
                'content': result.get('content', ''),
                'title': result.get('title', 'Web Article'),
                'source': url,
                'metadata': {
                    'url': url,
                    'title': result.get('title', ''),
                    'author': result.get('author', ''),
                    'publish_date': result.get('publish_date', ''),
                    'type': 'web_article'
                }
            }

            # Upload if requested (existing functionality)
            if upload and 'file_path' in result:
                try:
                    upload_result = upload_file_to_openai(result['file_path'])
                    data['upload_results'] = upload_result
                except Exception as e:
                    logger.error(f"Upload error: {e}")

            # Upload to OpenAI if requested
            if upload and 'file_path' in result:
                display.print_stage("☁️  UPLOADING TO OPENAI", "☁️")
                try:
                    display.start_spinner("☁️  Uploading web article...")
                    upload_result = upload_file_to_openai(result['file_path'])
                    data['upload_results'] = upload_result

                    if isinstance(upload_result, dict) and 'id' in upload_result:
                        display.stop_spinner(
                            "✅ Web article uploaded successfully")
                        display.print_upload_status(
                            upload_result['id'], "success")
                    else:
                        display.stop_spinner("❌ Web article upload failed")
                        display.print_upload_status("", "failed")

                except Exception as e:
                    display.print_error(f"Upload error: {e}")
                    logger.error(f"Upload error: {e}")

            # Add to existing QStash workflow
            display.print_stage("🔄 QSTASH WORKFLOW", "🔄")
            try:
                display.start_spinner("📤 Adding to processing queue...")
                if 'summary_path' in result:
                    queue_result = add_processed_content_to_queue(
                        data['metadata'],
                        result['summary_path'],
                        result.get('file_path')
                    )
                    data['queue_result'] = queue_result
                    display.stop_spinner("✅ Added to processing queue")
                else:
                    display.stop_spinner("⚠️  No summary file for queue")
            except Exception as e:
                display.stop_spinner("❌ Queue processing failed")
                logger.error(f"Queue processing error: {e}")

            # Add to local knowledge base
            display.print_stage("💾 LOCAL KNOWLEDGE BASE", "💾")
            try:
                display.start_spinner(
                    "📊 Adding to local vectorized database...")
                doc_id = self.add_to_knowledge_base(data, 'article')
                data['doc_id'] = doc_id

                if doc_id:
                    display.stop_spinner("✅ Added to local knowledge base")
                else:
                    display.stop_spinner("❌ Local KB storage failed")
            except Exception as e:
                display.stop_spinner("❌ Local KB storage failed")
                logger.error(f"Error adding to local knowledge base: {e}")
                data['doc_id'] = None

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
                            display.stop_spinner(
                                "⚠️  Cloud search sync failed")
                    else:
                        display.stop_spinner("⚠️  No document to sync")
                except Exception as e:
                    display.stop_spinner("❌ Cloud search sync failed")
                    logger.error(f"Error syncing to search: {e}")

            # Show completion summary
            display.print_completion_summary(data)

            logger.info(f"Web processing complete: {data['title']}")
            return data

        except Exception as e:
            logger.error(f"Error processing web URL: {e}")
            return None

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


def process_youtube_url_enhanced(url: str, upload: bool = False) -> Optional[Dict[str, Any]]:
    """Enhanced YouTube processing with Search sync"""
    return kb_service.process_youtube_with_enhanced_workflow(url, upload)


def process_web_url_enhanced(url: str, upload: bool = False) -> Optional[Dict[str, Any]]:
    """Enhanced web processing with Search sync"""
    return kb_service.process_web_with_enhanced_workflow(url, upload)
