import { describe, expect, it } from 'vitest';

import { compileTourGraph } from '../../shared/graph/compile-tour-graph';
import { createInitialRuntimeState } from '../../shared/state/tour-reducer';
import {
  TOUR_NARRATIVE_EDGE_TYPE,
  TOUR_WAYPOINT_NODE_TYPE,
} from '../../shared/types/flow-model';
import { nuclearShadowDefinition } from '../nuclear-shadow.definition';

/**
 * T-050 subtask 3: the compiled graph must be renderable by the mindmap's
 * shared ReactFlow registries, so node/edge types are the namespaced keys
 * registered in `features/mindmap/config/*-types.tsx`, and the anchor state
 * the node stamp reads must never blur "no record" with "not loaded yet".
 */
describe('canvas projection', () => {
  const runtime = createInitialRuntimeState(nuclearShadowDefinition, false);

  it('emits the mindmap-registered node and edge types', () => {
    const { nodes, edges } = compileTourGraph(nuclearShadowDefinition, runtime);
    expect(nodes.every((node) => node.type === TOUR_WAYPOINT_NODE_TYPE)).toBe(true);
    expect(edges.every((edge) => edge.type === TOUR_NARRATIVE_EDGE_TYPE)).toBe(true);
    expect(TOUR_WAYPOINT_NODE_TYPE).toMatch(/^tour/);
    expect(TOUR_NARRATIVE_EDGE_TYPE).toMatch(/^tour/);
  });

  it('stamps narrative-only waypoints before any resolution has run', () => {
    const { nodes } = compileTourGraph(nuclearShadowDefinition, runtime);
    const byId = new Map(nodes.map((node) => [node.id, node.data]));
    const manhattan = nuclearShadowDefinition.waypoints[0];
    const trinity = nuclearShadowDefinition.waypoints[1];

    expect(manhattan.corpusAnchor.kind).toBe('none');
    expect(byId.get(manhattan.id)?.anchorState).toBe('narrative-only');
    expect(byId.get(trinity.id)?.anchorState).toBe('resolving');
  });

  it('reports resolved / unresolved once anchors are supplied', () => {
    const trinity = nuclearShadowDefinition.waypoints[1];
    const roswell = nuclearShadowDefinition.waypoints[7];
    const { nodes } = compileTourGraph(nuclearShadowDefinition, runtime, {
      [trinity.id]: {
        state: 'resolved',
        table: 'events',
        recordId: 'rec_1',
        record: { id: 'rec_1', name: 'Trinity UFO Case' },
      },
      [roswell.id]: { state: 'unresolved', table: 'events', searchQuery: 'Roswell' },
    });
    const byId = new Map(nodes.map((node) => [node.id, node.data]));
    expect(byId.get(trinity.id)).toMatchObject({ anchorState: 'resolved', anchorTable: 'events' });
    expect(byId.get(roswell.id)?.anchorState).toBe('unresolved');
  });
});
