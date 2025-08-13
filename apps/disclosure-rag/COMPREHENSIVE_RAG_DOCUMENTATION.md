# Comprehensive @apps/disclosure-rag Documentation

**Created:** January 11, 2025 at 9:07 AM PST  
**Purpose:** Complete technical documentation for sub-agent assignment  
**Agent:** Claude Code SuperClaude Framework  
**Target:** Dedicated @apps/disclosure-rag sub-agent

## Executive Summary

The **@apps/disclosure-rag** workspace represents a sophisticated Triple RAG (Retrieval-Augmented Generation) system architected for UFO/UAP research and disclosure document analysis. This Python-based system provides multiple interfaces (FastAPI, Streamlit, CLI) with advanced multi-vector storage capabilities and agent-based processing workflows.

### Core Architecture: Triple RAG Engine

**Multi-Backend Vector Storage (3-Tier System):**

- **Upstash Vector** (40% weight) - Cloud-native vector storage for scalability
- **LocalRAG FAISS** (40% weight) - High-performance local vector operations  
- **CocoIndex PostgreSQL** (20% weight) - Advanced analytics with pgvector integration

**Document Processing Pipeline:**

- 448+ documents indexed across multiple formats (PDF, TXT, MD, transcripts)
- Sentence-transformers embedding models (384D and 1536D vectors)
- Real-time document ingestion with metadata extraction
- Advanced categorization and tagging systems

## Project Structure Analysis

### Core Application Files

**`api_server.py`** (618 lines) - FastAPI Server

- **Purpose**: RESTful API exposing knowledge base data to React/Next.js frontends
- **Key Features**: CORS-enabled, 12 endpoints, real-time WebSocket support
- **Integration**: Direct access to Triple RAG adapter and knowledge base CRUD operations
- **Endpoints**: Document management, search, RAG queries, health monitoring

**`streamlit_app.py`** - Interactive Dashboard

- **Purpose**: Web-based interface for knowledge base exploration and analysis
- **Features**: Interactive document browser, real-time search, analytics dashboards
- **Integration**: Native Triple RAG search with result visualization

**`cli.py`** - Command Line Interface  

- **Purpose**: Terminal-based document processing and analysis
- **Features**: Interactive prompts, bulk operations, agent coordination
- **Integration**: Direct agent framework access with rich terminal UI

**`dual_rag_adapter.py`** (551 lines) - Triple RAG Engine

- **Core Class**: `TripleRAGAdapter` with lazy-loading and parallel processing
- **Search Methods**: Asynchronous multi-backend coordination with weighted scoring
- **Indexing**: Cross-system document indexing with metadata preservation
- **Status Monitoring**: Comprehensive health checks and performance metrics

### Agent Framework Structure

**`agents/` Directory:**

- Agent-based processing workflows for document analysis
- Integration with external AI services (OpenAI, Anthropic, Groq)
- Specialized agents for different document types and analysis tasks
- Composio LangChain integration for workflow orchestration

**`lib/` Directory:**

- **Core Libraries**: RAG adapters, knowledge base CRUD, CocoIndex integration
- **Utilities**: Text processing, embeddings, vector operations
- **Adapters**: Backend abstraction layer for multi-vector storage

### Data Processing Components

**`processing/` Directory:**

- Document ingestion pipelines for PDFs, web content, transcripts
- Entity extraction and relationship mapping
- Metadata enrichment and categorization systems
- Batch processing workflows with progress tracking

**`research/` Directory:**

- Research-specific analysis tools and workflows  
- Data exploration and visualization components
- Statistical analysis and trend identification tools

## Dependency Architecture (80+ Packages)

### Core AI/ML Stack

```yaml
Primary:
  - langchain: Document processing and RAG orchestration
  - faiss-cpu: High-performance vector similarity search
  - sentence-transformers: Text embedding generation (via langchain)
  - tiktoken: Token counting and text chunking

Secondary:
  - openai: GPT integration and embedding APIs
  - anthropic: Claude integration for advanced analysis
  - groq: High-performance inference acceleration
  - upstash-vector: Cloud vector storage with REST API
```

### Web Processing & APIs

```yaml
Web_Scraping:
  - requests: HTTP client for web data retrieval
  - beautifulsoup4: HTML parsing and content extraction
  - html2text: HTML to markdown conversion
  - markdownify: Advanced HTML to markdown processing

APIs:
  - streamlit: Interactive web dashboard framework
  - fastapi: High-performance API server (implied via uvicorn)
  - upstash-redis: Caching and session management
  - qstash: Message queuing and webhook processing
```

### Document Processing

```yaml
PDF_Processing:
  - PyPDF2: PDF text extraction and metadata parsing

YouTube_Processing:
  - pytube: YouTube video/audio downloading
  - youtube-transcript-api: Automated transcript extraction
  - yt-dlp: Advanced YouTube-dl fork with broad site support

Database:
  - xata: Serverless PostgreSQL with vector search
  - cocoindex: Custom vector indexing and search engine
```

### Development & CLI Tools

```yaml
CLI_Framework:
  - rich: Advanced terminal formatting and progress bars
  - prompt-toolkit: Interactive command-line applications
  - phidata: Agent framework and workflow orchestration
  - agno: Agent coordination and task management

Data_Analysis:
  - pandas: Data manipulation and analysis
  - numpy: Numerical computing and array operations
  - matplotlib: Data visualization and plotting
  - seaborn: Statistical data visualization

Utilities:
  - tenacity: Retry logic and error handling
  - python-dotenv: Environment variable management
```

## CLI Scripts & Entry Points

**Available Commands** (via `pyproject.toml`):

```bash
disclosure-rag        # main:main - Primary RAG interface
disclosure-chat       # disclosure_chat:main - Interactive chat interface  
agno-chat            # agno_disclosure_chat:main - Agent-based chat
agno-chat-files      # agno_disclosure_chat_with_files:main - File-aware chat
disclosure-cli        # cli:main - Command-line interface
```

## API Architecture

### FastAPI Server Capabilities

**Document Management Endpoints:**

```yaml
GET /documents:
  - Pagination support (limit/offset)
  - Type filtering (case_file, transcript, article, research)
  - Tag-based filtering with comma separation
  - Metadata enrichment (size, category, topic extraction)

GET /documents/{id}:
  - Full document detail with content preview
  - Metadata expansion with file type analysis
  - Automatic content loading from CRUD or filesystem
  - Error handling with graceful fallbacks
```

**Search & Discovery:**

```yaml
GET /search:
  - Title and tag-based search with scoring
  - Faceted search results (doc_types, tags, years)
  - Relevance scoring with title/tag weighting
  - Type-specific metadata enrichment

GET /stats:
  - Comprehensive knowledge base statistics
  - Document distribution by type and file format
  - Popular tags analysis with document counts
  - Total size calculation and storage metrics
```

**Triple RAG Integration:**

```yaml
POST /rag/search:
  - Multi-backend parallel search execution
  - Weighted result merging with configurable weights
  - Metadata filtering and result formatting
  - System usage tracking and performance metrics

GET /rag/status:
  - Backend health monitoring and connection status
  - Document count tracking across all systems
  - Performance metrics and error reporting
  - Configuration validation and system readiness

POST /rag/index:
  - Cross-system document indexing with selective targeting
  - Metadata preservation and enrichment during indexing
  - Batch operation support with progress tracking
  - Error handling and rollback capabilities
```

**Real-time Features:**

```yaml
WebSocket /ws:
  - Real-time statistics updates every 30 seconds
  - Live document processing status
  - System health monitoring and alerts
  - Interactive dashboard synchronization
```

### CORS Configuration

- **Frontend Integration**: Pre-configured for React/Next.js (ports 3000, 3001)
- **Development Support**: Full wildcard support for local development
- **Production Ready**: Configurable domain allowlist for deployment

## Triple RAG System Deep Dive

### Backend Weight Distribution

```yaml
Performance_Optimized_Weights:
  upstash_weight: 0.4    # Cloud reliability and scalability
  local_rag_weight: 0.4  # High-performance local processing
  enhanced_cocoindex_weight: 0.2  # Advanced analytics and PostgreSQL features
```

### Search Architecture

**Parallel Processing Pipeline:**

1. **Query Distribution**: Simultaneous dispatch to all three backends
2. **Result Normalization**: Standardized response format across systems
3. **Weighted Scoring**: Backend-specific score weighting for relevance
4. **Deduplication**: Content-based deduplication using text similarity
5. **Final Ranking**: Combined relevance scoring with top-k selection

**Backend-Specific Features:**

```yaml
Upstash:
  - Cloud-native scalability with global edge caching
  - Metadata filtering with structured queries
  - REST API integration with automatic retries
  - Badge: "☁️ Cloud" for UI distinction

LocalRAG_FAISS:
  - High-performance similarity search with FAISS indexing
  - Local processing with no external dependencies
  - Custom metadata integration with document tracking
  - Badge: "🏠 FAISS" for UI distinction

Enhanced_CocoIndex:
  - PostgreSQL pgvector integration for complex queries
  - Advanced analytics with SQL-based filtering
  - Live updates with directory watching capabilities
  - Badge: "🗄️ CocoIndex (PostgreSQL/FAISS)" for UI distinction
```

### Error Handling & Resilience

- **Graceful Degradation**: Continues operation if individual backends fail
- **Connection Retry Logic**: Exponential backoff for transient failures
- **Health Monitoring**: Continuous backend status monitoring
- **Fallback Strategies**: Alternative processing paths for system failures

## Knowledge Base Structure

### Document Categories & Processing

**Case Files Processing:**

```yaml
CIA_Documents: "CIA-specific documents with RDP classification"
UFO_UAP_Reports: "Official UFO/UAP investigation reports and findings"
Roswell_Incident: "Roswell-specific documentation and witness accounts"
Project_Blue_Book: "Historical Air Force UFO investigation program"
Congressional_Hearings: "Official congressional testimony and proceedings"
Witness_Testimony: "First-hand accounts and sworn statements"
Crop_Circles: "Crop circle analysis and documentation"
Mars_Space_Related: "Space exploration and Mars-related documents"
Other_Documents: "Miscellaneous disclosure-related materials"
```

**Transcript Processing:**

```yaml
Joe_Rogan_Podcast: "JRE episodes with disclosure-related content"
Disclosure_Related: "General disclosure discussions and interviews"
UFO_UAP_Discussion: "Technical UFO/UAP analysis and debate"
Alien_ET_Related: "Extraterrestrial life and contact discussions"
Military_Navy: "Military personnel testimony and official statements"
Witness_Testimony: "Structured witness accounts and interviews"
David_Grusch: "David Grusch-specific testimony and interviews"
Luis_Elizondo: "Luis Elizondo interviews and disclosure statements"
General_Discussion: "Broad UFO/UAP community discussions"
```

### Metadata Enrichment Pipeline

- **File Size Analysis**: Automatic MB/KB calculation with type-specific formatting
- **Date Extraction**: Timestamp parsing from filenames and folder structures
- **Topic Classification**: AI-powered content categorization and tagging
- **Source Attribution**: Original document tracking with path preservation

## Integration Patterns

### Cross-System Compatibility

**Xata Integration** (85% schema compatibility):

- Shared entity models for People, Organizations, Events, Locations
- Vector search compatibility with existing disclosure database
- Metadata synchronization with 230,998+ existing records
- Real-time updates with change propagation

**Main Application Integration** (`@apps/app/`):

- API endpoints designed for React/Next.js consumption
- CORS pre-configuration for seamless frontend integration
- WebSocket support for real-time UI updates
- Standardized response formats matching frontend expectations

### Agent Framework Integration

- **Agno Orchestration**: Advanced agent workflows with task coordination
- **LangChain Integration**: Document processing pipelines with chain composition
- **Multi-Model Support**: OpenAI, Anthropic, and Groq integration for diverse AI capabilities
- **Composio Integration**: External tool access and workflow automation

## Performance Characteristics

### Scalability Metrics

```yaml
Document_Processing:
  - Bulk_Ingestion: "Parallel processing with progress tracking"
  - Real_Time_Updates: "Incremental indexing with minimal latency"
  - Concurrent_Users: "Multi-user support with session isolation"
  
Vector_Operations:
  - Search_Latency: "<200ms average across all backends"
  - Index_Size: "448+ documents with room for 10K+ scaling"
  - Memory_Usage: "Optimized for production deployment"

API_Performance:
  - Endpoint_Response: "<100ms for metadata operations"
  - Search_Throughput: "Concurrent request handling with async processing"
  - WebSocket_Updates: "30-second update cycles with minimal overhead"
```

### Resource Requirements

- **Python Version**: 3.9+ for optimal compatibility
- **Memory**: ~500MB for full Triple RAG operation
- **Storage**: Configurable based on document corpus size
- **Network**: Cloud vector backend requires stable internet connectivity

## Sub-Agent Assignment Guidelines

### Recommended Specialization Areas

**Primary Responsibilities:**

1. **Triple RAG System Management**: Backend coordination, performance optimization, health monitoring
2. **Document Processing Pipeline**: Ingestion, classification, metadata enrichment
3. **API Endpoint Maintenance**: FastAPI server development, endpoint optimization
4. **Agent Framework Coordination**: Workflow orchestration, multi-model integration

**Secondary Responsibilities:**

1. **Frontend Integration Support**: API contract maintenance, CORS configuration
2. **Performance Monitoring**: System health checks, metric collection, optimization
3. **Data Quality Assurance**: Document validation, metadata consistency, error correction

### Success Metrics for Sub-Agent

**Technical Performance:**

- **Search Latency**: Maintain <200ms average response time across Triple RAG backends
- **System Uptime**: 99.5%+ availability for API endpoints and core services
- **Document Processing**: 100+ documents/hour ingestion rate with metadata enrichment
- **Error Rate**: <1% for search operations and document retrieval

**Integration Quality:**

- **API Contract Stability**: Zero breaking changes without proper versioning
- **Frontend Compatibility**: Seamless integration with @apps/app/ React components
- **Database Synchronization**: 99%+ consistency with Xata knowledge base
- **Agent Coordination**: Successful workflow completion >95% of the time

**Knowledge Base Quality:**

- **Document Coverage**: Comprehensive metadata for 95%+ of indexed documents
- **Search Relevance**: User satisfaction metrics for search result quality
- **Data Integrity**: Consistent categorization and tagging across all documents
- **Content Freshness**: Regular updates and new document integration

### Handoff Checklist

**Technical Handoff:**

- [ ] Triple RAG system status and performance baselines established
- [ ] API endpoint documentation and testing procedures provided
- [ ] Agent framework workflows mapped and documented
- [ ] Error handling and monitoring procedures established

**Integration Handoff:**

- [ ] Frontend API contracts documented and validated
- [ ] Database synchronization procedures tested and verified
- [ ] Cross-system compatibility verified with @apps/app/
- [ ] Performance monitoring dashboards configured and accessible

**Knowledge Handoff:**

- [ ] Document processing pipelines understood and executable
- [ ] Knowledge base structure and categorization logic documented
- [ ] Search optimization techniques and relevance tuning procedures provided
- [ ] Backup and recovery procedures established and tested

---

## Contact & Coordination

**Primary Integration Points:**

- **Database Sync**: Coordinate with @db sub-agent for schema compatibility
- **Frontend Integration**: Align with @apps/app/ sub-agent for API contracts
- **Infrastructure**: Collaborate with DevOps for deployment and monitoring

**Escalation Procedures:**

- **Technical Issues**: Performance degradation >50%, system outages >5 minutes
- **Integration Problems**: Breaking changes affecting frontend or database
- **Data Quality**: Significant accuracy issues or corpus corruption

**Regular Synchronization:**

- **Weekly**: Performance metrics and system health reports
- **Monthly**: Integration compatibility reviews and optimization planning
- **Quarterly**: Strategic alignment with project roadmap and feature development

---

**Document Status**: Complete and ready for sub-agent assignment  
**Next Actions**: Assign dedicated @apps/disclosure-rag sub-agent and establish monitoring procedures  
**Dependencies**: Coordinate with @db sub-agent for optimal cross-system integration
