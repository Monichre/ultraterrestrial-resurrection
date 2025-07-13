#!/usr/bin/env python3
"""
Test Entity Creation Functionality
Uses existing entity processing results to test creation workflow
Date: July 12, 2025
"""

import os
import sys
import json
import asyncio
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from lib.entity_extraction.core.entity_creator import EntityCreator, create_entities_from_results

async def test_entity_creation():
    """Test entity creation using Bob Lazar results"""
    
    # Path to the Bob Lazar entity processing results
    results_file = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/transcripts/2025-07-12/PmclCzGFotM/entity_processing_results.json"
    
    if not os.path.exists(results_file):
        print(f"❌ Results file not found: {results_file}")
        print("Run 'dy' on a YouTube video first to generate entity processing results")
        return
    
    print("🧪 Testing Entity Creation Functionality")
    print("=" * 50)
    
    # Load and display the results
    try:
        with open(results_file, 'r', encoding='utf-8') as f:
            results_data = json.load(f)
        
        print(f"📁 Loaded results from: {Path(results_file).name}")
        print(f"🎥 Video ID: {results_data.get('video_id', 'Unknown')}")
        print(f"📊 Total entities: {results_data.get('total_entities', 0)}")
        print(f"🔍 Total matches: {results_data.get('total_matches', 0)}")
        
        # Count entities needing creation
        search_results = results_data.get("xata_search_results", {})
        entities_needing_creation = 0
        
        print("\n📋 Entities Status:")
        for entity_type, results in search_results.items():
            found = len([r for r in results if r.get('status') == 'found'])
            not_found = len([r for r in results if r.get('status') == 'not_found'])
            total = len(results)
            
            if total > 0:
                print(f"  {entity_type}: {total} total, ✅ {found} found, ❌ {not_found} need creation")
                entities_needing_creation += not_found
        
        print(f"\n🆕 Total entities needing creation: {entities_needing_creation}")
        
        if entities_needing_creation == 0:
            print("✅ All entities already exist in database!")
            return
        
        # Test entity creation
        print("\n🔄 Starting entity creation test...")
        creation_results = await create_entities_from_results(results_file)
        
        # Display results
        print("\n📊 Creation Results:")
        print(json.dumps(creation_results, indent=2))
        
        if creation_results.get("error"):
            print(f"❌ Creation failed: {creation_results['error']}")
        else:
            stats = creation_results.get("statistics", {})
            print(f"✅ Successfully created: {stats.get('total_created', 0)} entities")
            print(f"❌ Failed to create: {stats.get('total_failed', 0)} entities")
            print(f"📊 Total processed: {stats.get('total_processed', 0)} entities")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

def test_entity_creator_direct():
    """Test the EntityCreator class directly"""
    
    print("\n🧪 Testing EntityCreator Class Directly")
    print("=" * 50)
    
    try:
        creator = EntityCreator()
        print("✅ EntityCreator initialized successfully")
        
        # Test with mock search results
        mock_search_results = {
            "events": [
                {
                    "entity_name": "Test Event",
                    "status": "not_found",
                    "table": "events",
                    "action_needed": "create_new"
                }
            ],
            "technologies": [
                {
                    "entity_name": "Test Technology", 
                    "status": "not_found",
                    "table": "technologies",
                    "action_needed": "create_new"
                }
            ]
        }
        
        print("🔄 Testing with mock data...")
        
        # This would actually create entities - commenting out for safety
        # results = await creator.create_missing_entities(mock_search_results)
        # print("✅ Mock creation test completed")
        
        print("⚠️ Mock creation skipped (would create real database records)")
        
    except Exception as e:
        print(f"❌ EntityCreator test failed: {e}")

if __name__ == "__main__":
    print("🚀 Entity Creation Test Suite")
    print("=" * 50)
    
    # Run async test
    asyncio.run(test_entity_creation())
    
    # Run direct test
    test_entity_creator_direct()
    
    print("\n✅ Test suite completed!")