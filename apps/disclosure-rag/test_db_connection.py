#!/usr/bin/env python3
"""
Test script for Ultraterrestrial PostgreSQL + pgvector Database
Demonstrates CSV import and analytics capabilities
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the lib directory to Python path
sys.path.append(str(Path(__file__).parent / 'lib' / 'connectors'))

try:
    from ultraterrestrial_db import UltraterrestrialDB, quick_setup_and_import, demo_search_and_analytics
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you have the required dependencies installed:")
    print("pip install asyncpg pandas numpy sentence-transformers")
    sys.exit(1)

async def test_connection_only():
    """Test database connection without importing data"""
    print("🔌 Testing database connection...")
    
    db = UltraterrestrialDB()
    
    try:
        await db.connect()
        print("✅ Database connection successful!")
        
        # Get basic stats
        stats = await db.get_database_stats()
        print("\n📊 Current database state:")
        for key, value in stats.items():
            print(f"  • {key}: {value}")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nMake sure you have:")
        print("1. PostgreSQL running with pgvector extension")
        print("2. Database 'ultraterrestrial' created")
        print("3. Schema loaded from schema_ultraterrestrial_pgvector.sql")
    finally:
        await db.close()

async def test_csv_import():
    """Test CSV import from exports directory"""
    print("📂 Testing CSV import from exports directory...")
    
    exports_dir = "./exports"
    if not Path(exports_dir).exists():
        print(f"❌ Exports directory not found: {exports_dir}")
        return
    
    try:
        db = await quick_setup_and_import(exports_dir)
        
        print("\n📊 Post-import database stats:")
        stats = await db.get_database_stats()
        for key, value in stats.items():
            print(f"  • {key}: {value}")
        
        # Test semantic search if embeddings are available
        print("\n🔍 Testing semantic search...")
        results = await db.semantic_search("navy pilots UFO encounter", "events", 3)
        
        if results:
            print("Search results:")
            for result in results:
                print(f"  • {result.title} (similarity: {result.similarity_score:.3f})")
        else:
            print("No results found (embeddings may not be generated yet)")
        
        await db.close()
        
    except Exception as e:
        print(f"❌ CSV import failed: {e}")

async def test_analytics():
    """Test analytics queries"""
    print("📈 Testing analytics capabilities...")
    
    try:
        await demo_search_and_analytics()
    except Exception as e:
        print(f"❌ Analytics test failed: {e}")

async def main():
    """Main test runner"""
    print("🚀 Ultraterrestrial Database Test Suite")
    print("=" * 50)
    
    # Check if CSV files exist
    exports_path = Path("./exports")
    csv_files = list(exports_path.glob("*.csv")) if exports_path.exists() else []
    
    print(f"\n📁 Found {len(csv_files)} CSV files in exports directory")
    if csv_files:
        print("Available files:")
        for csv_file in csv_files[:5]:  # Show first 5
            print(f"  • {csv_file.name}")
        if len(csv_files) > 5:
            print(f"  ... and {len(csv_files) - 5} more")
    
    # Test connection first
    await test_connection_only()
    
    # Ask user what to test
    print("\n" + "=" * 50)
    print("Choose test to run:")
    print("1. Connection test only (done above)")
    print("2. CSV import test")
    print("3. Analytics demo")
    print("4. All tests")
    
    try:
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == "2":
            await test_csv_import()
        elif choice == "3":
            await test_analytics()
        elif choice == "4":
            await test_csv_import()
            await test_analytics()
        else:
            print("✅ Connection test completed!")
    
    except KeyboardInterrupt:
        print("\n👋 Test interrupted by user")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())