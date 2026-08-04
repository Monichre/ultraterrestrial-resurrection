# NuclearShadowTour

**Shipped:** 2026-07-31  
**Route:** `/tours/nuclear-shadow`  
**Source package:** ported from `docs/archive/prototypes/nuclear-shadow-xyflow`

## Purpose

Act I of *The Nuclear Shadow* — **The Architecture of Secrecy** — as a traversable evidence graph. Roswell is the handoff, not the opening. Each waypoint carries historical anchor, evidence, narrative function, interface state, and a typed transition.

## Architecture

```
nuclearShadow.definition.ts
        │
        ▼
validateTourDefinition → useTourStore.loadDefinition
        │
        ▼
compileTourGraph → TourFlowCanvas (XYFlow)
        │
        ├── WaypointNode (completion ring: claim / evidence / challenge / residue)
        ├── NarrativeEdge (typed route language)
        ├── WaypointInspector + EvidenceDrawer
        └── TourChoreographer (camera arrive / depart)
```

## Modules

| Path | Role |
|---|---|
| `nuclear-shadow/nuclear-shadow.definition.ts` | Eight Act I waypoints + transitions |
| `nuclear-shadow/nuclear-shadow.sources.ts` | Evidence bindings |
| `nuclear-shadow/NuclearShadowTour.tsx` | Hydration + persistence shell |
| `shared/state/*` | Zustand runtime + reducer |
| `shared/graph/*` | Compile + validate |
| `shared/components/*` | Canvas, HUD, inspector, drawer |

## Launch surfaces

- Research canvas empty/populated: **Nuclear Shadow** ActionChip
- Launchpad typer card: Nuclear Shadow → `/tours/nuclear-shadow`
- Text submit matching `nuclear shadow` / `architecture of secrecy`

## Canon alignment

- Microfilm Dark tokens on `.ut-tour-shell`
- Clipped dossier corners on waypoint + inspector
- Epistemic line: *capable of concealing ≠ evidence of existence*
- Design notes: `docs/archive/vision/2026-07-19-guided-tour-canvas-design-lab.md` §6

## Keyboard

- `→` next · `←` previous visited · `R` recenter · `Esc` close evidence drawer

## Persistence

`localStorage` via `tourProgressRepository` (user-scoped server persistence later).
