# QA and Acceptance Criteria

## Definition

- [ ] Exactly one entry waypoint exists.
- [ ] Every route ID resolves.
- [ ] Every transition source and target resolves.
- [ ] Main route is acyclic.
- [ ] Every waypoint has at least one claim.
- [ ] Every claim references evidence present in that waypoint.
- [ ] Every waypoint has a meaningful counterpoint.
- [ ] Every waypoint preserves at least one unresolved question.

## Runtime

- [ ] User cannot depart an incomplete waypoint.
- [ ] Repeated continue clicks create one transition.
- [ ] Stale transition tokens are ignored.
- [ ] Camera and user pan do not fight.
- [ ] Revisited waypoints preserve progress.
- [ ] Evidence-threshold changes recalculate gates.
- [ ] Hidden nodes remain mounted but noninteractive.
- [ ] Final waypoint completes the act rather than looking for a missing target.

## Accessibility

- [ ] Core experience works without animation.
- [ ] Evidence controls are keyboard reachable.
- [ ] Completion state is not communicated by color alone.
- [ ] Focus and live-region behavior announce waypoint changes.
- [ ] Reduced-motion mode removes animated route travel.

## Epistemic integrity

- [ ] Contemporaneous and retrospective evidence are visually distinct.
- [ ] A legal concealment mechanism is never described as proof of hidden content.
- [ ] Official explanation and independent confirmation are not treated as synonyms.
- [ ] Visual proximity never silently implies causality.
- [ ] Every dramatic claim is paired with a limitation, alternative, or unresolved status.
