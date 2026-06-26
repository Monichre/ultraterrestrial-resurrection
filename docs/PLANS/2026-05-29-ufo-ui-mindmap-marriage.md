# UFO-UI × Mindmap Marriage — Plan & Progress

> **✅ PORT CONFIRMED & FINALIZED 2026-06-26.** Every valuable `apps/ufo-ui`
> component has been absorbed into `apps/app/src/features/mindmap` and is wired
> into the **live** render path (`(site)/research-canvas` → `MindMap` →
> `ViewSwitcher` → `Graph`/views + always-mounted `FullScreenMenu`). Verified:
> - `tsc --noEmit` across `apps/app` is **clean** in all ported areas
>   (`research-canvas`, `hover-panel`, `navigation`). One JSX syntax error in
>   `features/research-canvas/ufo-research-orchestrator.tsx:707` (literal `>`
>   parsed as a tag) was fixed (`{'>'}`); the inconsistent `.tsx` import
>   extension in `graph.tsx` was normalized.
> - Canvas overlay confirmed wired in `graph.tsx`: `isEmpty` → `EmptyCanvas`
>   hero/Typer idle state; non-empty → `FloatingToolbar` + `SessionNotes` +
>   ActionChips + `ResearchCanvasConsole` (this is "Step 3 slice 2", done).
> - `apps/app/src` has **zero** `ufo-ui` imports — copy is decoupled.
>
> **Donor-only leftovers are dead weight** (superseded predecessors, not worth
> porting): `AnimatedChat.tsx`, `AnimatedChatWithSuggestions.tsx`, `Typer.tsx`
> (replaced by `EnhancedAnimatedChat` + the refactored `typer/` dir). The donor's
> `NetworkTimelineExplorer` is the `views/timeline/page.tsx`, and the ported copy
> is **better** (already DB-wired via `getTimelineEvents`, with static fallback).
> Orphan note: `research-canvas/ResearchTimeline.tsx` has no consumers (D2's
> repurposing-over-`sessionEvents` is still open).
>
> **Remaining to fully retire the donor:** (a) browser walk of the Verification
> checklist below; (b) delete `apps/ufo-ui` (`my-v0-project`) — matched only by
> the `apps/*` workspace glob, no inbound refs. Destructive; awaiting go-ahead.

> **⚠️ DIRECTION CORRECTED 2026-06-20 (owner):** This doc's original premise —
> "ufo-ui as the host shell, delete apps/app" (see D10 below) — is **BACKWARDS**.
> The correct direction: **`apps/app` is the home.** Cannibalize ufo-ui's
> better-designed components piecemeal INTO `apps/app/src`, then **delete
> `apps/ufo-ui`**. Read every "host shell = ufo-ui" / D10 statement below as
> reversed. The component wiring decisions (D1–D8) are still useful reference.
>
> **Created:** 2026-05-29
> **Branch:** `dev`
> **Home app:** `apps/app` · **Donor (to be deleted):** `apps/ufo-ui`
> Companion audit: `docs/PLANS/2026-03-29-research-canvas-frontend-architecture-audit.md`

## Context

`apps/ufo-ui` provides a polished UX shell (EmptyCanvas/Typer, FullScreenMenu,
FloatingToolbar, route map) documented in its `docs/` set (user-journey,
app-flow, visual-interface-inventory, STORYBOARD). `apps/app/src/features/mindmap`
provides the working engine (ReactFlow graph, Zustand stores, agent + Xata data
layer). This plan marries the two with **ufo-ui as the host shell** and the
mindmap as the engine. The first executable slices have landed on `dev`.

## Progress log

### Done (2026-05-29)

- **D1 — Typer submit bug fixed.** `use-typer.ts` no longer flips
  `showEnhancedChat` on keystroke; `research-canvas-console.tsx` defers it to
  submit (`hasSubmitted`) or card click. EmptyCanvas got the ufo-ui hero idle
  state. Commit `2527e50`.
- **UI panel wiring** (commit `88f1f42` / `b5f492f`):
  - `store/mindmap-ui-store.ts` — added non-persisted `sessionEvents` log
    (`addSessionEvent`/`clearSessionEvents`) and `hiddenNodeTypes` visibility set
    (`toggleNodeTypeHidden`/`setNodeTypeHidden`).
  - `graph.tsx` — emits session events on query / nodes added / analysis / tour;
    derives `visibleNodes` from `hiddenNodeTypes` (ReactFlow `hidden` flag, no
    behavior change until a layer is toggled).
  - `HistoryPanel` — live session log (was hardcoded `HISTORY_ACTIONS`).
  - `LayersPanel` — layers derived from live node `data.type` + counts; toggles
    drive `hiddenNodeTypes`.
  - `QuickActionsPanel` — real ops via `useMindMap()`/store: Add Node, Search,
    Fit View, Save Session, Export JSON, Clear Canvas; recent activity from log.
  - `SavedViewsPanel` — localStorage-backed multi-view save/load/delete via
    store `getNodes/getEdges` + `setNodes/setEdges`; tour buttons call `startTour`.
  - `FloatingToolbar` — surfaced the now-wired Layers + History panels.
  - `FullScreenMenu` — canvas stats reflect live node/edge counts.
  - Case Files (`content-card-detail-view`) — no-`id` renders a browsable case
    index instead of a dead-end; unknown id still shows not-found.
  - Deleted duplicate `research-canvas/typer/ResearchCanvasMessageInput.tsx`.

**Not yet verified in a browser** — `node_modules` was absent in the build
environment, so no `tsc`/`lint`/dev-server run. Verify layer hiding and the
Case Files `?id=` links in the running app.

### Next

1. **Step 3 slice 2 — mount the live graph from the empty state.** EmptyCanvas
   currently overlays on an empty ReactFlow; confirm the graph takes over on
   first agent response and the hero/console collapse cleanly.
2. **D2 — ResearchTimeline over real session state** (use the new
   `sessionEvents` log instead of static `UFO_RESEARCH_EVENTS`).
3. **D7 — graduate static `UFO_SIGHTINGS` to Xata** via existing actions
   (`fetch-next-mindmap-records`, `initiateDatabaseTableQuery`, `xataToXYFlow`).
   Audit `scripts/data-import/` for sightings coverage first.
4. **D3 — collapse command surfaces.** Fold OracleCommandList commands into the
   Typer suggestion chips; delete the old bottom menu.
5. **D9 — Clerk auth** (separable; can defer).

## Decisions (reference)

- **D1** Typer: defer `showEnhancedChat` to submit. ✅ done
- **D2** `ResearchTimeline` becomes a view over the live `sessionEvents` log,
  keeping the monospace ASCII styling. Store hook now exists.
- **D3** One command surface — Typer wins; port `/search /add /analyze /scrape`
  as suggestion chips; drop `/connect`.
- **D4** FloatingToolbar panels wire to mindmap context/stores. ✅ done for
  Network/Filter/Layout/Asset/Layers/History/SavedViews/QuickActions; Timeline
  already wired via `onRequestData`.
- **D5** State ownership: `useMindMapStore` (graph), `useMindMapUiStore` (UI +
  session log + layer visibility), `MindMapProvider` (ReactFlow + helpers), URL
  params (`?id=`, view), `useTyper` local (ephemeral).
- **D6** Case Files index instead of dead-end. ✅ done (in-view index; a
  dedicated `/case-files` route remains optional).
- **D7** Static datasets → Xata via existing actions. pending
- **D9** Adopt Clerk from apps/app. pending
- **D10** ufo-ui absorbs mindmap; delete apps/app once nothing imports it.

## Verification checklist

- [ ] `/research-canvas` FullScreenMenu canvas stats show real node/edge counts
- [ ] Submitting a query logs a `query` event in the History panel
- [ ] Adding nodes logs `nodes_added`; analysis logs `analysis`
- [ ] Toggling a layer in LayersPanel hides/shows those nodes
- [ ] Quick action Save writes `localStorage.mindmap-cache`; Export downloads JSON
- [ ] SavedViews Save Current → reload → Load View restores the canvas
- [ ] Case Files menu entry shows the case index; clicking a card opens detail

## Honest review (carried forward)

- Confident: D1, D3 direction, D10. 
- Hedged: D2 depends on the new session log being sufficient (it is, for a
  basic timeline); D7 assumes a Xata sightings table exists — confirm before
  wiring; D4 "wired" now means behavior-verified by inspection, not browser.
- Watch: step 3 slice 2 is the load-bearing change — slice it (store → graph
  mount → agent) rather than one big edit.
- Pushback: two Zustand stores may be one too many; `/case-files` route is
  optional scope; Clerk can be a follow-up.
