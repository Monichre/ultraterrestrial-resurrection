#!/usr/bin/env python3
"""
Unified Search API - Exposes the unified RAG orchestrator through FastAPI
Provides intelligent routing between OpenAI vector store and local RAG systems
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.unified_rag_orchestrator import UnifiedRAGOrchestrator, SearchResult

app = FastAPI(
    title="Unified RAG Search API",
    description="Intelligent search across OpenAI vector store and local RAG systems",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global orchestrator instance
orchestrator = None

class SearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 10
    system_preference: Optional[str] = 'auto'  # 'auto', 'openai_only', 'local_only'

class SearchResponse(BaseModel):
    results: List[Dict[str, Any]]
    total_results: int
    systems_used: List[str]
    query: str

class SystemStatusResponse(BaseModel):
    systems: Dict[str, Dict[str, Any]]
    available_systems: List[str]
    primary_system: str
    total_systems: int

@app.on_event("startup")
async def startup_event():
    """Initialize the orchestrator on startup"""
    global orchestrator
    orchestrator = UnifiedRAGOrchestrator()
    print("🚀 Unified RAG Orchestrator initialized")

@app.get("/")
async def root():
    """API health check"""
    return {
        "message": "Unified RAG Search API",
        "status": "active",
        "primary_system": "OpenAI Vector Store" if orchestrator and orchestrator.is_openai_primary() else "Local Systems"
    }

@app.post("/search", response_model=SearchResponse)
async def search_unified(request: SearchRequest):
    """
    Search across unified RAG systems
    
    - **query**: The search query
    - **max_results**: Maximum number of results to return (default: 10)
    - **system_preference**: Which system to prefer ('auto', 'openai_only', 'local_only')
    """
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Orchestrator not initialized")
    
    try:
        results = await orchestrator.search(
            query=request.query,
            max_results=request.max_results,
            system_preference=request.system_preference
        )
        
        # Convert SearchResult objects to dictionaries
        result_dicts = []
        systems_used = set()
        
        for result in results:
            result_dicts.append({
                "content": result.content,
                "source": result.source,
                "score": result.score,
                "system": result.system,
                "metadata": result.metadata
            })
            systems_used.add(result.system)
        
        return SearchResponse(
            results=result_dicts,
            total_results=len(result_dicts),
            systems_used=list(systems_used),
            query=request.query
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/search", response_model=SearchResponse)
async def search_unified_get(
    q: str = Query(..., description="Search query"),
    max_results: int = Query(10, description="Maximum results to return"),
    system: str = Query('auto', description="System preference")
):
    """
    GET version of unified search for simple queries
    """
    request = SearchRequest(
        query=q,
        max_results=max_results,
        system_preference=system
    )
    return await search_unified(request)

@app.get("/status", response_model=SystemStatusResponse)
async def get_system_status():
    """
    Get status of all RAG systems
    """
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Orchestrator not initialized")
    
    try:
        status = orchestrator.get_system_status()
        available_systems = orchestrator.get_available_systems()
        
        # Convert to serializable format
        systems_dict = {}
        for name, system_status in status.items():
            systems_dict[name] = {
                "name": system_status.name,
                "available": system_status.available,
                "file_count": system_status.file_count,
                "error": system_status.error
            }
        
        primary_system = "openai" if orchestrator.is_openai_primary() else "local"
        
        return SystemStatusResponse(
            systems=systems_dict,
            available_systems=available_systems,
            primary_system=primary_system,
            total_systems=len(status)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    if not orchestrator:
        return {"status": "error", "message": "Orchestrator not initialized"}
    
    available_systems = orchestrator.get_available_systems()
    
    return {
        "status": "healthy" if available_systems else "degraded",
        "available_systems": len(available_systems),
        "primary_system_available": orchestrator.is_openai_primary(),
        "systems": available_systems
    }

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Starting Unified RAG Search API...")
    print("📊 OpenAI Vector Store: Primary tier (1,477+ files)")
    print("📚 Local RAG Systems: Supplementary tier (295+ additional files)")
    print("🔗 API available at: http://localhost:8001")
    
    uvicorn.run(
        "api.unified_search:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )