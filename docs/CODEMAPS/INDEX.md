# CODEMAPS: Research Canvas & Mindmap Integration

## 1. Structural Map
The integration of `apps/ufo-ui` into `apps/app` is primarily an architectural consolidation and cleanup task. `apps/ufo-ui` acts as a standalone Next.js 16 (v0 scaffold) workspace containing static prototypes and mock data, while `apps/app` houses the true production environment with Next.js 15, DB integration, and full state management.

- **`apps/app/src/app/(site)/research-canvas/page.tsx`**: The canonical Next.js entrypoint. It wraps the canvas in providers (e.g., `MindMapProvider`) and defers rendering to the shell and `ViewSwitcher`.
- **`apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx`**: The primary SPA router, using Zustand (`mindmap-ui-store.ts`) to toggle between views without page reloads.
- **`apps/ufo-ui` components**: Contains isolated UI components (like `EmptyCanvas`, `FloatingToolbar`, `EnhancedAnimatedChat`). A subset of these have already been partially copied/ported to `apps/app/src/features/mindmap`.

## 2. Data Flow & Infrastructure
- **Packages/DB (`@db`)**: The central Xata layer containing 24 models (mindmaps, events, sightings, etc.). `apps/app` connects to this. `apps/ufo-ui` has zero database connectivity and relies entirely on static mock files (e.g., `ufo-sightings.ts`).
- **State Management (`apps/app`)**:
  - `mindmap-ui-store.ts` (Zustand): Clean, partitioned slices for global UI view-state.
  - `mindmap-context.tsx`: A 1,363-line god-object owning graph init, node/edge CRUD, layout, and persistence. Requires refactoring to extract node factories and move UI-local state to Zustand.
- **Merge Infrastructure Needs**: 
  - Point any migrated `ufo-ui` components to the live `@db` data sources (Xata) rather than static dummy data.
  - Rely exclusively on `apps/app`'s shared environment variables, context providers, and build scripts.

## 3. Concrete Merge Plan
Based on the architecture audits (e.g., `2026-03-29-research-canvas-frontend-architecture-audit.md`):
1. **Visual Polish Porting**: Diff any remaining `ufo-ui` components (e.g., console refactoring, EmptyCanvas conditional rendering, and FullScreenMenu keyboard nav) and port necessary styling/polish over to the active components in `apps/app/src/features/mindmap`.
2. **Component Wiring**: Wire the migrated v0 components (like `EmptyCanvas` and suggestion chips) to live Xata DB queries and agent context, replacing hardcoded dummy payloads.
3. **Dead Code Cleanup**: Delete ghost routes (`/disclosure`, `/ufo-sightings`) in `apps/app`. Wipe the `apps/ufo-ui/app/research-canvas/` directory entirely, as it is an inferior duplicate lacking providers and React Flow context.
4. **State Refactoring**: Extract node factories, graph-init side-effects, and UI-local state from `mindmap-context.tsx` to simplify initialization and prevent unnecessary re-renders.