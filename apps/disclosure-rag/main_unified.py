#!/usr/bin/env python3
"""
Unified Data Ingestion System for Disclosure RAG
Implements the dy command functionality with multi-backend vector storage

Date: January 9, 2025
Author: Disclosure RAG Team

Usage:
  python main_unified.py "https://youtube.com/watch?v=..." [--upload]
  python main_unified.py "https://some-article.com" [--upload]
  python main_unified.py /path/to/document.pdf [--upload]
  
Vector Storage Strategy:
  - Always: Save files locally, store in Upstash, store in PostgreSQL via CocoIndex
  - With --upload: Also upload to OpenAI Vector Store
"""

import argparse
import os
import sys
import json
import logging
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple
import requests
from urllib.parse import urlparse
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import processors
from lib.openai_client.upload import upload_file_to_openai
from processing.web_content_processor import WebContentProcessor
from lib.youtube import (
    generate_transcript,
    parse_file_and_generate_transcript,
    write_transcript_to_file
)
from lib.knowledge_base_crud import KnowledgeBaseCRUD

# Import vector storage backends
from upstash_vector import Index as UpstashIndex
from sentence_transformers import SentenceTransformer
import uuid

# Import CocoIndex for PostgreSQL pgvector operations
try:
    import cocoindex
    from cocoindex.functions import SentenceTransformerEmbed
    COCOINDEX_AVAILABLE = True
    logger.info("CocoIndex service available")
except ImportError:
    COCOINDEX_AVAILABLE = False
    logger.warning("CocoIndex not available - direct PostgreSQL operations will be used")

# Initialize components
web_processor = WebContentProcessor()
kb_crud = KnowledgeBaseCRUD()
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Vector storage configuration
UPSTASH_URL = os.getenv("UPSTASH_VECTOR_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://liamellis@localhost:5432/ultraterrestrial")
COCOINDEX_DATABASE_URL = os.getenv("COCOINDEX_DATABASE_URL", DATABASE_URL)
COCOINDEX_ENABLED = os.getenv("COCOINDEX_ENABLED", "true").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
UFO_DATA_STORE_ID = os.getenv("UFO_DATA_STORE_ID")


class UnifiedVectorStorage:
    """Manages vector storage across multiple backends: Upstash, CocoIndex (PostgreSQL), and OpenAI"""
    
    def __init__(self):
        # Initialize Upstash
        self.upstash = UpstashIndex(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        
        # Initialize CocoIndex client (lazy loading)
        self._cocoindex_client = None
        self.cocoindex_enabled = COCOINDEX_ENABLED and COCOINDEX_AVAILABLE
        
        # Embedding model
        self.model = embedding_model
    
    def _get_cocoindex_client(self):
        """Get CocoIndex client with lazy loading"""
        if self._cocoindex_client is None and self.cocoindex_enabled:
            try:
                self._cocoindex_client = cocoindex.create_client(
                    database_url=COCOINDEX_DATABASE_URL,
                    embedding_function=SentenceTransformerEmbed(model_name='all-MiniLM-L6-v2')
                )
                logger.info("CocoIndex client initialized")
            except Exception as e:
                logger.error(f"Failed to initialize CocoIndex client: {e}")
                self.cocoindex_enabled = False
        return self._cocoindex_client
    
    async def store_document(self, 
                           doc_id: str, 
                           content: str, 
                           metadata: Dict[str, Any],
                           source_type: str,
                           source_url: Optional[str] = None,
                           upload_to_openai: bool = False) -> Dict[str, Any]:
        """Store document across all configured vector backends"""
        
        results = {
            "doc_id": doc_id,
            "timestamp": datetime.now().isoformat(),
            "storage_results": {}
        }
        
        # Generate embeddings
        logger.info(f"Generating embeddings for document {doc_id}")
        embeddings = self.model.encode(content)
        
        # Store in Upstash (Always)
        try:
            logger.info("Storing in Upstash...")
            upstash_result = await self._store_in_upstash(doc_id, embeddings, metadata)
            results["storage_results"]["upstash"] = upstash_result
        except Exception as e:
            logger.error(f"Upstash storage failed: {e}")
            results["storage_results"]["upstash"] = {"success": False, "error": str(e)}
        
        # Store in PostgreSQL via CocoIndex (Always)
        try:
            logger.info("Storing in PostgreSQL via CocoIndex...")
            pg_result = await self._store_in_cocoindex(
                doc_id, content, embeddings, metadata, source_type, source_url
            )
            results["storage_results"]["postgresql"] = pg_result
        except Exception as e:
            logger.error(f"CocoIndex storage failed: {e}")
            results["storage_results"]["postgresql"] = {"success": False, "error": str(e)}
        
        # Store in OpenAI (Conditional)
        if upload_to_openai and OPENAI_API_KEY:
            try:
                logger.info("Uploading to OpenAI...")
                openai_result = await self._upload_to_openai(doc_id, content, metadata)
                results["storage_results"]["openai"] = openai_result
            except Exception as e:
                logger.error(f"OpenAI upload failed: {e}")
                results["storage_results"]["openai"] = {"success": False, "error": str(e)}
        
        return results
    
    async def _store_in_upstash(self, doc_id: str, embeddings: np.ndarray, metadata: Dict) -> Dict:
        """Store in Upstash vector database"""
        vector_data = {
            "id": doc_id,
            "vector": embeddings.tolist(),
            "metadata": metadata
        }
        
        self.upstash.upsert(vectors=[vector_data])
        
        return {
            "success": True,
            "vector_id": doc_id,
            "dimension": len(embeddings)
        }
    
    async def _store_in_cocoindex(self, 
                                 doc_id: str, 
                                 content: str, 
                                 embeddings: np.ndarray,
                                 metadata: Dict,
                                 source_type: str,
                                 source_url: Optional[str]) -> Dict:
        """Store in PostgreSQL via CocoIndex"""
        if not self.cocoindex_enabled:
            return {"success": False, "error": "CocoIndex not enabled or available"}
            
        client = self._get_cocoindex_client()
        if not client:
            return {"success": False, "error": "CocoIndex client not available"}
        
        try:
            # Prepare document metadata for CocoIndex
            document_data = {
                "doc_id": doc_id,
                "content": content,
                "source_type": source_type,
                "source_url": source_url,
                **metadata
            }
            
            # Store document in CocoIndex
            result = client.add_document(
                content=content,
                metadata=document_data,
                doc_id=doc_id
            )
            
            return {
                "success": True,
                "record_id": str(result.get("id", doc_id)),
                "source_type": source_type,
                "cocoindex_result": result
            }
        except Exception as e:
            logger.error(f"CocoIndex storage error: {e}")
            return {"success": False, "error": str(e)}
    
    async def _upload_to_openai(self, doc_id: str, content: str, metadata: Dict) -> Dict:
        """Upload to OpenAI Vector Store"""
        # Create temporary file for OpenAI upload
        temp_file = Path(f"/tmp/{doc_id}.txt")
        temp_file.write_text(content)
        
        try:
            # Use existing OpenAI upload function
            result = upload_file_to_openai(
                str(temp_file),
                UFO_DATA_STORE_ID,
                display_name=metadata.get("title", doc_id)
            )
            
            return {
                "success": result is not None,
                "file_id": result.get("file_id") if result else None
            }
        finally:
            # Clean up temp file
            if temp_file.exists():
                temp_file.unlink()


async def process_youtube_unified(url: str, upload_to_openai: bool = False) -> Dict[str, Any]:
    """Process YouTube video with unified storage"""
    logger.info(f"Processing YouTube URL: {url}")
    
    # Generate transcript
    transcript_data = generate_transcript(url)
    if not transcript_data:
        raise ValueError("Failed to generate transcript")
    
    # Write transcript files locally
    file_paths = write_transcript_to_file(transcript_data)
    
    # Extract metadata
    video_id = transcript_data.get("video_id", "")
    title = transcript_data.get("title", "Unknown")
    metadata = {
        "title": title,
        "video_id": video_id,
        "url": url,
        "duration": transcript_data.get("duration"),
        "author": transcript_data.get("author"),
        "publish_date": transcript_data.get("publish_date"),
        "type": "youtube_transcript"
    }
    
    # Get transcript content
    transcript_content = transcript_data.get("transcript", "")
    summary_content = transcript_data.get("summary", "")
    
    # Create doc_id
    doc_id = f"youtube_{video_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Store in vector databases
    storage = UnifiedVectorStorage()
    
    # Store transcript
    transcript_result = await storage.store_document(
        doc_id=f"{doc_id}_transcript",
        content=transcript_content,
        metadata=metadata,
        source_type="youtube_transcript",
        source_url=url,
        upload_to_openai=upload_to_openai
    )
    
    # Store summary
    summary_result = await storage.store_document(
        doc_id=f"{doc_id}_summary",
        content=summary_content,
        metadata={**metadata, "type": "youtube_summary"},
        source_type="youtube_summary",
        source_url=url,
        upload_to_openai=upload_to_openai
    )
    
    # Add to knowledge base
    kb_crud.create_document(
        title=title,
        content=transcript_content,
        source=url,
        doc_type="transcript",
        metadata=metadata,
        tags=["youtube", "transcript", video_id]
    )
    
    return {
        "success": True,
        "video_id": video_id,
        "title": title,
        "file_paths": file_paths,
        "storage_results": {
            "transcript": transcript_result,
            "summary": summary_result
        }
    }


async def process_web_unified(url: str, upload_to_openai: bool = False) -> Dict[str, Any]:
    """Process web article with unified storage"""
    logger.info(f"Processing web URL: {url}")
    
    # Extract content
    content_data = web_processor.process_url(url)
    if not content_data:
        raise ValueError("Failed to extract web content")
    
    # Extract metadata
    title = content_data.get("title", "Unknown")
    content = content_data.get("content", "")
    metadata = {
        "title": title,
        "url": url,
        "author": content_data.get("author"),
        "publish_date": content_data.get("publish_date"),
        "type": "web_article"
    }
    
    # Create doc_id
    doc_id = f"web_{urlparse(url).netloc}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Store in vector databases
    storage = UnifiedVectorStorage()
    result = await storage.store_document(
        doc_id=doc_id,
        content=content,
        metadata=metadata,
        source_type="web_article",
        source_url=url,
        upload_to_openai=upload_to_openai
    )
    
    # Save to knowledge base
    kb_crud.create_document(
        title=title,
        content=content,
        source=url,
        doc_type="article",
        metadata=metadata,
        tags=["web", "article", urlparse(url).netloc]
    )
    
    # Save file locally
    file_path = Path(kb_crud.articles_path) / f"{doc_id}.txt"
    file_path.write_text(content)
    
    return {
        "success": True,
        "title": title,
        "doc_id": doc_id,
        "file_path": str(file_path),
        "storage_results": result.get("storage_results", result) if isinstance(result, dict) else result
    }


async def process_file_unified(file_path: str, upload_to_openai: bool = False) -> Dict[str, Any]:
    """Process local file with unified storage"""
    logger.info(f"Processing file: {file_path}")
    
    file_path = Path(file_path)
    if not file_path.exists():
        raise ValueError(f"File not found: {file_path}")
    
    # Extract content based on file type
    content = file_path.read_text()
    
    metadata = {
        "title": file_path.stem,
        "filename": file_path.name,
        "type": "document",
        "file_type": file_path.suffix
    }
    
    # Create doc_id
    doc_id = f"doc_{file_path.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Store in vector databases
    storage = UnifiedVectorStorage()
    result = await storage.store_document(
        doc_id=doc_id,
        content=content,
        metadata=metadata,
        source_type="document",
        source_url=None,
        upload_to_openai=upload_to_openai
    )
    
    # Add to knowledge base
    kb_crud.create_document(
        title=file_path.stem,
        content=content,
        source=str(file_path),
        doc_type="document",
        metadata=metadata,
        tags=["document", file_path.suffix.lstrip(".")]
    )
    
    return {
        "success": True,
        "doc_id": doc_id,
        "file_path": str(file_path),
        "storage_results": result.get("storage_results", result) if isinstance(result, dict) else result
    }


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube video"""
    return any(domain in url.lower() for domain in ['youtube.com', 'youtu.be'])


def is_url(text: str) -> bool:
    """Check if text is a URL"""
    return text.startswith(('http://', 'https://'))


async def main():
    """Main entry point for unified data ingestion"""
    parser = argparse.ArgumentParser(
        description="Unified data ingestion for Disclosure RAG (dy command)"
    )
    parser.add_argument("input", help="URL or file path to process")
    parser.add_argument(
        "--upload", 
        action="store_true", 
        help="Upload to OpenAI Vector Store"
    )
    
    args = parser.parse_args()
    
    try:
        if is_url(args.input):
            if is_youtube_url(args.input):
                result = await process_youtube_unified(args.input, args.upload)
            else:
                result = await process_web_unified(args.input, args.upload)
        else:
            result = await process_file_unified(args.input, args.upload)
        
        # Display results
        print("\n✅ Processing complete!")
        print(f"Document ID: {result.get('doc_id', 'N/A')}")
        
        if 'storage_results' in result:
            print("\nStorage Results:")
            storage = result['storage_results']
            
            # Handle nested results for YouTube
            if 'transcript' in storage:
                storage = storage['transcript']['storage_results']
            
            for backend, status in storage.items():
                success = status.get('success', False)
                icon = "✅" if success else "❌"
                print(f"  {icon} {backend}: {'Success' if success else status.get('error', 'Failed')}")
        
        return 0
        
    except Exception as e:
        logger.error(f"Processing failed: {e}")
        print(f"\n❌ Error: {e}")
        return 1


if __name__ == "__main__":
    # Run async main
    exit_code = asyncio.run(main())
    sys.exit(exit_code)