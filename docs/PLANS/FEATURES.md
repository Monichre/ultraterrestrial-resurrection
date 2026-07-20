---
status: live
role: product
spine: want
updated: 2026-07-19
---

# Feature Planning & High-Level Ideas

**Purpose**: Collaborative space for high-level feature concepts, architectural decisions, and strategic planning before they become actionable tickets.

**Last Updated**: 2026-06-20  
**Contributors**: Liam Ellis, Claude Code  
**Project**: Ultraterrestrial Resurrection - UFO/UAP Research Platform

---

## 🌟 Strategic Vision

**Mission**: Create the definitive interactive platform for UFO/UAP research, combining historical documentation, real-time disclosure tracking, AI-powered analysis, and immersive 3D visualizations.

**Core User Journey**:

1. **Discovery** → Interactive mindmap with AI-enhanced nodes
2. **Investigation** → Research Canvas with contextual intelligence
3. **Documentation** → Persistent research sessions with evidence tracking
4. **Narrative** → Guided historical tours with spatial intelligence

**Technical Philosophy**: "Orchestration over Replacement" - enhance the 1 working end-to-end AI path (disclosure/mindmap) rather than rebuilding. See AGENTS.md for grounded reality: only one AI path is fully operational in the Next.js app.

---

## 🎯 Current Focus Areas

### **1. External Web Resources RAG Integration** ⭐ **Priority 1**

**Vision**: Transform Prometheus AI into comprehensive UFO/UAP research platform with access to 90+ specialized external websites.

**Core Concept**: Use Firecrawl to pre-ingest external content → local search instead of slow real-time scraping. The Exa `searchExternalResources` tool already works in both active routes.

**Key Components**:

- **Content Pipeline**: Background crawling with quality filtering
- **Tool Architecture**: Formalize existing capabilities as Prometheus tools (searchUAP, searchDatabase, searchDocuments, searchWebResources, processDocument)
- **Integration**: Leverage existing Contextual Intelligence for orchestration

**Status**: ⚠️ ASPIRATIONAL — not yet built. The Exa real-time search tool exists in both active routes. Full pre-ingestion pipeline (Firecrawl → local vector store) has not been implemented.
**Decision**: Use tool-wrapper approach to enhance the working AI paths
**Notes**: The old "Triple RAG (40/40/20 Upstash/FAISS/Postgres split)" design is SCRAPPED — that was the Python RAG system which is completely disconnected from the Next.js app. The Next.js app uses OpenAI file_search + Postgres FTS/trgm only.
**Reference**: See `docs/plans/features/prometheus/PROMETHEUS_REQUIREMENTS_ANALYSIS.md` for detailed technical approach

---

### **2. Database Infrastructure Modernization** ✅ **COMPLETE (SP1-SP4)**

**Vision**: Full migration from Xata to Neon Postgres 17.10 + pgvector 0.8.0.

**Migration Status: COMPLETE (2026-06)**

What was actually done (SP1–SP4):

- **SP1**: Schema DDL (`0001_init.sql`) — 29 tables, vector(1536), FTS, trgm indexes — loaded and verified on Neon
- **SP2**: Re-ingestion pipeline — 189 docs / 4,946 document chunks / 1,405 entity embeddings live (text-embedding-3-small @ 1536 dims)
- **SP3**: App `@db` data-layer cutover — ~25 call sites migrated from `@db/xata` to `@db/postgres`. `@db/xata` is now **retired**.
- **SP4**: ufo-ui cherry-pick (`NetworkTimelineExplorer`) complete

**Live state**: 230,998 records across 29 tables. Neon Postgres 17.10 + pgvector 0.8.0 is the sole database. `DATABASE_URL` lives in `packages/db/.env`.

**`@db/postgres`** is the ONLY import to use. `@db/xata` is retired — do not reference it.

---

### **3. Prometheus API Consolidation** ⭐ **Priority 3**

**Vision**: Eliminate redundancy across 5+ API endpoints, create coherent unified API architecture.

**Problem**: Multiple overlapping endpoints with mock/stubbed implementations

- `@apps/app/src/app/api/disclosure/chat/` - RAG chat interface (sophisticated, keep)
- `@apps/app/src/app/api/disclosure/mindmap/` - Mindmap entity extraction (has mocks)
- `@apps/app/src/app/api/historical-query/` - Historical data queries (redundant)
- `@apps/app/src/app/api/mindmap/records/` - Record management (redundant)
- `@apps/app/src/app/api/prometheus/chat/` - Core Prometheus chat (consolidate)

**Proposed Unified Structure**:

```
/api/prometheus/
├── chat/          # Core chat functionality (enhanced)
├── search/        # Unified search (consolidates historical-query + mindmap/records)
├── entities/      # Real NER extraction (replaces fake implementations)
└── rag/           # External + internal RAG coordination
```

**Solution**: Unified `/api/prometheus/` structure with real implementations
**Decision**: Keep domain-specific endpoints (disclosure/chat) separate, consolidate generic functionality
**Notes**: Replace fake NER with sophisticated implementations from disclosure/chat
**Reference**: Current implementation detailed in `DAILY_WORK_PLAN.md` Day 3

---

### **4. Unified Mindmap Experience Architecture** 🎯 **Priority 4**

**Vision**: Consolidate mindmap functionality into single coherent experience with enhanced state management and real-time collaboration.

**Current State**: Fragmented mindmap components across multiple contexts with inconsistent state management

**Unified Architecture**:

- **Foundation API**: Single source of truth for mindmap data
- **State Management**: Centralized Zustand store with real-time synchronization  
- **Enhanced Nodes**: All mindmap nodes use `enhancedEntityNodePOC` consistently
- **Spatial Intelligence**: Integrated proximity analysis and contextual grouping
- **Tour Integration**: Seamless connection between exploration and guided narratives

**Key Components**:

- Unified API endpoints for all mindmap operations
- Real-time collaboration via Liveblocks integration
- Enhanced state persistence and session restoration
- Contextual intelligence for smart relationship detection

**Benefits**: Consistent user experience, reduced maintenance overhead, enhanced performance
**Reference**: Extracted from Todo2 architecture foundation (T-10)

---

### **5. Research Canvas Integration as Contextual Panel** 📝 **Priority 5**

**Vision**: Transform research canvas from standalone component to integrated contextual panel within mindmap workflow.

**Integration Strategy**:

- **Panel Architecture**: Slide-out contextual panel triggered by mindmap interactions
- **TipTap Enhancement**: Advanced research editor with AI-powered assistance
- **Session Management**: Automatic research session creation from spatial grouping
- **Evidence Tracking**: Persistent evidence collection linked to mindmap entities

**Key Features**:

- Seamless transition from mindmap discovery to research documentation
- AI-powered research assistance with RAG integration
- Real-time collaboration on research sessions
- Evidence citation and relationship tracking

**User Journey**: Mindmap Discovery → Contextual Research Panel → Session Documentation → Evidence Validation
**Reference**: Extracted from Todo2 integration concept (T-11)

---

### **6. 3D Visualization Spatial Integration** 🌐 **Priority 6**

**Vision**: Advanced 3D globe visualization with spatial intelligence for geographic UAP incident mapping and temporal analysis.

**Current State**: Basic 3D components exist but lack integration with spatial intelligence and mindmap systems

**Enhanced Architecture**:

- **Globe Integration**: Three.js globe with incident location mapping
- **Spatial Intelligence**: Integration with existing `useSpatialGrouping` for geographic clustering
- **Temporal Analysis**: Time-based incident visualization and pattern recognition
- **Interactive Navigation**: Seamless zoom from global view to local incident details

**Technical Requirements**:

- Enhanced Three.js globe with performance optimization
- Spatial indexing for efficient geographic queries
- Integration with existing mindmap spatial intelligence
- Real-time updates for collaborative exploration

**User Stories**:

- "Show me all UFO incidents within 100 miles of Area 51"
- "Display the temporal progression of disclosure events globally"
- "Find geographic clusters of similar incident types"

**Reference**: Extracted from Todo2 3D visualization concept (T-13)

---

### **7. Workspace-Wide Prompts System** 🔄 **Priority 7**

**Vision**: Centralized prompts management shared across apps/app and apps/disclosure-rag.

**Current State**: Scattered prompts in various files, inconsistent management

- `src/services/ai/prompts/daedalus.prompt.ts` - Research assistant system prompt
- OpenAI Assistant prompts (asst_sdNxYC9p05iGpeKXtL496cyh)
- Various feature-specific prompts in AI services

**Target Architecture**: `@repo/prompts` workspace package

```
packages/prompts/
├── system/          # Core system prompts
├── research/        # Research and analysis prompts
├── extraction/      # Entity and data extraction prompts
├── generation/      # Content generation prompts
└── templates/       # Reusable prompt templates
```

**Features**: Versioning, A/B testing, dynamic parameter injection, environment variations
**Integration**: TypeScript interfaces, template engine, cross-package sharing
**Benefits**: Consistency, version control, performance optimization through caching
**Reference**: Detailed in `DAILY_WORK_PLAN.md` Day 4

---

## 🌟 Emerging Ideas & Future Concepts

### **Natural Language Tours (Agentic Tours)** 🎙️ **Post-MVP**

> ⚠️ **SCRAPPED (as of 2026-03-29 roundtable)**: The multi-agent tour orchestrator (6 agent classes specced July 2025) was scrapped — **zero code was ever written**. Do not plan against this architecture. See `docs/plans/2026-03-29-documentation-roundtable-report.md`.

**Idea**: Voice/text-controlled tour navigation - "Take me to the Roswell connection" or "Show me government involvement"
**Dependencies**: Enhanced Nodes, Contextual Intelligence (both exist), working AI agent path
**Technical Requirements**: Advanced NLP, tour state management, natural language understanding
**User Stories**:

- "Show me all government officials connected to Roswell"
- "Take me through the Pentagon UFO disclosure timeline"
- "Find connections between Bob Lazar and Area 51"
**Complexity**: High - requires building on the working disclosure/mindmap agent path
**Timeline**: Future (blocked on UX hardening and state management work first)

### **UFO Research Methodology Framework** 🔬 **Future Phase**

**Idea**: Develop systematic approach to UFO/UAP research based on famous researchers' methodologies (Jacques Vallée, Diana Pasulka Walsh, etc.)

**Research Framework Components**:

- **Vallée Classification System**: Standardized incident categorization and analysis
- **Evidence Evaluation**: Multi-dimensional credibility assessment inspired by scientific methodology
- **Source Verification**: Academic standards for witness testimony and document authentication
- **Pattern Analysis**: Statistical approaches to identifying meaningful correlations
- **Historical Context**: Temporal relationship mapping and sociocultural analysis

**Implementation Strategy**:

- Research methodologies database with tagged approaches
- AI-powered analysis scoring based on established frameworks
- Template-driven investigation workflows
- Cross-reference validation using multiple researcher perspectives

**Value Proposition**: Brings academic rigor to UFO research, provides structured investigation paths
**Timeline**: Future phase (requires extensive research methodology analysis)

### **Performance Optimization and Caching** ⚡ **Architecture Enhancement**

**Vision**: Comprehensive performance optimization with intelligent caching and web worker integration.

**Optimization Areas**:

- **Smart Caching**: Multi-layer caching strategy for database queries, RAG results, and API responses
- **Web Workers**: Background processing for heavy computational tasks
- **Bundle Optimization**: Code splitting and lazy loading for improved initial load times
- **Database Indexing**: Advanced indexing strategies for complex spatial and temporal queries

**Performance Targets**:

- Sub-2s response times for all core operations
- 99.9% uptime with graceful degradation
- Efficient memory usage for large dataset operations
- Real-time collaboration without performance impact

**Reference**: Extracted from Todo2 performance optimization (T-16)

### **AI-Driven Research Insights** 🧠 **Future Phase**

**Idea**: Proactive pattern detection across research sessions - "Users researching X also discover Y"
**Components**:

- Session analytics and user behavior tracking
- Pattern recognition across research paths
- Collaborative filtering recommendation engine
- Anomaly detection for unusual connections
**Value Proposition**: Discovery acceleration, hidden connection identification, research community insights
**Technical**: Machine learning models, graph analysis, behavioral analytics
**Timeline**: Future phase (requires sufficient user data)

### **Multi-Modal Research** 📹 **Advanced Feature**

**Idea**: Comprehensive media analysis integration with text-based research
**Capabilities**:

- **Document Image OCR**: Extract text from declassified documents, witness sketches
- **Video Analysis**: Testimony analysis, object detection in footage, temporal analysis
- **Audio Processing**: Interview transcription, voice analysis, audio enhancement
- **Cross-Modal Search**: "Find videos mentioning entities from this document"
**Technical Stack**: Computer vision (OpenCV, YOLO), speech-to-text (Whisper), multi-modal embeddings (CLIP)
**Integration**: Extend the live FTS + pgvector search paths (`searchDatabase` in both active routes) with multi-modal vector storage; embeddings use `text-embedding-3-small` @ 1536 dims via `@db/postgres`. Note: there is no "Triple RAG" — the Next.js app has two search paths (OpenAI file_search + Postgres FTS/pgvector), not three.
**Timeline**: Advanced feature (requires significant ML infrastructure)

### **Collaborative Investigation Workspaces** 👥 **Future Vision**

**Idea**: Multi-user investigation environments with real-time collaboration
**Features**:

- Shared research sessions with live cursors
- Collaborative annotation and evidence tagging
- Group discussions threaded to specific evidence
- Peer review and verification workflows
**Technical**: WebRTC for real-time, operational transforms for collaborative editing
**Dependencies**: User authentication system, advanced permissions model
**Timeline**: Long-term (requires mature platform and user base)

### **AR/VR Historical Recreation** 🥽 **Visionary**

**Idea**: Immersive experiences recreating historical UFO events in AR/VR
**Use Cases**:

- VR recreation of Roswell crash site with testimony overlay
- AR visualization of UFO sightings in user's current location
- 3D reconstruction of declassified incidents
**Technical**: WebXR, 3D modeling, spatial computing, location-based services
**Timeline**: Visionary (requires significant 3D content creation and specialized hardware adoption)

---

## 🏗️ Architectural Decisions Log

### **Decision 1: Tool-Based Architecture Approach**

**Date**: August 9, 2025  
**Context**: External RAG integration strategy  
**Decision**: Wrap existing capabilities as formal Prometheus tools rather than rebuild
**Rationale**: Preserves the working AI paths (disclosure/mindmap + prometheus/chat), enables incremental enhancement without rebuilding
**Impact**: Low risk, high compatibility, leverages existing Contextual Intelligence
**Status**: ✅ Approved - Implementation ready

### **Decision 2: Firecrawl Pre-Ingestion Strategy**

**Date**: August 9, 2025  
**Context**: External web resources access method  
**Decision**: Pre-ingest content to local vector store vs real-time scraping
**Rationale**: Fast search but slow integration solved by local storage
**Impact**: Fast responses, reliable performance, respects external sites
**Technical Details**: Background crawling → local storage → fast local search
**Status**: ⚠️ ASPIRATIONAL — not implemented. The "Triple RAG (40/40/20 Upstash/FAISS/Postgres split)" design is **SCRAPPED** — that was the Python RAG system (`apps/disclosure-rag/`) which is completely disconnected from the Next.js app. The Next.js app uses only OpenAI file_search + Postgres FTS/trgm.

### **Decision 3: API Consolidation Boundaries**  

**Date**: August 9, 2025  
**Context**: Which APIs to consolidate vs keep separate
**Decision**: Consolidate generic functionality, preserve domain-specific endpoints
**Rationale**: disclosure/chat has sophisticated implementations worth preserving
**Impact**: Reduces redundancy while maintaining working sophisticated features
**Preserved**: `disclosure/chat` (sophisticated NER), domain-specific functionality
**Consolidated**: Generic search, entity extraction, historical queries
**Status**: ✅ Approved - Implementation plan in DAILY_WORK_PLAN.md

### **Decision 4: Three-Tier Project Management**

**Date**: August 9, 2025
**Context**: Project management workflow optimization
**Decision**: FEATURES.md (strategic) → TODO.md (actionable) → DAILY_WORK_PLAN.md (tactical)
**Rationale**: Prevents overwhelm, natural feature maturation flow, clear boundaries
**Impact**: Improved focus, better planning, reduced context switching
**Status**: ✅ Implemented - Active use

### **Decision 5: Monorepo Workspace Architecture**

**Context**: Shared code and cross-package dependencies
**Decision**: Maintain existing workspace structure with new `@repo/prompts` package
**Rationale**: Established patterns work well, centralized prompts solve consistency issues
**Packages**: `@db`, `@ai`, `@knowledge-base`, `@prompts` (new)
**Status**: ✅ Approved - Prompts package implementation planned

### **Decision 6: Research Canvas Integration Approach**

**Context**: Standalone research-canvas app vs integrated features
**Decision**: Consolidate TipTap components into main app, deprecate standalone
**Rationale**: Reduces maintenance overhead, improves user experience continuity
**Migration**: `@apps/research-canvas/` → `@apps/app/src/features/research-canvas/`
**Status**: 🔄 In Progress - Referenced in TODO.md

### Decision 7: Postgres + pgvector as sole database (SP1-SP4 Complete)

**Date**: June 2026
**Decision**: Full migration from Xata to Neon Postgres 17.10 + pgvector 0.8.0. @db/xata retired.
**Status**: ✅ COMPLETE — 230,998 records, 29 tables, 1,405 entity embeddings + 4,946 doc chunks live.

### Decision 8: Docs six-question spine + aggressive prune (2026-07-19)

**Date**: 2026-07-19
**Context**: `docs/` had ~24MB of prototypes, moodboards, stale indexes, and missing `docs/agents/` paths.
**Decision**: Restructure around six navigation questions (exists → where → how → want → do → start). Living canon ~22 files. `docs/README.md` is the only index. Agent intake moves to `docs/ops/`. Prototypes/binaries → `docs/archive/` or deleted. Prompts/personas stay in `packages/ai/`.
**Impact**: ~85% size reduction (24MB → ~3.5MB). CLAUDE/AGENTS paths fixed. Canvas: `docs-root-and-prune`.
**Status**: ✅ Implemented on branch `docs/root-and-prune`

---

## 🔄 Implementation Flow

**Feature Journey**: FEATURES.md (concepts) → TODO.md (actionable tickets) → DAILY_WORK_PLAN.md (current execution)

### **Criteria for Moving Features to TODO.md**

1. ✅ Technical approach decided and documented
2. ✅ Dependencies identified and resolved
3. ✅ Success criteria clearly defined
4. ✅ Timeline estimated with confidence
5. ✅ Implementation files identified
6. ✅ Architectural decisions logged
7. ✅ Integration points mapped to existing systems

### **Criteria for Moving to DAILY_WORK_PLAN.md**

1. ✅ Feature broken into specific tasks (2-4 hour chunks)
2. ✅ Required immediate execution within current sprint
3. ✅ Dependencies resolved or scheduled
4. ✅ Resources allocated and available
5. ✅ Success metrics and validation criteria defined
6. ✅ Risk mitigation strategies identified

### **Feature Maturation Status**

- **External Web RAG**: ✅ Live through the shared Exa research tool; further work belongs in Linear
- **API Consolidation**: ✅ Two live paths with shared DB/Exa tools; OpenAI Assistants boundary documented
- **Prompts System**: ✅ Shared epistemic guidance and frontier fallback implemented; further work belongs in Linear
- **Deep Research**: 🔄 Needs technical approach refinement
- **Natural Language Tours**: ⛔ SCRAPPED — multi-agent tour orchestrator was specced July 2025, zero code written, scrapped at 2026-03-29 roundtable. Do not pursue.
- **TipTap Integration**: ✅ Ready for TODO.md (detailed plan exists)

### **Current Development Pipeline**

- **Active tracker**: Linear project `Ultraterrestrial Resurrection` (DMG Dev)
- **In review**: agent consolidation, provider fallback, design canon, documentation cleanup, and Linear cutover
- **Blocked**: screenshot-grounded UX audit until a browser backend is available
- **Planning**: 10-source LLM-wiki provenance pilot decision; local-agent definition refresh

---

## 📊 Feature Priority Matrix

### **Current Sprint Readiness**

| Feature | Technical Complexity | Business Value | Implementation Risk | Priority Score |
|---------|---------------------|----------------|-------------------|---------------|
| External Web RAG | Medium | Very High | Low | ⭐⭐⭐⭐⭐ |
| API Consolidation | Low | High | Low | ⭐⭐⭐⭐ |
| Prompts System | Medium | Medium | Low | ⭐⭐⭐ |
| ~~Smart Tours Integration~~ | ~~Low~~ | ~~High~~ | ~~Very Low~~ | ⛔ SCRAPPED |
| TipTap RAG Integration | Medium | High | Medium | ⭐⭐⭐ |
| Deep Research | High | Very High | Medium | ⭐⭐ |

### **Resource Allocation Recommendations**

- **Immediate Focus**: Research Canvas integration (TODO.md Focus 1) — Smart Tours was scrapped
- **Next Sprint**: External Web RAG (highest ROI, low risk)
- **Parallel Development**: API Consolidation (low complexity, can run alongside)
- **Following Sprint**: Prompts System + TipTap Integration
- **Research Phase**: Deep Research technical approach refinement

---

## 📝 Collaboration Notes

**For Liam**: Add ideas, architectural preferences, strategic priorities, user experience insights
**For Claude**: Technical feasibility, implementation strategies, risk assessment, performance analysis

### **Note-Taking Format**

```markdown
**[Your Name] - [Date]**: [Brief note or idea]
**Decision Needed**: [What needs to be decided]
**Research Required**: [What needs investigation]
**Impact Assessment**: [Expected effects on users/system]
```

### **Active Collaboration Items**

**Liam - Aug 9**: Really like the tool architecture approach - feels natural and builds on what works  
**Decision Needed**: Priority order for external websites to crawl first (suggest starting with government archives, major databases)
**Research Required**: Firecrawl rate limits and cost implications for 90+ sites  
**Claude - Aug 9**: Recommend tiered crawling: Tier 1 (archives.gov, MUFON, NICAP), Tier 2 (databases), Tier 3 (community sites)

**Decision Needed**: User authentication strategy for collaborative features
**Research Required**: Integration approach with existing Clerk auth system
**Impact Assessment**: Affects all future collaborative and personalization features

**Decision Needed**: Mobile optimization priority vs desktop-first development
**Research Required**: User analytics on device usage patterns
**Impact Assessment**: Core user experience accessibility and engagement

---

## 🎯 Success Metrics Framework

### **Technical KPIs**

- **Performance**: <2s response time for all core operations
- **Reliability**: 99.9% uptime target
- **Search Quality**: >85% relevance score for RAG search results
- **Integration Success**: <0.1% error rate across consolidated APIs

### **User Experience KPIs**

- **Engagement**: >15 min average session duration
- **Discovery**: >30% cross-reference discovery rate
- **Research Effectiveness**: 30%+ reduction in time to find information
- **Feature Adoption**: 60%+ of users utilizing new capabilities within 30 days

### **Business KPIs**

- **Knowledge Base Growth**: 10,000+ documents across external sources
- **User Retention**: >80% weekly active user retention
- **Community Growth**: >25% monthly user base growth
- **Content Quality**: >4.2/5.0 user satisfaction rating

---

*This document serves as the strategic foundation for tactical implementation. Features mature here through collaborative refinement before becoming actionable tickets in TODO.md and detailed execution plans in DAILY_WORK_PLAN.md.*
