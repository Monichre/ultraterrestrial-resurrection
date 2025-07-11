#!/usr/bin/env python3
"""
Comprehensive Unit Tests for Triple RAG Schema Adapter - Chunk Adaptation
Date: July 9, 2025 at 07:45 PST

Tests the chunk adaptation functionality of the Triple RAG Schema Adapter,
focusing on chunk-specific metadata handling, batch processing, and validation.
"""

import unittest
import json
import logging
from typing import Dict, List, Any
from datetime import datetime
import sys
import os

# Add the lib directory to the path so we can import the adapter
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'lib'))

from adapters.triple_rag_schema_adapter import TripleRAGSchemaAdapter, TripleRAGChunk

# Configure logging for tests
logging.basicConfig(level=logging.WARNING)  # Reduce noise during testing

class TestTripleRAGChunkAdapter(unittest.TestCase):
    """Test cases for Triple RAG Schema Adapter chunk functionality"""
    
    def setUp(self):
        """Set up test fixtures before each test method"""
        self.adapter = TripleRAGSchemaAdapter(config={
            'embedding_dimension': 384,
            'embedding_model': 'all-MiniLM-L6-v2',
            'processing_version': '1.0',
            'validate_embeddings': True,
            'preserve_metadata': True,
            'backward_compatible': True,
            'strict_validation': False
        })
        
        # Create sample embeddings for testing (384 dimensions)
        self.valid_embedding = [-0.1, 0.2, 0.3, -0.4, 0.5] + [0.0] * 379
        self.invalid_embedding = [0.1, 0.2, 0.3]  # Wrong dimension
        
    def test_complete_chunk_adaptation(self):
        """Test adapting a chunk with all fields present"""
        chunk_data = {
            'id': 'chunk_test_001',
            'document_id': 'doc_ufo_123',
            'chunk_index': 0,
            'content': 'This is a test chunk with complete metadata for UFO disclosure documents.',
            'token_count': 15,
            'page_number': 1,
            'heading': '# Executive Summary',
            'embedding': self.valid_embedding,
            'created_at': '2025-07-09T07:45:00Z'
        }
        
        adapted = self.adapter.adapt_chunk(chunk_data)
        
        self.assertIsInstance(adapted, TripleRAGChunk)
        self.assertEqual(adapted.id, 'chunk_test_001')
        self.assertEqual(adapted.document_id, 'doc_ufo_123')
        self.assertEqual(adapted.chunk_index, 0)
        self.assertEqual(adapted.content, chunk_data['content'])
        self.assertEqual(len(adapted.embedding), 384)
        self.assertIn('token_count', adapted.metadata)
        self.assertIn('page_number', adapted.metadata)
        self.assertIn('heading', adapted.metadata)
        self.assertIn('position_context', adapted.metadata)
        self.assertIn('heading_level', adapted.metadata)
        self.assertEqual(adapted.metadata['token_count'], 15)
        self.assertEqual(adapted.metadata['page_number'], 1)
        self.assertEqual(adapted.metadata['heading_level'], 1)  # # header = level 1
        
    def test_minimal_chunk_adaptation(self):
        """Test adapting a chunk with only required fields"""
        chunk_data = {
            'id': 'chunk_minimal_001',
            'document_id': 'doc_minimal_123',
            'content': 'Minimal content.'
        }
        
        adapted = self.adapter.adapt_chunk(chunk_data)
        
        self.assertIsInstance(adapted, TripleRAGChunk)
        self.assertEqual(adapted.id, 'chunk_minimal_001')
        self.assertEqual(adapted.document_id, 'doc_minimal_123')
        self.assertEqual(adapted.content, 'Minimal content.')
        self.assertIsNone(adapted.chunk_index)
        self.assertIsNone(adapted.embedding)
        self.assertIn('source', adapted.metadata)
        self.assertIn('adapter_version', adapted.metadata)
        self.assertIn('adapted_at', adapted.metadata)
        
    def test_chunk_validation(self):
        """Test chunk data validation"""
        # Valid chunk
        valid_chunk = {
            'id': 'chunk_valid_001',
            'document_id': 'doc_valid_123',
            'content': 'Valid chunk content.',
            'chunk_index': 0,
            'token_count': 5,
            'page_number': 1,
            'embedding': self.valid_embedding
        }
        
        report = self.adapter.validate_chunk_data(valid_chunk)
        self.assertEqual(report['status'], 'valid')
        self.assertEqual(len(report['errors']), 0)
        
        # Invalid chunk (missing required fields)
        invalid_chunk = {
            'id': '',  # Empty ID
            'document_id': 'doc_123',
            'content': ''  # Empty content
        }
        
        report = self.adapter.validate_chunk_data(invalid_chunk)
        self.assertEqual(report['status'], 'invalid')
        self.assertGreater(len(report['errors']), 0)
        
        # Chunk with warnings
        warning_chunk = {
            'id': 'chunk_warning_001',
            'document_id': 'doc_warning_123',
            'content': 'Content.',
            'token_count': -5,  # Invalid token count
            'page_number': 0,   # Invalid page number
            'embedding': self.invalid_embedding  # Wrong dimension
        }
        
        report = self.adapter.validate_chunk_data(warning_chunk)
        self.assertEqual(report['status'], 'valid_with_warnings')
        self.assertGreater(len(report['warnings']), 0)
        
    def test_chunk_metadata_enhancement(self):
        """Test enhanced metadata generation for chunks"""
        chunk_data = {
            'id': 'chunk_meta_001',
            'document_id': 'doc_meta_123',
            'content': 'This is a longer piece of content that should generate enhanced metadata fields.',
            'chunk_index': 2,
            'token_count': 16,
            'page_number': 3,
            'heading': '## Technical Analysis',
            'embedding': self.valid_embedding
        }
        
        adapted = self.adapter.adapt_chunk(chunk_data)
        
        # Check enhanced metadata fields
        self.assertIn('content_length', adapted.metadata)
        self.assertIn('content_preview', adapted.metadata)
        self.assertIn('has_content', adapted.metadata)
        self.assertIn('position_context', adapted.metadata)
        self.assertIn('has_heading', adapted.metadata)
        self.assertIn('heading_length', adapted.metadata)
        self.assertIn('heading_level', adapted.metadata)
        
        self.assertEqual(adapted.metadata['content_length'], len(chunk_data['content']))
        self.assertTrue(adapted.metadata['has_content'])
        self.assertEqual(adapted.metadata['position_context'], 'page_3_chunk_2')
        self.assertTrue(adapted.metadata['has_heading'])
        self.assertEqual(adapted.metadata['heading_level'], 2)  # ## header = level 2
        
    def test_heading_level_detection(self):
        """Test automatic heading level detection"""
        test_cases = [
            ('# Main Title', 1),
            ('## Section Title', 2),
            ('### Subsection', 3),
            ('#### Details', 4),
            ('##### Minor Detail', 5),
            ('###### Smallest', 6),
            ('EXECUTIVE SUMMARY', 1),  # All caps
            ('Technical Analysis', 2),  # Title case
            ('general content', 3),     # Default
        ]
        
        for heading_text, expected_level in test_cases:
            with self.subTest(heading=heading_text):
                chunk_data = {
                    'id': f'chunk_heading_{expected_level}',
                    'document_id': 'doc_heading_test',
                    'content': 'Test content.',
                    'heading': heading_text
                }
                
                adapted = self.adapter.adapt_chunk(chunk_data)
                actual_level = adapted.metadata.get('heading_level')
                self.assertEqual(actual_level, expected_level,
                               f"Heading '{heading_text}' should be level {expected_level}, got {actual_level}")
                
    def test_batch_chunk_adaptation(self):
        """Test batch processing of multiple chunks"""
        chunks = []
        
        # Create test chunks
        for i in range(5):
            chunk = {
                'id': f'chunk_batch_{i:03d}',
                'document_id': f'doc_batch_{i//2}',  # Multiple chunks per document
                'chunk_index': i % 3,
                'content': f'Batch chunk {i} content about disclosure topic {i}. ' * (i + 1),
                'token_count': (i + 1) * 10,
                'page_number': (i // 2) + 1,
                'heading': f'## Section {i + 1}',
                'embedding': [0.1 * i, -0.1 * i, 0.2 * i] + [0.0] * 381
            }
            chunks.append(chunk)
        
        # Add one invalid chunk
        chunks.append({
            'id': 'chunk_invalid',
            'document_id': '',  # Empty document_id
            'content': 'Invalid chunk'
        })
        
        adapted_chunks = self.adapter.adapt_batch_chunks(chunks)
        
        # Should adapt all valid chunks
        self.assertEqual(len(adapted_chunks), 5)  # 5 valid, 1 invalid
        
        # Check that all adapted chunks are valid
        for chunk in adapted_chunks:
            self.assertIsInstance(chunk, TripleRAGChunk)
            self.assertIsNotNone(chunk.id)
            self.assertIsNotNone(chunk.document_id)
            self.assertIsNotNone(chunk.content)
            
    def test_batch_statistics(self):
        """Test batch statistics generation"""
        chunks = [
            {
                'id': 'chunk_stats_001',
                'document_id': 'doc_stats_123',
                'content': 'Short content.',
                'chunk_index': 0,
                'token_count': 3,
                'page_number': 1,
                'embedding': self.valid_embedding
            },
            {
                'id': 'chunk_stats_002',
                'document_id': 'doc_stats_123',
                'content': 'This is a much longer piece of content that spans multiple sentences and contains more detailed information.',
                'chunk_index': 1,
                'token_count': 20,
                'page_number': 1,
                'heading': '# Overview'
            },
            {
                'id': 'chunk_stats_003',
                'document_id': 'doc_stats_456',
                'content': '',  # Empty content
                'chunk_index': 0
            }
        ]
        
        stats = self.adapter.get_batch_chunk_statistics(chunks)
        
        self.assertEqual(stats['total_chunks'], 3)
        self.assertIn('validation_summary', stats)
        self.assertIn('field_completeness', stats)
        self.assertIn('content_stats', stats)
        self.assertIn('embedding_stats', stats)
        
        # Check field completeness
        self.assertEqual(stats['field_completeness']['id'], 3)
        self.assertEqual(stats['field_completeness']['document_id'], 3)
        self.assertEqual(stats['field_completeness']['content'], 3)
        self.assertEqual(stats['field_completeness']['chunk_index'], 2)
        self.assertEqual(stats['field_completeness']['embedding'], 1)
        
        # Check content statistics
        self.assertEqual(stats['content_stats']['empty_content'], 1)
        self.assertGreater(stats['content_stats']['max_content_length'], 
                          stats['content_stats']['min_content_length'])
        
    def test_error_handling(self):
        """Test error handling for invalid inputs"""
        # Test with non-dict input
        with self.assertRaises(TypeError):
            self.adapter.adapt_chunk("not a dict")
            
        # Test with missing required fields
        with self.assertRaises(ValueError):
            self.adapter.adapt_chunk({'id': 'test'})  # Missing document_id and content
            
        # Test with empty ID
        with self.assertRaises(ValueError):
            self.adapter.adapt_chunk({
                'id': '',
                'document_id': 'doc_123',
                'content': 'content'
            })
            
        # Test with empty document_id
        with self.assertRaises(ValueError):
            self.adapter.adapt_chunk({
                'id': 'chunk_123',
                'document_id': '',
                'content': 'content'
            })
            
    def test_problematic_data_handling(self):
        """Test handling of problematic but not invalid data"""
        problematic_chunk = {
            'id': 'chunk_problem_001',
            'document_id': 'doc_problem_123',
            'content': 'Content with problematic metadata.',
            'chunk_index': 'not_a_number',  # Invalid type
            'token_count': -5,              # Negative value
            'page_number': 0,               # Invalid value
            'heading': '   ',               # Empty after strip
            'embedding': 'invalid_format'   # Invalid embedding
        }
        
        # Should not raise exception, but handle gracefully
        adapted = self.adapter.adapt_chunk(problematic_chunk)
        
        self.assertIsInstance(adapted, TripleRAGChunk)
        self.assertEqual(adapted.id, 'chunk_problem_001')
        self.assertIsNone(adapted.chunk_index)  # Should be None due to invalid format
        self.assertIsNone(adapted.embedding)    # Should be None due to invalid format
        
    def test_embedding_dimension_validation(self):
        """Test embedding dimension validation"""
        # Valid embedding
        chunk_valid = {
            'id': 'chunk_embed_valid',
            'document_id': 'doc_embed_123',
            'content': 'Content.',
            'embedding': self.valid_embedding
        }
        
        adapted = self.adapter.adapt_chunk(chunk_valid)
        self.assertEqual(len(adapted.embedding), 384)
        
        # Invalid dimension (should handle gracefully with warnings)
        chunk_invalid = {
            'id': 'chunk_embed_invalid',
            'document_id': 'doc_embed_123',
            'content': 'Content.',
            'embedding': [0.1, 0.2, 0.3]  # Wrong dimension
        }
        
        adapted = self.adapter.adapt_chunk(chunk_invalid)
        # Should either be None or padded to correct dimension
        if adapted.embedding:
            self.assertEqual(len(adapted.embedding), 384)
        else:
            self.assertIsNone(adapted.embedding)
            
    def test_date_validation(self):
        """Test date field validation and normalization"""
        chunk_data = {
            'id': 'chunk_date_001',
            'document_id': 'doc_date_123',
            'content': 'Content with various date formats.',
            'created_at': '2025-07-09T07:45:00Z'
        }
        
        adapted = self.adapter.adapt_chunk(chunk_data)
        self.assertIn('created_at', adapted.metadata)
        self.assertEqual(adapted.metadata['created_at'], '2025-07-09T07:45:00Z')
        
    def test_contextual_information_preservation(self):
        """Test that contextual information is properly preserved"""
        chunk_data = {
            'id': 'chunk_context_001',
            'document_id': 'doc_context_123',
            'content': 'This chunk contains important contextual information about UFO sightings.',
            'chunk_index': 5,
            'token_count': 12,
            'page_number': 42,
            'heading': 'Chapter 7: Government Response',
            'embedding': self.valid_embedding
        }
        
        adapted = self.adapter.adapt_chunk(chunk_data)
        
        # Check that all contextual information is preserved
        self.assertEqual(adapted.chunk_index, 5)
        self.assertEqual(adapted.metadata['token_count'], 12)
        self.assertEqual(adapted.metadata['page_number'], 42)
        self.assertEqual(adapted.metadata['heading'], 'Chapter 7: Government Response')
        self.assertEqual(adapted.metadata['position_context'], 'page_42_chunk_5')
        
        # Check that relationship to document is maintained
        self.assertEqual(adapted.document_id, 'doc_context_123')


class TestBatchProcessingPerformance(unittest.TestCase):
    """Performance tests for batch processing"""
    
    def setUp(self):
        """Set up performance test fixtures"""
        self.adapter = TripleRAGSchemaAdapter()
        
    def test_large_batch_processing(self):
        """Test processing a large batch of chunks"""
        import time
        
        # Create a large batch of chunks
        large_batch = []
        for i in range(100):
            chunk = {
                'id': f'chunk_perf_{i:04d}',
                'document_id': f'doc_perf_{i//10}',
                'chunk_index': i % 10,
                'content': f'Performance test chunk {i} with content. ' * 5,
                'token_count': 25,
                'page_number': (i // 10) + 1,
                'heading': f'Section {i + 1}',
                'embedding': [0.01 * i] * 384
            }
            large_batch.append(chunk)
        
        # Time the batch processing
        start_time = time.time()
        adapted_chunks = self.adapter.adapt_batch_chunks(large_batch)
        processing_time = time.time() - start_time
        
        # Verify results
        self.assertEqual(len(adapted_chunks), 100)
        self.assertLess(processing_time, 5.0)  # Should complete in under 5 seconds
        
        # Calculate performance metrics
        avg_time_per_chunk = processing_time / len(large_batch)
        self.assertLess(avg_time_per_chunk, 0.05)  # Less than 50ms per chunk
        
        print(f"Processed {len(large_batch)} chunks in {processing_time:.4f}s")
        print(f"Average time per chunk: {avg_time_per_chunk:.4f}s")


def run_chunk_adapter_tests():
    """Run all chunk adapter tests"""
    print("=" * 80)
    print("RUNNING TRIPLE RAG CHUNK ADAPTER UNIT TESTS")
    print("=" * 80)
    print(f"Date: {datetime.now().isoformat()}")
    print()
    
    # Create test suite
    test_suite = unittest.TestSuite()
    
    # Add all test cases
    test_suite.addTest(unittest.makeSuite(TestTripleRAGChunkAdapter))
    test_suite.addTest(unittest.makeSuite(TestBatchProcessingPerformance))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # Print summary
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print("\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print("\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_chunk_adapter_tests()
    sys.exit(0 if success else 1)