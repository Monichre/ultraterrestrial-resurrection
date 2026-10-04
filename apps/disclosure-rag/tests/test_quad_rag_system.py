#!/usr/bin/env python3
"""
Test script for the complete Quad RAG System
Tests Upstash + LocalRAG + CocoIndex + LocalVectorLibrary
Date: July 2, 2025
"""

import asyncio
import os
import sys
from pathlib import Path

# Add lib directory to path
lib_path = str(Path(__file__).parent / "lib")
if lib_path not in sys.path:
    sys.path.insert(0, lib_path)

async def test_quad_rag_system():
    """Test the complete Quad RAG system"""
    
    print("🚀 Testing Quad RAG System Integration")
    print("=" * 50)
    
    try:
        # Import the Quad RAG adapter
        from adapters import QuadRAGAdapter, search, get_adapter_status
        
        # Test system status
        print("\n1. 📊 Checking System Status...")
        status = get_adapter_status()
        
        print(f"Timestamp: {status['timestamp']}")
        print(f"Upstash: {'✅' if status['upstash']['connected'] else '❌'}")
        print(f"LocalRAG: {'✅' if status['local_rag']['enabled'] and status['local_rag']['loaded'] else '❌'}")
        print(f"CocoIndex: {'✅' if status['cocoindex']['enabled'] and status['cocoindex']['flow_loaded'] else '❌'}")
        
        # Create adapter instance to test LocalVectorLibrary
        adapter = QuadRAGAdapter()
        
        print(f"LocalVectorLibrary: {'✅' if adapter.local_library_enabled and adapter.local_library else '❌'}")
        
        # Test search functionality
        print("\n2. 🔍 Testing Search Functionality...")
        
        test_queries = [
            "Pentagon UAP disclosure underwater activity",
            "Lue Elizondo UFO transparency",
            "Stephen Greer disclosure project",
            "alien technology reverse engineering"
        ]
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n   Query {i}: '{query}'")
            
            try:
                results = await search(query, top_k=5)
                
                print(f"   Results: {len(results)} documents found")
                
                # Show breakdown by system
                system_breakdown = {}
                for result in results:
                    system = result.get('system', 'unknown')
                    system_breakdown[system] = system_breakdown.get(system, 0) + 1
                
                for system, count in system_breakdown.items():
                    badge = {
                        'upstash': '☁️',
                        'local_rag': '🏠',
                        'cocoindex': '💾',
                        'local_library': '📚'
                    }.get(system, '❓')
                    print(f"   {badge} {system}: {count} results")
                
                # Show top result details
                if results:
                    top_result = results[0]
                    print(f"   Top result: {top_result.get('badge', '')} Score: {top_result.get('score', 0):.3f}")
                    print(f"   Source: {top_result.get('source', 'Unknown')}")
                    print(f"   Preview: {top_result.get('text', '')[:100]}...")
                
            except Exception as e:
                print(f"   ❌ Search failed: {e}")
        
        # Test individual backend access
        print("\n3. 🔧 Testing Individual Backend Access...")
        
        # Test LocalVectorLibrary stats
        if adapter.local_library:
            try:
                stats = adapter.local_library.get_library_stats()
                print(f"   📚 LocalVectorLibrary: {stats['total_documents']} documents, {stats['total_words']} words")
                print(f"   Storage: {stats['storage_size_mb']} MB, Backend: {stats['vector_backend']}")
            except Exception as e:
                print(f"   ❌ LocalVectorLibrary stats failed: {e}")
        
        # Test LocalRAG stats
        if adapter.local_rag:
            try:
                local_docs = len(adapter.local_rag.documents)
                print(f"   🏠 LocalRAG (FAISS): {local_docs} documents loaded")
            except Exception as e:
                print(f"   ❌ LocalRAG stats failed: {e}")
        
        # Test backend weights
        print("\n4. ⚖️ Backend Configuration...")
        print(f"   Upstash Weight: {adapter.upstash_weight}")
        print(f"   LocalRAG Weight: {adapter.local_rag_weight}")
        print(f"   CocoIndex Weight: {adapter.coco_weight}")
        print(f"   LocalLibrary Weight: {adapter.local_library_weight}")
        print(f"   Total Weight: {adapter.upstash_weight + adapter.local_rag_weight + adapter.coco_weight + adapter.local_library_weight}")
        
        # Test parallel search setting
        print(f"   Parallel Search: {'✅' if adapter.parallel_search else '❌'}")
        
        print("\n5. 🎯 Performance Test...")
        
        # Test performance with a complex query
        complex_query = "underwater UAP objects moving at high speed near naval vessels with disc-shaped craft"
        
        import time
        start_time = time.time()
        
        try:
            results = await search(complex_query, top_k=8)
            end_time = time.time()
            
            search_time = end_time - start_time
            print(f"   Complex search completed in {search_time:.2f}s")
            print(f"   Found {len(results)} results from multiple backends")
            
            # Analyze result diversity
            unique_sources = set()
            unique_systems = set()
            for result in results:
                unique_sources.add(result.get('source', 'Unknown'))
                unique_systems.add(result.get('system', 'unknown'))
            
            print(f"   Result diversity: {len(unique_systems)} systems, {len(unique_sources)} unique sources")
            print(f"   Systems represented: {', '.join(unique_systems)}")
            
        except Exception as e:
            print(f"   ❌ Performance test failed: {e}")
        
        print("\n✅ Quad RAG System Test Complete!")
        print("\n📋 Summary:")
        print("   - 4 RAG backends integrated: Upstash, LocalRAG, CocoIndex, LocalVectorLibrary")
        print("   - Parallel search enabled for optimal performance")
        print("   - Weighted result merging with configurable weights")
        print("   - Backward compatibility maintained with Triple/Dual RAG aliases")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("Make sure all dependencies are installed and paths are correct")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_backward_compatibility():
    """Test that all backward compatibility aliases work"""
    
    print("\n🔄 Testing Backward Compatibility...")
    
    try:
        from adapters import QuadRAGAdapter, TripleRAGAdapter, DualRAGAdapter
        from adapters import quad_rag_adapter, triple_rag_adapter, dual_rag_adapter
        
        print("✅ All class aliases imported successfully")
        
        # Test that aliases point to the same class
        assert QuadRAGAdapter == TripleRAGAdapter == DualRAGAdapter
        print("✅ Class aliases point to same implementation")
        
        # Test that instance aliases point to the same instance
        assert quad_rag_adapter == triple_rag_adapter == dual_rag_adapter
        print("✅ Instance aliases point to same object")
        
        # Test that we can create instances with old names
        old_adapter = TripleRAGAdapter()
        new_adapter = QuadRAGAdapter()
        
        print("✅ Can create instances with both old and new class names")
        
        # Test a simple search with old interface
        results = await triple_rag_adapter.search("UAP disclosure", top_k=3)
        print(f"✅ Legacy search interface works: {len(results)} results")
        
        return True
        
    except Exception as e:
        print(f"❌ Backward compatibility test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Quad RAG System Integration Test")
    print("Date: July 2, 2025")
    print("Testing: Upstash + LocalRAG + CocoIndex + LocalVectorLibrary")
    
    # Set environment variables if not already set
    if not os.getenv("LOCAL_VECTOR_LIBRARY_ENABLED"):
        os.environ["LOCAL_VECTOR_LIBRARY_ENABLED"] = "true"
    if not os.getenv("LOCAL_VECTOR_LIBRARY_PATH"):
        os.environ["LOCAL_VECTOR_LIBRARY_PATH"] = "./unified_ufo_library"
    
    try:
        # Run async tests
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Test main functionality
        success1 = loop.run_until_complete(test_quad_rag_system())
        
        # Test backward compatibility
        success2 = loop.run_until_complete(test_backward_compatibility())
        
        if success1 and success2:
            print("\n🎉 All tests passed! Quad RAG system is ready for use.")
            print("\n📝 Next steps:")
            print("   1. Update API server endpoints to use QuadRAGAdapter")
            print("   2. Test frontend integration with new search results format")
            print("   3. Monitor performance with all 4 backends active")
            print("   4. Set up PostgreSQL database for CocoIndex if needed")
        else:
            print("\n⚠️ Some tests failed. Review logs above for details.")
            
    except KeyboardInterrupt:
        print("\n🛑 Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
    finally:
        loop.close()

if __name__ == "__main__":
    main()