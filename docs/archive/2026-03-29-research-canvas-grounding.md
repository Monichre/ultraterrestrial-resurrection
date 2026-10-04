# Research Canvas Grounding

**Date:** 2026-03-29

## Canonical Purpose

- In `docs/plans/FEATURES.md`, the Research Canvas is the **Investigation** stage in the core user journey.
- Its intended role is to act as an **integrated contextual panel inside the mindmap workflow**, bridging:
  - **Discovery** in the graph
  - **Session documentation** during active investigation
  - **Evidence validation** against records, sources, and citations
- The strategic direction is not a separate replacement experience; it is a research surface layered onto the existing mindmap and contextual-intelligence foundation.

## Source Tickets

| Source | Ticket | Documented intent | Grounded note |
| --- | --- | --- | --- |
| `docs/plans/FEATURES.md` | **Priority 5: Research Canvas Integration as Contextual Panel** | Make Research Canvas a slide-out contextual research surface within the mindmap workflow | Canonical product direction |
| `docs/plans/TODO.md` | **Focus 2 / Task 6: Enhance Research Canvas Components** | Improve the discovery-to-research transition | File target is stale: the ticket points to `apps/app/src/components/research/`, while the active implementation is routed through `apps/app/src/app/(site)/research-canvas/page.tsx` and `apps/app/src/features/mindmap/research-canvas/` |
| `docs/plans/TODO.md` | **Focus 2 / Task 9: Research Session Automation** | Auto-create sessions from spatial grouping | The referenced implementation anchor `apps/app/src/contexts/mindmap/session-notes-context.tsx` exists, but the automation outcome is not delivered in the inspected app flow |
| `docs/plans/TODO.md` | **Task 20: Test Complete Research Workflow** | Validate the end-to-end flow from mindmap to research session to documentation | Still the right acceptance ticket for the grounded workflow |

### Stale plan references to keep in mind

- `docs/plans/FEATURES.md` Decision 6 references a migration target of `apps/app/src/features/research-canvas/`.
- The current active implementation is actually under `apps/app/src/features/mindmap/research-canvas/`.
- `docs/plans/TODO.md` Task 6 references `apps/app/src/components/research/`, which does not match the current route and feature layout.

## Actual `apps/app` Functionality

### Route and shell

| Area | Current behavior | Concrete files |
| --- | --- | --- |
| `/research-canvas` route | Loads network graph data and renders the same `MindMap` shell used by the broader graph workflow | `apps/app/src/app/(site)/research-canvas/page.tsx` |
| Mindmap shell | Wraps the graph in `ReactFlowProvider` and `MindMapProvider`, then hands rendering to a view switcher | `apps/app/src/features/mindmap/mind-map.tsx` |
| View switching | Uses `navigation.activeView` to swap the full screen between `canvas`, `timeline`, `globe`, `search`, and `detail` views | `apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx` |

### Live AI investigation already exists

| Area | Current behavior | Concrete files |
| --- | --- | --- |
| Graph query flow | `Graph` can create a user-input node, call the AI agent, and convert returned records into graph nodes and edges | `apps/app/src/features/mindmap/graph.tsx` |
| Agent client hook | Streams `analysis`, `toolEvents`, database search output, and optional external results from the disclosure mindmap API | `apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts` |
| API route | Runs Prometheus/OpenAI thread orchestration with `file_search`, `searchDatabase`, and optional `searchExternalResources`, then emits SSE updates | `apps/app/src/app/api/disclosure/mindmap/route.ts` |

### Research-canvas views exist, but several are demo/static driven

| View | Grounded status | Concrete files |
| --- | --- | --- |
| Sightings database / globe view | Uses local `UFO_SIGHTINGS` data for filtering, sorting, and detail selection; map integration is commented out | `apps/app/src/features/mindmap/research-canvas/views/ufo-sightings/page.tsx`, `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts` |
| Timeline explorer | Builds a visual network/timeline from the same local `UFO_SIGHTINGS` dataset | `apps/app/src/features/mindmap/research-canvas/views/timeline/page.tsx`, `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts` |
| Search and discovery | Uses simulated saved searches, trending topics, and search suggestions over the same local dataset | `apps/app/src/features/mindmap/research-canvas/views/search-and-discovery-interface/page.tsx`, `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts` |
| Detail view | Resolves incident detail and related incidents from the same static data module | `apps/app/src/features/mindmap/research-canvas/views/content-card-detail-view/page.tsx`, `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts` |

### Session and evidence state is fragmented

| State area | Current behavior | Concrete files |
| --- | --- | --- |
| Session notes context | Manages notes in local storage, supports manual note creation, and can save to `/api/user-notes` | `apps/app/src/contexts/mindmap/session-notes-context.tsx` |
| Session notes UI | Maintains a separate internal notes list and placeholder `useRAGIntegration()` TODOs instead of consuming the shared session-notes context | `apps/app/src/features/mindmap/components/status-ui/session-notes.tsx` |
| Research canvas card state | Tracks selected cards, pinned cards, canvas notes, and ad hoc AI insights in a separate in-memory provider | `apps/app/src/contexts/research/research-context.tsx` |
| Message-to-note capture | Can save assistant messages as notes, but falls back to local storage if no handler is wired in | `apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/MindMapMessages.tsx` |

## Alignment and Divergence

| Theme | Alignment | Divergence |
| --- | --- | --- |
| Investigation lives near the mindmap | The `/research-canvas` route is already powered by the mindmap shell and graph tooling | It is currently a **full-screen shell**, not the planned **contextual panel** inside the discovery workflow |
| AI-assisted investigation | Live investigation is real: the graph can query the disclosure API, stream analysis, and add records to the canvas | This is anchored in the graph experience, not yet unified into a research-session model with evidence ownership |
| Discovery-to-research transition | `ViewSwitcher` gives one shared shell for graph, timeline, search, globe, and detail views | The transition is view-level navigation, not a contextual handoff from a selected node/group into a session workspace |
| Documentation/session capture | Notes, pinned cards, and message capture already exist in some form | Notes, pinned cards, message saves, and canvas notes are split across multiple providers/components with different persistence rules |
| Evidence validation | Static incident views expose `sources`, related incidents, and tags; AI search can also enrich graph exploration | There is no unified evidence ledger for citations, pinned evidence, validation status, or source provenance inside a single session |
| Research session automation | The ticket and one candidate context file exist | No inspected file auto-creates a session from spatial grouping or mindmap context changes |

## Recommended Next Slice

### Grounded objective

Create one shared `researchSession` state slice that becomes the single owner of investigation-session state before attempting panel UI redesign or automation polish.

### Minimum owned state

```ts
type ResearchSessionState = {
  activeSessionId: string | null
  pinnedNodeIds: string[]
  pinnedCardIds: string[]
  notes: Array<{
    id: string
    title: string
    content: string
    sourceMessageId?: string
  }>
  evidenceIds: string[]
  citationIds: string[]
  sourceWaypointId: string | null
  sourceGroupId: string | null
  saveStatus: 'idle' | 'dirty' | 'saving' | 'saved' | 'error'
  lastUpdated: string | null
}
```

### First consumers to converge on that slice

- `apps/app/src/features/mindmap/components/status-ui/session-notes.tsx`
- `apps/app/src/contexts/mindmap/session-notes-context.tsx`
- `apps/app/src/contexts/research/research-context.tsx`
- `apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/MindMapMessages.tsx`
- `apps/app/src/features/mindmap/graph.tsx`

### Why this is the right next grounded step

- It addresses the clearest current divergence: **fragmented session/evidence state**.
- It does not require replacing the existing graph or AI flow.
- It creates the prerequisite state model for:
  - a real contextual panel
  - automatic session creation from node groups or waypoints
  - durable evidence and citation tracking
  - meaningful end-to-end workflow testing under `docs/plans/TODO.md` Task 20
