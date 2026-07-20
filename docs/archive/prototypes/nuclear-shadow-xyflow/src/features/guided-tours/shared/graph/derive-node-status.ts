import type { TourDefinition, WaypointId } from '../types/tour-definition';
import type { TourRuntimeState, WaypointStatus } from '../types/tour-runtime';
import { canDepartWaypoint } from '../state/tour-reducer';

export function deriveWaypointStatus(
  waypointId: WaypointId,
  definition: TourDefinition,
  runtime: TourRuntimeState,
): WaypointStatus {
  if (runtime.activeWaypointId === waypointId) {
    return runtime.completedWaypointIds.includes(waypointId) ? 'complete' : 'active';
  }

  if (runtime.completedWaypointIds.includes(waypointId)) return 'complete';
  if (runtime.visitedWaypointIds.includes(waypointId)) return 'visited';

  const active = definition.waypoints.find(
    (waypoint) => waypoint.id === runtime.activeWaypointId,
  );

  if (active?.transition?.targetWaypointId === waypointId) {
    return canDepartWaypoint(runtime, active.id) ? 'available' : 'ghost';
  }

  return 'hidden';
}
