# T-027 — ResearchSession Unified State Slice

**Status:** Slice landed (non-destructive). Consumer migration deferred.
**Date:** 2026-06-20
**Owner:** supervised autonomous dev session (Wave 3)
**Touches:** `apps/app/src/features/mindmap/store/mindmap-ui-store.ts`

## Problem

Research-session state was fragmented across three independent providers, each
with its own lifecycle, persistence story, and source of truth:

| Source | State it owned | Persistence |
|--------|----------------|-------------|
| `contexts/research/research-context.tsx` (`ResearchProvider`) | `pinnedCards`, `canvasNotes`, `selectedCard`, `isAnalyzing` | none (in-memory React state) |
| `components/menus/mindmap-bottom-menu/hooks/use-research-state.ts` | `sessionId`, `activeMode`, `isProcessing`, `selectedNodes`, `tourState`, `analysisResults` | `sessionId` only, via raw `localStorage` |
| `contexts/mindmap/mindmap-context.tsx` (god-object) | node selection, layout, data fetch | partial |

Consequences: two `sessionId` notions, duplicate "selected nodes" tracking, no
single place to reset a research session, and `localStorage` written by hand
outside the Zustand persist layer.

## What landed

A new **`researchSession`** slice on the existing `useMindMapUiStore`
(`mindmap-ui-store.ts`). It is **purely additive** — no existing provider was
removed or rewired, so nothing breaks. The slice is the designated convergence
target the legacy providers migrate onto incrementally.

### Shape

```ts
type ResearchSessionState = {
  sessionId: string | null
  activeMode: 'research' | 'tour' | 'analysis' | null
  isProcessing: boolean
  selectedNodeIds: string[]
  analysisResults: Array<Record<string, unknown>>
  pinnedCards: ResearchPinnedCard[]   // {id, type?, title?, pinnedAt, notes?, position, data?}
  canvasNotes: string
}
```

### Actions

`initResearchSession(sessionId?)`, `setResearchMode`, `setResearchProcessing`,
`setResearchSelectedNodes`, `addResearchAnalysisResult`,
`clearResearchAnalysisResults`, `pinResearchCard`, `unpinResearchCard`,
`updateResearchCardNotes`, `setResearchCanvasNotes`, `resetResearchSession`.

`pinResearchCard` reproduces the legacy 3-column auto-grid positioning from
`research-context.tsx` (`x = (n % 3) * 320 + 20`, `y = floor(n/3) * 200 + 20`)
when no explicit position is supplied, and upserts by `id`.

### Persistence

`sessionId`, `pinnedCards`, and `canvasNotes` are added to the store's
`partialize`, so the research session now survives reloads through the same
`mindmap-ui-storage` key as the rest of the UI store — replacing the ad-hoc
`localStorage.getItem('researchSessionId')` path in `use-research-state.ts`.
Volatile fields (`isProcessing`, `activeMode`, `selectedNodeIds`,
`analysisResults`) are intentionally **not** persisted.

## Migration plan (deferred — do NOT do blindly)

Migrate consumers one at a time, verifying each compiles and renders before the
next. Order chosen to minimize blast radius:

1. **`use-research-state.ts`** → read/write `state.researchSession` instead of
   local `useState`. Drop the hand-rolled `localStorage` session-id effect;
   call `initResearchSession()` once on mount. Keep `tourState` either by
   folding it into the existing Zustand `tour` slice (already present) or by
   adding `tourState` to `researchSession` — prefer the existing `tour` slice.
2. **`research-context.tsx`** → back `pinnedCards`/`canvasNotes` with the slice;
   keep `ResearchProvider` as a thin compatibility wrapper exposing the same
   `ResearchContextType` so its consumers don't change in this step.
3. Once both wrappers delegate to the store, inline the store hooks at call
   sites and delete the providers + `use-research-state.ts`.

### Consumers to audit before deleting providers

- Anything importing `useResearch` from `contexts/research/research-context`
- Anything importing `useResearchState` from the bottom-menu hook
- `session-notes-context` interplay (`addNoteFromMessage`) — out of scope here

## Verification

`bunx tsc --noEmit` — zero new errors in `mindmap-ui-store.ts` (baseline of
~47 pre-existing errors in 7 unrelated files unchanged). No runtime wiring
changed, so no behavioral risk from this commit.
