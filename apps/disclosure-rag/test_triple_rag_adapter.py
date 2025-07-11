#!/usr/bin/env python3
"""
Unit Tests for Triple RAG Schema Adapter
Date: July 9, 2025 at 08:15 PST

Comprehensive test suite for document adaptation functionality
"""

import unittest
import json
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock
from typing import Dict, Any, List

# Add the lib directory to the path
sys.path.insert(0, str(Path(__file__).parent / "lib"))

from adapters.triple_rag_schema_adapter import (
    TripleRAGSchemaAdapter,
    TripleRAGDocument,
    TripleRAGChunk,
    TripleRAGEntity,
    TripleRAGProcessingTask
)

class TestTripleRAGSchemaAdapter(unittest.TestCase):
    """Test suite for Triple RAG Schema Adapter"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.adapter = TripleRAGSchemaAdapter()
        self.sample_embedding = [-0.1, 0.2, 0.3] + [0.0] * 381  # 384D embedding
        
        # Sample Xata document with all fields
        self.sample_xata_doc = {
            'id': 'rec_test_123',
            'title': 'Test Document Title',
            'summary': 'This is a test document summary for testing purposes.',
            'url': 'https://example.com/test-doc',
            'date': '2024-01-01T00:00:00Z',
            'processed': True,
            'file': 'test-document.pdf',
            'images': '["image1.jpg", "image2.jpg"]',
            'metadata': '{"source": "test", "category": "unit_test"}',
            'author': 'Test Author',
            'organization': 'Test Organization',
            'embedding': json.dumps(self.sample_embedding),
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T12:00:00Z'
        }
        
        # Sample with minimal required fields
        self.minimal_xata_doc = {
            'id': 'rec_minimal_456',
            'title': 'Minimal Document',
            'summary': 'Minimal content'
        }
        
        # Sample with embedding dimension mismatch
        self.bad_embedding_doc = {
            'id': 'rec_bad_embed_789',
            'title': 'Bad Embedding Document',
            'summary': 'Document with wrong embedding dimension',
            'embedding': json.dumps([0.1, 0.2, 0.3])  # Only 3 dimensions
        }
    
    def test_adapter_initialization(self):
        """Test adapter initialization with different configurations"""
        # Test default initialization
        adapter = TripleRAGSchemaAdapter()
        self.assertEqual(adapter.embedding_dimension, 384)
        self.assertEqual(adapter.embedding_model, 'all-MiniLM-L6-v2')
        
        # Test custom configuration
        config = {
            'embedding_dimension': 512,
            'embedding_model': 'custom-model',
            'strict_validation': True
        }
        adapter = TripleRAGSchemaAdapter(config)
        self.assertEqual(adapter.embedding_dimension, 512)
        self.assertEqual(adapter.embedding_model, 'custom-model')
        self.assertTrue(adapter.config['strict_validation'])
    
    def test_document_adaptation_success(self):
        """Test successful document adaptation"""
        adapted_doc = self.adapter.adapt_document(self.sample_xata_doc)
        
        # Check basic fields
        self.assertEqual(adapted_doc.id, 'rec_test_123')
        self.assertEqual(adapted_doc.title, 'Test Document Title')
        self.assertEqual(adapted_doc.content, 'This is a test document summary for testing purposes.')
        
        # Check embedding
        self.assertIsNotNone(adapted_doc.embedding)
        self.assertEqual(len(adapted_doc.embedding), 384)
        self.assertEqual(adapted_doc.embedding[:3], [-0.1, 0.2, 0.3])
        
        # Check metadata
        self.assertIn('source', adapted_doc.metadata)
        self.assertIn('adapter_version', adapted_doc.metadata)
        self.assertIn('url', adapted_doc.metadata)
        
        # Check dates
        self.assertEqual(adapted_doc.created_at, '2024-01-01T00:00:00Z')
        self.assertEqual(adapted_doc.updated_at, '2024-01-01T12:00:00Z')
    
    def test_document_adaptation_minimal(self):
        """Test document adaptation with minimal fields"""
        adapted_doc = self.adapter.adapt_document(self.minimal_xata_doc)
        
        self.assertEqual(adapted_doc.id, 'rec_minimal_456')
        self.assertEqual(adapted_doc.title, 'Minimal Document')
        self.assertEqual(adapted_doc.content, 'Minimal content')
        self.assertIsNone(adapted_doc.embedding)
        self.assertIsNotNone(adapted_doc.metadata)
    
    def test_document_adaptation_missing_id(self):
        """Test document adaptation with missing ID"""
        bad_doc = {'title': 'No ID Document'}
        
        with self.assertRaises(ValueError) as context:
            self.adapter.adapt_document(bad_doc)
        
        self.assertIn("Missing required fields", str(context.exception))
    
    def test_document_adaptation_invalid_type(self):
        """Test document adaptation with invalid input type"""
        with self.assertRaises(TypeError):
            self.adapter.adapt_document("not a dict")
    
    def test_embedding_extraction_list_format(self):
        """Test embedding extraction from list format"""
        embedding_list = [0.1, 0.2, 0.3] + [0.0] * 381
        result = self.adapter._extract_embedding(embedding_list)
        
        self.assertEqual(len(result), 384)
        self.assertEqual(result[:3], [0.1, 0.2, 0.3])
    
    def test_embedding_extraction_json_string(self):
        """Test embedding extraction from JSON string"""
        embedding_json = json.dumps([0.1, 0.2, 0.3] + [0.0] * 381)
        result = self.adapter._extract_embedding(embedding_json)
        
        self.assertEqual(len(result), 384)
        self.assertEqual(result[:3], [0.1, 0.2, 0.3])
    
    def test_embedding_extraction_dimension_mismatch(self):
        """Test embedding extraction with dimension mismatch"""
        short_embedding = [0.1, 0.2, 0.3]
        
        # With default config (not strict), should pad with zeros
        result = self.adapter._extract_embedding(short_embedding)
        self.assertEqual(len(result), 384)
        self.assertEqual(result[:3], [0.1, 0.2, 0.3])
        self.assertEqual(result[3:], [0.0] * 381)
    
    def test_embedding_extraction_strict_validation(self):
        """Test embedding extraction with strict validation"""
        # Enable strict validation
        self.adapter.config['strict_validation'] = True
        
        short_embedding = [0.1, 0.2, 0.3]
        
        with self.assertRaises(ValueError) as context:
            self.adapter._extract_embedding(short_embedding)
        
        self.assertIn("Embedding dimension mismatch", str(context.exception))
    
    def test_embedding_extraction_invalid_format(self):
        """Test embedding extraction with invalid format"""
        # Test with non-parseable string
        result = self.adapter._extract_embedding("not a valid embedding")
        self.assertIsNone(result)
        
        # Test with empty data
        result = self.adapter._extract_embedding(None)
        self.assertIsNone(result)
        
        # Test with single value
        result = self.adapter._extract_embedding(0.5)
        self.assertIsNone(result)
    
    def test_date_validation_valid_iso(self):
        """Test date validation with valid ISO format"""
        valid_date = '2024-01-01T00:00:00Z'
        result = self.adapter._validate_date(valid_date)
        self.assertEqual(result, valid_date)
    
    def test_date_validation_invalid_format(self):
        """Test date validation with invalid format"""
        invalid_date = 'not a date'
        result = self.adapter._validate_date(invalid_date)
        self.assertIsNone(result)
    
    def test_date_validation_empty(self):
        """Test date validation with empty input"""
        result = self.adapter._validate_date(None)
        self.assertIsNone(result)
        
        result = self.adapter._validate_date('')
        self.assertIsNone(result)
    
    def test_document_validation_report(self):
        """Test document validation report generation"""
        report = self.adapter.validate_document_data(self.sample_xata_doc)
        
        self.assertEqual(report['status'], 'valid')
        self.assertEqual(len(report['errors']), 0)
        self.assertEqual(report['document_id'], 'rec_test_123')
    
    def test_document_validation_with_warnings(self):
        """Test document validation with warnings"""
        doc_with_warnings = {
            'id': 'rec_warnings_123',
            'title': 'Document with Warnings',
            # Missing summary/content
            'embedding': json.dumps([0.1, 0.2])  # Wrong dimension
        }
        
        report = self.adapter.validate_document_data(doc_with_warnings)
        
        self.assertEqual(report['status'], 'valid_with_warnings')
        self.assertTrue(len(report['warnings']) > 0)
        self.assertEqual(len(report['errors']), 0)
    
    def test_document_validation_with_errors(self):
        """Test document validation with errors"""
        doc_with_errors = {
            'title': 'Document without ID'
            # Missing required ID field
        }
        
        report = self.adapter.validate_document_data(doc_with_errors)
        
        self.assertEqual(report['status'], 'invalid')
        self.assertTrue(len(report['errors']) > 0)
    
    def test_batch_document_adaptation(self):
        """Test batch document adaptation"""
        docs = [self.sample_xata_doc, self.minimal_xata_doc]
        
        adapted_docs = self.adapter.adapt_batch_documents(docs)
        
        self.assertEqual(len(adapted_docs), 2)
        self.assertEqual(adapted_docs[0].id, 'rec_test_123')
        self.assertEqual(adapted_docs[1].id, 'rec_minimal_456')
    
    def test_batch_document_adaptation_with_errors(self):
        """Test batch document adaptation with some errors"""
        docs = [
            self.sample_xata_doc,
            {'invalid': 'document'},  # Missing required fields
            self.minimal_xata_doc
        ]
        
        adapted_docs = self.adapter.adapt_batch_documents(docs)
        
        # Should get 2 successful adaptations, 1 error
        self.assertEqual(len(adapted_docs), 2)
        self.assertEqual(adapted_docs[0].id, 'rec_test_123')
        self.assertEqual(adapted_docs[1].id, 'rec_minimal_456')
    
    def test_config_update(self):
        """Test configuration update"""
        original_dim = self.adapter.embedding_dimension
        
        new_config = {'embedding_dimension': 512}
        self.adapter.update_config(new_config)
        
        self.assertEqual(self.adapter.config['embedding_dimension'], 512)
        # Note: embedding_dimension property should be updated too
    
    def test_statistics_retrieval(self):
        """Test statistics retrieval"""
        stats = self.adapter.get_statistics()
        
        self.assertIn('config', stats)
        self.assertIn('embedding_dimension', stats)
        self.assertIn('embedding_model', stats)
        self.assertIn('supported_formats', stats)
        self.assertEqual(len(stats['supported_formats']), 4)
    
    def test_to_dict_conversion(self):
        """Test converting adapted objects to dictionary"""
        adapted_doc = self.adapter.adapt_document(self.sample_xata_doc)
        doc_dict = self.adapter.to_dict(adapted_doc)
        
        self.assertIsInstance(doc_dict, dict)
        self.assertEqual(doc_dict['id'], 'rec_test_123')
        self.assertEqual(doc_dict['title'], 'Test Document Title')
    
    def test_chunk_adaptation(self):
        """Test chunk adaptation"""
        sample_chunk = {
            'id': 'chunk_test_123',
            'document_id': 'doc_test_456',
            'content': 'This is a test chunk content.',
            'chunk_index': 0,
            'token_count': 10,
            'embedding': json.dumps(self.sample_embedding)
        }
        
        adapted_chunk = self.adapter.adapt_chunk(sample_chunk)
        
        self.assertEqual(adapted_chunk.id, 'chunk_test_123')
        self.assertEqual(adapted_chunk.document_id, 'doc_test_456')
        self.assertEqual(adapted_chunk.content, 'This is a test chunk content.')
        self.assertEqual(adapted_chunk.chunk_index, 0)
        self.assertIsNotNone(adapted_chunk.embedding)
    
    def test_entity_adaptation(self):
        """Test entity adaptation"""
        sample_entity = {
            'id': 'entity_test_123',
            'document_id': 'doc_test_456',
            'entity_type': 'PERSON',
            'entity_data': '{"name": "John Doe", "confidence": 0.95}',
            'confidence': 0.95
        }
        
        adapted_entity = self.adapter.adapt_entity(sample_entity)
        
        self.assertEqual(adapted_entity.id, 'entity_test_123')
        self.assertEqual(adapted_entity.document_id, 'doc_test_456')
        self.assertEqual(adapted_entity.entity_type, 'PERSON')
        self.assertEqual(adapted_entity.confidence, 0.95)
        self.assertIsInstance(adapted_entity.entity_data, dict)
    
    def test_processing_task_adaptation(self):
        """Test processing task adaptation"""
        sample_task = {
            'id': 'task_test_123',
            'document_id': 'doc_test_456',
            'task_type': 'EMBEDDING_GENERATION',
            'status': 'COMPLETED',
            'backend_results': '{"embedding_model": "all-MiniLM-L6-v2", "success": true}'
        }
        
        adapted_task = self.adapter.adapt_processing_task(sample_task)
        
        self.assertEqual(adapted_task.id, 'task_test_123')
        self.assertEqual(adapted_task.document_id, 'doc_test_456')
        self.assertEqual(adapted_task.task_type, 'EMBEDDING_GENERATION')
        self.assertEqual(adapted_task.status, 'COMPLETED')
        self.assertIsInstance(adapted_task.backend_results, dict)

class TestTripleRAGWithRealData(unittest.TestCase):
    """Test suite with real CSV data scenarios"""
    
    def setUp(self):
        """Set up test fixtures for real data testing"""
        self.adapter = TripleRAGSchemaAdapter()
        
        # Simulated real data based on CSV analysis
        self.real_data_samples = [
            {
                'id': 'rec_css0b7hocbhviqfr3870',
                'author': '',
                'date': '2024-11-15T20:38:22Z',
                'title': 'Military Witness Testimony',
                'summary': 'Former military personnel describes encounters with unidentified aerial phenomena during classified operations.',
                'url': 'https://example.com/military-testimony',
                'processed': 'true',
                'embedding': json.dumps([-0.024452312, 0.014676657, -0.0052204896] + [0.0] * 381)
            },
            {
                'id': 'rec_css0b85860e8khms2t30',
                'author': 'Commander Graham Bethune',
                'date': '2024-11-15T20:38:24Z',
                'title': 'Navy Pilot UFO Encounter',
                'summary': 'Detailed account of UFO sighting during naval flight operations in 1951.',
                'url': 'https://example.com/bethune-testimony',
                'processed': 'true',
                'embedding': json.dumps([0.008815529, -0.0015383199, 0.0015848331] + [0.0] * 381)
            }
        ]
    
    def test_real_data_adaptation(self):
        """Test adaptation of real data samples"""
        for sample in self.real_data_samples:
            adapted_doc = self.adapter.adapt_document(sample)
            
            self.assertIsNotNone(adapted_doc.id)
            self.assertIsNotNone(adapted_doc.title)
            self.assertIsNotNone(adapted_doc.content)
            self.assertIsNotNone(adapted_doc.embedding)
            self.assertEqual(len(adapted_doc.embedding), 384)
    
    def test_real_data_validation(self):
        """Test validation of real data samples"""
        for sample in self.real_data_samples:
            report = self.adapter.validate_document_data(sample)
            
            self.assertIn(report['status'], ['valid', 'valid_with_warnings'])
            self.assertEqual(len(report['errors']), 0)
    
    def test_batch_real_data_processing(self):
        """Test batch processing of real data"""
        adapted_docs = self.adapter.adapt_batch_documents(self.real_data_samples)
        
        self.assertEqual(len(adapted_docs), 2)
        for doc in adapted_docs:
            self.assertIsInstance(doc, TripleRAGDocument)
            self.assertIsNotNone(doc.embedding)

if __name__ == '__main__':
    # Configure logging for tests
    import logging
    logging.basicConfig(level=logging.INFO)
    
    # Run tests
    unittest.main(verbosity=2)