"""
FAISS Backend for Enhanced CocoIndex
Incorporates all functionality from local_rag.py with improvements
"""

import os
import json
import pickle
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
from datetime import datetime
import numpy as np
import faiss
import torch
from sentence_transformers import SentenceTransformer

from .base import BackendInterface, Document, SearchResult, BackendStats


logger = logging.getLogger(__name__)


class FAISSBackend(BackendInterface):
    """FAISS-based backend for offline vector operations"""
    
    def __init__(self, 
                 model_name: str = "all-MiniLM-L6-v2",
                 index_path: Optional[str] = None,
                 device: Optional[str] = None,
                 index_type: str = "flat",
                 enable_compression: bool = False):
        """
        Initialize FAISS backend
        
        Args:
            model_name: Sentence transformer model name
            index_path: Path to save/load the FAISS index
            device: Device to run the model on (cuda/cpu)
            index_type: Type of FAISS index (flat, ivf, hnsw)
            enable_compression: Enable index compression
        """
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = SentenceTransformer(model_name, device=self.device)
        self.index_path = Path(index_path or "./enhanced_cocoindex_faiss")
        self.index_path.mkdir(parents=True, exist_ok=True)
        self.index_type = index_type
        self.enable_compression = enable_compression
        
        # Core data structures
        self.documents: Dict[str, Document] = {}
        self.index: Optional[faiss.Index] = None
        self.doc_ids: List[str] = []
        self.embedding_dimension: Optional[int] = None
        
        # Performance tracking
        self.stats = {
            'searches': 0,
            'additions': 0,
            'updates': 0,
            'deletions': 0,
            'last_operation': None
        }
    
    async def initialize(self) -> bool:
        """Initialize the FAISS backend"""
        try:
            # Load existing index if available
            await self._load_index()
            logger.info(f"FAISS backend initialized with {len(self.documents)} documents")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize FAISS backend: {e}")
            return False
    
    def _create_index(self, dimension: int) -> faiss.Index:
        """Create a FAISS index based on configuration"""
        if self.index_type == "flat":
            index = faiss.IndexFlatL2(dimension)
        elif self.index_type == "ivf":
            # IVF with 100 clusters for better performance on large datasets
            quantizer = faiss.IndexFlatL2(dimension)
            index = faiss.IndexIVFFlat(quantizer, dimension, min(100, max(1, len(self.documents) // 10)))
        elif self.index_type == "hnsw":
            # HNSW for very fast search
            index = faiss.IndexHNSWFlat(dimension, 32)
            index.hnsw.efConstruction = 200
            index.hnsw.efSearch = 50
        else:
            raise ValueError(f"Unsupported index type: {self.index_type}")
        
        # Add compression if enabled
        if self.enable_compression and self.index_type == "flat":
            index = faiss.IndexPQ(dimension, 8, 8)
        
        return index
    
    async def _save_index(self):
        """Save the FAISS index and documents to disk"""
        try:
            if self.index is None:
                return
            
            # Save FAISS index
            faiss.write_index(self.index, str(self.index_path / "faiss.index"))
            
            # Save documents and metadata separately for better security
            documents_data = {}
            for doc_id, doc in self.documents.items():
                documents_data[doc_id] = {
                    'id': doc.id,
                    'content': doc.content,
                    'metadata': doc.metadata,
                    'created_at': doc.created_at,
                    'updated_at': doc.updated_at
                    # Note: embeddings not saved in JSON for security
                }
            
            # Save as JSON instead of pickle for security
            with open(self.index_path / "documents.json", 'w', encoding='utf-8') as f:
                json.dump({
                    'documents': documents_data,
                    'doc_ids': self.doc_ids,
                    'embedding_dimension': self.embedding_dimension,
                    'stats': self.stats,
                    'config': {
                        'model_name': self.model.get_sentence_embedding_dimension(),
                        'index_type': self.index_type,
                        'device': self.device
                    }
                }, f, indent=2)
            
            # Save embeddings separately in binary format
            if self.documents:
                embeddings = {}
                for doc_id, doc in self.documents.items():
                    if doc.embedding is not None:
                        embeddings[doc_id] = doc.embedding
                
                np.savez_compressed(
                    self.index_path / "embeddings.npz",
                    **embeddings
                )
            
            logger.info(f"Saved index with {len(self.documents)} documents")
            
        except Exception as e:
            logger.error(f"Error saving index: {e}")
    
    async def _load_index(self):
        """Load the FAISS index and documents from disk"""
        index_file = self.index_path / "faiss.index"
        docs_file = self.index_path / "documents.json"
        embeddings_file = self.index_path / "embeddings.npz"
        
        if index_file.exists() and docs_file.exists():
            try:
                # Load FAISS index
                self.index = faiss.read_index(str(index_file))
                
                # Load documents from JSON
                with open(docs_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                self.doc_ids = data.get('doc_ids', [])
                self.embedding_dimension = data.get('embedding_dimension')
                self.stats = data.get('stats', {})
                
                # Load embeddings
                embeddings = {}
                if embeddings_file.exists():
                    embeddings_data = np.load(embeddings_file)
                    embeddings = {key: embeddings_data[key] for key in embeddings_data.files}
                
                # Reconstruct documents
                self.documents = {}
                for doc_id, doc_data in data['documents'].items():
                    self.documents[doc_id] = Document(
                        id=doc_data['id'],
                        content=doc_data['content'],
                        metadata=doc_data['metadata'],
                        embedding=embeddings.get(doc_id),
                        created_at=doc_data.get('created_at'),
                        updated_at=doc_data.get('updated_at')
                    )
                
                logger.info(f"Loaded index with {len(self.documents)} documents")
                
            except Exception as e:
                logger.error(f"Error loading index: {e}")
                self.index = None
                self.documents = {}
                self.doc_ids = []
    
    async def add_documents(self, documents: List[Document]) -> bool:
        """Add documents to the FAISS index"""
        try:
            if not documents:
                return True
            
            # Extract contents and create embeddings
            contents = [doc.content for doc in documents]
            embeddings = self.model.encode(contents, convert_to_numpy=True, show_progress_bar=True)
            
            # Initialize index if needed
            if self.index is None:
                self.embedding_dimension = embeddings.shape[1]
                self.index = self._create_index(self.embedding_dimension)
                
                # Train index if needed (for IVF)
                if self.index_type == "ivf" and len(documents) > 100:
                    self.index.train(embeddings)
            
            # Add to index
            self.index.add(embeddings)
            
            # Store documents
            now = datetime.now().isoformat()
            for doc, embedding in zip(documents, embeddings):
                doc.embedding = embedding
                if not doc.created_at:
                    doc.created_at = now
                doc.updated_at = now
                
                self.documents[doc.id] = doc
                self.doc_ids.append(doc.id)
            
            # Update stats
            self.stats['additions'] += len(documents)
            self.stats['last_operation'] = now
            
            # Save to disk
            await self._save_index()
            
            logger.info(f"Added {len(documents)} documents to FAISS index")
            return True
            
        except Exception as e:
            logger.error(f"Error adding documents: {e}")
            return False
    
    async def search(self, 
                    query: str, 
                    top_k: int = 5,
                    threshold: Optional[float] = None) -> List[SearchResult]:
        """Search for relevant documents"""
        try:
            if self.index is None or self.index.ntotal == 0:
                logger.warning("Index is empty")
                return []
            
            # Encode query
            query_embedding = self.model.encode([query], convert_to_numpy=True)
            
            # Search
            distances, indices = self.index.search(query_embedding, min(top_k, self.index.ntotal))
            
            # Prepare results
            results = []
            for rank, (dist, idx) in enumerate(zip(distances[0], indices[0])):
                if idx == -1:  # FAISS returns -1 for empty results
                    continue
                
                # Convert L2 distance to similarity score (0-1)
                similarity = 1 / (1 + dist)
                
                if threshold and similarity < threshold:
                    continue
                
                doc_id = self.doc_ids[idx]
                doc = self.documents[doc_id]
                
                results.append(SearchResult(
                    document=doc,
                    score=float(similarity),
                    distance=float(dist),
                    rank=rank + 1
                ))
            
            # Update stats
            self.stats['searches'] += 1
            self.stats['last_operation'] = datetime.now().isoformat()
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching: {e}")
            return []
    
    async def batch_search(self, 
                          queries: List[str], 
                          top_k: int = 5) -> List[List[SearchResult]]:
        """Perform batch search for multiple queries"""
        try:
            if self.index is None or self.index.ntotal == 0:
                return [[] for _ in queries]
            
            # Encode all queries
            query_embeddings = self.model.encode(queries, convert_to_numpy=True, show_progress_bar=True)
            
            # Search
            distances, indices = self.index.search(query_embeddings, min(top_k, self.index.ntotal))
            
            # Prepare results for each query
            all_results = []
            for query_idx in range(len(queries)):
                query_results = []
                for rank, (dist, idx) in enumerate(zip(distances[query_idx], indices[query_idx])):
                    if idx == -1:
                        continue
                    
                    similarity = 1 / (1 + dist)
                    doc_id = self.doc_ids[idx]
                    doc = self.documents[doc_id]
                    
                    query_results.append(SearchResult(
                        document=doc,
                        score=float(similarity),
                        distance=float(dist),
                        rank=rank + 1
                    ))
                
                all_results.append(query_results)
            
            # Update stats
            self.stats['searches'] += len(queries)
            self.stats['last_operation'] = datetime.now().isoformat()
            
            return all_results
            
        except Exception as e:
            logger.error(f"Error in batch search: {e}")
            return [[] for _ in queries]
    
    async def update_document(self, doc_id: str, document: Document) -> bool:
        """Update an existing document"""
        try:
            if doc_id not in self.documents:
                logger.error(f"Document {doc_id} not found")
                return False
            
            # Get the index position
            try:
                idx = self.doc_ids.index(doc_id)
            except ValueError:
                logger.error(f"Document {doc_id} not in index")
                return False
            
            # Create new embedding
            embedding = self.model.encode([document.content], convert_to_numpy=True)[0]
            
            # Update in FAISS index (rebuild for now, can optimize later)
            old_doc = self.documents[doc_id]
            self.documents[doc_id] = Document(
                id=document.id,
                content=document.content,
                metadata=document.metadata,
                embedding=embedding,
                created_at=old_doc.created_at,
                updated_at=datetime.now().isoformat()
            )
            
            # Rebuild index to reflect changes
            await self._rebuild_index()
            
            # Update stats
            self.stats['updates'] += 1
            self.stats['last_operation'] = datetime.now().isoformat()
            
            logger.info(f"Updated document {doc_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating document: {e}")
            return False
    
    async def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the index"""
        try:
            if doc_id not in self.documents:
                logger.error(f"Document {doc_id} not found")
                return False
            
            # Remove from documents
            del self.documents[doc_id]
            self.doc_ids.remove(doc_id)
            
            # Rebuild index without the deleted document
            await self._rebuild_index()
            
            # Update stats
            self.stats['deletions'] += 1
            self.stats['last_operation'] = datetime.now().isoformat()
            
            logger.info(f"Deleted document {doc_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            return False
    
    async def get_document(self, doc_id: str) -> Optional[Document]:
        """Get a document by ID"""
        return self.documents.get(doc_id)
    
    async def list_documents(self, 
                            offset: int = 0, 
                            limit: int = 100) -> List[Document]:
        """List documents with pagination"""
        doc_list = list(self.documents.values())
        return doc_list[offset:offset + limit]
    
    async def clear_index(self) -> bool:
        """Clear all documents from the index"""
        try:
            self.documents = {}
            self.doc_ids = []
            self.index = None
            self.embedding_dimension = None
            
            # Reset stats
            self.stats = {
                'searches': 0,
                'additions': 0,
                'updates': 0,
                'deletions': 0,
                'last_operation': datetime.now().isoformat()
            }
            
            await self._save_index()
            logger.info("Cleared FAISS index")
            return True
            
        except Exception as e:
            logger.error(f"Error clearing index: {e}")
            return False
    
    async def _rebuild_index(self):
        """Rebuild the entire index from current documents"""
        try:
            if not self.documents:
                self.index = None
                self.doc_ids = []
                await self._save_index()
                return
            
            # Get all embeddings
            embeddings = []
            self.doc_ids = []
            
            for doc_id, doc in self.documents.items():
                if doc.embedding is not None:
                    embeddings.append(doc.embedding)
                    self.doc_ids.append(doc_id)
            
            if embeddings:
                embeddings_array = np.vstack(embeddings)
                
                # Create new index
                self.index = self._create_index(embeddings_array.shape[1])
                
                # Train if needed
                if self.index_type == "ivf":
                    self.index.train(embeddings_array)
                
                self.index.add(embeddings_array)
            else:
                self.index = None
            
            await self._save_index()
            
        except Exception as e:
            logger.error(f"Error rebuilding index: {e}")
    
    async def get_stats(self) -> BackendStats:
        """Get backend statistics"""
        return BackendStats(
            total_documents=len(self.documents),
            index_size=self.index.ntotal if self.index else 0,
            embedding_dimension=self.embedding_dimension or 0,
            backend_type="faiss",
            last_updated=self.stats.get('last_operation', 'Never'),
            additional_stats={
                'searches': self.stats.get('searches', 0),
                'additions': self.stats.get('additions', 0),
                'updates': self.stats.get('updates', 0),
                'deletions': self.stats.get('deletions', 0),
                'index_type': self.index_type,
                'device': self.device,
                'compression_enabled': self.enable_compression
            }
        )
    
    async def backup(self, path: str) -> bool:
        """Backup the index to a specified path"""
        try:
            backup_path = Path(path)
            backup_path.mkdir(parents=True, exist_ok=True)
            
            # Copy index files
            if (self.index_path / "faiss.index").exists():
                import shutil
                shutil.copy2(self.index_path / "faiss.index", backup_path / "faiss.index")
                shutil.copy2(self.index_path / "documents.json", backup_path / "documents.json")
                
                if (self.index_path / "embeddings.npz").exists():
                    shutil.copy2(self.index_path / "embeddings.npz", backup_path / "embeddings.npz")
            
            # Save backup metadata
            with open(backup_path / "backup_info.json", 'w') as f:
                json.dump({
                    'backup_time': datetime.now().isoformat(),
                    'total_documents': len(self.documents),
                    'backend_type': 'faiss',
                    'index_type': self.index_type
                }, f, indent=2)
            
            logger.info(f"Backup created at {backup_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating backup: {e}")
            return False
    
    async def restore(self, path: str) -> bool:
        """Restore the index from a backup"""
        try:
            backup_path = Path(path)
            
            if not backup_path.exists():
                logger.error(f"Backup path {backup_path} does not exist")
                return False
            
            # Copy backup files to index path
            import shutil
            if (backup_path / "faiss.index").exists():
                shutil.copy2(backup_path / "faiss.index", self.index_path / "faiss.index")
                shutil.copy2(backup_path / "documents.json", self.index_path / "documents.json")
                
                if (backup_path / "embeddings.npz").exists():
                    shutil.copy2(backup_path / "embeddings.npz", self.index_path / "embeddings.npz")
            
            # Reload the index
            await self._load_index()
            
            logger.info(f"Index restored from {backup_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error restoring backup: {e}")
            return False
    
    async def health_check(self) -> Dict[str, Any]:
        """Check backend health"""
        try:
            status = {
                'status': 'healthy',
                'backend_type': 'faiss',
                'total_documents': len(self.documents),
                'index_loaded': self.index is not None,
                'embedding_model': type(self.model).__name__,
                'device': self.device,
                'index_type': self.index_type,
                'last_operation': self.stats.get('last_operation', 'Never'),
                'issues': []
            }
            
            # Check for potential issues
            if self.index is None and len(self.documents) > 0:
                status['issues'].append('Index is None but documents exist')
                status['status'] = 'warning'
            
            if len(self.doc_ids) != len(self.documents):
                status['issues'].append('Document count mismatch between doc_ids and documents')
                status['status'] = 'warning'
            
            if len(status['issues']) > 0:
                status['status'] = 'warning'
            
            return status
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'backend_type': 'faiss'
            }