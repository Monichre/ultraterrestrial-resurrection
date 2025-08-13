# Data Ingestion Architecture - Disclosure RAG System

**Date:** July 9, 2025  
**Version:** 1.0  
**Command:** `dy '{url}'`

## Overview

The `dy` command is the primary data ingestion interface for the Disclosure RAG system. It processes content from various sources (YouTube, web articles, documents) and stores the data across multiple vector databases for comprehensive search and retrieval.

## Architecture Flow

```
User Input: dy 'https://youtube.com/watch?v=...' [--upload]
                            ↓
                    Content Processing
                    ├── YouTube → Transcript → Summary
                    ├── Web → Article Extraction
                    └── Document → Text Extraction
                            ↓
                    File Storage (Always)
                    └── /packages/knowledge-base/
                        ├── /transcripts/ (YouTube)
                        ├── /articles/ (Web)
                        └── /documents/ (Files)
                            ↓
                    Embedding Generation
                    (all-MiniLM-L6-v2 or similar)
                            ↓
                    Vector Storage (Multiple Targets)
                    ├── Upstash (Always) - Cloud Vector DB
                    ├── PostgreSQL pgvector (Always) - Local/Production
                    └── OpenAI Vector Store (Only with --upload flag)
```

## Storage Targets

### 1. **Local File System** (Always)

- **Path:** `/packages/knowledge-base/`
- **Organization:** By content type and date
- **Format:** Original files + metadata JSON
- **Example:** `/transcripts/2025/01/09/youtube_videoId_transcript.txt`

### 2. **Upstash Vector Database** (Always)

- **Purpose:** Primary cloud vector search
- **Configuration:**

  ```bash
  UPSTASH_VECTOR_REST_URL=https://known-bobcat-28794-us1-vector.upstash.io
  UPSTASH_VECTOR_REST_TOKEN=your_token
  ```

- **Features:** Fast semantic search, cloud-native

### 3. **PostgreSQL with pgvector** (Always)

- **Local Development:**

  ```bash
  DATABASE_URL=postgresql://liamellis@localhost:5432/ultraterrestrial
  ```

- **Production (Future):**

  ```bash
  DATABASE_URL=postgresql://xata-wire-protocol/ultraterrestrial
  ```

- **Schema:**

  ```sql
  CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY,
    doc_id TEXT NOT NULL,
    content TEXT,
    embedding vector(384),  -- for all-MiniLM-L6-v2
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

### 4. **OpenAI Vector Store** (Only with --upload flag)

- **Purpose:** AI assistant integration
- **Configuration:**

  ```bash
  OPENAI_API_KEY=your_key
  UFO_DATA_STORE_ID=vs_meWOEnUiUxtQWf0W6NBsNpCG
  ```

- **Usage:** Enables ChatGPT-style retrieval

## Implementation Requirements

### Content Processing Pipeline

1. **YouTube Processing:**

   ```python
   # Extract video ID
   # Generate transcript using youtube-transcript-api
   # Create summary using Claude/GPT
   # Save to /transcripts/YYYY/MM/DD/youtube_{video_id}_transcript.txt
   # Save summary to /transcripts/YYYY/MM/DD/youtube_{video_id}_summary.txt
   ```

2. **Web Article Processing:**

   ```python
   # Extract content using BeautifulSoup/Readability
   # Clean and format text
   # Extract metadata (title, author, date)
   # Save to /articles/YYYY/MM/DD/{sanitized_title}.txt
   ```

3. **Document Processing:**

   ```python
   # Support PDF, DOCX, TXT formats
   # Extract text content
   # Parse metadata
   # Save to /documents/YYYY/MM/DD/{filename}
   ```

### Embedding Generation

```python
def generate_embeddings(content: str) -> np.ndarray:
    """Generate embeddings using sentence-transformers"""
    from sentence_transformers import SentenceTransformer
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(content)
    return embeddings
```

### Vector Storage Implementation

```python
async def store_vectors(doc_id: str, content: str, metadata: dict, upload_flag: bool):
    """Store vectors across all configured backends"""
    
    # 1. Generate embeddings
    embeddings = generate_embeddings(content)
    
    # 2. Always store in Upstash
    await store_in_upstash(doc_id, embeddings, metadata)
    
    # 3. Always store in PostgreSQL
    await store_in_postgres(doc_id, content, embeddings, metadata)
    - differentiate between local postgres instance and persisting through from local to remote (xata)     
    # 4. Conditionally store in OpenAI
    if upload_flag:
        await upload_to_openai(doc_id, content, metadata)
```

## Database Configuration

### Current Configuration

1. **CocoIndex Integration:**
   - CocoIndex is used as the service layer for PostgreSQL pgvector operations
   - Provides ETL framework for building data indexes with PostgreSQL backend
   - Handles vector operations through a structured API

2. **Database URLs:**
   - Local: `postgresql://liamellis@localhost:5432/ultraterrestrial`
   - Production: Will use Xata PostgreSQL wire protocol

3. **Environment Variables:**

   ```bash
   # CocoIndex configuration:
   COCOINDEX_ENABLED=true
   COCOINDEX_DATABASE_URL=postgresql://liamellis@localhost:5432/ultraterrestrial
   
   # PostgreSQL configuration:
   DATABASE_URL=postgresql://liamellis@localhost:5432/ultraterrestrial
   PGVECTOR_ENABLED=true
   ```

## Command Line Interface

### Basic Usage

```bash
dy 'https://youtube.com/watch?v=abc123'
```

### With OpenAI Upload

```bash
dy 'https://youtube.com/watch?v=abc123' --upload
```

### Batch Processing

```bash
dy --file urls.txt [--upload]
```

## Error Handling

1. **Network Failures:** Retry with exponential backoff
2. **Storage Failures:** Queue for later processing
3. **Embedding Failures:** Log and continue with other backends
4. **Validation:** Check content size limits before processing

## Performance Considerations

1. **Parallel Processing:** Store to multiple backends concurrently
2. **Batch Operations:** Process multiple documents in batches
3. **Caching:** Cache embeddings to avoid regeneration
4. **Rate Limiting:** Respect API limits for external services

## Migration Path

### Phase 1: Clean Up Current Implementation

1. Remove LocalVectorLibrary (redundant with LocalRAG)
2. Integrate CocoIndex as service layer for PostgreSQL/pgvector operations
3. Standardize on both DATABASE_URL and COCOINDEX_DATABASE_URL environment variables

### Phase 2: Enhance dy Command

1. Add Upstash integration (priority)
2. Ensure CocoIndex PostgreSQL storage works
3. Implement conditional OpenAI upload

### Phase 3: Production Readiness

1. Add Xata PostgreSQL wire protocol support
2. Implement comprehensive error handling
3. Add monitoring and logging

## Testing Strategy

```python
# Test all storage backends
def test_data_ingestion():
    # Test YouTube processing
    dy('https://youtube.com/watch?v=test')
    assert file_exists('/transcripts/...')
    assert vector_in_upstash()
    assert vector_in_postgres()
    
    # Test with upload flag
    dy('https://youtube.com/watch?v=test', upload=True)
    assert vector_in_openai()
```

## Security Considerations

1. **API Keys:** All keys in environment variables
2. **Content Validation:** Sanitize all input content
3. **Access Control:** Implement user authentication (future)
4. **Data Privacy:** Local-first with optional cloud sync

---

This architecture ensures that all ingested content is:

1. Saved locally in the knowledge base
2. Indexed in Upstash for cloud search
3. Stored in PostgreSQL for local/production search
4. Optionally uploaded to OpenAI for AI assistant integration
