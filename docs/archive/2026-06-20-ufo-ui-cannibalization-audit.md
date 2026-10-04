# UFO-UI Cannibalization — Dogfood + UI/UX Audit

> **Created:** 2026-06-20 · **Method:** guided UI/UX pass (owner + Claude)
> **Direction:** `apps/app` is HOME. Extract ufo-ui's better-designed UI piecemeal
> into `apps/app/src`, then delete `apps/ufo-ui`. (Corrects the backwards
> 2026-05-29 marriage doc.)
> **AI naming:** the assistant is **Prometheus** (chat + mindmap together).

## Method

A thorough dogfood pass: walk each user flow in ufo-ui, and for every screen capture
four layers, then decide what to extract and where it mounts in the target app.

For each flow/screen we record:
1. **User flow** — what the user is doing, step by step (the storyboard).
2. **State layer** — what state drives it (stores, contexts, local hooks, URL).
3. **Data queries** — what data it reads/writes (DB tables, API routes, Prometheus).
4. **Components to extract** — the specific ufo-ui files worth taking.
5. **Target placement** — where each lands in `apps/app/src`, and what it
   replaces/merges with (apps/app already has partial ports from the May work).

## Source resources

| # | Resource | Provided | Notes |
|---|----------|----------|-------|
| R1 | v0 chat (live, current) | ✅ | https://v0.app/chat/ufo-ui-ihVZP9qODce?ref=HTKG29 — owner's authenticated chat, v33, actively iterated (Digital Mischief Group). Latest edits 2026-06-20 ~21:18 were Next.js-16 build fixes (co-locate `timeline-explorer/timeline-client.tsx` behind a `"use client"` boundary), NOT redesigns. Inline code export locked ("Duplicate this chat to use a more powerful code editor"). |
| R2 | _(awaiting from owner)_ | ⏳ | |
| — | v0 source (earlier ref) | ✅ | https://v0.app/chat/ufo-ui-3-yydhq5aYyJX?ref=HTKG29 |
| — | local donor code | ✅ | `apps/ufo-ui/` (the v0 output, in-repo) |

> **SYNC STATUS (2026-06-20):** local `apps/ufo-ui/` is a **Jun-16 snapshot** (commit
> `b089314`, never re-synced; only `lib/local-data.ts` dirty). It is behind the v0 chat
> on build structure (e.g. no `timeline-explorer/timeline-client.tsx` locally) but the
> **visual design is intact locally** — the v33 deltas were build fixes, not UI changes.
> Decision: cannibalize design from local code now; reconcile the minor build deltas
> separately. Re-pulling latest v0 requires Duplicate-chat → CLI (owner action) and is
> NOT a blocker for the design port.

> **Live design observed (browser, 2026-06-20):** Research Canvas = dark theme, left
> vertical rail of panel-trigger icons (the 13 hover-panels), centered `EmptyCanvas`
> with a "Type your message…" input + domain suggestion cards (e.g. "Ancient
> Archaeology"). Clean, polished — matches local `components/research-canvas/`.

## ufo-ui surface inventory (from local code)

**Routes:** `/` (page), `/research-canvas`, `/timeline`, `/timeline-explorer`,
`/search-and-discovery-interface`, `/content-card-detail-view`, `/ufo-sightings`

**research-canvas/** EmptyCanvas, Typer, AnimatedChat (+ Enhanced, + WithSuggestions),
MessageInput, FloatingToolbar, ToolbarButton, ActionChip, ResearchTimeline, AssetPanel
**hover-panel(s)/** (13) Network, Filter, Layout, Layers, History, QuickActions,
SavedViews, Settings, Templates, Timeline, AssetLibrary, Collaboration, Archive
**navigation/** FullScreenMenu, MenuTrigger
**pages/** NetworkTimelineExplorer _(exists ONLY in ufo-ui — never ported)_
**ui/** full shadcn set (accordion…command…dialog…dot-pattern…)

## Flow-by-flow audit

> Filled during the guided pass. One subsection per user flow.

### FLOW 1 — Network Timeline Explorer (CANN-3, donor-only)
- **User flow:** user opens a full-screen spiral network graph of UAP incidents (nodes =
  sightings, positioned by date in expanding rings; edges = related incidents). Zoom
  (wheel + buttons), pan (drag), hover a node → label tooltip + pulse + highlight its
  edges, click a node → sliding right detail panel (image, classification badge, date,
  location, witnesses, description, credibility, tags, sources, "View Full Details" link).
  Classification filter panel (CE1–CE4, Radar, Military, Mass), legend, live stats bar
  (incident + connection counts).
- **State layer:** all local `useState` (zoom, pan, isDragging, dragStart, selectedNode,
  hoveredNode, filterClassification, showFilters). No store, no URL. Self-contained.
- **Data queries:** ⚠️ reads static `@/data/ufo-sightings` (`UFO_SIGHTINGS`). Shape per
  incident: `{ id, date, name, location, classification, relatedIncidents[], witnesses,
  description, credibility, image, tags[], sources[] }`. **Must be rewired** to live
  `@db/postgres` — candidate source: the events/sightings tables + the entity-graph edge
  data already powering the mindmap (`loadEntityGraph`). The `relatedIncidents` edges map
  naturally onto existing graph connections.
- **Components to extract:** `apps/ufo-ui/components/pages/NetworkTimelineExplorer.tsx`
  (491 lines) + its dep `components/ui/FloatingHeader`. Deps already in app: framer-motion,
  lucide-react, next/link.
- **Target placement (apps/app):** mount as a **view inside the research canvas**, not a
  route — register in `ViewSwitcher` + Zustand `setActiveView()` (per CLAUDE.md: no
  `router.push` for canvas nav). Likely `features/mindmap/views/network-timeline-view.tsx`.
- **Decision / notes:** NOT in apps/app despite SP4 marked DONE — genuine gap. Highest-ROI
  first port (donor-only, no merge conflict). The ONE real decision: which live query backs
  the `UFOSighting` shape. Until decided, port can land behind a typed `NetworkIncident`
  adapter so the component is data-source-agnostic.

## Component extraction & placement map

| ufo-ui source | Keep? | apps/app target | Replaces / merges with | Status |
|---------------|-------|-----------------|------------------------|--------|
| `components/pages/NetworkTimelineExplorer.tsx` | ✅ | `features/mindmap/views/network-timeline-view.tsx` (+ ViewSwitcher entry) | nothing — new view | 📋 scoped, awaiting data-wiring decision |
| `components/ui/FloatingHeader.tsx` | ✅ (dep) | `features/mindmap/components/` or reuse existing app header | check for existing header first | 📋 pending |
| `components/research-canvas/*` (11) | 🔶 diff | existing `features/mindmap` research-canvas | merge UX deltas (May partial port exists) | 📋 CANN-1 |
| `components/hover-panel(s)/*` (13) | 🔶 diff | existing app panels | merge visual/UX deltas | 📋 CANN-2 |

## Open questions / risks

- apps/app already has partial ports (May 2026 marriage work) — for each component,
  decide merge-into-existing vs replace.
- Two Zustand stores already exist (`mindmap-ui-store`, mindmap store) — avoid adding a third.
- Prometheus data wiring: extracted UI must point at the live `@db/postgres` +
  `/api/disclosure/mindmap` + `/api/prometheus/chat`, NOT ufo-ui's static datasets.

## Deletion gate (final step)

`apps/ufo-ui` is deleted only when: every "Keep" component is ported + verified in
apps/app, no apps/app code imports from ufo-ui, and the routes above have equivalents.
