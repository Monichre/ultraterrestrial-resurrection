---
status: live
role: eng
spine: do
updated: 2026-08-01
supersedes: none
depends-on:
  - docs/vision/TEMPORAL_OBSERVATORY.md
  - docs/adr/0002-temporal-observatory-gl4ss-integration.md
---

# Spacetime Canvas — Implementation Plan

**Feature family:** Temporal Observatory
**This document:** the build plan for the **Spacetime Canvas** — the first and
load-bearing surface of the family.
**Ticket:** T-047 (Foundation) → this plan expands it.

---

## 0. Why "Spacetime Canvas"

The platform already has a **Research Canvas**: a surface where the user
arranges *ideas* — entities, relationships, notes — in conceptual space.

The **Spacetime Canvas** is its sibling: the same verb, a different axis. The
user arranges and traverses *evidence in space and time*. Same posture
(a canvas you work on, not a chart you look at), same design grammar,
orthogonal dimension.

This naming is deliberate and load-bearing. Keep the pairing visible in
routes, module names, and copy:

| Surface | Organizes | Route | Module |
|---|---|---|---|
| Research Canvas | ideas, entities, relations | `/research-canvas` | `features/mindmap/` |
| Spacetime Canvas | evidence across space + time | `/spacetime` | `features/spacetime/` |

---

## 1. The architectural finding (load-bearing)

The reference scroll UI — `v0-ultraterrestrial-research-canva.vercel.app/timeline-explorer`
— was inspected live on 2026-08-01. What it actually is:

```
Next.js  +  GSAP  +  Lenis (smooth scroll)
22,056px scroll height  ≈  24 viewport-heights,  19 encounters
ZERO <canvas> elements.  No Three.js, no R3F, no WebGL.
```

Its DOM has exactly two structural layers:

```
.fixed.inset-0.overflow-hidden.bg-neutral-950     ← BACKGROUND: a stack of 8
   ├── img roswell-ufo-crash-site-desert.jpg         cross-fading <img> era
   ├── img washington-dc-capitol-ufo-1952.jpg        plates, pinned to viewport
   ├── img socorro-new-mexico-ufo-egg-shaped…
   └── …

.absolute.inset-0                                  ← NARRATIVE: CSS 3D
   perspective: 900px                                 cards fly toward the
   transform-style: preserve-3d                       viewer on scroll
   └── matrix3d(…, translateZ(-674px), …)
```

**The seam:** the background is a *slot*, currently filled with static images,
and the narrative layer above it never touches WebGL. So:

> **The Spacetime Canvas globe drops into the `.fixed.inset-0` slot, and the
> scroll narrative becomes Guided Investigations rendered as descent.**

This unifies three storyboarded concepts into one surface instead of three:

- **Concept 01 (Spacetime Canvas)** → the fixed globe layer
- **Concept 02 (Guided Investigation)** → the scrolling waypoint cards
- The **adaptive temporal dial** → the left rail, already present as a year ladder

Scroll position becomes the single driver: `scrollProgress → temporalCursor →
{ globe camera, active layers, visible waypoint }`.

### Why this is worth doing rather than building two surfaces

The alternative — a globe page and a separate scroll page — reproduces exactly
the failure ADR 0002 rejected for GL4SS: two navigation systems, two state
models, a jarring seam between "exploring" and "reading." One surface with a
live background is the whole point.

---

## 2. Three risks to verify *while* building

These are not blockers; they are measurements to take at the point they become
answerable. Do not hand-wave any of them.

### R1 — `position: fixed` WebGL under a `preserve-3d` sibling

An `<img>` stack is nearly free to keep pinned. A live deck.gl globe re-renders
every frame *while* Lenis drives `matrix3d` transforms on the sibling layer.
Compositing a `preserve-3d` subtree over a continuously-repainting WebGL canvas
is a known source of jank even when each half is 60fps alone.

Current weight, from the 2026-08-01 production build:

| Route | Route JS | First load |
|---|---|---|
| `/research-canvas` | 500 kB | 1.23 MB |
| `/timeline` | 195 kB | 737 kB |
| `/sightings` | 38.4 kB | 398 kB |

**Verify by measuring, not reasoning.** Spike task: mount the existing
sightings globe inside a `perspective`/`preserve-3d` scroll container and
record frame timing before building anything on top. If it janks, the fallback
is a **static globe plate per waypoint** (render-to-texture / prerendered
frames) with the live globe reserved for the free-exploration mode.

### R2 — Is the temporal cursor driven, or driving?

Concept 01 shows the user **scrubbing** the adaptive dial. The scroll UI has
**scroll** driving position. These are opposite directions of control.

If scroll is the only input, the dial degrades to a readout and
`TemporalCursor` collapses to its `station` variant — the `exact` and `range`
modes in `TEMPORAL_OBSERVATORY.md` §3.3 become dead types.

**Decision required before `spacetime-store.ts` is written.** Getting this
wrong is a rewrite, not a tweak.

**Recommendation — bidirectional, cursor is source of truth:**

```
temporalCursor  ← THE single source of truth
   ↑ scroll (guided mode: scroll writes cursor, camera follows)
   ↑ dial    (free mode: dial writes cursor, scroll position follows)
```

Scroll and dial are two *inputs* to one cursor, never two cursors. A `mode`
flag (`'guided' | 'free'`) decides which input is authoritative at a given
moment, so they can never fight.

### R3 — 19 hardcoded cases ≠ a query layer

The reference page is a fixed narrative over static images. The spec's §8 API
is viewport + time-window bounded. These are different work.

Good news, from the subagent's audit: `/api/disclosure/uap-sightings` **already**
does year-range querying, `limit`, and 10-year batching via
`getSightingsByTimeChunk`. `sightings-globe.tsx:22` simply bypasses it and
loads a static `/sightings.geojson`.

So Foundation is mostly **wiring an existing bounded API to the globe**, not
building one. But it does *not* make the scroll narrative data-driven — that is
separate, later work.

---

## 3. The reconstruction lever (non-negotiable)

`TEMPORAL_OBSERVATORY.md` §9 requires that generation happen only through an
unmistakable deliberate action. Concept 01 frame 4 shows a reconstruction
preview inline in the browse flow. **The lever wins.**

In a scroll-driven UI this matters *more*, not less: **scrolling past a
waypoint is not an intent signal.** Auto-generating on scroll is precisely the
failure GL4SS redesigned itself around after pausing on a timeline became a
billable event.

Rules:

1. Scroll **never** triggers generation.
2. Reconstructions already in the archive may render freely on scroll — they
   cost nothing.
3. Generating a *new* reconstruction requires an explicit click on a control
   that names the cost.
4. The control is visually distinct from every navigation affordance on the
   surface.

---

## 4. Delivery sequence

### M0 — Foundation (this milestone)

Goal: **one surface, one state model, one temporal cursor, live data.**

| # | Task | Files | Risk |
|---|---|---|---|
| M0.1 | Frame-timing spike: globe under `preserve-3d` | scratch | **R1** |
| M0.2 | `spacetime.ts` types — `TemporalCursor`, `SpacetimeEvent`, `TemporalLayerFeature` | `features/spacetime/types/` | R2 |
| M0.3 | `spacetime-store.ts` — Zustand slice, cursor as single source of truth, `mode: guided \| free` | `features/spacetime/state/` | R2 |
| M0.4 | `temporal-stations.ts` — station ladder from event density | `features/spacetime/lib/` | — |
| M0.5 | Wire `/api/disclosure/uap-sightings` (already bounded) to the globe; delete the static `sightings.geojson` path | `features/sightings/sightings-globe.tsx:22` | R3 |
| M0.6 | `SpacetimeCanvas` shell — fixed globe layer + `preserve-3d` narrative layer | `features/spacetime/components/` | R1 |
| M0.7 | `TemporalDial` — bidirectional, reads + writes cursor | `features/spacetime/components/` | R2 |
| M0.8 | `/spacetime` route | `app/(site)/spacetime/` | — |

**M0 exit criteria:** open `/spacetime`, scroll, watch the globe camera and the
visible evidence field change with the cursor, select an event, see its sources
and credibility. No reconstruction, no compare, no playback.

### M1 — Evidence instrument
Layer panel · credibility + provenance filtering · event inspector ·
relationship arcs · precision/uncertainty rendering.

### M2 — Reconstruction
Event Evidence Packet · staged scene planning · one still-image mode ·
central artifact + manifest storage · the lever · synthetic labeling.

### M3 — Comparative analysis
Pinned comparison · seam / blink / onion / difference · evidence deltas.
(Concept 03)

### M4 — Narrative
Guided Investigations · waypoint choreography · flap playback ·
space-time capsules. (Concepts 02, 04)

**Do not start M2–M4 work during M0.** They are storyboarded, which makes them
tempting; they are phases 3–5 in the spec's own sequence.

---

## 5. Reuse already in the repo

Confirmed present — do not rebuild:

| Need | Existing |
|---|---|
| Flap playback precedent | `features/sightings/useTimeSeriesAnimation.tsx` |
| Trajectory arcs | `features/sightings/animated-arc-layer.tsx`, `animated-arc-group-layer.tsx` |
| Bounded sightings query | `/api/disclosure/uap-sightings` + `getSightingsByTimeChunk` |
| Hex aggregation | deck.gl `H3HexagonLayer` (4 usages) |
| Guided tour engine spec | `.cursor/rules/features/guided-tours.mdc` (stale Background — see its header) |
| ViewSwitcher decision | `docs/plans/ADR-2026-06-19-viewswitcher-peer-surfaces.md` |

Confirmed **absent** — greenfield: `features/spacetime/`, `globe.gl`, `h3-js`.

---

## 6. Corrections to the source architecture doc

Landed in ADR 0002; repeated here so this plan is self-contained.

| Claimed | Actual |
|---|---|
| Next 14 / React 18 | **Next 15.5.0 / React 19.2.0.** GL4SS is also React 19 — "React-version friction" is not a real argument |
| carries `globe.gl`, `h3-js` | Neither is in any `package.json` |
| keep Xata/Postgres access | Xata is **retired**; `@db/postgres` only |
| API returns all static GeoJSON | Half true — the API is already bounded; the globe bypasses it |

---

## 7. Decisions (locked 2026-08-01 — resume defaults)

| # | Decision | Resolution | Unblocks |
|---|---|---|---|
| D1 | Cursor authority | **Bidirectional.** `temporalCursor` is SoT; scroll writes in `guided`, dial writes in `free`. | M0.3 |
| D2 | R1 fallback | **Accept static plates per waypoint** if median frame > ~20ms under scroll; live globe retained for `free` mode. Measure via M0.1 spike before locking plates in. | M0.6 |
| D3 | Route destiny | **Sit beside** `/sightings` + `/timeline` for M0. Demote/cut deferred to a later ViewSwitcher pass (`ADR-2026-06-19-viewswitcher-peer-surfaces.md`). | M0.8 |
