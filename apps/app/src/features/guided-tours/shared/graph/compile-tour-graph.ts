import type { TourDefinition } from '../types/tour-definition'
import type { TourRuntimeState } from '../types/tour-runtime'
import type { NuclearTourEdge, NuclearTourNode } from '../types/flow-model'
import { deriveWaypointStatus } from './derive-node-status'
import { deriveEdgeStatus } from './derive-edge-status'

export function compileTourGraph(
  definition: TourDefinition,
  runtime: TourRuntimeState,
): { nodes: NuclearTourNode[]; edges: NuclearTourEdge[] } {
  const nodes = definition.waypoints.map<NuclearTourNode>( ( waypoint ) => {
    const status = deriveWaypointStatus( waypoint.id, definition, runtime )

    return {
      id: waypoint.id,
      type: 'nuclear-shadow-waypoint',
      position: { x: waypoint.layout.x, y: waypoint.layout.y },
      draggable: false,
      selectable: status !== 'hidden',
      connectable: false,
      focusable: status !== 'hidden',
      data: {
        waypointId: waypoint.id,
        ordinal: waypoint.ordinal,
        title: waypoint.title,
        subtitle: waypoint.subtitle,
        dateDisplay: waypoint.dateRange.display,
        visualMode: waypoint.layout.visualMode,
        status,
        progress: runtime.progressByWaypoint[waypoint.id],
        interactionsLocked: runtime.interactionsLocked,
      },
      hidden: status === 'hidden',
      style: {
        opacity: status === 'hidden' ? 0 : status === 'ghost' ? 0.55 : 1,
        pointerEvents: status === 'hidden' ? 'none' : undefined,
      },
      ariaLabel: `${waypoint.ordinal}. ${waypoint.title}, ${status}`,
    }
  } )

  const edges = definition.transitions.map<NuclearTourEdge>( ( transition ) => ( {
    id: transition.id,
    type: 'narrative-edge',
    source: transition.sourceWaypointId,
    target: transition.targetWaypointId,
    selectable: false,
    focusable: false,
    data: {
      kind: transition.kind,
      status: deriveEdgeStatus( transition, runtime ),
      durationMs: transition.durationMs,
      label: transition.label,
      reducedMotion: runtime.reducedMotion,
    },
  } ) )

  return { nodes, edges }
}
