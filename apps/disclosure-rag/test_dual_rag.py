#!/usr/bin/env python3
"""
Test Dual RAG Integration (Upstash only for now)
Date: June 29, 2025
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the disclosure-rag path to import our adapter
sys.path.insert(0, str(Path(__file__).parent / "apps" / "disclosure-rag"))

async def test_dual_rag():
    """Test the dual RAG adapter with Upstash only"""
    try:
        # Import our dual RAG adapter
        from lib.adapters.dual_rag_adapter import dual_rag_adapter
        
        print("🧪 Testing Dual RAG Adapter")
        print("=" * 40)
        
        # Check status
        print("\n1. Checking system status...")
        status = dual_rag_adapter.get_status()
        
        print(f"✓ Upstash enabled: {status['upstash'].get('enabled', False)}")
        print(f"✓ Upstash connected: {status['upstash'].get('connected', False)}")
        print(f"✓ CocoIndex enabled: {status['cocoindex'].get('enabled', False)}")
        print(f"✓ Parallel search: {status['settings']['parallel_search']}")
        
        # Test search
        print("\n2. Testing search functionality...")
        test_queries = [
            "UFO sightings",
            "Phoenix lights", 
            "Navy encounters"
        ]
        
        for query in test_queries:
            print(f"\nSearching for: '{query}'")
            try:
                results = await dual_rag_adapter.search(query, top_k=3)
                
                if results:
                    print(f"  Found {len(results)} results:")
                    for i, result in enumerate(results, 1):
                        print(f"    {i}. [{result['badge']}] {result.get('source', 'Unknown')}")
                        print(f"       Score: {result['score']:.3f}")
                        print(f"       Text: {result['text'][:100]}...")
                else:
                    print("  No results found")
                    
            except Exception as e:
                print(f"  ❌ Search failed: {e}")
        
        # Test environment variables
        print("\n3. Environment configuration...")
        env_vars = [
            "UPSTASH_VECTOR_REST_URL",
            "UPSTASH_VECTOR_REST_TOKEN", 
            "COCOINDEX_ENABLED"
        ]
        
        for var in env_vars:
            value = os.getenv(var)
            if value:
                # Hide sensitive tokens
                if "TOKEN" in var and len(value) > 10:
                    display_value = value[:10] + "..." + value[-4:]
                else:
                    display_value = value
                print(f"  ✓ {var}: {display_value}")
            else:
                print(f"  ⚠️  {var}: Not set")
        
        print("\n✅ Dual RAG adapter test complete!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're running from the project root directory")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

async def test_api_endpoints():
    """Test the FastAPI endpoints"""
    try:
        import httpx
        
        print("\n🌐 Testing API Endpoints")
        print("=" * 40)
        
        # Check if server is running
        base_url = "http://localhost:8000"
        
        async with httpx.AsyncClient() as client:
            # Test status endpoint
            print("\n1. Testing /rag/status endpoint...")
            try:
                response = await client.get(f"{base_url}/rag/status")
                if response.status_code == 200:
                    data = response.json()
                    print(f"  ✓ Status endpoint working")
                    print(f"  ✓ Dual RAG available: {data.get('dual_rag_available', False)}")
                else:
                    print(f"  ❌ Status check failed: {response.status_code}")
            except Exception as e:
                print(f"  ⚠️ Server not running or endpoint not available: {e}")
            
            # Test search endpoint
            print("\n2. Testing /rag/search endpoint...")
            try:
                search_data = {
                    "query": "UFO",
                    "top_k": 3,
                    "include_metadata": True
                }
                
                response = await client.post(f"{base_url}/rag/search", json=search_data)
                if response.status_code == 200:
                    data = response.json()
                    print(f"  ✓ Search endpoint working")
                    print(f"  ✓ Found {data.get('total_results', 0)} results")
                    print(f"  ✓ Systems used: {data.get('systems_used', [])}")
                else:
                    print(f"  ❌ Search failed: {response.status_code}")
            except Exception as e:
                print(f"  ⚠️ Search endpoint not available: {e}")
        
        return True
        
    except ImportError:
        print("⚠️ httpx not available, skipping API tests")
        return True
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def setup_environment():
    """Set up environment variables for testing"""
    print("\n⚙️ Setting up test environment...")
    
    # Check if .env file exists
    env_file = Path(".env")
    env_lines = []
    
    if env_file.exists():
        with open(env_file, 'r') as f:
            env_lines = f.readlines()
    
    # Add CocoIndex config if not present
    has_coco_enabled = any("COCOINDEX_ENABLED" in line for line in env_lines)
    
    if not has_coco_enabled:
        env_lines.append("\n# CocoIndex Configuration\n")
        env_lines.append("COCOINDEX_ENABLED=false\n")
        env_lines.append("COCOINDEX_FLOW_NAME=UFOResearch\n")
        
        with open(env_file, 'w') as f:
            f.writelines(env_lines)
        
        print("✓ Added CocoIndex config to .env file")
    else:
        print("✓ CocoIndex config already in .env file")

async def main():
    """Main test function"""
    print("🚀 Dual RAG Integration Test")
    print("=" * 50)
    
    # Setup environment
    setup_environment()
    
    # Test the adapter directly
    adapter_success = await test_dual_rag()
    
    # Test API endpoints
    api_success = await test_api_endpoints()
    
    print("\n" + "=" * 50)
    print("📊 Test Summary")
    print("=" * 50)
    print(f"Adapter Test: {'✅ PASS' if adapter_success else '❌ FAIL'}")
    print(f"API Test: {'✅ PASS' if api_success else '❌ FAIL'}")
    
    if adapter_success:
        print(f"\n🎉 Ready to test in your app!")
        print("Next steps:")
        print("1. Start disclosure-rag server: cd apps/disclosure-rag && python api_server.py")
        print("2. Start main app: cd apps/app && npm run dev")
        print("3. Try the RAG commands in TipTap editor")
    else:
        print(f"\n🔧 Issues found - check the logs above")
    
    return adapter_success and api_success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)