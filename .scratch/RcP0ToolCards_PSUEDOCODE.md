# RcP0ToolCards — Pseudocode

**Date:** 2026-08-10  
**Status:** plan only — do not treat as implemented  
**Surface:** `/research-canvas` → `EnhancedAnimatedChat`  
**Parent plan:** `docs/plans/2026-08-10-rc-p0-tool-cards.md`

## Goal

Render live `AgentToolEvent[]` as expandable ToolCards (query, counts, error). No backend. No `researchSession` writes.

## Types (existing — do not change)

```
AgentToolEvent = {
  tool: string
  status: 'processing' | 'complete' | 'error'
  parameters?: Record
  result?: unknown
  message?: string
}
```

## Helpers

```
function toolLabel(tool):
  MATCH tool:
    searchDatabase          → "Search database"
    searchExternalResources → "Search external"
    addGraphNodes           → "Add graph nodes"
    addGraphEdges           → "Add graph edges"
    _                       → tool

function extractQuery(event):
  params = event.parameters OR {}
  IF params.search_terms → join as string
  ELSE IF params.query → params.query
  ELSE IF params.table → "table: " + params.table
  ELSE IF event.message → event.message
  ELSE → null

function extractCount(event):
  IF status != 'complete' → null
  result = event.result
  IF Array → length
  IF result.results Array → length
  IF result.records Array → length
  IF result.nodes Array → length   // addGraphNodes shapes
  IF result.edges Array → length
  ELSE → null

function extractError(event):
  IF status != 'error' → null
  RETURN event.message OR "Tool failed"
```

## Components

```
FUNCTION ToolCard(event, isExpanded, onToggle):
  RENDER header:
    label = toolLabel(event.tool)
    statusChip = event.status
    ON click → onToggle()
  IF isExpanded:
    SHOW extractQuery(event)
    SHOW extractCount(event) as "N results" when not null
    SHOW extractError(event) when not null
    OPTIONAL truncated JSON of parameters (debug-lite; omit if noisy)

FUNCTION AgentToolEventList(events):
  expandedId = useState(null)  // or Set for multi-expand
  IF !events.length → return null
  RENDER scrollable column:
    FOR each (event, index) in events:
      key = `${event.tool}-${event.status}-${index}`
      ToolCard(event, expandedId === key, () => toggle key)

// EnhancedAnimatedChat — replace pills block only
ON render when agentToolEvents present:
  REMOVE filter(status === 'processing') pills
  MOUNT <AgentToolEventList events={agentToolEvents} />
  KEEP analysis / follow-up / animation sequence unchanged
```

## Wiring (no change)

```
Graph:
  toolEvents = useMindMapAgent().toolEvents
  → EmptyCanvas / ResearchCanvasConsole agentToolEvents={toolEvents}
  → EnhancedAnimatedChat (unchanged props contract)
```

## Explicitly skip this slice

```
// RC-P1+
DO NOT write researchSession.sources from completes
DO NOT pass researchFocus: 'deep-research'
DO NOT open SynthesisPanel
DO NOT project waypoints
DO NOT edit mindmap-context.tsx
DO NOT add CopilotKit / Workspace
```

## Dogfood checklist (pseudocode)

```
OPEN /research-canvas
SUBMIT query that hits Neon FTS
ASSERT ToolCard for searchDatabase appears (processing → complete)
EXPAND card → ASSERT query + count visible
ASSERT graph nodes still added when agent writes graph
IF tool errors → ASSERT error card + message
```
