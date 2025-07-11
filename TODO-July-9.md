TOP PRIORITY (Immediate Next Actions)

  Smart Tour Integration Implementation

  Status: Planning Complete - Ready for Phase 1 Implementation (July 2,
  2025)
  Integration Score: 65% (Target: 100% AI connectivity)

  1. Phase 1: Smart Node Integration (1-2 days) - Make all tour waypoints
  use enhancedEntityNodePOC
  2. Phase 2: Spatial Intelligence Integration (2-3 days) - Connect tours
  with useSpatialGrouping
  3. Phase 3: Intelligent Layout System (2-3 days) - AI-driven narrative
  positioning
  4. Phase 4: Full Smart Integration (3-4 days) - Complete AI connectivity
  across all components

  Research Canvas & Guided Historical Tour Development

  5. Design guided historical tour architecture - Create narrative flow
  system from Roswell 1947 → Present
  6. Enhance contextual intelligence system - Build on existing
  contextual-intelligence.ts implementation
  7. Research canvas workflow design - Complete thought work for spatial
  research workflows

  🔧 HIGH PRIORITY Secondary Tasks

  Core Research Canvas Implementation

  9. Enhance existing research canvas components in
  @apps/app/src/components/research/
  10. Improve research session automation - Build on spatial grouping for
  automatic session creation
  11. Enhanced research editor integration - Connect TipTap editor with
  contextual intelligence

  Critical Technical Issues

  19. Verify database queries are returning records properly (Enhanced Node
  POC Status)
  20. Test full flow from user input → database query → entity node creation
   → edge connections
  21. Debug why xataToXYFlow might not be returning records when clicking
  entity types

  Triple RAG System Tasks (From the adapter pattern breakdown we just added)

- Task 1A: Implement TripleRAGSchemaAdapter core class
- Task 1B: Document adaptation methods with field mapping
- Task 1C: Chunk adaptation methods with batch processing
- Task 2A: SQL migration script for processing tasks table

  Key Focus Areas:

- @apps/app/src/features/mindmap/utils/contextual-intelligence.ts - AI
  system integration
- @apps/app/src/components/research/ - Research canvas components
- @apps/app/src/features/mindmap/tours/ - Tour system enhancements
- @apps/disclosure-rag/lib/adapters/ - Triple RAG adapter implementation

  The primary focus is on Research Canvas & Smart Tour Integration as the
  core user experience, with Triple RAG adapter implementation as supporting
   infrastructure.
