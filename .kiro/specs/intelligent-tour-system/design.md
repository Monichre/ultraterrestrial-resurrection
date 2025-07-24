# Design Document

## Overview

The Intelligent Tour System integrates guided historical tours with AI-powered node relationship detection, building upon the existing sophisticated infrastructure of Contextual Intelligence, Spatial Intelligence, and Enhanced Nodes. This system transforms the current mindmap experience from static visualization into dynamic, narrative-driven exploration while automatically surfacing relevant connections between UFO/UAP entities.

The design leverages the existing 85% complete Smart Tour Integration and enhances it with automatic node connection capabilities, creating a unified experience that guides users through disclosure history while intelligently expanding their knowledge graph.

## Architecture

### System Integration Hierarchy

The Intelligent Tour System sits at the orchestration layer of the existing architecture:

```
Contextual Intelligence (✅ Foundation)
├── Powers: Context detection, relationship filtering, smart suggestions
└── Implementation: contextual-intelligence.ts (EXISTING)

↓ Built on Foundation ↓

Spatial Intelligence (✅ Complete)
├── Features: R-Tree indexing, proximity analysis, spatial grouping
└── Implementation: useSpatialGrouping (EXISTING)

↓ Leverages Both Above ↓

Enhanced Nodes (✅ Complete)
├── Common UI layer with smart badges
└── Implementation: enhanced-node-poc.tsx (EXISTING)

↓ NEW ORCHESTRATION LAYER ↓

Intelligent Tour System (🆕 This Spec)
├── Tour State Management
├── Auto-Connection Engine
├── Smart Edge System
└── Research Session Integration
```

### Core Components

#### 1. Tour State Management System

**Location**: `apps/app/src/features/mindmap/tours/contexts/tour-state-context.tsx`

**Purpose**: Manages tour progression, waypoint tracking, and persistent state

**Key Features**:
- Tour session persistence with unique identifiers
- Waypoint progression tracking with narrative context
- Integration with existing `contextual-intelligence.ts`
- State restoration across browser sessions

#### 2. Auto-Connection Engine

**Location**: `apps/app/src/features/mindmap/utils/auto-connection-engine.ts`

**Purpose**: AI-powered automatic node relationship detection and creation

**Key Features**:
- Leverages existing `getGraphContext()` from contextual intelligence
- Confidence-based connection creation (80%+ auto, 60-80% suggested)
- Integration with Prometheus AI system for relationship analysis
- Smart edge creation with contextual metadata

#### 3. Smart Edge Enhancement System

**Location**: `apps/app/src/features/mindmap/edges/smart-contextual-edge.tsx`

**Purpose**: Enhanced edges that display relationship context and tour information

**Key Features**:
- Extends existing edge system with contextual information
- Tour-specific edge highlighting and narrative flow
- Relationship type indicators (temporal, personnel, organizational, evidential)
- Confidence scoring visualization

#### 4. Research Session Auto-Creator

**Location**: `apps/app/src/features/mindmap/utils/session-auto-creator.ts`

**Purpose**: Automatic research session creation from spatial grouping

**Key Features**:
- Integrates with existing `useSpatialGrouping` hook
- Auto-creates sessions when 3+ nodes are spatially grouped
- Merges related sessions based on proximity and context
- Seamless integration with existing session-notes-context

## Components and Interfaces

### Enhanced Tour State Interface

```typescript
interface TourState {
  // Existing tour properties
  tourId: string
  currentWaypointId: string
  waypointIndex: number
  tourMode: 'guided' | 'free-form'
  
  // Enhanced properties
  autoConnectionsEnabled: boolean
  sessionAutoCreationEnabled: boolean
  spatialGroupingActive: boolean
  
  // Tour progression
  waypoints: TourWaypoint[]
  visitedWaypoints: Set<string>
  suggestedConnections: Connection[]
  
  // Integration with existing systems
  graphContext: GraphContext | null // From contextual-intelligence.ts
  spatialGroups: SpatialGroup[] // From useSpatialGrouping
  activeResearchSessions: string[]
}

interface TourWaypoint {
  id: string
  nodeId: string
  narrativeContext: string
  historicalSignificance: number
  suggestedNextWaypoints: string[]
  autoConnections: Connection[]
}
```

### Auto-Connection System Interface

```typescript
interface Connection {
  id: string
  sourceNodeId: string
  targetNodeId: string
  relationshipType: 'temporal' | 'personnel' | 'organizational' | 'evidential' | 'topical'
  confidence: number
  metadata: {
    source: 'contextual-intelligence' | 'prometheus-ai' | 'user-created'
    reasoning: string
    evidenceStrength: number
  }
  tourContext?: {
    tourId: string
    waypointId: string
    narrativeRelevance: number
  }
}

interface AutoConnectionEngine {
  analyzeNode(nodeId: string, graphContext: GraphContext): Promise<Connection[]>
  createAutoConnections(connections: Connection[]): Promise<void>
  suggestConnections(connections: Connection[]): void
  validateConnection(connection: Connection): boolean
}
```

### Smart Edge Interface

```typescript
interface SmartEdgeProps extends EdgeProps {
  connection: Connection
  tourActive: boolean
  isNarrativePath: boolean
  spatialGroupId?: string
}

interface EdgeContextualInfo {
  relationshipType: string
  confidence: number
  narrativeContext?: string
  evidenceSource: string
  temporalRelevance?: {
    timespan: string
    chronologicalOrder: number
  }
}
```

## Data Models

### Tour Session Model

```typescript
interface TourSession {
  id: string
  name: string
  createdAt: Date
  lastUpdated: Date
  
  // Tour configuration
  tourMode: 'guided' | 'free-form'
  startingNodeId: string
  currentWaypointId: string
  
  // Progress tracking
  waypoints: TourWaypoint[]
  visitedNodes: Set<string>
  discoveredConnections: Connection[]
  
  // Integration data
  graphContext: GraphContext
  spatialGroups: SpatialGroup[]
  researchSessions: string[]
  
  // Persistence
  isRestorable: boolean
  autoSaveEnabled: boolean
}
```

### Research Session Auto-Creation Model

```typescript
interface AutoCreatedResearchSession {
  id: string
  name: string
  createdAt: Date
  
  // Source information
  sourceType: 'spatial-grouping' | 'tour-progression' | 'manual'
  sourceSpatialGroupId?: string
  sourceTourId?: string
  
  // Content
  entities: string[] // Node IDs
  connections: Connection[]
  notes: string
  
  // Metadata
  confidence: number
  autoGenerated: boolean
  userModified: boolean
}
```

## Error Handling

### Connection Creation Error Handling

```typescript
class ConnectionError extends Error {
  constructor(
    message: string,
    public connectionId: string,
    public errorType: 'validation' | 'ai-analysis' | 'database' | 'network'
  ) {
    super(message)
  }
}

interface ErrorRecoveryStrategy {
  retryConnection(connection: Connection): Promise<boolean>
  fallbackToManualSuggestion(connection: Connection): void
  logConnectionFailure(error: ConnectionError): void
}
```

### Tour State Error Handling

```typescript
interface TourStateRecovery {
  validateTourState(state: TourState): boolean
  recoverFromCorruptedState(state: Partial<TourState>): TourState
  fallbackToBasicTour(): TourState
  preserveUserProgress(state: TourState): void
}
```

### Spatial Grouping Integration Error Handling

```typescript
interface SpatialGroupingErrorHandler {
  handleGroupingFailure(nodes: Node[]): SpatialGroup[]
  recoverFromProximityAnalysisError(): void
  fallbackToManualGrouping(nodeIds: string[]): SpatialGroup | null
}
```

## Testing Strategy

### Unit Testing

**Tour State Management**:
- Tour session creation and persistence
- Waypoint progression logic
- State restoration functionality
- Integration with contextual intelligence

**Auto-Connection Engine**:
- Node analysis accuracy
- Confidence scoring validation
- Connection creation logic
- AI integration error handling

**Smart Edge System**:
- Edge rendering with contextual information
- Tour-specific highlighting
- Relationship type display
- Performance with large graphs

### Integration Testing

**End-to-End Tour Flow**:
1. Start guided tour from historical event (e.g., Roswell 1947)
2. Verify enhanced nodes display with AI badges
3. Confirm auto-connections are created with appropriate confidence
4. Test spatial grouping triggers research session creation
5. Validate tour progression maintains narrative coherence
6. Ensure state persistence across browser sessions

**Contextual Intelligence Integration**:
- Verify `getGraphContext()` integration
- Test relationship filtering with tour context
- Confirm historical progression logic
- Validate geographic proximity calculations

**Spatial Intelligence Integration**:
- Test `useSpatialGrouping` hook integration
- Verify proximity analysis with tour nodes
- Confirm group boundary calculations
- Test persistence timer functionality

### Performance Testing

**Benchmarks**:
- Tour state updates: < 100ms
- Auto-connection analysis: < 2 seconds for 50 nodes
- Smart edge rendering: 60fps with 100+ edges
- Spatial grouping calculations: < 1 second for 100 nodes
- Research session auto-creation: < 500ms

**Load Testing**:
- Large tour sessions (100+ waypoints)
- Complex spatial groups (20+ nodes per group)
- Multiple concurrent tours
- Heavy auto-connection scenarios (500+ potential connections)

### User Experience Testing

**Tour Navigation**:
- Intuitive waypoint progression
- Clear narrative context at each step
- Smooth camera transitions between spatial groups
- Responsive tour controls

**Auto-Connection Discovery**:
- Relevant connection suggestions
- Clear confidence indicators
- Easy approval/rejection workflow
- Non-intrusive suggestion presentation

**Research Session Integration**:
- Seamless session auto-creation
- Logical entity grouping
- Easy session management
- Clear session merge suggestions

## Implementation Phases

### Phase 1: Core Tour State Management (Week 1)
- Implement `TourStateContext` with persistence
- Integrate with existing contextual intelligence
- Create tour waypoint progression logic
- Add state restoration functionality

### Phase 2: Auto-Connection Engine (Week 1-2)
- Build connection analysis using existing `getGraphContext()`
- Implement confidence-based connection creation
- Add Prometheus AI integration for relationship detection
- Create connection validation and error handling

### Phase 3: Smart Edge Enhancement (Week 2)
- Extend existing edge system with contextual information
- Add tour-specific edge highlighting
- Implement relationship type indicators
- Create confidence scoring visualization

### Phase 4: Spatial Integration (Week 2-3)
- Integrate with existing `useSpatialGrouping` hook
- Implement research session auto-creation
- Add spatial group tour navigation
- Create session merge suggestions

### Phase 5: Polish and Optimization (Week 3)
- Performance optimization for large graphs
- Enhanced error handling and recovery
- User experience refinements
- Comprehensive testing and validation

## Integration Points

### Existing Systems Integration

**Contextual Intelligence** (`contextual-intelligence.ts`):
- Use `getGraphContext()` for tour context analysis
- Leverage `isRecordRelated()` for connection validation
- Extend `generateContextualSearchRules()` for tour-aware search
- Integrate `determineHistoricalProgression()` for tour progression

**Spatial Intelligence** (`useSpatialGrouping`):
- Subscribe to spatial group changes for session auto-creation
- Use group metadata for tour waypoint suggestions
- Integrate group persistence for tour continuity
- Leverage proximity analysis for connection strength

**Enhanced Nodes** (`enhanced-node-poc.tsx`):
- Extend existing badge system with tour-specific indicators
- Add auto-connection visual feedback
- Integrate tour progression indicators
- Maintain existing functionality while adding tour features

### Database Integration

**Existing Xata Schema**:
- Leverage existing entity relationships for connection analysis
- Use vector embeddings for semantic similarity
- Integrate with existing search and ask functionality
- Maintain compatibility with current data models

**New Tour Data**:
- Store tour sessions in browser localStorage initially
- Plan for future database persistence of tour templates
- Maintain research session compatibility
- Preserve existing user data and preferences

## Performance Considerations

### Optimization Strategies

**Connection Analysis**:
- Cache relationship analysis results
- Batch connection creation operations
- Use debouncing for rapid node additions
- Implement progressive analysis for large graphs

**Tour State Management**:
- Lazy load waypoint data
- Compress tour state for storage
- Use efficient diff algorithms for state updates
- Implement background state persistence

**Spatial Grouping Integration**:
- Optimize proximity calculations with R-Tree indexing (existing)
- Cache group boundary calculations
- Use efficient group membership tracking
- Implement smart group update strategies

### Memory Management

**Tour Session Cleanup**:
- Automatic cleanup of old tour sessions
- Memory-efficient waypoint storage
- Garbage collection of unused connections
- Efficient spatial group reference management

**Connection Management**:
- Limit concurrent connection analysis
- Clean up temporary connection objects
- Efficient edge rendering with virtualization
- Smart caching of relationship metadata

This design builds upon the existing sophisticated infrastructure while adding the intelligent tour and auto-connection capabilities specified in the requirements. The implementation leverages proven patterns and maintains backward compatibility with all existing systems.