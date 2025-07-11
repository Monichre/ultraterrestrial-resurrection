#!/usr/bin/env python3
"""
Triple RAG Schema Adapter
Date: July 9, 2025 at 07:45 PST

Bridges current Xata database schema with Triple RAG system requirements.
Implements adapter pattern to maintain backward compatibility while adding
Triple RAG capabilities.
"""

from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict
from datetime import datetime
import json
import logging
from pathlib import Path

# Configure logging
logger = logging.getLogger(__name__)

@dataclass
class TripleRAGDocument:
    """Standardized Triple RAG document format"""
    id: str
    title: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

@dataclass
class TripleRAGChunk:
    """Standardized Triple RAG chunk format"""
    id: str
    document_id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None
    chunk_index: Optional[int] = None

@dataclass
class TripleRAGEntity:
    """Standardized Triple RAG entity format"""
    id: str
    document_id: str
    entity_type: str
    entity_data: Dict[str, Any]
    confidence: float
    metadata: Dict[str, Any]

@dataclass
class TripleRAGProcessingTask:
    """Standardized Triple RAG processing task format"""
    id: str
    document_id: str
    task_type: str
    status: str
    backend_results: Dict[str, Any]
    embedding_model: str
    processing_version: str
    metadata: Dict[str, Any]
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

class TripleRAGSchemaAdapter:
    """
    Bridges current Xata schema with Triple RAG requirements
    
    This adapter provides a seamless interface between the existing Xata
    database schema and the Triple RAG system, preserving all existing
    functionality while adding enhanced capabilities.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the Triple RAG Schema Adapter
        
        Args:
            config: Optional configuration dictionary
        """
        self.config = config or self._load_default_config()
        self.embedding_dimension = self.config.get('embedding_dimension', 384)
        self.embedding_model = self.config.get('embedding_model', 'all-MiniLM-L6-v2')
        self.processing_version = self.config.get('processing_version', '1.0')
        
        logger.info(f"TripleRAGSchemaAdapter initialized with config: {self.config}")
    
    def _load_default_config(self) -> Dict[str, Any]:
        """Load default configuration"""
        return {
            'embedding_dimension': 384,
            'embedding_model': 'all-MiniLM-L6-v2',
            'processing_version': '1.0',
            'validate_embeddings': True,
            'preserve_metadata': True,
            'backward_compatible': True
        }
    
    def adapt_document(self, xata_doc: Dict[str, Any]) -> TripleRAGDocument:
        """
        Convert Xata document to Triple RAG format
        
        Args:
            xata_doc: Xata document with fields:
                - id, title, summary, url, date, processed, 
                - file_urls, images, metadata, author_id, 
                - organization_id, embedding, created_at, updated_at
        
        Returns:
            TripleRAGDocument: Standardized document format
        
        Raises:
            ValueError: If required fields are missing or invalid
            TypeError: If data types are invalid
        """
        if not isinstance(xata_doc, dict):
            raise TypeError(f"Expected dict, got {type(xata_doc)}")
        
        try:
            # Validate required fields
            required_fields = ['id']
            missing_fields = [field for field in required_fields if not xata_doc.get(field)]
            if missing_fields:
                raise ValueError(f"Missing required fields: {missing_fields}")
            
            # Extract and validate ID
            doc_id = str(xata_doc['id']).strip()
            if not doc_id:
                raise ValueError("Document ID cannot be empty")
            
            # Extract and validate title with fallback
            title = xata_doc.get('title', '').strip()
            if not title:
                # Try to create a title from other fields
                title = xata_doc.get('url', '').split('/')[-1] or f"Document {doc_id}"
                logger.warning(f"Document {doc_id} has no title, using: {title}")
            
            # Extract and validate embedding
            embedding = self._extract_embedding(xata_doc.get('embedding'))
            
            # Map summary to content (primary content field)
            content = xata_doc.get('summary', '') or xata_doc.get('content', '')
            if not content:
                logger.warning(f"Document {doc_id} has no content")
                content = ""  # Set to empty string rather than None
            
            # Validate content is string
            if not isinstance(content, str):
                content = str(content)
            
            # Build enhanced metadata
            metadata = self._build_document_metadata(xata_doc)
            
            # Validate dates
            created_at = self._validate_date(xata_doc.get('created_at'))
            updated_at = self._validate_date(xata_doc.get('updated_at'))
            
            # Create standardized document
            adapted_doc = TripleRAGDocument(
                id=doc_id,
                title=title,
                content=content,
                metadata=metadata,
                embedding=embedding,
                created_at=created_at,
                updated_at=updated_at
            )
            
            logger.debug(f"Successfully adapted document: {adapted_doc.id}")
            return adapted_doc
            
        except Exception as e:
            logger.error(f"Error adapting document {xata_doc.get('id', 'unknown')}: {e}")
            raise
    
    def adapt_chunk(self, xata_chunk: Dict[str, Any]) -> TripleRAGChunk:
        """
        Convert Xata chunk to Triple RAG format
        
        Args:
            xata_chunk: Xata chunk with fields:
                - id, document_id, chunk_index, content, token_count,
                - page_number, heading, embedding, created_at
        
        Returns:
            TripleRAGChunk: Standardized chunk format
        
        Raises:
            ValueError: If required fields are missing or invalid
            TypeError: If data types are invalid
        """
        if not isinstance(xata_chunk, dict):
            raise TypeError(f"Expected dict, got {type(xata_chunk)}")
        
        try:
            # Validate required fields
            required_fields = ['id', 'document_id', 'content']
            missing_fields = [field for field in required_fields if not xata_chunk.get(field)]
            if missing_fields:
                raise ValueError(f"Missing required fields: {missing_fields}")
            
            # Extract and validate ID
            chunk_id = str(xata_chunk['id']).strip()
            if not chunk_id:
                raise ValueError("Chunk ID cannot be empty")
            
            # Extract and validate document_id
            document_id = str(xata_chunk['document_id']).strip()
            if not document_id:
                raise ValueError("Document ID cannot be empty")
            
            # Extract and validate content
            content = xata_chunk.get('content', '').strip()
            if not content:
                logger.warning(f"Chunk {chunk_id} has no content")
                content = ""  # Set to empty string rather than None
            
            # Validate content is string
            if not isinstance(content, str):
                content = str(content)
            
            # Extract and validate chunk_index
            chunk_index = xata_chunk.get('chunk_index')
            if chunk_index is not None:
                try:
                    chunk_index = int(chunk_index)
                    if chunk_index < 0:
                        logger.warning(f"Chunk {chunk_id} has negative chunk_index: {chunk_index}")
                except (ValueError, TypeError):
                    logger.warning(f"Chunk {chunk_id} has invalid chunk_index: {chunk_index}")
                    chunk_index = None
            
            # Extract and validate embedding
            embedding = self._extract_embedding(xata_chunk.get('embedding'))
            
            # Build chunk metadata with enhanced contextual information
            metadata = self._build_chunk_metadata(xata_chunk)
            
            # Validate chunk-specific contextual fields
            self._validate_chunk_context(xata_chunk, chunk_id)
            
            # Create standardized chunk
            adapted_chunk = TripleRAGChunk(
                id=chunk_id,
                document_id=document_id,
                content=content,
                metadata=metadata,
                embedding=embedding,
                chunk_index=chunk_index
            )
            
            logger.debug(f"Successfully adapted chunk: {adapted_chunk.id}")
            return adapted_chunk
            
        except Exception as e:
            logger.error(f"Error adapting chunk {xata_chunk.get('id', 'unknown')}: {e}")
            raise
    
    def adapt_entity(self, xata_entity: Dict[str, Any]) -> TripleRAGEntity:
        """
        Convert Xata entity to Triple RAG format
        
        Args:
            xata_entity: Xata entity with fields:
                - id, document_id, entity_type, entity_data, 
                - confidence, start_position, end_position, 
                - metadata, created_at
        
        Returns:
            TripleRAGEntity: Standardized entity format
        """
        try:
            # Validate required fields
            required_fields = ['id', 'document_id', 'entity_type', 'entity_data']
            missing_fields = [field for field in required_fields if field not in xata_entity]
            if missing_fields:
                raise ValueError(f"Missing required fields: {missing_fields}")
            
            # Parse entity data
            entity_data = xata_entity.get('entity_data', {})
            if isinstance(entity_data, str):
                try:
                    entity_data = json.loads(entity_data)
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON in entity_data for {xata_entity.get('id')}")
                    entity_data = {'raw_data': entity_data}
            
            # Build entity metadata
            metadata = self._build_entity_metadata(xata_entity)
            
            # Create standardized entity
            adapted_entity = TripleRAGEntity(
                id=str(xata_entity['id']),
                document_id=str(xata_entity['document_id']),
                entity_type=str(xata_entity['entity_type']),
                entity_data=entity_data,
                confidence=float(xata_entity.get('confidence', 0.5)),
                metadata=metadata
            )
            
            logger.debug(f"Successfully adapted entity: {adapted_entity.id}")
            return adapted_entity
            
        except Exception as e:
            logger.error(f"Error adapting entity {xata_entity.get('id', 'unknown')}: {e}")
            raise
    
    def adapt_processing_task(self, xata_task: Dict[str, Any]) -> TripleRAGProcessingTask:
        """
        Convert Xata processing task to Triple RAG format
        
        Args:
            xata_task: Xata task with fields:
                - id, document_id, task_type, status, metadata,
                - started_at, completed_at, created_at
                - backend_results, embedding_model, processing_version (new fields)
        
        Returns:
            TripleRAGProcessingTask: Standardized task format
        """
        try:
            # Validate required fields
            required_fields = ['id', 'document_id', 'task_type', 'status']
            missing_fields = [field for field in required_fields if field not in xata_task]
            if missing_fields:
                raise ValueError(f"Missing required fields: {missing_fields}")
            
            # Parse backend results
            backend_results = xata_task.get('backend_results', {})
            if isinstance(backend_results, str):
                try:
                    backend_results = json.loads(backend_results)
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON in backend_results for {xata_task.get('id')}")
                    backend_results = {}
            
            # Build task metadata
            metadata = self._build_task_metadata(xata_task)
            
            # Create standardized task
            adapted_task = TripleRAGProcessingTask(
                id=str(xata_task['id']),
                document_id=str(xata_task['document_id']),
                task_type=str(xata_task['task_type']),
                status=str(xata_task['status']),
                backend_results=backend_results,
                embedding_model=xata_task.get('embedding_model', self.embedding_model),
                processing_version=xata_task.get('processing_version', self.processing_version),
                metadata=metadata,
                started_at=xata_task.get('started_at'),
                completed_at=xata_task.get('completed_at')
            )
            
            logger.debug(f"Successfully adapted processing task: {adapted_task.id}")
            return adapted_task
            
        except Exception as e:
            logger.error(f"Error adapting processing task {xata_task.get('id', 'unknown')}: {e}")
            raise
    
    def adapt_batch_documents(self, xata_docs: List[Dict[str, Any]]) -> List[TripleRAGDocument]:
        """
        Convert multiple Xata documents to Triple RAG format
        
        Args:
            xata_docs: List of Xata documents
        
        Returns:
            List[TripleRAGDocument]: List of adapted documents
        """
        adapted_docs = []
        errors = []
        
        for i, doc in enumerate(xata_docs):
            try:
                adapted_doc = self.adapt_document(doc)
                adapted_docs.append(adapted_doc)
            except Exception as e:
                error_msg = f"Error adapting document {i}: {e}"
                logger.error(error_msg)
                errors.append(error_msg)
        
        if errors:
            logger.warning(f"Batch adaptation completed with {len(errors)} errors")
        
        logger.info(f"Successfully adapted {len(adapted_docs)}/{len(xata_docs)} documents")
        return adapted_docs
    
    def adapt_batch_chunks(self, xata_chunks: List[Dict[str, Any]]) -> List[TripleRAGChunk]:
        """
        Convert multiple Xata chunks to Triple RAG format with enhanced validation
        
        Args:
            xata_chunks: List of Xata chunks
        
        Returns:
            List[TripleRAGChunk]: List of adapted chunks
        """
        if not isinstance(xata_chunks, list):
            raise TypeError(f"Expected list, got {type(xata_chunks)}")
        
        adapted_chunks = []
        errors = []
        validation_stats = {
            'valid': 0,
            'valid_with_warnings': 0,
            'invalid': 0,
            'total_warnings': 0,
            'total_errors': 0
        }
        
        logger.info(f"Starting batch adaptation of {len(xata_chunks)} chunks")
        
        for i, chunk in enumerate(xata_chunks):
            try:
                # Validate before adapting
                validation_report = self.validate_chunk_data(chunk)
                
                # Update validation statistics
                validation_stats[validation_report['status']] += 1
                validation_stats['total_warnings'] += len(validation_report['warnings'])
                validation_stats['total_errors'] += len(validation_report['errors'])
                
                # Only adapt if validation passed (valid or valid_with_warnings)
                if validation_report['status'] in ['valid', 'valid_with_warnings']:
                    adapted_chunk = self.adapt_chunk(chunk)
                    adapted_chunks.append(adapted_chunk)
                    
                    if validation_report['warnings']:
                        logger.debug(f"Chunk {i} adapted with warnings: {validation_report['warnings']}")
                else:
                    error_msg = f"Chunk {i} failed validation: {validation_report['errors']}"
                    logger.error(error_msg)
                    errors.append(error_msg)
                    
            except Exception as e:
                error_msg = f"Error adapting chunk {i}: {e}"
                logger.error(error_msg)
                errors.append(error_msg)
                validation_stats['invalid'] += 1
        
        # Log batch statistics
        success_rate = len(adapted_chunks) / len(xata_chunks) * 100 if xata_chunks else 0
        logger.info(f"Batch adaptation completed:")
        logger.info(f"  - Successfully adapted: {len(adapted_chunks)}/{len(xata_chunks)} ({success_rate:.1f}%)")
        logger.info(f"  - Valid chunks: {validation_stats['valid']}")
        logger.info(f"  - Valid with warnings: {validation_stats['valid_with_warnings']}")
        logger.info(f"  - Invalid chunks: {validation_stats['invalid']}")
        logger.info(f"  - Total warnings: {validation_stats['total_warnings']}")
        logger.info(f"  - Total errors: {validation_stats['total_errors']}")
        
        if errors:
            logger.warning(f"Batch adaptation completed with {len(errors)} errors")
        
        return adapted_chunks
    
    def get_batch_chunk_statistics(self, xata_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Get statistics about a batch of chunks without adapting them
        
        Args:
            xata_chunks: List of Xata chunks
            
        Returns:
            Dict[str, Any]: Batch statistics
        """
        if not isinstance(xata_chunks, list):
            raise TypeError(f"Expected list, got {type(xata_chunks)}")
        
        stats = {
            'total_chunks': len(xata_chunks),
            'validation_summary': {
                'valid': 0,
                'valid_with_warnings': 0,
                'invalid': 0,
                'validation_errors': 0
            },
            'field_completeness': {
                'id': 0,
                'document_id': 0,
                'content': 0,
                'chunk_index': 0,
                'token_count': 0,
                'page_number': 0,
                'heading': 0,
                'embedding': 0,
                'created_at': 0
            },
            'content_stats': {
                'empty_content': 0,
                'total_content_length': 0,
                'average_content_length': 0,
                'min_content_length': float('inf'),
                'max_content_length': 0
            },
            'embedding_stats': {
                'has_embedding': 0,
                'valid_embeddings': 0,
                'dimension_mismatches': 0
            }
        }
        
        content_lengths = []
        
        for chunk in xata_chunks:
            try:
                # Validate chunk
                validation_report = self.validate_chunk_data(chunk)
                stats['validation_summary'][validation_report['status']] += 1
            except Exception:
                stats['validation_summary']['validation_errors'] += 1
            
            # Check field completeness
            for field in stats['field_completeness']:
                if chunk.get(field) is not None:
                    stats['field_completeness'][field] += 1
            
            # Analyze content
            content = chunk.get('content', '')
            if isinstance(content, str):
                content_length = len(content)
                content_lengths.append(content_length)
                stats['content_stats']['total_content_length'] += content_length
                stats['content_stats']['min_content_length'] = min(
                    stats['content_stats']['min_content_length'], content_length
                )
                stats['content_stats']['max_content_length'] = max(
                    stats['content_stats']['max_content_length'], content_length
                )
                
                if not content.strip():
                    stats['content_stats']['empty_content'] += 1
            
            # Analyze embeddings
            embedding_data = chunk.get('embedding')
            if embedding_data:
                stats['embedding_stats']['has_embedding'] += 1
                try:
                    embedding = self._extract_embedding(embedding_data)
                    if embedding:
                        stats['embedding_stats']['valid_embeddings'] += 1
                        if len(embedding) != self.embedding_dimension:
                            stats['embedding_stats']['dimension_mismatches'] += 1
                except Exception:
                    pass  # Already counted as not valid
        
        # Calculate averages
        if content_lengths:
            stats['content_stats']['average_content_length'] = (
                stats['content_stats']['total_content_length'] / len(content_lengths)
            )
        else:
            stats['content_stats']['min_content_length'] = 0
        
        # Calculate percentages
        total = stats['total_chunks']
        if total > 0:
            for category in ['field_completeness', 'validation_summary', 'embedding_stats']:
                for key, value in stats[category].items():
                    stats[category][f"{key}_percentage"] = (value / total) * 100
        
        return stats
    
    def _validate_date(self, date_str: Any) -> Optional[str]:
        """
        Validate and normalize date string
        
        Args:
            date_str: Date string in various formats
            
        Returns:
            Optional[str]: Normalized ISO date string or None
        """
        if not date_str:
            return None
        
        try:
            # If it's already a string, validate it
            if isinstance(date_str, str):
                # Check if it's a valid ISO format
                from datetime import datetime
                try:
                    datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    return date_str
                except ValueError:
                    logger.warning(f"Invalid date format: {date_str}")
                    return None
            
            # If it's a datetime object, convert to ISO string
            elif hasattr(date_str, 'isoformat'):
                return date_str.isoformat()
            
            # Try to parse as string
            else:
                date_str = str(date_str)
                from datetime import datetime
                try:
                    datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    return date_str
                except ValueError:
                    logger.warning(f"Could not parse date: {date_str}")
                    return None
        
        except Exception as e:
            logger.error(f"Error validating date: {e}")
            return None
    
    def _extract_embedding(self, embedding_data: Any) -> Optional[List[float]]:
        """
        Extract and validate embedding from various formats
        
        Args:
            embedding_data: Embedding in various formats (list, string, etc.)
        
        Returns:
            Optional[List[float]]: Validated embedding or None
        
        Raises:
            ValueError: If embedding dimension validation fails with strict mode
        """
        if not embedding_data:
            return None
        
        try:
            # Handle different embedding formats
            if isinstance(embedding_data, list):
                embedding = [float(x) for x in embedding_data]
            elif isinstance(embedding_data, str):
                # Clean up the string (remove extra spaces, handle truncation)
                cleaned_str = embedding_data.strip()
                
                # Handle truncated embedding strings
                if cleaned_str.endswith('...'):
                    logger.warning("Embedding string appears truncated, cannot parse")
                    return None
                
                # Try to parse JSON array
                import ast
                import json
                
                try:
                    # Try JSON first
                    embedding = json.loads(cleaned_str)
                except json.JSONDecodeError:
                    # Fall back to ast.literal_eval
                    embedding = ast.literal_eval(cleaned_str)
                
                # Ensure all elements are floats
                embedding = [float(x) for x in embedding]
                
            elif isinstance(embedding_data, (int, float)):
                # Single value - this shouldn't happen for embeddings
                logger.warning(f"Single value provided for embedding: {embedding_data}")
                return None
            else:
                logger.warning(f"Unknown embedding format: {type(embedding_data)}")
                return None
            
            # Validate embedding dimension
            if self.config.get('validate_embeddings', True):
                expected_dim = self.embedding_dimension
                actual_dim = len(embedding)
                
                if actual_dim != expected_dim:
                    error_msg = (
                        f"Embedding dimension mismatch: expected {expected_dim}, "
                        f"got {actual_dim}"
                    )
                    
                    if self.config.get('strict_validation', False):
                        raise ValueError(error_msg)
                    else:
                        logger.warning(error_msg)
                        
                        # Try to handle dimension mismatch
                        if actual_dim < expected_dim:
                            # Pad with zeros
                            embedding.extend([0.0] * (expected_dim - actual_dim))
                            logger.info(f"Padded embedding to {expected_dim} dimensions")
                        elif actual_dim > expected_dim:
                            # Truncate
                            embedding = embedding[:expected_dim]
                            logger.info(f"Truncated embedding to {expected_dim} dimensions")
            
            # Validate embedding values
            if self.config.get('validate_embedding_values', True):
                for i, value in enumerate(embedding):
                    if not isinstance(value, (int, float)):
                        raise ValueError(f"Invalid embedding value at index {i}: {value}")
                    if not (-1.0 <= value <= 1.0):
                        logger.warning(f"Embedding value {value} at index {i} outside normal range [-1, 1]")
            
            return embedding
            
        except ValueError as e:
            logger.error(f"Validation error in embedding: {e}")
            if self.config.get('strict_validation', False):
                raise
            return None
        except Exception as e:
            logger.error(f"Error extracting embedding: {e}")
            return None
    
    def _build_document_metadata(self, xata_doc: Dict[str, Any]) -> Dict[str, Any]:
        """Build enhanced metadata for document"""
        metadata = {
            'source': 'xata_adapter',
            'adapter_version': self.processing_version,
            'adapted_at': datetime.now().isoformat(),
            'embedding_model': self.embedding_model,
            'embedding_dimension': self.embedding_dimension
        }
        
        # Preserve existing metadata
        if xata_doc.get('metadata'):
            if isinstance(xata_doc['metadata'], dict):
                metadata.update(xata_doc['metadata'])
            elif isinstance(xata_doc['metadata'], str):
                try:
                    parsed_metadata = json.loads(xata_doc['metadata'])
                    metadata.update(parsed_metadata)
                except json.JSONDecodeError:
                    metadata['raw_metadata'] = xata_doc['metadata']
        
        # Add Xata-specific fields
        xata_fields = {
            'url': xata_doc.get('url'),
            'date': xata_doc.get('date'),
            'processed': xata_doc.get('processed', False),
            'file_urls': xata_doc.get('file_urls'),
            'images': xata_doc.get('images'),
            'author_id': xata_doc.get('author_id'),
            'organization_id': xata_doc.get('organization_id')
        }
        
        # Only add non-None values
        for key, value in xata_fields.items():
            if value is not None:
                metadata[key] = value
        
        return metadata
    
    def _build_chunk_metadata(self, xata_chunk: Dict[str, Any]) -> Dict[str, Any]:
        """Build enhanced metadata for chunk with contextual information"""
        metadata = {
            'source': 'xata_adapter',
            'adapter_version': self.processing_version,
            'adapted_at': datetime.now().isoformat(),
            'embedding_model': self.embedding_model,
            'embedding_dimension': self.embedding_dimension
        }
        
        # Add chunk-specific fields with validation
        chunk_fields = {
            'token_count': self._validate_token_count(xata_chunk.get('token_count')),
            'page_number': self._validate_page_number(xata_chunk.get('page_number')),
            'heading': self._validate_heading(xata_chunk.get('heading')),
            'chunk_index': self._validate_chunk_index_metadata(xata_chunk.get('chunk_index')),
            'created_at': self._validate_date(xata_chunk.get('created_at'))
        }
        
        # Only add non-None values
        for key, value in chunk_fields.items():
            if value is not None:
                metadata[key] = value
        
        # Add content-based metadata
        content = xata_chunk.get('content', '')
        if content:
            metadata.update({
                'content_length': len(content),
                'content_preview': content[:100] + '...' if len(content) > 100 else content,
                'has_content': bool(content.strip())
            })
        
        # Add chunk position context
        if metadata.get('page_number') and metadata.get('chunk_index'):
            metadata['position_context'] = f"page_{metadata['page_number']}_chunk_{metadata['chunk_index']}"
        
        # Add heading hierarchy context
        heading = metadata.get('heading')
        if heading:
            metadata.update({
                'has_heading': True,
                'heading_length': len(heading),
                'heading_level': self._detect_heading_level(heading)
            })
        
        return metadata
    
    def _build_entity_metadata(self, xata_entity: Dict[str, Any]) -> Dict[str, Any]:
        """Build enhanced metadata for entity"""
        metadata = {
            'source': 'xata_adapter',
            'adapter_version': self.processing_version,
            'adapted_at': datetime.now().isoformat()
        }
        
        # Add entity-specific fields
        entity_fields = {
            'start_position': xata_entity.get('start_position'),
            'end_position': xata_entity.get('end_position'),
            'created_at': xata_entity.get('created_at'),
            'confidence': xata_entity.get('confidence')
        }
        
        # Preserve existing metadata
        if xata_entity.get('metadata'):
            if isinstance(xata_entity['metadata'], dict):
                metadata.update(xata_entity['metadata'])
            elif isinstance(xata_entity['metadata'], str):
                try:
                    parsed_metadata = json.loads(xata_entity['metadata'])
                    metadata.update(parsed_metadata)
                except json.JSONDecodeError:
                    metadata['raw_metadata'] = xata_entity['metadata']
        
        # Only add non-None values
        for key, value in entity_fields.items():
            if value is not None:
                metadata[key] = value
        
        return metadata
    
    def _build_task_metadata(self, xata_task: Dict[str, Any]) -> Dict[str, Any]:
        """Build enhanced metadata for processing task"""
        metadata = {
            'source': 'xata_adapter',
            'adapter_version': self.processing_version,
            'adapted_at': datetime.now().isoformat()
        }
        
        # Preserve existing metadata
        if xata_task.get('metadata'):
            if isinstance(xata_task['metadata'], dict):
                metadata.update(xata_task['metadata'])
            elif isinstance(xata_task['metadata'], str):
                try:
                    parsed_metadata = json.loads(xata_task['metadata'])
                    metadata.update(parsed_metadata)
                except json.JSONDecodeError:
                    metadata['raw_metadata'] = xata_task['metadata']
        
        # Add task-specific fields
        task_fields = {
            'created_at': xata_task.get('created_at'),
            'started_at': xata_task.get('started_at'),
            'completed_at': xata_task.get('completed_at')
        }
        
        # Only add non-None values
        for key, value in task_fields.items():
            if value is not None:
                metadata[key] = value
        
        return metadata
    
    def to_dict(self, adapted_obj: Union[TripleRAGDocument, TripleRAGChunk, TripleRAGEntity, TripleRAGProcessingTask]) -> Dict[str, Any]:
        """
        Convert adapted object to dictionary
        
        Args:
            adapted_obj: Any adapted object
        
        Returns:
            Dict[str, Any]: Dictionary representation
        """
        return asdict(adapted_obj)
    
    def get_config(self) -> Dict[str, Any]:
        """Get current adapter configuration"""
        return self.config.copy()
    
    def update_config(self, new_config: Dict[str, Any]) -> None:
        """Update adapter configuration"""
        self.config.update(new_config)
        logger.info(f"Updated adapter configuration: {new_config}")
    
    def validate_document_data(self, xata_doc: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate document data and return validation report
        
        Args:
            xata_doc: Document to validate
            
        Returns:
            Dict[str, Any]: Validation report with status, errors, warnings
        """
        report = {
            'status': 'valid',
            'errors': [],
            'warnings': [],
            'document_id': xata_doc.get('id', 'unknown')
        }
        
        try:
            # Check required fields
            required_fields = ['id']
            for field in required_fields:
                if not xata_doc.get(field):
                    report['errors'].append(f"Missing required field: {field}")
            
            # Check optional but important fields
            important_fields = ['title', 'summary', 'content']
            for field in important_fields:
                if not xata_doc.get(field):
                    report['warnings'].append(f"Missing recommended field: {field}")
            
            # Validate embedding
            embedding_data = xata_doc.get('embedding')
            if embedding_data:
                try:
                    embedding = self._extract_embedding(embedding_data)
                    if embedding:
                        if len(embedding) != self.embedding_dimension:
                            report['warnings'].append(
                                f"Embedding dimension mismatch: expected {self.embedding_dimension}, got {len(embedding)}"
                            )
                    else:
                        report['warnings'].append("Failed to parse embedding data")
                except Exception as e:
                    report['errors'].append(f"Embedding validation error: {e}")
            else:
                report['warnings'].append("No embedding data provided")
            
            # Validate dates
            for date_field in ['created_at', 'updated_at', 'date']:
                if xata_doc.get(date_field):
                    if not self._validate_date(xata_doc[date_field]):
                        report['warnings'].append(f"Invalid date format in {date_field}")
            
            # Set overall status
            if report['errors']:
                report['status'] = 'invalid'
            elif report['warnings']:
                report['status'] = 'valid_with_warnings'
            
        except Exception as e:
            report['status'] = 'validation_error'
            report['errors'].append(f"Validation process error: {e}")
        
        return report
    
    def _validate_chunk_context(self, xata_chunk: Dict[str, Any], chunk_id: str) -> None:
        """
        Validate chunk-specific contextual fields
        
        Args:
            xata_chunk: The chunk data to validate
            chunk_id: The chunk ID for logging
        """
        # Validate token_count
        token_count = xata_chunk.get('token_count')
        if token_count is not None:
            try:
                token_count = int(token_count)
                if token_count < 0:
                    logger.warning(f"Chunk {chunk_id} has negative token_count: {token_count}")
                elif token_count > 100000:  # Reasonable upper limit
                    logger.warning(f"Chunk {chunk_id} has unusually large token_count: {token_count}")
            except (ValueError, TypeError):
                logger.warning(f"Chunk {chunk_id} has invalid token_count: {token_count}")
        
        # Validate page_number
        page_number = xata_chunk.get('page_number')
        if page_number is not None:
            try:
                page_number = int(page_number)
                if page_number <= 0:
                    logger.warning(f"Chunk {chunk_id} has invalid page_number: {page_number}")
            except (ValueError, TypeError):
                logger.warning(f"Chunk {chunk_id} has invalid page_number: {page_number}")
        
        # Validate heading
        heading = xata_chunk.get('heading')
        if heading is not None and not isinstance(heading, str):
            logger.warning(f"Chunk {chunk_id} has non-string heading: {type(heading)}")
    
    def _validate_token_count(self, token_count: Any) -> Optional[int]:
        """Validate and normalize token count"""
        if token_count is None:
            return None
        
        try:
            count = int(token_count)
            if count < 0:
                logger.warning(f"Negative token count: {count}")
                return None
            if count > 100000:
                logger.warning(f"Unusually large token count: {count}")
            return count
        except (ValueError, TypeError):
            logger.warning(f"Invalid token count: {token_count}")
            return None
    
    def _validate_page_number(self, page_number: Any) -> Optional[int]:
        """Validate and normalize page number"""
        if page_number is None:
            return None
        
        try:
            page = int(page_number)
            if page <= 0:
                logger.warning(f"Invalid page number: {page}")
                return None
            if page > 10000:  # Reasonable upper limit
                logger.warning(f"Unusually large page number: {page}")
            return page
        except (ValueError, TypeError):
            logger.warning(f"Invalid page number: {page_number}")
            return None
    
    def _validate_heading(self, heading: Any) -> Optional[str]:
        """Validate and normalize heading"""
        if heading is None:
            return None
        
        if not isinstance(heading, str):
            heading = str(heading)
        
        heading = heading.strip()
        if not heading:
            return None
        
        # Reasonable length limit
        if len(heading) > 500:
            logger.warning(f"Heading exceeds reasonable length: {len(heading)} chars")
            heading = heading[:500] + "..."
        
        return heading
    
    def _validate_chunk_index_metadata(self, chunk_index: Any) -> Optional[int]:
        """Validate chunk index for metadata (allows None)"""
        if chunk_index is None:
            return None
        
        try:
            index = int(chunk_index)
            if index < 0:
                logger.warning(f"Negative chunk index: {index}")
                return None
            return index
        except (ValueError, TypeError):
            logger.warning(f"Invalid chunk index: {chunk_index}")
            return None
    
    def _detect_heading_level(self, heading: str) -> int:
        """
        Detect heading level based on formatting patterns
        
        Args:
            heading: The heading text
            
        Returns:
            int: Estimated heading level (1-6)
        """
        if not heading:
            return 0
        
        # Check for markdown-style headers
        if heading.startswith('# '):
            return 1
        elif heading.startswith('## '):
            return 2
        elif heading.startswith('### '):
            return 3
        elif heading.startswith('#### '):
            return 4
        elif heading.startswith('##### '):
            return 5
        elif heading.startswith('###### '):
            return 6
        
        # Check for all caps (likely higher level)
        if heading.isupper():
            return 1
        
        # Check for title case patterns
        if heading.istitle():
            return 2
        
        # Default to level 3 for other headings
        return 3
    
    def validate_chunk_data(self, xata_chunk: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate chunk data and return validation report
        
        Args:
            xata_chunk: Chunk to validate
            
        Returns:
            Dict[str, Any]: Validation report with status, errors, warnings
        """
        report = {
            'status': 'valid',
            'errors': [],
            'warnings': [],
            'chunk_id': xata_chunk.get('id', 'unknown')
        }
        
        try:
            # Check required fields
            required_fields = ['id', 'document_id', 'content']
            for field in required_fields:
                if not xata_chunk.get(field):
                    report['errors'].append(f"Missing required field: {field}")
            
            # Check optional but important fields
            important_fields = ['chunk_index', 'token_count']
            for field in important_fields:
                if not xata_chunk.get(field):
                    report['warnings'].append(f"Missing recommended field: {field}")
            
            # Validate embedding
            embedding_data = xata_chunk.get('embedding')
            if embedding_data:
                try:
                    embedding = self._extract_embedding(embedding_data)
                    if embedding:
                        if len(embedding) != self.embedding_dimension:
                            report['warnings'].append(
                                f"Embedding dimension mismatch: expected {self.embedding_dimension}, got {len(embedding)}"
                            )
                    else:
                        report['warnings'].append("Failed to parse embedding data")
                except Exception as e:
                    report['errors'].append(f"Embedding validation error: {e}")
            else:
                report['warnings'].append("No embedding data provided")
            
            # Validate contextual fields
            self._validate_chunk_context_for_report(xata_chunk, report)
            
            # Set overall status
            if report['errors']:
                report['status'] = 'invalid'
            elif report['warnings']:
                report['status'] = 'valid_with_warnings'
            
        except Exception as e:
            report['status'] = 'validation_error'
            report['errors'].append(f"Validation process error: {e}")
        
        return report
    
    def _validate_chunk_context_for_report(self, xata_chunk: Dict[str, Any], report: Dict[str, Any]) -> None:
        """Validate chunk context and add to report"""
        chunk_id = xata_chunk.get('id', 'unknown')
        
        # Check token_count
        token_count = xata_chunk.get('token_count')
        if token_count is not None:
            try:
                count = int(token_count)
                if count < 0:
                    report['warnings'].append(f"Negative token count: {count}")
                elif count == 0:
                    report['warnings'].append("Zero token count for chunk with content")
                elif count > 100000:
                    report['warnings'].append(f"Unusually large token count: {count}")
            except (ValueError, TypeError):
                report['warnings'].append(f"Invalid token count format: {token_count}")
        
        # Check page_number
        page_number = xata_chunk.get('page_number')
        if page_number is not None:
            try:
                page = int(page_number)
                if page <= 0:
                    report['warnings'].append(f"Invalid page number: {page}")
            except (ValueError, TypeError):
                report['warnings'].append(f"Invalid page number format: {page_number}")
        
        # Check chunk_index
        chunk_index = xata_chunk.get('chunk_index')
        if chunk_index is not None:
            try:
                index = int(chunk_index)
                if index < 0:
                    report['warnings'].append(f"Negative chunk index: {index}")
            except (ValueError, TypeError):
                report['warnings'].append(f"Invalid chunk index format: {chunk_index}")
        
        # Check content
        content = xata_chunk.get('content', '')
        if not content or not content.strip():
            report['warnings'].append("Empty chunk content")
        elif len(content) < 10:
            report['warnings'].append(f"Very short chunk content: {len(content)} characters")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get adapter statistics and configuration"""
        return {
            'config': self.config,
            'embedding_dimension': self.embedding_dimension,
            'embedding_model': self.embedding_model,
            'processing_version': self.processing_version,
            'supported_formats': [
                'TripleRAGDocument',
                'TripleRAGChunk', 
                'TripleRAGEntity',
                'TripleRAGProcessingTask'
            ]
        }


# Example usage and testing
if __name__ == "__main__":
    import time
    
    # Configure logging for testing
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    
    print("=" * 80)
    print("TRIPLE RAG SCHEMA ADAPTER - CHUNK ADAPTATION TESTING")
    print("=" * 80)
    print(f"Date: {datetime.now().isoformat()}")
    print()
    
    # Initialize adapter with test configuration
    test_config = {
        'embedding_dimension': 384,
        'embedding_model': 'all-MiniLM-L6-v2',
        'processing_version': '1.0',
        'validate_embeddings': True,
        'preserve_metadata': True,
        'backward_compatible': True,
        'strict_validation': False
    }
    
    adapter = TripleRAGSchemaAdapter(config=test_config)
    print(f"✅ Adapter initialized with config: {test_config}")
    print()
    
    # =============================================================================
    # SINGLE CHUNK ADAPTATION TESTS
    # =============================================================================
    print("🧪 SINGLE CHUNK ADAPTATION TESTS")
    print("-" * 50)
    
    # Test Case 1: Complete chunk with all fields
    print("Test Case 1: Complete chunk with all fields")
    complete_chunk = {
        'id': 'chunk_complete_001',
        'document_id': 'doc_ufo_disclosure_123',
        'chunk_index': 0,
        'content': 'This is a comprehensive chunk containing detailed information about UFO sightings and government disclosure. It includes multiple sentences and contextual information that would be useful for retrieval.',
        'token_count': 32,
        'page_number': 1,
        'heading': '# Executive Summary',
        'embedding': [-0.1, 0.2, 0.3, -0.4, 0.5] + [0.0] * 379,  # 384D embedding
        'created_at': '2025-07-09T07:45:00Z'
    }
    
    try:
        start_time = time.time()
        adapted_chunk = adapter.adapt_chunk(complete_chunk)
        adaptation_time = time.time() - start_time
        
        print(f"  ✅ SUCCESS: Adapted in {adaptation_time:.4f}s")
        print(f"     ID: {adapted_chunk.id}")
        print(f"     Document ID: {adapted_chunk.document_id}")
        print(f"     Content length: {len(adapted_chunk.content)} chars")
        print(f"     Chunk index: {adapted_chunk.chunk_index}")
        print(f"     Embedding dimension: {len(adapted_chunk.embedding) if adapted_chunk.embedding else 'None'}")
        print(f"     Metadata keys: {list(adapted_chunk.metadata.keys())}")
        print(f"     Position context: {adapted_chunk.metadata.get('position_context', 'N/A')}")
        print(f"     Heading level: {adapted_chunk.metadata.get('heading_level', 'N/A')}")
        print()
        
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        print()
    
    # Test Case 2: Minimal chunk (required fields only)
    print("Test Case 2: Minimal chunk (required fields only)")
    minimal_chunk = {
        'id': 'chunk_minimal_002',
        'document_id': 'doc_minimal_456',
        'content': 'Minimal content.'
    }
    
    try:
        adapted_chunk = adapter.adapt_chunk(minimal_chunk)
        print(f"  ✅ SUCCESS: Minimal chunk adapted")
        print(f"     ID: {adapted_chunk.id}")
        print(f"     Content: {adapted_chunk.content}")
        print(f"     Chunk index: {adapted_chunk.chunk_index}")
        print(f"     Metadata keys: {list(adapted_chunk.metadata.keys())}")
        print()
        
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        print()
    
    # Test Case 3: Chunk with invalid data (should handle gracefully)
    print("Test Case 3: Chunk with problematic data")
    problematic_chunk = {
        'id': 'chunk_problem_003',
        'document_id': 'doc_problem_789',
        'content': 'Content with problematic metadata.',
        'chunk_index': 'invalid_index',  # Should be int
        'token_count': -5,  # Negative token count
        'page_number': 0,  # Invalid page number
        'heading': '  ',  # Empty heading
        'embedding': 'invalid_embedding_format'  # Invalid embedding
    }
    
    try:
        adapted_chunk = adapter.adapt_chunk(problematic_chunk)
        print(f"  ✅ SUCCESS: Handled problematic data gracefully")
        print(f"     ID: {adapted_chunk.id}")
        print(f"     Chunk index: {adapted_chunk.chunk_index}")
        print(f"     Embedding: {'Present' if adapted_chunk.embedding else 'None'}")
        print(f"     Warnings in metadata: {[k for k in adapted_chunk.metadata.keys() if 'warning' in k.lower()]}")
        print()
        
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        print()
    
    # =============================================================================
    # CHUNK VALIDATION TESTS
    # =============================================================================
    print("🔍 CHUNK VALIDATION TESTS")
    print("-" * 50)
    
    test_chunks = [complete_chunk, minimal_chunk, problematic_chunk]
    
    for i, chunk in enumerate(test_chunks, 1):
        print(f"Validation Test {i}: {chunk['id']}")
        validation_report = adapter.validate_chunk_data(chunk)
        print(f"  Status: {validation_report['status']}")
        if validation_report['errors']:
            print(f"  Errors: {validation_report['errors']}")
        if validation_report['warnings']:
            print(f"  Warnings: {validation_report['warnings']}")
        print()
    
    # =============================================================================
    # BATCH CHUNK ADAPTATION TESTS
    # =============================================================================
    print("📦 BATCH CHUNK ADAPTATION TESTS")
    print("-" * 50)
    
    # Create a batch of test chunks
    batch_chunks = []
    
    # Add several complete chunks
    for i in range(3):
        chunk = {
            'id': f'chunk_batch_{i:03d}',
            'document_id': f'doc_batch_{i//2}',  # Multiple chunks per document
            'chunk_index': i % 3,
            'content': f'This is batch chunk {i} with content about UFO disclosure topic {i}. ' * (i + 1),
            'token_count': (i + 1) * 15,
            'page_number': (i // 3) + 1,
            'heading': f'## Section {i + 1}',
            'embedding': [0.1 * i, -0.1 * i, 0.2 * i] + [0.0] * 381,
            'created_at': f'2025-07-09T{7 + i:02d}:45:00Z'
        }
        batch_chunks.append(chunk)
    
    # Add some incomplete chunks
    batch_chunks.extend([
        {
            'id': 'chunk_incomplete_001',
            'document_id': 'doc_incomplete',
            'content': 'Incomplete chunk without optional fields.'
        },
        {
            'id': 'chunk_invalid_002',
            'document_id': '',  # Empty document_id (should fail)
            'content': 'Invalid chunk.'
        }
    ])
    
    print(f"Testing batch adaptation with {len(batch_chunks)} chunks")
    
    try:
        start_time = time.time()
        adapted_batch = adapter.adapt_batch_chunks(batch_chunks)
        batch_time = time.time() - start_time
        
        print(f"✅ BATCH SUCCESS: Adapted {len(adapted_batch)}/{len(batch_chunks)} chunks in {batch_time:.4f}s")
        print(f"   Average time per chunk: {batch_time/len(batch_chunks):.4f}s")
        print()
        
        # Show sample of adapted chunks
        print("Sample of adapted chunks:")
        for i, chunk in enumerate(adapted_batch[:3]):
            print(f"  {i+1}. {chunk.id} - {len(chunk.content)} chars - {chunk.metadata.get('token_count', 'N/A')} tokens")
        
        if len(adapted_batch) > 3:
            print(f"  ... and {len(adapted_batch) - 3} more")
        print()
        
    except Exception as e:
        print(f"❌ BATCH ERROR: {e}")
        print()
    
    # =============================================================================
    # BATCH STATISTICS TESTS
    # =============================================================================
    print("📊 BATCH STATISTICS TESTS")
    print("-" * 50)
    
    try:
        stats = adapter.get_batch_chunk_statistics(batch_chunks)
        print(f"Batch Statistics for {stats['total_chunks']} chunks:")
        print()
        
        print("Validation Summary:")
        for status, count in stats['validation_summary'].items():
            if not status.endswith('_percentage'):
                percentage = stats['validation_summary'].get(f'{status}_percentage', 0)
                print(f"  {status.replace('_', ' ').title()}: {count} ({percentage:.1f}%)")
        print()
        
        print("Field Completeness:")
        for field, count in stats['field_completeness'].items():
            if not field.endswith('_percentage'):
                percentage = stats['field_completeness'].get(f'{field}_percentage', 0)
                print(f"  {field}: {count}/{stats['total_chunks']} ({percentage:.1f}%)")
        print()
        
        print("Content Statistics:")
        print(f"  Total content length: {stats['content_stats']['total_content_length']:,} chars")
        print(f"  Average content length: {stats['content_stats']['average_content_length']:.1f} chars")
        print(f"  Min content length: {stats['content_stats']['min_content_length']} chars")
        print(f"  Max content length: {stats['content_stats']['max_content_length']} chars")
        print(f"  Empty content chunks: {stats['content_stats']['empty_content']}")
        print()
        
        print("Embedding Statistics:")
        for stat, count in stats['embedding_stats'].items():
            if not stat.endswith('_percentage'):
                percentage = stats['embedding_stats'].get(f'{stat}_percentage', 0)
                print(f"  {stat.replace('_', ' ').title()}: {count} ({percentage:.1f}%)")
        print()
        
    except Exception as e:
        print(f"❌ STATISTICS ERROR: {e}")
        print()
    
    # =============================================================================
    # ADAPTER CONFIGURATION TESTS
    # =============================================================================
    print("⚙️  ADAPTER CONFIGURATION TESTS")
    print("-" * 50)
    
    # Test adapter statistics
    adapter_stats = adapter.get_statistics()
    print("Adapter Configuration:")
    for key, value in adapter_stats.items():
        if key != 'config':
            print(f"  {key}: {value}")
    print()
    
    print("=" * 80)
    print("CHUNK ADAPTATION TESTING COMPLETED SUCCESSFULLY")
    print("=" * 80)