"""
Enhanced Knowledge Base CRUD Operations
Provides Create, Read, Update, Delete functionality for the knowledge base
"""

import os
import json
import shutil
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any, Union, Tuple
from datetime import datetime
import hashlib
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)

@dataclass
class Document:
    """Document model for the knowledge base"""
    id: str
    title: str
    content: str
    source: str
    doc_type: str  # 'case_file', 'transcript', 'article', 'research'
    created_at: str
    updated_at: str
    metadata: Dict[str, Any]
    tags: List[str]
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        return cls(**data)

class KnowledgeBaseCRUD:
    """Enhanced CRUD operations for the knowledge base"""
    
    def __init__(self, kb_path: Optional[str] = None):
        # Use the packages/knowledge-base workspace, not a local knowledge-base directory
        self.kb_path = Path(kb_path or os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
            "packages", "knowledge-base"
        ))
        self.metadata_path = self.kb_path / "metadata"
        self.case_files_path = self.kb_path / "case_files"
        self.transcripts_path = self.kb_path / "transcripts"
        self.articles_path = self.kb_path / "articles"
        self.research_path = self.kb_path / "research"
        
        # Create directories if they don't exist
        for path in [self.metadata_path, self.case_files_path, 
                     self.transcripts_path, self.articles_path, self.research_path]:
            path.mkdir(parents=True, exist_ok=True)
        
        # Initialize metadata index
        self.index_file = self.metadata_path / "index.json"
        self._init_index()
    
    def _init_index(self):
        """Initialize or load the document index"""
        if not self.index_file.exists():
            self.index = {"documents": {}, "tags": {}, "last_updated": ""}
            self._save_index()
        else:
            with open(self.index_file, 'r') as f:
                self.index = json.load(f)
    
    def _save_index(self):
        """Save the index to disk"""
        self.index["last_updated"] = datetime.now().isoformat()
        with open(self.index_file, 'w') as f:
            json.dump(self.index, f, indent=2)
    
    def _generate_id(self, content: str) -> str:
        """Generate a unique ID for a document"""
        return hashlib.md5(content.encode()).hexdigest()[:12]
    
    def _get_doc_path(self, doc_type: str, doc_id: str, filename: str) -> Path:
        """Get the file path for a document with date-based organization"""
        from datetime import datetime
        
        base_paths = {
            "case_file": self.case_files_path,
            "transcript": self.transcripts_path,
            "article": self.articles_path,
            "research": self.research_path
        }
        base_path = base_paths.get(doc_type, self.kb_path)
        
        # Use date-based organization: YYYY-MM-DD/doc_id/
        date_folder = datetime.now().strftime("%Y-%m-%d")
        return base_path / date_folder / doc_id / filename
    
    # CREATE
    def create_document(self, 
                       title: str, 
                       content: str, 
                       source: str,
                       doc_type: str,
                       metadata: Optional[Dict[str, Any]] = None,
                       tags: Optional[List[str]] = None) -> Document:
        """Create a new document in the knowledge base"""
        doc_id = self._generate_id(content)
        now = datetime.now().isoformat()
        
        # Create document object
        doc = Document(
            id=doc_id,
            title=title,
            content=content,
            source=source,
            doc_type=doc_type,
            created_at=now,
            updated_at=now,
            metadata=metadata or {},
            tags=tags or []
        )
        
        # Create document directory
        doc_dir = self._get_doc_path(doc_type, doc_id, "").parent
        doc_dir.mkdir(parents=True, exist_ok=True)
        
        # Save content
        content_file = self._get_doc_path(doc_type, doc_id, "content.md")
        with open(content_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Save metadata
        meta_file = self._get_doc_path(doc_type, doc_id, "metadata.json")
        with open(meta_file, 'w', encoding='utf-8') as f:
            json.dump(doc.to_dict(), f, indent=2)
        
        # Update index with date-based path
        date_folder = datetime.now().strftime("%Y-%m-%d")
        self.index["documents"][doc_id] = {
            "title": title,
            "doc_type": doc_type,
            "path": str(doc_dir),
            "date_folder": date_folder,
            "created_at": now,
            "updated_at": now,
            "tags": tags or []
        }
        
        # Update tag index
        for tag in (tags or []):
            if tag not in self.index["tags"]:
                self.index["tags"][tag] = []
            self.index["tags"][tag].append(doc_id)
        
        self._save_index()
        logger.info(f"Created document: {doc_id} - {title}")
        return doc
    
    # READ
    def get_document(self, doc_id: str) -> Optional[Document]:
        """Retrieve a document by ID"""
        if doc_id not in self.index["documents"]:
            return None
        
        doc_info = self.index["documents"][doc_id]
        meta_file = Path(doc_info["path"]) / "metadata.json"
        
        if not meta_file.exists():
            logger.error(f"Metadata file not found for document {doc_id}")
            return None
        
        with open(meta_file, 'r', encoding='utf-8') as f:
            doc_data = json.load(f)
        
        return Document.from_dict(doc_data)
    
    def list_documents(self, 
                      doc_type: Optional[str] = None,
                      tags: Optional[List[str]] = None,
                      limit: int = 100,
                      offset: int = 0) -> List[Dict[str, Any]]:
        """List documents with optional filtering"""
        docs = []
        
        for doc_id, doc_info in self.index["documents"].items():
            # Filter by type
            if doc_type and doc_info["doc_type"] != doc_type:
                continue
            
            # Filter by tags
            if tags and not any(tag in doc_info["tags"] for tag in tags):
                continue
            
            docs.append({
                "id": doc_id,
                "title": doc_info["title"],
                "doc_type": doc_info["doc_type"],
                "created_at": doc_info["created_at"],
                "updated_at": doc_info["updated_at"],
                "tags": doc_info["tags"]
            })
        
        # Sort by updated_at descending
        docs.sort(key=lambda x: x["updated_at"], reverse=True)
        
        # Apply pagination
        return docs[offset:offset + limit]
    
    def search_documents(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Simple text search across document titles and content"""
        results = []
        query_lower = query.lower()
        
        for doc_id, doc_info in self.index["documents"].items():
            # Search in title
            if query_lower in doc_info["title"].lower():
                doc = self.get_document(doc_id)
                if doc:
                    results.append({
                        "id": doc_id,
                        "title": doc.title,
                        "doc_type": doc.doc_type,
                        "snippet": doc.content[:200] + "...",
                        "score": 1.0  # Title match gets higher score
                    })
                continue
            
            # Search in content
            doc = self.get_document(doc_id)
            if doc and query_lower in doc.content.lower():
                # Find context around the match
                idx = doc.content.lower().find(query_lower)
                start = max(0, idx - 100)
                end = min(len(doc.content), idx + 100)
                snippet = "..." + doc.content[start:end] + "..."
                
                results.append({
                    "id": doc_id,
                    "title": doc.title,
                    "doc_type": doc.doc_type,
                    "snippet": snippet,
                    "score": 0.5  # Content match gets lower score
                })
        
        # Sort by score
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:limit]
    
    # UPDATE
    def update_document(self,
                       doc_id: str,
                       title: Optional[str] = None,
                       content: Optional[str] = None,
                       metadata: Optional[Dict[str, Any]] = None,
                       tags: Optional[List[str]] = None) -> Optional[Document]:
        """Update an existing document"""
        doc = self.get_document(doc_id)
        if not doc:
            return None
        
        # Update fields
        if title:
            doc.title = title
        if content:
            doc.content = content
            # Save new content
            content_file = self._get_doc_path(doc.doc_type, doc_id, "content.md")
            with open(content_file, 'w', encoding='utf-8') as f:
                f.write(content)
        if metadata:
            doc.metadata.update(metadata)
        if tags is not None:
            # Remove old tags from index
            for old_tag in doc.tags:
                if old_tag in self.index["tags"] and doc_id in self.index["tags"][old_tag]:
                    self.index["tags"][old_tag].remove(doc_id)
            
            # Add new tags
            doc.tags = tags
            for tag in tags:
                if tag not in self.index["tags"]:
                    self.index["tags"][tag] = []
                self.index["tags"][tag].append(doc_id)
        
        doc.updated_at = datetime.now().isoformat()
        
        # Save updated metadata
        meta_file = self._get_doc_path(doc.doc_type, doc_id, "metadata.json")
        with open(meta_file, 'w', encoding='utf-8') as f:
            json.dump(doc.to_dict(), f, indent=2)
        
        # Update index
        self.index["documents"][doc_id].update({
            "title": doc.title,
            "updated_at": doc.updated_at,
            "tags": doc.tags
        })
        self._save_index()
        
        logger.info(f"Updated document: {doc_id}")
        return doc
    
    # DELETE
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the knowledge base"""
        if doc_id not in self.index["documents"]:
            return False
        
        doc_info = self.index["documents"][doc_id]
        doc_path = Path(doc_info["path"])
        
        # Remove from tag index
        for tag in doc_info["tags"]:
            if tag in self.index["tags"] and doc_id in self.index["tags"][tag]:
                self.index["tags"][tag].remove(doc_id)
                if not self.index["tags"][tag]:
                    del self.index["tags"][tag]
        
        # Delete files
        if doc_path.exists():
            shutil.rmtree(doc_path)
        
        # Remove from index
        del self.index["documents"][doc_id]
        self._save_index()
        
        logger.info(f"Deleted document: {doc_id}")
        return True
    
    # BULK OPERATIONS
    def bulk_import(self, directory: str, doc_type: str) -> List[Document]:
        """Bulk import documents from a directory"""
        imported_docs = []
        dir_path = Path(directory)
        
        if not dir_path.exists():
            logger.error(f"Directory not found: {directory}")
            return imported_docs
        
        # Process all markdown and text files
        for file_path in dir_path.rglob("*"):
            if file_path.suffix in ['.md', '.txt']:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Extract title from filename or first line
                    title = file_path.stem.replace('_', ' ').title()
                    if content.startswith('#'):
                        first_line = content.split('\n')[0]
                        title = first_line.strip('#').strip()
                    
                    doc = self.create_document(
                        title=title,
                        content=content,
                        source=str(file_path),
                        doc_type=doc_type,
                        metadata={"original_path": str(file_path)}
                    )
                    imported_docs.append(doc)
                    
                except Exception as e:
                    logger.error(f"Error importing {file_path}: {e}")
        
        logger.info(f"Imported {len(imported_docs)} documents from {directory}")
        return imported_docs
    
    def export_document(self, doc_id: str, output_dir: str) -> Optional[str]:
        """Export a document to a directory"""
        doc = self.get_document(doc_id)
        if not doc:
            return None
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save content
        filename = f"{doc.title.replace(' ', '_').lower()}.md"
        file_path = output_path / filename
        
        with open(file_path, 'w', encoding='utf-8') as f:
            # Write metadata header
            f.write(f"# {doc.title}\n\n")
            f.write(f"**Source:** {doc.source}\n")
            f.write(f"**Type:** {doc.doc_type}\n")
            f.write(f"**Created:** {doc.created_at}\n")
            f.write(f"**Tags:** {', '.join(doc.tags)}\n\n")
            f.write("---\n\n")
            f.write(doc.content)
        
        return str(file_path)
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        stats = {
            "total_documents": len(self.index["documents"]),
            "documents_by_type": {},
            "total_tags": len(self.index["tags"]),
            "popular_tags": [],
            "last_updated": self.index.get("last_updated", "")
        }
        
        # Count documents by type
        for doc_info in self.index["documents"].values():
            doc_type = doc_info["doc_type"]
            if doc_type not in stats["documents_by_type"]:
                stats["documents_by_type"][doc_type] = 0
            stats["documents_by_type"][doc_type] += 1
        
        # Get popular tags
        tag_counts = [(tag, len(docs)) for tag, docs in self.index["tags"].items()]
        tag_counts.sort(key=lambda x: x[1], reverse=True)
        stats["popular_tags"] = tag_counts[:10]
        
        return stats