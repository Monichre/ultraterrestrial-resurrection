#!/usr/bin/env python3
"""
Hybrid Vector Storage Manager
Combines local document ownership with multiple vector storage backends
"""

import json
import hashlib
import sqlite3
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
import shutil
import os
from dataclasses import dataclass, asdict
from enum import Enum

@dataclass
class DocumentMetadata:
    """Complete metadata for stored documents"""
    doc_id: str
    title: str
    source_url: Optional[str]
    file_path: str
    content_hash: str
    content_type: str  # 'text', 'pdf', 'web', 'transcript'
    word_count: int
    char_count: int
    extraction_date: str
    tags: List[str]
    entities: Dict[str, Any]
    summary: str
    vector_store_ids: Dict[str, str]  # backend_name -> vector_id
    processed_versions: List[str]  # Different processing pipelines
    confidence_score: float

class VectorBackend(Enum):
    OPENAI = "openai"
    CHROMA = "chroma" 
    PINECONE = "pinecone"
    LOCAL_FAISS = "local_faiss"

class HybridVectorManager:
    """
    Unified document and vector storage manager
    - Local document storage with full ownership
    - Multiple vector backend support
    - Complete metadata tracking
    - Source document preservation
    """
    
    def __init__(self, storage_dir: str = "./document_library"):
        self.storage_dir = Path(storage_dir)
        self.documents_dir = self.storage_dir / "documents"
        self.metadata_dir = self.storage_dir / "metadata"
        self.vectors_dir = self.storage_dir / "vectors"
        self.db_path = self.storage_dir / "library.db"
        
        # Create directory structure
        for dir_path in [self.documents_dir, self.metadata_dir, self.vectors_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize SQLite database
        self._init_database()
        
        # Vector backends (initialize based on available configs)
        self.backends = {}
        self._init_backends()
    
    def _init_database(self):
        """Initialize SQLite database for metadata"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    doc_id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    source_url TEXT,
                    file_path TEXT NOT NULL,
                    content_hash TEXT UNIQUE NOT NULL,
                    content_type TEXT NOT NULL,
                    word_count INTEGER,
                    char_count INTEGER,
                    extraction_date TEXT,
                    tags TEXT,  -- JSON array
                    entities TEXT,  -- JSON object
                    summary TEXT,
                    vector_store_ids TEXT,  -- JSON object
                    processed_versions TEXT,  -- JSON array
                    confidence_score REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS tags (
                    tag_name TEXT PRIMARY KEY,
                    doc_count INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS processing_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    doc_id TEXT,
                    processing_type TEXT,
                    processor_version TEXT,
                    results TEXT,  -- JSON
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (doc_id) REFERENCES documents (doc_id)
                )
            """)
    
    def _init_backends(self):
        """Initialize available vector storage backends"""
        # OpenAI (if API key available)
        if os.getenv("OPENAI_API_KEY"):
            from .backends.openai_backend import OpenAIVectorBackend
            self.backends[VectorBackend.OPENAI] = OpenAIVectorBackend()
        
        # Chroma (local by default)
        try:
            from .backends.chroma_backend import ChromaVectorBackend
            self.backends[VectorBackend.CHROMA] = ChromaVectorBackend(
                persist_directory=str(self.vectors_dir / "chroma")
            )
        except ImportError:
            pass
        
        # FAISS (local fallback)
        try:
            from .backends.faiss_backend import FAISSVectorBackend
            self.backends[VectorBackend.LOCAL_FAISS] = FAISSVectorBackend(
                index_path=str(self.vectors_dir / "faiss")
            )
        except ImportError:
            pass
    
    def add_document(self, 
                    content: str,
                    title: str,
                    source_url: Optional[str] = None,
                    content_type: str = "text",
                    tags: List[str] = None,
                    force_reprocess: bool = False) -> DocumentMetadata:
        """
        Add document to hybrid storage system
        1. Store document locally with full content
        2. Generate metadata and entities
        3. Store in multiple vector backends
        4. Track everything in SQLite
        """
        
        # Generate content hash for deduplication
        content_hash = hashlib.sha256(content.encode()).hexdigest()
        
        # Check if document already exists
        if not force_reprocess:
            existing = self._get_document_by_hash(content_hash)
            if existing:
                print(f"Document already exists: {existing.title}")
                return existing
        
        # Generate unique document ID
        doc_id = f"doc_{int(datetime.now().timestamp())}_{content_hash[:8]}"
        
        # Store document content locally
        file_path = self._store_document_content(doc_id, content, content_type)
        
        # Extract entities (using your existing NER)
        entities = self._extract_entities(content)
        
        # Generate summary
        summary = self._generate_summary(content)
        
        # Calculate metrics
        word_count = len(content.split())
        char_count = len(content)
        
        # Store in vector backends
        vector_store_ids = {}
        for backend_type, backend in self.backends.items():
            try:
                vector_id = backend.add_document(doc_id, content, {
                    'title': title,
                    'source_url': source_url,
                    'tags': tags or []
                })
                vector_store_ids[backend_type.value] = vector_id
            except Exception as e:
                print(f"Failed to store in {backend_type.value}: {e}")
        
        # Create metadata object
        metadata = DocumentMetadata(
            doc_id=doc_id,
            title=title,
            source_url=source_url,
            file_path=str(file_path),
            content_hash=content_hash,
            content_type=content_type,
            word_count=word_count,
            char_count=char_count,
            extraction_date=datetime.now().isoformat(),
            tags=tags or [],
            entities=entities,
            summary=summary,
            vector_store_ids=vector_store_ids,
            processed_versions=["v1.0"],
            confidence_score=0.85  # Could be calculated from entities
        )
        
        # Store metadata in database
        self._store_metadata(metadata)
        
        # Store detailed metadata as JSON
        metadata_path = self.metadata_dir / f"{doc_id}.json"
        with open(metadata_path, 'w') as f:
            json.dump(asdict(metadata), f, indent=2)
        
        return metadata
    
    def search_documents(self, 
                        query: str,
                        backend: VectorBackend = VectorBackend.CHROMA,
                        limit: int = 10,
                        filters: Dict[str, Any] = None) -> List[DocumentMetadata]:
        """Search documents using specified vector backend"""
        
        if backend not in self.backends:
            # Fallback to available backend
            backend = list(self.backends.keys())[0]
        
        # Get vector search results
        vector_results = self.backends[backend].search(query, limit, filters)
        
        # Enrich with full metadata
        results = []
        for result in vector_results:
            doc_id = result.get('doc_id')
            metadata = self._get_document_by_id(doc_id)
            if metadata:
                results.append(metadata)
        
        return results
    
    def get_document_content(self, doc_id: str) -> Optional[str]:
        """Retrieve full document content by ID"""
        metadata = self._get_document_by_id(doc_id)
        if not metadata:
            return None
        
        try:
            with open(metadata.file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error reading document {doc_id}: {e}")
            return None
    
    def migrate_from_openai(self, vector_store_id: str):
        """
        Migrate documents from OpenAI vector store to hybrid system
        Note: This is limited by OpenAI's API - you can't retrieve original content
        """
        print("⚠️  OpenAI migration is limited - original content cannot be retrieved")
        print("Only file metadata and vectors can be migrated")
        
        # This would require manual re-uploading of source documents
        # or using the file IDs to download if they're still available
        
    def consolidate_libraries(self, source_dirs: List[str]):
        """
        Consolidate multiple document libraries into the hybrid system
        """
        print(f"🔄 Consolidating {len(source_dirs)} libraries...")
        
        for source_dir in source_dirs:
            source_path = Path(source_dir)
            if not source_path.exists():
                print(f"⚠️  Source directory not found: {source_dir}")
                continue
            
            # Process all files in source directory
            for file_path in source_path.rglob("*"):
                if file_path.is_file() and file_path.suffix in ['.txt', '.md', '.pdf']:
                    try:
                        content = self._read_file_content(file_path)
                        if content:
                            self.add_document(
                                content=content,
                                title=file_path.stem,
                                source_url=f"file://{file_path}",
                                content_type=file_path.suffix[1:],
                                tags=[source_path.name]  # Tag with source library
                            )
                            print(f"✅ Processed: {file_path.name}")
                    except Exception as e:
                        print(f"❌ Failed to process {file_path}: {e}")
    
    def get_library_stats(self) -> Dict[str, Any]:
        """Get comprehensive library statistics"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Total documents
            cursor.execute("SELECT COUNT(*) FROM documents")
            total_docs = cursor.fetchone()[0]
            
            # Documents by type
            cursor.execute("SELECT content_type, COUNT(*) FROM documents GROUP BY content_type")
            by_type = dict(cursor.fetchall())
            
            # Total words and characters
            cursor.execute("SELECT SUM(word_count), SUM(char_count) FROM documents")
            total_words, total_chars = cursor.fetchone()
            
            # Most common tags
            cursor.execute("""
                SELECT tag_name, doc_count FROM tags 
                ORDER BY doc_count DESC LIMIT 10
            """)
            top_tags = dict(cursor.fetchall())
            
            # Backend distribution
            cursor.execute("SELECT vector_store_ids FROM documents")
            backend_counts = {}
            for (vector_ids_json,) in cursor.fetchall():
                vector_ids = json.loads(vector_ids_json)
                for backend in vector_ids.keys():
                    backend_counts[backend] = backend_counts.get(backend, 0) + 1
            
            return {
                'total_documents': total_docs,
                'by_content_type': by_type,
                'total_words': total_words or 0,
                'total_characters': total_chars or 0,
                'top_tags': top_tags,
                'vector_backends': backend_counts,
                'storage_size_mb': self._get_storage_size()
            }
    
    def _store_document_content(self, doc_id: str, content: str, content_type: str) -> Path:
        """Store document content locally"""
        file_extension = {'text': 'txt', 'pdf': 'pdf', 'web': 'html', 'transcript': 'txt'}.get(content_type, 'txt')
        file_path = self.documents_dir / f"{doc_id}.{file_extension}"
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return file_path
    
    def _extract_entities(self, content: str) -> Dict[str, Any]:
        """Extract entities using existing NER system"""
        try:
            from ..agents.entity_extraction_agent import EntityExtractionAgent
            agent = EntityExtractionAgent()
            return agent.extract_entities(content)
        except Exception as e:
            print(f"Entity extraction failed: {e}")
            return {}
    
    def _generate_summary(self, content: str) -> str:
        """Generate document summary"""
        # Simple extractive summary for now
        sentences = content.split('. ')
        if len(sentences) <= 3:
            return content[:200] + "..." if len(content) > 200 else content
        
        # Take first and last sentences, plus one from middle
        summary_sentences = [
            sentences[0],
            sentences[len(sentences)//2],
            sentences[-1]
        ]
        return '. '.join(summary_sentences)
    
    def _store_metadata(self, metadata: DocumentMetadata):
        """Store metadata in SQLite database"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO documents VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                metadata.doc_id,
                metadata.title,
                metadata.source_url,
                metadata.file_path,
                metadata.content_hash,
                metadata.content_type,
                metadata.word_count,
                metadata.char_count,
                metadata.extraction_date,
                json.dumps(metadata.tags),
                json.dumps(metadata.entities),
                metadata.summary,
                json.dumps(metadata.vector_store_ids),
                json.dumps(metadata.processed_versions),
                metadata.confidence_score
            ))
            
            # Update tag counts
            for tag in metadata.tags:
                conn.execute("""
                    INSERT OR REPLACE INTO tags (tag_name, doc_count) 
                    VALUES (?, COALESCE((SELECT doc_count FROM tags WHERE tag_name = ?), 0) + 1)
                """, (tag, tag))
    
    def _get_document_by_hash(self, content_hash: str) -> Optional[DocumentMetadata]:
        """Retrieve document by content hash"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM documents WHERE content_hash = ?", (content_hash,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_metadata(row)
        return None
    
    def _get_document_by_id(self, doc_id: str) -> Optional[DocumentMetadata]:
        """Retrieve document by ID"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM documents WHERE doc_id = ?", (doc_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_metadata(row)
        return None
    
    def _row_to_metadata(self, row) -> DocumentMetadata:
        """Convert database row to DocumentMetadata"""
        return DocumentMetadata(
            doc_id=row[0],
            title=row[1],
            source_url=row[2],
            file_path=row[3],
            content_hash=row[4],
            content_type=row[5],
            word_count=row[6] or 0,
            char_count=row[7] or 0,
            extraction_date=row[8],
            tags=json.loads(row[9]) if row[9] else [],
            entities=json.loads(row[10]) if row[10] else {},
            summary=row[11] or "",
            vector_store_ids=json.loads(row[12]) if row[12] else {},
            processed_versions=json.loads(row[13]) if row[13] else [],
            confidence_score=row[14] or 0.0
        )
    
    def _read_file_content(self, file_path: Path) -> Optional[str]:
        """Read content from various file types"""
        try:
            if file_path.suffix.lower() == '.pdf':
                # Would need PyPDF2 or similar
                return f"PDF file: {file_path.name} (content extraction needed)"
            else:
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None
    
    def _get_storage_size(self) -> float:
        """Calculate total storage size in MB"""
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(self.storage_dir):
            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
                total_size += os.path.getsize(file_path)
        return total_size / (1024 * 1024)  # Convert to MB


def create_example_usage():
    """Example of how to use the Hybrid Vector Manager"""
    
    # Initialize the manager
    manager = HybridVectorManager("./unified_library")
    
    # Add a document
    sample_content = """
    Pentagon Official Confirms Alien Language Exists - Lue Elizondo discusses 
    underwater UAP activity with large black disc-shaped craft observed moving 
    450-550 knots underwater. The Department of Defense investigation continues.
    """
    
    metadata = manager.add_document(
        content=sample_content,
        title="Pentagon UAP Confirmation",
        source_url="https://example.com/uap-news",
        content_type="web",
        tags=["pentagon", "elizondo", "underwater", "disclosure"]
    )
    
    print(f"Document added: {metadata.doc_id}")
    
    # Search documents
    results = manager.search_documents("underwater UAP activity")
    print(f"Search results: {len(results)} documents found")
    
    # Get library statistics
    stats = manager.get_library_stats()
    print(f"Library stats: {stats}")
    
    # Consolidate existing libraries
    # manager.consolidate_libraries([
    #     "/path/to/old/library1",
    #     "/path/to/old/library2"
    # ])


if __name__ == "__main__":
    create_example_usage()