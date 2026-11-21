#!/usr/bin/env python3
"""
Test EntityCreator functionality
Quick validation of entity creation system
"""

import os
import sys
import asyncio
import json
from typing import Dict, Any

# Add the disclosure-rag lib to path
sys.path.append(os.path.join(os.path.dirname(__file__), "lib"))

from lib.entity_extraction.core.entity_creator import EntityCreator

def create_test_search_results() -> Dict[str, Any]:
    """Create mock search results with entities marked for creation"""
    return {
        "personnel": [
            {
                "entity_name": "Test Person Alpha",
                "status": "not_found",
                "action_needed": "create_new",
                "table": "personnel",
                "metadata": {
                    "role": "Researcher",
                    "rank": "Dr."
                }
            }
        ],
        "organizations": [
            {
                "entity_name": "Test Organization Beta",
                "status": "not_found",
                "action_needed": "create_new",
                "table": "organizations",
                "metadata": {
                    "type": "Research Institution",
                    "specialization": "UFO Research"
                }
            }
        ],
        "topics": [
            {
                "entity_name": "Test Topic Gamma", 
                "status": "not_found",
                "action_needed": "create_new",
                "table": "topics"
            }
        ]
    }

async def test_entity_creator():
    """Test the EntityCreator functionality"""
    print("🧪 Testing EntityCreator...")
    
    try:
        # Initialize EntityCreator
        creator = EntityCreator()
        print(f"✅ EntityCreator initialized")
        print(f"   - Xata available: {creator.xata_client is not None}")
        print(f"   - Node scripts path: {creator.node_scripts_path}")
        
        # Create test data
        test_results = create_test_search_results()
        print(f"✅ Created test data with {sum(len(entities) for entities in test_results.values())} entities")
        
        # Test entity creation (if Xata is available)
        if creator.xata_client:
            print("🔄 Testing entity creation...")
            creation_results = await creator.create_missing_entities(test_results)
            
            print("📊 Creation Results:")
            print(json.dumps(creation_results.get("statistics", {}), indent=2))
            
            if creation_results.get("errors"):
                print("⚠️ Errors encountered:")
                for error in creation_results["errors"]:
                    print(f"   - {error}")
            
            # Display created entities
            for entity_type, created in creation_results.get("created_entities", {}).items():
                if created:
                    print(f"✅ Created {len(created)} {entity_type} entities:")
                    for entity in created:
                        print(f"   - {entity['entity_name']} (ID: {entity.get('xata_id', 'Unknown')})")
                        
            # Display failed creations
            for entity_type, failed in creation_results.get("failed_creations", {}).items():
                if failed:
                    print(f"❌ Failed to create {len(failed)} {entity_type} entities:")
                    for entity in failed:
                        print(f"   - {entity['entity_name']}: {entity.get('error', 'Unknown error')}")
                        
        else:
            print("⚠️ Xata client not available - testing data preparation only")
            
            # Test data preparation
            for entity_type, entities in test_results.items():
                for entity_data in entities:
                    record_data = creator._prepare_record_data(entity_type, entity_data)
                    if record_data:
                        print(f"✅ Prepared {entity_type} data for {entity_data['entity_name']}")
                        print(f"   - Fields: {list(record_data.keys())}")
                    else:
                        print(f"❌ Failed to prepare {entity_type} data for {entity_data['entity_name']}")
        
        print("🎉 EntityCreator test complete!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_entity_creator())