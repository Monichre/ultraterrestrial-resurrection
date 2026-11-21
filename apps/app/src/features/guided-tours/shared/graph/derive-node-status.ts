import type { TourDefinition, WaypointId } from '../types/tour-definition'
import type { TourRuntimeState, WaypointStatus } from '../types/tour-runtime'
import { canDepartWaypoint } from '../state/tour-reducer'

/** Opening spine: entry + next two markers so overview isn't an empty void. */
function overviewSpineIds( definition: TourDefinition ): WaypointId[] {
  const ids: WaypointId[] = [definition.entryWaypointId]
  let cursor = definition.waypoints.find( ( w ) => w.id === definition.entryWaypointId )
  for ( let i = 0; i < 2; i += 1 ) {
    const nextId = cursor?.transition?.targetWaypointId
    if ( !nextId ) break
    ids.push( nextId )
    cursor = definition.waypoints.find( ( w ) => w.id === nextId )
  }
  return ids
}

export function deriveWaypointStatus(
  waypointId: WaypointId,
  definition: TourDefinition,
  runtime: TourRuntimeState,
): WaypointStatus {
  if ( runtime.activeWaypointId === waypointId ) {
    return runtime.completedWaypointIds.includes( waypointId ) ? 'complete' : 'active'
  }

  if ( runtime.completedWaypointIds.includes( waypointId ) ) return 'complete'
  if ( runtime.visitedWaypointIds.includes( waypointId ) ) return 'visited'

  // During boot/overview/arrival, keep the opening spine visible. Otherwise every
  // node stays opacity:0 until choreography finishes — which reads as a blank canvas.
  if (
    runtime.phase === 'booting' ||
    runtime.phase === 'overview' ||
    runtime.phase === 'arriving'
  ) {
    const spine = overviewSpineIds( definition )
    if ( waypointId === spine[0] ) return 'active'
    if ( spine.includes( waypointId ) ) return 'ghost'
    return 'hidden'
  }

  const active = definition.waypoints.find(
    ( waypoint ) => waypoint.id === runtime.activeWaypointId,
  )

  if ( active?.transition?.targetWaypointId === waypointId ) {
    return canDepartWaypoint( runtime, active.id ) ? 'available' : 'ghost'
  }

  return 'hidden'
}
