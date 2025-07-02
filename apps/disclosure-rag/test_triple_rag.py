#!/usr/bin/env python3
"""
Test Triple RAG System - Upstash + LocalRAG + CocoIndex
Date: July 2, 2025
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the lib directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "lib"))

from adapters.dual_rag_adapter import triple_rag_adapter, get_adapter_status

async def test_triple_rag():
    """Test the triple RAG system"""
    print("🛸 Testing Triple RAG System")
    print("=" * 50)
    
    # Get system status
    print("📊 System Status:")
    status = get_adapter_status()
    
    print(f"  Upstash: {'✅' if status['upstash']['enabled'] else '❌'}")
    if 'error' in status['upstash']:
        print(f"    Error: {status['upstash']['error']}")
    
    print(f"  LocalRAG: {'✅' if status['local_rag']['enabled'] else '❌'}")
    print(f"    Available: {'✅' if status['local_rag']['available'] else '❌'}")
    print(f"    Documents: {status['local_rag']['documents']}")
    
    print(f"  CocoIndex: {'✅' if status['cocoindex']['enabled'] else '❌'}")
    print(f"    Available: {'✅' if status['cocoindex']['available'] else '❌'}")
    
    print(f"\n⚙️  Settings:")
    settings = status['settings']
    print(f"  Parallel Search: {settings['parallel_search']}")
    print(f"  Weights: Upstash={settings['upstash_weight']}, LocalRAG={settings['local_rag_weight']}, CocoIndex={settings['coco_weight']}")
    
    # Test search
    print(f"\n🔍 Testing Search...")
    test_queries = [
        "UFO sightings",
        "extraterrestrial contact", 
        "government disclosure"
    ]
    
    for query in test_queries:
        print(f"\n  Query: '{query}'")
        try:
            results = await triple_rag_adapter.search(query, top_k=3)
            print(f"  Results: {len(results)}")
            
            for i, result in enumerate(results, 1):
                print(f"    {i}. [{result['badge']}] {result['source'][:50]}...")
                print(f"       Score: {result['score']:.3f}")
                print(f"       Text: {result['text'][:100]}...")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print(f"\n✅ Triple RAG test complete!")

if __name__ == "__main__":
    asyncio.run(test_triple_rag())