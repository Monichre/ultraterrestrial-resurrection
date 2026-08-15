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

import type {
  SpineTourDefinition,
  SpineWaypointDefinition,
} from '@/features/guided-tours/shared/types/tour-definition'
import {
  useUnifiedTourStore,
  type SpineTourStatus,
  type SpineWaypoint,
} from '@/features/guided-tours/shared/state/unified-tour-store'

/**
 * Spine-tour shapes are defined once, in the shared tour types, so both engines
 * validate against the same schema (T-050). These aliases keep the existing
 * import surface working for consumers in this feature.
 */
export type GuidedTourWaypointDef = SpineWaypointDefinition
export type GuidedTourDef = SpineTourDefinition

export type GuidedTourWaypoint = SpineWaypoint
export type GuidedTourStatus = SpineTourStatus

/**
 * The spine engine's view of the unified tour store (T-050). An alias, not a
 * second store — `UnifiedTourState` is a superset of the shape this hook used
 * to own, so every existing selector and `getState()` call is unchanged.
 */
export const useGuidedTourStore = useUnifiedTourStore

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
