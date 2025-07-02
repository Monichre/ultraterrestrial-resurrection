#!/usr/bin/env python3
"""
Triple RAG Adapter - Integrates Upstash (cloud), local_rag.py (FAISS), and CocoIndex (local) for maximum flexibility
Date: June 29, 2025 - Updated July 2, 2025
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
    from ..local_rag import LocalRAG
    LOCAL_RAG_AVAILABLE = True
except ImportError:
    LOCAL_RAG_AVAILABLE = False
    logging.warning("local_rag.py not available")

# Import CocoIndex (will be available after pip install cocoindex)
try:
    import cocoindex
    COCOINDEX_AVAILABLE = True
except ImportError:
    COCOINDEX_AVAILABLE = False
    logging.warning("CocoIndex not installed")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TripleRAGAdapter:
    """Adapter that searches Upstash (cloud), local_rag.py (FAISS), and CocoIndex in parallel"""
    
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
        
        # CocoIndex configuration
        self.coco_enabled = os.getenv("COCOINDEX_ENABLED", "false").lower() == "true"
        self._coco_flow = None
        self.coco_flow_name = os.getenv("COCOINDEX_FLOW_NAME", "UFOResearch")
        
        # Performance settings
        self.parallel_search = os.getenv("PARALLEL_SEARCH", "true").lower() == "true"
        self.upstash_weight = float(os.getenv("UPSTASH_WEIGHT", "0.4"))
        self.local_rag_weight = float(os.getenv("LOCAL_RAG_WEIGHT", "0.4")) 
        self.coco_weight = float(os.getenv("COCO_WEIGHT", "0.2"))
        
        logger.info(f"TripleRAGAdapter initialized - Upstash: ✓, LocalRAG: {'✓' if self.local_rag_enabled else '✗'}, CocoIndex: {'✓' if self.coco_enabled else '✗'}")
    
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
    
    @property
    def coco_flow(self):
        """Lazy load CocoIndex flow"""
        if self._coco_flow is None and self.coco_enabled and COCOINDEX_AVAILABLE:
            try:
                # Set database URL for CocoIndex
                db_url = os.getenv("COCOINDEX_DATABASE_URL", "postgresql://cocoindex:cocoindex@localhost:5432/cocoindex")
                os.environ["COCOINDEX_DATABASE_URL"] = db_url
                
                # Initialize CocoIndex
                cocoindex.init()
                
                # Import our UFO research flow
                from setup_cocoindex_flow import ufo_research_flow, text_to_embedding
                
                # Store references to the flow functions
                self._coco_flow = {
                    'flow_def': ufo_research_flow,
                    'text_to_embedding': text_to_embedding,
                    'table_name': 'ufo_research_embeddings'
                }
                
                logger.info(f"CocoIndex UFOResearch flow initialized successfully")
                logger.info(f"Database URL: {db_url}")
                
            except Exception as e:
                logger.error(f"Failed to initialize CocoIndex flow: {e}")
                self.coco_enabled = False
        return self._coco_flow
    
    async def search(self, query: str, top_k: int = 8, 
                    include_metadata: bool = True,
                    filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Search all three systems: Upstash, LocalRAG, and CocoIndex in parallel
        
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
        
        # Search CocoIndex if enabled
        if self.coco_enabled and COCOINDEX_AVAILABLE:
            tasks.append(self._search_cocoindex(query, top_k, include_metadata, filter_type))
            task_names.append("cocoindex")
        
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
        coco_results = []
        
        for i, (result, name) in enumerate(zip(results, task_names)):
            if isinstance(result, Exception):
                logger.error(f"{name} search error: {result}")
            else:
                if name == "upstash":
                    upstash_results = result
                elif name == "local_rag":
                    local_rag_results = result
                elif name == "cocoindex":
                    coco_results = result
        
        # Merge and rank results
        merged_results = self._merge_all_results(upstash_results, local_rag_results, coco_results, top_k)
        
        logger.info(f"Search complete - Upstash: {len(upstash_results)}, "
                   f"LocalRAG: {len(local_rag_results)}, CocoIndex: {len(coco_results)}, "
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
    
    async def _search_cocoindex(self, query: str, top_k: int,
                               include_metadata: bool = True,
                               filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search CocoIndex local database"""
        if not self.coco_enabled or not COCOINDEX_AVAILABLE or not self.coco_flow:
            return []
        
        try:
            # Import required libraries
            from psycopg_pool import ConnectionPool
            from pgvector.psycopg import register_vector
            import cocoindex.utils
            
            # Get database connection info
            db_url = os.getenv("COCOINDEX_DATABASE_URL", "postgresql://cocoindex:cocoindex@localhost:5432/cocoindex")
            
            # Get table name and embedding function
            flow_data = self.coco_flow
            table_name = flow_data['table_name']
            text_to_embedding = flow_data['text_to_embedding']
            
            # Get query embedding
            query_vector = text_to_embedding.eval(query)
            
            # Search using direct database connection
            results = []
            with ConnectionPool(db_url, min_size=1, max_size=3) as pool:
                with pool.connection() as conn:
                    register_vector(conn)
                    with conn.cursor() as cur:
                        cur.execute(f"""
                            SELECT filename, text, embedding <=> %s AS distance
                            FROM {table_name} ORDER BY distance LIMIT %s
                        """, (query_vector, top_k))
                        
                        for i, row in enumerate(cur.fetchall()):
                            filename, text, distance = row
                            score = 1.0 - distance  # Convert distance to similarity score
                            
                            result = {
                                "id": f"coco_{i}",
                                "score": float(score),
                                "system": "cocoindex",
                                "badge": "💾 Local",
                                "text": text[:500] if text else "",
                                "metadata": {"filename": filename},
                                "source": filename or "Local Document"
                            }
                            
                            # Apply filter if needed
                            if filter_type and not filename.endswith(f".{filter_type}"):
                                continue
                                
                            results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"CocoIndex search error: {e}")
            return []
    
    def _merge_all_results(self, upstash_results: List[Dict], 
                          local_rag_results: List[Dict],
                          coco_results: List[Dict], 
                          top_k: int) -> List[Dict[str, Any]]:
        """Merge and deduplicate results from all three systems"""
        # Apply weights to scores
        for result in upstash_results:
            result["weighted_score"] = result["score"] * self.upstash_weight
            
        for result in local_rag_results:
            result["weighted_score"] = result["score"] * self.local_rag_weight
            
        for result in coco_results:
            result["weighted_score"] = result["score"] * self.coco_weight
        
        # Combine all results
        all_results = upstash_results + local_rag_results + coco_results
        
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
                      coco_results: List[Dict], 
                      top_k: int) -> List[Dict[str, Any]]:
        """Legacy method for backward compatibility"""
        return self._merge_all_results(upstash_results, [], coco_results, top_k)
    
    async def index_document(self, content: str, metadata: Dict[str, Any],
                           use_system: str = "both") -> Dict[str, Any]:
        """
        Index a document in one or both systems
        
        Args:
            content: Document content to index
            metadata: Document metadata
            use_system: "upstash", "cocoindex", or "both"
            
        Returns:
            Result of indexing operation
        """
        results = {"timestamp": datetime.now().isoformat()}
        
        if use_system in ["upstash", "both"]:
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
        
        if use_system in ["cocoindex", "both"] and self.coco_enabled:
            try:
                # Index in CocoIndex (would need to implement based on CocoIndex API)
                results["cocoindex"] = {
                    "success": True,
                    "message": "CocoIndex indexing not yet implemented"
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
                "documents": len(self._local_rag.documents) if self._local_rag else 0
            },
            "cocoindex": {
                "enabled": self.coco_enabled,
                "available": COCOINDEX_AVAILABLE,
                "flow_loaded": self._coco_flow is not None
            },
            "settings": {
                "parallel_search": self.parallel_search,
                "upstash_weight": self.upstash_weight,
                "local_rag_weight": self.local_rag_weight,
                "coco_weight": self.coco_weight
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
        
        return status


# Create singleton instance
triple_rag_adapter = TripleRAGAdapter()

# Backward compatibility
dual_rag_adapter = triple_rag_adapter


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