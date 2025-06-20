#!/usr/bin/env python3
"""
Enhanced integration for main.py to include Upstash Search
This adds Search sync to your existing daily workflow
Date: June 20, 2025
"""

import os
import json
import logging
from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime
from knowledge_base_crud import KnowledgeBaseCRUD
from sync_to_upstash_search_integrated import IntegratedUpstashSyncer

logger = logging.getLogger(__name__)

class EnhancedKnowledgeBaseIntegration:
    """Enhanced KB integration that includes both existing workflow and Search"""
    
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
                self.search_syncer = IntegratedUpstashSyncer(search_url, search_token)
                logger.info("Upstash Search integration enabled")
            except Exception as e:
                logger.warning(f"Failed to initialize Upstash Search: {e}")
                self.search_syncer = None
        else:
            logger.info("Upstash Search credentials not found, skipping Search integration")
    
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
                    search_result = self.search_syncer.sync_document_to_search(doc)
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
            # Import YouTube processing functions
            from lib.youtube import generate_transcript, write_transcript_to_file
            from lib.upstash.queue import add_processed_content_to_queue
            from lib.openai.upload import upload_file_to_openai
            
            logger.info(f"Processing YouTube URL: {url}")
            
            # Generate transcript (existing functionality)
            transcript_data = generate_transcript(url)
            if not transcript_data:
                logger.error("Failed to generate transcript")
                return None
            
            # Write transcript files (existing functionality)
            file_paths = write_transcript_to_file(transcript_data)
            if not file_paths:
                logger.error("Failed to write transcript files")
                return None
            
            # Prepare data structure
            data = {
                'content': transcript_data.get('transcript', ''),
                'title': transcript_data.get('title', 'YouTube Video'),
                'source': url,
                'metadata': {
                    'video_id': transcript_data.get('video_id', ''),
                    'channel': transcript_data.get('channel', ''),
                    'duration': transcript_data.get('duration', ''),
                    'upload_date': transcript_data.get('upload_date', ''),
                    'url': url,
                    'type': 'youtube_transcript'
                },
                'file_paths': file_paths
            }
            
            # Upload to OpenAI if requested (existing functionality)
            if upload:
                try:
                    upload_results = {}
                    for file_type, file_path in file_paths.items():
                        if os.path.exists(file_path):
                            result = upload_file_to_openai(file_path)
                            upload_results[file_type] = result
                    data['upload_results'] = upload_results
                except Exception as e:
                    logger.error(f"Upload error: {e}")
            
            # Add to existing QStash workflow (existing functionality)
            try:
                summary_path = file_paths.get('summary', file_paths.get('transcript'))
                full_path = file_paths.get('transcript')
                
                if summary_path:
                    queue_result = add_processed_content_to_queue(
                        data['metadata'], 
                        summary_path, 
                        full_path
                    )
                    data['queue_result'] = queue_result
            except Exception as e:
                logger.error(f"Queue processing error: {e}")
            
            # Add to enhanced knowledge base (includes Search sync)
            doc_id = self.add_to_knowledge_base(data, 'transcript')
            data['doc_id'] = doc_id
            
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
            # Import web processing
            from processing.web_content_processor import WebContentProcessor
            from lib.upstash.queue import add_processed_content_to_queue
            from lib.openai.upload import upload_file_to_openai
            
            logger.info(f"Processing web URL: {url}")
            
            web_processor = WebContentProcessor()
            
            # Process web content (existing functionality)
            result = web_processor.process_url(url)
            if not result:
                logger.error("Failed to process web content")
                return None
            
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
            
            # Add to existing QStash workflow (existing functionality)
            if 'summary_path' in result:
                try:
                    queue_result = add_processed_content_to_queue(
                        data['metadata'],
                        result['summary_path'],
                        result.get('file_path')
                    )
                    data['queue_result'] = queue_result
                except Exception as e:
                    logger.error(f"Queue processing error: {e}")
            
            # Add to enhanced knowledge base (includes Search sync)
            doc_id = self.add_to_knowledge_base(data, 'article')
            data['doc_id'] = doc_id
            
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
enhanced_integration = EnhancedKnowledgeBaseIntegration()

# Convenience functions that can replace existing ones in main.py
def add_to_knowledge_base(data: Dict[str, Any], doc_type: str = 'transcript') -> Optional[str]:
    """Enhanced version that includes Search sync"""
    return enhanced_integration.add_to_knowledge_base(data, doc_type)

def process_youtube_url_enhanced(url: str, upload: bool = False) -> Optional[Dict[str, Any]]:
    """Enhanced YouTube processing with Search sync"""
    return enhanced_integration.process_youtube_with_enhanced_workflow(url, upload)

def process_web_url_enhanced(url: str, upload: bool = False) -> Optional[Dict[str, Any]]:
    """Enhanced web processing with Search sync"""
    return enhanced_integration.process_web_with_enhanced_workflow(url, upload)