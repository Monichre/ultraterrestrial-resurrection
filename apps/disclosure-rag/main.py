#!/usr/bin/env python3
"""
Main entry point for the Disclosure RAG system
Handles processing of URLs, files, and various content types
"""

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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import project modules
from lib.openai.upload import upload_file_to_openai
from processing.web_content_processor import WebContentProcessor
from lib.youtube import (
    generate_transcript,
    parse_file_and_generate_transcript,
    write_transcript_to_file
)
from lib.upstash.queue import add_processed_content_to_queue
from lib.knowledge_base_crud import KnowledgeBaseCRUD
from lib.local_rag import LocalRAG, LocalRAGIntegration

# Initialize processors
web_processor = WebContentProcessor()
kb_crud = KnowledgeBaseCRUD()
local_rag = LocalRAG()
rag_integration = LocalRAGIntegration(kb_crud, local_rag)


def process_url(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a URL (web page or YouTube video)"""
    logger.info(f"Processing URL: {url}")
    
    # Check if it's a YouTube URL
    if "youtube.com" in url or "youtu.be" in url:
        return process_youtube_url(url, upload, add_to_kb)
    else:
        return process_web_url(url, upload, add_to_kb)


def process_youtube_url(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a YouTube video URL"""
    logger.info(f"Processing YouTube video: {url}")
    
    try:
        data = generate_transcript(url)
        
        if not data:
            logger.error("Failed to generate transcript")
            return None
        
        # Handle file uploads
        if upload:
            upload_results = []
            
            if data.get('file_path') and os.path.exists(data['file_path']):
                result = upload_file_to_openai(data['file_path'])
                upload_results.append(result)
                logger.info(f"Uploaded transcript: {result}")
            
            if data.get('summary_path') and os.path.exists(data['summary_path']):
                result = upload_file_to_openai(data['summary_path'])
                upload_results.append(result)
                logger.info(f"Uploaded summary: {result}")
            
            if data.get('metadata_path') and os.path.exists(data['metadata_path']):
                result = upload_file_to_openai(data['metadata_path'])
                upload_results.append(result)
                logger.info(f"Uploaded metadata: {result}")
                
                # Add to processing queue
                with open(data['metadata_path'], 'r', encoding='utf-8') as f:
                    metadata_obj = json.load(f)
                add_processed_content_to_queue(
                    metadata_obj, 
                    data.get('summary_path'), 
                    data.get('file_path')
                )
            
            data['upload_results'] = upload_results
        
        # Add to knowledge base
        if add_to_kb and data.get('file_path'):
            add_to_knowledge_base(data, 'transcript')
        
        return data
        
    except Exception as e:
        logger.error(f"Error processing YouTube URL: {e}")
        return None


def process_web_url(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a web page URL"""
    logger.info(f"Scraping web content from: {url}")
    
    try:
        data = web_processor.process_url(url)
        
        if not data:
            logger.error("Failed to scrape content")
            return None
        
        content = data.get('content')
        metadata = data.get('metadata', {})
        markdown = data.get('markdown', '')
        summary = data.get('summary', '')
        title = metadata.get('title', 'Untitled')
        
        # Write files
        file_path = write_transcript_to_file(title, markdown, url, None)
        summary_path = write_transcript_to_file(f"{title} Summary", summary, url, None)
        
        data['file_path'] = file_path
        data['summary_path'] = summary_path
        
        logger.info(f"Content saved to: {file_path}")
        
        # Handle uploads
        if upload:
            upload_results = []
            
            result = upload_file_to_openai(file_path)
            upload_results.append(result)
            logger.info(f"Uploaded content: {result}")
            
            result = upload_file_to_openai(summary_path)
            upload_results.append(result)
            logger.info(f"Uploaded summary: {result}")
            
            # Add to processing queue
            if data.get('metadata_path') and os.path.exists(data['metadata_path']):
                with open(data['metadata_path'], 'r', encoding='utf-8') as f:
                    metadata_obj = json.load(f)
                add_processed_content_to_queue(metadata_obj, summary_path, file_path)
            else:
                add_processed_content_to_queue(metadata, summary_path, file_path)
            
            data['upload_results'] = upload_results
        
        # Add to knowledge base
        if add_to_kb:
            add_to_knowledge_base(data, 'article')
        
        return data
        
    except Exception as e:
        logger.error(f"Error processing web URL: {e}")
        return None


def process_file(file_path: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a local file"""
    logger.info(f"Processing file: {file_path}")
    
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None
    
    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title from filename
        title = Path(file_path).stem.replace('_', ' ').replace('-', ' ').title()
        
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
                'processed_at': datetime.now().isoformat()
            }
        }
        
        # Handle upload
        if upload:
            result = upload_file_to_openai(file_path)
            data['upload_result'] = result
            logger.info(f"Uploaded file: {result}")
        
        # Add to knowledge base
        if add_to_kb:
            doc_type = 'research' if 'research' in file_path.lower() else 'case_file'
            add_to_knowledge_base(data, doc_type)
        
        return data
        
    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return None


def process_file_with_urls(file_path: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a file containing URLs (one per line)"""
    logger.info(f"Processing URL file: {file_path}")
    
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        results = []
        for url in urls:
            logger.info(f"Processing URL from file: {url}")
            result = process_url(url, upload, add_to_kb)
            if result:
                results.append(result)
        
        return {
            'source_file': file_path,
            'total_urls': len(urls),
            'processed': len(results),
            'results': results
        }
        
    except Exception as e:
        logger.error(f"Error processing URL file: {e}")
        return None


def add_to_knowledge_base(data: Dict[str, Any], doc_type: str):
    """Add processed content to the knowledge base"""
    try:
        # Extract content
        content = data.get('content', '')
        if not content and data.get('file_path'):
            with open(data['file_path'], 'r', encoding='utf-8') as f:
                content = f.read()
        
        if not content:
            logger.warning("No content to add to knowledge base")
            return
        
        # Extract metadata
        metadata = data.get('metadata', {})
        title = metadata.get('title', data.get('title', 'Untitled'))
        source = metadata.get('url', metadata.get('source', data.get('source', 'Unknown')))
        
        # Create document in knowledge base
        doc = kb_crud.create_document(
            title=title,
            content=content,
            source=source,
            doc_type=doc_type,
            metadata=metadata,
            tags=extract_tags(content, title)
        )
        
        # Sync to local RAG
        rag_integration.sync_document(doc.id)
        
        logger.info(f"Added to knowledge base: {doc.id} - {title}")
        
    except Exception as e:
        logger.error(f"Error adding to knowledge base: {e}")


def extract_tags(content: str, title: str) -> list:
    """Extract relevant tags from content"""
    tags = []
    
    # Common UFO/UAP related keywords
    keywords = [
        'ufo', 'uap', 'alien', 'extraterrestrial', 'disclosure',
        'pentagon', 'military', 'pilot', 'sighting', 'encounter',
        'craft', 'object', 'phenomenon', 'classified', 'witness',
        'testimony', 'congress', 'hearing', 'report', 'document'
    ]
    
    # Check title and content for keywords
    combined_text = f"{title} {content}".lower()
    
    for keyword in keywords:
        if keyword in combined_text:
            tags.append(keyword)
    
    return list(set(tags))[:10]  # Limit to 10 tags


def main():
    parser = argparse.ArgumentParser(
        description="Disclosure RAG - Process and manage UFO/UAP research content",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Process a web article
  python main.py --url https://example.com/ufo-article
  
  # Process a YouTube video with upload
  python main.py --url https://youtube.com/watch?v=... --upload
  
  # Process a local file
  python main.py --file /path/to/document.md
  
  # Process multiple URLs from a file
  python main.py --url-file urls.txt --upload
  
  # Launch the Knowledge Base UI
  python main.py --ui
  
  # Sync all documents to local RAG
  python main.py --sync-rag
        """
    )
    
    # Input options
    input_group = parser.add_mutually_exclusive_group()
    input_group.add_argument('--url', help="URL of webpage or YouTube video to process")
    input_group.add_argument('--file', help="Path to local file to process")
    input_group.add_argument('--url-file', help="Path to file containing URLs (one per line)")
    
    # Processing options
    parser.add_argument('--upload', action='store_true', 
                       help="Upload processed content to OpenAI")
    parser.add_argument('--no-kb', action='store_true',
                       help="Don't add to knowledge base")
    
    # UI and management options
    parser.add_argument('--ui', action='store_true',
                       help="Launch the Knowledge Base UI")
    parser.add_argument('--sync-rag', action='store_true',
                       help="Sync all knowledge base documents to local RAG")
    
    # Legacy compatibility
    parser.add_argument('--scrape', action='store_true',
                       help="(Legacy) Force scraping mode for URL")
    parser.add_argument('--pdf', action='store_true',
                       help="(Legacy) Process as PDF")
    
    args = parser.parse_args()
    
    # Handle UI launch
    if args.ui:
        logger.info("Launching Knowledge Base UI...")
        os.system("streamlit run knowledge_base_ui.py")
        return
    
    # Handle RAG sync
    if args.sync_rag:
        logger.info("Syncing knowledge base to local RAG...")
        rag_integration.sync_all_documents()
        stats = local_rag.get_stats()
        logger.info(f"RAG stats: {stats}")
        return
    
    # Process inputs
    add_to_kb = not args.no_kb
    
    if args.url:
        result = process_url(args.url, args.upload, add_to_kb)
        if result:
            print(json.dumps(result, indent=2, default=str))
    
    elif args.file:
        result = process_file(args.file, args.upload, add_to_kb)
        if result:
            print(json.dumps(result, indent=2, default=str))
    
    elif args.url_file:
        result = process_file_with_urls(args.url_file, args.upload, add_to_kb)
        if result:
            print(json.dumps(result, indent=2, default=str))
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()