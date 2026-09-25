"""
OneNode.ai Integration Module for Disclosure RAG System

This module provides integration with OneNode.ai as an additional vector backend
for the existing triple RAG architecture.
"""

import os
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional, Generator
from dataclasses import dataclass

try:
    from onenode import OneNode, Text, Image, Models
    from onenode import AuthenticationError, ClientRequestError, ServerError
    ONENODE_AVAILABLE = True
except ImportError:
    ONENODE_AVAILABLE = False
    print("OneNode.ai not installed. Install with: pip install onenode")

@dataclass
class OneNodeConfig:
    """Configuration for OneNode integration."""
    project_id: Optional[str] = None
    api_key: Optional[str] = None
    database_name: str = "disclosure_rag"
    collection_name: str = "documents"
    embedding_model: str = "text-embedding-3-small"
    chunk_size: int = 512
    chunk_overlap: int = 50
    vision_model: str = "gpt-4o-mini"

class OneNodeRAGAdapter:
    """Adapter for integrating OneNode.ai with the existing RAG system."""
    
    def __init__(self, config: OneNodeConfig):
        if not ONENODE_AVAILABLE:
            raise ImportError("OneNode.ai is not installed. Install with: pip install onenode")
        
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Initialize client
        try:
            self.client = OneNode()
            if config.project_id:
                self.client.project_id = config.project_id
            if config.api_key:
                self.client.api_key = config.api_key
            
            self.db = self.client.db(config.database_name)
            self.collection = self.db.collection(config.collection_name)
            
            self.logger.info("OneNode client initialized successfully")
        except Exception as e:
            self.logger.error(f"Failed to initialize OneNode client: {e}")
            raise
    
    def ingest_documents(self, documents: List[Dict[str, Any]], batch_size: int = 50) -> Generator[int, None, None]:
        """
        Ingest documents into OneNode with proper chunking and indexing.
        
        Args:
            documents: List of documents with content, metadata, etc.
            batch_size: Number of documents to process per batch
            
        Yields:
            int: Number of documents inserted in each batch
        """
        batches = [documents[i:i+batch_size] for i in range(0, len(documents), batch_size)]
        
        for batch_idx, batch in enumerate(batches):
            try:
                processed_docs = []
                
                for doc in batch:
                    processed_doc = self._prepare_document(doc)
                    processed_docs.append(processed_doc)
                
                response = self.collection.insert(processed_docs)
                inserted_count = len(response.inserted_ids)
                
                self.logger.info(f"Batch {batch_idx + 1}: Inserted {inserted_count} documents")
                yield inserted_count
                
            except (ClientRequestError, ServerError) as e:
                self.logger.error(f"Error inserting batch {batch_idx + 1}: {e}")
                yield 0
            except Exception as e:
                self.logger.error(f"Unexpected error in batch {batch_idx + 1}: {e}")
                yield 0
    
    def _prepare_document(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare a document for OneNode insertion."""
        processed_doc = {
            "id": doc.get("id", f"doc_{datetime.now().timestamp()}"),
            "title": doc.get("title", ""),
            "metadata": {
                **doc.get("metadata", {}),
                "ingested_at": datetime.utcnow().isoformat(),
                "source": "disclosure_rag",
                "processor": "onenode_adapter"
            }
        }
        
        # Handle text content
        if "content" in doc:
            processed_doc["content"] = Text(str(doc["content"])).enable_index(
                emb_model=self.config.embedding_model,
                max_chunk_size=self.config.chunk_size,
                chunk_overlap=self.config.chunk_overlap
            )
        
        # Handle additional text fields
        for field in ["summary", "description", "abstract"]:
            if field in doc:
                processed_doc[field] = Text(str(doc[field])).enable_index(
                    emb_model=self.config.embedding_model,
                    max_chunk_size=self.config.chunk_size,
                    chunk_overlap=self.config.chunk_overlap
                )
        
        # Handle images if present
        if "images" in doc:
            processed_images = []
            for img in doc["images"]:
                if isinstance(img, str):
                    # Assume it's a file path or URL
                    processed_images.append(
                        Image(img).enable_index(
                            vision_model=self.config.vision_model,
                            emb_model=self.config.embedding_model
                        )
                    )
            if processed_images:
                processed_doc["images"] = processed_images
        
        return processed_doc
    
    def search_semantic(self, 
                       query: str, 
                       top_k: int = 10, 
                       filters: Optional[Dict[str, Any]] = None,
                       include_metadata: bool = True) -> List[Dict[str, Any]]:
        """
        Perform semantic search using OneNode.
        
        Args:
            query: Search query
            top_k: Number of results to return
            filters: Optional filters for results
            include_metadata: Whether to include document metadata
            
        Returns:
            List of search results with scores and content
        """
        try:
            projection = None
            if include_metadata:
                projection = {
                    "mode": "include",
                    "fields": ["title", "content", "metadata"]
                }
            
            results = self.collection.query(
                query=query,
                filter=filters or {},
                top_k=top_k,
                projection=projection
            )
            
            # Format results for consistency with other RAG backends
            formatted_results = []
            for result in results:
                formatted_result = {
                    "content": result.chunk,
                    "score": float(result.score),
                    "source": result.document.get("title", "Unknown"),
                    "chunk_index": result.chunk_n,
                    "document_id": result.document.get("id"),
                    "backend": "onenode"
                }
                
                if include_metadata:
                    formatted_result["metadata"] = result.document.get("metadata", {})
                
                formatted_results.append(formatted_result)
            
            self.logger.info(f"Retrieved {len(formatted_results)} results for query: '{query}'")
            return formatted_results
            
        except Exception as e:
            self.logger.error(f"Error in semantic search: {e}")
            return []
    
    def search_traditional(self, 
                          filters: Dict[str, Any], 
                          limit: int = 10,
                          sort: Optional[Dict[str, int]] = None) -> List[Dict[str, Any]]:
        """
        Perform traditional (exact) search using filters.
        
        Args:
            filters: MongoDB-style filters
            limit: Maximum number of results
            sort: Sort specification
            
        Returns:
            List of matching documents
        """
        try:
            results = self.collection.find(
                filter=filters,
                limit=limit,
                sort=sort or {}
            )
            
            formatted_results = []
            for doc in results:
                formatted_results.append({
                    "document": doc,
                    "backend": "onenode"
                })
            
            return formatted_results
            
        except Exception as e:
            self.logger.error(f"Error in traditional search: {e}")
            return []
    
    def update_document(self, doc_id: str, updates: Dict[str, Any]) -> bool:
        """Update a document in OneNode."""
        try:
            # Prepare updates with text indexing where appropriate
            processed_updates = {}
            for key, value in updates.items():
                if key in ["content", "summary", "description"] and isinstance(value, str):
                    processed_updates[key] = Text(value).enable_index(
                        emb_model=self.config.embedding_model,
                        max_chunk_size=self.config.chunk_size,
                        chunk_overlap=self.config.chunk_overlap
                    )
                else:
                    processed_updates[key] = value
            
            processed_updates["last_updated"] = datetime.utcnow().isoformat()
            
            result = self.collection.update(
                filter={"id": doc_id},
                update={"$set": processed_updates}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            self.logger.error(f"Error updating document {doc_id}: {e}")
            return False
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document from OneNode."""
        try:
            result = self.collection.delete(filter={"id": doc_id})
            return result.deleted_count > 0
        except Exception as e:
            self.logger.error(f"Error deleting document {doc_id}: {e}")
            return False
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the OneNode collection."""
        try:
            # OneNode doesn't have built-in stats, so we'll estimate
            sample_results = self.collection.find(limit=1)
            has_documents = len(list(sample_results)) > 0
            
            return {
                "backend": "onenode",
                "has_documents": has_documents,
                "database": self.config.database_name,
                "collection": self.config.collection_name,
                "embedding_model": self.config.embedding_model
            }
        except Exception as e:
            self.logger.error(f"Error getting collection stats: {e}")
            return {"backend": "onenode", "error": str(e)}

def create_onenode_adapter(config_dict: Dict[str, Any]) -> Optional[OneNodeRAGAdapter]:
    """Factory function to create OneNode adapter from configuration."""
    if not ONENODE_AVAILABLE:
        return None
    
    config = OneNodeConfig(**config_dict)
    
    try:
        return OneNodeRAGAdapter(config)
    except Exception as e:
        logging.error(f"Failed to create OneNode adapter: {e}")
        return None

# Example usage and configuration
if __name__ == "__main__":
    # Example configuration
    config = OneNodeConfig(
        project_id=os.getenv("ONENODE_PROJECT_ID"),
        api_key=os.getenv("ONENODE_API_KEY"),
        database_name="disclosure_rag_test",
        collection_name="uap_documents"
    )
    
    # Initialize adapter
    adapter = OneNodeRAGAdapter(config)
    
    # Example document ingestion
    test_documents = [
        {
            "id": "test_doc_1",
            "title": "UAP Sighting Report",
            "content": "This is a test document about UAP sightings with detailed observations.",
            "metadata": {
                "category": "sighting",
                "date": "2024-01-15",
                "location": "Nevada"
            }
        }
    ]
    
    # Ingest documents
    for count in adapter.ingest_documents(test_documents):
        print(f"Inserted {count} documents")
    
    # Search example
    results = adapter.search_semantic("UAP sightings Nevada", top_k=5)
    for result in results:
        print(f"Score: {result['score']}, Content: {result['content'][:100]}...")