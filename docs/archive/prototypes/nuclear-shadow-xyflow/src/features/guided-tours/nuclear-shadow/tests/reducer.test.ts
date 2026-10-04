import { describe, expect, it } from 'vitest';
import { nuclearShadowDefinition } from '../nuclear-shadow.definition';
import type { TourRuntimeState } from '../../shared/types/tour-runtime';
import {
  canDepartWaypoint,
  createInitialRuntimeState,
  reduceTourRuntime,
} from '../../shared/state/tour-reducer';

const first = nuclearShadowDefinition.waypoints[0];

describe('tour reducer', () => {
  it('does not allow departure before all four gates are complete', () => {
    let state: TourRuntimeState = {
      ...createInitialRuntimeState(nuclearShadowDefinition),
      hydrated: true,
      phase: 'investigating' as const,
      activeWaypointId: first.id,
      visitedWaypointIds: [first.id],
      interactionsLocked: false,
    };

    state = reduceTourRuntime(
      state,
      { type: 'NEXT_REQUESTED' },
      nuclearShadowDefinition,
    );

    expect(state.phase).toBe('investigating');
    expect(state.pendingWaypointId).toBeNull();
  });

  it('completes a waypoint after claim, evidence, challenge, and residue', () => {
    let state: TourRuntimeState = {
      ...createInitialRuntimeState(nuclearShadowDefinition),
      hydrated: true,
      phase: 'investigating' as const,
      activeWaypointId: first.id,
      visitedWaypointIds: [first.id],
      interactionsLocked: false,
    };

    state = reduceTourRuntime(
      state,
      { type: 'NARRATION_COMPLETED', waypointId: first.id },
      nuclearShadowDefinition,
    );
    state = reduceTourRuntime(
      state,
      {
        type: 'EVIDENCE_OPENED',
        waypointId: first.id,
        evidenceId: first.evidence.supporting[0].id,
        role: 'support',
      },
      nuclearShadowDefinition,
    );
    state = reduceTourRuntime(
      state,
      {
        type: 'EVIDENCE_OPENED',
        waypointId: first.id,
        evidenceId: first.evidence.counterpoints[0].id,
        role: 'challenge',
      },
      nuclearShadowDefinition,
    );
    state = reduceTourRuntime(
      state,
      { type: 'RESIDUE_ACKNOWLEDGED', waypointId: first.id },
      nuclearShadowDefinition,
    );

    expect(canDepartWaypoint(state, first.id)).toBe(true);
    expect(state.phase).toBe('ready-to-depart');
  });
});
