# apps/app

Local constraints for the Next.js app. Nested guidance does not expand task scope.

File references in this file must be markdown links whose href is the workspace path from repo root (see [`AGENTS.md`](AGENTS.md#markdown-file-links-binding)). No `../` climbs and no `@/` hrefs.

## Mindmap / research canvas

- Wrapper routes in [`apps/app/src/app/(site)/`](apps/app/src/app/(site)/) may be thin route aliases. Do not assume the wrapper is the UI.
- For canvas regressions, trace: route page → provider → shell → [`ViewSwitcher`](apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx) → rendered view.
- [`apps/app/src/app/(site)/research-canvas/page.tsx`](apps/app/src/app/(site)/research-canvas/page.tsx) can share the `MindMap` shell. [`ViewSwitcher.tsx`](apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx) decides Graph / search / timeline / globe / detail.
- Unexpected default UI: check current wiring and git history of the route page plus [`ViewSwitcher.tsx`](apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx).

```
(site)/research-canvas/page.tsx
  -> MindMap (features/mindmap/index.tsx -> mind-map.tsx)
    -> ReactFlowProvider + MindMapProvider
      -> ViewSwitcher (canvasContent=<Graph />)
        -> Graph | TimelineView | SightingsView | SearchView | DetailView
        -> always mounts <FullScreenMenu />
```

Prose map: [`research-canvas/page.tsx`](apps/app/src/app/(site)/research-canvas/page.tsx) → [`MindMap`](apps/app/src/features/mindmap/index.tsx) / [`mind-map.tsx`](apps/app/src/features/mindmap/mind-map.tsx) → [`ViewSwitcher`](apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx).

## State

- UI state: Zustand [`mindmap-ui-store.ts`](apps/app/src/features/mindmap/store/mindmap-ui-store.ts).
- Do not add logic to [`mindmap-context.tsx`](apps/app/src/contexts/mindmap/mindmap-context.tsx).
- Navigation: Zustand `setActiveView()`, not `router.push()`. FullScreenMenu `path` fields are decorative.

## Live AI paths (do not invent others)

1. Disclosure mindmap — `/api/disclosure/mindmap` (Assistants API + SSE). Client: `useMindMapAgent`.
2. Prometheus chat — `/api/prometheus/chat` (`streamText`). Prometheus code: [`apps/app/src/services/ai/prometheus`](apps/app/src/services/ai/prometheus).

Search in both uses Postgres FTS + pgvector via `@db/postgres` (RRF fusion). Spatial grouping is bounding-box via `useProximityAnalysis`, not R-Tree/rbush.

Clerk middleware gates `/admin` and `/api/processing`; most `/api/disclosure/*` and `/api/prometheus/chat` remain public.
