#!/usr/bin/env python3
"""
Knowledge Base API Server
FastAPI server to expose knowledge base data to React/NextJS frontends
"""

from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import json
import os
from pathlib import Path as PathlibPath
from datetime import datetime
import logging

# Import our knowledge base components
try:
    from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD, Document
except ImportError:
    print("Warning: KnowledgeBaseCRUD not available")
    KnowledgeBaseCRUD = None

# Import dual RAG adapter
try:
    from lib.adapters.dual_rag_adapter import dual_rag_adapter, get_adapter_status
    DUAL_RAG_AVAILABLE = True
except ImportError:
    print("Warning: DualRAGAdapter not available")
    DUAL_RAG_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Disclosure RAG Knowledge Base API",
    description="API for accessing UFO/UAP knowledge base with 448+ documents",
    version="1.0.0"
)

# Add CORS middleware for React/NextJS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize knowledge base
class KnowledgeBaseAPI:
    def __init__(self):
        # Use absolute path to packages/knowledge-base
        project_root = PathlibPath(__file__).parent.parent.parent
        self.kb_path = project_root / "packages" / "knowledge-base"
        self.index_file = self.kb_path / "metadata" / "index.json"
        
        # Try to initialize CRUD if available
        if KnowledgeBaseCRUD:
            try:
                self.kb_crud = KnowledgeBaseCRUD(str(self.kb_path))
                self.use_crud = True
            except Exception as e:
                logger.warning(f"CRUD initialization failed: {e}")
                self.use_crud = False
        else:
            self.use_crud = False
        
        # Load index data
        self.load_index()
    
    def load_index(self):
        """Load the index.json file"""
        try:
            if self.index_file.exists():
                with open(self.index_file, 'r', encoding='utf-8') as f:
                    self.index_data = json.load(f)
                logger.info(f"Loaded index with {len(self.index_data.get('documents', {}))} documents")
            else:
                self.index_data = {"documents": {}, "tags": {}, "last_updated": ""}
                logger.warning("Index file not found")
        except Exception as e:
            logger.error(f"Error loading index: {e}")
            self.index_data = {"documents": {}, "tags": {}, "last_updated": ""}

# Initialize API
kb_api = KnowledgeBaseAPI()

# Pydantic models for API responses
class DocumentSummary(BaseModel):
    id: str
    title: str
    doc_type: str
    path: str
    modified: str
    file_type: str
    tags: List[str]
    size_mb: Optional[float] = None
    size_kb: Optional[float] = None
    category: Optional[str] = None
    topic: Optional[str] = None
    date_folder: Optional[str] = None

class DocumentDetail(BaseModel):
    id: str
    title: str
    doc_type: str
    path: str
    source: str
    created_at: str
    updated_at: str
    file_type: str
    tags: List[str]
    metadata: Dict[str, Any]
    content: Optional[str] = None
    content_preview: Optional[str] = None

class KnowledgeBaseStats(BaseModel):
    total_documents: int
    documents_by_type: Dict[str, int]
    total_tags: int
    popular_tags: List[tuple]
    last_updated: str
    file_distribution: Dict[str, int]
    total_size_mb: float

class SearchResults(BaseModel):
    query: str
    total_results: int
    documents: List[DocumentSummary]
    facets: Dict[str, Dict[str, int]]

class RAGSearchResult(BaseModel):
    id: str
    score: float
    system: str
    badge: str
    text: str
    source: str
    metadata: Dict[str, Any]

class RAGSearchResponse(BaseModel):
    query: str
    results: List[RAGSearchResult]
    total_results: int
    systems_used: List[str]
    timestamp: str

# API Routes

@app.get("/", response_model=Dict[str, str])
async def root():
    """API root endpoint"""
    return {
        "message": "Disclosure RAG Knowledge Base API",
        "version": "1.0.0",
        "docs": "/docs",
        "total_documents": str(len(kb_api.index_data.get('documents', {})))
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "index_loaded": len(kb_api.index_data.get('documents', {})) > 0,
        "crud_available": kb_api.use_crud
    }

@app.get("/stats", response_model=KnowledgeBaseStats)
async def get_knowledge_base_stats():
    """Get comprehensive knowledge base statistics"""
    documents = kb_api.index_data.get('documents', {})
    tags = kb_api.index_data.get('tags', {})
    
    # Calculate statistics
    doc_types = {}
    total_size = 0
    
    for doc_info in documents.values():
        doc_type = doc_info['doc_type']
        doc_types[doc_type] = doc_types.get(doc_type, 0) + 1
        
        # Calculate size
        file_size = doc_info.get('metadata', {}).get('file_size', 0)
        total_size += file_size
    
    # Get popular tags
    popular_tags = [(tag, len(doc_ids)) for tag, doc_ids in tags.items()]
    popular_tags.sort(key=lambda x: x[1], reverse=True)
    
    return KnowledgeBaseStats(
        total_documents=len(documents),
        documents_by_type=doc_types,
        total_tags=len(tags),
        popular_tags=popular_tags[:10],
        last_updated=kb_api.index_data.get('last_updated', ''),
        file_distribution={
            'PDFs': sum(1 for d in documents.values() if d.get('metadata', {}).get('file_type') == 'PDF'),
            'Transcripts': sum(1 for d in documents.values() if d['doc_type'] == 'transcript'),
            'Articles': sum(1 for d in documents.values() if d['doc_type'] == 'article'),
            'Research': sum(1 for d in documents.values() if d['doc_type'] == 'research')
        },
        total_size_mb=round(total_size / (1024 * 1024), 2)
    )

@app.get("/documents", response_model=List[DocumentSummary])
async def list_documents(
    doc_type: Optional[str] = Query(None, description="Filter by document type"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    limit: int = Query(50, ge=1, le=1000, description="Number of documents to return"),
    offset: int = Query(0, ge=0, description="Number of documents to skip")
):
    """List documents with optional filtering"""
    documents = kb_api.index_data.get('documents', {})
    
    # Filter documents
    filtered_docs = []
    tag_filters = [t.strip() for t in tags.split(',')] if tags else []
    
    for doc_id, doc_info in documents.items():
        # Filter by type
        if doc_type and doc_info['doc_type'] != doc_type:
            continue
        
        # Filter by tags
        if tag_filters and not any(tag in doc_info['tags'] for tag in tag_filters):
            continue
        
        # Create document summary
        doc_summary = DocumentSummary(
            id=doc_id,
            title=doc_info['title'],
            doc_type=doc_info['doc_type'],
            path=doc_info['metadata'].get('original_path', ''),
            modified=doc_info['updated_at'],
            file_type=doc_info['metadata'].get('file_type', 'Unknown'),
            tags=doc_info['tags']
        )
        
        # Add type-specific fields
        file_size = doc_info.get('metadata', {}).get('file_size', 0)
        if doc_info['doc_type'] == 'case_file':
            doc_summary.size_mb = file_size / (1024 * 1024) if file_size else 0
            doc_summary.category = _categorize_case_file(doc_info['title'])
        elif doc_info['doc_type'] == 'transcript':
            doc_summary.size_kb = file_size / 1024 if file_size else 0
            doc_summary.topic = _extract_transcript_topic(doc_info['title'])
            doc_summary.date_folder = doc_info['metadata'].get('date_folder', 'unknown')
        else:
            doc_summary.size_kb = file_size / 1024 if file_size else 0
        
        filtered_docs.append(doc_summary)
    
    # Sort by modification date (newest first)
    filtered_docs.sort(key=lambda x: x.modified, reverse=True)
    
    # Apply pagination
    return filtered_docs[offset:offset + limit]

@app.get("/documents/{document_id}", response_model=DocumentDetail)
async def get_document(document_id: str = Path(..., description="Document ID")):
    """Get detailed information about a specific document"""
    documents = kb_api.index_data.get('documents', {})
    
    if document_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc_info = documents[document_id]
    
    # Try to load content if using CRUD
    content = None
    content_preview = None
    
    if kb_api.use_crud:
        try:
            full_doc = kb_api.kb_crud.get_document(document_id)
            if full_doc:
                content = full_doc.content
                content_preview = content[:500] + "..." if len(content) > 500 else content
        except Exception as e:
            logger.warning(f"Could not load content for {document_id}: {e}")
    
    # Fallback: try to read from file
    if not content:
        try:
            file_path = kb_api.kb_path / doc_info['metadata'].get('original_path', '')
            if file_path.exists() and file_path.suffix.lower() in ['.txt', '.md']:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    content_preview = content[:500] + "..." if len(content) > 500 else content
        except Exception as e:
            logger.warning(f"Could not read file for {document_id}: {e}")
    
    return DocumentDetail(
        id=document_id,
        title=doc_info['title'],
        doc_type=doc_info['doc_type'],
        path=doc_info['metadata'].get('original_path', ''),
        source=doc_info.get('path', ''),
        created_at=doc_info['created_at'],
        updated_at=doc_info['updated_at'],
        file_type=doc_info['metadata'].get('file_type', 'Unknown'),
        tags=doc_info['tags'],
        metadata=doc_info['metadata'],
        content=content,
        content_preview=content_preview
    )

@app.get("/search", response_model=SearchResults)
async def search_documents(
    q: str = Query(..., description="Search query"),
    doc_type: Optional[str] = Query(None, description="Filter by document type"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return")
):
    """Search documents by title and content"""
    documents = kb_api.index_data.get('documents', {})
    
    # Search in titles and tags
    results = []
    query_lower = q.lower()
    tag_filters = [t.strip() for t in tags.split(',')] if tags else []
    
    for doc_id, doc_info in documents.items():
        # Apply filters
        if doc_type and doc_info['doc_type'] != doc_type:
            continue
        
        if tag_filters and not any(tag in doc_info['tags'] for tag in tag_filters):
            continue
        
        # Search in title and tags
        score = 0
        if query_lower in doc_info['title'].lower():
            score += 2  # Title matches get higher score
        
        if any(query_lower in tag.lower() for tag in doc_info['tags']):
            score += 1  # Tag matches get medium score
        
        if score > 0:
            doc_summary = DocumentSummary(
                id=doc_id,
                title=doc_info['title'],
                doc_type=doc_info['doc_type'],
                path=doc_info['metadata'].get('original_path', ''),
                modified=doc_info['updated_at'],
                file_type=doc_info['metadata'].get('file_type', 'Unknown'),
                tags=doc_info['tags']
            )
            
            # Add type-specific fields
            file_size = doc_info.get('metadata', {}).get('file_size', 0)
            if doc_info['doc_type'] == 'case_file':
                doc_summary.size_mb = file_size / (1024 * 1024) if file_size else 0
                doc_summary.category = _categorize_case_file(doc_info['title'])
            elif doc_info['doc_type'] == 'transcript':
                doc_summary.size_kb = file_size / 1024 if file_size else 0
                doc_summary.topic = _extract_transcript_topic(doc_info['title'])
                doc_summary.date_folder = doc_info['metadata'].get('date_folder', 'unknown')
            else:
                doc_summary.size_kb = file_size / 1024 if file_size else 0
            
            results.append((score, doc_summary))
    
    # Sort by score and limit
    results.sort(key=lambda x: x[0], reverse=True)
    results = [doc for score, doc in results[:limit]]
    
    # Generate facets
    facets = {
        "doc_types": {},
        "tags": {},
        "years": {}
    }
    
    for _, doc in results:
        # Doc type facets
        facets["doc_types"][doc.doc_type] = facets["doc_types"].get(doc.doc_type, 0) + 1
        
        # Tag facets
        for tag in doc.tags:
            facets["tags"][tag] = facets["tags"].get(tag, 0) + 1
        
        # Year facets
        try:
            year = doc.modified.split('-')[0]
            facets["years"][year] = facets["years"].get(year, 0) + 1
        except:
            pass
    
    return SearchResults(
        query=q,
        total_results=len(results),
        documents=results,
        facets=facets
    )

@app.get("/tags")
async def get_tags():
    """Get all available tags with document counts"""
    tags = kb_api.index_data.get('tags', {})
    
    tag_list = [
        {"tag": tag, "count": len(doc_ids)}
        for tag, doc_ids in tags.items()
    ]
    
    # Sort by count descending
    tag_list.sort(key=lambda x: x['count'], reverse=True)
    
    return {"tags": tag_list}

@app.get("/categories")
async def get_categories():
    """Get document categories for case files and transcript topics"""
    documents = kb_api.index_data.get('documents', {})
    
    categories = {
        "case_file_categories": {},
        "transcript_topics": {},
        "file_types": {}
    }
    
    for doc_info in documents.values():
        doc_type = doc_info['doc_type']
        file_type = doc_info['metadata'].get('file_type', 'Unknown')
        
        # Count file types
        categories["file_types"][file_type] = categories["file_types"].get(file_type, 0) + 1
        
        if doc_type == 'case_file':
            category = _categorize_case_file(doc_info['title'])
            categories["case_file_categories"][category] = categories["case_file_categories"].get(category, 0) + 1
        elif doc_type == 'transcript':
            topic = _extract_transcript_topic(doc_info['title'])
            categories["transcript_topics"][topic] = categories["transcript_topics"].get(topic, 0) + 1
    
    return categories

# Helper functions (copied from data_sources_navigator.py)
def _categorize_case_file(filename: str) -> str:
    """Categorize case files based on filename patterns"""
    filename_lower = filename.lower()
    
    if 'cia' in filename_lower or 'rdp' in filename_lower:
        return 'CIA Documents'
    elif 'ufo' in filename_lower or 'uap' in filename_lower:
        return 'UFO/UAP Reports'
    elif 'roswell' in filename_lower:
        return 'Roswell Incident'
    elif 'bluebook' in filename_lower or 'blue book' in filename_lower:
        return 'Project Blue Book'
    elif 'congress' in filename_lower or 'hearing' in filename_lower:
        return 'Congressional Hearings'
    elif 'testimony' in filename_lower:
        return 'Witness Testimony'
    elif 'crop circle' in filename_lower:
        return 'Crop Circles'
    elif 'mars' in filename_lower:
        return 'Mars/Space Related'
    else:
        return 'Other Documents'

def _extract_transcript_topic(filename: str) -> str:
    """Extract topic from transcript filename"""
    clean_name = filename.replace('.txt', '').replace('Summary', '')
    
    if 'rogan' in clean_name.lower():
        return 'Joe Rogan Podcast'
    elif 'disclosure' in clean_name.lower():
        return 'Disclosure Related'
    elif 'ufo' in clean_name.lower() or 'uap' in clean_name.lower():
        return 'UFO/UAP Discussion'
    elif 'alien' in clean_name.lower() or 'et' in clean_name.lower():
        return 'Alien/ET Related'
    elif 'navy' in clean_name.lower() or 'military' in clean_name.lower():
        return 'Military/Navy'
    elif 'testimony' in clean_name.lower():
        return 'Witness Testimony'
    elif 'grusch' in clean_name.lower():
        return 'David Grusch'
    elif 'elizondo' in clean_name.lower():
        return 'Luis Elizondo'
    else:
        return 'General Discussion'

# Dual RAG Endpoints
@app.post("/rag/search", response_model=RAGSearchResponse)
async def rag_search(
    query: str = Query(..., description="Search query"),
    top_k: int = Query(8, ge=1, le=50, description="Number of results to return"),
    filter_type: Optional[str] = Query(None, description="Filter by document type"),
    include_metadata: bool = Query(True, description="Include result metadata")
):
    """Search using dual RAG system (Upstash + CocoIndex)"""
    if not DUAL_RAG_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dual RAG adapter not available")
    
    try:
        # Search using dual adapter
        results = await dual_rag_adapter.search(
            query=query,
            top_k=top_k,
            include_metadata=include_metadata,
            filter_type=filter_type
        )
        
        # Convert to response format
        rag_results = [
            RAGSearchResult(
                id=r["id"],
                score=r["score"],
                system=r["system"],
                badge=r["badge"],
                text=r["text"],
                source=r["source"],
                metadata=r["metadata"]
            )
            for r in results
        ]
        
        # Determine which systems were used
        systems_used = list(set(r["system"] for r in results))
        
        return RAGSearchResponse(
            query=query,
            results=rag_results,
            total_results=len(rag_results),
            systems_used=systems_used,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"RAG search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/rag/status")
async def rag_status():
    """Get status of dual RAG systems"""
    if not DUAL_RAG_AVAILABLE:
        return {
            "dual_rag_available": False,
            "error": "DualRAGAdapter not imported"
        }
    
    try:
        status = get_adapter_status()
        status["dual_rag_available"] = True
        return status
    except Exception as e:
        logger.error(f"Status check error: {e}")
        return {
            "dual_rag_available": False,
            "error": str(e)
        }

@app.post("/rag/index")
async def rag_index_document(
    content: str,
    metadata: Dict[str, Any],
    use_system: str = Query("both", pattern="^(upstash|cocoindex|both)$")
):
    """Index a document in one or both RAG systems"""
    if not DUAL_RAG_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dual RAG adapter not available")
    
    try:
        result = await dual_rag_adapter.index_document(
            content=content,
            metadata=metadata,
            use_system=use_system
        )
        
        return {
            "success": True,
            "system": use_system,
            "result": result
        }
        
    except Exception as e:
        logger.error(f"Index error: {e}")
        raise HTTPException(status_code=500, detail=f"Indexing failed: {str(e)}")

# WebSocket endpoint for real-time updates (optional)
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    """WebSocket endpoint for real-time updates"""
    await websocket.accept()
    try:
        while True:
            # Send periodic stats updates
            stats = await get_knowledge_base_stats()
            await websocket.send_json({
                "type": "stats_update",
                "data": stats.dict()
            })
            await asyncio.sleep(30)  # Update every 30 seconds
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    
    # Run the API server
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )