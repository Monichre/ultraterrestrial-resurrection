# v0 UI/UX Integration Plan for Mindmap Feature

**Created**: 2026-02-14
**Status**: Planning
**Scope**: `apps/app/src/features/mindmap/`

---

## Executive Summary

The v0 "UFO UI 3" designs introduce a **Research Canvas** paradigm that overlays the existing ReactFlow-based mindmap with polished, animated UI chrome. A significant portion of the v0 components have already been imported into `research-canvas/` but remain **partially integrated** -- many are standalone page-level prototypes rather than wired-up, data-connected components. This plan outlines a phased approach to fully integrate these designs into the production mindmap experience.

---

## Current State Analysis

### What Already Exists from v0

| Component | Location | Integration Status |
|---|---|---|
| `FloatingToolbar` | `research-canvas/FloatingToolbar.tsx` | **Active** -- rendered in `graph.tsx`, wired to `mindmap-ui-store` |
| `ToolbarButton` | `research-canvas/ToolbarButton.tsx` | **Active** -- used by FloatingToolbar |
| `ResearchCanvasConsole` | `research-canvas/research-canvas-console.tsx` | **Active** -- replaces old `MindMapBottomMenu` in `graph.tsx` |
| `MessageInput` | `research-canvas/MessageInput.tsx` | **Active** -- used by ResearchCanvasConsole |
| `AnimatedChat` | `research-canvas/AnimatedChat.tsx` | **Unused** -- standalone animation demo |
| `AnimatedChatWithSuggestions` | `research-canvas/AnimatedChatWithSuggestions.tsx` | **Partially used** -- rendered inside ResearchCanvasConsole |
| `EnhancedAnimatedChat` | `research-canvas/EnhancedAnimatedChat.tsx` | **Unused** -- more complete version of AnimatedChat |
| `EmptyCanvas` | `research-canvas/EmptyCanvas.tsx` | **Unused** -- empty state with ResearchTimeline |
| `ResearchTimeline` | `research-canvas/ResearchTimeline.tsx` | **Unused** -- ASCII-style timeline UI |
| `ActionChip` | `research-canvas/ActionChip.tsx` | **Unused** -- button chip component |
| `AssetPanel` | `research-canvas/AssetPanel.tsx` | **Unused** -- standalone asset browser |
| `CardStack` | `research-canvas/typer/CardStack.tsx` | **Unused** -- refactored from ResearchCanvasConsole |
| `PinnedCard` | `research-canvas/typer/PinnedCard.tsx` | **Unused** -- refactored from ResearchCanvasConsole |
| `useTyper` hook | `research-canvas/typer/use-typer.ts` | **Unused** -- state logic extracted from console |
| `FullScreenMenu` | `navigation/FullScreenMenu.tsx` | **Unused** -- full-screen view switcher overlay |
| `MenuTrigger` | `navigation/MenuTrigger.tsx` | **Unused** -- hamburger trigger for FullScreenMenu |
| View Pages (4) | `research-canvas/views/` | **Unused** -- standalone page prototypes (sightings, timeline, search, detail) |

### What Exists in Legacy (Being Replaced)

| Component | Location | Status |
|---|---|---|
| `MindMapBottomMenu` | `components/menus/mindmap-bottom-menu/` | **Commented out** in `graph.tsx`, replaced by ResearchCanvasConsole |
| `MindMapSideMenu` | `components/menus/mindmap-side-menu/` | **Wrapper** -- delegates to FloatingToolbar |
| `EmptyCanvas` (old) | `components/menus/mindmap-side-menu/EmptyCanvas.tsx` | **Deleted** |
| Hover Panels (14) | `components/menus/mindmap-side-menu/hover-panels/` | **Active** -- used by FloatingToolbar |

### Zustand Store (`mindmap-ui-store`)

Already has state management for:
- `activeTool` / `pinnedPanel` -- toolbar state
- `navigation.activeView` -- canvas/timeline/globe/search/detail views
- `navigation.fullScreenMenuOpen` -- for FullScreenMenu overlay
- `timeline` -- year, era, playback state
- `assets` -- query, viewMode, category
- `tour` -- guided/free-form tour mode
- `aiMode` / `deepResearchEnabled` -- AI features

---

## Integration Plan

### Phase 1: Console & Empty State Polish (1-2 days)

**Goal**: Make the empty canvas experience complete and wire up the Typer refactor.

#### 1.1 Replace inline Typer logic in ResearchCanvasConsole with refactored `typer/` module

The `research-canvas-console.tsx` contains ~300 lines of inline card animation logic that has been cleanly refactored into `typer/CardStack.tsx`, `typer/PinnedCard.tsx`, and `typer/use-typer.ts`. Swap them in.

**Files to modify:**
- `research-canvas/research-canvas-console.tsx` -- import from `typer/` instead of inline
- Verify `typer/constants.ts` ITEMS match the current ITEMS array (currently 3 vs 4 items -- normalize)

#### 1.2 Integrate EmptyCanvas component

When the mindmap has zero nodes, show the `EmptyCanvas` component (with `ResearchTimeline` and placeholder text) instead of an empty ReactFlow canvas.

**Files to modify:**
- `graph.tsx` -- add conditional render: `nodes.length === 0 ? <EmptyCanvas /> : <ReactFlow ...>`
- `research-canvas/EmptyCanvas.tsx` -- wire `onSubmit` to `runAgentQueryAndAddNodes`

#### 1.3 Wire ActionChip for contextual quick actions

Place `ActionChip` components alongside the console for quick-access actions (e.g., "Add Node", "Start Tour", "Search Database").

**Files to modify:**
- `graph.tsx` -- add action chips row above/beside the console
- Wire chips to existing store actions

---

### Phase 2: FullScreen Navigation Menu (1-2 days)

**Goal**: Enable the full-screen view switcher that lets users navigate between Canvas, Timeline, Globe, Search, and Case Files views.

#### 2.1 Wire FullScreenMenu to the app

The `FullScreenMenu` component reads from `useMindMapUiStore().navigation.fullScreenMenuOpen` and uses `setActiveView()` to switch modes. It already has routes defined but references non-existent components (`FloatingHeader`, `@/components/navigation/MenuTrigger`, `@/data/ufo-sightings`).

**Steps:**
- Create `MenuTrigger` button in the graph toolbar (or add to `FloatingToolbar`)
- Fix import paths in `FullScreenMenu.tsx` -- replace missing deps with existing components
- Wire the `handleNavigate` callback to either:
  - (a) Render different view components inline within the mindmap page (SPA approach), or
  - (b) Navigate to actual Next.js routes (current implementation) -- requires creating those routes

**Recommendation**: Option (a) -- render views inline. This avoids creating new routes and keeps the mindmap as the central hub. Use `navigation.activeView` from the store to conditionally render the appropriate view.

#### 2.2 Create a ViewSwitcher wrapper

```tsx
// New: research-canvas/ViewSwitcher.tsx
function ViewSwitcher() {
  const { navigation } = useMindMapUiStore()
  switch (navigation.activeView) {
    case 'canvas': return <Graph />
    case 'timeline': return <TimelineView />
    case 'globe': return <SightingsGlobeView />
    case 'search': return <SearchDiscoveryView />
    case 'detail': return <CaseFilesView />
  }
}
```

**Files to create:**
- `research-canvas/ViewSwitcher.tsx`
- Adapt the 4 view pages from `research-canvas/views/` to be embeddable components (remove page-level wrappers, Next.js metadata, etc.)

---

### Phase 3: Hover Panel Modernization (2-3 days)

**Goal**: Align the 14 existing hover panels with the v0 design language and ensure they work with the new FloatingToolbar.

#### 3.1 Audit existing panels vs v0 designs

The existing panels in `components/menus/mindmap-side-menu/hover-panels/` are functional but some have been updated (TimelinePanel, NetworkPanel, FilterPanel, LayoutPanel, AssetLibraryPanel) while others (HistoryPanel, CollaborationPanel, LayersPanel, etc.) retain older styling.

**Tasks:**
- Ensure all panels use the shared panel card style: `bg-neutral-800/90 backdrop-blur-md border border-white/5 rounded-2xl`
- Replace the `AssetLibraryPanel` hover panel body with the more complete `AssetPanel` from `research-canvas/AssetPanel.tsx`
- Ensure TimelinePanel's `onRequestData` callback properly triggers mindmap agent queries
- Wire FilterPanel filters to the mindmap store (node type filtering, date ranges, etc.)

#### 3.2 Add missing panel functionality

Currently `NetworkPanel`, `FilterPanel`, `HistoryPanel` have UI but limited wiring. Connect them to:
- `mindmap-store.ts` for node/edge filtering
- `mindmap-ui-store.ts` for layout/view preferences
- `use-mindmap-agent.ts` for data fetching

---

### Phase 4: Enhanced Chat Integration (2-3 days)

**Goal**: Replace the basic `ResearchCanvasConsole` flow with the richer `EnhancedAnimatedChat` pattern that provides AI response streaming inline.

#### 4.1 Wire EnhancedAnimatedChat to the agent

The `EnhancedAnimatedChat` component has a complete animation sequence (initial -> typing -> expanded -> suggestions -> AI response) but currently uses hardcoded placeholder text for the AI response. Wire it to `useMindMapAgent`:

**Steps:**
- Pass `runAgentQuery` results into the chat's "complete" state
- Stream the `analysis` text through the TypewriterResponse component
- Show tool events (searchDatabase, searchExternalResources) as processing indicators
- On "complete", add resulting nodes to the canvas

#### 4.2 Implement follow-up conversation

The `EnhancedAnimatedChat` has a follow-up input field. Wire it to maintain conversation context:
- Track `threadId` from the agent response
- Pass it back on subsequent queries
- Show conversation history in an expandable panel

---

### Phase 5: View Pages Adaptation (3-4 days)

**Goal**: Convert the 4 standalone view pages into embeddable components usable within the mindmap's ViewSwitcher.

#### 5.1 UFO Sightings View (`views/ufo-sightings/page.tsx`)
- Remove `FloatingHeader`, `MenuTrigger`, Next.js page-level imports
- Replace hardcoded `UFO_SIGHTINGS` data with live Xata queries
- Wire globe visualization to existing Three.js/R3F infrastructure
- Connect filters to `mindmap-ui-store`

#### 5.2 Timeline View (`views/timeline/page.tsx`)
- Adapt the network/timeline visualization to use ReactFlow nodes or a standalone SVG canvas
- Connect to Xata event data
- Wire zoom/pan/filter controls to the store

#### 5.3 Search & Discovery View (`views/search-and-discovery-interface/page.tsx`)
- Replace hardcoded `UFO_SIGHTINGS` with Xata search (via `searchXata` from `@db/xata/api`)
- Wire trending topics to actual database aggregations
- Connect search results to node creation ("Add to Canvas" action)

#### 5.4 Content Card Detail View (`views/content-card-detail-view/page.tsx`)
- Replace hardcoded data with Xata entity lookups
- Wire related incidents to graph connections
- Enable "Add to Canvas" from detail view

#### 5.5 Create shared data layer

All views reference `@/data/ufo-sightings` which doesn't exist in the production codebase. Create a shared data access layer:

```tsx
// research-canvas/data/index.ts
export async function fetchSightings(filters: SightingFilters) {
  // Uses existing Xata infrastructure
}
export async function fetchIncidentById(id: string) { ... }
export async function getRelatedIncidents(id: string) { ... }
```

---

### Phase 6: Node UI Refresh (2-3 days)

**Goal**: Update node components to match the v0 design language (darker cards, subtle borders, glassmorphism).

#### 6.1 Update core-node-ui.tsx and enhanced-core-node-ui.tsx

Apply the v0 design tokens:
- Background: `bg-neutral-900/80 backdrop-blur-sm`
- Border: `border border-neutral-800` or `border-white/5`
- Shadow: `shadow-[0_0_0_1px_rgba(255,255,255,0.03)]`
- Text: `text-white` primary, `text-neutral-400` secondary
- Hover: `hover:bg-white/5`, `hover:border-neutral-700`

#### 6.2 Standardize node type styles

Ensure all 15+ node types (entity, event, testimony, document, personnel, AI annotation, user input, etc.) use a consistent base card style with type-specific accent colors.

---

### Phase 7: Polish & Cleanup (1-2 days)

**Goal**: Remove duplicate/dead code and ensure everything works together.

#### 7.1 Remove duplicate chat components

There are 3 overlapping animated chat implementations:
- `AnimatedChat.tsx` (basic)
- `AnimatedChatWithSuggestions.tsx` (mid-level)
- `EnhancedAnimatedChat.tsx` (full-featured)

Keep `EnhancedAnimatedChat` as the canonical version, remove the other two.

#### 7.2 Consolidate Typer vs ResearchCanvasConsole

After Phase 1 refactors `ResearchCanvasConsole` to use `typer/`, verify no dead code remains in the console file.

#### 7.3 Remove old MindMapBottomMenu

It's already commented out in `graph.tsx`. Delete the entire `components/menus/mindmap-bottom-menu/` directory once ResearchCanvasConsole is fully stable.

#### 7.4 Remove unused view loading.tsx files

The `views/*/loading.tsx` files export simple loading spinners that won't be used once views are embedded components.

---

## Architecture Diagram

```
mind-map.tsx (entry point)
  └── ReactFlowProvider + MindMapProvider
       └── ViewSwitcher [NEW]
            ├── Graph (canvas view -- default)
            │    ├── ReactFlow (nodes/edges)
            │    ├── FloatingToolbar (left sidebar)
            │    │    └── HoverPanels (Network, Timeline, Layout, Filter, etc.)
            │    ├── SessionNotes (top-right)
            │    ├── ResearchCanvasConsole (bottom-center)
            │    │    ├── CardStack (empty state cards)
            │    │    ├── PinnedCard (active card badge)
            │    │    ├── MessageInput (text input)
            │    │    └── EnhancedAnimatedChat (AI response UI)
            │    ├── ConnectedRecordsPanel (context panel)
            │    └── EmptyCanvas [NEW - shown when 0 nodes]
            ├── TimelineView [NEW - from views/timeline]
            ├── SightingsGlobeView [NEW - from views/ufo-sightings]
            ├── SearchDiscoveryView [NEW - from views/search-and-discovery]
            └── CaseFilesView [NEW - from views/content-card-detail]
  FullScreenMenu [NEW - overlay navigation between views]
```

## State Management Flow

```
mindmap-ui-store (Zustand, persisted)
  ├── navigation.activeView  →  ViewSwitcher renders appropriate view
  ├── navigation.fullScreenMenuOpen  →  FullScreenMenu overlay
  ├── activeTool / pinnedPanel  →  FloatingToolbar highlights + panel display
  ├── timeline.*  →  TimelinePanel + TimelineView
  ├── assets.*  →  AssetLibraryPanel
  ├── tour.*  →  Tour system (Smart Tours, Guided Tours)
  └── aiMode / deepResearchEnabled  →  Chat behavior modes

mindmap-store (Zustand, not persisted)
  ├── nodes / edges  →  ReactFlow display
  ├── onNodesChange / onEdgesChange  →  ReactFlow interaction
  └── updateNodeData  →  Node content updates from agent responses
```

---

## Dependencies & Risks

| Risk | Mitigation |
|---|---|
| v0 views reference `@/data/ufo-sightings` (doesn't exist) | Create data layer backed by Xata |
| v0 views reference `@/components/ui/FloatingHeader` (doesn't exist) | Remove or create minimal header component |
| v0 views reference `@/components/navigation/MenuTrigger` (path differs) | Fix import to `navigation/MenuTrigger.tsx` |
| v0 views use hardcoded UFO incident data | Replace with Xata queries using existing patterns |
| Multiple animated chat variants cause confusion | Consolidate to single canonical version |
| Node type styles inconsistent with new design | Phase 6 addresses this systematically |

## Estimated Timeline

| Phase | Effort | Priority |
|---|---|---|
| Phase 1: Console & Empty State | 1-2 days | High |
| Phase 2: FullScreen Navigation | 1-2 days | High |
| Phase 3: Hover Panel Modernization | 2-3 days | Medium |
| Phase 4: Enhanced Chat Integration | 2-3 days | High |
| Phase 5: View Pages Adaptation | 3-4 days | Medium |
| Phase 6: Node UI Refresh | 2-3 days | Medium |
| Phase 7: Polish & Cleanup | 1-2 days | Low |
| **Total** | **12-19 days** | |

---

## Success Criteria

1. Empty canvas shows the `EmptyCanvas` component with research timeline and card stack
2. FullScreenMenu opens and navigates between all 5 views without page reload
3. AI agent responses stream inline through the `EnhancedAnimatedChat` component
4. All hover panels display correct data and trigger appropriate store actions
5. All node types use the updated v0 design language (dark glassmorphism)
6. No duplicate chat components remain
7. Zero TypeScript errors, build succeeds, all existing tests pass
