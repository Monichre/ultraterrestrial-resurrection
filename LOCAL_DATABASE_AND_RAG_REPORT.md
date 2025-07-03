# Local Database and RAG Implementation Report

**Date:** July 2, 2025  
**Report Generated:** By Claude Code at request of user

## Executive Summary

This report documents all PostgreSQL, pgvector, CocoIndex, local database instances, and local RAG implementations found in the Ultraterrestrial Resurrection codebase.

## 1. Database Connections Found

### 1.1 PostgreSQL Connections

#### Primary Database URLs:
1. **Supabase PostgreSQL** (Production):
   - URL: `postgresql://postgres:686Lorimer!!@db.yqeeyhdkzheigvrnunpu.supabase.co:5432/postgres`
   - Found in: `/.env`
   - Purpose: Main application database using Supabase

2. **Neon PostgreSQL**:
   - URL: `postgresql://ultraterrestrial_owner:8bG1keYsHCfz@ep-billowing-salad-a5m9dnhh.us-east-2.aws.neon.tech/ultraterrestrial?sslmode=require`
   - Found in: `/apps/disclosure-rag/.env`
   - Purpose: Alternative cloud PostgreSQL for disclosure-rag app

3. **Railway PostgreSQL**:
   - Multiple URLs found in `/apps/disclosure-rag/.env`
   - Private URL: `postgres://railway:0c_Hr!*BvGNCWxeChy8o~9CRxOONNa0s@postgres.railway.internal:5432/railway`
   - Purpose: Railway deployment database

4. **Timescale PostgreSQL**:
   - URL: `postgres://tsdbadmin:c17edc97h5ry7jg2@ec72vrlz0s.mleyd0g5xi.tsdb.cloud.timescale.com:36205/tsdb?sslmode=require`
   - Found in: `/apps/disclosure-rag/.env`
   - Purpose: Time-series data storage

5. **Local PostgreSQL** (Development):
   - Default URL: `postgresql://liamellis@localhost:5432/ultraterrestrial`
   - Found in: `/apps/disclosure-rag/lib/connectors/ultraterrestrial_db.py`
   - Purpose: Local development database

6. **CocoIndex PostgreSQL**:
   - URL: `postgresql://cocoindex:cocoindex@localhost:5432/cocoindex`
   - Found in: `/apps/disclosure-rag/lib/adapters/dual_rag_adapter.py`
   - Purpose: Local CocoIndex database for RAG

### 1.2 Vector Database Connections

1. **Upstash Vector**:
   - URL: `https://known-bobcat-28794-us1-vector.upstash.io`
   - Token: Found in `.env` files
   - Purpose: Cloud vector database for RAG

2. **pgvector** (PostgreSQL Extension):
   - Implemented in multiple schemas
   - Primary schema: `/apps/disclosure-rag/schema_ultraterrestrial_pgvector.sql`
   - Setup script: `/apps/disclosure-rag/setup_postgres_pgvector.sql`

## 2. Local RAG Implementations

### 2.1 Triple RAG Adapter
**Location:** `/apps/disclosure-rag/lib/adapters/dual_rag_adapter.py`

This is the main RAG implementation that integrates three systems:
1. **Upstash** (Cloud vector database)
2. **LocalRAG** (FAISS-based local system)
3. **CocoIndex** (PostgreSQL-based local system)

Key features:
- Parallel search across all three systems
- Weighted result merging
- Environment-based configuration
- Fallback mechanisms

### 2.2 LocalRAG (FAISS-based)
**Location:** `/apps/disclosure-rag/lib/local_rag.py`

Features:
- Uses Sentence Transformers for embeddings
- FAISS for vector indexing
- Local file-based persistence
- Index saved to `./rag_index` directory
- Supports CRUD operations on documents
- Batch search capabilities

### 2.3 PGVector Library
**Location:** `/apps/disclosure-rag/lib/storage/pgvector_library.py`

Features:
- Full PostgreSQL integration with pgvector
- Advanced analytics views
- Entity extraction and co-occurrence analysis
- Document clustering
- Hybrid search (semantic + keyword)
- Comprehensive metadata tracking

### 2.4 Ultraterrestrial DB Connector
**Location:** `/apps/disclosure-rag/lib/connectors/ultraterrestrial_db.py`

Features:
- Async PostgreSQL operations
- CSV data import functionality
- Embedding generation (Sentence Transformers or OpenAI)
- Semantic, keyword, and hybrid search
- Advanced analytics queries
- Entity relationship analysis

## 3. Database Schemas

### 3.1 Main pgvector Schema
**Location:** `/apps/disclosure-rag/schema_ultraterrestrial_pgvector.sql`

Tables with vector embeddings:
- `personnel` - UFO researchers (1536-dim vectors)
- `organizations` - Military/government orgs (500-dim vectors)
- `events` - UAP incidents (1536-dim vectors)
- `topics` - Research areas (1536-dim vectors)
- `documents` - Papers/reports (1536-dim vectors)
- `testimonies` - Witness accounts (1536-dim vectors)
- `artifacts` - Physical evidence (1536-dim vectors)
- `document_chunks` - RAG chunks (1536-dim vectors)
- `mindmaps` - User mindmaps (1536-dim vectors)

Advanced features:
- HNSW indexes for fast similarity search
- Full-text search indexes
- Analytical views for entity analysis
- Hybrid search functions
- Document quality scoring

### 3.2 Simple pgvector Setup
**Location:** `/apps/disclosure-rag/setup_postgres_pgvector.sql`

Simplified schema with:
- Basic documents table
- Entity extraction
- Tag system
- Analytical views

## 4. Configuration Details

### 4.1 Environment Variables

#### Triple RAG Configuration (from `/apps/disclosure-rag/.env`):
```env
# Local RAG (FAISS-based) Configuration  
LOCAL_RAG_ENABLED=true

# CocoIndex Configuration
COCOINDEX_ENABLED=false
COCOINDEX_FLOW_NAME=UFOResearch
COCOINDEX_DATABASE_URL=postgresql://cocoindex:cocoindex@localhost:5432/cocoindex

# Search Weights (should sum to 1.0)
UPSTASH_WEIGHT=0.4
LOCAL_RAG_WEIGHT=0.4
COCO_WEIGHT=0.2

# Performance
PARALLEL_SEARCH=true
```

### 4.2 Local Storage Paths

1. **FAISS Index**: `./rag_index/`
   - `faiss.index` - Vector index file
   - `documents.pkl` - Document metadata

2. **Knowledge Base**: `/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/`
   - Transcripts, case files, etc.

## 5. Implementation Status

### 5.1 Active Implementations
1. **Upstash Vector** - ✅ Active and configured
2. **LocalRAG (FAISS)** - ✅ Active by default
3. **PostgreSQL + pgvector** - ✅ Schema exists, needs data import

### 5.2 Pending Implementations
1. **CocoIndex** - ❌ Disabled by default (COCOINDEX_ENABLED=false)
2. **Local PostgreSQL** - ⚠️ Requires local PostgreSQL installation
3. **Data synchronization** - ⚠️ CSV import scripts available but not automated

## 6. Key Scripts and Tools

### 6.1 Database Setup
- `/apps/disclosure-rag/schema_ultraterrestrial_pgvector.sql` - Full schema
- `/apps/disclosure-rag/setup_postgres_pgvector.sql` - Simple setup
- `/apps/disclosure-rag/scripts/import-xata-to-postgres.py` - Import from Xata
- `/apps/disclosure-rag/scripts/bulk-import.py` - Bulk data import

### 6.2 RAG Integration
- `/apps/disclosure-rag/api_server.py` - FastAPI server with RAG endpoints
- `/apps/disclosure-rag/test_dual_rag.py` - Test dual RAG system
- `/apps/disclosure-rag/setup_cocoindex.py` - CocoIndex setup

### 6.3 Data Processing
- CSV exports available in `/apps/app/scripts/xata-exports/`
- Import functionality in `ultraterrestrial_db.py`

## 7. Recommendations

### 7.1 Immediate Actions
1. **Enable Local Development**:
   ```bash
   # Install PostgreSQL locally
   brew install postgresql@16
   brew services start postgresql@16
   
   # Create database
   createdb ultraterrestrial
   
   # Install pgvector extension
   brew install pgvector
   ```

2. **Import Data**:
   ```bash
   # Run schema setup
   psql ultraterrestrial < apps/disclosure-rag/schema_ultraterrestrial_pgvector.sql
   
   # Import CSV data
   cd apps/disclosure-rag
   python -c "from lib.connectors.ultraterrestrial_db import quick_setup_and_import; import asyncio; asyncio.run(quick_setup_and_import())"
   ```

### 7.2 Configuration Updates
1. Set `DATABASE_URL` in environment for local PostgreSQL
2. Consider enabling CocoIndex if needed
3. Adjust search weights based on performance needs

### 7.3 Performance Optimization
1. Use HNSW indexes for large datasets
2. Enable parallel search for better performance
3. Cache embeddings to reduce computation

## 8. Security Considerations

⚠️ **WARNING**: Multiple database credentials found in environment files:
- Supabase password exposed
- Railway credentials visible
- Neon database password in plaintext

**Recommendation**: Move all credentials to `.env.local` and use secret management.

## Conclusion

The codebase has a sophisticated multi-tier RAG implementation with:
- Cloud vector search (Upstash)
- Local vector search (FAISS)
- PostgreSQL with pgvector for hybrid search
- Optional CocoIndex integration

The system is designed for flexibility, allowing deployment with cloud-only, local-only, or hybrid configurations. The PostgreSQL + pgvector implementation is particularly powerful, offering SQL analytics combined with vector similarity search.