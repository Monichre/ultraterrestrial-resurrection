import type { TourDefinition, WaypointId } from '../types/tour-definition';
import type { TourRuntimeState } from '../types/tour-runtime';

export function selectActiveWaypoint(
  definition: TourDefinition,
  runtime: TourRuntimeState,
) {
  return definition.waypoints.find((waypoint) => waypoint.id === runtime.activeWaypointId) ?? null;
}

export function selectWaypoint(
  definition: TourDefinition,
  waypointId: WaypointId | null,
) {
  if (!waypointId) return null;
  return definition.waypoints.find((waypoint) => waypoint.id === waypointId) ?? null;
}

export function selectProgressPercent(runtime: TourRuntimeState): number {
  const total = Object.keys(runtime.progressByWaypoint).length;
  if (total === 0) return 0;
  return Math.round((runtime.completedWaypointIds.length / total) * 100);
}
