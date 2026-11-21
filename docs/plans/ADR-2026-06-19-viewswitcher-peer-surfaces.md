# ADR-2026-06-19: Demote vs Cut the Four ViewSwitcher Peer Surfaces

**Status:** Proposed (decision pending owner sign-off)
**Date:** 2026-06-19
**Context source:** `docs/plans/2026-03-29-research-canvas-frontend-architecture-audit.md`
**Scope:** Research canvas / mindmap surface composition

---

## Context

The 2026-03 frontend architecture audit established the **Graph canvas as the single
production render path** for the research canvas:

```
(site)/research-canvas/page.tsx
  -> MindMap -> ReactFlowProvider + MindMapProvider
    -> ViewSwitcher (canvasContent=<Graph />)
```

`ViewSwitcher.tsx`
(`apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx`) currently lazy-mounts
four additional surfaces as **siblings/peers of the Graph canvas**, switched by
`navigation.activeView` from the Zustand UI store:

```ts
const TimelineView  = lazy(() => import('.../views/timeline/page'))
const SightingsView = lazy(() => import('.../views/ufo-sightings/page'))         // 'globe'
const SearchView    = lazy(() => import('.../views/search-and-discovery-interface/page'))
const DetailView    = lazy(() => import('.../views/content-card-detail-view/page'))
```

The component itself is healthy (clean `Suspense` lazy loading, single data
inconsistency on a decorative `path` field). The unresolved question is **architectural,
not implementational**: the audit named Graph the sole primary surface but never made
the cut-vs-demote decision explicit for these four peers. They sit in the switch with
equal billing to the canvas, yet their backing ghost routes were flagged as dead/broken:

- The audit's Ghost Routes table marks `(site)/ufo-sightings`,
  `(site)/search-and-discovery-interface`, and `(site)/content-card-detail-view` as
  "Renders view component outside provider stack" and **broken by design** -- they depend
  on `MindMapContext`/`ReactFlowProvider` that those routes never mount, and are
  unreachable from `FullScreenMenu` navigation (which uses `setActiveView()`, not
  `router.push`).
- Note the distinction: the **ghost routes** are dead; the **view components** under
  `features/mindmap/research-canvas/views/` are still reachable *inside* the canvas
  provider stack via `ViewSwitcher`. Cutting the routes is not the same as cutting the
  views.

This ADR exists to unblock the decision. It does **not** implement it.

---

## Decision Options

### Option A -- Cut entirely
Remove the four peer branches from `ViewSwitcher`, delete the four `views/*` components,
and prune the corresponding `activeView` cases from the navigation slice. `ViewSwitcher`
collapses to "render `canvasContent`, mount `FullScreenMenu`".

- **Pro:** Maximum simplification; eliminates partially-wired surfaces and the
  decorative `path` inconsistency in one stroke. Honors "Graph is the sole surface"
  literally.
- **Con:** Discards real UI work (timeline, globe/sightings, search, detail) that may be
  on the roadmap. Irreversible without re-implementation; loses the lazy-mount scaffolding
  that already works.

### Option B -- Demote to secondary navigation (recommended)
Keep the four view components, but **reclassify them as secondary surfaces** rather than
peers. Graph remains the default and primary canvas; the others become explicitly
secondary destinations reached through `FullScreenMenu`/secondary nav, documented as
non-primary. `ViewSwitcher` keeps the switch but the mental model and docs make the
hierarchy unambiguous (Graph primary; timeline/globe/search/detail secondary). The
decorative `path` field is removed or made authoritative as part of follow-up.

- **Pro:** Preserves working code and the audit's intent (Graph is primary) without
  destroying optionality. Low risk -- mostly a classification + documentation change plus
  the existing `path` cleanup. Reversible.
- **Con:** `ViewSwitcher` remains a multi-surface switch; the four views stay only
  partially wired until separately hardened. Defers, rather than resolves, their data
  wiring.

### Option C -- Keep as co-equal peers (status quo)
Leave `ViewSwitcher` as-is with all five branches at equal billing.

- **Pro:** Zero work.
- **Con:** Contradicts the audit's "Graph as sole primary surface" finding; leaves the
  cut-vs-demote question permanently open and the surfaces in their current half-wired
  state.

---

## Recommendation

**Adopt Option B -- demote to secondary navigation.**

Rationale:
1. **Preserves intent without destroying assets.** The audit's concern was *primacy*, not
   *existence* -- it never declared the four views worthless, only that Graph is the one
   production canvas. Demotion satisfies primacy while keeping reusable view code and the
   working lazy-mount scaffolding.
2. **Low risk, reversible.** Reclassification + docs + the already-flagged `path` cleanup
   is far cheaper and safer than deleting four components and their navigation wiring. If
   a surface later proves dead, cutting it then is trivial; un-deleting after Option A is
   not.
3. **Matches the codebase's stated direction.** `features/mindmap/CLAUDE.md` already
   distinguishes live shells from dead code and routes navigation through Zustand
   `setActiveView()`; demotion formalizes that hierarchy for the views without a
   destructive change.

Option A should only be chosen if the product owner confirms timeline/globe/search/detail
are off the roadmap. Option C is rejected -- it leaves the audit's finding unactioned.

---

## Consequences

**If Option B is accepted:**
- `ViewSwitcher.tsx` retains its switch; documentation (`features/mindmap/CLAUDE.md` and
  the canonical render-path notes) is updated to label Graph as primary and the four
  views as secondary.
- The decorative `path` field on `ViewItem` (audit: `FullScreenMenu.VIEWS[1].path`
  vs `VIEW_PATHS['globe']` mismatch) is removed or made authoritative in follow-up.
- The dead **ghost routes** (`(site)/ufo-sightings`, etc.) remain slated for deletion per
  the audit -- this ADR does not affect that; cutting the routes is independent of keeping
  the views.
- Each secondary view's half-wired state (e.g., dummy data noted around `EmptyCanvas` /
  timeline) is tracked separately for hardening; demotion does not block their later
  wiring.

**If Option A is later chosen instead:** the four `views/*` directories and their
`ViewSwitcher` branches are removed together with the navigation cases; `ViewSwitcher`
simplifies to canvas-only.

**Cross-references:**
- `docs/plans/2026-03-29-research-canvas-frontend-architecture-audit.md` (source audit)
- `apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx` (subject component)
- `apps/app/src/features/mindmap/CLAUDE.md` (render-path + dead-code guidance)
