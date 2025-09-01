#!/usr/bin/env python3
"""
Simple Unified Search - OpenAI focused version without complex dependencies
Provides immediate access to the foundational OpenAI vector store
"""

import os
import asyncio
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

from openai import OpenAI

@dataclass
class SearchResult:
    """Simple search result structure"""
    content: str
    source: str
    score: float
    system: str
    metadata: Dict[str, Any]

class SimpleUnifiedSearch:
    """Simple search that prioritizes OpenAI vector store"""
    
    def __init__(self, openai_api_key: str = None):
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')
        self.openai_client = OpenAI(api_key=self.openai_api_key) if self.openai_api_key else None
        self.logger = logging.getLogger(__name__)
        
        # Test OpenAI connection
        self._test_connection()
    
    def _test_connection(self):
        """Test OpenAI connection and log status"""
        if not self.openai_client:
            self.logger.warning("❌ OpenAI client not available - no API key")
            self.openai_available = False
            return
        
        try:
            # Test by getting file count
            files = self.openai_client.files.list()
            self.file_count = len(files.data)
            self.openai_available = True
            self.logger.info(f"✅ OpenAI Vector Store connected: {self.file_count:,} files")
        except Exception as e:
            self.logger.error(f"❌ OpenAI connection failed: {e}")
            self.openai_available = False
    
    async def search_openai(self, query: str, max_results: int = 10) -> List[SearchResult]:
        """Search using OpenAI Assistant + Vector Store"""
        if not self.openai_available:
            return []
        
        try:
            self.logger.info(f"🔍 Searching OpenAI for: '{query}'")
            
            # Create a thread for the search
            thread = await asyncio.to_thread(
                self.openai_client.beta.threads.create,
                messages=[{"role": "user", "content": f"Search for information about: {query}"}]
            )
            
            # Use the disclosure assistant ID
            assistant_id = "asst_sdNxYC9p05iGpeKXtL496cyh"
            
            # Create a run with file_search
            run = await asyncio.to_thread(
                self.openai_client.beta.threads.runs.create,
                thread_id=thread.id,
                assistant_id=assistant_id,
                tools=[{"type": "file_search"}]
            )
            
            # Wait for completion (with timeout)
            max_wait = 30  # 30 seconds max
            waited = 0
            
            while run.status in ['queued', 'in_progress'] and waited < max_wait:
                await asyncio.sleep(2)
                waited += 2
                run = await asyncio.to_thread(
                    self.openai_client.beta.threads.runs.retrieve,
                    thread_id=thread.id,
                    run_id=run.id
                )
            
            if run.status == 'completed':
                # Get the messages
                messages = await asyncio.to_thread(
                    self.openai_client.beta.threads.messages.list,
                    thread_id=thread.id
                )
                
                results = []
                for message in messages.data:
                    if message.role == 'assistant' and message.content:
                        for content in message.content:
                            if hasattr(content, 'text'):
                                results.append(SearchResult(
                                    content=content.text.value,
                                    source='OpenAI Vector Store',
                                    score=0.9,
                                    system='openai',
                                    metadata={
                                        'thread_id': thread.id,
                                        'run_id': run.id,
                                        'total_files': self.file_count
                                    }
                                ))
                
                self.logger.info(f"✅ Found {len(results)} OpenAI results")
                return results[:max_results]
            
            else:
                self.logger.error(f"❌ OpenAI search failed with status: {run.status}")
                return []
                
        except Exception as e:
            self.logger.error(f"❌ Error searching OpenAI: {e}")
            return []
    
    def get_status(self) -> Dict[str, Any]:
        """Get simple status info"""
        return {
            'openai_available': self.openai_available,
            'file_count': getattr(self, 'file_count', 0),
            'primary_system': 'OpenAI Vector Store' if self.openai_available else 'None'
        }

# Test function
async def test_simple_search():
    """Test the simple search"""
    print("🚀 Testing Simple Unified Search...")
    
    search = SimpleUnifiedSearch()
    status = search.get_status()
    
    print(f"📊 Status: {status}")
    
    if status['openai_available']:
        print("\n🔍 Testing search...")
        results = await search.search_openai("UFO sightings nuclear facilities", max_results=3)
        
        print(f"📊 Found {len(results)} results")
        for i, result in enumerate(results, 1):
            print(f"\n{i}. {result.system.upper()} - Score: {result.score}")
            print(f"   Content: {result.content[:200]}...")
    else:
        print("⚠️  OpenAI not available")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(test_simple_search())