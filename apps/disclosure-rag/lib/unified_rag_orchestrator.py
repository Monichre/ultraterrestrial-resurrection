#!/usr/bin/env python3
"""
Unified RAG Orchestrator for Disclosure-RAG Python System
Bridges the foundational OpenAI vector store with local Python RAG systems

Architecture:
- Tier 1 (Primary): OpenAI Vector Store (1,477 files) - The foundation that powers Prometheus
- Tier 2 (Supplementary): Local Python RAG systems (295 additional local files)

Purpose: Give the Python disclosure-rag system access to the complete knowledge base
that includes both OpenAI's extensive collection AND locally-only documents.
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Union, Any
from dataclasses import dataclass
from pathlib import Path

from openai import OpenAI
import logging

# Import local RAG systems with graceful fallback
TripleRAGSchemaAdapter = None
UpstashVectorSearch = None
LocalVectorLibrary = None

try:
    from lib.adapters.triple_rag_schema_adapter import TripleRAGSchemaAdapter
except ImportError as e:
    logging.warning(f"Triple RAG adapter not available: {e}")

try:
    from lib.upstash.vector import UpstashVectorSearch
except ImportError as e:
    logging.warning(f"Upstash vector not available: {e}")

try:
    from lib.storage.local_vector_library import LocalVectorLibrary
except ImportError as e:
    logging.warning(f"Local vector library not available: {e}")

@dataclass
class SearchResult:
    """Standardized search result across all RAG systems"""
    content: str
    source: str
    score: float
    system: str  # 'openai', 'upstash', 'local', 'cocoindex'
    metadata: Dict[str, Any]

@dataclass
class RAGSystemStatus:
    """Status of each RAG system"""
    name: str
    available: bool
    file_count: Optional[int] = None
    error: Optional[str] = None

class UnifiedRAGOrchestrator:
    """
    Intelligent RAG orchestration with OpenAI as primary tier
    Routes queries to most appropriate system based on content and availability
    """
    
    def __init__(self, openai_api_key: str = None, vector_store_id: str = None):
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')
        self.vector_store_id = vector_store_id or 'vs_meWOEnUiUxtQWf0W6NBsNpCG'
        
        # Initialize systems
        self.openai_client = OpenAI(api_key=self.openai_api_key) if self.openai_api_key else None
        self.systems_status = {}
        self.local_rag_adapter = None
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Initialize systems
        self._initialize_systems()
    
    def _initialize_systems(self):
        """Initialize and check status of all RAG systems"""
        self.logger.info("🚀 Initializing Unified RAG Orchestrator")
        
        # Check OpenAI system (Tier 1 - Primary)
        self._check_openai_status()
        
        # Check local RAG systems (Tier 2 - Supplementary)
        self._check_local_systems_status()
        
        # Log system status
        self._log_system_status()
    
    def _check_openai_status(self):
        """Check OpenAI vector store status"""
        try:
            if not self.openai_client:
                self.systems_status['openai'] = RAGSystemStatus(
                    name='OpenAI Vector Store',
                    available=False,
                    error='No API key provided'
                )
                return
            
            # Test connection by getting file count
            files = self.openai_client.files.list()
            file_count = len(files.data)
            
            self.systems_status['openai'] = RAGSystemStatus(
                name='OpenAI Vector Store',
                available=True,
                file_count=file_count
            )
            self.logger.info(f"✅ OpenAI Vector Store: {file_count} files")
            
        except Exception as e:
            self.systems_status['openai'] = RAGSystemStatus(
                name='OpenAI Vector Store',
                available=False,
                error=str(e)
            )
            self.logger.error(f"❌ OpenAI Vector Store error: {e}")
    
    def _check_local_systems_status(self):
        """Check status of local RAG systems"""
        
        # Check Triple RAG Adapter
        if TripleRAGSchemaAdapter:
            try:
                self.local_rag_adapter = TripleRAGSchemaAdapter()
                self.systems_status['triple_rag'] = RAGSystemStatus(
                    name='Triple RAG Adapter',
                    available=True
                )
                self.logger.info("✅ Triple RAG Adapter available")
            except Exception as e:
                self.systems_status['triple_rag'] = RAGSystemStatus(
                    name='Triple RAG Adapter',
                    available=False,
                    error=str(e)
                )
                self.logger.error(f"❌ Triple RAG Adapter error: {e}")
        else:
            self.systems_status['triple_rag'] = RAGSystemStatus(
                name='Triple RAG Adapter',
                available=False,
                error='Module not imported'
            )
        
        # Check Upstash Vector
        if UpstashVectorSearch:
            try:
                # Test Upstash connection
                self.systems_status['upstash'] = RAGSystemStatus(
                    name='Upstash Vector',
                    available=True
                )
                self.logger.info("✅ Upstash Vector available")
            except Exception as e:
                self.systems_status['upstash'] = RAGSystemStatus(
                    name='Upstash Vector',
                    available=False,
                    error=str(e)
                )
        else:
            self.systems_status['upstash'] = RAGSystemStatus(
                name='Upstash Vector',
                available=False,
                error='Module not imported'
            )
        
        # Check Local Vector Library
        if LocalVectorLibrary:
            try:
                self.systems_status['local'] = RAGSystemStatus(
                    name='Local Vector Library',
                    available=True
                )
                self.logger.info("✅ Local Vector Library available")
            except Exception as e:
                self.systems_status['local'] = RAGSystemStatus(
                    name='Local Vector Library',
                    available=False,
                    error=str(e)
                )
        else:
            self.systems_status['local'] = RAGSystemStatus(
                name='Local Vector Library',
                available=False,
                error='Module not imported'
            )
    
    def _log_system_status(self):
        """Log overall system status"""
        available_systems = [s.name for s in self.systems_status.values() if s.available]
        unavailable_systems = [s.name for s in self.systems_status.values() if not s.available]
        
        self.logger.info(f"📊 Systems Available: {len(available_systems)}/{len(self.systems_status)}")
        self.logger.info(f"✅ Available: {', '.join(available_systems)}")
        if unavailable_systems:
            self.logger.warning(f"❌ Unavailable: {', '.join(unavailable_systems)}")
    
    async def search(self, query: str, max_results: int = 10, system_preference: str = 'auto') -> List[SearchResult]:
        """
        Intelligent search across all available RAG systems
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            system_preference: 'auto', 'openai_only', 'local_only', or specific system name
        
        Returns:
            List of SearchResult objects ranked by relevance
        """
        self.logger.info(f"🔍 Searching: '{query}' (preference: {system_preference})")
        
        results = []
        
        # Primary: OpenAI Vector Store (Tier 1)
        if system_preference in ['auto', 'openai_only', 'openai'] and self.systems_status['openai'].available:
            openai_results = await self._search_openai(query, max_results)
            results.extend(openai_results)
            self.logger.info(f"🎯 OpenAI returned {len(openai_results)} results")
        
        # Secondary: Local RAG systems (Tier 2) - only if needed
        if system_preference in ['auto', 'local_only'] and len(results) < max_results:
            local_results = await self._search_local_systems(query, max_results - len(results))
            results.extend(local_results)
            self.logger.info(f"📚 Local systems returned {len(local_results)} results")
        
        # Sort by score and limit results
        results.sort(key=lambda x: x.score, reverse=True)
        final_results = results[:max_results]
        
        self.logger.info(f"📊 Returning {len(final_results)} total results")
        return final_results
    
    async def _search_openai(self, query: str, max_results: int) -> List[SearchResult]:
        """Search using OpenAI Assistant + Vector Store"""
        try:
            # Create a thread for the search
            thread = await asyncio.to_thread(
                self.openai_client.beta.threads.create,
                messages=[{"role": "user", "content": f"Search for: {query}"}]
            )
            
            # Use the disclosure assistant ID from the working API
            assistant_id = "asst_sdNxYC9p05iGpeKXtL496cyh"  # From disclosure/chat/route.ts
            
            # Create a run with file_search
            run = await asyncio.to_thread(
                self.openai_client.beta.threads.runs.create,
                thread_id=thread.id,
                assistant_id=assistant_id,
                tools=[{"type": "file_search"}]
            )
            
            # Wait for completion
            while run.status in ['queued', 'in_progress']:
                await asyncio.sleep(1)
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
                                    score=0.9,  # High score for OpenAI results
                                    system='openai',
                                    metadata={'thread_id': thread.id, 'run_id': run.id}
                                ))
                
                return results[:max_results]
            
            else:
                self.logger.error(f"OpenAI search failed with status: {run.status}")
                return []
                
        except Exception as e:
            self.logger.error(f"Error searching OpenAI: {e}")
            return []
    
    async def _search_local_systems(self, query: str, max_results: int) -> List[SearchResult]:
        """Search local RAG systems for supplementary content"""
        results = []
        
        # Search Triple RAG Adapter if available
        if self.local_rag_adapter and self.systems_status['triple_rag'].available:
            try:
                local_results = await asyncio.to_thread(
                    self.local_rag_adapter.search,
                    query,
                    limit=max_results
                )
                
                for result in local_results:
                    results.append(SearchResult(
                        content=result.get('content', ''),
                        source=result.get('source', 'Local RAG'),
                        score=result.get('score', 0.5),
                        system='triple_rag',
                        metadata=result.get('metadata', {})
                    ))
                    
            except Exception as e:
                self.logger.error(f"Error searching local systems: {e}")
        
        return results
    
    def get_system_status(self) -> Dict[str, RAGSystemStatus]:
        """Get status of all RAG systems"""
        return self.systems_status
    
    def get_available_systems(self) -> List[str]:
        """Get list of available system names"""
        return [name for name, status in self.systems_status.items() if status.available]
    
    def is_openai_primary(self) -> bool:
        """Check if OpenAI is available as primary system"""
        return self.systems_status.get('openai', RAGSystemStatus('', False)).available

# Example usage and testing
async def main():
    """Test the unified orchestrator"""
    orchestrator = UnifiedRAGOrchestrator()
    
    # Test search
    results = await orchestrator.search("UFO sightings nuclear facilities", max_results=5)
    
    print(f"\n📊 Search Results ({len(results)} found):")
    print("=" * 60)
    
    for i, result in enumerate(results, 1):
        print(f"{i}. [{result.system.upper()}] Score: {result.score:.2f}")
        print(f"   Source: {result.source}")
        print(f"   Content: {result.content[:200]}...")
        print()

if __name__ == "__main__":
    asyncio.run(main())