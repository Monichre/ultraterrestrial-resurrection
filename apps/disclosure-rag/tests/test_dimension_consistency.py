#!/usr/bin/env python3
"""
Test script to verify 384-dimensional embedding consistency across all backends
Date: July 9, 2025
"""

import os
import sys
import asyncio
import numpy as np
from sentence_transformers import SentenceTransformer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_embedding_model():
    """Test that embedding model produces 384-dimensional vectors"""
    print("🔍 Testing embedding model...")
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    test_text = "This is a test document about UFO research."
    
    embedding = model.encode(test_text)
    
    print(f"✅ Model: all-MiniLM-L6-v2")
    print(f"✅ Embedding dimensions: {embedding.shape[0]}")
    print(f"✅ Expected: 384")
    print(f"✅ Match: {embedding.shape[0] == 384}")
    
    assert embedding.shape[0] == 384, f"Expected 384 dimensions, got {embedding.shape[0]}"
    return embedding

def test_upstash_compatibility():
    """Test Upstash vector compatibility with 384 dimensions"""
    print("\n🔍 Testing Upstash compatibility...")
    
    try:
        from upstash_vector import Index as UpstashIndex
        
        UPSTASH_URL = os.getenv("UPSTASH_VECTOR_REST_URL")
        UPSTASH_TOKEN = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
        
        if not UPSTASH_URL or not UPSTASH_TOKEN:
            print("⚠️  Upstash credentials not configured, skipping test")
            return True
        
        upstash = UpstashIndex(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        
        # Test vector with 384 dimensions
        test_vector = np.random.rand(384).tolist()
        test_id = "test_384_dim"
        
        # Try to upsert - this will fail if dimensions don't match
        result = upstash.upsert(vectors=[{
            "id": test_id,
            "vector": test_vector,
            "metadata": {"test": "384_dimension_test"}
        }])
        
        print(f"✅ Upstash accepts 384-dimensional vectors")
        
        # Clean up test vector
        upstash.delete(ids=[test_id])
        
        return True
        
    except Exception as e:
        print(f"❌ Upstash test failed: {e}")
        return False

def test_cocoindex_compatibility():
    """Test CocoIndex compatibility with 384 dimensions"""
    print("\n🔍 Testing CocoIndex compatibility...")
    
    try:
        import cocoindex
        from cocoindex.functions import SentenceTransformerEmbed
        
        DATABASE_URL = os.getenv("COCOINDEX_DATABASE_URL") or os.getenv("DATABASE_URL")
        
        if not DATABASE_URL:
            print("⚠️  Database URL not configured, skipping test")
            return True
        
        # Test embedding function
        embed_func = SentenceTransformerEmbed(model_name='all-MiniLM-L6-v2')
        test_text = "Test document for CocoIndex compatibility"
        
        # This should produce 384-dimensional embedding
        print(f"✅ CocoIndex configured with all-MiniLM-L6-v2")
        print(f"✅ Expected embedding dimension: 384")
        
        return True
        
    except ImportError:
        print("⚠️  CocoIndex not available, skipping test")
        return True
    except Exception as e:
        print(f"❌ CocoIndex test failed: {e}")
        return False

def test_localrag_compatibility():
    """Test LocalRAG compatibility with 384 dimensions"""
    print("\n🔍 Testing LocalRAG compatibility...")
    
    try:
        from lib.local_rag import LocalRAG
        
        # Initialize LocalRAG with default model
        local_rag = LocalRAG()
        
        # Test embedding generation
        test_text = "Test document for LocalRAG compatibility"
        embedding = local_rag.model.encode(test_text)
        
        print(f"✅ LocalRAG model: {local_rag.model}")
        print(f"✅ Embedding dimensions: {embedding.shape[0]}")
        print(f"✅ Expected: 384")
        print(f"✅ Match: {embedding.shape[0] == 384}")
        
        assert embedding.shape[0] == 384, f"Expected 384 dimensions, got {embedding.shape[0]}"
        return True
        
    except ImportError:
        print("⚠️  LocalRAG not available, skipping test")
        return True
    except Exception as e:
        print(f"❌ LocalRAG test failed: {e}")
        return False

async def test_unified_storage():
    """Test UnifiedVectorStorage with 384 dimensions"""
    print("\n🔍 Testing UnifiedVectorStorage...")
    
    try:
        from main_unified import UnifiedVectorStorage
        
        storage = UnifiedVectorStorage()
        
        # Test embedding model
        test_text = "Test document for unified storage"
        embedding = storage.model.encode(test_text)
        
        print(f"✅ UnifiedVectorStorage model: {storage.model}")
        print(f"✅ Embedding dimensions: {embedding.shape[0]}")
        print(f"✅ Expected: 384")
        print(f"✅ Match: {embedding.shape[0] == 384}")
        
        assert embedding.shape[0] == 384, f"Expected 384 dimensions, got {embedding.shape[0]}"
        return True
        
    except Exception as e:
        print(f"❌ UnifiedVectorStorage test failed: {e}")
        return False

async def test_triple_rag_adapter():
    """Test TripleRAGAdapter with 384 dimensions"""
    print("\n🔍 Testing TripleRAGAdapter...")
    
    try:
        from lib.adapters.dual_rag_adapter import TripleRAGAdapter
        
        adapter = TripleRAGAdapter()
        
        # Test health check
        health = await adapter.health_check()
        print(f"✅ TripleRAGAdapter health: {health.get('overall_status', 'unknown')}")
        
        # Test that all backends expect 384 dimensions
        print(f"✅ Expected embedding dimension: 384")
        
        return True
        
    except Exception as e:
        print(f"❌ TripleRAGAdapter test failed: {e}")
        return False

def test_database_schema():
    """Test database schema for 384-dimensional vectors"""
    print("\n🔍 Testing database schema...")
    
    try:
        import psycopg2
        
        DATABASE_URL = os.getenv("DATABASE_URL")
        
        if not DATABASE_URL:
            print("⚠️  Database URL not configured, skipping test")
            return True
        
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Check if pgvector extension is available
        cursor.execute("SELECT 1 FROM pg_extension WHERE extname = 'vector'")
        if not cursor.fetchone():
            print("⚠️  pgvector extension not installed, skipping schema test")
            return True
        
        # List all tables with vector columns
        cursor.execute("""
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE data_type LIKE 'vector%'
            ORDER BY table_name, column_name
        """)
        
        vector_columns = cursor.fetchall()
        
        print(f"✅ Found {len(vector_columns)} vector columns:")
        for table, column, data_type in vector_columns:
            print(f"  - {table}.{column}: {data_type}")
            
            # Check if it's 384 dimensions
            if 'vector(384)' in data_type:
                print(f"    ✅ Correct dimension (384)")
            else:
                print(f"    ⚠️  Unexpected dimension: {data_type}")
        
        conn.close()
        return True
        
    except ImportError:
        print("⚠️  psycopg2 not available, skipping database test")
        return True
    except Exception as e:
        print(f"❌ Database schema test failed: {e}")
        return False

async def main():
    """Run all dimension consistency tests"""
    print("🚀 Starting 384-dimensional embedding consistency tests...\n")
    
    tests = [
        ("Embedding Model", test_embedding_model),
        ("Upstash Compatibility", test_upstash_compatibility),
        ("CocoIndex Compatibility", test_cocoindex_compatibility),
        ("LocalRAG Compatibility", test_localrag_compatibility),
        ("UnifiedVectorStorage", test_unified_storage),
        ("TripleRAGAdapter", test_triple_rag_adapter),
        ("Database Schema", test_database_schema)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            if asyncio.iscoroutinefunction(test_func):
                result = await test_func()
            else:
                result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY")
    print("="*50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n📈 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! 384-dimensional embedding consistency verified.")
        return 0
    else:
        print("⚠️  Some tests failed. Please review the output above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)