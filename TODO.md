# TODO List - Ultraterrestrial Resurrection Project

**Generated:** June 25, 2025  
**Updated:** Prioritized for Research Canvas & Guided Historical Tour Development  
**Source:** Analysis of recent markdown files from apps/docs/, apps/app/, and apps/disclosure-rag/  
**Focus:** @apps/app/ research canvas, guided historical tours, and contextual intelligence

---

## **🎯 PRIMARY DEVELOPMENT FOCUS (TOP PRIORITY)**

### **Research Canvas & Guided Historical Tour Development**

#### **Conceptual Framework & Design**
1. **Design guided historical tour architecture** - Create narrative flow system from Roswell 1947 → Present
2. **Enhance contextual intelligence system** - Build on existing `contextual-intelligence.ts` implementation
3. **Research canvas workflow design** - Complete thought work for spatial research workflows
4. **Historical narrative templates** - Create pre-defined disclosure tour paths and progression logic

#### **Core Research Canvas Implementation** 
5. **Enhance existing research canvas components** in `@apps/app/src/components/research/`
   - `pinned-cards-canvas.tsx` - Spatial research workspace
   - `research-interface.tsx` - Complete research workflow
   - `evidence-browser.tsx` - Entity selection and filtering
6. **Improve research session automation** - Build on spatial grouping for automatic session creation
7. **Enhanced research editor integration** - Connect TipTap editor with contextual intelligence

#### **Mindmap Contextual Intelligence Enhancement**
8. **Expand contextual-intelligence.ts** in `@apps/app/src/features/mindmap/utils/`
   - Enhanced relationship detection algorithms
   - Guided tour progression logic
   - Research session context preservation
9. **Enhance mindmap-bottom-menu contextual features** - Improve user experience for guided exploration
10. **Smart node positioning for narrative flow** - Position nodes to support storytelling progression

#### **Research Session & Context Management**
11. **Enhance session-notes-context.tsx** in `@apps/app/src/contexts/mindmap/`
12. **Create guided tour state management** - New context for tour progression and narrative state
13. **Research session persistence** - Save and restore guided tour progress
14. **Multi-session workflow support** - Connect multiple research sessions into larger investigations

---

## **🔧 Secondary Technical Tasks (High Priority)**

### **Mindmap & Node System (Supporting Research Canvas)**
15. **Verify database queries are returning records properly** (from Enhanced Node POC Status)
16. **Test full flow from user input → database query → entity node creation → edge connections** 
17. **Debug why `xataToXYFlow` might not be returning records when clicking entity types**
18. **Enhance visual design of nodes for research narratives** - Support guided tour aesthetics
19. **Implement responsive design for different screen sizes**

### **Database Synchronization (Supporting Research Data)** 
20. **Export data from Xata using existing backup.sh script** (from IMMEDIATE_SYNC_STEPS.md)
21. **Create PostgreSQL import script using existing TypeScript database connector**
22. **Generate embeddings for PostgreSQL using adapted update-vectors.ts script**
23. **Sync to Upstash Vector using existing patterns**
24. **Create OpenAI Vector Store using documented approach**
25. **Run master sync script to synchronize all databases**
26. **Set up environment variables for full sync (DATABASE_URL, OPENAI_API_KEY, etc.)**

### **Disclosure RAG System (Supporting Research Context)**
27. **Complete Agent Orchestration: Finish research crew implementation** (from Status Report)
28. **Fix Missing Chat Files: Locate or recreate missing Agno chat implementations**
29. **Database Sync Deployment: Implement documented synchronization plans**
30. **Enhanced Error Handling: Add more robust error recovery**
31. **Set up Upstash Search credentials to enable cloud sync**

## **🚀 Medium-Term Development Goals (Medium Priority)**

### **RAG-TipTap Integration**
18. **Create FastAPI wrapper for RAG system** (Phase 1, Week 1-2)
19. **Set up API Gateway with authentication**
20. **Implement secure credential storage for TipTap**
21. **Develop RAG TipTap extension** (Phase 2, Week 3-4)
22. **Implement suggestion plugin and citation node type**
23. **Integrate with Research Editor and enhance AI menu**

### **Spatial Intelligence System**
24. **Complete Research Session Automation** (Phase 3 from Spatial Intelligence Status)
25. **Implement advanced interaction patterns (click+hold, tethering, gestures)**
26. **Add AI context awareness for spatial relationships**

### **Performance & Quality**
27. **API Rate Limiting: Implement intelligent rate limiting for external APIs**
28. **Test Suite Expansion: Comprehensive unit and integration tests**
29. **Performance Optimization: Database query optimization and caching**
30. **Formal load testing for high-volume usage scenarios**

## **📚 Documentation & Validation Tasks**

31. **Documentation Enhancement: User guides and API documentation**
32. **Test complete workflow with real YouTube videos** (Disclosure RAG)
33. **Frontend testing with document browsing**
34. **Run consistency checks across all databases**
35. **Create sync monitoring dashboard**
36. **Bulk sync existing content to Upstash Search (optional)**

## **🔮 Future Strategic Initiatives (Low Priority)**

### **Advanced Features**
37. **Multi-user Support: User authentication and personalized knowledge bases**
38. **Advanced Analytics: Trend analysis and predictive modeling** 
39. **Mobile Interface: Responsive design for mobile devices**
40. **Integration Ecosystem: Plugins for external research tools**
41. **AI-native TipTap editor integration**
42. **Multi-user collaboration features**
43. **3D visualization and advanced analytics**

### **Security & Compliance**
44. **Security audit for production readiness**
45. **External data integration (government databases, FOIA)**
46. **Mobile companion app for field research**

## **⚠️ Known Issues to Address**

47. **Fix upload display bug that shows failed when uploads succeeded** (fixed but validate)
48. **Resolve Charm Tools dependency for enhanced CLI experience**
49. **Optimize memory usage for large document processing**
50. **Implement automatic retry mechanisms for failed operations**

## **🔄 Weekly/Monthly Maintenance**

51. **Regular Updates: API dependency updates monthly**
52. **Database Maintenance: PostgreSQL optimization quarterly**
53. **Log Rotation: Automated log management**
54. **API Key Rotation: Security best practice compliance**

---

## **Priority Breakdown**
- **High Priority:** 17 items (Tasks 1-17)
- **Medium Priority:** 20 items (Tasks 18-36) 
- **Low Priority:** 11 items (Tasks 37-46)
- **Maintenance:** 6 items (Tasks 47-54)

## **Quick Reference - Key Files Mentioned**

### **Database Sync Scripts**
- `apps/app/scripts/xata-exports/backup.sh` - Export Xata data
- `apps/disclosure-rag/scripts/import-from-xata-export.ts` - Import to PostgreSQL
- `apps/disclosure-rag/scripts/generate-pgvector-embeddings.ts` - Generate embeddings
- `apps/disclosure-rag/scripts/sync-all-databases.ts` - Master sync script

### **Core Implementation Files**
- `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx` - Enhanced node POC
- `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts` - Database query flow
- `apps/disclosure-rag/lib/enhanced_main_integration.py` - RAG integration
- `apps/disclosure-rag/lib/terminal_display.py` - Terminal UI system

### **Environment Configuration**
```bash
# Required for database sync
DATABASE_URL=postgresql://user:pass@localhost:5432/ultraterrestrial
OPENAI_API_KEY=sk-xxxxx
UPSTASH_VECTOR_URL=https://xxxxx.upstash.io
UPSTASH_VECTOR_TOKEN=xxxxx
UPSTASH_SEARCH_URL=your_upstash_search_url
UPSTASH_SEARCH_TOKEN=your_upstash_search_token
```

## **🎯 Immediate Next Actions (Research Canvas Focus)**

### **Week 1-2: Research Canvas Conceptual Development**
1. **Analyze existing research canvas components** - Review current implementation and identify enhancement opportunities
2. **Design guided historical tour architecture** - Create narrative flow system from Roswell 1947 → Present
3. **Enhance contextual intelligence system** - Build on existing `contextual-intelligence.ts` implementation
4. **Create research session automation framework** - Design automatic session creation from spatial grouping

### **Week 3-4: Core Implementation** 
5. **Enhance research canvas components** - Improve `pinned-cards-canvas.tsx`, `research-interface.tsx`, `evidence-browser.tsx`
6. **Implement guided tour state management** - New context for tour progression and narrative state
7. **Expand mindmap contextual intelligence** - Enhanced relationship detection and tour progression logic
8. **Create historical narrative templates** - Pre-defined disclosure tour paths

### **Supporting Technical Tasks (As Needed)**
9. **Verify mindmap node creation flow** - Debug entity node generation issues (if blocking research canvas)
10. **Start database synchronization** - Run Xata export and PostgreSQL import (if needed for research data)
11. **Set up missing environment variables** - Enable full system integration (if blocking research features)

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