# Research Canvas Frontend Architecture Audit
**Date:** 2026-03-29
**Agent:** Frontend Architecture Specialist (claude-sonnet-4-6)
**Branch:** dev
**Scope:** Full surface audit of the research canvas / mindmap feature area

---

## Canonical Render Path (Production)

```
(site)/research-canvas/page.tsx
  → MindMap (features/mindmap/index.tsx → mind-map.tsx)
    → ReactFlowProvider + MindMapProvider
      → ViewSwitcher (canvasContent=<Graph />)
        → renders one of: Graph | TimelineView | SightingsView | SearchView | DetailView
        → always mounts <FullScreenMenu />
```

`mind-map.tsx` is 16 lines, clean, and is the only shell rendered in production.

---

## Dead Code Inventory

### Dead Shell Files (zero production consumers, confirmed by import grep)

| File | Reason Dead |
|---|---|
| `features/mindmap/smart-mindmap.tsx` | Only re-exported from index.tsx, never consumed |
| `features/mindmap/smart-mindmap-with-auto-connections.tsx` | Only re-exported from index.tsx, never consumed |
| `features/mindmap/smart-mindmap-with-shared-context.tsx` | No production import |
| `features/mindmap/smart-graph.tsx` (feature root) | No production import |

`features/mindmap/index.tsx` re-exports `SmartMindmapWithAutoConnections` as `SmartMindmapEnhanced`, `WrapWithSmartConnections`, and `AutoConnectionEnabledGraph` — all have zero call sites outside the definition files.

### Ghost Routes (confirmed thin wrappers / re-exports)

| Route | What it does | Safe to delete |
|---|---|---|
| `(site)/disclosure/page.tsx` | `export { default } from '../research-canvas/page'` | Yes |
| `(site)/search-and-discovery-interface/page.tsx` | Renders view component outside provider stack | Yes |
| `(site)/content-card-detail-view/page.tsx` | Renders view component outside provider stack | Yes |
| `(site)/ufo-sightings/page.tsx` | Renders view component outside provider stack | Yes |

The three non-disclosure ghost routes are also broken by design: they render view components that depend on `MindMapContext`/`ReactFlowProvider` without those providers being present. They are also unreachable from `FullScreenMenu` navigation (which uses `setActiveView()` in Zustand, not `router.push`).

### Duplicate FloatingToolbar

Two unrelated `FloatingToolbar` implementations exist:
- `features/mindmap/research-canvas/FloatingToolbar.tsx` — **live**, imported by `graph.tsx`
- `features/mindmap/components/menus/mindmap-side-menu/FloatingToolbar.tsx` — has Storybook story but `MindMapSideMenu.tsx` (its consumer) is not in the main render path

---

## Component Health

### ViewSwitcher.tsx — Production-ready, one data inconsistency
- Clean lazy loading with Suspense fallback
- `FullScreenMenu.VIEWS[1].path` = `/ufo-sightings` but `useNavigation.VIEW_PATHS['globe']` = `/sightings`
- No runtime crash because navigation goes through Zustand `setActiveView`, not `router.push`
- `path` field in `ViewItem` interface is decorative; should be removed or made authoritative

### EmptyCanvas.tsx — Half-baked
- `showTimeline` toggle at line 63 uses client-side string matching (`input.includes("timeline" || "research")`)
- `UFO_RESEARCH_EVENTS` at lines 10–45 is hardcoded dummy data
- `ResearchTimeline` renders with fake session stats (47 sessions, 1284 exchanges, etc.)
- Props `agentStatus`, `agentAnalysis`, `agentToolEvents` are correctly threaded down to console — wiring exists
- **Action needed:** Remove dummy timeline branch; replace with `agentStatus`-driven state

### ResearchCanvasConsole.tsx — Production-ready core, one wiring gap
- `useTyper` animation system is complete and functional
- Three `enhancedMessages` suggestion chips ("Guided Tour", "Deep Research", "Explore Network") only affect animation state via `handleMessageClick` — they do not dispatch to the agent
- **Action needed:** Make `handleMessageClick` call `onSubmit(message.title)` to turn decorative affordances into functional ones

### FloatingToolbar.tsx (research-canvas version) — Production-ready
- `useMemo` on panels is correct
- Direct `useMindMapUiStore.getState()` call in click handler (line 98) is correct Zustand pattern
- No issues

### FullScreenMenu.tsx — Production-ready UI, stale data
- Hardcoded `stats` values in `VIEWS` array render on hover preview panel
- Footer mentions arrow-key navigation that is not implemented (only Escape key is handled)
- `handleNavigate` uses `setTimeout(onClose, 300)` — acceptable for animation timing

---

## State Management

### mindmap-ui-store.ts (477 lines) — Healthy
- Well-partitioned typed sub-slices: `NavigationState`, `TourState`, `FilterState`, `TimelineState`, `LayoutSettings`, `AssetsState`
- `persist` middleware correctly partializes to minimal navigation state
- No significant decomposition needed

### mindmap-context.tsx (1,363 lines) — God-object problem
**Owns simultaneously:**
- Graph initialization from 3D data (`useEffect` at line 408)
- Node/edge CRUD (proxies Zustand `useMindMapStore`)
- Layout calculations (15+ layout helper functions)
- Child batch index management
- Group node creation
- Edge factory functions (`createSiblingEdge`, `createRootNodeEdge`, `createRootNodeEdges`)
- Node positioning (`assignPositionsToChildNodes`)
- Viewport control (`adjustViewport`)
- Persistence (`saveMindMap`, `restore`)
- UI-local state (`activeNode`, `conciseViewActive`, `showLocationVisualization`, `locationsToVisualize`)

**Problem:** Every `useMindMapContext()` consumer re-renders on any state change anywhere in this 1,363-line object.

### Minimum Viable Context Decomposition (without full rewrite)

**Extract 1 — Node/edge factory functions → utils**
`createRootNode`, `createRootNodeChild`, `createSiblingEdge`, `createRootNodeEdge`, `createRootNodeEdges` are pure transforms. No React state dependency. Move to `features/mindmap/utils/node-factories.ts`. Eliminates unnecessary `useCallback` wrapping of pure functions.

**Extract 2 — Graph init effect → graph.tsx or hook**
The `useEffect` at line 408 reads `graph3d` and calls `setGraph`. This is a data-fetching side effect that belongs in `graph.tsx` or a `useGraphInit` hook, not in a provider.

**Extract 3 — UI-local state → mindmap-ui-store.ts**
`activeNode`, `conciseViewActive`, `showLocationVisualization`, `locationsToVisualize`, `keepLoadedOnMap` are 5 `useState` calls that should live as a slice in the Zustand store alongside `NavigationState`.

After these three moves: context shrinks to ~200–300 lines and becomes a thin facade over Zustand + `useReactFlow`.

---

## Prioritized Action Plan

### Phase 1 — Subtractive (XS effort, highest clarity payoff)

1. Delete `(site)/disclosure/page.tsx`
2. Delete `(site)/search-and-discovery-interface/page.tsx`
3. Delete `(site)/content-card-detail-view/page.tsx`
4. Delete `(site)/ufo-sightings/page.tsx`
5. Delete `features/mindmap/smart-mindmap.tsx`
6. Delete `features/mindmap/smart-mindmap-with-auto-connections.tsx`
7. Delete `features/mindmap/smart-mindmap-with-shared-context.tsx`
8. Delete `features/mindmap/smart-graph.tsx` (feature root only, not `components/smart-graph/`)
9. Prune `features/mindmap/index.tsx` to: `export * from './mind-map'`
10. Remove `path` field from `ViewItem` interface in `FullScreenMenu.tsx`

### Phase 2 — Fix visible half-baked surfaces (S effort)

11. Remove `UFO_RESEARCH_EVENTS` dummy data and `showTimeline` string-match branch from `EmptyCanvas.tsx`
12. Replace with `agentStatus`-driven empty/loading/streaming state
13. Wire `enhancedMessages` chips in `ResearchCanvasConsole` to call `onSubmit(message.title)`
14. Implement arrow-key navigation in `FullScreenMenu` (add `focusedIndex` state, `keydown` handler for ArrowUp/Down/Enter)

### Phase 3 — State decomposition (M effort, 2–3 days)

15. Move node factory functions to `features/mindmap/utils/node-factories.ts`
16. Move graph init `useEffect` to `graph.tsx` or `useGraphInit` hook
17. Move 5 UI `useState` calls to `mindmap-ui-store.ts` as `canvas` slice
18. Verify context is now thin; audit remaining consumers for targeted selectors

---

## Effort Estimates

| Item | Size |
|---|---|
| Phase 1 (delete + prune) | XS — 1–2 hrs |
| Fix EmptyCanvas | XS — 30 min |
| Wire suggestion chips | XS — 30 min |
| Align ViewItem path field / remove | XS — 1 hr |
| FullScreenMenu keyboard nav | S — half day |
| Extract node factory functions | S — half day |
| Move UI state to Zustand | S — 1 day |
| Extract graph init effect | S — half day |
| Full context decomposition | M — 2–3 days (after above S items) |

---

## Key Files Referenced

- `apps/app/src/features/mindmap/mind-map.tsx` — canonical shell (16 lines)
- `apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx` — view router
- `apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx` — needs cleanup
- `apps/app/src/features/mindmap/research-canvas/research-canvas-console.tsx` — console input
- `apps/app/src/features/mindmap/research-canvas/FloatingToolbar.tsx` — live toolbar
- `apps/app/src/features/mindmap/navigation/FullScreenMenu.tsx` — nav overlay
- `apps/app/src/features/mindmap/hooks/use-navigation.ts` — navigation hook
- `apps/app/src/features/mindmap/store/mindmap-ui-store.ts` — healthy Zustand store
- `apps/app/src/contexts/mindmap/mindmap-context.tsx` — 1,363-line god-object
- `apps/app/src/features/mindmap/graph.tsx` — 359-line core canvas
- `apps/app/src/app/(site)/research-canvas/page.tsx` — canonical route entry
