# Spacetime Canvas

Sibling surface to **Research Canvas**.

| Surface | Organizes | Route |
|---|---|---|
| Research Canvas | ideas, entities, relations | `/research-canvas` |
| Spacetime Canvas | evidence across space + time | `/spacetime` |

## Status

**M0 scaffolded** — types, store, stations, bounded Postgres loader, globe,
temporal dial, guided narrative shell on `/spacetime`.

- Product: `/spacetime`
- M0.1 spike: `/spacetime?spike=1`

## Canon

- Plan: `docs/PLANS/2026-08-01-spacetime-canvas-implementation.md`
- Vision: `docs/vision/TEMPORAL_OBSERVATORY.md`
- ADR: `docs/adr/0002-temporal-observatory-gl4ss-integration.md`
- Storyboards: `docs/design/design-lab/storyboards/`
- Ticket: T-047

## Architecture seam

```
.fixed.inset-0     → BACKGROUND slot (Mapbox/deck.gl globe)
.absolute.inset-0  → NARRATIVE (CSS 3D / preserve-3d scroll)
```

`temporalCursor` is the single source of truth. Scroll (guided) and dial (free)
are inputs — never two cursors.

## Non-negotiable

Scrolling past a waypoint is **not** an intent signal. Reconstruction
generation requires an explicit lever (vision §9).
