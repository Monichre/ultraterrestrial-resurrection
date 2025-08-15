# TODO List - Ultraterrestrial Resurrection Project

**Consolidated:** January 15, 2025  
**Priority Focus:** Infrastructure Foundation & Research Canvas Integration  
**Strategy:** MVP-first approach with realistic timelines  
**Total Tasks:** 28 (integrated from Todo2 and refined priorities)

---

## **🎯 FOCUS 1: Database Infrastructure & Foundation**

*Critical infrastructure stabilization before advanced feature development*

1. **Database Schema Analysis & Migration Planning** ⭐ **CRITICAL**
   - **Problem:** Current Xata instance needs migration to Postgres Wire enabled for enhanced performance
   - **Files:** Database connection configurations, migration scripts, schema analysis
   - **Success:** Clear migration plan with risk assessment and rollback strategy  
   - **Timeline:** 1 day
   - **Dependencies:** None (blocking other infrastructure work)

2. **Dependency Mapping & Impact Assessment** ⭐ **CRITICAL**
   - **Problem:** Need comprehensive understanding of system dependencies before migration
   - **Files:** All database integration points, API endpoints, component dependencies
   - **Success:** Complete dependency matrix with migration impact analysis
   - **Timeline:** 1 day
   - **Dependencies:** Task 1

3. **Migration Strategy & Rollback Planning** ⭐ **CRITICAL**
   - **Problem:** Need detailed migration strategy with safety measures
   - **Files:** Migration scripts, rollback procedures, testing protocols
   - **Success:** Executable migration plan with validated rollback capability
   - **Timeline:** 1 day
   - **Dependencies:** Tasks 1-2

4. **Execute Postgres Wire Migration** ⭐ **CRITICAL**
   - **Problem:** Perform actual database migration with minimal downtime
   - **Files:** Production database, environment configurations, monitoring
   - **Success:** Successfully migrated to Postgres Wire with <1hr downtime
   - **Timeline:** 4 hours (scheduled maintenance window)
   - **Dependencies:** Tasks 1-3

5. **Post-Migration Validation & Performance Testing** ⭐ **CRITICAL**
   - **Problem:** Ensure migration success and validate performance improvements
   - **Files:** All application components, performance benchmarks, monitoring dashboards
   - **Success:** All systems operational, performance improvements documented
   - **Timeline:** 1 day
   - **Dependencies:** Task 4

---

## **🎯 FOCUS 2: Unified Mindmap Foundation Architecture**

*Consolidate fragmented mindmap systems into coherent foundation*

6. **API Gateway and Endpoint Consolidation** ⭐ **HIGH PRIORITY**
   - **Problem:** 5+ overlapping API endpoints with mock/stubbed implementations  
   - **Solution:** Unified `/api/prometheus/` structure with real implementations
   - **Target Structure:**
     ```
     /api/prometheus/
     ├── chat/          # Core chat functionality (enhanced)
     ├── search/        # Unified search (consolidates historical-query + mindmap/records)
     ├── entities/      # Real NER extraction (replaces fake implementations)
     └── rag/           # External + internal RAG coordination
     ```
   - **Files:** 
     - Consolidate: `@apps/app/src/app/api/historical-query/`, `@apps/app/src/app/api/mindmap/records/`, `@apps/app/src/app/api/prometheus/chat/`
     - Preserve: `@apps/app/src/app/api/disclosure/chat/` (sophisticated implementation)
   - **Success:** Single coherent API with real NER, no redundant endpoints
   - **Timeline:** 4 days
   - **Dependencies:** Database migration completion

7. **Unified State Management Architecture** ⭐ **HIGH PRIORITY**
   - **Problem:** Fragmented state management across mindmap components
   - **Solution:** Centralized Zustand store with real-time synchronization
   - **Files:** 
     - Create: `@apps/app/src/stores/mindmap-unified-store.ts`
     - Update: All mindmap components to use unified store
   - **Success:** Single source of truth for all mindmap state with persistence
   - **Timeline:** 3 days
   - **Dependencies:** API consolidation (Task 6)

8. **Enhanced Node Standardization** ⭐ **HIGH PRIORITY**
   - **Problem:** Inconsistent node implementations across different mindmap contexts
   - **Solution:** All mindmap nodes use `enhancedEntityNodePOC` consistently
   - **Files:** 
     - Standardize: All mindmap node components
     - Update: `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
   - **Success:** Consistent enhanced nodes with AI badges across all mindmap uses
   - **Timeline:** 2 days
   - **Dependencies:** State management architecture (Task 7)

---

## **🎯 FOCUS 3: Research Canvas & Smart Tours Integration**

*Complete the core research workflow experience*

9. **Smart Node Integration** - Make all tour waypoints use `enhancedEntityNodePOC`  
   - **File:** `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
   - **Success:** Tours display enhanced nodes with AI badges
   - **Timeline:** 2 days
   - **Dependencies:** Enhanced Node Standardization (Task 8)

10. **Spatial Intelligence Integration** - Connect tours with `useSpatialGrouping`  
    - **File:** `apps/app/src/features/mindmap/components/grouping/`
    - **Success:** Tour nodes auto-group by proximity and context
    - **Timeline:** 3 days
    - **Dependencies:** Task 9

11. **Enhance Research Canvas Components** - Improve core research workflow  
    - **Files:** `apps/app/src/components/research/`
    - **Success:** Smooth discovery-to-research transition
    - **Timeline:** 2 days
    - **Dependencies:** Unified state management (Task 7)

12. **Expand Contextual Intelligence System** - Enhanced relationship detection  
    - **File:** `apps/app/src/features/mindmap/utils/contextual-intelligence.ts`
    - **Success:** AI-driven relationship suggestions and tour progression
    - **Timeline:** 3 days
    - **Dependencies:** Task 10

13. **Create Guided Tour State Management** - Tour progression and narrative state  
    - **File:** `apps/app/src/contexts/mindmap/` (new tour context)
    - **Success:** Persistent tour progress with session restoration
    - **Timeline:** 2 days
    - **Dependencies:** Task 12

14. **Research Session Automation** - Automatic session creation from spatial grouping  
    - **File:** `apps/app/src/contexts/mindmap/session-notes-context.tsx`
    - **Success:** Sessions auto-created when users group related entities
    - **Timeline:** 2 days
    - **Dependencies:** Task 13

---

## **🎯 FOCUS 4: Typography & Design System Foundation**

*Essential UI/UX infrastructure for consistent experience*

15. **Create Comprehensive Typography Storybook Story** ⭐ **MEDIUM PRIORITY**
    - **Objective:** Build single professional Storybook story showcasing all unique typefaces from design system docs
    - **Files:** 
      - Create/Update: `apps/app/src/stories/typography/Typography.stories.tsx`
      - Reference: Design system documentation files
    - **Success:** All fonts rendered correctly with controls for selection and theme toggle
    - **Timeline:** 1 day
    - **Dependencies:** None (can run in parallel)

---

## **🎯 FOCUS 5: Advanced Integration Features**

*Ready for implementation features from FEATURES.md*

16. **Workspace-Wide Prompts System** 🔄 **READY**
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
    - **Dependencies:** Core infrastructure stable (Tasks 1-8)

17. **TipTap AI RAG Integration** ✍️ **READY**
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
    - **Dependencies:** Prompts system (Task 16)

18. **Real-time Collaboration Unification** 🔄 **READY**
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
    - **Dependencies:** Unified state management (Task 7)

19. **Performance Optimization and Caching** ⚡ **READY**
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
    - **Dependencies:** Database migration and API consolidation (Tasks 1-6)

---

## **🚀 FUTURE PHASE (Post-Foundation)**

### **⚠️ WHITEBOARD REQUIRED: External Web Resources RAG Integration**
- **Status:** Architecture designed, requires strategic discussion
- **Note:** Need to whiteboard Prometheus tool architecture and Firecrawl integration strategy
- **Decision Points:** Tool formalization approach, crawling priorities, rate limits
- **Timeline:** TBD after whiteboard session

### **Advanced Features (Not Current Priority)**

20. **3D Visualization Spatial Integration** - Globe visualization with spatial intelligence
    - **Condition:** After unified mindmap foundation is stable
    - **Timeline:** TBD

21. **Multi-user Advanced Collaboration** - Advanced real-time research session sharing  
    - **Condition:** After core UX is stable and validated
    - **Timeline:** TBD

22. **Advanced Analytics** - Research pattern analysis and insights  
    - **Condition:** After sufficient user data and feedback
    - **Timeline:** TBD

---

## **🔮 INTEGRATION & TESTING PHASE**

### **System Integration & Validation**

23. **Test Complete Research Workflow** - End-to-end user journey validation  
    - **Success:** Mindmap → Research Canvas → Session → Documentation flow works
    - **Timeline:** 2 days
    - **Dependencies:** All core features complete (Tasks 1-14)

24. **RAG-TipTap Integration Testing** - Verify Generate, Summarize, Fact Check commands  
    - **File:** Research editor integration
    - **Success:** AI commands work with multi-RAG backend (Postgres+CocoIndex, OpenAI, Upstash)
    - **Timeline:** 1 day
    - **Dependencies:** TipTap integration (Task 17)

25. **Performance Validation** - Database queries and response times  
    - **Success:** Sub-2s response times for all core operations with load testing
    - **Timeline:** 2 days
    - **Dependencies:** Performance optimization (Task 19)

---

## **📚 DOCUMENTATION CONSOLIDATION**

### **Critical Documentation Tasks**

26. **Consolidate RAG System Documentation** - Single source of truth for current architecture  
    - **Output:** Updated CLAUDE.md with current RAG strategy
    - **Timeline:** 0.5 days
    - **Dependencies:** RAG integration stable

27. **Update Project Structure** - Reflect current priorities and completed work  
    - **File:** `PROJECT_STRUCTURE.md`
    - **Timeline:** 0.5 days
    - **Dependencies:** Major structural changes complete

28. **Archive Outdated Documentation** - Remove or consolidate duplicate files  
    - **Target:** Reduce from 284 to ~150 active documentation files
    - **Timeline:** 1 day
    - **Dependencies:** Documentation consolidation (Tasks 26-27)

---

## **🗂️ Key Implementation Files**

### **Database & Infrastructure**
- `packages/db/xata/` - Database configuration and migrations
- `apps/app/src/app/api/prometheus/` - Unified API structure

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
1. **Infrastructure** (Database migration + API consolidation) → **Foundation**
2. **Foundation** (Unified state + Enhanced nodes) → **Integration**  
3. **Integration** (Research canvas + Tours) → **Enhancement**
4. **Enhancement** (Performance + Collaboration) → **Validation**

**Core User Journey:**
1. **Discovery** (Unified mindmap with consistent enhanced nodes)
2. **Investigation** (Integrated research canvas with spatial intelligence)
3. **Documentation** (Automated session creation and evidence tracking)
4. **Narrative** (Guided historical tours with contextual progression)

**Technical Strategy:**
- Infrastructure-first approach (database → API → state → UI)
- Build on existing spatial intelligence foundation  
- Leverage current Triple RAG implementation
- Focus on system stability before feature expansion
- Validate complete workflows before advancing

---

*This consolidated TODO focuses on infrastructure foundation and systematic progression through core user experience delivery. Advanced features are properly sequenced after foundation stability.*