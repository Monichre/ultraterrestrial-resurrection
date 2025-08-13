# Feature Planning & High-Level Ideas

**Purpose**: Collaborative space for high-level feature concepts, architectural decisions, and strategic planning before they become actionable tickets.

**Last Updated**: August 9, 2025  
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

**Technical Philosophy**: "Orchestration over Replacement" - enhance existing sophisticated 85% complete AI infrastructure

---

## 🎯 Current Focus Areas

### **1. External Web Resources RAG Integration** ⭐ **Priority 1**

**Vision**: Transform Prometheus AI into comprehensive UFO/UAP research platform with access to 90+ specialized external websites.

**Core Concept**: Use Firecrawl to pre-ingest external content → Triple RAG storage → fast local search instead of slow real-time scraping.

**Key Components**:
- **Content Pipeline**: Background crawling with quality filtering
- **Tool Architecture**: Formalize existing capabilities as Prometheus tools (searchUAP, searchDatabase, searchDocuments, xataSearch, searchWebResources, processDocument)
- **Integration**: Leverage existing Contextual Intelligence for orchestration

**Status**: Requirements analyzed, architecture designed, ready for implementation
**Decision**: Use tool-wrapper approach to enhance existing 85% complete AI infrastructure
**Notes**: Perfectly aligns with existing architecture - orchestration over replacement
**Reference**: See `docs/PROMETHEUS_REQUIREMENTS_ANALYSIS.md` for detailed technical approach

---

### **2. Prometheus API Consolidation** ⭐ **Priority 2**

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

### **3. Workspace-Wide Prompts System** 🔄 **Priority 3**

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

### **4. Deep Research & Thoroughness Analysis** 🔬 **Priority 4**

**Vision**: Multi-source research with comprehensive evidence tracking and quality scoring.

**Components**:
- **Research Session Management**: Evidence trails, session persistence, collaborative research
- **Source Credibility Engine**: Weighting algorithms, diversity metrics, authority scoring
- **Multi-hop Reasoning**: Advanced query understanding, cross-reference discovery, pattern recognition
- **Report Generation**: Multiple formats (markdown, PDF, structured data), citation management

**Quality Framework**:
- **Thoroughness Scoring**: Coverage analysis across multiple sources
- **Completeness Metrics**: Information gap identification, recommendation engine
- **Temporal Relevance**: Recency weighting, historical context integration
- **Credibility Assessment**: Source verification, cross-validation, bias detection

**Integration Points**: External RAG + existing Triple RAG + Contextual Intelligence + Enhanced Nodes
**Current RAG Performance**: Upstash Vector (40%), LocalRAG FAISS (40%), CocoIndex PostgreSQL (20%)
**Reference**: Analysis framework in `DAILY_WORK_PLAN.md` Day 5

---

### **5. Smart Tours & Research Canvas Integration** 📍 **Active Development**

**Vision**: Seamless connection between guided historical narratives and interactive research workflows.

**Current State**: Smart Tours 85% complete, Research Canvas needs enhancement
**Key Integration Points**:
- **Enhanced Node Consistency**: All tour waypoints use `enhancedEntityNodePOC` with AI badges
- **Spatial Intelligence**: Tours auto-group nodes by proximity and context using `useSpatialGrouping`
- **Contextual Intelligence**: AI-driven relationship suggestions and tour progression
- **Session Automation**: Auto-creation of research sessions from spatial grouping

**User Journey**: Mindmap Discovery → Tour Navigation → Research Canvas Investigation → Session Documentation
**Files**: `enhanced-node-poc.tsx`, `contextual-intelligence.ts`, `useSpatialGrouping`, research canvas components
**Reference**: Active tickets in `TODO.md` Focus 1

---

### **6. TipTap AI RAG Integration** ✍️ **Architecture Complete**

**Vision**: Advanced research editor with AI-powered writing assistance using existing RAG infrastructure.

**Key Features**:
- **Admin Configuration**: Toggle between local/remote RAG servers
- **Enhanced Mention System**: Search both local entities and RAG knowledge base
- **AI Commands**: Generate, Fact Check, Cite, Elaborate, Summarize with UFO/UAP context
- **Document Sync**: Automatic indexing of research documents into Triple RAG

**Technical Approach**: TipTap native AI extensions + custom LLM handler + existing RAG backend
**Implementation**: 10-day phased approach detailed in `features/TIPTAP_AI_RAG_INTEGRATION_PLAN_V2.md`
**Status**: Architecture complete, ready for implementation

---

## 🌟 Emerging Ideas & Future Concepts

### **Natural Language Tours (Agentic Tours)** 🎙️ **Post-MVP**
**Idea**: Voice/text-controlled tour navigation - "Take me to the Roswell connection" or "Show me government involvement"
**Dependencies**: Smart Tours (85% complete), Enhanced Nodes, Contextual Intelligence
**Technical Requirements**: Advanced NLP, voice recognition, tour orchestration, natural language understanding
**User Stories**: 
- "Show me all government officials connected to Roswell"
- "Take me through the Pentagon UFO disclosure timeline"
- "Find connections between Bob Lazar and Area 51"
**Complexity**: High - requires sophisticated AI reasoning and tour state management
**Timeline**: Post-MVP (after core research workflows are stable)

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
**Integration**: Extend existing Triple RAG with multi-modal vector storage
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
**Rationale**: Preserves 85% complete sophisticated AI infrastructure, enables incremental enhancement
**Impact**: Low risk, high compatibility, leverages existing Contextual Intelligence
**Status**: ✅ Approved - Implementation ready

### **Decision 2: Firecrawl Pre-Ingestion Strategy**
**Date**: August 9, 2025  
**Context**: External web resources access method  
**Decision**: Pre-ingest content to Triple RAG vs real-time scraping
**Rationale**: LangBase lesson - fast search but slow integration solved by local storage
**Impact**: Fast responses, reliable performance, respects external sites
**Technical Details**: Background crawling → Triple RAG storage → fast local vector search
**Status**: ✅ Approved - Architecture designed

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

---

## 🔄 Implementation Flow

**Feature Journey**: FEATURES.md (concepts) → TODO.md (actionable tickets) → DAILY_WORK_PLAN.md (current execution)

### **Criteria for Moving Features to TODO.md**:
1. ✅ Technical approach decided and documented
2. ✅ Dependencies identified and resolved
3. ✅ Success criteria clearly defined
4. ✅ Timeline estimated with confidence
5. ✅ Implementation files identified
6. ✅ Architectural decisions logged
7. ✅ Integration points mapped to existing systems

### **Criteria for Moving to DAILY_WORK_PLAN.md**:
1. ✅ Feature broken into specific tasks (2-4 hour chunks)
2. ✅ Required immediate execution within current sprint
3. ✅ Dependencies resolved or scheduled
4. ✅ Resources allocated and available
5. ✅ Success metrics and validation criteria defined
6. ✅ Risk mitigation strategies identified

### **Feature Maturation Status**:
- **External Web RAG**: ✅ Ready for TODO.md (all criteria met)
- **API Consolidation**: ✅ Ready for TODO.md (architecture complete)
- **Prompts System**: ✅ Ready for TODO.md (design finalized)
- **Deep Research**: 🔄 Needs technical approach refinement
- **Smart Tours Integration**: ✅ Already in TODO.md (active development)
- **TipTap Integration**: ✅ Ready for TODO.md (detailed plan exists)

### **Current Development Pipeline**:
- **Active**: Smart Tours + Research Canvas (TODO.md Focus 1)
- **Next Sprint**: External Web RAG, API Consolidation (ready to move from FEATURES.md)
- **Planning**: Deep Research refinement, Prompts system architecture

---

## 📊 Feature Priority Matrix

### **Current Sprint Readiness**
| Feature | Technical Complexity | Business Value | Implementation Risk | Priority Score |
|---------|---------------------|----------------|-------------------|---------------|
| External Web RAG | Medium | Very High | Low | ⭐⭐⭐⭐⭐ |
| API Consolidation | Low | High | Low | ⭐⭐⭐⭐ |
| Prompts System | Medium | Medium | Low | ⭐⭐⭐ |
| Smart Tours Integration | Low | High | Very Low | ⭐⭐⭐⭐ (Active) |
| TipTap RAG Integration | Medium | High | Medium | ⭐⭐⭐ |
| Deep Research | High | Very High | Medium | ⭐⭐ |

### **Resource Allocation Recommendations**
- **Immediate Focus**: Complete Smart Tours integration (TODO.md Focus 1)
- **Next Sprint**: External Web RAG (highest ROI, low risk)
- **Parallel Development**: API Consolidation (low complexity, can run alongside)
- **Following Sprint**: Prompts System + TipTap Integration
- **Research Phase**: Deep Research technical approach refinement

---

## 📝 Collaboration Notes

**For Liam**: Add ideas, architectural preferences, strategic priorities, user experience insights
**For Claude**: Technical feasibility, implementation strategies, risk assessment, performance analysis

### **Note-Taking Format**:
```markdown
**[Your Name] - [Date]**: [Brief note or idea]
**Decision Needed**: [What needs to be decided]
**Research Required**: [What needs investigation]
**Impact Assessment**: [Expected effects on users/system]
```

### **Active Collaboration Items**:
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