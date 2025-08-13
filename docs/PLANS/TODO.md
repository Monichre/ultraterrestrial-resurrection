# TODO List - Ultraterrestrial Resurrection Project

**Consolidated:** July 14, 2025  
**Priority Focus:** Research Canvas & Smart Tours (Core UX)  
**Strategy:** MVP-first approach with realistic timelines  
**Total Tasks:** 23 (added 3 ready features from FEATURES.md)

---

## **🎯 FOCUS 1: Investigative Tours + Connect the Dots**

*MindMap Clean Up and Stabilization +  Smart Tour Integration + Research Canvas Core*

1. **Smart Node Integration** - Make all tour waypoints use `enhancedEntityNodePOC`  
   - **File:** `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
   - **Success:** Tours display enhanced nodes with AI badges
   - **Timeline:** 2 days

2. **Spatial Intelligence Integration** - Connect tours with `useSpatialGrouping`  
   - **File:** `apps/app/src/features/mindmap/components/grouping/`
   - **Success:** Tour nodes auto-group by proximity and context
   - **Timeline:** 3 days

3. **Enhance Research Canvas Components** - Improve core research workflow  
   - **Files:** `apps/app/src/components/research/`
   - **Success:** Smooth discovery-to-research transition
   - **Timeline:** 2 days
   -
4. **Expand Contextual Intelligence System** - Enhanced relationship detection  
   - **File:** `apps/app/src/features/mindmap/utils/contextual-intelligence.ts`
   - **Success:** AI-driven relationship suggestions and tour progression
   - **Timeline:** 3 days
5. **Create Guided Tour State Management** - Tour progression and narrative state  
   - **File:** `apps/app/src/contexts/mindmap/` (new tour context)
   - **Success:** Persistent tour progress with session restoration
   - **Timeline:** 2 days

<!-- What does this even mean? -->
6. **Research Session Automation** - Automatic session creation from spatial grouping  
   - **File:** `apps/app/src/contexts/mindmap/session-notes-context.tsx`
   - **Success:** Sessions auto-created when users group related entities
   - **Timeline:** 2 days

---

## **🎯 Xata Postgres Wire: Foundation Stabilization**

### **Critical Infrastructure (Must Complete First)**

1. **Assess Postgres Wire Enabled Xata Migration** - Evaluate impact and plan transition
   - **Problem:** Need to migrate from current Xata instance to Postgres Wire Enabled instance
   - **Files:** Database connection configurations, data migration scripts
   - **Success:** Clear migration plan with risk assessment and rollback strategy
   - **Timeline:** 1 day

2. **Seed Postgres Wire Enabled Xata Instance** - Set up new database infrastructure
   - **Problem:** New instance needs a few tables seeded syill

<!-- 3. **Consolidate Research Canvas Workspace** - Merge standalone app into main features
   - **Source:** `@apps/research-canvas/` (standalone Next.js app)
   - **Target:** `@apps/app/src/features/research-canvas/` (existing robust structure)
   - **Success:** TipTap components, RAG integration, and research tools consolidated
   - **Timeline:** 1 day -->

## **🎯 WEEK 4: Integration & Testing**

### **System Integration & Validation**

10. **Test Complete Research Workflow** - End-to-end user journey validation  
    - **Success:** Mindmap → Research Canvas → Session → Documentation flow works
    - **Timeline:** 2 days

11. **RAG-TipTap Integration Testing** - Verify Generate, Summarize, Fact Check commands  
    - **File:** Research editor integration
    - **Success:** AI commands work with multi-RAG backend (Postgres+CocoIndex, OpenAI, Upstash)
    - **Timeline:** 1 day

12. **Performance Optimization** - Database queries and response times  
    - **Success:** Sub-2s response times for all core operations
    - **Timeline:** 2 days

---

## **🚀 NEW PRIORITY FEATURES**

### **Ready for Implementation (From FEATURES.md)**

**⚠️ WHITEBOARD REQUIRED: External Web Resources RAG Integration**
- **Status:** Architecture designed, requires strategic discussion
- **Note:** Need to whiteboard Prometheus tool architecture and Firecrawl integration strategy
- **Decision Points:** Tool formalization approach, crawling priorities, rate limits
- **Timeline:** TBD after whiteboard session

**21. Prometheus API Consolidation** ⭐ **Priority 2**
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

**22. Workspace-Wide Prompts System** 🔄 **Priority 3**
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
- **Integration:** TypeScript interfaces, template engine, cross-package sharing
- **Files:** Create new workspace package, refactor existing prompt usage
- **Success:** Centralized prompt management with version control and performance optimization
- **Timeline:** 3 days

**23. TipTap AI RAG Integration** ✍️ **Priority 4**
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

---

## **📚 DOCUMENTATION CONSOLIDATION**

### **Critical Documentation Tasks**

16. **Consolidate RAG System Documentation** - Single source of truth for current architecture  
    - **Output:** Updated CLAUDE.md with current RAG strategy
    - **Timeline:** 0.5 days

17. **Update Project Structure** - Reflect current priorities and completed work  
    - **File:** `PROJECT_STRUCTURE.md`
    - **Timeline:** 0.5 days

18. **Archive Outdated Documentation** - Remove or consolidate duplicate files  
    - **Target:** Reduce from 284 to ~150 active documentation files
    - **Timeline:** 1 day

---

## **🔮 FUTURE PHASE (Post-MVP)**

### **Advanced Features (Not Current Priority)**

19. **Multi-user Collaboration** - Real-time research session sharing  
    - **Condition:** After core UX is stable and validated
    - **Timeline:** TBD

20. **Advanced Analytics** - Research pattern analysis and insights  
    - **Condition:** After sufficient user data and feedback
    - **Timeline:** TBD

---

## **🗂️ Key Implementation Files**

### **Core Research Canvas**

- `apps/app/src/components/research/pinned-cards-canvas.tsx`
- `apps/app/src/components/research/research-interface.tsx`
- `apps/app/src/components/research/evidence-browser.tsx`

### **Smart Tour Integration**

- `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
- `apps/app/src/features/mindmap/utils/contextual-intelligence.ts`
- `apps/app/src/features/mindmap/components/grouping/`

### **RAG System Architecture**

- `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py` (Triple RAG)
- `apps/disclosure-rag/lib/storage/local_vector_library.py` (Backup system)

### **Database Integration**

- `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts`
- `packages/db/xata/api/` (Database utilities)

---

## **🎯 Strategic Focus**

**Primary Goal:** Create compelling UFO/UAP research experience through spatial intelligence and guided exploration

**Core User Journey:**

1. **Discovery** (Mindmap with AI-enhanced nodes)
2. **Investigation** (Research Canvas with contextual grouping)
3. **Documentation** (Persistent research sessions)
4. **Narrative** (Guided historical tours)

**Technical Strategy:**

- Build on existing spatial intelligence foundation
- Leverage current Triple RAG implementation
- Focus on user experience over technical complexity
- Validate with complete workflows before expanding

---

*This consolidated TODO focuses on core user experience delivery with realistic timelines and clear success criteria. Advanced features are deferred until foundation is stable and validated.*
