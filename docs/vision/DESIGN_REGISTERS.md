register: vision

# Design Registers — not two product lines

Captured 2026-07-09 from a direct conversation with the product owner, who wrote most of
this app and was correcting an over-formalized "two aesthetics" framing. This is a light
map, not a governance doc — the product is a work in progress and surfaces are expected
to blend registers, not pick one and stay there.

## The reframe

There are not two competing design languages ("the app" vs. "the research canvas").
There are **two content registers** that coexist, often on the same surface, because the
subject matter itself is both:

- **Techno-analytical register** — coordinates, space, nodes, weapons, subatomic physics,
  relationship graphs, AI inference overlays. Sci-fi, techie, futuristic, HUD/OSINT-leaning.
  This is where the 3D work belongs: `apps/app/src/features/3d/scroll-through-3d/`,
  `spatial-gallery`, `3d-graph`, `spherical-connection-graph` already exist as substrate —
  largely unwired into Timeline/Personnel/Sightings today.
- **Archival-material register** — paper, grain, aged edges, stamps, redaction, typewriter
  text. Historical, academic, archival, because the subject matter (declassified files,
  testimony, case records) demands it. Shipped today as Microfilm Dark on the Research
  Canvas (`DESIGN.md`).

A single surface can and often should carry both — e.g. a sighting report is an archival
*document* (register 2) about a spatial/physical *event* (register 1). Don't force a
surface to pick one.

## The unifying primitive: document materiality

The thing that should travel everywhere, not just the Canvas: a shared "paper/texture"
treatment for anything that renders as a file, record, or evidence object — classified or
declassified. Microfilm Dark already has the pieces (film grain via inline SVG
feTurbulence, warm dot grid, redaction-bar skeleton loading states, clipped dossier
corners) but they're implemented canvas-local. The open work, when it's time, is
extracting that into a shared primitive so Timeline events, personnel dossiers, and
sighting reports can adopt the same paper feel without re-deriving it — this is what
"parity" actually means here, not a mode taxonomy.

## Tiering note

The Research Canvas is the power-user surface — deep investigation, AI-assisted
synthesis, real cost (LLM inference). The rest of the app (Timeline, key-figures,
sightings, history) serves a broader, less committed audience. This has a design
consequence: the AI-inference visual language (dashed provenance borders, evidentiary
badges) is a Canvas-tier signal, not something the general surfaces need to inherit
wholesale — they may stay closer to pure archival-material register with lighter or no
AI overlay. Membership/cost gating on the Canvas is a product decision that sits outside
design scope but should inform which surfaces earn the AI-overlay treatment.

## What this doc is not

Not a mode registry, not an audit, not a mandate to reconcile `(site)/timeline` vs.
`research-canvas/views/timeline` right now (that duplication exists and is real, but is
separate cleanup work, not a design-identity question). Not a claim that the
techno-analytical and archival-material registers need formal names or a picker UI.
