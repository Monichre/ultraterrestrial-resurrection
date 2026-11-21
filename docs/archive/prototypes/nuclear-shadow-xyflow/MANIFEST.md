# Package Manifest

## Runtime

- `app/page.tsx` - standalone demo route
- `src/features/guided-tours/shared/components/TourFlowCanvas.tsx` - XYFlow shell
- `src/features/guided-tours/shared/state/tour-reducer.ts` - deterministic tour state machine
- `src/features/guided-tours/shared/choreography/transition-sequence.ts` - cancellable viewport choreography
- `src/features/guided-tours/shared/graph/compile-tour-graph.ts` - definition-to-XYFlow compiler
- `src/features/guided-tours/shared/nodes/WaypointNode.tsx` - waypoint marker
- `src/features/guided-tours/shared/edges/NarrativeEdge.tsx` - semantically typed route edge
- `src/features/guided-tours/shared/components/WaypointInspector.tsx` - claim, evidence, challenge, and residue interface
- `src/features/guided-tours/shared/components/EvidenceDrawer.tsx` - evidence provenance panel

## Nuclear Shadow content

- `nuclear-shadow.definition.ts` - eight complete waypoints
- `nuclear-shadow.sources.ts` - canonical evidence metadata and source bindings
- `nuclear-shadow.layout.ts` - curated coordinates and stable IDs
- `NuclearShadowTour.tsx` - validation, persistence, and feature entry point

## Verification

- Zod runtime schema
- Canonical structural validator
- Definition tests
- Reducer tests
- Graph compiler test
- Transition cancellation test
- `scripts/validate-tour.ts`

## Documentation

- Implementation specification
- Xata and evidence-ledger binding guide
- Agent orchestration model
- QA and acceptance checklist
