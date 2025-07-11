# TODO List - Ultraterrestrial Resurrection Project

**Generated:** June 25, 2025  
**Updated:** July 9, 2025 - Task #31 marked complete, Triple RAG adapter tasks added  
**Source:** Analysis of recent markdown files from apps/docs/, apps/app/, and apps/disclosure-rag/  
**Focus:** @apps/app/ research canvas, guided historical tours, and contextual intelligence

## **🔍 RAG System Architecture Overview (Updated July 2, 2025)**

**FIVE RAG/Vector Storage Systems Available:**
1. **Triple RAG Adapter** - Upstash (40%) + LocalRAG FAISS (40%) + CocoIndex PostgreSQL (20%) - *Currently Active*
2. **LocalVectorLibrary** - Complete local document ownership with SQLite + Chroma/FAISS - *Available*
3. **HybridVectorManager** - Multi-backend (OpenAI, Chroma, Pinecone, FAISS) with local storage - *Available*
4. **PostgreSQL + pgvector** - Advanced analytics with 1536-dim vectors, HNSW indexes - *Schema ready*
5. **PGVector Library** - Document clustering and entity analysis - *Available*

**Note:** CocoIndex has been **enabled** in the environment (COCOINDEX_ENABLED=true)

---

## **🎯 PRIMARY DEVELOPMENT FOCUS (TOP PRIORITY)**

### **Research Canvas & Guided Historical Tour Development**

#### **Smart Tour Integration (ACTIVE - July 2, 2025)**
**Reference:** `@apps/app/SMART_TOUR_INTEGRATION_PLAN.md` - Comprehensive AI integration plan
**Current Status:** Planning Complete - Ready for Phase 1 Implementation
**Integration Score:** 65% (Target: 100% AI connectivity)

1. **Phase 1: Smart Node Integration** (1-2 days) - Make all tour waypoints use `enhancedEntityNodePOC`
2. **Phase 2: Spatial Intelligence Integration** (2-3 days) - Connect tours with `useSpatialGrouping`
3. **Phase 3: Intelligent Layout System** (2-3 days) - AI-driven narrative positioning
4. **Phase 4: Full Smart Integration** (3-4 days) - Complete AI connectivity across all components

#### **Conceptual Framework & Design**
5. **Design guided historical tour architecture** - Create narrative flow system from Roswell 1947 → Present
6. **Enhance contextual intelligence system** - Build on existing `contextual-intelligence.ts` implementation
7. **Research canvas workflow design** - Complete thought work for spatial research workflows
8. **Historical narrative templates** - Create pre-defined disclosure tour paths and progression logic

#### **Core Research Canvas Implementation** 
9. **Enhance existing research canvas components** in `@apps/app/src/components/research/`
   - `pinned-cards-canvas.tsx` - Spatial research workspace
   - `research-interface.tsx` - Complete research workflow
   - `evidence-browser.tsx` - Entity selection and filtering
10. **Improve research session automation** - Build on spatial grouping for automatic session creation
11. **Enhanced research editor integration** - Connect TipTap editor with contextual intelligence

#### **Mindmap Contextual Intelligence Enhancement**
12. **Expand contextual-intelligence.ts** in `@apps/app/src/features/mindmap/utils/`
   - Enhanced relationship detection algorithms
   - Guided tour progression logic
   - Research session context preservation
13. **Enhance mindmap-bottom-menu contextual features** - Improve user experience for guided exploration
14. **Smart node positioning for narrative flow** - Position nodes to support storytelling progression

#### **Research Session & Context Management**
15. **Enhance session-notes-context.tsx** in `@apps/app/src/contexts/mindmap/`
16. **Create guided tour state management** - New context for tour progression and narrative state
17. **Research session persistence** - Save and restore guided tour progress
18. **Multi-session workflow support** - Connect multiple research sessions into larger investigations

---

## **🔧 Secondary Technical Tasks (High Priority)**

### **Mindmap & Node System (Supporting Research Canvas)**
19. **Verify database queries are returning records properly** (from Enhanced Node POC Status)
20. **Test full flow from user input → database query → entity node creation → edge connections** 
21. **Debug why `xataToXYFlow` might not be returning records when clicking entity types**
22. **Enhance visual design of nodes for research narratives** - Support guided tour aesthetics
23. **Implement responsive design for different screen sizes**

### **Database Synchronization (Supporting Research Data)** 
24. **Export data from Xata using existing backup.sh script** (from IMMEDIATE_SYNC_STEPS.md)
25. **Create PostgreSQL import script using existing TypeScript database connector**
26. **Generate embeddings for PostgreSQL using adapted update-vectors.ts script**
27. **Sync to Upstash Vector using existing patterns**
28. **Create OpenAI Vector Store using documented approach**
29. **Run master sync script to synchronize all databases**
30. **Set up environment variables for full sync (DATABASE_URL, OPENAI_API_KEY, etc.)**

### **Disclosure RAG System (Supporting Research Context) - UPDATED**
31. **Complete Agent Orchestration: Finish research crew implementation** (from Status Report)
32. **Fix Missing Chat Files: Locate or recreate missing Agno chat implementations**
33. **Test Triple RAG System: CocoIndex now enabled - verify parallel search functionality**
34. **Local Library Consolidation: Use LocalVectorLibrary to consolidate scattered documents**
35. **Hybrid Vector Migration: Migrate from OpenAI vector stores using HybridVectorManager**
36. **Enhanced Error Handling: Add more robust error recovery across all RAG systems**
37. **Set up Upstash Search credentials to enable cloud sync**

## **🚀 Medium-Term Development Goals (Medium Priority)**

### **RAG-TipTap Integration - ENHANCED**
38. **Test existing RAG-TipTap integration** - Verify Generate, Summarize, Fact Check commands work
39. **Add LocalVectorLibrary backend to TipTap** - Enable local document search in research editor
40. **Implement RAG backend switching** - Allow users to choose between cloud/local RAG systems
41. **Enhanced citation system** - Show which RAG backend provided each result (☁️ Cloud, 💾 Local)
42. **Multi-RAG result merging** - Combine results from multiple RAG systems in TipTap
43. **Performance optimization** - Cache RAG results for faster TipTap responses

### **Spatial Intelligence System**
44. **Complete Research Session Automation** (Phase 3 from Spatial Intelligence Status)
45. **Implement advanced interaction patterns (click+hold, tethering, gestures)**
46. **Add AI context awareness for spatial relationships**

### **Performance & Quality**
47. **API Rate Limiting: Implement intelligent rate limiting for external APIs**
48. **Test Suite Expansion: Comprehensive unit and integration tests**
49. **Performance Optimization: Database query optimization and caching**
50. **Formal load testing for high-volume usage scenarios**

## **📚 Documentation & Validation Tasks - UPDATED**

51. **Document RAG System Architecture** - Create comprehensive guide for all 5 RAG systems
52. **Test Triple RAG workflow** - Verify Upstash + LocalRAG + CocoIndex parallel search
53. **LocalVectorLibrary setup guide** - Document consolidation process for scattered libraries
54. **Frontend testing with multiple RAG backends** - Test TipTap with all available systems
55. **Run consistency checks across all databases** - Verify data sync between systems
56. **Create RAG performance monitoring dashboard** - Track search quality across backends
57. **Test complete workflow with real documents** - End-to-end validation

## **🔮 Future Strategic Initiatives (Low Priority)**

### **Advanced Features**
58. **Multi-user Support: User authentication and personalized knowledge bases**
59. **Advanced Analytics: Trend analysis and predictive modeling** 
60. **Mobile Interface: Responsive design for mobile devices**
61. **Integration Ecosystem: Plugins for external research tools**
62. **AI-native TipTap editor integration**
63. **Multi-user collaboration features**
64. **3D visualization and advanced analytics**
65. **RAG System Auto-Switching** - Intelligent backend selection based on query type
66. **Cross-RAG Entity Linking** - Connect entities across different vector stores

### **Security & Compliance**
67. **Security audit for production readiness**
68. **External data integration (government databases, FOIA)**
69. **Mobile companion app for field research**
70. **Local data privacy audit** - Ensure LocalVectorLibrary meets privacy requirements
71. **RAG system security review** - Audit all vector storage implementations

## **⚠️ Known Issues to Address - UPDATED**

72. **Fix upload display bug that shows failed when uploads succeeded** (fixed but validate)
73. **Resolve Charm Tools dependency for enhanced CLI experience**
74. **Optimize memory usage for large document processing**
75. **Implement automatic retry mechanisms for failed operations**
76. **Fix database credential exposure** - Move credentials from .env to .env.local
77. **Test CocoIndex PostgreSQL connection** - Verify local database setup works
78. **Resolve RAG system dependencies** - Ensure all required packages installed

## **🔄 Weekly/Monthly Maintenance - UPDATED**

79. **Regular Updates: API dependency updates monthly**
80. **Database Maintenance: PostgreSQL optimization quarterly**
81. **Log Rotation: Automated log management**
82. **API Key Rotation: Security best practice compliance**
83. **RAG System Health Checks: Monitor all vector stores monthly**
84. **Local Library Cleanup: Archive old documents and optimize indexes**
85. **Vector Index Optimization: Rebuild FAISS/Chroma indexes for performance**

---

## **Priority Breakdown - UPDATED**
- **High Priority:** 37 items (Tasks 1-37)
- **Medium Priority:** 13 items (Tasks 38-50) 
- **Documentation/Validation:** 7 items (Tasks 51-57)
- **Low Priority:** 14 items (Tasks 58-71)
- **Known Issues:** 7 items (Tasks 72-78)
- **Maintenance:** 7 items (Tasks 79-85)

**Total:** 85 tasks (was 81)

## **Quick Reference - Key Files Mentioned**

### **Database Sync Scripts**
- `apps/app/scripts/xata-exports/backup.sh` - Export Xata data
- `apps/disclosure-rag/scripts/import-from-xata-export.ts` - Import to PostgreSQL
- `apps/disclosure-rag/scripts/generate-pgvector-embeddings.ts` - Generate embeddings
- `apps/disclosure-rag/scripts/sync-all-databases.ts` - Master sync script

### **RAG System Files - NEW**
- `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py` - Triple RAG implementation
- `apps/disclosure-rag/lib/storage/local_vector_library.py` - Local document ownership
- `apps/disclosure-rag/lib/storage/hybrid_vector_manager.py` - Multi-backend vector storage
- `apps/disclosure-rag/setup_local_library.sh` - Local library setup script

### **Core Implementation Files**
- `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx` - Enhanced node POC
- `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts` - Database query flow
- `apps/disclosure-rag/lib/enhanced_main_integration.py` - RAG integration
- `apps/disclosure-rag/lib/terminal_display.py` - Terminal UI system

### **Smart Tour Integration Files - NEW**
- `apps/app/SMART_TOUR_INTEGRATION_PLAN.md` - Comprehensive smart tour implementation plan
- `apps/app/src/features/mindmap/tours/` - Tour system components requiring smart enhancement
- `apps/app/src/features/mindmap/utils/contextual-intelligence.ts` - AI system integration point

### **Environment Configuration - UPDATED**
```bash
# Required for database sync
DATABASE_URL=postgresql://user:pass@localhost:5432/ultraterrestrial
OPENAI_API_KEY=sk-xxxxx
UPSTASH_VECTOR_URL=https://xxxxx.upstash.io
UPSTASH_VECTOR_TOKEN=xxxxx
UPSTASH_SEARCH_URL=your_upstash_search_url
UPSTASH_SEARCH_TOKEN=your_upstash_search_token

# Triple RAG Configuration - NOW ACTIVE
LOCAL_RAG_ENABLED=true
COCOINDEX_ENABLED=true
COCOINDEX_DATABASE_URL=postgresql://cocoindex:cocoindex@localhost:5432/cocoindex
UPSTASH_WEIGHT=0.4
LOCAL_RAG_WEIGHT=0.4
COCO_WEIGHT=0.2
```

## **🎯 Immediate Next Actions (Research Canvas & Smart Tour Focus)**

### **Week 1: Smart Tour Integration Implementation (TOP PRIORITY)**
**Reference:** `@apps/app/SMART_TOUR_INTEGRATION_PLAN.md`
1. **Phase 1: Smart Node Integration** (1-2 days) - Make all tour waypoints use `enhancedEntityNodePOC`
2. **Phase 2: Spatial Intelligence Integration** (2-3 days) - Connect tours with `useSpatialGrouping`
3. **Phase 3: Intelligent Layout System** (2-3 days) - AI-driven narrative positioning

### **Week 2: Research Canvas Conceptual Development**
4. **Analyze existing research canvas components** - Review current implementation and identify enhancement opportunities
5. **Design guided historical tour architecture** - Create narrative flow system from Roswell 1947 → Present
6. **Enhance contextual intelligence system** - Build on existing `contextual-intelligence.ts` implementation
7. **Create research session automation framework** - Design automatic session creation from spatial grouping

### **Week 3-4: Core Implementation** 
8. **Enhance research canvas components** - Improve `pinned-cards-canvas.tsx`, `research-interface.tsx`, `evidence-browser.tsx`
9. **Implement guided tour state management** - New context for tour progression and narrative state
10. **Expand mindmap contextual intelligence** - Enhanced relationship detection and tour progression logic
11. **Create historical narrative templates** - Pre-defined disclosure tour paths

### **Supporting Technical Tasks (As Needed) - UPDATED**
12. **Verify mindmap node creation flow** - Debug entity node generation issues (if blocking research canvas)
13. **Test Triple RAG System** - Verify CocoIndex integration now that it's enabled
14. **Start database synchronization** - Run Xata export and PostgreSQL import (if needed for research data)
15. **Consolidate local libraries** - Use LocalVectorLibrary to organize scattered documents
16. **Set up missing environment variables** - Enable full system integration (if blocking research features)

---

## **🗂️ Key Files for Research Canvas Development**

### **Primary Focus Areas**
- `@apps/app/src/components/research/` - Research canvas components
- `@apps/app/src/features/mindmap/utils/contextual-intelligence.ts` - Context system
- `@apps/app/src/contexts/mindmap/` - Mindmap and session contexts
- `@apps/app/src/features/mindmap/components/grouping/` - Spatial grouping system

### **Supporting Components**
- `@apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/` - Menu enhancements
- `@apps/app/src/features/mindmap/nodes/` - Node visual enhancements
- `@apps/app/src/layouts/historical-events-timeline/` - Timeline integration

---

## **📝 Development Notes**

**Research Canvas & Guided Historical Tour Priority Rationale:**

The focus has been shifted to prioritize research canvas and guided historical tour development within @apps/app/ based on the following key insights:

1. **Existing Foundation is Strong:** The contextual intelligence system documented in `CONTEXTUAL_INTELLIGENCE_IMPLEMENTATION_STATUS.md` provides a solid foundation for guided exploration and narrative coherence.

2. **Research Canvas is Core UX:** The research canvas represents the primary user workflow for serious UFO/UAP investigation - moving from discovery (mindmap) to focused analysis (research workspace) to documentation (research sessions).

3. **Guided Tours Enable Onboarding:** Historical tours from Roswell 1947 → Present provide structured entry points for new users while showcasing the platform's unique spatial intelligence capabilities.

4. **Spatial Intelligence Differentiator:** The proximity-based AI analysis and spatial grouping systems are unique differentiators that should be enhanced and showcased through polished research workflows.

5. **Building on Momentum:** Recent work on spatial grouping, contextual intelligence, and research components provides clear next steps rather than starting new technical initiatives.

**Key Architectural Decisions:**
- Research canvas as the bridge between discovery and documentation
- Contextual intelligence driving both mindmap exploration and research session creation  
- Guided tours as narrative-driven workflows using existing spatial intelligence
- Research sessions as persistent investigation containers with AI assistance

**Success Metrics for Research Canvas Development:**
- Time to meaningful insights reduced through guided workflows
- User engagement increased through narrative-driven exploration
- Research quality improved through contextual AI assistance
- Knowledge retention enhanced through session persistence and spatial memory

---

*This TODO list is compiled from recent documentation in apps/docs/, apps/app/, and apps/disclosure-rag/ directories and represents the current development priorities for the Ultraterrestrial Resurrection project.*