---
status: live
role: eng
spine: how
updated: 2026-08-01
---

# ADR 0002 — Temporal Observatory: port GL4SS concepts, do not embed GL4SS

**Status:** Accepted — 2026-08-01
**Context source:** Design conversation (Claude Desktop), captured in [`../vision/TEMPORAL_OBSERVATORY.md`](../vision/TEMPORAL_OBSERVATORY.md)
**Upstream:** [gl4ss.ai](https://gl4ss.ai) · [github.com/elder-plinius/GL4SS](https://github.com/elder-plinius/GL4SS)

## Decision

Do **not** integrate GL4SS as an iframe, a standalone sub-application, or a second globe.

Keep Ultraterrestrial's Mapbox/deck.gl spatial renderer. Port GL4SS's *temporal instrument, reconstruction
engine, archive semantics, journey model, and registered comparison interaction* into a new unified feature
named **Temporal Observatory**.

GL4SS functions as the conceptual and partially reusable time-navigation kernel — not the host application.

## Why not embed

Embedding would leave the platform carrying:

- Two map/globe engines (deck.gl/Mapbox vs. Leaflet + raw Three.js).
- Two competing navigation systems.
- Two persistence models (Postgres/object storage vs. browser IndexedDB).
- A jarring visual transition between "research mode" and "generated history mode."
- Build-system friction (Vite app shell vs. Next.js App Router).

GL4SS's own documentation notes that its browser-local archive **cannot make a shared link reproduce the same
image for another person**. That alone disqualifies IndexedDB as the canonical artifact store for a platform
whose credibility rests on reproducible provenance.

## Corrections to the source analysis

The originating design doc contained several claims about this repo that do not hold. They are corrected here
so they do not become the next entry in CLAUDE.md's "corrected myths" list.

| Claim in source doc | Verified reality (2026-08-01) |
|---|---|
| "Next.js 14 / React 18 application" | **Next.js `^15.5.0`, React `19.2.0`** — `apps/app/package.json` |
| "React-version friction" with GL4SS | **No friction.** GL4SS is React 19; so are we. This is *not* a reason to avoid embedding — the real reasons are the five listed above. |
| "already carries … globe.gl, H3" | **`globe.gl` and `h3-js` are absent** from every `package.json` in the workspace. H3 is available only indirectly via deck.gl's `H3HexagonLayer` (4 usages in `features/sightings`). |
| "Xata/Postgres data access" — keep | **Xata is retired.** Use `@db/postgres` exclusively. Three stale `@db/xata` references remain (`apps/app/src/types/modules.d.ts`, `apps/app/src/features/user/api/save-event.ts`, plus a doc) — out of scope here, worth a cleanup ticket. |
| API "reads complete static GeoJSON files and returns them together" | **Half true, and the useful half is missing.** `sightings-globe.tsx:22` does load a static `/sightings.geojson`. But `/api/disclosure/uap-sightings/route.ts` **already** does year-range querying, `limit`, 10-year batching, and optional stats via `getSightingsByTimeChunk`. The bounded-query foundation exists; the globe simply does not use it. |

**Consequence for sequencing:** the Foundation milestone is smaller than the source doc assumes. It is largely
*wiring the existing bounded API to the globe* and generalizing it, not building bounded querying from nothing.

## Existing assets that shorten the path

Verified present in `apps/app/src/features/sightings/`:

- `useTimeSeriesAnimation.tsx` — precedent for **Flap Playback**.
- `animated-arc-layer.tsx` / `animated-arc-group-layer.tsx` — precedent for the **trajectories layer**.
- deck.gl layer usage already spans `ArcLayer` (20), `GeoJsonLayer` (17), `ScatterplotLayer` (14),
  `HexagonLayer` (5), `H3HexagonLayer` (4).
- `features/3d/globe-connections/Globe.tsx` — existing globe component.
- `features/spacetime/` does **not** exist — the new feature module is greenfield, as assumed.

## Licensing gate — blocking

GL4SS declares **AGPL-3.0-or-later**. Before any GL4SS source is copied or modified, verify the license fits
the intended distribution and hosting model. Architecturally this reinforces the separation:

1. **Concepts and interaction patterns** — freely reimplementable.
2. **Clean-room Ultraterrestrial implementations** — the default path.
3. **Directly adapted GL4SS modules** — require attribution and AGPL-compliant source treatment.

No GL4SS source lands in this repo until that determination is recorded. This is a gate, not a formality.

## Do not port directly

Vite app shell · browser-owned OpenRouter key · IndexedDB as canonical archive · Leaflet map · separate raw
Three.js globe · GL4SS's complete visual skin · pure place/year scene prompts.

IndexedDB may remain an *optional local cache*; the canonical generated artifact lives in object storage with
database metadata.

## Consequences

- One state model, one renderer, one persistence story.
- The sightings globe stops being a decorative map and becomes the substrate for the Observatory.
- Reconstruction identity must be evidence-versioned (see spec §5) so an updated event record cannot silently
  return an obsolete image.
- The "generation is deliberate" lever principle from GL4SS is preserved as a hard UX rule.
