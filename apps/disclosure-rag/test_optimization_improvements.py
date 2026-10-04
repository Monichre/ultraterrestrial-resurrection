#!/usr/bin/env python3
"""
Test script for Xata Python SDK optimization improvements
Demonstrates the performance gains from batch operations, caching, and enhanced search strategies
Date: August 15, 2025
"""

import asyncio
import time
import json
import sys
import os
from pathlib import Path

# Add the lib directory to the path
sys.path.insert(0, str(Path(__file__).parent / "lib"))

try:
    from lib.entity_extraction.utils.optimized_entity_search import OptimizedEntitySearch
    from lib.entity_extraction.processors.interactive_entity_processor import InteractiveEntityProcessor
    from packages.db.src.xata_python_sdk.client import get_xata_client
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure you're running this from the disclosure-rag directory")
    sys.exit(1)


async def test_performance_comparison():
    """Test performance difference between old and new approaches"""
    
    print("🧪 Testing Xata Python SDK Optimization Improvements")
    print("=" * 60)
    
    # Sample entity data for testing
    test_entities = {
        "personnel": [
            "Luis Elizondo",
            "Christopher Mellon", 
            "David Fravor",
            "Ryan Graves",
            "Kevin Day",
            "John Smith",  # Non-existent
            "Jane Doe"     # Non-existent
        ],
        "organizations": [
            "AATIP",
            "AOIMSG",
            "Pentagon",
            "Navy",
            "Air Force",
            "Fake Organization",  # Non-existent
        ],
        "events": [
            "Nimitz Incident",
            "Gimbal Video",
            "FLIR1 Video",
            "Phoenix Lights",
            "Fake Event"  # Non-existent
        ]
    }
    
    try:
        # Initialize the optimized search
        xata_client = get_xata_client()
        optimized_search = OptimizedEntitySearch(xata_client=xata_client)
        
        print(f"📊 Testing with {sum(len(entities) for entities in test_entities.values())} entities")
        print(f"   - Personnel: {len(test_entities['personnel'])} entities")
        print(f"   - Organizations: {len(test_entities['organizations'])} entities") 
        print(f"   - Events: {len(test_entities['events'])} entities")
        print()
        
        # Test 1: Optimized Search (First Run - No Cache)
        print("🚀 Test 1: Optimized Search (First Run)")
        start_time = time.time()
        
        optimized_results = await optimized_search.search_entities_optimized(
            test_entities, 
            use_vector_search=True, 
            confidence_threshold=0.7
        )
        
        optimized_time_1 = time.time() - start_time
        stats_1 = optimized_search.get_performance_stats()
        
        print(f"   ⏱️  Time: {optimized_time_1:.2f} seconds")
        print(f"   📈 Cache hit rate: {stats_1['cache_hit_rate_percent']}%")
        print(f"   🔍 Total operations: {stats_1['total_operations']}")
        print()
        
        # Test 2: Optimized Search (Second Run - With Cache) 
        print("⚡ Test 2: Optimized Search (Second Run - Cache Benefits)")
        start_time = time.time()
        
        optimized_results_2 = await optimized_search.search_entities_optimized(
            test_entities,
            use_vector_search=True,
            confidence_threshold=0.7
        )
        
        optimized_time_2 = time.time() - start_time
        stats_2 = optimized_search.get_performance_stats()
        
        print(f"   ⏱️  Time: {optimized_time_2:.2f} seconds")
        print(f"   📈 Cache hit rate: {stats_2['cache_hit_rate_percent']}%")
        print(f"   🔍 Total operations: {stats_2['total_operations']}")
        print(f"   ⚡ Speed improvement: {((optimized_time_1 - optimized_time_2) / optimized_time_1 * 100):.1f}%")
        print()
        
        # Test 3: Interactive Entity Processor (Traditional Method)
        print("🐌 Test 3: Traditional Interactive Search (for comparison)")
        processor = InteractiveEntityProcessor()
        
        # Mock the entity extraction results to simulate a real workflow
        start_time = time.time()
        
        # Use non-interactive batch search
        traditional_results = processor._batch_xata_search(test_entities)
        
        traditional_time = time.time() - start_time
        
        print(f"   ⏱️  Time: {traditional_time:.2f} seconds")
        print()
        
        # Display Results Summary
        print("📊 OPTIMIZATION RESULTS SUMMARY")
        print("=" * 60)
        
        # Calculate performance improvements
        if traditional_time > 0:
            speed_improvement = ((traditional_time - optimized_time_1) / traditional_time * 100)
            cache_improvement = ((optimized_time_1 - optimized_time_2) / optimized_time_1 * 100)
            
            print(f"⚡ Performance Improvements:")
            print(f"   - Optimized vs Traditional: {speed_improvement:.1f}% faster")
            print(f"   - Cache vs No Cache: {cache_improvement:.1f}% faster")
            print(f"   - Total improvement potential: {((traditional_time - optimized_time_2) / traditional_time * 100):.1f}%")
            print()
        
        # Display search result statistics
        total_entities = sum(len(entities) for entities in test_entities.values())
        found_entities = 0
        not_found_entities = 0
        
        for entity_type, results in optimized_results.items():
            for result in results:
                if result.status == 'found':
                    found_entities += 1
                elif result.status == 'not_found':
                    not_found_entities += 1
        
        print(f"🎯 Search Accuracy:")
        print(f"   - Total entities searched: {total_entities}")
        print(f"   - Found in database: {found_entities}")
        print(f"   - Not found (will be created): {not_found_entities}")
        print(f"   - Success rate: {(found_entities / total_entities * 100):.1f}%")
        print()
        
        # Display cache statistics
        print(f"💾 Cache Performance:")
        print(f"   - Cache hits: {stats_2['cache_hits']}")
        print(f"   - Total operations: {stats_2['total_operations']}")
        print(f"   - Cache efficiency: {stats_2['cache_hit_rate_percent']:.1f}%")
        print()
        
        # Test 4: Entity Creation Performance (if entities need to be created)
        entities_to_create = {}
        for entity_type, results in optimized_results.items():
            entities_needing_creation = [
                result for result in results 
                if result.status == 'not_found' and result.action_needed == 'create_new'
            ]
            if entities_needing_creation:
                entities_to_create[entity_type] = entities_needing_creation
        
        if entities_to_create:
            print("➕ Test 4: Batch Entity Creation")
            if processor.entity_creator:
                start_time = time.time()
                
                creation_results = await processor.entity_creator.create_entities_batch(entities_to_create)
                
                creation_time = time.time() - start_time
                
                print(f"   ⏱️  Creation time: {creation_time:.2f} seconds")
                print(f"   ✅ Entities created: {creation_results['statistics']['total_created']}")
                print(f"   ❌ Creation failures: {creation_results['statistics']['total_failed']}")
                print()
        
        print("✅ Optimization testing completed successfully!")
        
        # Save detailed results to file
        results_file = Path(__file__).parent / "optimization_test_results.json"
        with open(results_file, 'w') as f:
            json.dump({
                "test_timestamp": time.time(),
                "optimization_results": {
                    "optimized_time_first_run": optimized_time_1,
                    "optimized_time_cached_run": optimized_time_2,
                    "traditional_time": traditional_time,
                    "performance_stats": stats_2,
                    "search_results_summary": {
                        "total_entities": total_entities,
                        "found_entities": found_entities,
                        "not_found_entities": not_found_entities
                    }
                }
            }, f, indent=2)
        
        print(f"📄 Detailed results saved to: {results_file}")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()


def test_individual_components():
    """Test individual optimization components"""
    
    print("\n🔧 Testing Individual Optimization Components")
    print("=" * 60)
    
    # Test cache functionality
    print("💾 Testing Cache Functionality...")
    try:
        from lib.entity_extraction.utils.optimized_entity_search import EntitySearchCache
        
        cache = EntitySearchCache()
        
        # Test cache operations
        test_entities = ["Test Entity 1", "Test Entity 2"]
        from lib.entity_extraction.utils.optimized_entity_search import SearchResult
        
        test_results = [
            SearchResult(entity_name="Test Entity 1", status="found", confidence_score=1.0),
            SearchResult(entity_name="Test Entity 2", status="not_found", action_needed="create_new")
        ]
        
        # Set cache
        cache.set("personnel", test_entities, test_results)
        
        # Get from cache
        cached_results = cache.get("personnel", test_entities)
        
        if cached_results and len(cached_results) == 2:
            print("   ✅ Cache operations working correctly")
        else:
            print("   ❌ Cache operations failed")
            
    except Exception as e:
        print(f"   ❌ Cache test failed: {e}")
    
    # Test SDK interface compatibility
    print("\n🔌 Testing SDK Interface Compatibility...")
    try:
        from packages.db.src.xata_python_sdk.client import get_xata_client
        
        client = get_xata_client()
        
        # Test interface methods
        if hasattr(client, 'records') and hasattr(client, 'data'):
            records_interface = client.records()
            data_interface = client.data()
            
            if (hasattr(records_interface, 'insert_async') and 
                hasattr(data_interface, 'search_async')):
                print("   ✅ SDK interface compatibility verified")
            else:
                print("   ❌ SDK interface methods missing")
        else:
            print("   ❌ SDK interface not available")
            
    except Exception as e:
        print(f"   ❌ SDK interface test failed: {e}")
    
    print("\n✅ Component testing completed!")


async def main():
    """Main test function"""
    
    print("🚀 Xata Python SDK Optimization Test Suite")
    print("=" * 80)
    print()
    
    # Check if Xata credentials are available
    try:
        xata_client = get_xata_client()
        print("✅ Xata client initialized successfully")
    except Exception as e:
        print(f"❌ Xata client initialization failed: {e}")
        print("Please ensure XATA_API_KEY and XATA_DATABASE_URL are set")
        return
    
    print()
    
    # Run component tests first
    test_individual_components()
    
    print()
    
    # Run performance comparison
    await test_performance_comparison()
    
    print("\n🎉 All tests completed!")


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())