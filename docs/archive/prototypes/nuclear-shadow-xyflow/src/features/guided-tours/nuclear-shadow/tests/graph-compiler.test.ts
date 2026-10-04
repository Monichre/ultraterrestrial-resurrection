import { describe, expect, it } from 'vitest';
import { nuclearShadowDefinition } from '../nuclear-shadow.definition';
import { compileTourGraph } from '../../shared/graph/compile-tour-graph';
import { createInitialRuntimeState } from '../../shared/state/tour-reducer';

describe('graph compiler', () => {
  it('keeps all canonical nodes mounted while hiding future nodes', () => {
    const state = {
      ...createInitialRuntimeState(nuclearShadowDefinition),
      hydrated: true,
      phase: 'investigating' as const,
      activeWaypointId: nuclearShadowDefinition.entryWaypointId,
      visitedWaypointIds: [nuclearShadowDefinition.entryWaypointId],
      interactionsLocked: false,
    };

    const graph = compileTourGraph(nuclearShadowDefinition, state);
    expect(graph.nodes).toHaveLength(8);
    expect(graph.nodes[0].data.status).toBe('active');
    expect(graph.nodes[1].data.status).toBe('ghost');
    expect(graph.nodes[2].data.status).toBe('hidden');
  });
});
