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
from lib.knowledge_base_service import (
    kb_service,
    process_youtube_url_enhanced,
    process_web_url_enhanced,
    add_to_knowledge_base
)

# Import existing modules (fallback if enhanced fails)
from lib.openai_client.upload import upload_file_to_openai
from processing.web_content_processor import WebContentProcessor
from lib.youtube import (
    generate_transcript,
    parse_file_and_generate_transcript,
    write_transcript_to_file
)
from lib.upstash.queue import add_processed_content_to_queue
from lib.knowledge_base_crud import KnowledgeBaseCRUD
# Import enhanced CocoIndex for enhanced vector search
try:
    from lib.cocoindex import create_live_cocoindex, BackendFactory
    ENHANCED_COCOINDEX_AVAILABLE = True
    logger.info("Enhanced CocoIndex available")
except ImportError:
    ENHANCED_COCOINDEX_AVAILABLE = False
    logger.warning("Enhanced CocoIndex not available")

# Initialize processors
web_processor = WebContentProcessor()
kb_crud = KnowledgeBaseCRUD()

def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube video"""
    return any(domain in url.lower() for domain in ['youtube.com', 'youtu.be'])

def process_url(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a URL (web page or YouTube video) with enhanced integration"""
    logger.info(f"Processing URL: {url}")
    
    try:
        if is_youtube_url(url):
            # Use enhanced YouTube processing
            result = process_youtube_url_enhanced(url, upload)
            return result
        else:
            # Use enhanced web processing
            result = process_web_url_enhanced(url, upload)
            return result
            
    except Exception as e:
        logger.error(f"Enhanced processing failed, falling back to original: {e}")
        
        # Fallback to original processing if enhanced fails
        if is_youtube_url(url):
            return process_youtube_url_original(url, upload, add_to_kb)
        else:
            return process_web_url_original(url, upload, add_to_kb)

def process_youtube_url_original(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Original YouTube processing (fallback)"""
    logger.info(f"Processing YouTube URL (original): {url}")
    
    try:
        # Generate transcript
        transcript_data = generate_transcript(url)
        if not transcript_data:
            logger.error("Failed to generate transcript")
            return None
        
        # Write transcript files
        file_paths = write_transcript_to_file(transcript_data)
        if not file_paths:
            logger.error("Failed to write transcript files")
            return None
        
        # Create data structure
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
        
        # Upload to OpenAI if requested
        if upload:
            upload_results = {}
            for file_type, file_path in file_paths.items():
                if os.path.exists(file_path):
                    result = upload_file_to_openai(file_path)
                    upload_results[file_type] = result
            
            # Add to queue with metadata file if available
            summary_path = file_paths.get('summary', file_paths.get('transcript'))
            metadata_path = file_paths.get('metadata')
            
            if metadata_path and os.path.exists(metadata_path):
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    metadata_obj = json.load(f)
                add_processed_content_to_queue(metadata_obj, summary_path, file_paths.get('transcript'))
            else:
                add_processed_content_to_queue(data['metadata'], summary_path, file_paths.get('transcript'))
            
            data['upload_results'] = upload_results
        
        # Add to knowledge base
        if add_to_kb:
            add_to_knowledge_base(data, 'transcript')
        
        return data
        
    except Exception as e:
        logger.error(f"Error processing YouTube URL: {e}")
        return None

def process_web_url_original(url: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Original web processing (fallback)"""
    logger.info(f"Processing web URL (original): {url}")
    
    try:
        # Process web content
        result = web_processor.process_url(url)
        if not result:
            logger.error("Failed to process web content")
            return None
        
        # Create data structure
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
        
        # Upload and add to queue if requested
        if upload and 'file_path' in result:
            upload_result = upload_file_to_openai(result['file_path'])
            
            # Add to queue
            metadata_path = result.get('metadata_path')
            summary_path = result.get('summary_path')
            file_path = result.get('file_path')
            
            if metadata_path and os.path.exists(metadata_path):
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    metadata_obj = json.load(f)
                add_processed_content_to_queue(metadata_obj, summary_path, file_path)
            else:
                add_processed_content_to_queue(data['metadata'], summary_path, file_path)
            
            data['upload_results'] = upload_result
        
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
                'file_type': Path(file_path).suffix
            }
        }
        
        # Upload if requested
        if upload:
            upload_result = upload_file_to_openai(file_path)
            data['upload_results'] = upload_result
            
            # Add to queue
            add_processed_content_to_queue(data['metadata'], file_path, file_path)
        
        # Add to knowledge base
        if add_to_kb:
            doc_type = 'research' if file_path.endswith('.pdf') else 'case_file'
            doc_id = add_to_knowledge_base(data, doc_type)
            data['doc_id'] = doc_id
            
            # Entity Extraction (similar to YouTube workflow)
            if doc_id:
                try:
                    from lib.terminal_display import display
                    display.print_stage("🧠 ENTITY PROCESSING", "🧠")
                    
                    # Create summary file in the case_files directory (mirrors YouTube workflow)
                    doc_info = kb_crud.get_document(doc_id)
                    if doc_info:
                        doc_dir = Path(doc_info.metadata.get('file_path', '')).parent
                        summary_file_path = doc_dir / f"{Path(file_path).stem}_summary.txt"
                        
                        # Write content summary to file (for entity processing)
                        with open(summary_file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        
                        try:
                            from lib.entity_extraction.processors.interactive_entity_processor import process_summary_file_interactive
                            display.start_spinner("🔍 Extracting entities and searching Xata database...")
                            logger.info("Starting entity processing for file...")
                            
                            # Use non-interactive mode for automated workflow
                            entity_results = process_summary_file_interactive(
                                str(summary_file_path), doc_id, interactive=False)
                            
                            # Add entity processing results to metadata
                            data['metadata']['entity_processing'] = entity_results
                            
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
                        logger.warning(f"Could not find document info for entity processing: {doc_id}")
                            
                except Exception as e:
                    logger.error(f"Error setting up entity processing: {e}")
            
            # Move successfully processed files from processing_queue to case_files
            if doc_id and file_path.startswith('/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/disclosure-rag/data/processing_queue/'):
                try:
                    import shutil
                    case_files_dir = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/case_files/'
                    
                    # Create case_files directory if it doesn't exist
                    os.makedirs(case_files_dir, exist_ok=True)
                    
                    # Get filename and create destination path
                    filename = os.path.basename(file_path)
                    destination_path = os.path.join(case_files_dir, filename)
                    
                    # Move the file
                    shutil.move(file_path, destination_path)
                    logger.info(f"Moved processed file from processing_queue to case_files: {filename}")
                    
                    # Update the data source to reflect new location
                    data['source'] = destination_path
                    data['metadata']['source'] = destination_path
                    
                except Exception as e:
                    logger.error(f"Failed to move file to case_files: {e}")
                    # Don't fail the entire process if file move fails
        
        return data
        
    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return None

def main():
    """Main function with enhanced integration"""
    # Import display for cool terminal output
    from lib.terminal_display import display
    
    parser = argparse.ArgumentParser(description="Enhanced Disclosure RAG Content Processor")
    parser.add_argument("input", nargs="?", help="URL or file path to process")
    parser.add_argument("--upload", action="store_true", help="Upload to OpenAI vector store")
    parser.add_argument("--no-kb", action="store_true", help="Skip adding to knowledge base")
    parser.add_argument("--status", action="store_true", help="Show integration status")
    
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
        
        if not status['search_sync']:
            print(f"\n💡 To enable Search sync, set environment variables:")
            print(f"   export UPSTASH_SEARCH_URL=your_url")
            print(f"   export UPSTASH_SEARCH_TOKEN=your_token")
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
    else:
        print(f"\n❌ Processing failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()