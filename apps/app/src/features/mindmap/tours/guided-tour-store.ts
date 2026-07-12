'use client'

/**
 * Guided Tour runtime state — the single source of truth the TourOverlay,
 * the suggestions dock, and the canvas all read while a tour is running.
 *
 * Waypoints are DEFINED as search queries and RESOLVED against live Neon
 * data when the tour starts (see actions/tour-actions.ts), so tours stay
 * tied to real records instead of hardcoded ids.
 */
import { useMemo } from 'react'
import { create } from 'zustand'

export type GuidedTourWaypointDef = {
  /** FTS query used to resolve the real record at tour start */
  searchQuery: string
  table: string
  /** Display title (overridden by the resolved record's own title if found) */
  title: string
  year: string
  /** Narrative shown on the tour card — the story of this stop */
  narrative: string
}

export type GuidedTourWaypoint = GuidedTourWaypointDef & {
  /** Resolved live record id — null if resolution found nothing */
  recordId: string | null
  record: Record<string, unknown> | null
}

export type GuidedTourDef = {
  id: string
  title: string
  subtitle: string
  waypoints: GuidedTourWaypointDef[]
}

export type GuidedTourStatus = 'idle' | 'resolving' | 'running' | 'completed'

type GuidedTourState = {
  status: GuidedTourStatus
  tourId: string | null
  tourTitle: string | null
  tourSubtitle: string | null
  waypoints: GuidedTourWaypoint[]
  stepIndex: number
  /** ids of waypoint nodes already placed on the canvas, in tour order */
  placedNodeIds: string[]

  beginResolving: (tour: GuidedTourDef) => void
  beginRunning: (waypoints: GuidedTourWaypoint[]) => void
  goTo: (index: number) => void
  markPlaced: (nodeId: string) => void
  complete: () => void
  reset: () => void
}

export const useGuidedTourStore = create<GuidedTourState>((set, get) => ({
  status: 'idle',
  tourId: null,
  tourTitle: null,
  tourSubtitle: null,
  waypoints: [],
  stepIndex: 0,
  placedNodeIds: [],

  beginResolving: (tour) =>
    set({
      status: 'resolving',
      tourId: tour.id,
      tourTitle: tour.title,
      tourSubtitle: tour.subtitle,
      waypoints: [],
      stepIndex: 0,
      placedNodeIds: [],
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

  reset: () =>
    set({
      status: 'idle',
      tourId: null,
      tourTitle: null,
      tourSubtitle: null,
      waypoints: [],
      stepIndex: 0,
      placedNodeIds: [],
    }),
}))

/** The record the research inquiry is anchored on right now (tour-aware).
 *  Selects primitives and memoizes so the returned object is referentially
 *  stable across unrelated re-renders — consumers use it in effect deps. */
export function useActiveTourSeed(): { id: string; table: string; title: string } | null {
  const id = useGuidedTourStore((s) =>
    s.status === 'running' ? (s.waypoints[s.stepIndex]?.recordId ?? null) : null,
  )
  const table = useGuidedTourStore((s) =>
    s.status === 'running' ? (s.waypoints[s.stepIndex]?.table ?? null) : null,
  )
  const title = useGuidedTourStore((s) =>
    s.status === 'running' ? (s.waypoints[s.stepIndex]?.title ?? null) : null,
  )
  return useMemo(
    () => (id && table ? { id, table, title: title ?? id } : null),
    [id, table, title],
  )
}
