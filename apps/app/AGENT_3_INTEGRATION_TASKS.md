# Agent 3: Integration Stabilization & Tour Integration Developer Tasks

## PRIORITY: Integration Stabilization Tasks (Do These First)

### 1. Debug Database Integration
**Key File:** `src/features/mindmap/actions/xata-to-xyflow.ts`

**Test Database Queries:**
1. Verify all entity type queries work correctly
2. Test relationship fetching between entities
3. Ensure proper error handling for missing records
4. Check data transformation from Xata format to XY Flow nodes

**Database Models to Verify:**
- Events with proper date/location data
- Personnel with bio/role information  
- Topics with summaries and embeddings
- Organizations with member relationships
- Testimonies with witness connections
- Documents with author/organization links
- Sightings with geographic coordinates

### 2. Test Contextual Intelligence System
**Key File:** `src/features/mindmap/utils/contextual-intelligence.ts`

**Functions to Debug:**
- `getGraphContext()` - Analyzes existing nodes for context
- `isRecordRelated()` - Filters related records
- `generateContextualSearchRules()` - Creates AI search rules

**Test Scenarios:**
1. Add first node (should allow open exploration)
2. Add second node (should filter based on context)
3. Test temporal filtering (±10 year window)
4. Test geographic proximity (500km radius)
5. Test entity relationship filtering

### 3. Verify Search Integration
**Files:** 
- `src/features/mindmap/actions/search.ts`
- `src/features/mindmap/components/menus/mindmap-bottom-menu/mindmap-bottom-menu.tsx:200`

**Test Cases:**
1. Search returns proper results from database
2. Results convert correctly to mindmap nodes
3. Search respects contextual filtering when nodes exist
4. Error handling for failed searches

### 4. Node Creation & Positioning
**Files:**
- `src/features/mindmap/utils/conversions.ts`
- `src/features/mindmap/utils/node-enhancement-utils.ts`

**Verify:**
- Nodes appear in correct positions relative to existing graph
- Node data includes all necessary database fields
- Visual styling matches entity types
- Parent-child relationships work correctly

## THEN: Tour Integration Development

### 1. Tour-Contextual Intelligence Integration
**File:** `src/features/tours/utils/tour-context-integration.ts`

**Enhanced Contextual Rules:**
```typescript
interface TourContextRules extends ContextRules {
  tourId: string
  waypointId: string
  narrativeContext: string
  strictFiltering: boolean
  allowedDeviations: string[]
}
```

**Features:**
- Tour-specific context generation
- Waypoint-aware filtering
- Narrative coherence maintenance
- User exploration limits during tours

### 2. Tour-Aware Node Positioning
**Enhancement to:** `src/features/mindmap/utils/conversions.ts`

**Tour Positioning Logic:**
- Center new nodes around current waypoint
- Maintain visual narrative flow
- Smooth transitions between waypoints
- Preserve user's exploration when returning to tour

### 3. Enhanced Search for Tours
**File:** `src/features/tours/utils/tour-search.ts`

**Tour Search Features:**
- Waypoint-specific search rules
- Historical timeline constraints
- Entity relationship prioritization
- Duplicate prevention across waypoints

### 4. Tour Analytics & Progress Tracking
**File:** `src/features/tours/utils/tour-analytics.ts`

**Analytics Events:**
- `tour_started`
- `waypoint_reached`
- `user_explored_off_path`
- `tour_completed`
- `tour_abandoned`

**Progress Persistence:**
- Save tour progress to localStorage
- Resume capability across sessions
- Export tour paths as saved mindmaps
- Share waypoint URLs

### 5. Integration with Existing Systems

**Mindmap Context Integration:**
```typescript
// Enhance existing useMindMap hook
interface MindMapContextWithTours extends MindMapContext {
  currentTour: TourDefinition | null
  currentWaypoint: TourWaypoint | null
  isTourMode: boolean
  tourProgress: number
}
```

**Database Schema Utilization:**
- Leverage existing relationship tables
- Use embedding vectors for similarity
- Respect user-saved records
- Integrate with user notes system

## Performance Considerations

### 1. Query Optimization
- Batch database requests for waypoints
- Cache tour content and relationships
- Implement lazy loading for large tour datasets
- Optimize contextual filtering algorithms

### 2. Memory Management
- Efficient tour state management
- Clean up unused tour data
- Optimize node rendering for large graphs
- Implement viewport-based loading

### 3. Real-time Updates
- Handle concurrent user interactions
- Maintain tour state during exploration
- Sync progress across browser tabs
- Handle network interruptions gracefully

## Integration Points
- Coordinate with Agent 1's tour infrastructure
- Support Agent 2's UI requirements
- Maintain existing mindmap functionality
- Preserve user experience during transitions

## Error Handling & Edge Cases

### Tour Navigation Errors:
- Missing database references
- Broken waypoint chains
- Network connectivity issues
- Malformed tour content

### User Interaction Edge Cases:
- Rapid clicking during loading
- Browser back/forward navigation
- Tab switching during tours
- Mobile orientation changes

## Success Criteria
✅ All database queries return correct data without errors
✅ Contextual intelligence filtering works as documented
✅ Tour integration doesn't break existing search functionality  
✅ Node positioning remains smooth during tour navigation
✅ Performance remains optimal with tour features enabled
✅ Error handling prevents crashes during edge cases