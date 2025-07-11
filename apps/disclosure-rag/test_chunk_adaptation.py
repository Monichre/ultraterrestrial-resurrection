#!/usr/bin/env python3
"""
Quick Test Script for Triple RAG Chunk Adaptation
Date: July 9, 2025 at 07:45 PST

Simple validation script to test the enhanced chunk adaptation functionality.
"""

import sys
import os
from datetime import datetime

# Add lib directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))

try:
    from adapters.triple_rag_schema_adapter import TripleRAGSchemaAdapter, TripleRAGChunk
    print("✅ Successfully imported TripleRAGSchemaAdapter")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

def test_chunk_adaptation():
    """Test the enhanced chunk adaptation functionality"""
    print("=" * 60)
    print("TESTING ENHANCED CHUNK ADAPTATION")
    print("=" * 60)
    print(f"Date: {datetime.now().isoformat()}")
    print()
    
    # Initialize adapter
    adapter = TripleRAGSchemaAdapter()
    print("✅ Adapter initialized successfully")
    
    # Test 1: Complete chunk
    print("\n🧪 Test 1: Complete chunk with all fields")
    complete_chunk = {
        'id': 'chunk_test_001',
        'document_id': 'doc_ufo_123',
        'chunk_index': 0,
        'content': 'This is a test chunk about UFO disclosure with comprehensive metadata.',
        'token_count': 15,
        'page_number': 1,
        'heading': '# Executive Summary',
        'embedding': [-0.1, 0.2, 0.3] + [0.0] * 381,
        'created_at': '2025-07-09T07:45:00Z'
    }
    
    try:
        adapted = adapter.adapt_chunk(complete_chunk)
        print(f"✅ SUCCESS: Adapted chunk {adapted.id}")
        print(f"   Document ID: {adapted.document_id}")
        print(f"   Content length: {len(adapted.content)} chars")
        print(f"   Chunk index: {adapted.chunk_index}")
        print(f"   Embedding dimension: {len(adapted.embedding) if adapted.embedding else 'None'}")
        print(f"   Metadata keys: {list(adapted.metadata.keys())}")
        
        # Check enhanced metadata
        if 'position_context' in adapted.metadata:
            print(f"   Position context: {adapted.metadata['position_context']}")
        if 'heading_level' in adapted.metadata:
            print(f"   Heading level: {adapted.metadata['heading_level']}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    # Test 2: Minimal chunk
    print("\n🧪 Test 2: Minimal chunk (required fields only)")
    minimal_chunk = {
        'id': 'chunk_minimal_001',
        'document_id': 'doc_minimal_123',
        'content': 'Minimal content for testing.'
    }
    
    try:
        adapted = adapter.adapt_chunk(minimal_chunk)
        print(f"✅ SUCCESS: Adapted minimal chunk {adapted.id}")
        print(f"   Content: {adapted.content}")
        print(f"   Chunk index: {adapted.chunk_index}")
        print(f"   Metadata keys: {list(adapted.metadata.keys())}")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    # Test 3: Chunk validation
    print("\n🔍 Test 3: Chunk validation")
    try:
        validation_report = adapter.validate_chunk_data(complete_chunk)
        print(f"✅ Validation completed")
        print(f"   Status: {validation_report['status']}")
        print(f"   Errors: {len(validation_report['errors'])}")
        print(f"   Warnings: {len(validation_report['warnings'])}")
        
    except Exception as e:
        print(f"❌ VALIDATION ERROR: {e}")
        return False
    
    # Test 4: Batch processing
    print("\n📦 Test 4: Batch chunk processing")
    batch_chunks = []
    
    for i in range(3):
        chunk = {
            'id': f'chunk_batch_{i:03d}',
            'document_id': f'doc_batch_{i//2}',
            'chunk_index': i,
            'content': f'Batch chunk {i} content. ' * (i + 1),
            'token_count': (i + 1) * 10,
            'page_number': i + 1,
            'heading': f'## Section {i + 1}',
            'embedding': [0.1 * i] * 384
        }
        batch_chunks.append(chunk)
    
    try:
        adapted_batch = adapter.adapt_batch_chunks(batch_chunks)
        print(f"✅ BATCH SUCCESS: Adapted {len(adapted_batch)}/{len(batch_chunks)} chunks")
        
        for i, chunk in enumerate(adapted_batch):
            print(f"   {i+1}. {chunk.id} - {len(chunk.content)} chars - {chunk.metadata.get('token_count', 'N/A')} tokens")
            
    except Exception as e:
        print(f"❌ BATCH ERROR: {e}")
        return False
    
    # Test 5: Batch statistics
    print("\n📊 Test 5: Batch statistics")
    try:
        stats = adapter.get_batch_chunk_statistics(batch_chunks)
        print(f"✅ Statistics generated for {stats['total_chunks']} chunks")
        print(f"   Validation summary: {stats['validation_summary']}")
        print(f"   Content stats: avg={stats['content_stats']['average_content_length']:.1f} chars")
        print(f"   Embedding stats: {stats['embedding_stats']['valid_embeddings']} valid embeddings")
        
    except Exception as e:
        print(f"❌ STATISTICS ERROR: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_chunk_adaptation()
    if success:
        print("\n🎉 Enhanced chunk adaptation implementation is working correctly!")
        sys.exit(0)
    else:
        print("\n❌ Tests failed. Please check the implementation.")
        sys.exit(1)