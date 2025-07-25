#!/usr/bin/env python3
"""
Triple RAG Adapter - Integrates Upstash (cloud), LocalRAG (FAISS), and CocoIndex (PostgreSQL pgvector) for maximum flexibility
Date: June 29, 2025 - Updated January 9, 2025
"""

from typing import List, Dict, Any, Optional
import os
import json
import asyncio
import logging
from datetime import datetime
import httpx

# Import Upstash
from upstash_vector import Index

# Import local RAG system
try:
    import sys
    import os
    # Add lib directory to path for local_rag import
    lib_path = os.path.join(os.path.dirname(os.path.dirname(__file__)))
    if lib_path not in sys.path:
        sys.path.insert(0, lib_path)
    
    from local_rag import LocalRAG
    LOCAL_RAG_AVAILABLE = True
    logging.info("LocalRAG module loaded successfully")
except ImportError as e:
    LOCAL_RAG_AVAILABLE = False
    logging.warning(f"local_rag.py not available: {e}")

# Import Enhanced CocoIndex for PostgreSQL pgvector support
try:
    from ..cocoindex import BackendFactory, create_live_cocoindex, Document
    import numpy as np
    ENHANCED_COCOINDEX_AVAILABLE = True
    logging.info("Enhanced CocoIndex service available")
except ImportError:
    ENHANCED_COCOINDEX_AVAILABLE = False
    logging.warning("Enhanced CocoIndex not available")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TripleRAGAdapter:
    """Adapter that searches Upstash (cloud), LocalRAG (FAISS), and CocoIndex (PostgreSQL pgvector) in parallel"""
    
    def __init__(self):
        # Upstash configuration
        self.upstash_url = os.getenv("UPSTASH_VECTOR_REST_URL", 
                                     "https://known-bobcat-28794-us1-vector.upstash.io")
        self.upstash_token = os.getenv("UPSTASH_VECTOR_REST_TOKEN",
                                       "ABYFMGtub3duLWJvYmNhdC0yODc5NC11czFhZG1pbllUZ3daREJqT1RRdFpUTmtZUzAwWTJGaExUZzNNelV0WlRGaE9USmxZelJpWXpnMg==")
        
        # Initialize Upstash
        self.upstash = Index(url=self.upstash_url, token=self.upstash_token)
        
        # Local RAG configuration (FAISS-based)
        self.local_rag_enabled = os.getenv("LOCAL_RAG_ENABLED", "true").lower() == "true"
        self._local_rag = None
        
        # Enhanced CocoIndex configuration (FAISS + PostgreSQL pgvector backends)
        self.enhanced_cocoindex_enabled = os.getenv("ENHANCED_COCOINDEX_ENABLED", "true").lower() == "true"
        self._enhanced_cocoindex = None
        self.database_url = os.getenv("DATABASE_URL", "postgresql://liamellis@localhost:5432/ultraterrestrial")
        self.cocoindex_backend_type = os.getenv("COCOINDEX_BACKEND", "postgresql")  # postgresql or faiss
        self.live_updates_enabled = os.getenv("LIVE_UPDATES_ENABLED", "true").lower() == "true"
        
        # Performance settings (updated for 3 backends)
        self.parallel_search = os.getenv("PARALLEL_SEARCH", "true").lower() == "true"
        self.upstash_weight = float(os.getenv("UPSTASH_WEIGHT", "0.4"))
        self.local_rag_weight = float(os.getenv("LOCAL_RAG_WEIGHT", "0.3")) 
        self.enhanced_cocoindex_weight = float(os.getenv("ENHANCED_COCOINDEX_WEIGHT", "0.3"))
        
        logger.info(f"TripleRAGAdapter initialized - Upstash: ✓, LocalRAG: {'✓' if self.local_rag_enabled else '✗'}, Enhanced CocoIndex ({self.cocoindex_backend_type}): {'✓' if self.enhanced_cocoindex_enabled else '✗'}")
    
    @property
    def local_rag(self):
        """Lazy load LocalRAG (FAISS-based)"""
        if self._local_rag is None and self.local_rag_enabled and LOCAL_RAG_AVAILABLE:
            try:
                # Initialize LocalRAG with existing index
                self._local_rag = LocalRAG(
                    model_name="all-MiniLM-L6-v2",
                    index_path="./rag_index"
                )
                logger.info(f"LocalRAG initialized with {len(self._local_rag.documents)} documents")
            except Exception as e:
                logger.error(f"Failed to initialize LocalRAG: {e}")
                self.local_rag_enabled = False
        return self._local_rag
    
    async def get_enhanced_cocoindex(self):
        """Lazy load Enhanced CocoIndex client"""
        if self._enhanced_cocoindex is None and self.enhanced_cocoindex_enabled and ENHANCED_COCOINDEX_AVAILABLE:
            try:
                # Choose backend type based on configuration
                if self.cocoindex_backend_type == "postgresql":
                    backend_config = {
                        'connection_string': self.database_url,
                        'table_name': 'enhanced_cocoindex_documents',
                        'model_name': 'all-MiniLM-L6-v2',
                        'embedding_dimension': 384
                    }
                else:
                    # Default to FAISS backend
                    backend_config = {
                        'model_name': 'all-MiniLM-L6-v2',
                        'index_path': './enhanced_cocoindex_faiss',
                        'index_type': 'flat'
                    }
                
                # Create backend
                backend = BackendFactory.create_backend(
                    self.cocoindex_backend_type, 
                    **backend_config
                )
                
                # Initialize backend
                await backend.initialize()
                
                # Create enhanced CocoIndex with live updates if enabled
                if self.live_updates_enabled:
                    self._enhanced_cocoindex = await create_live_cocoindex(
                        backend_type=self.cocoindex_backend_type,
                        watch_directories=['./data/documents'],  # Configure as needed
                        **backend_config
                    )
                else:
                    self._enhanced_cocoindex = backend
                
                logger.info(f"Enhanced CocoIndex ({self.cocoindex_backend_type}) initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Enhanced CocoIndex: {e}")
                self.enhanced_cocoindex_enabled = False
        return self._enhanced_cocoindex
    
    
    async def search(self, query: str, top_k: int = 8, 
                    include_metadata: bool = True,
                    filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Search three systems: Upstash, LocalRAG, and PostgreSQL pgvector in parallel
        
        Args:
            query: Search query text
            top_k: Number of results to return
            include_metadata: Include metadata in results
            filter_type: Optional filter by document type
            
        Returns:
            Merged and ranked results from all systems
        """
        logger.info(f"Searching for: '{query}' (top_k={top_k})")
        
        # Prepare search tasks
        tasks = []
        task_names = []
        
        # Always search Upstash
        tasks.append(self._search_upstash(query, top_k, include_metadata, filter_type))
        task_names.append("upstash")
        
        # Search LocalRAG if enabled
        if self.local_rag_enabled and LOCAL_RAG_AVAILABLE:
            tasks.append(self._search_local_rag(query, top_k, include_metadata, filter_type))
            task_names.append("local_rag")
        
        # Search Enhanced CocoIndex if enabled
        if self.enhanced_cocoindex_enabled and ENHANCED_COCOINDEX_AVAILABLE:
            tasks.append(self._search_enhanced_cocoindex(query, top_k, include_metadata, filter_type))
            task_names.append("enhanced_cocoindex")
        
        if self.parallel_search and len(tasks) > 1:
            # Run searches in parallel
            results = await asyncio.gather(*tasks, return_exceptions=True)
        else:
            # Sequential search
            results = []
            for task in tasks:
                try:
                    result = await task
                    results.append(result)
                except Exception as e:
                    results.append(e)
        
        # Parse results
        upstash_results = []
        local_rag_results = []
        cocoindex_results = []
        
        for i, (result, name) in enumerate(zip(results, task_names)):
            if isinstance(result, Exception):
                logger.error(f"{name} search error: {result}")
            else:
                if name == "upstash":
                    upstash_results = result
                elif name == "local_rag":
                    local_rag_results = result
                elif name == "cocoindex":
                    cocoindex_results = result
        
        # Merge and rank results
        merged_results = self._merge_triple_results(upstash_results, local_rag_results, cocoindex_results, top_k)
        
        logger.info(f"Search complete - Upstash: {len(upstash_results)}, "
                   f"LocalRAG: {len(local_rag_results)}, CocoIndex: {len(cocoindex_results)}, "
                   f"Merged: {len(merged_results)}")
        
        return merged_results
    
    async def _search_upstash(self, query: str, top_k: int,
                             include_metadata: bool = True,
                             filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search Upstash vector database"""
        try:
            # Build metadata filter if needed
            metadata_filter = None
            if filter_type:
                metadata_filter = {"vector_type": filter_type}
            
            # Query Upstash
            response = self.upstash.query(
                data=query,
                top_k=top_k,
                include_metadata=include_metadata,
                filter=metadata_filter
            )
            
            # Format results
            results = []
            for item in response:
                result = {
                    "id": item.id,
                    "score": item.score,
                    "system": "upstash",
                    "badge": "☁️ Cloud",
                    "text": item.metadata.get("content", "")[:500] if include_metadata else "",
                    "metadata": item.metadata if include_metadata else {},
                    "source": item.metadata.get("source", "Unknown") if include_metadata else "Unknown"
                }
                results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"Upstash search error: {e}")
            return []
    
    async def _search_local_rag(self, query: str, top_k: int,
                               include_metadata: bool = True,
                               filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search LocalRAG (FAISS-based) system"""
        if not self.local_rag_enabled or not LOCAL_RAG_AVAILABLE or not self.local_rag:
            return []
        
        try:
            # Use the existing local RAG search
            results = self.local_rag.search(query, top_k=top_k)
            
            # Format results to match our standard format
            formatted_results = []
            for result in results:
                formatted_result = {
                    "id": result['id'],
                    "score": result['score'],
                    "system": "local_rag",
                    "badge": "🏠 FAISS",
                    "text": result['content'][:500] if result['content'] else "",
                    "metadata": result['metadata'] if include_metadata else {},
                    "source": result['metadata'].get('title', result['metadata'].get('source', 'Local Document'))
                }
                
                # Apply filter if needed
                if filter_type:
                    doc_type = result['metadata'].get('doc_type', '')
                    if filter_type.lower() not in doc_type.lower():
                        continue
                
                formatted_results.append(formatted_result)
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"LocalRAG search error: {e}")
            return []
    
    async def _search_enhanced_cocoindex(self, query: str, top_k: int = 8, 
                                        include_metadata: bool = True,
                                        filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search Enhanced CocoIndex (PostgreSQL pgvector or FAISS backend)"""
        if not self.enhanced_cocoindex_enabled or not ENHANCED_COCOINDEX_AVAILABLE:
            return []
        
        try:
            # Get enhanced CocoIndex client
            enhanced_cocoindex = await self.get_enhanced_cocoindex()
            if not enhanced_cocoindex:
                return []
            
            # Search using enhanced CocoIndex
            search_results = await enhanced_cocoindex.search(
                query=query,
                top_k=top_k,
                threshold=None  # No threshold filtering for now
            )
            
            # Format results to match our standard format
            results = []
            for i, result in enumerate(search_results):
                doc = result.document
                formatted_result = {
                    "id": doc.id,
                    "score": float(result.score),
                    "system": f"enhanced_cocoindex_{self.cocoindex_backend_type}",
                    "badge": f"🗄️ CocoIndex ({self.cocoindex_backend_type.upper()})",
                    "text": doc.content[:500] if doc.content else "",
                    "metadata": doc.metadata or {},
                    "source": doc.metadata.get("source", "Enhanced CocoIndex Document") if doc.metadata else "Enhanced CocoIndex Document",
                    "rank": result.rank,
                    "distance": result.distance
                }
                results.append(formatted_result)
            
            return results
            
        except Exception as e:
            logger.error(f"Enhanced CocoIndex search error: {e}")
            return []
    
    
    def _merge_triple_results(self, upstash_results: List[Dict], 
                             local_rag_results: List[Dict],
                             enhanced_cocoindex_results: List[Dict], 
                             top_k: int) -> List[Dict[str, Any]]:
        """Merge and deduplicate results from all three systems"""
        # Apply weights to scores
        for result in upstash_results:
            result["weighted_score"] = result["score"] * self.upstash_weight
            
        for result in local_rag_results:
            result["weighted_score"] = result["score"] * self.local_rag_weight
            
        for result in enhanced_cocoindex_results:
            result["weighted_score"] = result["score"] * self.enhanced_cocoindex_weight
        
        # Combine all results
        all_results = upstash_results + local_rag_results + enhanced_cocoindex_results
        
        # Sort by weighted score
        all_results.sort(key=lambda x: x.get("weighted_score", 0), reverse=True)
        
        # Deduplicate based on text similarity (first 100 chars)
        seen_texts = set()
        unique_results = []
        
        for result in all_results:
            text_key = result["text"][:100].lower().strip()
            
            if text_key not in seen_texts:
                seen_texts.add(text_key)
                # Remove weighted_score from final output
                result.pop("weighted_score", None)
                unique_results.append(result)
                
                if len(unique_results) >= top_k:
                    break
        
        return unique_results
    
    def _merge_results(self, upstash_results: List[Dict], 
                      local_rag_results: List[Dict], 
                      top_k: int) -> List[Dict[str, Any]]:
        """Legacy method for backward compatibility"""
        return self._merge_triple_results(upstash_results, local_rag_results, [], top_k)
    
    async def index_document(self, content: str, metadata: Dict[str, Any],
                           use_system: str = "all") -> Dict[str, Any]:
        """
        Index a document in one or all systems
        
        Args:
            content: Document content to index
            metadata: Document metadata
            use_system: "upstash", "local_rag", "cocoindex", or "all"
            
        Returns:
            Result of indexing operation
        """
        results = {"timestamp": datetime.now().isoformat()}
        
        if use_system in ["upstash", "all"]:
            try:
                # Index in Upstash
                vector_id = f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                upstash_result = self.upstash.upsert(
                    vectors=[{
                        "id": vector_id,
                        "data": content,
                        "metadata": metadata
                    }]
                )
                results["upstash"] = {
                    "success": True,
                    "vector_id": vector_id,
                    "result": upstash_result
                }
            except Exception as e:
                results["upstash"] = {
                    "success": False,
                    "error": str(e)
                }
        
        if use_system in ["local_rag", "all"] and self.local_rag_enabled:
            try:
                # Index in LocalRAG
                if self.local_rag:
                    self.local_rag.add_document(content, metadata)
                    results["local_rag"] = {
                        "success": True,
                        "message": "Document added to LocalRAG FAISS index"
                    }
                else:
                    results["local_rag"] = {
                        "success": False,
                        "error": "LocalRAG not initialized"
                    }
            except Exception as e:
                results["local_rag"] = {
                    "success": False,
                    "error": str(e)
                }
        
        if use_system in ["cocoindex", "all"] and self.cocoindex_enabled:
            try:
                # Index in CocoIndex
                if self.cocoindex_client:
                    # Use CocoIndex flow to process and index the document
                    doc_id = metadata.get("id", f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
                    
                    # Create a data source for the document
                    document_data = {
                        "doc_id": doc_id,
                        "content": content,
                        "metadata": metadata
                    }
                    
                    # Process through CocoIndex embedding flow
                    embedding_result = self.cocoindex_client.process_document(
                        document_data,
                        embedding_model="sentence-transformers/all-MiniLM-L6-v2",
                        collection_name="document_embeddings"
                    )
                    
                    results["cocoindex"] = {
                        "success": True,
                        "message": "Document added to CocoIndex with embedding",
                        "doc_id": doc_id
                    }
                else:
                    results["cocoindex"] = {
                        "success": False,
                        "error": "CocoIndex not initialized"
                    }
            except Exception as e:
                results["cocoindex"] = {
                    "success": False,
                    "error": str(e)
                }
        
        return results
    
    def get_status(self) -> Dict[str, Any]:
        """Get status of all three systems"""
        status = {
            "timestamp": datetime.now().isoformat(),
            "upstash": {
                "enabled": True,
                "url": self.upstash_url,
                "connected": False
            },
            "local_rag": {
                "enabled": self.local_rag_enabled,
                "available": LOCAL_RAG_AVAILABLE,
                "loaded": self._local_rag is not None,
                "documents": len(self.local_rag.documents) if self.local_rag else 0
            },
            "cocoindex": {
                "enabled": self.cocoindex_enabled,
                "available": COCOINDEX_AVAILABLE,
                "connected": self._cocoindex_client is not None,
                "database_url": self.database_url
            },
            "settings": {
                "parallel_search": self.parallel_search,
                "upstash_weight": self.upstash_weight,
                "local_rag_weight": self.local_rag_weight,
                "cocoindex_weight": self.cocoindex_weight
            }
        }
        
        # Test Upstash connection
        try:
            # Simple stats query to test connection
            stats = self.upstash.info()
            status["upstash"]["connected"] = True
            status["upstash"]["stats"] = stats
        except Exception as e:
            status["upstash"]["error"] = str(e)
        
        # Test CocoIndex connection
        if self.cocoindex_enabled and COCOINDEX_AVAILABLE:
            try:
                client = self.cocoindex_client
                if client:
                    # Test CocoIndex connection by checking collection info
                    collection_info = client.get_collection_info("document_embeddings")
                    status["cocoindex"]["document_count"] = collection_info.get("document_count", 0)
                    status["cocoindex"]["connected"] = True
            except Exception as e:
                status["cocoindex"]["error"] = str(e)
        
        return status


# Create singleton instance
triple_rag_adapter = TripleRAGAdapter()

# Backward compatibility
dual_rag_adapter = triple_rag_adapter
quad_rag_adapter = triple_rag_adapter


# Convenience functions for backward compatibility
async def search(query: str, **kwargs) -> List[Dict[str, Any]]:
    """Search using the triple RAG adapter"""
    return await triple_rag_adapter.search(query, **kwargs)


async def index_document(content: str, metadata: Dict[str, Any], **kwargs) -> Dict[str, Any]:
    """Index a document using the triple RAG adapter"""
    return await triple_rag_adapter.index_document(content, metadata, **kwargs)


def get_adapter_status() -> Dict[str, Any]:
    """Get status of the triple RAG adapter"""
    return triple_rag_adapter.get_status()