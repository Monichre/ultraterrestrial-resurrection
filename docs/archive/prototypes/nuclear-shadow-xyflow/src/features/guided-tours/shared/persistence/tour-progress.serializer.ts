import type { TourRuntimeState, PersistedTourProgress } from '../types/tour-runtime';

export function serializeProgress(runtime: TourRuntimeState): PersistedTourProgress | null {
  if (!runtime.activeWaypointId) return null;

  return {
    schemaVersion: '1.0',
    tourId: runtime.tourId,
    tourVersion: runtime.tourVersion,
    activeWaypointId: runtime.activeWaypointId,
    visitedWaypointIds: runtime.visitedWaypointIds,
    completedWaypointIds: runtime.completedWaypointIds,
    progressByWaypoint: runtime.progressByWaypoint,
    evidenceThreshold: runtime.evidenceThreshold,
    hypothesisLens: runtime.hypothesisLens,
    updatedAt: new Date().toISOString(),
  };
}
