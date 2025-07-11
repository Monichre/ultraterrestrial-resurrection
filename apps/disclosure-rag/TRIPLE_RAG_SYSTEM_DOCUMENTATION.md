# Triple RAG System Documentation

**Date:** July 9, 2025 at 11:45 PST  
**Version:** 1.0  
**Author:** Disclosure RAG Development Team

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [TripleRAGAdapter System](#tripleragadapter-system)
4. [Unified Data Ingestion (main_unified.py)](#unified-data-ingestion-main_unifiedpy)
5. [Integration Points](#integration-points)
6. [Configuration](#configuration)
7. [API Reference](#api-reference)
8. [Usage Examples](#usage-examples)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting](#troubleshooting)
11. [Development Guidelines](#development-guidelines)

## Overview

The Triple RAG System is a comprehensive Retrieval-Augmented Generation infrastructure that provides unified data ingestion, storage, and retrieval across three complementary vector storage backends. This system enables robust, scalable, and fault-tolerant document processing and semantic search capabilities for the Disclosure RAG project.

### Key Features

- **Multi-Backend Storage**: Parallel storage across Upstash (cloud), LocalRAG (FAISS), and CocoIndex (PostgreSQL pgvector)
- **Intelligent Result Merging**: Weighted combination of results from all backends with configurable scoring
- **Unified Data Ingestion**: Single entry point for YouTube, web articles, and document processing
- **Graceful Degradation**: Automatic fallback when backends are unavailable
- **Flexible Configuration**: Environment-based configuration for different deployment scenarios
- **Comprehensive Monitoring**: Detailed logging and error handling across all components

### System Benefits

1. **Redundancy**: Multiple storage backends ensure data availability
2. **Performance**: Parallel search across backends increases speed and result coverage
3. **Scalability**: Cloud and local storage options support different scaling needs
4. **Cost Efficiency**: Local processing reduces cloud API costs
5. **Flexibility**: Configurable weights allow tuning for different use cases

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Triple RAG System                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────────────────────┐ │
│  │   Data Ingestion    │    │            Search & Retrieval               │ │
│  │  (main_unified.py)  │    │         (TripleRAGAdapter)                  │ │
│  │                     │    │                                             │ │
│  │  ┌─────────────────┐│    │  ┌─────────────────────────────────────────┐ │
│  │  │ YouTube         ││    │  │          Parallel Search               │ │
│  │  │ Processing      ││    │  │                                         │ │
│  │  └─────────────────┘│    │  │  ┌─────────┐ ┌─────────┐ ┌─────────────┐ │ │
│  │                     │    │  │  │ Upstash │ │LocalRAG │ │ CocoIndex   │ │ │
│  │  ┌─────────────────┐│    │  │  │ (Cloud) │ │(FAISS)  │ │(PostgreSQL) │ │ │
│  │  │ Web Article     ││    │  │  └─────────┘ └─────────┘ └─────────────┘ │ │
│  │  │ Processing      ││    │  │                                         │ │
│  │  └─────────────────┘│    │  └─────────────────────────────────────────┘ │
│  │                     │    │                                             │ │
│  │  ┌─────────────────┐│    │  ┌─────────────────────────────────────────┐ │
│  │  │ Document        ││    │  │       Intelligent Merging              │ │
│  │  │ Processing      ││    │  │                                         │ │
│  │  └─────────────────┘│    │  │  • Weighted scoring                    │ │
│  └─────────────────────┘    │  │  • Deduplication                       │ │
│                             │  │  • Relevance ranking                   │ │
│                             │  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │    Storage Backends     │
                              ├─────────────────────────┤
                              │                         │
                              │  ┌─────────────────────┐│
                              │  │      Upstash        ││
                              │  │   Vector Database   ││
                              │  │  (Cloud Storage)    ││
                              │  └─────────────────────┘│
                              │                         │
                              │  ┌─────────────────────┐│
                              │  │     LocalRAG        ││
                              │  │   FAISS Vectors     ││
                              │  │  (Local Storage)    ││
                              │  └─────────────────────┘│
                              │                         │
                              │  ┌─────────────────────┐│
                              │  │     CocoIndex       ││
                              │  │ PostgreSQL pgvector ││
                              │  │ (Database Storage)  ││
                              │  └─────────────────────┘│
                              │                         │
                              │  ┌─────────────────────┐│
                              │  │      OpenAI         ││
                              │  │   Vector Store      ││
                              │  │  (Conditional)      ││
                              │  └─────────────────────┘│
                              └─────────────────────────┘
```

## TripleRAGAdapter System

### Purpose

The TripleRAGAdapter provides unified search and retrieval capabilities across three vector storage backends, with intelligent result merging and configurable weighting.

### File Location
```
apps/disclosure-rag/lib/adapters/dual_rag_adapter.py
```

### Core Components

#### 1. **TripleRAGAdapter Class**

```python
class TripleRAGAdapter:
    """Adapter that searches Upstash (cloud), LocalRAG (FAISS), and CocoIndex (PostgreSQL pgvector) in parallel"""
```

**Key Features:**
- Parallel search across all enabled backends
- Configurable scoring weights
- Automatic fallback handling
- Result deduplication and merging
- Comprehensive error handling

#### 2. **Backend Integration**

##### Upstash Integration
```python
# Cloud vector database
self.upstash = UpstashIndex(url=UPSTASH_URL, token=UPSTASH_TOKEN)
```

- **Purpose**: Cloud-based vector search
- **Benefits**: Scalability, managed infrastructure
- **Configuration**: `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`

##### LocalRAG Integration
```python
# Local FAISS-based search
from lib.local_rag.local_rag_service import LocalRAGService
self.local_rag = LocalRAGService()
```

- **Purpose**: Local vector search using FAISS
- **Benefits**: No API costs, offline capability
- **Storage**: Local pickle files and FAISS indices

##### CocoIndex Integration
```python
# PostgreSQL pgvector via CocoIndex
self._cocoindex_client = cocoindex.create_client(
    database_url=COCOINDEX_DATABASE_URL,
    embedding_function=SentenceTransformerEmbed(model_name='all-MiniLM-L6-v2')
)
```

- **Purpose**: Database-backed vector search
- **Benefits**: ACID compliance, complex queries, analytics
- **Storage**: PostgreSQL with pgvector extension

#### 3. **Search Methods**

##### Primary Search Method
```python
async def search(self, query: str, top_k: int = 5, query_type: str = "semantic") -> List[Dict]
```

**Parameters:**
- `query`: Search query string
- `top_k`: Number of results to return
- `query_type`: Type of search ("semantic", "keyword", "hybrid")

**Returns:**
- List of search results with metadata and scoring

##### Backend-Specific Search Methods
```python
async def _search_upstash(self, query: str, top_k: int) -> List[Dict]
async def _search_local_rag(self, query: str, top_k: int) -> List[Dict]
async def _search_cocoindex(self, query: str, top_k: int) -> List[Dict]
```

#### 4. **Result Merging Algorithm**

```python
def _merge_results(self, upstash_results: List[Dict], local_results: List[Dict], 
                  cocoindex_results: List[Dict]) -> List[Dict]
```

**Process:**
1. Apply configured weights to each backend's results
2. Normalize scores across different backends
3. Merge results while preserving provenance
4. Deduplicate based on content similarity
5. Sort by final weighted score

**Weight Configuration:**
```python
# Default weights (configurable via environment)
UPSTASH_WEIGHT = 0.4      # Cloud search weight
LOCAL_RAG_WEIGHT = 0.3    # Local FAISS weight
COCOINDEX_WEIGHT = 0.3    # PostgreSQL weight
```

#### 5. **Health Monitoring**

```python
async def health_check(self) -> Dict[str, Any]
```

**Returns:**
```json
{
  "overall_status": "healthy",
  "backends": {
    "upstash": {"status": "healthy", "response_time": 0.12},
    "local_rag": {"status": "healthy", "response_time": 0.05},
    "cocoindex": {"status": "healthy", "response_time": 0.08}
  },
  "configuration": {
    "upstash_weight": 0.4,
    "local_rag_weight": 0.3,
    "cocoindex_weight": 0.3
  }
}
```

## Unified Data Ingestion (main_unified.py)

### Purpose

The main_unified.py system provides the `dy` command functionality for unified data ingestion across multiple content types and vector storage backends.

### File Location
```
apps/disclosure-rag/main_unified.py
```

### Core Components

#### 1. **UnifiedVectorStorage Class**

```python
class UnifiedVectorStorage:
    """Manages vector storage across multiple backends: Upstash, CocoIndex (PostgreSQL), and OpenAI"""
```

**Key Features:**
- Multi-backend storage orchestration
- Embedding generation and management
- Error handling and retry logic
- Conditional OpenAI upload based on flags

#### 2. **Content Processing Pipeline**

##### YouTube Processing
```python
async def process_youtube_unified(url: str, upload_to_openai: bool = False) -> Dict[str, Any]
```

**Process Flow:**
1. Extract video metadata using yt-dlp
2. Generate transcript from captions/subtitles
3. Create AI-powered summary
4. Store transcript and summary locally
5. Generate embeddings using sentence-transformers
6. Store in all configured vector backends
7. Add to knowledge base index

**Output Files:**
- `transcript.txt`: Raw transcript content
- `summary.txt`: AI-generated summary
- `metadata.json`: Video metadata and processing info

##### Web Article Processing
```python
async def process_web_unified(url: str, upload_to_openai: bool = False) -> Dict[str, Any]
```

**Process Flow:**
1. Extract article content using BeautifulSoup/Readability
2. Clean and format text content
3. Extract metadata (title, author, date)
4. Generate embeddings
5. Store in all configured vector backends
6. Save to knowledge base

##### Document Processing
```python
async def process_file_unified(file_path: str, upload_to_openai: bool = False) -> Dict[str, Any]
```

**Supported Formats:**
- Text files (.txt, .md)
- PDF documents (.pdf)
- Word documents (.docx)
- CSV files (.csv)

#### 3. **Vector Storage Methods**

##### Document Storage
```python
async def store_document(self, doc_id: str, content: str, metadata: Dict[str, Any],
                        source_type: str, source_url: Optional[str] = None,
                        upload_to_openai: bool = False) -> Dict[str, Any]
```

**Storage Strategy:**
- **Always**: Upstash + CocoIndex (PostgreSQL)
- **Conditional**: OpenAI (only with --upload flag)
- **Always**: Local file storage in knowledge base

##### Backend-Specific Storage
```python
async def _store_in_upstash(self, doc_id: str, embeddings: np.ndarray, metadata: Dict) -> Dict
async def _store_in_cocoindex(self, doc_id: str, content: str, embeddings: np.ndarray, 
                             metadata: Dict, source_type: str, source_url: Optional[str]) -> Dict
async def _upload_to_openai(self, doc_id: str, content: str, metadata: Dict) -> Dict
```

#### 4. **Command Line Interface**

```bash
# Basic usage
python main_unified.py "https://youtube.com/watch?v=abc123"

# With OpenAI upload
python main_unified.py "https://youtube.com/watch?v=abc123" --upload

# Web article processing
python main_unified.py "https://example.com/article"

# Document processing
python main_unified.py "/path/to/document.pdf"
```

#### 5. **Embedding Generation**

```python
# Using sentence-transformers
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = embedding_model.encode(content)
```

**Model Configuration:**
- **Model**: `all-MiniLM-L6-v2`
- **Dimensions**: 384
- **Performance**: Optimized for semantic similarity

## Integration Points

### 1. **FastAPI Integration**

The TripleRAGAdapter integrates with the FastAPI server through these endpoints:

```python
# In api_server.py
from lib.adapters.dual_rag_adapter import TripleRAGAdapter

adapter = TripleRAGAdapter()

@app.post("/rag/search")
async def rag_search(request: RAGSearchRequest):
    return await adapter.search(request.query, request.top_k)

@app.get("/rag/status")
async def rag_status():
    return await adapter.health_check()
```

### 2. **Knowledge Base Integration**

```python
# In main_unified.py
from lib.knowledge_base_crud import KnowledgeBaseCRUD

kb_crud = KnowledgeBaseCRUD()

# Add processed documents to knowledge base
kb_crud.add_document(
    title=title,
    content=content,
    source=url,
    doc_type="transcript",
    metadata=metadata,
    tags=["youtube", "transcript", video_id]
)
```

### 3. **Entity Extraction Integration**

The system preserves the existing entity extraction workflow:

```python
# In lib/knowledge_base_service.py
if summary_file and os.path.exists(summary_file):
    from .interactive_entity_processor import process_summary_file_interactive
    entity_results = process_summary_file_interactive(
        summary_file, video_id, interactive=False
    )
```

## Configuration

### Environment Variables

#### Required Variables
```bash
# Upstash Configuration
UPSTASH_VECTOR_REST_URL=https://known-bobcat-28794-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token

# Database Configuration
DATABASE_URL=postgresql://liamellis@localhost:5432/ultraterrestrial
COCOINDEX_DATABASE_URL=postgresql://liamellis@localhost:5432/ultraterrestrial

# OpenAI Configuration (optional)
OPENAI_API_KEY=sk-your-openai-key
UFO_DATA_STORE_ID=vs_your_vector_store_id
```

#### Optional Configuration
```bash
# Backend Weights
UPSTASH_WEIGHT=0.4
LOCAL_RAG_WEIGHT=0.3
COCOINDEX_WEIGHT=0.3

# Feature Flags
COCOINDEX_ENABLED=true
LOCAL_RAG_ENABLED=true
UPSTASH_ENABLED=true

# Performance Tuning
SEARCH_TIMEOUT=30
MAX_RETRIES=3
BATCH_SIZE=100
```

#### Knowledge Base Configuration
```bash
# Knowledge Base Paths
KNOWLEDGE_BASE_PATH=/packages/knowledge-base
TRANSCRIPTS_PATH=/packages/knowledge-base/transcripts
ARTICLES_PATH=/packages/knowledge-base/articles
DOCUMENTS_PATH=/packages/knowledge-base/documents
```

### Configuration Files

#### pyproject.toml Dependencies
```toml
[tool.poetry.dependencies]
python = "^3.9"
upstash-vector = "^0.4.0"
sentence-transformers = "^2.2.2"
cocoindex = "^0.1.0"
psycopg2-binary = "^2.9.7"
numpy = "^1.24.3"
asyncio = "^3.4.3"
```

## API Reference

### TripleRAGAdapter Methods

#### search(query, top_k=5, query_type="semantic")
**Purpose**: Perform semantic search across all backends

**Parameters:**
- `query` (str): Search query
- `top_k` (int): Number of results to return
- `query_type` (str): Type of search ("semantic", "keyword", "hybrid")

**Returns:**
```python
List[Dict] = [
    {
        "id": "doc_123",
        "content": "Document content...",
        "metadata": {...},
        "score": 0.85,
        "source": "upstash",
        "created_at": "2025-01-09T10:30:00Z"
    }
]
```

#### health_check()
**Purpose**: Check status of all backends

**Returns:**
```python
Dict[str, Any] = {
    "overall_status": "healthy",
    "backends": {
        "upstash": {"status": "healthy", "response_time": 0.12},
        "local_rag": {"status": "healthy", "response_time": 0.05},
        "cocoindex": {"status": "healthy", "response_time": 0.08}
    }
}
```

### UnifiedVectorStorage Methods

#### store_document(doc_id, content, metadata, source_type, source_url=None, upload_to_openai=False)
**Purpose**: Store document across all configured backends

**Parameters:**
- `doc_id` (str): Unique document identifier
- `content` (str): Document content
- `metadata` (Dict): Document metadata
- `source_type` (str): Type of source ("youtube", "web", "document")
- `source_url` (str, optional): Source URL if applicable
- `upload_to_openai` (bool): Whether to upload to OpenAI

**Returns:**
```python
Dict[str, Any] = {
    "doc_id": "doc_123",
    "timestamp": "2025-01-09T10:30:00Z",
    "storage_results": {
        "upstash": {"success": True, "vector_id": "doc_123"},
        "postgresql": {"success": True, "record_id": "uuid-123"},
        "openai": {"success": True, "file_id": "file-123"}
    }
}
```

### Command Line Interface

#### main_unified.py Usage
```bash
# YouTube video processing
python main_unified.py "https://youtube.com/watch?v=abc123"

# Web article processing  
python main_unified.py "https://example.com/article"

# Document processing
python main_unified.py "/path/to/document.pdf"

# With OpenAI upload
python main_unified.py "https://youtube.com/watch?v=abc123" --upload
```

## Usage Examples

### 1. **Basic Search Example**

```python
from lib.adapters.dual_rag_adapter import TripleRAGAdapter

# Initialize adapter
adapter = TripleRAGAdapter()

# Perform search
results = await adapter.search("UAP encounters navy", top_k=10)

# Process results
for result in results:
    print(f"Document: {result['id']}")
    print(f"Score: {result['score']:.3f}")
    print(f"Source: {result['source']}")
    print(f"Content: {result['content'][:200]}...")
    print("-" * 50)
```

### 2. **YouTube Processing Example**

```python
import asyncio
from main_unified import process_youtube_unified

async def process_video():
    result = await process_youtube_unified(
        "https://youtube.com/watch?v=abc123",
        upload_to_openai=True
    )
    
    print(f"Video processed: {result['title']}")
    print(f"Storage results: {result['storage_results']}")

asyncio.run(process_video())
```

### 3. **Health Check Example**

```python
from lib.adapters.dual_rag_adapter import TripleRAGAdapter

adapter = TripleRAGAdapter()
health = await adapter.health_check()

print(f"Overall Status: {health['overall_status']}")
for backend, status in health['backends'].items():
    print(f"{backend}: {status['status']} ({status['response_time']:.3f}s)")
```

### 4. **Batch Processing Example**

```python
import asyncio
from main_unified import UnifiedVectorStorage

async def batch_process_documents(documents):
    storage = UnifiedVectorStorage()
    results = []
    
    for doc in documents:
        result = await storage.store_document(
            doc_id=doc['id'],
            content=doc['content'],
            metadata=doc['metadata'],
            source_type=doc['type']
        )
        results.append(result)
    
    return results

# Process multiple documents
documents = [
    {"id": "doc1", "content": "Content 1", "metadata": {...}, "type": "article"},
    {"id": "doc2", "content": "Content 2", "metadata": {...}, "type": "transcript"}
]

results = asyncio.run(batch_process_documents(documents))
```

## Performance Considerations

### 1. **Embedding Generation**

- **Model**: `all-MiniLM-L6-v2` (384 dimensions)
- **Speed**: ~1000 tokens/second on modern hardware
- **Memory**: ~500MB model footprint
- **Optimization**: Batch processing for multiple documents

### 2. **Vector Storage Performance**

#### Upstash
- **Latency**: 100-200ms (network dependent)
- **Throughput**: 1000+ operations/second
- **Scalability**: Managed, auto-scaling

#### LocalRAG (FAISS)
- **Latency**: 1-10ms
- **Throughput**: 10,000+ operations/second
- **Memory**: Proportional to index size

#### CocoIndex (PostgreSQL)
- **Latency**: 5-50ms
- **Throughput**: 1000+ operations/second
- **Scalability**: Depends on PostgreSQL configuration

### 3. **Search Performance**

```python
# Typical search performance
Backend      | Latency | Throughput | Memory
-------------|---------|------------|--------
Upstash      | 150ms   | 1000 ops/s | Low
LocalRAG     | 5ms     | 10k ops/s  | High
CocoIndex    | 20ms    | 1000 ops/s | Medium
```

### 4. **Optimization Strategies**

#### Connection Pooling
```python
# PostgreSQL connection pooling
POOL_SIZE = 10
MAX_CONNECTIONS = 20
CONNECTION_TIMEOUT = 30
```

#### Caching
```python
# Result caching
CACHE_TTL = 3600  # 1 hour
CACHE_SIZE = 1000  # Max cached queries
```

#### Batch Operations
```python
# Batch document processing
BATCH_SIZE = 100
PARALLEL_WORKERS = 4
```

## Troubleshooting

### Common Issues

#### 1. **Backend Connection Failures**

**Symptom**: Search returns empty results or errors
**Diagnosis**:
```python
health = await adapter.health_check()
print(health)
```

**Solutions**:
- Check environment variables
- Verify network connectivity
- Confirm service availability
- Review authentication credentials

#### 2. **Embedding Generation Errors**

**Symptom**: Document processing fails during embedding generation
**Diagnosis**:
```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode("test content")
```

**Solutions**:
- Verify model installation
- Check available memory
- Validate input content format
- Review model compatibility

#### 3. **Vector Dimension Mismatch**

**Symptom**: Storage operations fail with dimension errors
**Current Issue**: 384-dim (sentence-transformers) vs 1536-dim (OpenAI) embeddings

**Solutions**:
- Standardize on single embedding model
- Implement dimension conversion
- Configure separate indices for different dimensions
- Use model-specific storage paths

#### 4. **CocoIndex Integration Issues**

**Symptom**: PostgreSQL storage fails
**Diagnosis**:
```python
client = cocoindex.create_client(database_url=DATABASE_URL)
result = client.health_check()
```

**Solutions**:
- Verify PostgreSQL connection
- Check pgvector extension installation
- Confirm CocoIndex service status
- Review database permissions

### Debugging Tools

#### 1. **Logging Configuration**

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Enable detailed logging
logger.debug("Search query: %s", query)
logger.debug("Backend results: %s", results)
```

#### 2. **Performance Monitoring**

```python
import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        result = await func(*args, **kwargs)
        duration = time.time() - start
        logger.info(f"{func.__name__} took {duration:.3f}s")
        return result
    return wrapper

@timing_decorator
async def search_with_timing(query):
    return await adapter.search(query)
```

#### 3. **Health Monitoring**

```python
async def monitor_system_health():
    while True:
        health = await adapter.health_check()
        if health['overall_status'] != 'healthy':
            logger.warning(f"System health degraded: {health}")
        await asyncio.sleep(60)  # Check every minute
```

## Development Guidelines

### 1. **Code Style**

- Follow PEP 8 conventions
- Use type hints for all functions
- Document all public methods
- Implement comprehensive error handling

### 2. **Testing Strategy**

#### Unit Tests
```python
import pytest
from lib.adapters.dual_rag_adapter import TripleRAGAdapter

@pytest.mark.asyncio
async def test_search_functionality():
    adapter = TripleRAGAdapter()
    results = await adapter.search("test query", top_k=5)
    assert len(results) <= 5
    assert all('score' in result for result in results)
```

#### Integration Tests
```python
@pytest.mark.asyncio
async def test_end_to_end_processing():
    # Test complete workflow from ingestion to search
    from main_unified import process_youtube_unified
    
    result = await process_youtube_unified("https://youtube.com/watch?v=test")
    assert result['success'] is True
    
    # Search for processed content
    search_results = await adapter.search("test content")
    assert len(search_results) > 0
```

### 3. **Error Handling Patterns**

```python
async def robust_search(query: str, retries: int = 3) -> List[Dict]:
    for attempt in range(retries):
        try:
            return await adapter.search(query)
        except Exception as e:
            logger.warning(f"Search attempt {attempt + 1} failed: {e}")
            if attempt == retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)  # Exponential backoff
```

### 4. **Configuration Management**

```python
from pydantic import BaseSettings

class TripleRAGSettings(BaseSettings):
    upstash_url: str
    upstash_token: str
    database_url: str
    cocoindex_enabled: bool = True
    upstash_weight: float = 0.4
    local_rag_weight: float = 0.3
    cocoindex_weight: float = 0.3
    
    class Config:
        env_file = ".env"
```

### 5. **Future Enhancements**

#### Planned Features
1. **Hybrid Search**: Combine semantic and keyword search
2. **Dynamic Weighting**: Adjust weights based on query type
3. **Result Caching**: Cache frequent queries for better performance
4. **Monitoring Dashboard**: Real-time system health visualization
5. **A/B Testing**: Compare different search strategies
6. **Auto-scaling**: Dynamic backend scaling based on load

#### Extension Points
1. **Custom Embeddings**: Support for different embedding models
2. **Additional Backends**: Plugin system for new vector stores
3. **Advanced Merging**: ML-based result combination
4. **Query Optimization**: Automatic query enhancement
5. **Federated Search**: Cross-system search capabilities

---

## Conclusion

The Triple RAG System provides a comprehensive, scalable, and robust foundation for document processing and semantic search in the Disclosure RAG project. By leveraging multiple vector storage backends and intelligent result merging, the system ensures high availability, performance, and flexibility while maintaining simplicity in usage and deployment.

For additional support or questions, please refer to the project documentation or contact the development team.

---

**Last Updated:** July 9, 2025  
**Document Version:** 1.0  
**Next Review:** July 16, 2025