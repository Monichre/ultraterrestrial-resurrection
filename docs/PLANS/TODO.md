# TODO List - Ultraterrestrial Resurrection Project

**Consolidated:** January 15, 2025
**Last Updated:** January 22, 2026 00:47:07 CST - Mindmap ai-sdk-tools tickets
**Priority Focus:** Architecture Refactoring → Research Canvas Integration → Unified Mindmap Foundation
**Strategy:** Technical debt reduction first, then MVP features with realistic timelines
**Total Tasks:** 34 (Added 9 critical architecture refactoring tasks)

---

## **🔴 CRITICAL: Architecture Refactoring & Technical Debt**

*Address critical technical debt identified in Architecture Review (2025-11-25)*
*Reference: `/ARCHITECTURE_REVIEW.md` - Overall Score: 62/100*

### **Week 1 - Immediate Actions (Critical Priority)**

1. **Remove Commented Code from tools.ts** ⭐ **CRITICAL**
   - **Problem:** 150 lines of dead code causing maintenance confusion
   - **Solution:** Delete all commented-out code in `tools.ts`
   - **Files:** `@apps/app/src/services/ai/prometheus/lib/tools.ts`
   - **Impact:** Improved code clarity, reduced cognitive load
   - **Timeline:** 15 minutes
   - **Dependencies:** None

2. **Add Zod Input Validation to API Routes** ⭐ **CRITICAL**
   - **Problem:** No input validation - XSS and injection vulnerability risk
   - **Solution:** Implement Zod schema validation for all API inputs
   - **Files:**
     - `@apps/app/src/app/api/disclosure/chat/route.ts`
     - `@apps/app/src/app/api/agent/route.ts` (if exists)
   - **Impact:** Prevents injection attacks, type safety
   - **Timeline:** 2-3 hours
   - **Dependencies:** Install `zod` if not present

3. **Consolidate Duplicate API Routes** ⭐ **CRITICAL**
   - **Problem:** 3 duplicate implementations (route.ts, route-demo.ts, demo.ts)
   - **Solution:** Merge into single configurable endpoint with feature flags
   - **Files:**
     - Keep: `@apps/app/src/app/api/disclosure/chat/route.ts`
     - Delete: `route-demo.ts`, `demo.ts`
     - Create: Config for demo/production modes
   - **Impact:** 66% reduction in maintenance overhead
   - **Timeline:** 4-6 hours
   - **Dependencies:** Task 2 (validation)

### **Weeks 2-4 - Short-Term Improvements (High Priority)**

4. **Refactor agent.tsx into Smaller Components** ⭐ **HIGH PRIORITY**
   - **Problem:** Monolithic component at 1,135 lines
   - **Solution:** Split into 6-8 focused components
   - **Components to Create:**
     - `AgentInput.tsx` (textarea, command palette)
     - `AgentAttachments.tsx` (file upload, list)
     - `AgentResponse.tsx` (response display)
     - `AgentToolbar.tsx` (action buttons)
     - `DocumentMenu.tsx` (processing options)
     - `ProcessingModals.tsx` (summary, topics)
   - **Files:** `@apps/app/src/app/(site)/prometheus/agent.tsx`
   - **Impact:** 60% reduction in re-render time, easier testing
   - **Timeline:** 12-16 hours
   - **Dependencies:** Task 1, 2, 3

5. **Implement LRU Caching Layer** ⭐ **HIGH PRIORITY**
   - **Problem:** Redundant searches, no result caching
   - **Solution:** Add LRU cache with 5-minute TTL for search results
   - **Files:**
     - Create: `@apps/app/src/lib/cache.ts`
     - Update: `@db/xata/api/search.ts`
   - **Impact:** 80% reduction in redundant searches
   - **Timeline:** 4-6 hours
   - **Dependencies:** Install `lru-cache`

6. **Add Comprehensive Error Handling** ⭐ **HIGH PRIORITY**
   - **Problem:** Basic error handling, poor user experience on failures
   - **Solution:** Retry logic, circuit breaker, user-friendly messages
   - **Files:**
     - Create: `@apps/app/src/lib/error-handling.ts`
     - Update: All API routes
     - Update: `agent.tsx` error states
   - **Impact:** 50% reduction in user-facing errors
   - **Timeline:** 8-10 hours
   - **Dependencies:** Task 4

### **Months 2-3 - Medium-Term Enhancements**

7. **Implement Test Suite** ⭐ **MEDIUM PRIORITY**
   - **Problem:** 0% test coverage (target: 90%)
   - **Solution:** Comprehensive unit, integration, and E2E tests
   - **Setup:**
     - Install Vitest, React Testing Library
     - Create test utilities and mocks
     - Write tests for critical paths
   - **Files:** Create `*.test.ts` files throughout codebase
   - **Impact:** Prevents regressions, enables confident refactoring
   - **Timeline:** 40-60 hours
   - **Dependencies:** Task 4 (component refactoring)

8. **Add Monitoring & Observability** ⭐ **MEDIUM PRIORITY**
   - **Problem:** No error tracking, performance monitoring, or cost tracking
   - **Solution:** Integrate Sentry, Vercel Analytics, OpenAI cost dashboard
   - **Tools:**
     - Sentry for error tracking
     - Vercel Analytics for performance
     - Custom dashboard for OpenAI costs
   - **Impact:** Proactive issue detection, cost control
   - **Timeline:** 16-20 hours
   - **Dependencies:** None (can run in parallel)

9. **Implement Rate Limiting** ⭐ **MEDIUM PRIORITY**
   - **Problem:** No protection against API abuse
   - **Solution:** Per-user/IP rate limiting (30 req/min)
   - **Files:**
     - Create: `@apps/app/src/middleware/rate-limit.ts`
     - Update: All API routes
   - **Tools:** `@upstash/ratelimit`
   - **Impact:** Prevents abuse, controls costs
   - **Timeline:** 3-4 hours
   - **Dependencies:** None

---

## **🎯 FOCUS 1: Unified Mindmap Foundation Architecture**

*Consolidate fragmented mindmap systems into coherent foundation*

1. **Replace Mock Entity Extraction with Real Implementation** ⭐ **HIGH PRIORITY**
   - **Problem:** Fake entity extraction in mindmap routes needs real NER implementation
   - **Solution:** Use sophisticated NER from `disclosure/chat` to replace placeholder implementations
   - **Files:** 
     - Update: `@apps/app/src/app/api/disclosure/mindmap/` (remove mocks)
     - Source: `@apps/app/src/app/api/disclosure/chat/` (copy real NER logic)
   - **Success:** Real entity extraction working in mindmap features
   - **Timeline:** 2 days
   - **Dependencies:** None

2. **Unified State Management Architecture** ⭐ **HIGH PRIORITY**
   - **Problem:** Fragmented state management across mindmap components
   - **Solution:** Centralized Zustand store with real-time synchronization
   - **Files:** 
     - Create: `@apps/app/src/stores/mindmap-unified-store.ts`
     - Update: All mindmap components to use unified store
   - **Success:** Single source of truth for all mindmap state with persistence
   - **Timeline:** 3 days
   - **Dependencies:** API consolidation (Task 1)

3. **Enhanced Node Standardization** ⭐ **HIGH PRIORITY**
   - **Problem:** Inconsistent node implementations across different mindmap contexts
   - **Solution:** All mindmap nodes use `enhancedEntityNodePOC` consistently
   - **Files:** 
     - Standardize: All mindmap node components
     - Update: `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
   - **Success:** Consistent enhanced nodes with AI badges across all mindmap uses
   - **Timeline:** 2 days
   - **Dependencies:** State management architecture (Task 2)

---

## **🎯 FOCUS 2: Research Canvas & Smart Tours Integration**

*Complete the core research workflow experience*

4. **Smart Node Integration** - Make all tour waypoints use `enhancedEntityNodePOC`
   - **File:** `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
   - **Success:** Tours display enhanced nodes with AI badges
   - **Timeline:** 2 days
   - **Dependencies:** Enhanced Node Standardization (Task 3)

5. **Spatial Intelligence Integration** - Connect tours with `useSpatialGrouping`
    - **File:** `apps/app/src/features/mindmap/components/grouping/`
    - **Success:** Tour nodes auto-group by proximity and context
    - **Timeline:** 3 days
    - **Dependencies:** Task 4

6. **Enhance Research Canvas Components** - Improve core research workflow
    - **Files:** `apps/app/src/components/research/`
    - **Success:** Smooth discovery-to-research transition
    - **Timeline:** 2 days
    - **Dependencies:** Unified state management (Task 2)

7. **Expand Contextual Intelligence System** - Enhanced relationship detection
    - **File:** `apps/app/src/features/mindmap/utils/contextual-intelligence.ts`
    - **Success:** AI-driven relationship suggestions and tour progression
    - **Timeline:** 3 days
    - **Dependencies:** Task 5

8. **Create Guided Tour State Management** - Tour progression and narrative state
    - **File:** `apps/app/src/contexts/mindmap/` (new tour context)
    - **Success:** Persistent tour progress with session restoration
    - **Timeline:** 2 days
    - **Dependencies:** Task 7

9. **Research Session Automation** - Automatic session creation from spatial grouping
    - **File:** `apps/app/src/contexts/mindmap/session-notes-context.tsx`
    - **Success:** Sessions auto-created when users group related entities
    - **Timeline:** 2 days
    - **Dependencies:** Task 8

---

## **🎯 FOCUS 3: Typography & Design System Foundation**

*Essential UI/UX infrastructure for consistent experience*

10. **Create Comprehensive Typography Storybook Story** ⭐ **MEDIUM PRIORITY**
    - **Objective:** Build single professional Storybook story showcasing all unique typefaces from design system docs
    - **Files:** 
      - Create/Update: `apps/app/src/stories/typography/Typography.stories.tsx`
      - Reference: Design system documentation files
    - **Success:** All fonts rendered correctly with controls for selection and theme toggle
    - **Timeline:** 1 day
    - **Dependencies:** None (can run in parallel)

---

## **🎯 FOCUS 4: Design System & UX Enhancement**

*Mindmap visual overhaul with emerging design system integration*

11. **Mindmap Graph, Cards, and Nodes UI/UX Makeover** 🎨 **NEEDS GROOMING**
    - **Problem:** Current mindmap components need standardization with new design system
    - **Solution:** Comprehensive visual overhaul integrating emerging design patterns
    - **Phase 1 - Standardization:**
      - Audit existing mindmap graph, card, and node components
      - Apply consistent base styling and interactions
      - Ensure accessibility and performance baselines
    - **Phase 2 - Enhanced Presentations:**
      - Containing/group nodes with sophisticated presentational layers
      - Domain-specific interfaces for different entity types
      - Image handling with polaroid aesthetic integration
      - Retro document styling for research contexts
    - **Files:**
      - `@apps/app/src/features/mindmap/components/` - All mindmap components
      - `@apps/app/src/features/mindmap/nodes/` - Node variants
      - `@apps/app/src/components/design-system/` - New design tokens
    - **Design Philosophy:** 
      - **Mindmap Core**: Sci-fi minimal elegance matching main application
      - **Research Canvas**: Retro dystopian classical document aesthetic
      - **Design Union**: Seamless transition between the two visual languages
    - **Success:** Cohesive design system applied across all mindmap components
    - **Timeline:** TBD (requires design specification and component identification)
    - **Dependencies:** Design system components need identification and creation
    - **⚠️ GROOMING NEEDED:** Requires detailed design specification and newly designed component catalog

12. **Rocket.new Interface Patterns Integration** 🚀 **NEEDS GROOMING**
    - **Problem:** Excellent UX patterns designed on Rocket.new need integration into main application
    - **Solution:** Systematic breakdown and integration of proven interface designs
    - **Scope:** 
      - Catalog and document existing Rocket.new interface designs
      - Identify integration points within current application architecture
      - Create implementation roadmap for high-value UX patterns
      - Ensure design consistency with emerging design system
    - **Integration Areas:**
      - Navigation and interaction patterns
      - Data visualization enhancements
      - User workflow optimizations
      - Advanced UI components and microinteractions
    - **Files:** TBD (depends on pattern analysis and integration strategy)
    - **Success:** Key Rocket.new UX patterns successfully integrated with measurable UX improvements
    - **Timeline:** TBD (requires pattern analysis and integration planning)
    - **Dependencies:** Rocket.new pattern documentation and design system standardization
    - **⚠️ GROOMING NEEDED:** Requires feature specification, pattern breakdown, and integration strategy

---

## **🎯 FOCUS 5: Advanced Integration Features**

*Ready for implementation features from FEATURES.md*

13. **Workspace-Wide Prompts System** 🔄 **READY**
    - **Problem:** Scattered prompts in various files, inconsistent management
    - **Solution:** `@repo/prompts` workspace package with centralized management
    - **Target Architecture:**
      ```
      packages/prompts/
      ├── system/          # Core system prompts
      ├── research/        # Research and analysis prompts
      ├── extraction/      # Entity and data extraction prompts
      ├── generation/      # Content generation prompts
      └── templates/       # Reusable prompt templates
      ```
    - **Features:** Versioning, A/B testing, dynamic parameter injection, environment variations
    - **Files:** Create new workspace package, refactor existing prompt usage
    - **Success:** Centralized prompt management with version control and performance optimization
    - **Timeline:** 3 days
    - **Dependencies:** Core infrastructure stable (Tasks 1-3)

14. **TipTap AI RAG Integration** ✍️ **READY**
    - **Status:** Architecture complete, detailed 10-day plan exists
    - **Scope:** Advanced research editor with AI-powered writing assistance
    - **Key Features:**
      - Admin configuration (toggle local/remote RAG servers)
      - Enhanced mention system (search entities + RAG knowledge base)
      - AI commands (Generate, Fact Check, Cite, Elaborate, Summarize)
      - Document sync (automatic indexing into Triple RAG)
    - **Technical:** TipTap native AI extensions + custom LLM handler + existing RAG backend
    - **Files:** Research editor integration, admin settings, custom LLM handler
    - **Reference:** `docs/PLANS/features/TIPTAP_AI_RAG_INTEGRATION_PLAN_V2.md` (detailed implementation)
    - **Success:** AI-powered research editor with seamless RAG integration
    - **Timeline:** 10 days (phased approach)
    - **Dependencies:** Prompts system (Task 13)

15. **Real-time Collaboration Unification** 🔄 **READY**
    - **Problem:** Collaboration features scattered across different systems
    - **Solution:** Unified real-time collaboration using existing Liveblocks infrastructure
    - **Features:**
      - Shared mindmap editing with live cursors
      - Real-time research session collaboration
      - Synchronized tour progression across users
      - Collaborative evidence annotation
    - **Files:** Collaboration context providers, real-time sync components
    - **Success:** Seamless real-time collaboration across all major features
    - **Timeline:** 4 days
    - **Dependencies:** Unified state management (Task 2)

16. **Performance Optimization and Caching** ⚡ **READY**
    - **Problem:** Need systematic performance optimization for growing dataset
    - **Solution:** Multi-layer caching strategy with intelligent optimization
    - **Components:**
      - Smart caching for database queries, RAG results, API responses
      - Web workers for heavy computational tasks
      - Bundle optimization with code splitting
      - Advanced database indexing strategies
    - **Performance Targets:**
      - Sub-2s response times for all core operations
      - 99.9% uptime with graceful degradation
      - Efficient memory usage for 230,998+ records
    - **Files:** Performance monitoring, caching layers, web worker implementations
    - **Success:** Measurable performance improvements meeting target metrics
    - **Timeline:** 3 days
    - **Dependencies:** API consolidation (Task 1)

---

## **🚀 FUTURE PHASE (Post-Foundation)**

### **⚠️ WHITEBOARD REQUIRED: External Web Resources RAG Integration**
- **Status:** Architecture designed, requires strategic discussion
- **Note:** Need to whiteboard Prometheus tool architecture and Firecrawl integration strategy
- **Decision Points:** Tool formalization approach, crawling priorities, rate limits
- **Timeline:** TBD after whiteboard session

### **Advanced Features (Not Current Priority)**

17. **3D Visualization Spatial Integration** - Globe visualization with spatial intelligence
    - **Condition:** After unified mindmap foundation is stable
    - **Timeline:** TBD

18. **Multi-user Advanced Collaboration** - Advanced real-time research session sharing
    - **Condition:** After core UX is stable and validated
    - **Timeline:** TBD

19. **Advanced Analytics** - Research pattern analysis and insights
    - **Condition:** After sufficient user data and feedback
    - **Timeline:** TBD

---

## **🔮 INTEGRATION & TESTING PHASE**

### **System Integration & Validation**

20. **Test Complete Research Workflow** - End-to-end user journey validation
    - **Success:** Mindmap → Research Canvas → Session → Documentation flow works
    - **Timeline:** 2 days
    - **Dependencies:** All core features complete (Tasks 1-9)

21. **RAG-TipTap Integration Testing** - Verify Generate, Summarize, Fact Check commands
    - **File:** Research editor integration
    - **Success:** AI commands work with multi-RAG backend (Postgres+CocoIndex, OpenAI, Upstash)
    - **Timeline:** 1 day
    - **Dependencies:** TipTap integration (Task 14)

22. **Performance Validation** - Database queries and response times
    - **Success:** Sub-2s response times for all core operations with load testing
    - **Timeline:** 2 days
    - **Dependencies:** Performance optimization (Task 16)

---

## **📚 DOCUMENTATION CONSOLIDATION**

### **Critical Documentation Tasks**

23. **Consolidate RAG System Documentation** - Single source of truth for current architecture
    - **Output:** Updated CLAUDE.md with current RAG strategy
    - **Timeline:** 0.5 days
    - **Dependencies:** RAG integration stable

24. **Update Project Structure** - Reflect current priorities and completed work
    - **File:** `PROJECT_STRUCTURE.md`
    - **Timeline:** 0.5 days
    - **Dependencies:** Major structural changes complete

25. **Archive Outdated Documentation** - Remove or consolidate duplicate files
    - **Target:** Reduce from 284 to ~150 active documentation files
    - **Timeline:** 1 day
    - **Dependencies:** Documentation consolidation (Tasks 23-24)

---

## **🧠 NEW: Mindmap Agent Consolidation (ai-sdk-tools)**

26. **Baseline Audit + Runtime Compatibility** ⭐ **HIGH PRIORITY**
    - **Goal:** Map current mindmap agent flow and confirm AI runtime compatibility
    - **Files:**
      - `@apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts`
      - `@apps/app/src/app/api/disclosure/mindmap/route.ts`
      - `@apps/app/src/features/mindmap/agents/*`
    - **Deliverables:**
      - SSE payload inventory + tool event schema
      - Assistants API → AI SDK migration bridge decision
      - Node vs Edge runtime confirmation for `@ai-sdk-tools/*`
    - **Timeline:** 0.5 day

27. **Tool Adapter + Contract Schemas** ⭐ **HIGH PRIORITY**
    - **Goal:** Map `ULTRATERRESTRIAL_TOOL_DEFINITIONS` to ai-sdk-tools tool format
    - **Files:**
      - `@apps/app/src/features/mindmap/tools/ultraterrestrial-agent-tools.ts`
      - `@apps/app/src/features/mindmap/agents/tools/index.ts` (new)
    - **Deliverables:**
      - Explicit tool input/output schemas + error contracts
      - Streaming event contract (text/tool_event/artifact/error)
    - **Timeline:** 1 day
    - **Dependencies:** Task 26

28. **MindmapResearchAgent (Unified Agent)** ⭐ **HIGH PRIORITY**
    - **Goal:** Create unified agent with memory and wrapped sub-agents
    - **Files:**
      - `@apps/app/src/features/mindmap/agents/mindmap-research-agent.ts` (new)
      - `@apps/app/src/features/mindmap/agents/historical-query-agent.ts` (refactor)
      - `@apps/app/src/features/mindmap/agents/tour-state-agent.ts` (wrap/hand-off)
      - `@apps/app/src/features/mindmap/agents/memory/mindmap-memory-provider.ts` (new)
    - **Deliverables:**
      - Unified agent with tool registry and memory scoping
      - Pure tool functions extracted from historical agent
    - **Timeline:** 2 days
    - **Dependencies:** Task 27

29. **API Route v2 + Streaming** ⭐ **HIGH PRIORITY**
    - **Goal:** Introduce v2 endpoint using unified agent with backwards compatibility
    - **Files:**
      - `@apps/app/src/app/api/disclosure/mindmap/v2/route.ts` (new)
      - Feature flag in client hook
    - **Deliverables:**
      - ai-sdk-tools streaming utilities
      - Adapter for legacy `AgentToolEvent` until migration completes
    - **Timeline:** 1 day
    - **Dependencies:** Task 28

30. **Client Hook Integration (Feature Flag)** ⭐ **HIGH PRIORITY**
    - **Goal:** Update `use-mindmap-agent` to consume v2 streaming contract
    - **Files:**
      - `@apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts`
    - **Deliverables:**
      - Compatible parser for new event schema
      - Controlled rollout via feature flag
    - **Timeline:** 1 day
    - **Dependencies:** Task 29

31. **Validation + Rollout Criteria** ⭐ **HIGH PRIORITY**
    - **Goal:** Verify parity and set rollback thresholds
    - **Deliverables:**
      - v1 vs v2 parity tests for core flows
      - Latency/error benchmarks and rollback criteria
    - **Timeline:** 1 day
    - **Dependencies:** Task 30

32. **UFO Research Methodology Framework (Follow-up)** ⭐ **MEDIUM PRIORITY**
    - **Goal:** Define a structured methodology inspired by Jacques Vallée, Diana Pasulka Walsh, and other researchers
    - **Deliverables:**
      - Framework outline (classification, evidence evaluation, source verification, pattern analysis)
      - Mapping to ingestion and analysis workflows
    - **Timeline:** 2 days

---

## **🗂️ Key Implementation Files**

### **Database & Infrastructure**
- `packages/db/xata/` - Database configuration and migrations
- `apps/app/src/app/api/disclosure/mindmap/` - Entity extraction endpoints

### **Core Research Canvas**
- `apps/app/src/components/research/pinned-cards-canvas.tsx`
- `apps/app/src/components/research/research-interface.tsx`
- `apps/app/src/components/research/evidence-browser.tsx`

### **Smart Tour Integration**
- `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
- `apps/app/src/features/mindmap/utils/contextual-intelligence.ts`
- `apps/app/src/features/mindmap/components/grouping/`

### **State Management**
- `apps/app/src/stores/mindmap-unified-store.ts` (new)
- `apps/app/src/contexts/mindmap/` (enhanced)

### **RAG System Architecture**
- `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py` (Triple RAG)
- `apps/disclosure-rag/lib/storage/local_vector_library.py` (Backup system)

---

## **🎯 Strategic Focus**

**Primary Goal:** Establish solid infrastructure foundation before advanced feature development

**Critical Path:**
1. **Foundation** (API consolidation + Unified state + Enhanced nodes) → **Integration**
2. **Integration** (Research canvas + Tours) → **Enhancement**
3. **Enhancement** (Performance + Collaboration) → **Validation**

**Core User Journey:**
1. **Discovery** (Unified mindmap with consistent enhanced nodes)
2. **Investigation** (Integrated research canvas with spatial intelligence)
3. **Documentation** (Automated session creation and evidence tracking)
4. **Narrative** (Guided historical tours with contextual progression)

**Technical Strategy:**
- Foundation-first approach (API → state → UI)
- Build on existing spatial intelligence foundation
- Leverage current Triple RAG implementation
- Focus on system stability before feature expansion
- Validate complete workflows before advancing

---

*This consolidated TODO focuses on application feature development with systematic progression through core user experience delivery. Database infrastructure tasks removed - focus on mindmap foundation and research workflows.*