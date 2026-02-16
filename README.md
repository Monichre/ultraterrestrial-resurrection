# Project Structure - Ultraterrestrial Resurrection

**Generated**: July 13, 2025  
**Purpose**: Comprehensive file and directory index for code navigation  
**Project**: UFO/UAP Research Platform with AI-powered analysis and spatial intelligence

---

## 🏗️ Architecture Overview

**Ultraterrestrial Resurrection** is a sophisticated monorepo containing multiple applications for UFO/UAP research, featuring advanced AI capabilities, spatial intelligence systems, and multiple RAG (Retrieval-Augmented Generation) backends.

```
ultraterrestrial-resurrection/
├── 📱 apps/                    # Application Layer (3 apps)
├── 📦 packages/               # Shared Packages (5 packages)
├── 📚 docs/                   # Project Documentation
├── 🗂️ disclosure-agentic-research-documentation/
└── 📄 *.md                   # Root Documentation Files
```

**Key Metrics**:

- **230,998+ database records** across UFO/UAP research entities
- **500+ source files** across applications and packages
- **5 RAG/vector storage systems** for intelligent document processing
- **29 database entity models** with comprehensive relationships

---

## 📱 Applications (`/apps/`)

### 🎯 Main Research Application (`/apps/app/`)

**Purpose**: Primary UFO/UAP research platform with interactive mindmaps and spatial intelligence

#### **Application Structure**

```
📁 src/
├── 📄 app/                   # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (site)/              # Public site routes  
│   ├── api/                 # API endpoints
│   │   ├── admin/           # Admin functionality
│   │   └── chat/            # AI chat endpoints
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── 🧩 components/           # React components (50+ categories)
├── 🎨 features/             # Feature modules (10+ major features)
├── 🪝 hooks/                # Custom React hooks (30+ hooks)
├── 📚 lib/                  # Utility libraries
├── 🎨 styles/               # SCSS stylesheets
└── 🛠️ utils/               # Helper utilities
```

#### **Core Features (`/src/features/`)**

**🧠 Mindmap System (`/features/mindmap/`)**

- **Enhanced nodes** with smart badge system and temporal context
- **Spatial grouping** with proximity-based analysis
- **Guided tours** with historical narrative progression
- **AI integration** with contextual intelligence
- **Real-time collaboration** via Liveblocks

```
mindmap/
├── components/              # UI components for mindmap
├── nodes/                   # Enhanced node implementations
├── edges/                   # Custom edge types
├── tours/                   # Guided historical tour system
├── layouts/                 # Auto-layout algorithms
├── hooks/                   # Mindmap-specific hooks
└── utils/                   # Contextual intelligence utilities
```

**🎮 3D Visualizations (`/features/3d/`)**

- **Globe connections** - Worldwide sighting network visualization
- **Timeline journeys** - 3D chronological exploration
- **Entity networks** - Relationship graphs in 3D space
- **UFO models** - Interactive 3D asset integration

```
3d/
├── visualizations/         # 3D visualization components
├── ufos/                   # UFO 3D models and scenes
├── globe-connections/      # Global network visualization
└── scroll-through-3d/      # 3D scroll interactions
```

**🤖 AI Integration (`/features/ai/`)**

- **Chat interfaces** with streaming responses
- **Document processing** pipelines
- **Knowledge graph** integration
- **Multi-LLM support** (OpenAI, Anthropic, Groq)

```
ai/
├── components/             # AI UI components
├── pipelines/              # Processing pipelines
├── actions/                # Server actions
└── knowledge/              # Knowledge base integration
```

**📊 Data Visualization (`/features/data-viz/`)**

- **Sightings globe** with temporal analysis
- **Heat maps** and density visualization
- **Geospatial correlation** tools
- **Interactive timelines** and filtering

**🗂️ Case Files (`/features/case-files/`)**

- **Evidence browser** with spatial workspace
- **Document annotations** and connections
- **Investigation workflows** and collaboration
- **Research session management**

#### **Component Categories (`/src/components/`)**

**🎨 Visual Components**

- **`animations/`** - 3D animations, meteor effects, cosmic portals
- **`backgrounds/`** - Grain effects, stars, shader backgrounds
- **`cursors/`** - Custom cursor implementations
- **`decorative/`** - UI embellishments and effects

**🔧 Functional Components**

- **`research/`** - Research workflow interfaces
- **`admin/`** - Administrative interfaces
- **`chat/`** - AI chat and messaging
- **`file-upload/`** - Document upload and processing

**🎛️ UI Primitives**

- **`cult-ui/`** - Custom UI components
- **`hud-interface/`** - HUD-style interfaces
- **`graph-paper/`** - Grid and paper backgrounds
- **`glitch-fx/`** - Visual effects and transitions

#### **Technology Stack**

- **Framework**: Next.js 15.3.5 with React 19.1.0
- **Styling**: Tailwind CSS 4.1.11 with Radix UI
- **3D**: Three.js, React Three Fiber, D3.js
- **State**: Zustand, React Context
- **Real-time**: Liveblocks, PartySocket
- **AI**: Vercel AI SDK, OpenAI, Anthropic

### 🧠 Disclosure RAG System (`/apps/disclosure-rag/`)

**Purpose**: Advanced document processing and retrieval-augmented generation with triple RAG architecture

#### **Core Architecture**

```
📁 lib/
├── 🔄 adapters/             # RAG system adapters
│   ├── dual_rag_adapter.py          # Dual RAG implementation
│   └── triple_rag_schema_adapter.py # Triple RAG schema mapping
├── 📊 analytics/            # Document analytics
├── 🗄️ storage/             # Vector storage systems
│   ├── hybrid_vector_manager.py     # Multi-backend storage
│   ├── local_vector_library.py      # Local document ownership
│   └── pgvector_library.py          # PostgreSQL vector operations
├── 🤖 agents/              # AI agent implementations
├── 🔍 visualization/       # Data visualization tools
└── 🔌 integrations/        # External service integrations
```

#### **Quinuple RAG Architecture**

**Active Configuration**:

1. **🎯 OpenAI Vector Store** (Primary) - 2,426+ files powering Prometheus AI
2. **📊 Xata Database** (Primary) - 230,998+ structured records with vector search
3. **☁️ Upstash Vector** (Secondary) - Cloud-based vector search
4. **💾 Local FAISS** (Secondary) - Local vector storage and offline capability
5. **🗄️ PostgreSQL + pgvector** (Secondary) - Advanced vector operations

**Features**:

- **Intelligent tier ranking** - OpenAI + Xata as primary sources
- **Unified search orchestration** across all 5 layers
- **Cross-system result merging** with priority-based scoring
- **Comprehensive knowledge access** to 233,932+ total searchable items
- **Environment-based configuration** and graceful fallback handling

#### **Key Components**

**📡 API Server (`api_server.py`)**

- **FastAPI endpoints** for document processing
- **RAG search** with multi-backend support
- **Health monitoring** and system status
- **Backward compatibility** with existing integrations

**🎛️ User Interfaces**

- **`streamlit_app.py`** - Interactive dashboard with bulk import
- **`cli.py`** - Command-line interface with Charm tools
- **`knowledge_base_ui.py`** - Knowledge base management

**📊 Document Processing**

- **Bulk folder ingestion** with multi-format support (PDF, TXT, DOCX, MD, RTF)
- **Text extraction** with PyMuPDF/PyPDF2
- **Parallel processing** across Triple RAG backends
- **Comprehensive error handling** and progress tracking

#### **AI Agent System (`/agents/`)**

- **Historical Timeline Analyst** - Chronological event organization
- **Claims & Evidence Evaluator** - Testimony credibility assessment
- **Research Network Mapper** - Entity relationship discovery
- **Documentation Librarian** - Document curation and organization
- **Geospatial Analyst** - Location-based pattern analysis

#### **Database Migration**

- **PostgreSQL Wire-Enabled**: 230,998+ records imported
- **Vector Support**: 1536-dimension embeddings with pgvector
- **Migration Scripts**: Complete import/export infrastructure
- **Data Integrity**: ON CONFLICT resolution and validation

### 📝 Research Canvas (`/apps/research-canvas/`)

**Purpose**: TipTap-based research editor with RAG-powered content generation

#### **Editor System**

```
📁 src/
├── 📄 components/          # Research interface components
│   ├── evidence-browser.tsx        # Document search interface
│   ├── knowledge-base-browser.tsx  # 448+ document collection
│   ├── classification-banner.tsx   # Security classification UI
│   └── terminal-display.tsx        # Terminal-style interface
├── 🪝 hooks/              # Editor-specific hooks
│   ├── use-rag-commands.ts         # RAG command integration
│   ├── use-tiptap-editor.ts        # Editor configuration
│   └── use-knowledge-base.ts       # Knowledge base integration
├── 📚 lib/                # TipTap utilities
└── 🎨 styles/             # SCSS styling
```

#### **AI-Enhanced Features**

- **RAG Commands**: Generate, Summarize, Fact Check
- **Smart Mentions**: AI-powered search suggestions with source badges
- **Document Search**: Semantic search across knowledge base
- **Real-time Collaboration**: Multi-user editing sessions
- **Citation System**: Automatic source attribution

---

## 📦 Shared Packages (`/packages/`)

### 🗄️ Database Package (`/packages/db/`)

**Purpose**: Xata integration and database models for UFO/UAP research entities

#### **Xata Integration (`/xata/`)**

```
📁 xata/
├── 📊 models/              # Database entity models (29 models)
├── 🔧 api/                 # Database API utilities
│   ├── ask.ts                      # Xata Ask SDK integration
│   ├── search.ts                   # Full-text search utilities
│   ├── xata-to-xyflow.ts          # Mindmap data conversion
│   └── xyflow-integration.ts      # Graph integration
├── 🔌 client.ts           # Xata client configuration
└── 📝 xata.ts             # Generated Xata types
```

#### **Core Entity Models (`/xata/models/`)**

**Primary Research Entities**:

- **`events.ts`** - UFO/UAP events and incidents (2,521 records)
- **`testimonies.ts`** - Witness accounts and statements (890 records)
- **`personnel.ts`** - Key figures and whistleblowers (465 records)
- **`organizations.ts`** - Government agencies and groups (200 records)
- **`locations.ts`** - Geographic sighting data (69,680 records)
- **`documents.ts`** - Official documents and reports (14,255 records)
- **`topics.ts`** - Research categories and themes (455 records)
- **`artifacts.ts`** - Physical evidence and photos (180 records)

**Relationship Entities**:

- **`event-subject-matter-experts.ts`** - Event-personnel connections
- **`topics-testimonies.ts`** - Topic-testimony associations
- **`organization-members.ts`** - Organization membership records
- **`user-saved-*.ts`** - User collection management

**Advanced Features**:

- **Vector embeddings** with 1536-dimension OpenAI embeddings
- **Full-text search** with fuzziness and prefix matching
- **Geospatial queries** with radius-based filtering
- **Comprehensive CRUD operations** with error handling

### 🤖 AI Package (`/packages/ai/`)

**Purpose**: AI processing components and external service integrations

#### **Processing Pipelines (`/components/`)**

```
📁 components/
├── 📄 document-processing.tsx  # Document analysis workflows
├── 🔍 document-search.tsx      # AI-powered search interfaces
├── 📊 ai-insights.tsx          # Intelligence extraction
├── 📤 upload-zone.tsx          # File upload with processing
└── 🧵 thread.tsx              # Conversation management
```

#### **External Integrations (`/integrations/`)**

- **`exa/`** - EXA search integration with research workflows
- **`firecrawl.ts`** - Web scraping service for content extraction
- **`tavily.ts`** - Research API integration
- **`screenshot/`** - Visual content capture and analysis
- **`twilio/`** - SMS integration for notifications

#### **Prometheus AI System (`/prometheus/`)**

- **Advanced document analysis** with multi-model processing
- **Content validation** and fact-checking
- **Research methodology** integration
- **Custom UI components** for AI interactions

### 🔧 Services Package (`/packages/services/`)

**Purpose**: External service clients and deep research capabilities

#### **Service Integrations**

- **`exa/`** - Search and content discovery APIs
- **`firecrawl/`** - Web content extraction and processing
- **`deep-research/`** - Advanced research workflow orchestration

### 📚 Knowledge Base (`/packages/knowledge-base/`)

**Purpose**: Document management and processing for UFO/UAP research

#### **Document Collections (`/files/`)**

```
📁 files/
├── 📄 CIA-RDP96-*.pdf      # CIA remote viewing documents
├── 📝 DON-NAVY-*.pdf       # Navy UAP reports
├── 📊 UAP-*.pdf            # UAP analysis reports
├── 🗂️ markdown/           # Processed markdown files
└── 📼 transcripts/         # Video/audio transcriptions
```

#### **Processing Infrastructure**

- **`python/`** - Document processing scripts with vector storage
- **`vector_storage/`** - Vector database utilities and queries
- **`metadata/`** - Document metadata and indexing systems

#### **Transcript Collection (`/transcripts/`)**

Organized by date with comprehensive UFO/UAP content:

- **2024-08-05/** - Disclosure Project testimonies
- **2024-12-07/** - Recent UAP developments
- **2025-01-31/** - Latest whistleblower accounts

---

## 📚 Documentation (`/docs/`)

### **Project Documentation**

- **`CLAUDE.md`** - AI assistant instructions and project guidelines
- **`docs/INDEX.md`** - Documentation navigation index
- **`docs/DOCUMENTATION_ORGANIZATION_PLAN.md`** - Documentation structure guide

### **Agent Configuration (`/docs/agents/`)**

- **`docs/agents/AGENT_ONBOARDING_CHECKLIST.md`** - Validation checklist for new agents
- **`docs/agents/sessions/`** - Session management and resumption guides

### **Feature Planning (`/docs/plans/`)**

- **`docs/plans/FEATURES.md`** - Strategic feature concepts and architectural decisions
- **`docs/plans/TODO.md`** - Ready-to-implement tasks with clear success criteria
- **`docs/plans/app/`** - Main application planning documents
- **`docs/plans/features/`** - Feature-specific specifications and plans

### **Research & Methodology (`/docs/research/`)**

- **`docs/research/RESEARCH_QUEUE.md`** - Research task prioritization

### **Work Logs (`/docs/work_logs/`)**

- **Recent development sessions and implementation logs**
- **Progress tracking and decision documentation**

### **AI Prompts (`/docs/prompts/`)**

- **Agent system instructions and prompt templates**
- **Research methodology prompts and configurations**

---

## 🗂️ Agent Documentation (`/disclosure-agentic-research-documentation/`)

### **AI Agent Implementation Guides**

- **`ufo-implementation-guide.md`** - Agent development methodology
- **`ufo-research-orchestration.md`** - Multi-agent coordination patterns
- **`enhanced-ufo-orchestration-v4.md`** - Advanced orchestration strategies
- **`ultra-advanced-ufo-system-5.0.md`** - Next-generation AI system architecture

---

## 📄 Root Documentation Files

### **Project Overview**

- **`README.md`** - Main project introduction and vision
- **`TODO.md`** - Development task tracking (85 active tasks)
- **`TECH_STACK.md`** - Comprehensive technology documentation
- **`PRD.txt`** - Product requirements and specifications

### **Development Guides**

- **`CLAUDE.md`** - Global AI assistant configuration
- **`AGENTS.md`** - AI agent documentation and patterns
- **`REUSABLE_CODE_MAP.md`** - Code reusability and patterns

### **Implementation Documentation**

- **`TIPTAP_AI_RAG_INTEGRATION_PLAN_V2.md`** - Editor AI integration strategy
- **`FIRE_ENRICH_ARCHITECTURE_ANALYSIS.md`** - System architecture analysis
- **`DATABASE_SYNC_AGENT_TASKS.md`** - Database synchronization workflows

### **Work Logs (Recent Sessions)**

- **`WORK_LOG_2025-07-13_*.md`** - Prompt system enhancement
- **`WORK_LOG_2025-07-12_*.md`** - Universal agent tools implementation
- **`WORK_LOG_2025-07-11_*.md`** - Smart tour integration completion
- **`WORK_LOG_2025-06-29.md`** - RAG integration work session

---

## 🎯 Navigation Guide

### **For Feature Development**

```bash
# Core mindmap system
/apps/app/src/features/mindmap/

# 3D visualizations
/apps/app/src/features/3d/

# Research workflows
/apps/app/src/components/research/

# AI integration
/apps/app/src/features/ai/
```

### **For RAG System Development**

```bash
# Triple RAG adapters
/apps/disclosure-rag/lib/adapters/

# AI agents
/apps/disclosure-rag/agents/

# API server
/apps/disclosure-rag/api_server.py

# Document processing
/apps/disclosure-rag/scripts/
```

### **For Database Development**

```bash
# Entity models
/packages/db/xata/models/

# Database utilities
/packages/db/xata/api/

# Data exports
/apps/app/scripts/xata-exports/
```

### **For Documentation**

```bash
# Current tasks
/TODO.md

# Architecture guides
/docs/feature-planning/

# AI agent documentation
/disclosure-agentic-research-documentation/

# Implementation plans
/TIPTAP_AI_RAG_INTEGRATION_PLAN_V2.md
```

---

## 📊 Project Metrics

**Codebase Statistics**:

- **Total Files**: 500+ source files
- **Applications**: 3 (main app, RAG system, research canvas)
- **Packages**: 5 (db, ai, services, knowledge-base)
- **Database Records**: 230,998+ across 29 entity types
- **Documentation Files**: 30+ comprehensive guides

**Feature Completion**:

- **✅ Triple RAG Integration**: Complete with 85% schema compatibility
- **✅ Smart Tour Phase 1**: Enhanced nodes with 85% AI connectivity
- **✅ PostgreSQL Migration**: Wire-enabled database with full import
- **🔄 Research Canvas**: In development with spatial intelligence
- **🔄 Guided Tours**: Phase 2 spatial integration in progress

**Technology Adoption**:

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Python 3.9+, FastAPI, LangChain
- **Database**: Xata (PostgreSQL), pgvector, multiple vector stores
- **AI**: OpenAI, Anthropic, Groq, local LLM support
- **3D/Visualization**: Three.js, D3.js, WebGL

---

*This structure document serves as the definitive guide for navigating the Ultraterrestrial Resurrection codebase. For specific implementation details, refer to the individual component documentation and work logs.*
