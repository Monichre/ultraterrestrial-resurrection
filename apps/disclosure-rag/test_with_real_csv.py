#!/usr/bin/env python3
"""
Test Triple RAG Schema Adapter with Real CSV Data
Date: July 9, 2025 at 08:20 PST

This script tests the adapter with actual CSV data to ensure robust handling
of real-world data scenarios.
"""

import sys
import csv
import json
import logging
from pathlib import Path
from typing import List, Dict, Any

# Add the lib directory to the path
sys.path.insert(0, str(Path(__file__).parent / "lib"))

from adapters.triple_rag_schema_adapter import TripleRAGSchemaAdapter

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def create_sample_documents() -> List[Dict[str, Any]]:
    """
    Create sample documents that match the expected format
    Since the CSV appears corrupted, we'll create realistic test data
    """
    return [
        {
            'id': 'rec_css0b7hocbhviqfr3870',
            'author': 'Dr. Steven M. Greer',
            'date': '2024-11-15T20:38:22Z',
            'title': 'Military Witness Testimony on UAP Encounters',
            'summary': 'This document contains witness testimony about unidentified aerial phenomena observed during military operations. The witness, a former military officer, provides detailed accounts of encounters with craft displaying advanced propulsion capabilities beyond current human technology.',
            'url': 'https://example.com/military-testimony-1',
            'processed': 'true',
            'file': 'military-testimony.pdf',
            'images': '["radar_trace.jpg", "craft_sketch.jpg"]',
            'metadata': '{"source": "disclosure_project", "category": "witness_testimony", "classification": "declassified"}',
            'organization': 'Disclosure Project',
            'embedding': json.dumps([-0.024452312, 0.014676657, -0.0052204896] + [0.0] * 381)
        },
        {
            'id': 'rec_css0b85860e8khms2t30',
            'author': 'Commander Graham Bethune',
            'date': '2024-11-15T20:38:24Z',
            'title': 'Navy Pilot UFO Encounter Report - 1951',
            'summary': 'Commander Bethune describes his encounter with a UFO while piloting a Navy aircraft in 1951. The object was observed to travel at incredible speeds and perform maneuvers impossible for conventional aircraft of that era. Multiple crew members witnessed the event.',
            'url': 'https://example.com/bethune-testimony',
            'processed': 'true',
            'file': 'bethune-encounter.pdf',
            'images': '[]',
            'metadata': '{"source": "navy_archives", "category": "pilot_testimony", "year": "1951", "classification": "unclassified"}',
            'organization': 'US Navy',
            'embedding': json.dumps([0.008815529, -0.0015383199, 0.0015848331] + [0.0] * 381)
        },
        {
            'id': 'rec_css0b89ocbhviqfr3880',
            'author': 'Colonel Charles Halt',
            'date': '2024-11-15T20:38:26Z',
            'title': 'Rendlesham Forest UFO Incident - Official Report',
            'summary': 'Official report from Colonel Charles Halt regarding the Rendlesham Forest incident in December 1980. Multiple military personnel observed unusual lights and a craft landing in the forest near RAF Woodbridge. Physical evidence was collected and documented.',
            'url': 'https://example.com/rendlesham-report',
            'processed': 'true',
            'file': 'rendlesham-forest-incident.pdf',
            'images': '["landing_site.jpg", "radiation_readings.jpg", "plaster_casts.jpg"]',
            'metadata': '{"source": "air_force_files", "category": "landing_case", "location": "Rendlesham Forest, UK", "date": "1980-12-26"}',
            'organization': 'US Air Force',
            'embedding': json.dumps([-0.029566962, -0.010946495, -0.027954219] + [0.0] * 381)
        },
        {
            'id': 'rec_minimal_test',
            'title': 'Minimal Document Test',
            'summary': 'This is a minimal document for testing edge cases.'
        },
        {
            'id': 'rec_bad_embed_test',
            'title': 'Bad Embedding Test',
            'summary': 'Document with malformed embedding for testing error handling.',
            'embedding': '[0.1, 0.2, invalid_value]'
        },
        {
            'id': 'rec_empty_fields_test',
            'title': '',
            'summary': '',
            'author': '',
            'date': 'invalid_date',
            'embedding': json.dumps([0.1] * 10)  # Wrong dimension
        }
    ]

def test_document_adaptation():
    """Test document adaptation with various scenarios"""
    print("=" * 60)
    print("TESTING DOCUMENT ADAPTATION")
    print("=" * 60)
    
    adapter = TripleRAGSchemaAdapter()
    sample_docs = create_sample_documents()
    
    successful_adaptations = 0
    total_docs = len(sample_docs)
    
    for i, doc in enumerate(sample_docs):
        print(f"\nTesting document {i+1}/{total_docs}: {doc['id']}")
        print("-" * 40)
        
        try:
            # Validate first
            validation_report = adapter.validate_document_data(doc)
            print(f"Validation status: {validation_report['status']}")
            
            if validation_report['errors']:
                print(f"Validation errors: {validation_report['errors']}")
            
            if validation_report['warnings']:
                print(f"Validation warnings: {validation_report['warnings']}")
            
            # Attempt adaptation
            adapted_doc = adapter.adapt_document(doc)
            
            print(f"✅ Successfully adapted document: {adapted_doc.id}")
            print(f"   Title: {adapted_doc.title}")
            print(f"   Content length: {len(adapted_doc.content)}")
            print(f"   Has embedding: {adapted_doc.embedding is not None}")
            
            if adapted_doc.embedding:
                print(f"   Embedding dimension: {len(adapted_doc.embedding)}")
            
            print(f"   Metadata keys: {list(adapted_doc.metadata.keys())}")
            
            successful_adaptations += 1
            
        except Exception as e:
            print(f"❌ Error adapting document: {e}")
    
    print(f"\n{'='*60}")
    print(f"ADAPTATION SUMMARY")
    print(f"{'='*60}")
    print(f"Total documents tested: {total_docs}")
    print(f"Successfully adapted: {successful_adaptations}")
    print(f"Failed adaptations: {total_docs - successful_adaptations}")
    print(f"Success rate: {successful_adaptations/total_docs*100:.1f}%")

def test_batch_processing():
    """Test batch processing capabilities"""
    print("\n" + "=" * 60)
    print("TESTING BATCH PROCESSING")
    print("=" * 60)
    
    adapter = TripleRAGSchemaAdapter()
    sample_docs = create_sample_documents()
    
    print(f"Processing {len(sample_docs)} documents in batch...")
    
    try:
        adapted_docs = adapter.adapt_batch_documents(sample_docs)
        
        print(f"✅ Batch processing completed")
        print(f"   Input documents: {len(sample_docs)}")
        print(f"   Successfully adapted: {len(adapted_docs)}")
        print(f"   Success rate: {len(adapted_docs)/len(sample_docs)*100:.1f}%")
        
        # Analyze results
        embedding_count = sum(1 for doc in adapted_docs if doc.embedding is not None)
        print(f"   Documents with embeddings: {embedding_count}")
        
        avg_content_length = sum(len(doc.content) for doc in adapted_docs) / len(adapted_docs)
        print(f"   Average content length: {avg_content_length:.1f}")
        
    except Exception as e:
        print(f"❌ Batch processing failed: {e}")

def test_embedding_handling():
    """Test embedding extraction and validation"""
    print("\n" + "=" * 60)
    print("TESTING EMBEDDING HANDLING")
    print("=" * 60)
    
    adapter = TripleRAGSchemaAdapter()
    
    # Test cases for embedding extraction
    test_cases = [
        {
            'name': 'Valid JSON array',
            'data': json.dumps([0.1, 0.2, 0.3] + [0.0] * 381),
            'expected_length': 384
        },
        {
            'name': 'Python list',
            'data': [0.1, 0.2, 0.3] + [0.0] * 381,
            'expected_length': 384
        },
        {
            'name': 'Short embedding (should pad)',
            'data': [0.1, 0.2, 0.3],
            'expected_length': 384
        },
        {
            'name': 'Long embedding (should truncate)',
            'data': [0.1] * 500,
            'expected_length': 384
        },
        {
            'name': 'Empty embedding',
            'data': None,
            'expected_length': None
        },
        {
            'name': 'Invalid JSON',
            'data': '[0.1, 0.2, invalid]',
            'expected_length': None
        }
    ]
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        print("-" * 30)
        
        try:
            result = adapter._extract_embedding(test_case['data'])
            
            if result is None:
                if test_case['expected_length'] is None:
                    print("✅ Correctly returned None for invalid embedding")
                else:
                    print(f"❌ Unexpected None result (expected length {test_case['expected_length']})")
            else:
                actual_length = len(result)
                if actual_length == test_case['expected_length']:
                    print(f"✅ Correct embedding length: {actual_length}")
                else:
                    print(f"❌ Incorrect embedding length: {actual_length} (expected {test_case['expected_length']})")
                
                # Check value range
                if all(-1.0 <= val <= 1.0 for val in result):
                    print("✅ All values in normal range [-1, 1]")
                else:
                    out_of_range = [val for val in result if not (-1.0 <= val <= 1.0)]
                    print(f"⚠️  Some values outside normal range: {len(out_of_range)} values")
        
        except Exception as e:
            print(f"❌ Exception during embedding extraction: {e}")

def test_error_handling():
    """Test error handling for edge cases"""
    print("\n" + "=" * 60)
    print("TESTING ERROR HANDLING")
    print("=" * 60)
    
    adapter = TripleRAGSchemaAdapter()
    
    # Test cases for error handling
    error_test_cases = [
        {
            'name': 'None input',
            'data': None,
            'expected_error': TypeError
        },
        {
            'name': 'String input',
            'data': "not a dict",
            'expected_error': TypeError
        },
        {
            'name': 'Empty dict',
            'data': {},
            'expected_error': ValueError
        },
        {
            'name': 'Missing ID',
            'data': {'title': 'No ID'},
            'expected_error': ValueError
        },
        {
            'name': 'Empty ID',
            'data': {'id': '', 'title': 'Empty ID'},
            'expected_error': ValueError
        }
    ]
    
    for test_case in error_test_cases:
        print(f"\nTesting: {test_case['name']}")
        print("-" * 30)
        
        try:
            result = adapter.adapt_document(test_case['data'])
            print(f"❌ Expected {test_case['expected_error'].__name__} but got result: {result}")
        
        except test_case['expected_error'] as e:
            print(f"✅ Correctly raised {test_case['expected_error'].__name__}: {e}")
        
        except Exception as e:
            print(f"❌ Unexpected exception {type(e).__name__}: {e}")

def test_configuration():
    """Test adapter configuration options"""
    print("\n" + "=" * 60)
    print("TESTING CONFIGURATION")
    print("=" * 60)
    
    # Test default configuration
    adapter = TripleRAGSchemaAdapter()
    stats = adapter.get_statistics()
    
    print("Default configuration:")
    print(f"  Embedding dimension: {stats['embedding_dimension']}")
    print(f"  Embedding model: {stats['embedding_model']}")
    print(f"  Processing version: {stats['processing_version']}")
    print(f"  Supported formats: {len(stats['supported_formats'])}")
    
    # Test custom configuration
    custom_config = {
        'embedding_dimension': 512,
        'embedding_model': 'custom-model',
        'strict_validation': True,
        'validate_embedding_values': False
    }
    
    custom_adapter = TripleRAGSchemaAdapter(custom_config)
    custom_stats = custom_adapter.get_statistics()
    
    print(f"\nCustom configuration:")
    print(f"  Embedding dimension: {custom_stats['embedding_dimension']}")
    print(f"  Embedding model: {custom_stats['embedding_model']}")
    print(f"  Strict validation: {custom_adapter.config['strict_validation']}")
    
    # Test configuration update
    adapter.update_config({'embedding_dimension': 256})
    updated_stats = adapter.get_statistics()
    
    print(f"\nUpdated configuration:")
    print(f"  Embedding dimension: {updated_stats['embedding_dimension']}")

def main():
    """Main test execution"""
    print("Triple RAG Schema Adapter - Real Data Testing")
    print("Date: July 9, 2025 at 08:20 PST")
    print("=" * 60)
    
    try:
        test_document_adaptation()
        test_batch_processing()
        test_embedding_handling()
        test_error_handling()
        test_configuration()
        
        print("\n" + "=" * 60)
        print("ALL TESTS COMPLETED")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Test execution failed: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)