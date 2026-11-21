# Research Canvas Canonical Route Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `/research-canvas` the canonical research workspace, remove bogus standalone research routes, and ensure external entry points land on the board where agentic contextualization begins immediately.

**Architecture:** Keep the existing `MindMap` + `Graph` canvas as the only true research UI. Delete the standalone search/detail/disclosure route surfaces, route legacy entry points into `/research-canvas`, and add a small client-side canvas-entry bridge that reads URL intent (`type`, selected record IDs, source) and turns it into board actions through existing mindmap state and agent tooling instead of duplicating UI.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Zustand, React Flow, existing `useMindMapAgent`, `useMindMap`, and research-canvas data helpers.

---

## Approved Design

- `/research-canvas` is the only canonical research experience.
- Search happens through the bottom-menu / console agentic flow, not a separate route.
- Query results and selected records render directly onto the board.
- AI contextualization starts from the board entry, then drives connections and next-step suggestions.
- Delete `/search-and-discovery-interface`, `/content-card-detail-view`, and `/disclosure`.
- Update all remaining links and menus so they open `/research-canvas` with lightweight entry intent instead of routing to dead views.

---

### Task 1: Remove bogus route surfaces and align navigation state

**Files:**
- Modify: `apps/app/src/features/mindmap/store/mindmap-ui-store.ts`
- Modify: `apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx`
- Modify: `apps/app/src/features/mindmap/hooks/use-navigation.ts`
- Modify: `apps/app/src/features/mindmap/navigation/FullScreenMenu.tsx`
- Delete: `apps/app/src/app/(site)/search-and-discovery-interface/page.tsx`
- Delete: `apps/app/src/app/(site)/content-card-detail-view/page.tsx`
- Delete: `apps/app/src/app/(site)/disclosure/page.tsx`
- Delete: `apps/app/src/features/mindmap/research-canvas/views/search-and-discovery-interface/page.tsx`
- Delete: `apps/app/src/features/mindmap/research-canvas/views/content-card-detail-view/page.tsx`

**Step 1: Remove legacy view types**

- Drop `search` and `detail` from `ActiveView`.
- Make sure navigation state only models real surfaces that remain supported.

**Step 2: Remove dead lazy views and menu entries**

- Delete the `SearchView` and `DetailView` imports/usages from `ViewSwitcher.tsx`.
- Remove `Search & Discover` and `Case Files` from `FullScreenMenu.tsx`.

**Step 3: Align route mappings**

- Update `use-navigation.ts` so `VIEW_PATHS` and `PATH_TO_VIEW` only point to real routes.
- Keep `/research-canvas` as the research destination.

**Step 4: Delete dead route wrappers**

- Delete the three route files under `app/(site)` that represent bogus standalone surfaces.

**Step 5: Verify references**

Run:

```bash
rg "search-and-discovery-interface|content-card-detail-view|/disclosure" apps/app/src
```

Expected:

- Only intentional cleanup references remain before Task 3.

---

### Task 2: Add a canvas-entry bridge for board-first navigation

**Files:**
- Create: `apps/app/src/features/mindmap/research-canvas/hooks/use-canvas-entry.ts`
- Modify: `apps/app/src/features/mindmap/graph.tsx`
- Modify: `apps/app/src/app/(site)/research-canvas/page.tsx` (only if needed for search param plumbing)
- Reuse: `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts`

**Step 1: Define supported entry params**

- Support the existing `type` query param from command palette links.
- Add a selected-record param for timeline/sightings/history entry (for example `incidentId`).
- Keep the bridge tolerant of unknown or missing params.

**Step 2: Build the bridge hook**

- Read search params on the client.
- Prevent duplicate hydration when the same URL is revisited.
- Normalize URL intent into one board action:
  - seed a selected record onto the board, or
  - prime a board search context for the agentic flow.

**Step 3: Trigger existing board behavior**

- Use existing `useMindMap`, `useMindMapAgent`, and board helpers in `graph.tsx`.
- Do not create a second search UI.
- Ensure seeded entries result in visible nodes/cards on the canvas and kick off contextual analysis.

**Step 4: Clean the URL after hydration if needed**

- If the params are one-time bootstrapping intent, replace the URL after the board is seeded.

**Step 5: Manual verification**

Check:

- `/research-canvas?type=events`
- `/research-canvas?incidentId=<known-id>`

Expected:

- The board is the destination in both cases.
- Nodes/cards appear without opening a bogus detail/search route.

---

### Task 3: Repoint all legacy entry links into `/research-canvas`

**Files:**
- Modify: `apps/app/src/features/mindmap/research-canvas/views/timeline/page.tsx`
- Modify: `apps/app/src/features/mindmap/research-canvas/views/ufo-sightings/page.tsx`
- Modify: `apps/app/src/features/timeline/3d-z-axis-timeline.tsx`
- Modify: `apps/app/src/app/(site)/history/scroll-timeline.tsx`
- Modify: `apps/app/src/components/command-palette/default-commands.tsx`

**Step 1: Replace detail-route links**

- Every link that points to `/content-card-detail-view?id=...` should instead point to `/research-canvas` with board-entry intent.

**Step 2: Preserve useful intent**

- Keep enough info in the URL for the canvas-entry bridge to know what to seed.
- Reuse existing `type` links from command palette rather than inventing a second param format unless needed.

**Step 3: Remove dead CTA destinations**

- Eliminate remaining links/buttons that send users to deleted search/detail/disclosure routes.

**Step 4: Verify navigation from each surviving surface**

Manually check:

- Timeline → Research Canvas
- UFO Sightings → Research Canvas
- History timeline → Research Canvas
- Command palette → Research Canvas

Expected:

- Every path ends on the canvas board.

---

### Task 4: Validate, tighten, and ship the slice

**Files:**
- Review: all files touched in Tasks 1–3

**Step 1: Confirm dead-route cleanup**

Run:

```bash
rg "search-and-discovery-interface|content-card-detail-view|/disclosure" apps/app/src
```

Expected:

- No stale route destinations remain.

**Step 2: Run lint**

Run:

```bash
cd apps/app && bun run lint
```

Expected:

- No lint errors introduced by the route-flow changes.

**Step 3: Run build for route/type validation**

Run:

```bash
cd apps/app && bun run build
```

Expected:

- Next.js app builds successfully after route deletion and navigation cleanup.

**Step 4: Manual smoke test**

- Open `/research-canvas`
- Trigger at least one command-palette entry that uses `?type=...`
- Open at least one timeline/sightings/history item that should seed the board

**Step 5: Commit**

```bash
git add apps/app/src apps/app/package.json docs/plans/2026-03-27-research-canvas-canonical-route-flow.md
git commit -m "feat(research-canvas): make the canvas the canonical research flow"
```
