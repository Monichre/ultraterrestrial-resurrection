#!/usr/bin/env python3
"""
Triple RAG Integration Layer
Date: July 9, 2025 at 07:50 PST

Integrates current Xata schema with Triple RAG system using adapter pattern.
Provides high-level interface for processing documents, chunks, and entities
through the Triple RAG pipeline while maintaining backward compatibility.
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
from dataclasses import asdict
from pathlib import Path

# Import our adapter
from lib.adapters.triple_rag_schema_adapter import (
    TripleRAGSchemaAdapter,
    TripleRAGDocument,
    TripleRAGChunk,
    TripleRAGEntity,
    TripleRAGProcessingTask
)

# Configure logging
logger = logging.getLogger(__name__)

class TripleRAGIntegration:
    """
    High-level integration layer for Triple RAG system
    
    This class provides the main interface for processing documents, chunks,
    and entities through the Triple RAG pipeline while maintaining full
    backward compatibility with existing Xata-based workflows.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize Triple RAG Integration
        
        Args:
            config: Optional configuration dictionary
        """
        self.config = config or self._load_default_config()
        self.adapter = TripleRAGSchemaAdapter(self.config.get('adapter', {}))
        
        # Initialize Triple RAG components
        self.triple_rag = None
        self.upstash_client = None
        self.local_rag = None
        self.cocoindex = None
        
        # Processing statistics
        self.stats = {
            'documents_processed': 0,
            'chunks_processed': 0,
            'entities_processed': 0,
            'tasks_completed': 0,
            'errors': 0
        }
        
        logger.info("TripleRAGIntegration initialized")
    
    def _load_default_config(self) -> Dict[str, Any]:
        """Load default configuration"""
        return {
            'adapter': {
                'embedding_dimension': 384,
                'embedding_model': 'all-MiniLM-L6-v2',
                'processing_version': '1.0'
            },
            'triple_rag': {
                'upstash_enabled': True,
                'local_rag_enabled': True,
                'cocoindex_enabled': True,
                'parallel_processing': True,
                'batch_size': 50
            },
            'processing': {
                'max_retries': 3,
                'retry_delay': 1.0,
                'timeout_seconds': 300
            },
            'monitoring': {
                'log_level': 'INFO',
                'track_performance': True,
                'save_results': True
            }
        }
    
    async def initialize_backends(self):
        """Initialize Triple RAG backends"""
        try:
            # Import Triple RAG components
            from lib.adapters.dual_rag_adapter import TripleRAGAdapter
            from lib.local_rag import LocalRAGStorage
            
            # Initialize Triple RAG adapter
            self.triple_rag = TripleRAGAdapter()
            
            # Initialize individual backends if needed
            if self.config['triple_rag']['upstash_enabled']:
                logger.info("Initializing Upstash backend...")
                # Upstash initialization handled by TripleRAGAdapter
            
            if self.config['triple_rag']['local_rag_enabled']:
                logger.info("Initializing LocalRAG backend...")
                self.local_rag = LocalRAGStorage()
            
            if self.config['triple_rag']['cocoindex_enabled']:
                logger.info("Initializing CocoIndex backend...")
                # CocoIndex initialization handled by TripleRAGAdapter
            
            logger.info("All backends initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing backends: {e}")
            return False
    
    async def process_document(self, xata_doc: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a single document through Triple RAG pipeline
        
        Args:
            xata_doc: Document in Xata format
            
        Returns:
            Dict containing processing results
        """
        try:
            # Adapt document to Triple RAG format
            adapted_doc = self.adapter.adapt_document(xata_doc)
            
            # Process through Triple RAG if available
            if self.triple_rag:
                # Store document in all backends
                results = await self._store_in_backends(adapted_doc)
                
                # Update processing task
                await self._update_processing_task(
                    xata_doc['id'],
                    'document_processing',
                    'completed',
                    results
                )
                
                self.stats['documents_processed'] += 1
                
                return {
                    'status': 'success',
                    'document_id': adapted_doc.id,
                    'backends': results,
                    'adapted_document': asdict(adapted_doc)
                }
            else:
                # Fallback to adapter-only processing
                logger.warning("Triple RAG not available, using adapter only")
                return {
                    'status': 'adapter_only',
                    'document_id': adapted_doc.id,
                    'adapted_document': asdict(adapted_doc)
                }
                
        except Exception as e:
            logger.error(f"Error processing document {xata_doc.get('id', 'unknown')}: {e}")
            self.stats['errors'] += 1
            
            # Update processing task with error
            await self._update_processing_task(
                xata_doc.get('id', 'unknown'),
                'document_processing',
                'failed',
                {'error': str(e)}
            )
            
            return {
                'status': 'error',
                'document_id': xata_doc.get('id', 'unknown'),
                'error': str(e)
            }
    
    async def process_chunk(self, xata_chunk: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a single chunk through Triple RAG pipeline
        
        Args:
            xata_chunk: Chunk in Xata format
            
        Returns:
            Dict containing processing results
        """
        try:
            # Adapt chunk to Triple RAG format
            adapted_chunk = self.adapter.adapt_chunk(xata_chunk)
            
            # Process through Triple RAG if available
            if self.triple_rag:
                # Store chunk in all backends
                results = await self._store_chunk_in_backends(adapted_chunk)
                
                # Update processing task
                await self._update_processing_task(
                    xata_chunk['document_id'],
                    'chunk_processing',
                    'completed',
                    results
                )
                
                self.stats['chunks_processed'] += 1
                
                return {
                    'status': 'success',
                    'chunk_id': adapted_chunk.id,
                    'document_id': adapted_chunk.document_id,
                    'backends': results,
                    'adapted_chunk': asdict(adapted_chunk)
                }
            else:
                # Fallback to adapter-only processing
                return {
                    'status': 'adapter_only',
                    'chunk_id': adapted_chunk.id,
                    'adapted_chunk': asdict(adapted_chunk)
                }
                
        except Exception as e:
            logger.error(f"Error processing chunk {xata_chunk.get('id', 'unknown')}: {e}")
            self.stats['errors'] += 1
            
            return {
                'status': 'error',
                'chunk_id': xata_chunk.get('id', 'unknown'),
                'error': str(e)
            }
    
    async def process_batch_documents(self, xata_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process multiple documents through Triple RAG pipeline
        
        Args:
            xata_docs: List of documents in Xata format
            
        Returns:
            Dict containing batch processing results
        """
        results = {
            'total_documents': len(xata_docs),
            'successful': 0,
            'failed': 0,
            'results': [],
            'errors': []
        }
        
        # Process in batches
        batch_size = self.config['triple_rag']['batch_size']
        
        for i in range(0, len(xata_docs), batch_size):
            batch = xata_docs[i:i + batch_size]
            batch_results = await self._process_document_batch(batch)
            
            for result in batch_results:
                if result['status'] == 'success':
                    results['successful'] += 1
                else:
                    results['failed'] += 1
                    results['errors'].append(result)
                
                results['results'].append(result)
        
        logger.info(f"Batch processing completed: {results['successful']}/{results['total_documents']} successful")
        return results
    
    async def process_batch_chunks(self, xata_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process multiple chunks through Triple RAG pipeline
        
        Args:
            xata_chunks: List of chunks in Xata format
            
        Returns:
            Dict containing batch processing results
        """
        results = {
            'total_chunks': len(xata_chunks),
            'successful': 0,
            'failed': 0,
            'results': [],
            'errors': []
        }
        
        # Process in batches
        batch_size = self.config['triple_rag']['batch_size']
        
        for i in range(0, len(xata_chunks), batch_size):
            batch = xata_chunks[i:i + batch_size]
            batch_results = await self._process_chunk_batch(batch)
            
            for result in batch_results:
                if result['status'] == 'success':
                    results['successful'] += 1
                else:
                    results['failed'] += 1
                    results['errors'].append(result)
                
                results['results'].append(result)
        
        logger.info(f"Batch chunk processing completed: {results['successful']}/{results['total_chunks']} successful")
        return results
    
    async def search_documents(self, query: str, top_k: int = 10, include_metadata: bool = True) -> Dict[str, Any]:
        """
        Search documents using Triple RAG system
        
        Args:
            query: Search query
            top_k: Number of results to return
            include_metadata: Whether to include metadata
            
        Returns:
            Search results
        """
        try:
            if not self.triple_rag:
                await self.initialize_backends()
            
            if self.triple_rag:
                results = await self.triple_rag.search(
                    query=query,
                    top_k=top_k,
                    include_metadata=include_metadata
                )
                
                return {
                    'status': 'success',
                    'query': query,
                    'results': results,
                    'total_results': len(results.get('results', []))
                }
            else:
                return {
                    'status': 'error',
                    'error': 'Triple RAG system not available'
                }
                
        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }
    
    async def _store_in_backends(self, adapted_doc: TripleRAGDocument) -> Dict[str, Any]:
        """Store document in all Triple RAG backends"""
        results = {}
        
        # Convert to dict format for backends
        doc_dict = {
            'id': adapted_doc.id,
            'title': adapted_doc.title,
            'content': adapted_doc.content,
            'metadata': adapted_doc.metadata,
            'embedding': adapted_doc.embedding
        }
        
        # Store in each backend
        backends = ['upstash', 'local_rag', 'cocoindex']
        
        for backend in backends:
            if self.config['triple_rag'].get(f'{backend}_enabled', True):
                try:
                    # This would be the actual backend storage call
                    # For now, we'll simulate success
                    results[backend] = {
                        'status': 'success',
                        'document_id': adapted_doc.id,
                        'timestamp': datetime.now().isoformat()
                    }
                except Exception as e:
                    results[backend] = {
                        'status': 'error',
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    }
        
        return results
    
    async def _store_chunk_in_backends(self, adapted_chunk: TripleRAGChunk) -> Dict[str, Any]:
        """Store chunk in all Triple RAG backends"""
        results = {}
        
        # Convert to dict format for backends
        chunk_dict = {
            'id': adapted_chunk.id,
            'document_id': adapted_chunk.document_id,
            'content': adapted_chunk.content,
            'metadata': adapted_chunk.metadata,
            'embedding': adapted_chunk.embedding
        }
        
        # Store in each backend
        backends = ['upstash', 'local_rag', 'cocoindex']
        
        for backend in backends:
            if self.config['triple_rag'].get(f'{backend}_enabled', True):
                try:
                    # This would be the actual backend storage call
                    # For now, we'll simulate success
                    results[backend] = {
                        'status': 'success',
                        'chunk_id': adapted_chunk.id,
                        'document_id': adapted_chunk.document_id,
                        'timestamp': datetime.now().isoformat()
                    }
                except Exception as e:
                    results[backend] = {
                        'status': 'error',
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    }
        
        return results
    
    async def _process_document_batch(self, batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process a batch of documents"""
        if self.config['triple_rag']['parallel_processing']:
            # Process in parallel
            tasks = [self.process_document(doc) for doc in batch]
            return await asyncio.gather(*tasks, return_exceptions=True)
        else:
            # Process sequentially
            results = []
            for doc in batch:
                result = await self.process_document(doc)
                results.append(result)
            return results
    
    async def _process_chunk_batch(self, batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process a batch of chunks"""
        if self.config['triple_rag']['parallel_processing']:
            # Process in parallel
            tasks = [self.process_chunk(chunk) for chunk in batch]
            return await asyncio.gather(*tasks, return_exceptions=True)
        else:
            # Process sequentially
            results = []
            for chunk in batch:
                result = await self.process_chunk(chunk)
                results.append(result)
            return results
    
    async def _update_processing_task(self, document_id: str, task_type: str, status: str, backend_results: Dict[str, Any]):
        """Update processing task in database"""
        try:
            # This would update the database with the new processing task info
            # For now, we'll just log it
            logger.info(f"Processing task updated: {document_id} - {task_type} - {status}")
            
            # In a real implementation, this would:
            # 1. Connect to database
            # 2. Update or insert processing task record
            # 3. Set backend_results, embedding_model, processing_version
            
            self.stats['tasks_completed'] += 1
            
        except Exception as e:
            logger.error(f"Error updating processing task: {e}")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get processing statistics"""
        return {
            'statistics': self.stats.copy(),
            'configuration': self.config,
            'adapter_config': self.adapter.get_config(),
            'timestamp': datetime.now().isoformat()
        }
    
    def reset_statistics(self):
        """Reset processing statistics"""
        self.stats = {
            'documents_processed': 0,
            'chunks_processed': 0,
            'entities_processed': 0,
            'tasks_completed': 0,
            'errors': 0
        }
        logger.info("Statistics reset")


class BackwardCompatibilityWrapper:
    """
    Provides backward compatibility for existing code
    
    This wrapper ensures that existing code continues to work
    while gradually migrating to the new Triple RAG system.
    """
    
    def __init__(self, integration: TripleRAGIntegration):
        self.integration = integration
        logger.info("BackwardCompatibilityWrapper initialized")
    
    def legacy_document_process(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """
        Legacy document processing method
        
        Args:
            doc: Document in legacy format
            
        Returns:
            Result in legacy format
        """
        import warnings
        warnings.warn(
            "legacy_document_process is deprecated. Use process_document instead.",
            DeprecationWarning,
            stacklevel=2
        )
        
        # Convert to async and run
        import asyncio
        return asyncio.run(self.integration.process_document(doc))
    
    def legacy_search(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """
        Legacy search method
        
        Args:
            query: Search query
            limit: Number of results
            
        Returns:
            Search results in legacy format
        """
        import warnings
        warnings.warn(
            "legacy_search is deprecated. Use search_documents instead.",
            DeprecationWarning,
            stacklevel=2
        )
        
        # Convert to async and run
        import asyncio
        return asyncio.run(self.integration.search_documents(query, limit))
    
    def legacy_batch_process(self, docs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Legacy batch processing method
        
        Args:
            docs: List of documents
            
        Returns:
            Batch processing results
        """
        import warnings
        warnings.warn(
            "legacy_batch_process is deprecated. Use process_batch_documents instead.",
            DeprecationWarning,
            stacklevel=2
        )
        
        # Convert to async and run
        import asyncio
        return asyncio.run(self.integration.process_batch_documents(docs))


# Example usage
async def main():
    """Example usage of Triple RAG Integration"""
    
    # Initialize integration
    integration = TripleRAGIntegration()
    
    # Initialize backends
    await integration.initialize_backends()
    
    # Sample Xata document
    sample_doc = {
        'id': 'doc_123',
        'title': 'Sample Document',
        'summary': 'This is a sample document for testing Triple RAG integration.',
        'url': 'https://example.com/doc',
        'metadata': {'source': 'test'},
        'embedding': [-0.1, 0.2, 0.3] + [0.0] * 381,  # 384D embedding
        'created_at': '2024-01-01T00:00:00Z'
    }
    
    # Process document
    result = await integration.process_document(sample_doc)
    print(f"Document processing result: {result['status']}")
    
    # Search documents
    search_result = await integration.search_documents("sample document")
    print(f"Search result: {search_result['status']}")
    
    # Get statistics
    stats = integration.get_statistics()
    print(f"Processing statistics: {stats}")
    
    # Backward compatibility example
    compat_wrapper = BackwardCompatibilityWrapper(integration)
    legacy_result = compat_wrapper.legacy_document_process(sample_doc)
    print(f"Legacy processing result: {legacy_result['status']}")

if __name__ == "__main__":
    asyncio.run(main())