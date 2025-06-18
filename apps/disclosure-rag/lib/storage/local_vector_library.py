#!/usr/bin/env python3
"""
Local Vector Library - Complete Data Ownership
Local-first document storage with vector search capabilities
"""

import json
import sqlite3
import hashlib
import shutil
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import numpy as np
from dataclasses import dataclass, asdict
import pickle
import zipfile

# Local vector storage options
try:
    import chromadb
    from chromadb.config import Settings
    HAS_CHROMA = True
except ImportError:
    HAS_CHROMA = False

try:
    import faiss
    HAS_FAISS = True
except ImportError:
    HAS_FAISS = False

@dataclass
class LocalDocument:
    """Local document with full metadata"""
    doc_id: str
    title: str
    source_url: Optional[str]
    file_path: str
    content: str  # Full content stored locally
    content_hash: str
    content_type: str
    word_count: int
    extraction_date: str
    tags: List[str]
    entities: Dict[str, Any]
    summary: str
    vector_id: Optional[str]
    confidence_score: float
    processing_notes: str

class LocalVectorLibrary:
    """
    Complete local document and vector storage
    - SQLite for metadata and relationships
    - Local file storage for all documents
    - Chroma/FAISS for vector search (both local)
    - No external dependencies or API calls
    - Complete data ownership
    """
    
    def __init__(self, library_dir: str = "./local_library"):
        self.library_dir = Path(library_dir)
        self.docs_dir = self.library_dir / "documents"
        self.metadata_dir = self.library_dir / "metadata" 
        self.vectors_dir = self.library_dir / "vectors"
        self.exports_dir = self.library_dir / "exports"
        self.db_path = self.library_dir / "library.db"
        
        # Create structure
        for dir_path in [self.docs_dir, self.metadata_dir, self.vectors_dir, self.exports_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize database
        self._init_database()
        
        # Initialize vector storage
        self.vector_store = self._init_vector_store()
        
        print(f"📚 Local Library initialized: {self.library_dir}")
        print(f"🔍 Vector backend: {'Chroma' if HAS_CHROMA else 'FAISS' if HAS_FAISS else 'Simple'}")
    
    def _init_database(self):
        """Initialize SQLite database"""
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
                    extraction_date TEXT,
                    tags TEXT,
                    entities TEXT,
                    summary TEXT,
                    vector_id TEXT,
                    confidence_score REAL,
                    processing_notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Tags table for fast tag queries
            conn.execute("""
                CREATE TABLE IF NOT EXISTS tags (
                    tag_name TEXT PRIMARY KEY,
                    doc_count INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Document relationships
            conn.execute("""
                CREATE TABLE IF NOT EXISTS document_relationships (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    doc_id1 TEXT,
                    doc_id2 TEXT,
                    relationship_type TEXT,
                    confidence REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (doc_id1) REFERENCES documents (doc_id),
                    FOREIGN KEY (doc_id2) REFERENCES documents (doc_id)
                )
            """)
            
            # Search history
            conn.execute("""
                CREATE TABLE IF NOT EXISTS search_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    query TEXT,
                    results_count INTEGER,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
    
    def _init_vector_store(self):
        """Initialize local vector storage"""
        if HAS_CHROMA:
            # Use Chroma for local vector storage
            settings = Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory=str(self.vectors_dir / "chroma")
            )
            client = chromadb.Client(settings)
            collection = client.get_or_create_collection(
                name="documents",
                metadata={"hnsw:space": "cosine"}
            )
            return {"type": "chroma", "client": client, "collection": collection}
        
        elif HAS_FAISS:
            # Use FAISS for local vector storage
            index_path = self.vectors_dir / "faiss_index.idx"
            if index_path.exists():
                index = faiss.read_index(str(index_path))
            else:
                # Initialize with 384 dimensions (sentence-transformers default)
                index = faiss.IndexFlatIP(384)
            return {"type": "faiss", "index": index, "index_path": str(index_path)}
        
        else:
            # Simple in-memory storage as fallback
            return {"type": "simple", "vectors": {}, "metadata": {}}
    
    def add_document(self, 
                    content: str,
                    title: str,
                    source_url: Optional[str] = None,
                    content_type: str = "text",
                    tags: List[str] = None,
                    auto_extract: bool = True) -> LocalDocument:
        """Add document to local library with full content preservation"""
        
        # Generate hash for deduplication
        content_hash = hashlib.sha256(content.encode()).hexdigest()
        
        # Check for duplicates
        existing = self._get_document_by_hash(content_hash)
        if existing:
            print(f"📄 Document already exists: {existing.title}")
            return existing
        
        # Generate document ID
        doc_id = f"doc_{int(datetime.now().timestamp())}_{content_hash[:8]}"
        
        # Store content locally
        file_path = self._store_content_locally(doc_id, content, content_type)
        
        # Extract entities if requested
        entities = {}
        processing_notes = ""
        if auto_extract:
            try:
                entities = self._extract_entities_local(content)
                processing_notes = f"Auto-extracted {len(entities)} entity categories"
            except Exception as e:
                processing_notes = f"Entity extraction failed: {e}"
        
        # Generate summary
        summary = self._generate_summary_local(content)
        
        # Add to vector store
        vector_id = self._add_to_vector_store(doc_id, content, title)
        
        # Create document object
        document = LocalDocument(
            doc_id=doc_id,
            title=title,
            source_url=source_url,
            file_path=str(file_path),
            content=content,
            content_hash=content_hash,
            content_type=content_type,
            word_count=len(content.split()),
            extraction_date=datetime.now().isoformat(),
            tags=tags or [],
            entities=entities,
            summary=summary,
            vector_id=vector_id,
            confidence_score=0.85,
            processing_notes=processing_notes
        )
        
        # Store in database
        self._store_in_database(document)
        
        # Store detailed metadata
        self._store_metadata_file(document)
        
        # Update tag counts
        self._update_tag_counts(tags or [])
        
        print(f"✅ Added: {title} ({len(content.split())} words)")
        return document
    
    def search_documents(self, 
                        query: str, 
                        limit: int = 10,
                        filters: Dict[str, Any] = None) -> List[LocalDocument]:
        """Search documents using local vector storage"""
        
        # Log search
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("INSERT INTO search_history (query, results_count) VALUES (?, ?)", (query, 0))
        
        # Vector search
        similar_docs = self._vector_search(query, limit * 2)  # Get extra for filtering
        
        # Apply filters if provided
        if filters:
            similar_docs = self._apply_filters(similar_docs, filters)
        
        # Limit results
        results = similar_docs[:limit]
        
        # Update search history with actual count
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE search_history SET results_count = ? WHERE id = (SELECT MAX(id) FROM search_history)",
                (len(results),)
            )
        
        return results
    
    def get_document(self, doc_id: str) -> Optional[LocalDocument]:
        """Get document by ID with full content"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM documents WHERE doc_id = ?", (doc_id,))
            row = cursor.fetchone()
            
            if row:
                # Load content from file
                file_path = row[3]
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception as e:
                    print(f"Error reading content for {doc_id}: {e}")
                    content = ""
                
                return LocalDocument(
                    doc_id=row[0],
                    title=row[1],
                    source_url=row[2],
                    file_path=row[3],
                    content=content,
                    content_hash=row[4],
                    content_type=row[5],
                    word_count=row[6] or 0,
                    extraction_date=row[7],
                    tags=json.loads(row[8]) if row[8] else [],
                    entities=json.loads(row[9]) if row[9] else {},
                    summary=row[10] or "",
                    vector_id=row[11],
                    confidence_score=row[12] or 0.0,
                    processing_notes=row[13] or ""
                )
        return None
    
    def consolidate_libraries(self, source_paths: List[str]):
        """Consolidate multiple libraries into this one"""
        print(f"🔄 Consolidating {len(source_paths)} libraries...")
        
        consolidated_count = 0
        for source_path in source_paths:
            source = Path(source_path)
            if not source.exists():
                print(f"⚠️  Path not found: {source_path}")
                continue
            
            # Process directory
            for file_path in source.rglob("*"):
                if file_path.is_file() and file_path.suffix.lower() in ['.txt', '.md', '.json', '.html']:
                    try:
                        content = self._read_file_safely(file_path)
                        if content and len(content.strip()) > 50:  # Minimum content length
                            
                            # Determine content type and tags
                            content_type = self._detect_content_type(file_path, content)
                            tags = [source.name, content_type]
                            
                            # Add to library
                            self.add_document(
                                content=content,
                                title=file_path.stem,
                                source_url=f"file://{file_path}",
                                content_type=content_type,
                                tags=tags
                            )
                            consolidated_count += 1
                            
                    except Exception as e:
                        print(f"❌ Failed to process {file_path}: {e}")
        
        print(f"✅ Consolidated {consolidated_count} documents")
        return consolidated_count
    
    def export_library(self, export_path: str, format: str = "zip") -> str:
        """Export entire library with all documents and metadata"""
        
        export_file = Path(export_path)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if format == "zip":
            archive_path = export_file.parent / f"{export_file.stem}_{timestamp}.zip"
            
            with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # Add all files in library
                for file_path in self.library_dir.rglob("*"):
                    if file_path.is_file():
                        zipf.write(file_path, file_path.relative_to(self.library_dir))
            
            print(f"📦 Library exported to: {archive_path}")
            return str(archive_path)
        
        elif format == "json":
            # Export as structured JSON
            export_data = {
                "library_info": self.get_library_stats(),
                "documents": [],
                "export_timestamp": timestamp
            }
            
            # Get all documents
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT doc_id FROM documents")
                doc_ids = [row[0] for row in cursor.fetchall()]
            
            for doc_id in doc_ids:
                doc = self.get_document(doc_id)
                if doc:
                    export_data["documents"].append(asdict(doc))
            
            json_path = export_file.parent / f"{export_file.stem}_{timestamp}.json"
            with open(json_path, 'w') as f:
                json.dump(export_data, f, indent=2)
            
            print(f"📄 Library exported to: {json_path}")
            return str(json_path)
    
    def get_library_stats(self) -> Dict[str, Any]:
        """Get comprehensive library statistics"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Basic counts
            cursor.execute("SELECT COUNT(*) FROM documents")
            total_docs = cursor.fetchone()[0]
            
            cursor.execute("SELECT SUM(word_count) FROM documents")
            total_words = cursor.fetchone()[0] or 0
            
            # Content types
            cursor.execute("SELECT content_type, COUNT(*) FROM documents GROUP BY content_type")
            by_type = dict(cursor.fetchall())
            
            # Top tags
            cursor.execute("SELECT tag_name, doc_count FROM tags ORDER BY doc_count DESC LIMIT 10")
            top_tags = dict(cursor.fetchall())
            
            # Recent activity
            cursor.execute("SELECT COUNT(*) FROM documents WHERE created_at > datetime('now', '-7 days')")
            recent_docs = cursor.fetchone()[0]
            
            # Storage size
            storage_size_mb = sum(f.stat().st_size for f in self.library_dir.rglob('*') if f.is_file()) / (1024 * 1024)
            
            return {
                "total_documents": total_docs,
                "total_words": total_words,
                "content_types": by_type,
                "top_tags": top_tags,
                "recent_additions": recent_docs,
                "storage_size_mb": round(storage_size_mb, 2),
                "vector_backend": self.vector_store["type"],
                "library_path": str(self.library_dir)
            }
    
    def _store_content_locally(self, doc_id: str, content: str, content_type: str) -> Path:
        """Store document content in local file"""
        extensions = {"text": "txt", "web": "html", "pdf": "txt", "transcript": "txt"}
        ext = extensions.get(content_type, "txt")
        
        file_path = self.docs_dir / f"{doc_id}.{ext}"
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return file_path
    
    def _store_metadata_file(self, document: LocalDocument):
        """Store detailed metadata as JSON"""
        metadata_path = self.metadata_dir / f"{document.doc_id}.json"
        
        # Create metadata without content (content is in separate file)
        metadata = asdict(document)
        metadata.pop('content', None)  # Remove content to save space
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
    
    def _extract_entities_local(self, content: str) -> Dict[str, Any]:
        """Local entity extraction (simplified version)"""
        # This could use spaCy, transformers, or your existing Anthropic agent
        # For now, a simple keyword-based approach
        
        ufo_keywords = {
            "personnel": ["elizondo", "mellon", "davis", "puthoff", "bigelow"],
            "organizations": ["pentagon", "nasa", "navy", "air force", "dod"],
            "locations": ["area 51", "nellis", "pentagon", "wright-patterson"],
            "phenomena": ["uap", "ufo", "tic tac", "triangle", "orb"]
        }
        
        entities = {}
        content_lower = content.lower()
        
        for category, keywords in ufo_keywords.items():
            found = []
            for keyword in keywords:
                if keyword in content_lower:
                    found.append({"name": keyword.title(), "confidence": 0.8})
            if found:
                entities[category] = found
        
        return entities
    
    def _generate_summary_local(self, content: str) -> str:
        """Generate simple extractive summary"""
        sentences = content.split('. ')
        if len(sentences) <= 2:
            return content[:300] + "..." if len(content) > 300 else content
        
        # Take first sentence and one from middle
        summary = sentences[0]
        if len(sentences) > 2:
            summary += ". " + sentences[len(sentences)//2]
        
        return summary[:400] + "..." if len(summary) > 400 else summary
    
    def _add_to_vector_store(self, doc_id: str, content: str, title: str) -> Optional[str]:
        """Add document to vector storage"""
        if self.vector_store["type"] == "chroma":
            try:
                collection = self.vector_store["collection"]
                collection.add(
                    documents=[content],
                    metadatas=[{"title": title, "doc_id": doc_id}],
                    ids=[doc_id]
                )
                return doc_id
            except Exception as e:
                print(f"Chroma storage failed: {e}")
                
        elif self.vector_store["type"] == "simple":
            # Simple storage for fallback
            self.vector_store["vectors"][doc_id] = content
            self.vector_store["metadata"][doc_id] = {"title": title}
            return doc_id
        
        return None
    
    def _vector_search(self, query: str, limit: int) -> List[LocalDocument]:
        """Perform vector search"""
        if self.vector_store["type"] == "chroma":
            try:
                collection = self.vector_store["collection"]
                results = collection.query(
                    query_texts=[query],
                    n_results=min(limit, 10)
                )
                
                documents = []
                if results["ids"]:
                    for doc_id in results["ids"][0]:
                        doc = self.get_document(doc_id)
                        if doc:
                            documents.append(doc)
                return documents
                
            except Exception as e:
                print(f"Vector search failed: {e}")
        
        # Fallback to simple text search
        return self._simple_text_search(query, limit)
    
    def _simple_text_search(self, query: str, limit: int) -> List[LocalDocument]:
        """Simple text-based search fallback"""
        query_words = query.lower().split()
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT doc_id FROM documents")
            doc_ids = [row[0] for row in cursor.fetchall()]
        
        scored_docs = []
        for doc_id in doc_ids:
            doc = self.get_document(doc_id)
            if doc:
                content_lower = doc.content.lower()
                score = sum(1 for word in query_words if word in content_lower)
                if score > 0:
                    scored_docs.append((score, doc))
        
        # Sort by score and return top results
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scored_docs[:limit]]
    
    def _store_in_database(self, document: LocalDocument):
        """Store document metadata in SQLite"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO documents VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                document.doc_id,
                document.title,
                document.source_url,
                document.file_path,
                document.content_hash,
                document.content_type,
                document.word_count,
                document.extraction_date,
                json.dumps(document.tags),
                json.dumps(document.entities),
                document.summary,
                document.vector_id,
                document.confidence_score,
                document.processing_notes
            ))
    
    def _update_tag_counts(self, tags: List[str]):
        """Update tag usage counts"""
        with sqlite3.connect(self.db_path) as conn:
            for tag in tags:
                conn.execute("""
                    INSERT OR REPLACE INTO tags (tag_name, doc_count) 
                    VALUES (?, COALESCE((SELECT doc_count FROM tags WHERE tag_name = ?), 0) + 1)
                """, (tag, tag))
    
    def _get_document_by_hash(self, content_hash: str) -> Optional[LocalDocument]:
        """Check if document already exists"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT doc_id FROM documents WHERE content_hash = ?", (content_hash,))
            row = cursor.fetchone()
            if row:
                return self.get_document(row[0])
        return None
    
    def _read_file_safely(self, file_path: Path) -> Optional[str]:
        """Safely read file content with encoding detection"""
        try:
            # Try UTF-8 first
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            try:
                # Try latin-1 as fallback
                with open(file_path, 'r', encoding='latin-1') as f:
                    return f.read()
            except Exception:
                return None
        except Exception:
            return None
    
    def _detect_content_type(self, file_path: Path, content: str) -> str:
        """Detect content type from file and content"""
        if "transcript" in file_path.name.lower():
            return "transcript"
        elif file_path.suffix.lower() in ['.html', '.htm']:
            return "web"
        elif "http" in content[:100]:
            return "web"
        else:
            return "text"
    
    def _apply_filters(self, documents: List[LocalDocument], filters: Dict[str, Any]) -> List[LocalDocument]:
        """Apply filters to document list"""
        filtered = documents
        
        if "tags" in filters:
            required_tags = filters["tags"]
            filtered = [doc for doc in filtered if any(tag in doc.tags for tag in required_tags)]
        
        if "content_type" in filters:
            filtered = [doc for doc in filtered if doc.content_type == filters["content_type"]]
        
        if "min_confidence" in filters:
            filtered = [doc for doc in filtered if doc.confidence_score >= filters["min_confidence"]]
        
        return filtered


def setup_local_library():
    """Set up your local library and consolidate existing data"""
    
    # Initialize library
    library = LocalVectorLibrary("./unified_ufo_library")
    
    # Example: consolidate your existing scattered libraries
    source_libraries = [
        # Add your actual library paths here
        # "./old_library_1",
        # "./transcripts_folder", 
        # "./documents_backup",
        # "./another_collection"
    ]
    
    if source_libraries:
        library.consolidate_libraries(source_libraries)
    
    # Add some sample content
    sample_content = """
    Pentagon Official Confirms Alien Language Exists - In a groundbreaking disclosure, 
    Lue Elizondo discusses underwater UAP activity with large black disc-shaped craft 
    observed moving 450-550 knots underwater near military vessels. The Department of 
    Defense investigation continues with unprecedented transparency.
    """
    
    library.add_document(
        content=sample_content,
        title="Pentagon UAP Underwater Activity Disclosure",
        source_url="https://example.com/pentagon-disclosure",
        content_type="web",
        tags=["pentagon", "elizondo", "underwater", "disclosure", "dod"]
    )
    
    # Show stats
    stats = library.get_library_stats()
    print("\n📊 Library Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Test search
    results = library.search_documents("underwater UAP activity")
    print(f"\n🔍 Search Results: {len(results)} documents found")
    
    return library


if __name__ == "__main__":
    library = setup_local_library()