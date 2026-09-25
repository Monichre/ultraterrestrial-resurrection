# Ultraterrestrial: The Nuclear Shadow

A complete, drop-in **Next.js + TypeScript + XYFlow** reference implementation for the first Ultraterrestrial guided tour act:

> **The Architecture of Secrecy — Manhattan Project to Roswell**

The interface is a traversable evidence graph rather than a decorative timeline. Every waypoint has a historical anchor, canonical claim, supporting record, strongest challenge, unresolved residue, completion gate, camera target, and semantically typed transition to the next marker.

## Included

- Eight fully defined Act I waypoints
- Seven typed narrative transitions
- Canonical claim and evidence bindings
- XYFlow nodes, edges, viewport choreography, and camera ownership
- Four-stage completion gates: claim, evidence, challenge, residue
- Evidence threshold modes
- Local progress persistence
- Reduced-motion handling
- Keyboard-friendly interactive structure
- Zod definition schema and structural validator
- Vitest unit and integration-oriented tests
- Research-source binding guide
- Agent handoff model for the Ultraterrestrial agent suite

## Canonical route

1. The Secret Machine — Manhattan Project
2. Trinity — The Threshold Event
3. Controlled Revelation — Smyth Report
4. Born Secret — Restricted Data
5. Two Secrecy Universes — RD / FRD / NSI
6. The Black Architecture — Special Access Programs
7. The Propulsion Fork — Nuclear, non-nuclear, and fundamental physics
8. Roswell — The secrecy machine meets the anomaly

## Run locally

```bash
npm install
npm run validate:tour
npm run typecheck
npm test
npm run dev
```

Open `http://localhost:3000`.

Node.js 20.9 or later is required by the selected Next.js baseline.

## Integration into the Ultraterrestrial repository

The package is intentionally feature-scoped under:

```text
src/features/guided-tours/
```

Copy that directory into the main application, then mount:

```tsx
import { NuclearShadowTour } from '@/features/guided-tours/nuclear-shadow/NuclearShadowTour';

export default function Page() {
  return <NuclearShadowTour />;
}
```

The current persistence adapter uses `localStorage`. Replace it with the project repository layer when user-scoped server persistence is ready.

## Architecture

```text
Validated Tour Definition
        |
        v
Graph Compiler ----------> XYFlow Nodes and Edges
        |                         |
        v                         v
Zustand Runtime Store <---- UI Interaction
        |
        v
Tour Choreographer ------> fitView / setCenter / route animation
        |
        v
Persistence + Analytics Adapters
```

### Ownership boundaries

**XYFlow owns** geometry, measurement, viewport transforms, pointer interaction, node rendering, and edge rendering.

**The tour runtime owns** narrative order, progress, evidence review, gate completion, waypoint visibility, camera intent, transition cancellation, persistence, and analytics.

## Data integration points

The reference definition currently embeds source metadata so it runs independently. Production integration should replace embedded source content with IDs resolved from Xata:

```text
waypoint claim ID
  -> claim record
  -> evidence relationship
  -> document / testimony / event / organization record
  -> page or passage anchor
  -> provenance ledger
```

See [`docs/DATA-BINDING.md`](docs/DATA-BINDING.md).

## Non-negotiable epistemic rules

- Visual adjacency never silently means causality.
- Hypothesis edges use a different line grammar from established relationships.
- Retrospective testimony remains separate from contemporaneous records.
- A mechanism capable of concealing advanced technology is not evidence that a claimed technology exists.
- A waypoint cannot unlock until the user encounters the core claim, supporting record, strongest challenge, and unresolved residue.
- Changing the evidence threshold can reopen a completed gate.

## Key implementation files

```text
src/features/guided-tours/nuclear-shadow/nuclear-shadow.definition.ts
src/features/guided-tours/shared/state/tour-reducer.ts
src/features/guided-tours/shared/graph/compile-tour-graph.ts
src/features/guided-tours/shared/choreography/transition-sequence.ts
src/features/guided-tours/shared/components/TourFlowCanvas.tsx
src/features/guided-tours/shared/components/WaypointInspector.tsx
```

## Production work remaining

The package is implementation-complete as a reference runtime, but production adoption still requires:

- Bind evidence IDs to current Xata records and provenance anchors.
- Replace local persistence with authenticated user progress storage.
- Connect analytics to the project adapter.
- Add finalized visual assets, archive scans, maps, and ambient audio.
- Add server-side content authorization where evidence access differs by user.
- Extend the route beyond Roswell into the broader Nuclear Shadow tour.

## License

Copyright 2026 Digital Mischief Group. All rights reserved.
