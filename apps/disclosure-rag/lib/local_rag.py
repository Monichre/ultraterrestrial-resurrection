"""
Local RAG System
Provides offline retrieval-augmented generation capabilities
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import pickle
from dataclasses import dataclass
import torch

logger = logging.getLogger(__name__)

@dataclass
class LocalDocument:
    """Document representation for local RAG"""
    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[np.ndarray] = None

class LocalRAG:
    """Local RAG system using Sentence Transformers and FAISS"""
    
    def __init__(self, 
                 model_name: str = "all-MiniLM-L6-v2",
                 index_path: Optional[str] = None,
                 device: Optional[str] = None):
        """
        Initialize the local RAG system
        
        Args:
            model_name: Name of the sentence transformer model
            index_path: Path to save/load the FAISS index
            device: Device to run the model on (cuda/cpu)
        """
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = SentenceTransformer(model_name, device=self.device)
        self.index_path = Path(index_path or "./rag_index")
        self.index_path.mkdir(parents=True, exist_ok=True)
        
        self.documents: Dict[str, LocalDocument] = {}
        self.index: Optional[faiss.IndexFlatL2] = None
        self.doc_ids: List[str] = []
        
        # Try to load existing index
        self._load_index()
    
    def _save_index(self):
        """Save the FAISS index and documents to disk"""
        if self.index is None:
            return
        
        # Save FAISS index
        faiss.write_index(self.index, str(self.index_path / "faiss.index"))
        
        # Save documents and doc_ids
        with open(self.index_path / "documents.pkl", 'wb') as f:
            pickle.dump({
                'documents': self.documents,
                'doc_ids': self.doc_ids
            }, f)
        
        logger.info(f"Saved index with {len(self.documents)} documents")
    
    def _load_index(self):
        """Load the FAISS index and documents from disk"""
        index_file = self.index_path / "faiss.index"
        docs_file = self.index_path / "documents.pkl"
        
        if index_file.exists() and docs_file.exists():
            try:
                # Load FAISS index
                self.index = faiss.read_index(str(index_file))
                
                # Load documents
                with open(docs_file, 'rb') as f:
                    data = pickle.load(f)
                    self.documents = data['documents']
                    self.doc_ids = data['doc_ids']
                
                logger.info(f"Loaded index with {len(self.documents)} documents")
            except Exception as e:
                logger.error(f"Error loading index: {e}")
                self.index = None
                self.documents = {}
                self.doc_ids = []
    
    def add_documents(self, documents: List[Dict[str, Any]]):
        """
        Add documents to the RAG system
        
        Args:
            documents: List of documents with 'id', 'content', and optional 'metadata'
        """
        if not documents:
            return
        
        # Extract contents and create embeddings
        contents = [doc['content'] for doc in documents]
        embeddings = self.model.encode(contents, convert_to_numpy=True, show_progress_bar=True)
        
        # Initialize index if needed
        if self.index is None:
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
        
        # Add to index
        self.index.add(embeddings)
        
        # Store documents
        for doc, embedding in zip(documents, embeddings):
            doc_id = doc['id']
            self.documents[doc_id] = LocalDocument(
                id=doc_id,
                content=doc['content'],
                metadata=doc.get('metadata', {}),
                embedding=embedding
            )
            self.doc_ids.append(doc_id)
        
        # Save to disk
        self._save_index()
        logger.info(f"Added {len(documents)} documents to the index")
    
    def search(self, 
               query: str, 
               top_k: int = 5,
               threshold: Optional[float] = None) -> List[Dict[str, Any]]:
        """
        Search for relevant documents
        
        Args:
            query: Search query
            top_k: Number of results to return
            threshold: Optional similarity threshold
        
        Returns:
            List of search results with scores
        """
        if self.index is None or self.index.ntotal == 0:
            logger.warning("Index is empty")
            return []
        
        # Encode query
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        
        # Search
        distances, indices = self.index.search(query_embedding, min(top_k, self.index.ntotal))
        
        # Prepare results
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for empty results
                continue
                
            # Convert L2 distance to similarity score (0-1)
            # Lower distance = higher similarity
            similarity = 1 / (1 + dist)
            
            if threshold and similarity < threshold:
                continue
            
            doc_id = self.doc_ids[idx]
            doc = self.documents[doc_id]
            
            results.append({
                'id': doc.id,
                'content': doc.content,
                'metadata': doc.metadata,
                'score': float(similarity),
                'distance': float(dist)
            })
        
        return results
    
    def retrieve(self, query: str, top_k: int = 5) -> str:
        """
        Retrieve relevant context for a query
        
        Args:
            query: Search query
            top_k: Number of results to include
        
        Returns:
            Concatenated context string
        """
        results = self.search(query, top_k)
        
        if not results:
            return "No relevant documents found."
        
        # Format results
        context_parts = []
        for i, result in enumerate(results, 1):
            metadata = result['metadata']
            title = metadata.get('title', f"Document {result['id']}")
            source = metadata.get('source', 'Unknown')
            
            context_parts.append(f"[{i}] {title}\n")
            context_parts.append(f"Source: {source}\n")
            context_parts.append(f"Relevance: {result['score']:.2f}\n")
            context_parts.append(f"\n{result['content']}\n")
            context_parts.append("-" * 80 + "\n")
        
        return "\n".join(context_parts)
    
    def update_document(self, doc_id: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        """Update a document in the index"""
        if doc_id not in self.documents:
            logger.error(f"Document {doc_id} not found")
            return
        
        # Get the index position
        try:
            idx = self.doc_ids.index(doc_id)
        except ValueError:
            logger.error(f"Document {doc_id} not in index")
            return
        
        # Create new embedding
        embedding = self.model.encode([content], convert_to_numpy=True)[0]
        
        # Update in FAISS index
        self.index.reconstruct(idx, self.documents[doc_id].embedding)
        self.index.update_vectors(np.array([idx], dtype=np.int64), embedding.reshape(1, -1))
        
        # Update document
        self.documents[doc_id].content = content
        self.documents[doc_id].embedding = embedding
        if metadata:
            self.documents[doc_id].metadata = metadata
        
        # Save changes
        self._save_index()
        logger.info(f"Updated document {doc_id}")
    
    def delete_document(self, doc_id: str):
        """Delete a document from the index"""
        if doc_id not in self.documents:
            logger.error(f"Document {doc_id} not found")
            return
        
        # Remove from documents
        del self.documents[doc_id]
        
        # Rebuild index without the deleted document
        self._rebuild_index()
        logger.info(f"Deleted document {doc_id}")
    
    def _rebuild_index(self):
        """Rebuild the entire index from current documents"""
        if not self.documents:
            self.index = None
            self.doc_ids = []
            self._save_index()
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
            dimension = embeddings_array.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(embeddings_array)
        else:
            self.index = None
        
        self._save_index()
    
    def clear_index(self):
        """Clear all documents from the index"""
        self.documents = {}
        self.doc_ids = []
        self.index = None
        self._save_index()
        logger.info("Cleared index")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the index"""
        return {
            'total_documents': len(self.documents),
            'index_size': self.index.ntotal if self.index else 0,
            'model_name': self.model.get_sentence_embedding_dimension(),
            'embedding_dimension': self.model.get_sentence_embedding_dimension(),
            'device': self.device
        }
    
    def batch_search(self, queries: List[str], top_k: int = 5) -> List[List[Dict[str, Any]]]:
        """Perform batch search for multiple queries"""
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
            for dist, idx in zip(distances[query_idx], indices[query_idx]):
                if idx == -1:
                    continue
                
                similarity = 1 / (1 + dist)
                doc_id = self.doc_ids[idx]
                doc = self.documents[doc_id]
                
                query_results.append({
                    'id': doc.id,
                    'content': doc.content,
                    'metadata': doc.metadata,
                    'score': float(similarity),
                    'distance': float(dist)
                })
            
            all_results.append(query_results)
        
        return all_results


# Integration with KnowledgeBaseCRUD
class LocalRAGIntegration:
    """Integration between LocalRAG and KnowledgeBaseCRUD"""
    
    def __init__(self, kb_crud, rag: Optional[LocalRAG] = None):
        self.kb_crud = kb_crud
        self.rag = rag or LocalRAG()
    
    def sync_all_documents(self):
        """Sync all documents from KnowledgeBaseCRUD to LocalRAG"""
        # Clear existing index
        self.rag.clear_index()
        
        # Get all documents
        all_docs = []
        for doc_id in self.kb_crud.index["documents"]:
            doc = self.kb_crud.get_document(doc_id)
            if doc:
                all_docs.append({
                    'id': doc.id,
                    'content': doc.content,
                    'metadata': {
                        'title': doc.title,
                        'source': doc.source,
                        'doc_type': doc.doc_type,
                        'tags': doc.tags,
                        'created_at': doc.created_at
                    }
                })
        
        # Add to RAG
        if all_docs:
            self.rag.add_documents(all_docs)
            logger.info(f"Synced {len(all_docs)} documents to LocalRAG")
    
    def sync_document(self, doc_id: str):
        """Sync a single document to LocalRAG"""
        doc = self.kb_crud.get_document(doc_id)
        if doc:
            # Check if document exists in RAG
            if doc_id in self.rag.documents:
                # Update existing
                self.rag.update_document(
                    doc_id,
                    doc.content,
                    metadata={
                        'title': doc.title,
                        'source': doc.source,
                        'doc_type': doc.doc_type,
                        'tags': doc.tags,
                        'created_at': doc.created_at
                    }
                )
            else:
                # Add new
                self.rag.add_documents([{
                    'id': doc.id,
                    'content': doc.content,
                    'metadata': {
                        'title': doc.title,
                        'source': doc.source,
                        'doc_type': doc.doc_type,
                        'tags': doc.tags,
                        'created_at': doc.created_at
                    }
                }])
    
    def remove_document(self, doc_id: str):
        """Remove a document from LocalRAG"""
        if doc_id in self.rag.documents:
            self.rag.delete_document(doc_id)