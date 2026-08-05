'use client'

/**
 * One store for both tour engines (T-050 subtask 2).
 *
 * The two runtimes track disjoint things — the spine engine walks resolved
 * Neon records by `stepIndex`, the evidence-graph engine runs a gated
 * claim/evidence/challenge/residue state machine — so this state is their
 * union, not a lowest common denominator. Neither engine's semantics are
 * flattened into the other's.
 *
 * Field names across the two halves do not collide, which is what lets both
 * legacy hooks (`useGuidedTourStore`, `useTourStore`) stay exact aliases of
 * this store: every existing selector and `getState()` call keeps working
 * against a superset of what it used to read.
 */
import { create } from 'zustand'

import type {
  SpineTourDefinition,
  SpineWaypointDefinition,
  TourDefinition,
} from '../types/tour-definition'
import type { PersistedTourProgress, TourRuntimeState } from '../types/tour-runtime'
import type { TourEvent } from './tour-events'
import { createInitialRuntimeState, hydrateRuntimeState, reduceTourRuntime } from './tour-reducer'

export type SpineTourStatus = 'idle' | 'resolving' | 'running' | 'completed'

export type SpineWaypoint = SpineWaypointDefinition & {
  /** Resolved live record id — null if resolution found nothing */
  recordId: string | null
  record: Record<string, unknown> | null
}

export interface UnifiedTourState {
  // ---- spine engine (features/mindmap/tours) ----
  status: SpineTourStatus
  tourId: string | null
  tourTitle: string | null
  tourSubtitle: string | null
  waypoints: SpineWaypoint[]
  stepIndex: number
  /** ids of waypoint nodes already placed on the canvas, in tour order */
  placedNodeIds: string[]

  beginResolving: (tour: SpineTourDefinition) => void
  beginRunning: (waypoints: SpineWaypoint[]) => void
  goTo: (index: number) => void
  markPlaced: (nodeId: string) => void
  complete: () => void
  reset: () => void

  // ---- evidence-graph engine (features/guided-tours) ----
  definition: TourDefinition | null
  runtime: TourRuntimeState | null

  loadDefinition: (
    definition: TourDefinition,
    progress?: PersistedTourProgress,
    reducedMotion?: boolean,
  ) => void
  dispatch: (event: TourEvent) => void
}

const idleSpineState = {
  status: 'idle',
  tourId: null,
  tourTitle: null,
  tourSubtitle: null,
  waypoints: [],
  stepIndex: 0,
  placedNodeIds: [],
} satisfies Pick<
  UnifiedTourState,
  'status' | 'tourId' | 'tourTitle' | 'tourSubtitle' | 'waypoints' | 'stepIndex' | 'placedNodeIds'
>

export const useUnifiedTourStore = create<UnifiedTourState>()((set, get) => ({
  ...idleSpineState,
  definition: null,
  runtime: null,

  beginResolving: (tour) =>
    set({
      ...idleSpineState,
      status: 'resolving',
      tourId: tour.id,
      tourTitle: tour.title,
      tourSubtitle: tour.subtitle,
    }),

  beginRunning: (waypoints) => set({ status: 'running', waypoints, stepIndex: 0 }),

  goTo: (index) => {
    const { waypoints } = get()
    if (index < 0 || index >= waypoints.length) return
    set({ stepIndex: index })
  },

  markPlaced: (nodeId) =>
    set((s) =>
      s.placedNodeIds.includes(nodeId) ? s : { placedNodeIds: [...s.placedNodeIds, nodeId] },
    ),

  complete: () => set({ status: 'completed' }),

  reset: () => set({ ...idleSpineState }),

  loadDefinition(definition, progress, reducedMotion = false) {
    set({
      definition,
      runtime: progress
        ? hydrateRuntimeState(definition, progress, reducedMotion)
        : {
            ...createInitialRuntimeState(definition, reducedMotion),
            phase: 'overview',
            // Seed the entry marker so the inspector + first node render immediately.
            // Choreography still owns the camera; arrival unlocks interactions.
            activeWaypointId: definition.entryWaypointId,
            hydrated: true,
            interactionsLocked: true,
          },
    })
  },

  dispatch(event) {
    const { definition, runtime } = get()
    if (!definition || !runtime) return
    set({ runtime: reduceTourRuntime(runtime, event, definition) })
  },
}))
