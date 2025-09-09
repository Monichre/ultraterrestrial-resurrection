# Daily Work Plan - Unified Mindmap Foundation Architecture

**Date**: January 15, 2025  
**Session**: Unified Mindmap Foundation Sprint  
**Duration**: 7 Days (Tasks 6-8 from docs/plans/TODO.md)  
**Focus**: Mock Entity Extraction Replacement + State Management + Enhanced Node Standardization

---

## 🎯 Project Overview

This work plan implements the **Unified Mindmap Foundation Architecture** (docs/plans/TODO.md Tasks 6-8), consolidating fragmented mindmap systems into a coherent foundation. This sprint assumes database infrastructure (Tasks 1-5) is complete.

**Core Objectives:**
1. **Replace Mock Entity Extraction with Real Implementation** (Task 6) - Fix fake NER in mindmap routes
2. **Unified State Management Architecture** (Task 7) - Centralized Zustand store with real-time sync
3. **Enhanced Node Standardization** (Task 8) - Consistent `enhancedEntityNodePOC` across all contexts

---

## 📖 Three-Tier Project Management Reference

This work plan follows the **Three-Tier Project Management System** as defined in AGENT.md:

### Tier 1: Strategic Planning - `docs/plans/FEATURES.md`
- High-level feature concepts and architectural decisions
- Long-term vision and complex architectural changes

### Tier 2: Actionable Tickets - `docs/plans/TODO.md`  
- Ready-to-implement tasks with clear success criteria
- Features ready for execution (this work plan implements Tasks 6-8)

### Tier 3: Daily Execution - `DAILY_WORK_PLAN.md` (this file)
- Current sprint execution and tactical implementation
- Active development and immediate priorities

---

## 📋 Day 1-2: Replace Mock Entity Extraction with Real Implementation (Task 6)

### Day 1: Analyze Mock vs Real Entity Extraction

**Morning: Identify Mock Implementations (4 hours)**

**🔍 Task 1.1: Find All Mock Entity Extraction Code**
- **Scope**: Locate fake NER implementations in mindmap routes
- **Target Files**:
  - `@apps/app/src/app/api/disclosure/mindmap/` - Contains mock entity extraction
  - `@apps/app/src/app/api/disclosure/chat/` - Contains real NER implementation
- **Deliverable**: List of all mock code that needs replacement

**🔧 Task 1.2: Analyze Real NER Implementation**
- **Focus**: Understand how sophisticated NER works in disclosure/chat
- **Activities**:
  - Study entity extraction logic in disclosure/chat routes
  - Document the NER functions and their interfaces
  - Identify dependencies and requirements
- **Output**: Clear understanding of real NER implementation to copy

**Afternoon: Plan Entity Extraction Migration (4 hours)**

**🔧 Task 1.3: Create Migration Plan**
- **Goal**: Replace mock entity extraction with real implementation
- **Steps**:
  - Copy NER functions from disclosure/chat to disclosure/mindmap
  - Update mindmap routes to use real entity extraction
  - Test entity extraction works with mindmap data
- **Testing**: Verify entities are extracted correctly from mindmap content

**🔧 Task 1.4: Prepare for Implementation**
- **Setup**: Ensure all dependencies are available
- **Backup**: Create backup of current mindmap routes
- **Environment**: Test in development environment first

### Day 2: Implement Real Entity Extraction

**Morning: Copy and Adapt NER Code (4 hours)**

**🔧 Task 2.1: Copy Real NER Functions**
- **Source**: `@apps/app/src/app/api/disclosure/chat/` 
- **Target**: `@apps/app/src/app/api/disclosure/mindmap/`
- **Action**: Copy the working entity extraction logic
- **Goal**: Make real NER available in mindmap routes

**🔧 Task 2.2: Update Mindmap Routes to Use Real NER**
- **Files**: All route files in `@apps/app/src/app/api/disclosure/mindmap/`
- **Changes**: Replace mock/fake entity extraction calls with real NER
- **Testing**: Verify entities are correctly extracted from mindmap content
- **Validation**: Ensure extracted entities match expected format

**Afternoon: Test and Validate Entity Extraction (4 hours)**

**🔧 Task 2.3: Test Real Entity Extraction**
- **Goal**: Verify mock replacement worked correctly
- **Testing**: 
  - Test mindmap entity extraction with real content
  - Compare extracted entities to expected results
  - Verify entity types (People, Organizations, Events, Locations)
  - Check confidence scores and accuracy

**🔧 Task 2.4: Clean Up and Document Changes**
- **Cleanup**: Remove all mock/fake entity extraction code
- **Documentation**: Document what was changed and how to use real NER
- **Validation**: Final testing to ensure no mock code remains
- **Performance**: Check that real NER performs adequately

---

## 📋 Day 3-5: Unified State Management Architecture (Task 7)

### Day 3: State Architecture Analysis & Design

**Morning: Current State Analysis (4 hours)**

**🔧 Task 3.1: Map Existing State Management**
- **Scope**: Analyze all mindmap-related state across application
- **Areas**:
  - Mindmap node state and positioning
  - Tour progression and navigation state
  - Research session state
  - UI interaction state (selections, filters, etc.)
- **Output**: Complete state dependency map

**🔧 Task 3.2: Identify State Fragmentation Issues**
- **Problems**: Inconsistent state updates, data duplication, sync issues
- **Analysis**: Performance impact of current fragmented approach
- **Dependencies**: Real-time collaboration requirements
- **Integration Points**: Liveblocks, session storage, API state

**Afternoon: Unified Store Design (4 hours)**

**🔧 Task 3.3: Design Centralized Zustand Store**
- **File**: `@apps/app/src/stores/mindmap-unified-store.ts`
- **Architecture**:
  ```typescript
  interface MindmapUnifiedState {
    // Node management
    nodes: Map<string, EnhancedNode>
    edges: Map<string, Edge>
    
    // Tour state
    currentTour: Tour | null
    tourProgress: TourProgress
    
    // Session state
    activeSession: ResearchSession | null
    sessionHistory: ResearchSession[]
    
    // UI state
    viewport: Viewport
    selections: Set<string>
    filters: FilterState
    
    // Real-time collaboration
    collaborators: Map<string, Collaborator>
    cursors: Map<string, CursorPosition>
  }
  ```

**🔧 Task 3.4: Real-time Synchronization Strategy**
- **Integration**: Liveblocks for collaborative features
- **Conflict Resolution**: Operational transform patterns
- **Persistence**: Session storage and database sync
- **Performance**: Selective updates and batching

### Day 4: Store Implementation

**Morning: Core Store Development (4 hours)**

**🔧 Task 4.1: Implement Base Store Structure**
- **File**: `@apps/app/src/stores/mindmap-unified-store.ts`
- **Features**:
  - Zustand store with TypeScript
  - Persistence middleware
  - Development tools integration
  - Performance monitoring

**🔧 Task 4.2: Node Management Actions**
- **Actions**:
  - `addNode`, `updateNode`, `removeNode`
  - `addEdge`, `updateEdge`, `removeEdge`
  - `selectNodes`, `clearSelection`
  - `applyLayout`, `resetLayout`
- **Optimization**: Batch updates and memoization

**Afternoon: Advanced State Features (4 hours)**

**🔧 Task 4.3: Tour State Management**
- **Actions**:
  - `startTour`, `pauseTour`, `resumeTour`, `endTour`
  - `navigateToStep`, `markStepComplete`
  - `saveProgress`, `restoreProgress`
- **Integration**: Tour progression with spatial intelligence

**🔧 Task 4.4: Session State Management**
- **Actions**:
  - `createSession`, `updateSession`, `archiveSession`
  - `addEvidence`, `removeEvidence`, `updateEvidence`
  - `exportSession`, `shareSession`
- **Persistence**: Auto-save and recovery mechanisms

### Day 5: Real-time Collaboration & Migration

**Morning: Collaboration Integration (4 hours)**

**🔧 Task 5.1: Liveblocks Integration**
- **Setup**: Liveblocks provider and room configuration
- **Features**:
  - Real-time cursor tracking
  - Live selection sharing
  - Collaborative editing indicators
  - Presence awareness

**🔧 Task 5.2: Conflict Resolution**
- **Implementation**: Operational transform for concurrent updates
- **Strategies**: Last-writer-wins, merge algorithms, user resolution
- **Testing**: Multi-user scenario validation
- **Performance**: Optimistic updates with rollback

**Afternoon: Component Migration (4 hours)**

**🔧 Task 5.3: Migrate Core Components**
- **Target Components**:
  - Mindmap canvas and viewport
  - Node and edge components
  - Tour navigation components
  - Research session components
- **Migration**: Replace local state with unified store

**🔧 Task 5.4: Integration Testing**
- **Testing**: All components with unified state
- **Validation**: State consistency across components
- **Performance**: Memory usage and update performance
- **Collaboration**: Multi-user testing scenarios

---

## 📋 Day 6-7: Enhanced Node Standardization (Task 8)

### Day 6: Node Analysis & Standardization

**Morning: Node Implementation Audit (4 hours)**

**🔧 Task 6.1: Map Current Node Implementations**
- **Scope**: All mindmap node components across different contexts
- **Analysis**:
  - Standard nodes vs enhanced nodes
  - Feature inconsistencies
  - Performance variations
  - UI/UX differences
- **Output**: Node standardization roadmap

**🔧 Task 6.2: Enhanced Node Feature Analysis**
- **Reference**: `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
- **Features**:
  - AI badges and contextual intelligence
  - Interactive elements and animations
  - Accessibility compliance
  - Performance optimizations
- **Gap Analysis**: Missing features in standard nodes

**Afternoon: Node Component Enhancement (4 hours)**

**🔧 Task 6.3: Enhance Core Node Component**
- **File**: `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
- **Improvements**:
  - Performance optimizations
  - Accessibility enhancements
  - Mobile responsiveness
  - Consistent styling system
- **Integration**: Unified state management

**🔧 Task 6.4: Create Node Variants System**
- **Implementation**: Configurable node types and variations
- **Variants**: 
  - Standard entity nodes
  - Tour waypoint nodes
  - Research evidence nodes
  - Collaboration indicator nodes
- **Consistency**: Shared base component with variations

### Day 7: Migration & Validation

**Morning: Component Migration (4 hours)**

**🔧 Task 7.1: Migrate All Node Implementations**
- **Scope**: Replace all standard nodes with enhanced nodes
- **Components**:
  - Mindmap canvas nodes
  - Tour waypoint nodes
  - Search result nodes
  - Session evidence nodes
- **Validation**: Feature parity and performance

**🔧 Task 7.2: Tour Integration**
- **Enhancement**: All tour waypoints use enhanced nodes
- **Features**: 
  - AI badges showing tour context
  - Progress indicators
  - Interactive narrative elements
  - Spatial grouping visualization

**Afternoon: Final Testing & Optimization (4 hours)**

**🔧 Task 7.3: Comprehensive Integration Testing**
- **Testing Scenarios**:
  - Complete mindmap workflows
  - Tour navigation with enhanced nodes
  - Research session creation and management
  - Real-time collaboration features
- **Performance**: End-to-end performance validation

**🔧 Task 7.4: Performance Optimization**
- **Optimization Areas**:
  - Node rendering performance
  - State update efficiency
  - Memory usage optimization
  - Bundle size reduction
- **Metrics**: Performance benchmarks and monitoring

---

## 🔄 Success Metrics & Validation

### Technical Metrics
- **API Consolidation**: 50%+ reduction in redundant endpoints
- **Response Time**: <500ms for all unified API endpoints
- **State Management**: Single source of truth with <100ms update propagation
- **Node Consistency**: 100% enhanced node adoption across all contexts

### User Experience Metrics
- **Performance**: Sub-2s initial load time, <200ms interaction response
- **Consistency**: Uniform node behavior across all features
- **Collaboration**: Real-time updates with <1s latency
- **Reliability**: 99.9%+ uptime with graceful error handling

### Development Metrics
- **Code Reduction**: 40%+ reduction in duplicate state management code
- **API Clarity**: Single unified API documentation
- **Maintainability**: Centralized state with clear update patterns
- **Test Coverage**: 90%+ coverage for unified store and API endpoints

---

## 🚀 Risk Mitigation & Contingency Plans

### High-Risk Items
1. **State Migration Complexity**: Gradual migration with fallback mechanisms
2. **API Breaking Changes**: Comprehensive deprecation strategy with backward compatibility
3. **Real-time Collaboration**: Conflict resolution and performance optimization
4. **Performance Regression**: Continuous monitoring with rollback procedures

### Contingency Plans
- **API Issues**: Maintain old endpoints during transition period
- **State Corruption**: Automatic backup and recovery mechanisms
- **Performance Problems**: Progressive enhancement with feature toggles
- **Collaboration Conflicts**: Manual resolution UI and administrative controls

---

## 📝 Daily Status Tracking

**Daily Schedule:**
- **Morning Standup** (9:00 AM): Progress review, blocker identification, day planning
- **Midday Check** (1:00 PM): Status updates, adjustment planning, risk assessment
- **End-of-Day Summary** (5:00 PM): Completed tasks, next-day preparation, metrics review
- **Documentation Updates**: Real-time progress tracking with learnings and decisions

**Success Criteria for Sprint Completion:**
✅ All API endpoints consolidated into unified `/api/prometheus/` structure  
✅ Unified state management with real-time collaboration working  
✅ All mindmap nodes using enhanced implementation consistently  
✅ Performance metrics meeting or exceeding targets  
✅ Comprehensive test coverage with passing validation  

---

**Last Updated**: January 15, 2025  
**Sprint Duration**: 9 Days (Tasks 6-8)  
**Next Phase**: Research Canvas & Smart Tours Integration (Tasks 9-14)  
**Project Manager**: Claude Code (Sonnet 4)  
**Stakeholder**: Liam Ellis

**Reference Documentation:**
- Strategic Planning: `docs/plans/FEATURES.md`
- Current Tasks: `docs/plans/TODO.md`
- Development Guidelines: `AGENT.md`
- Agent Configuration: `docs/agents/AGENT_ONBOARDING_CHECKLIST.md`