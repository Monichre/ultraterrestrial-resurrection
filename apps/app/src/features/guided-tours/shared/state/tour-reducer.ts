import type {
  EvidenceReference,
  EvidenceThreshold,
  GateRule,
  TourDefinition,
  TourWaypointDefinition,
  WaypointId,
} from '../types/tour-definition'
import type {
  GateKey,
  PersistedTourProgress,
  TourRuntimeState,
  WaypointProgress,
} from '../types/tour-runtime'
import type { TourEvent } from './tour-events'

const gateKeys: GateKey[] = ['claim', 'evidence', 'challenge', 'residue']

export function createWaypointProgress( waypointId: WaypointId ): WaypointProgress {
  return {
    waypointId,
    narrationCompleted: false,
    openedEvidenceIds: [],
    openedCounterpointIds: [],
    acknowledgedResidue: false,
    gates: {
      claim: false,
      evidence: false,
      challenge: false,
      residue: false,
    },
  }
}

export function createInitialRuntimeState(
  definition: TourDefinition,
  reducedMotion = false,
): TourRuntimeState {
  const progressByWaypoint = Object.fromEntries(
    definition.waypoints.map( ( waypoint ) => [waypoint.id, createWaypointProgress( waypoint.id )] ),
  ) as Record<WaypointId, WaypointProgress>

  return {
    tourId: definition.id,
    tourVersion: definition.version,
    phase: 'booting',
    activeWaypointId: null,
    previousWaypointId: null,
    pendingWaypointId: null,
    visitedWaypointIds: [],
    completedWaypointIds: [],
    progressByWaypoint,
    evidenceThreshold: definition.defaultEvidenceThreshold,
    hypothesisLens: null,
    evidenceDrawer: {
      open: false,
      evidenceId: null,
      tab: 'source',
    },
    viewportOwnership: 'system',
    transitionToken: null,
    interactionsLocked: true,
    reducedMotion,
    hydrated: false,
    error: null,
  }
}

export function hydrateRuntimeState(
  definition: TourDefinition,
  persisted?: PersistedTourProgress,
  reducedMotion = false,
): TourRuntimeState {
  const base = createInitialRuntimeState( definition, reducedMotion )

  if ( !persisted || persisted.tourId !== definition.id ) {
    return {
      ...base,
      phase: 'overview',
      hydrated: true,
    }
  }

  const validIds = new Set( definition.route )
  const activeWaypointId = validIds.has( persisted.activeWaypointId )
    ? persisted.activeWaypointId
    : definition.entryWaypointId

  const progressByWaypoint = { ...base.progressByWaypoint }
  for ( const waypoint of definition.waypoints ) {
    const saved = persisted.progressByWaypoint[waypoint.id]
    if ( saved ) progressByWaypoint[waypoint.id] = saved
  }

  return recalculateAllGates(
    {
      ...base,
      phase: 'investigating',
      activeWaypointId,
      visitedWaypointIds: persisted.visitedWaypointIds.filter( ( id ) => validIds.has( id ) ),
      completedWaypointIds: persisted.completedWaypointIds.filter( ( id ) => validIds.has( id ) ),
      progressByWaypoint,
      evidenceThreshold: persisted.evidenceThreshold,
      hypothesisLens: persisted.hypothesisLens,
      hydrated: true,
      interactionsLocked: false,
      viewportOwnership: 'system',
    },
    definition,
  )
}

export function evaluateGateRule(
  rule: GateRule,
  visibleEvidence: EvidenceReference[],
  openedIds: string[],
): boolean {
  switch ( rule.kind ) {
    case 'automatic':
      return true
    case 'acknowledge':
      return false
    case 'open-any':
      return visibleEvidence.filter( ( item ) => openedIds.includes( item.id ) ).length >= rule.minimum
    case 'open-all-required':
      return visibleEvidence.length > 0 && visibleEvidence.every( ( item ) => openedIds.includes( item.id ) )
    case 'open-specific':
      return rule.evidenceIds.every( ( id ) => openedIds.includes( id ) )
  }
}

function visibleForThreshold(
  evidence: EvidenceReference[],
  threshold: EvidenceThreshold,
): EvidenceReference[] {
  return evidence.filter( ( item ) => item.requiredForThresholds.includes( threshold ) )
}

export function evaluateWaypointGates(
  waypoint: TourWaypointDefinition,
  progress: WaypointProgress,
  threshold: EvidenceThreshold,
): WaypointProgress['gates'] {
  const supporting = visibleForThreshold( waypoint.evidence.supporting, threshold )
  const challenges = visibleForThreshold( waypoint.evidence.counterpoints, threshold )

  return {
    claim:
      waypoint.gates.claim.kind === 'automatic'
        ? true
        : progress.narrationCompleted,
    evidence: evaluateGateRule(
      waypoint.gates.evidence,
      supporting,
      progress.openedEvidenceIds,
    ),
    challenge: evaluateGateRule(
      waypoint.gates.challenge,
      challenges,
      progress.openedCounterpointIds,
    ),
    residue:
      waypoint.gates.residue.kind === 'automatic'
        ? true
        : progress.acknowledgedResidue,
  }
}

export function canDepartWaypoint(
  state: TourRuntimeState,
  waypointId: WaypointId,
): boolean {
  const progress = state.progressByWaypoint[waypointId]
  return progress ? gateKeys.every( ( gate ) => progress.gates[gate] ) : false
}

function recalculateWaypoint(
  state: TourRuntimeState,
  definition: TourDefinition,
  waypointId: WaypointId,
): TourRuntimeState {
  const waypoint = definition.waypoints.find( ( item ) => item.id === waypointId )
  const current = state.progressByWaypoint[waypointId]
  if ( !waypoint || !current ) return state

  const gates = evaluateWaypointGates( waypoint, current, state.evidenceThreshold )
  const complete = gateKeys.every( ( gate ) => gates[gate] )
  const completedWaypointIds = complete
    ? Array.from( new Set( [...state.completedWaypointIds, waypointId] ) )
    : state.completedWaypointIds.filter( ( id ) => id !== waypointId )

  return {
    ...state,
    phase:
      state.activeWaypointId === waypointId && state.phase === 'investigating' && complete
        ? 'ready-to-depart'
        : state.activeWaypointId === waypointId && state.phase === 'ready-to-depart' && !complete
          ? 'investigating'
          : state.phase,
    completedWaypointIds,
    progressByWaypoint: {
      ...state.progressByWaypoint,
      [waypointId]: {
        ...current,
        gates,
        completedAt: complete ? current.completedAt ?? new Date().toISOString() : undefined,
      },
    },
  }
}

function recalculateAllGates(
  state: TourRuntimeState,
  definition: TourDefinition,
): TourRuntimeState {
  return definition.waypoints.reduce(
    ( next, waypoint ) => recalculateWaypoint( next, definition, waypoint.id ),
    state,
  )
}

function updateProgress(
  state: TourRuntimeState,
  waypointId: WaypointId,
  updater: ( progress: WaypointProgress ) => WaypointProgress,
): TourRuntimeState {
  const progress = state.progressByWaypoint[waypointId]
  if ( !progress ) return state

  return {
    ...state,
    progressByWaypoint: {
      ...state.progressByWaypoint,
      [waypointId]: updater( progress ),
    },
  }
}

export function reduceTourRuntime(
  state: TourRuntimeState,
  event: TourEvent,
  definition: TourDefinition,
): TourRuntimeState {
  switch ( event.type ) {
    case 'TOUR_HYDRATED':
      return hydrateRuntimeState( definition, event.progress, state.reducedMotion )

    case 'OVERVIEW_COMPLETED':
      return {
        ...state,
        phase: 'arriving',
        activeWaypointId: definition.entryWaypointId,
        pendingWaypointId: definition.entryWaypointId,
        interactionsLocked: true,
      }

    case 'WAYPOINT_ARRIVAL_STARTED':
      return {
        ...state,
        phase: 'arriving',
        activeWaypointId: event.waypointId,
        pendingWaypointId: event.waypointId,
        interactionsLocked: true,
      }

    case 'WAYPOINT_ARRIVAL_COMPLETED': {
      const visitedWaypointIds = Array.from(
        new Set( [...state.visitedWaypointIds, event.waypointId] ),
      )
      const next = updateProgress( state, event.waypointId, ( progress ) => ( {
        ...progress,
        firstEnteredAt: progress.firstEnteredAt ?? new Date().toISOString(),
      } ) )
      const complete = canDepartWaypoint( next, event.waypointId )
      return {
        ...next,
        phase: complete ? 'ready-to-depart' : 'investigating',
        activeWaypointId: event.waypointId,
        pendingWaypointId: null,
        visitedWaypointIds,
        viewportOwnership: 'user',
        interactionsLocked: false,
      }
    }

    case 'NARRATION_COMPLETED':
      return recalculateWaypoint(
        updateProgress( state, event.waypointId, ( progress ) => ( {
          ...progress,
          narrationCompleted: true,
        } ) ),
        definition,
        event.waypointId,
      )

    case 'EVIDENCE_OPENED': {
      const isCounterpoint = event.role === 'challenge' || event.role === 'contradiction'
      const next = updateProgress( state, event.waypointId, ( progress ) => ( {
        ...progress,
        openedEvidenceIds: isCounterpoint
          ? progress.openedEvidenceIds
          : Array.from( new Set( [...progress.openedEvidenceIds, event.evidenceId] ) ),
        openedCounterpointIds: isCounterpoint
          ? Array.from( new Set( [...progress.openedCounterpointIds, event.evidenceId] ) )
          : progress.openedCounterpointIds,
      } ) )
      return recalculateWaypoint( next, definition, event.waypointId )
    }

    case 'RESIDUE_ACKNOWLEDGED':
      return recalculateWaypoint(
        updateProgress( state, event.waypointId, ( progress ) => ( {
          ...progress,
          acknowledgedResidue: true,
        } ) ),
        definition,
        event.waypointId,
      )

    case 'NEXT_REQUESTED': {
      if (
        state.phase !== 'ready-to-depart' ||
        !state.activeWaypointId ||
        state.transitionToken ||
        state.interactionsLocked ||
        !canDepartWaypoint( state, state.activeWaypointId )
      ) {
        return state
      }

      const current = definition.waypoints.find(
        ( waypoint ) => waypoint.id === state.activeWaypointId,
      )
      const target = current?.transition?.targetWaypointId

      if ( !target ) {
        return {
          ...state,
          phase: 'complete',
          interactionsLocked: false,
        }
      }

      return {
        ...state,
        phase: 'departing',
        pendingWaypointId: target,
        interactionsLocked: true,
        viewportOwnership: 'system',
        transitionToken: crypto.randomUUID(),
        evidenceDrawer: { ...state.evidenceDrawer, open: false },
      }
    }

    case 'DEPARTURE_COMPLETED':
      if ( state.transitionToken !== event.transitionToken ) return state
      return {
        ...state,
        phase: 'arriving',
        previousWaypointId: event.from,
        activeWaypointId: event.to,
        pendingWaypointId: event.to,
        transitionToken: null,
      }

    case 'VISITED_WAYPOINT_REQUESTED':
      if ( state.interactionsLocked || !state.visitedWaypointIds.includes( event.waypointId ) ) {
        return state
      }
      return {
        ...state,
        previousWaypointId: state.activeWaypointId,
        activeWaypointId: event.waypointId,
        phase: canDepartWaypoint( state, event.waypointId )
          ? 'ready-to-depart'
          : 'investigating',
        viewportOwnership: 'system',
      }

    case 'EVIDENCE_THRESHOLD_CHANGED':
      return recalculateAllGates(
        { ...state, evidenceThreshold: event.value },
        definition,
      )

    case 'HYPOTHESIS_LENS_CHANGED':
      return { ...state, hypothesisLens: event.lens }

    case 'EVIDENCE_DRAWER_OPENED':
      return {
        ...state,
        evidenceDrawer: {
          ...state.evidenceDrawer,
          open: true,
          evidenceId: event.evidenceId,
          tab: 'source',
        },
      }

    case 'EVIDENCE_DRAWER_CLOSED':
      return {
        ...state,
        evidenceDrawer: {
          ...state.evidenceDrawer,
          open: false,
          evidenceId: null,
        },
      }

    case 'USER_VIEWPORT_INTERACTION_STARTED':
      return { ...state, viewportOwnership: 'user' }

    case 'SYSTEM_VIEWPORT_CONTROL_REQUESTED':
      return { ...state, viewportOwnership: 'system' }

    case 'REDUCED_MOTION_CHANGED':
      return { ...state, reducedMotion: event.value }

    case 'TOUR_PAUSED':
      return state.phase === 'departing' || state.phase === 'arriving'
        ? state
        : { ...state, phase: 'paused' }

    case 'TOUR_RESUMED':
      return state.phase === 'paused'
        ? {
          ...state,
          phase: state.activeWaypointId && canDepartWaypoint( state, state.activeWaypointId )
            ? 'ready-to-depart'
            : 'investigating',
        }
        : state

    case 'TOUR_RESET':
      return {
        ...createInitialRuntimeState( definition, state.reducedMotion ),
        phase: 'overview',
        activeWaypointId: definition.entryWaypointId,
        hydrated: true,
        interactionsLocked: true,
      }

    case 'TOUR_FAILED':
      return {
        ...state,
        phase: 'error',
        interactionsLocked: false,
        error: { code: event.code, message: event.message },
      }
  }
}
