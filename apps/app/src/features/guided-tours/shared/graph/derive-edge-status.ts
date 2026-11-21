import type { TourTransitionDefinition } from '../types/tour-definition';
import type { EdgeTraversalStatus, TourRuntimeState } from '../types/tour-runtime';

export function deriveEdgeStatus(
  transition: TourTransitionDefinition,
  runtime: TourRuntimeState,
): EdgeTraversalStatus {
  const sourceComplete = runtime.completedWaypointIds.includes(
    transition.sourceWaypointId,
  );
  const targetVisited = runtime.visitedWaypointIds.includes(
    transition.targetWaypointId,
  );

  if (sourceComplete && targetVisited) return 'traversed';

  if (
    runtime.phase === 'departing' &&
    runtime.activeWaypointId === transition.sourceWaypointId &&
    runtime.pendingWaypointId === transition.targetWaypointId
  ) {
    return 'active';
  }

  if (runtime.activeWaypointId === transition.sourceWaypointId) {
    return sourceComplete ? 'active' : 'ghost';
  }

  return 'hidden';
}
