# Codebase Structure Deep Dive

## Applications Layer

### apps/app/ - Main Research Platform
**Purpose**: Primary Next.js application for UFO/UAP research platform

#### Core Directory Structure
```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Authentication routes
│   ├── (site)/         # Public site routes
│   ├── api/            # API endpoints
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components (50+ categories)
├── features/           # Feature modules (10+ major features)
├── hooks/              # Custom React hooks (30+ hooks)
├── lib/                # Utility libraries
├── styles/             # SCSS stylesheets
└── utils/              # Helper utilities
```

#### Key Features
- **Mindmap System**: Enhanced nodes with smart badge system, spatial grouping, guided tours
- **3D Visualizations**: Globe connections, timeline journeys, entity networks, UFO models
- **AI Integration**: Chat interfaces, document processing, knowledge graph, multi-LLM support
- **Data Visualization**: Sightings globe, heat maps, geospatial correlation, interactive timelines
- **Case Files**: Evidence browser, document annotations, investigation workflows

#### Technology Integration
- Next.js 15.3.5 with React 19.1.0
- Tailwind CSS 4.1.11 with Radix UI
- Three.js, React Three Fiber, D3.js
- Zustand, React Context for state
- Liveblocks, PartySocket for real-time

### apps/disclosure-rag/ - Python RAG System
**Purpose**: Advanced document processing and retrieval-augmented generation

#### Core Architecture
```
lib/
├── adapters/           # RAG system adapters
├── analytics/          # Document analytics
├── storage/            # Vector storage systems
├── agents/             # AI agent implementations
├── visualization/      # Data visualization tools
└── integrations/       # External service integrations
```

#### Quinuple RAG Architecture
1. **OpenAI Vector Store** (Primary) - 2,426+ files powering Prometheus AI
2. **Xata Database** (Primary) - 230,998+ structured records with vector search
3. **Upstash Vector** (Secondary) - Cloud-based vector search
4. **Local FAISS** (Secondary) - Local vector storage, offline capability
5. **PostgreSQL + pgvector** (Secondary) - Advanced vector operations

#### Key Components
- **API Server**: FastAPI endpoints for document processing
- **User Interfaces**: Streamlit dashboard, CLI, knowledge base management
- **Document Processing**: Multi-format support, text extraction, parallel processing
- **AI Agents**: Historical analysis, claims evaluation, network mapping, documentation curation

### apps/research-canvas/ - TipTap Editor
**Purpose**: TipTap-based research editor with RAG-powered content generation

#### Features
- **RAG Commands**: Generate, Summarize, Fact Check
- **Smart Mentions**: AI-powered search suggestions with source badges
- **Document Search**: Semantic search across knowledge base
- **Real-time Collaboration**: Multi-user editing sessions
- **Citation System**: Automatic source attribution

## Packages Layer

### packages/db/ - Database Integration
**Purpose**: Xata integration and database models for UFO/UAP research

#### Xata Integration Structure
```
xata/
├── models/             # Database entity models (29 models)
├── api/                # Database API utilities
├── client.ts           # Xata client configuration
└── xata.ts            # Generated Xata types
```

#### Core Entity Models
- **Primary Research**: Events (2,521), Testimonies (890), Personnel (465), Organizations (200)
- **Data Points**: Locations (69,680), Documents (14,255), Topics (455), Artifacts (180)
- **Relationships**: Event-personnel connections, topic associations, organization membership
- **User Management**: Saved collections, user preferences

#### Advanced Features
- Vector embeddings with 1536-dimension OpenAI embeddings
- Full-text search with fuzziness and prefix matching
- Geospatial queries with radius-based filtering
- Comprehensive CRUD operations with error handling

### packages/ai/ - AI Processing
**Purpose**: AI processing components and external service integrations

#### Components
- **Document Processing**: Analysis workflows, search interfaces, insights extraction
- **External Integrations**: EXA search, Firecrawl scraping, Tavily research, screenshot analysis
- **Prometheus AI**: Advanced document analysis, content validation, research methodology

### packages/services/ - Service Integrations
**Purpose**: External service clients and deep research capabilities

#### Integrations
- **EXA**: Search and content discovery APIs
- **Firecrawl**: Web content extraction and processing
- **Deep Research**: Advanced workflow orchestration

### packages/knowledge-base/ - Document Management
**Purpose**: Document management and processing for UFO/UAP research

#### Structure
```
sources/
├── files/              # Document collections (CIA, Navy, UAP reports)
├── transcripts/        # Video/audio transcriptions by date
├── python/             # Document processing scripts
├── vector_storage/     # Vector database utilities
└── metadata/           # Document metadata and indexing
```

## Documentation Layer

### docs/ - Project Documentation
- **Feature Planning**: Disclosure research canvas, ranking system
- **Code Quality**: Component audit reports, Storybook coverage analysis
- **Integration Plans**: Database strategy, system architecture

### Root Documentation Files
- **Project Overview**: README.md, TODO.md (85 active tasks), TECH_STACK.md
- **Development Guides**: CLAUDE.md, AGENTS.md, REUSABLE_CODE_MAP.md
- **Implementation Docs**: Integration plans, architecture analysis, sync workflows
- **Work Logs**: Recent session documentation with timestamps

## Import Patterns and Relationships

### Frontend Import Hierarchy
```tsx
// Database layer
import {XataClient} from '@db/xata'
import {askXata, searchXata} from '@db/xata/api'

// AI features
import {EnhancedEntityNodePOC} from '@/features/mindmap/nodes/enhanced-node-poc'
import {useSpatialGrouping} from '@/features/mindmap/hooks/use-spatial-grouping'
import {Prometheus} from '@/features/agents/prometheus'

// Cross-package
import {AIComponent} from '@repo/ai'
import {DataVizComponent} from '@/features/data-viz'
```

### Python Import Patterns
```python
# Core dependencies
from dotenv import load_dotenv
import openai, anthropic, streamlit

# Local modules
from lib.adapters.dual_rag_adapter import DualRAGAdapter
from agents.content_analysis_agent import ContentAnalysisAgent
from lib.storage.hybrid_vector_manager import HybridVectorManager
```

## Critical Architectural Patterns

### Feature-First Organization
- Group related functionality together
- Enhanced Nodes serve as common UI layer across ALL features
- Contextual Intelligence powers smart badges, filtering, suggestions
- Spatial Intelligence builds on contextual intelligence foundation

### AI Integration Hierarchy
1. **Contextual Intelligence** (✅ Complete) - Foundation for all AI features
2. **Spatial Intelligence** (✅ Complete) - R-Tree indexing, proximity analysis
3. **Enhanced Nodes** (✅ Complete) - Common UI layer used by ALL systems
4. **Smart Tours** (✅ 85% Complete) - Historical narrative progression
5. **Agentic Tours** (📋 Planning) - Natural language tour control

### Data Flow Architecture
```
Frontend (Next.js) ↔ Xata Database (230K+ records)
                   ↔ RAG System (Python)
                   ↔ Vector Stores (5 backends)
                   ↔ AI Services (OpenAI, Anthropic, Groq)
```

## Development Workflow Integration

### Component Development Flow
1. Use `bun run new` for generation → Storybook development → Integration testing
2. Follow PascalCase/kebab-case conventions → TypeScript types → Enhanced Nodes
3. Leverage existing patterns → Contextual Intelligence → Spatial grouping

### Database Development Flow
1. Xata schema updates → `xata codegen` → Type generation
2. Test contextual intelligence → Compatibility validation → 230K+ record integrity

### AI Integration Flow
1. Build on Contextual Intelligence → Prometheus AI integration → Enhanced Nodes consistency
2. Spatial intelligence patterns → Vector storage → Multi-backend coordination