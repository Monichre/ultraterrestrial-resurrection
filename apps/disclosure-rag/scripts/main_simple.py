#!/usr/bin/env python3
"""
Simplified Disclosure RAG main entry point
Only does what's needed: extract, save locally, upload to OpenAI
"""

from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD
from lib.openai_client.upload import upload_file_to_openai
from processing.document_converter import convert_pdf_to_markdown
from processing.web_content_processor import WebContentProcessor
from lib.youtube import generate_transcript
import argparse
import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import only what we need

# Simple initialization
web_processor = WebContentProcessor()
kb_crud = KnowledgeBaseCRUD()

# Optional backup vector store (only if enabled)
backup_vector = None
if os.getenv('ENABLE_BACKUP_VECTOR', 'false').lower() == 'true':
    try:
        from lib.simple_backup_vector import SimpleBackupVector
        backup_vector = SimpleBackupVector()
        logger.info("Backup vector store enabled")
    except Exception as e:
        logger.warning(f"Could not initialize backup vector store: {e}")


def process_content(input_path: str, upload_to_openai: bool = False) -> Optional[Dict[str, Any]]:
    """
    Simple content processing: extract, save to local KB, optionally upload to OpenAI
    """
    try:
        result = {}

        # 1. EXTRACT CONTENT
        if input_path.startswith(('http://', 'https://')):
            if 'youtube.com' in input_path or 'youtu.be' in input_path:
                # YouTube processing
                logger.info(f"Processing YouTube URL: {input_path}")
                file_paths = generate_transcript(input_path)

                if not file_paths:
                    logger.error("Failed to generate transcript")
                    return None

                # Read the generated files
                content = ""
                metadata = {}
                if 'file_path' in file_paths and os.path.exists(file_paths['file_path']):
                    with open(file_paths['file_path'], 'r', encoding='utf-8') as f:
                        content = f.read()

                if 'metadata_path' in file_paths and os.path.exists(file_paths['metadata_path']):
                    with open(file_paths['metadata_path'], 'r', encoding='utf-8') as f:
                        metadata = json.load(f)

                result = {
                    'content': content,
                    'title': metadata.get('title', 'YouTube Video'),
                    'source': input_path,
                    'metadata': metadata,
                    'file_paths': file_paths,
                    'doc_type': 'transcript'
                }
            else:
                # Web processing
                logger.info(f"Processing web URL: {input_path}")
                web_result = web_processor.process_url(input_path)

                if not web_result:
                    logger.error("Failed to process web content")
                    return None

                result = {
                    'content': web_result.get('content', ''),
                    'title': web_result.get('title', 'Web Article'),
                    'source': input_path,
                    'metadata': web_result.get('metadata', {}),
                    'doc_type': 'article'
                }
        else:
            # File processing
            logger.info(f"Processing file: {input_path}")
            if input_path.lower().endswith('.pdf'):
                content = convert_pdf_to_markdown(input_path)
                doc_type = 'pdf'
            else:
                with open(input_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                doc_type = 'document'

            result = {
                'content': content,
                'title': os.path.basename(input_path),
                'source': f"file://{input_path}",
                'metadata': {
                    'file_path': input_path,
                    'file_size': os.path.getsize(input_path)
                },
                'doc_type': doc_type
            }

        # 2. SAVE TO LOCAL KNOWLEDGE BASE
        logger.info("Saving to local knowledge base...")
        doc_id = kb_crud.add_document(
            title=result['title'],
            content=result['content'],
            source=result['source'],
            doc_type=result['doc_type'],
            metadata=result['metadata']
        )
        result['doc_id'] = doc_id
        logger.info(f"Saved to knowledge base with ID: {doc_id}")

        # 3. UPLOAD TO OPENAI (if requested)
        if upload_to_openai:
            logger.info("Uploading to OpenAI vector store...")

            # Create a temporary file for upload if needed
            if 'file_paths' in result:
                # Use existing files for YouTube
                upload_files = result['file_paths']
            else:
                # Create temp file for web/document content
                temp_file = Path(f"/tmp/{doc_id}.md")
                with open(temp_file, 'w', encoding='utf-8') as f:
                    f.write(f"# {result['title']}\n\n")
                    f.write(f"Source: {result['source']}\n\n")
                    f.write(result['content'])
                upload_files = {'content': str(temp_file)}

            upload_results = {}
            for file_type, file_path in upload_files.items():
                if os.path.exists(file_path):
                    upload_result = upload_file_to_openai(file_path)
                    upload_results[file_type] = upload_result

                    if isinstance(upload_result, dict) and 'file_id' in upload_result:
                        logger.info(
                            f"Uploaded {file_type} to OpenAI: {upload_result['file_id']}")
                    else:
                        logger.error(f"Failed to upload {file_type} to OpenAI")

            result['upload_results'] = upload_results

            # Clean up temp file if created
            if 'temp_file' in locals():
                temp_file.unlink(missing_ok=True)

        # 4. OPTIONAL: Add to backup vector store
        if backup_vector:
            logger.info("Adding to backup vector store...")
            success = backup_vector.add_document(
                doc_id=doc_id,
                content=result['content'],
                title=result['title'],
                source=result['source']
            )
            if success:
                logger.info("Added to backup vector store")
                result['backup_vector'] = True
            else:
                logger.warning("Failed to add to backup vector store")

        return result

    except Exception as e:
        logger.error(f"Error processing content: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(
        description="Simplified Disclosure RAG - Extract, Store, Upload",
        epilog="""
Examples:
  # Process YouTube video
  python main_simple.py "https://youtube.com/watch?v=..."
  
  # Process and upload to OpenAI
  python main_simple.py "https://example.com/article" --upload
  
  # Process local file
  python main_simple.py /path/to/document.pdf
  
Environment Variables:
  ENABLE_BACKUP_VECTOR=true  # Enable backup vector store (default: false)
        """
    )

    parser.add_argument('input', help="URL or file path to process")
    parser.add_argument('--upload', action='store_true',
                        help="Upload to OpenAI vector store after processing")

    args = parser.parse_args()

    # Process the content
    result = process_content(args.input, args.upload)

    if result:
        print(f"\n✅ Processing complete!")
        print(f"   Title: {result.get('title', 'Unknown')}")
        print(f"   Source: {result.get('source', 'Unknown')}")
        print(f"   Doc ID: {result.get('doc_id', 'Unknown')}")

        if args.upload and 'upload_results' in result:
            print(f"   OpenAI Upload: ✅")
            for file_type, upload_result in result['upload_results'].items():
                if isinstance(upload_result, dict) and 'file_id' in upload_result:
                    print(f"     - {file_type}: {upload_result['file_id']}")

        if result.get('backup_vector'):
            print(f"   Backup Vector: ✅")
    else:
        print(f"\n❌ Processing failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()
