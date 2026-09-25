# XYFlow Runtime Implementation Specification

## Core principle

```text
React Flow renders the territory.
The state machine controls the journey.
Evidence gates earn the transition.
The camera communicates narrative logic.
The edge explains why the next marker follows.
```

## Waypoint contract

Every waypoint must define:

1. A temporal, geographic, institutional, or documentary anchor.
2. A canonical claim with source IDs.
3. Supporting evidence.
4. A strong counterpoint or limitation.
5. An unresolved question.
6. Curated XYFlow coordinates.
7. A camera target.
8. Four completion gates.
9. A typed transition to the next marker.

## Route-edge grammar

| Type | Meaning | Visual grammar |
|---|---|---|
| `chronological` | Time advances | Solid, light weight |
| `evidentiary` | Evidence motivates the next question | Dashed |
| `hypothesis` | Disputed or inferential bridge | Dotted |
| `institutional-inheritance` | Organizational or legal continuity | Heavy solid |
| `contradiction` | Rupture or competing account | Broken pattern |

The line type must communicate meaning without relying on color.

## State machine

```text
booting -> overview -> arriving -> investigating
investigating -> ready-to-depart -> departing -> investigating
ready-to-depart -> complete
```

The reducer, not the button state, enforces transition legality.

## Camera ownership

- `system`: opening, recentering, departure, arrival, and resume
- `user`: free inspection during a waypoint

User pan or zoom transfers ownership to the user. The runtime may reacquire it only through an explicit navigation action.

## Transition sequence

1. Lock interactions.
2. Reveal the next marker and active edge.
3. Frame departure and destination together.
4. Animate the route traveler.
5. Settle on the destination.
6. Commit the semantic state transition.
7. Restore user viewport ownership.

All asynchronous transitions use an `AbortController` and a unique token.

## Performance rules

- Keep `nodeTypes` and `edgeTypes` outside render functions.
- Memoize node components.
- Use narrow Zustand selectors.
- Keep evidence objects outside the main graph.
- Animate SVG and CSS rather than updating React state per frame.
- Keep all canonical route nodes mounted to avoid measurement races.
- Use `useNodesInitialized` before geometry-dependent camera work.

## Reduced motion

Reduced motion removes route travelers and animated interpolation but preserves:

- route order
- semantic edge styling
- completion gates
- focus movement
- source review
- keyboard navigation
