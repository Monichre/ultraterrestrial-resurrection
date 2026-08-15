# 🏗️ Disclosure RAG System Architecture

**Last Updated**: September 18, 2025  
**Status**: Production Ready  
**Version**: 2.0 (Quinuple RAG)

## 🎯 Executive Summary

The Disclosure RAG system operates on a **Quinuple RAG architecture** - a sophisticated 5-layer vector search system designed for comprehensive UFO/UAP research. This corrects previous documentation that incorrectly described it as a "Triple RAG" system.

**Core Capabilities**:
- **233,932+ searchable items** across 5 vector systems
- **448 documents** in knowledge base with **230,998+ structured records**
- **130K+ UFO sightings** with geographic and temporal analysis
- **Multi-interface access** (Web, API, CLI, Streamlit)

---

## 🔧 Quinuple RAG Architecture

### **Complete 5-Layer System**

#### **Layer 1: OpenAI Vector Store (Primary Foundation)**
- **System**: OpenAI Assistant API with Vector Store
- **Content**: 2,426 documents (UAP research, transcripts, case files)
- **ID**: `vs_meWOEnUiUxtQWf0W6NBsNpCG`
- **Integration**: Powers Prometheus AI in Next.js app
- **Status**: ✅ **Fully Operational**

#### **Layer 2: Neon Postgres (Structured Data)**
- **System**: Neon Postgres 17 + pgvector, accessed via `@db/postgres`
- **Features**: Full-text search (tsvector), vector similarity (pgvector), entity relationships
- **Status**: ✅ **Operational** — the platform database
- **Note**: Xata is **retired**. Remaining `xata_*` modules in this app are dead code:
  the import in `agents/entity_extraction_agent.py` is guarded and falls back to a stub
  returning `{"error": "XATA search not configured"}`. Do not treat Xata as a datastore.

#### **Layer 3: Upstash Vector (Cloud Storage)**
- **System**: Cloud-based vector database
- **Weight**: 30% in unified search results
- **Purpose**: Scalable vector operations, backup storage
- **Integration**: Python RAG adapters
- **Status**: 🔄 **Available** (API key dependent)

#### **Layer 4: LocalRAG FAISS (Local Performance)**
- **System**: Facebook AI Similarity Search (FAISS)
- **Weight**: 20% in unified search results  
- **Purpose**: Fast local similarity search, offline capability
- **Storage**: Local binary indices
- **Status**: 🔄 **Available** (file-based)

#### **Layer 5: CocoIndex PostgreSQL (Analytics)**
- **System**: PostgreSQL with pgvector extension
- **Weight**: 20% in unified search results
- **Purpose**: Advanced analytics, complex queries
- **Features**: Dual backend (PostgreSQL + FAISS), live updates
- **Status**: ✅ **Enhanced Version Active**

---

## 📊 System Performance & Capacity

### **Search Weight Distribution**
```yaml
Primary_Systems:
  openai_vector_store: Primary (2,426 files)
  neon_postgres: Primary (via @db/postgres)

Weighted_Systems:
  upstash_vector: 30%      # Cloud reliability
  local_faiss: 20%         # Performance optimization  
  cocoindex_postgresql: 20% # Analytics capability
  
Total_Weight: 70% (plus two primary systems)
```

### **Content Distribution**
- **Research Papers**: Jacques Vallée, Diana Pasulka, Gary Nolan
- **Government Documents**: Congressional hearings, CIA files  
- **Testimonies**: Military personnel, pilot reports
- **Transcripts**: 407 YouTube transcripts, interviews
- **Case Files**: 31 PDF documents (~245 MB)
- **Geographic Data**: 130,445+ UFO sightings with coordinates

### **Performance Metrics**
- **Unified Search**: 10-30 seconds comprehensive results
- **OpenAI Response**: 5-15 seconds
- **Postgres Queries**: <1 second  
- **Local Systems**: Variable (dependency-based)
- **Entity Extraction**: 85-95% accuracy

---

## 🔄 System Integrations

### **Next.js Application Integration**
```typescript
// Primary: Direct OpenAI Assistant calls
const response = await openai.beta.threads.runs.create(threadId, {
  assistant_id: "asst_sdNxYC9p05iGpeKXtL496cyh", // Prometheus
  tools: [{ type: "file_search" }] // Uses OpenAI vector store
});

// Secondary: Neon Postgres queries via tool calls
const searchResults = await searchDatabase({
  query,
  table: "all" // Hybrid FTS + pgvector, fused with RRF
});
```

### **Python Disclosure-RAG Integration**
```python
# Unified search across all 5 layers
search = QuinupleRAGUnifiedSearch()

# Layer 1 & 2: Primary systems
openai_results = await search.search_openai(query)
postgres_results = await search.search_postgres(query)

# Layers 3-5: Weighted systems
unified_results = await search.search_unified(query)
```

---

## 🛠️ Technical Infrastructure

### **Dependencies**
```python
# Core AI/ML Stack
openai>=1.93.3                    # OpenAI API
asyncpg>=0.29.0                   # PostgreSQL async
pgvector>=0.1.0                   # Vector similarity
upstash-vector>=0.4.0             # Cloud vector storage
faiss-cpu>=1.7.4                  # Local similarity search

# Document Processing
langchain                         # RAG orchestration
sentence-transformers             # Embeddings
PyPDF2                           # PDF processing
youtube-transcript-api           # YouTube processing
```

### **Environment Configuration**
```bash
# Required environment variables
OPENAI_API_KEY=your_openai_key
DATABASE_URL=your_neon_postgres_url   # falls back to packages/db/.env
UPSTASH_VECTOR_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token

# System Configuration
COCOINDEX_BACKEND=postgresql      # or faiss
LIVE_UPDATES_ENABLED=true
ENHANCED_COCOINDEX_WEIGHT=0.2
```

---

## 🎨 Multi-Interface Design

### **Interface Hierarchy**
- **Primary**: Streamlit Web Dashboard (Port 8501) - Interactive analysis
- **API**: FastAPI Server (Port 8000) - Programmatic access  
- **Frontend**: Next.js Research Canvas (Port 3000) - Advanced UI
- **CLI**: Enhanced command-line - Batch processing
- **Chat**: Multiple chat interfaces - Conversational interaction

### **API Endpoints**
```yaml
Knowledge_Base:
  - GET /documents
  - GET /documents/{id}
  - GET /search
  - GET /stats
  - GET /tags

RAG_Search:
  - POST /rag/search
  - GET /rag/status
  - POST /rag/index

Health:
  - GET /health
  - WS /ws (WebSocket)
```

---

## 📈 Data Architecture

### **Database Schema**
- **Primary**: Neon Postgres 17 + pgvector via `@db/postgres`
- **Vector Storage**: Multi-backend with different specializations
- **Geographic**: PostgreSQL with 130K+ sighting coordinates
- **Local Files**: Knowledge base with 448 indexed documents

### **Entity Types**
```python
CORE_ENTITIES = {
    'personnel': 'Key figures, witnesses, researchers',
    'events': 'UAP incidents, encounters, disclosures', 
    'organizations': 'Government agencies, military units',
    'locations': 'Geographic sites, facilities, bases',
    'sightings': 'UAP observations with metadata',
    'testimonies': 'Witness accounts and statements',
    'documents': 'Research papers, government files',
    'artifacts': 'Physical evidence and materials',
    'topics': 'Themes, subjects, classifications'
}
```

---

## 🔐 Security & Quality

### **Data Integrity**
- **API Key Management**: Environment-based secure storage
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Graceful degradation and fallback systems
- **Backup Strategy**: Multiple storage backends for redundancy

### **Quality Metrics**
- **Entity Extraction**: 85-95% accuracy maintained
- **Search Relevance**: Multi-system validation and ranking
- **System Uptime**: 99%+ availability target
- **Response Times**: <30 seconds for comprehensive searches

---

## 🚀 Development Status

### **Production Ready Components** ✅
- Quinuple RAG system fully operational
- Multi-interface access (Web, API, CLI)
- Entity extraction with high accuracy
- Geographic analysis capabilities
- Real-time processing and visualization

### **Active Development** 🔄
- AGNO agent integration (Phase 1 in progress)
- Performance optimization initiatives
- Advanced analytics capabilities

### **Planned Enhancements** 📋
- Enhanced cross-system search optimization
- Real-time collaboration features
- Advanced ML-based result ranking
- Mobile interface development

---

## 📚 Related Documentation

- **[AGNO_ROADMAP.md](AGNO_ROADMAP.md)**: Complete integration strategy
- **[STATUS.md](STATUS.md)**: Current system status and metrics
- **[README.md](README.md)**: Quick start and overview
- **[docs/](docs/)**: Detailed implementation guides

---

## ⚠️ Architecture Notes

### **Terminology Correction**
- **Previous**: Incorrectly documented as "Triple RAG" (3 systems)
- **Current**: Accurately documented as "Quinuple RAG" (5 systems)
- **Impact**: This correction affects all search algorithms and weight distributions

### **System Evolution**
The architecture has evolved from initial document processing to comprehensive UAP research platform, maintaining backward compatibility while adding sophisticated multi-layer search capabilities.

---

**🎯 Conclusion**: The Quinuple RAG architecture provides unprecedented access to UFO/UAP research data through sophisticated multi-layer vector search, supporting comprehensive research workflows across multiple specialized interfaces.

*Architecture Status: ✅ PRODUCTION READY - All 5 layers operational with 233,932+ searchable items*
