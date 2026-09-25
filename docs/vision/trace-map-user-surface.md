# Trace Map — User-facing surface (design brief)

**Status:** idea / needs scoping  
**Date:** 2026-08-15  
**Depends on:** T-054 (Layer 1 — shipped) · soft-deps T-055 (Layer 2 — open)  
**Lane:** B — Platform & Experience

## What this is

Every processed source (video, article, document) already produces a `trace-map.json`
with a source spine, topic tree, claims, entities, and timestamp/character-span anchors
(T-054, shipped 2026-08-10). Today that artifact lives as a static JSON + Markdown file
on disk. No user-facing surface renders it.

This would add a **Source Breakdown** view to the Research Canvas that renders a trace
map interactively — the topic tree and source spine the trace map spec describes, but
as live components a researcher can click through instead of a Mermaid diagram in a
Markdown file.

## Why

A researcher holding a processed source should be able to see its structure at a glance:
what was discussed, in what order, where each claim lives in the timeline, and what
entities appear where. The trace map already computes all of this. It just has no
renderer.

This is the "awesome on the user side" surface — the data already exists.

## What it renders

Two primary views, drawn from `trace-map.json`:

### 1. Source spine (timeline)

A vertical chronological strip showing every segment with:

- Timestamp range (for video) or heading/paragraph (for articles)
- Evidentiary density badge (high/medium/low)
- Click to expand → claims within that segment, with exact quote excerpts
- Entity mentions per segment as inline chips
- Overlap notes (what precedes/follows)

### 2. Topic tree

A hierarchical view of topics and subtopics, with:

- Each topic's introducing segment and any re-appearance segments
- Claims grouped under their parent topic
- Expand/collapse per topic branch
- Click a topic → scroll the source spine to its introducing segment

### Secondary: claim detail

Clicking a claim shows:

- Exact source quote (character span, timestamp)
- Evidentiary state (Observed / Unverified / Inferred)
- If Layer 2 (T-055) is present: linked evidence, counter-reading, next trace

## Where it goes in the app

On the Research Canvas (`/research-canvas`), as a panel or view mode accessible from
a processed-source node. When a user selects a source (document, video transcript), the
canvas shows:

```
┌─ Source Breakdown ──────────────────────────────────────────────┐
│  Robert Bigelow and George Knapp discuss UFO disclosure          │
│  https://youtu.be/q0N33jb7Bhk  ·  26:31  ·  11 segments        │
│                                                                  │
│  ┌─ Source Spine ───────────────────────┬─ Topic Tree ─────────┐│
│  │                                      │                      ││
│  │  0:02  Intro and Context             │  ├─ Oval Office      ││
│  │  1:22  Oval Office Meeting    HIGH   │  │  Meeting (c02)    ││
│  │  4:43  Presidential Knowledge HIGH   │  ├─ SAPs &           ││
│  │  6:14  Unacknowledged SAPs    HIGH   │  │  Clearances (c04) ││
│  │  8:04  Gatekeepers & Secrecy  HIGH   │  ├─ Roswell (c06)   ││
│  │  …                                   │  └─ AATIP /         ││
│  │                                      │     Skinwalker (c10)││
│  └──────────────────────────────────────┴─────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Data contract

The renderer consumes `trace-map.json` per source. The schema is stable (`trace-map.v1`,
`nodes[]` with `id`/`type`/`label`/`anchor`, `edges[]` with `from`/`to`/`type`).
No new backend — the trace map already lands beside the source bundle on disk; the app
needs a server action that reads and serves it.

For Layer 1 (today): render segments, topics, claims, entities. Layer 2 nodes (readings,
counter-readings, next traces, evidence→claim edges) render when present — graceful
degradation, not conditional rendering.

## What this is NOT

- Not a second canvas or a new route. It lives inside the existing Research Canvas as a
  panel or view mode.
- Not a graph editor. The trace map is read-only.
- Not a cross-source tool. One trace map = one source breakdown. (Cross-source is the
  Investigation Constellation — a separate artifact, not yet specified.)
- Not the Mermaid diagrams from `trace-map.md` ported verbatim. Those are static
  projections; the user surface should be interactive React components driven by the
  JSON graph.

## Relationship to existing tickets

- **T-050 (Guided Tours)**: trace maps provide the timestamp-anchored corpus waypoints
  that tours resolve against. A source breakdown is a natural target for a tour waypoint.
- **T-053 (Research Canvas Gen-UI)**: this is a Gen-UI candidate — a tool card that
  renders a trace map when a source is selected. Could be RC-P5 or a standalone slice.
- **T-047 (Spacetime Canvas)**: trace map temporal precision feeds the globe paint
  (T-047's open item: "encode timePrecision into the globe paint"). The source spine
  IS the temporal precision data.

## Open questions

- Should the source breakdown be a panel, a full-screen view mode, or a split pane?
- Should the topic tree and source spine be side-by-side or tabbed?
- How does a user select a source to view? (Click a source node on the graph? Search
  results? Guided tour waypoint?)
- Should the renderer live in `features/mindmap/` (alongside the graph) or in a new
  `features/trace-map/`?

## Pass bar

Dogfood on `/research-canvas`: select a processed source, see its topic tree and
source spine rendered interactively with clickable timestamps that seek the source
video or scroll the document. Layer 2 nodes render when present; their absence is
visible but not an error state. Definition of Done applies.
