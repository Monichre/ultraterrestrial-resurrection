# Agent 1: Stabilization & Tour Infrastructure Developer Tasks

## PRIORITY: Stabilization Tasks (Do These First)

### 1. Debug AI Chat Functionality
**Location:** `src/features/mindmap/components/menus/mindmap-bottom-menu/`
**Issue:** Oracle input chat may not be working properly

**Investigation Steps:**
1. Test the `useAssistant` hook integration in `mindmap-bottom-menu.tsx:100`
2. Verify message flow through `OracleInput` component
3. Check if `chatStatus` states are updating correctly
4. Ensure `handleKeyDown` triggers proper submission
5. Test chat responses are displaying in `MindMapMessages`

**Files to Check:**
- `oracle-input.tsx` - Input handling and message display
- `mindmap-bottom-menu.tsx` - Chat state management
- `MindMapMessages.tsx` - Message rendering

### 2. Test Add to Mindmap Functionality
**Database Models to Test:**
- Events (`events` table)
- Personnel (`personnel` table) 
- Topics (`topics` table)
- Organizations (`organizations` table)
- Testimonies (`testimonies` table)
- Documents (`documents` table)
- Sightings (`sightings` table)

**Test Process:**
1. For each entity type, verify clicking "Add [Entity]" works
2. Check `handleLoadingRecords()` function properly calls `xataToXYFlow()`
3. Ensure contextual intelligence filtering in `contextual-intelligence.ts:22` works
4. Verify new nodes appear on mindmap with correct positioning

**Key Functions to Test:**
- `handleLoadingRecords()` in `mindmap-bottom-menu.tsx`
- `xataToXYFlow()` from `actions/xata-to-xyflow.ts`
- `getGraphContext()` from `utils/contextual-intelligence.ts`

### 3. Verify Search Functionality
**Test Cases:**
1. Search with `/` commands works
2. Regular text search returns results
3. Context-aware search with existing nodes
4. Search results properly convert to mindmap nodes

## THEN: Tour Infrastructure Development

### 1. Create Tour Type Definitions
**File:** `src/features/tours/types/tour.ts`
```typescript
interface TourDefinition {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  waypoints: TourWaypoint[]
}

interface TourWaypoint {
  id: string
  title: string
  dbRef: { type: string; id: string }
  narrative: string
  contextRules: ContextRules
  visualSettings: WaypointVisualSettings
}
```

### 2. Build Tour State Management
**File:** `src/features/tours/hooks/use-tour.ts`
- URL-driven navigation (`/mindmap/tour/roswell-disclosure?step=3`)
- Progress tracking
- Waypoint validation
- Tour completion status

### 3. Create Tour Loading System
**File:** `src/features/tours/utils/tour-loader.ts`
- YAML tour file parsing
- Database reference validation
- Tour content caching
- Error handling for missing references

### 4. Validation Tools
**File:** `scripts/validate-tours.ts`
- CI validation script
- Database reference checking
- Tour structure validation
- Cycle detection for tour paths

## Integration Points
- Work with existing `useMindMap()` context
- Leverage current database schema from `docs/disclosure-historical-tour.md`
- Maintain compatibility with contextual intelligence system
- Use existing node creation patterns

## Success Criteria
✅ All entity types can be added to mindmap without errors
✅ AI chat responds to user queries correctly  
✅ Contextual intelligence filters work as documented
✅ Tour system integrates seamlessly with existing mindmap
✅ No breaking changes to current functionality