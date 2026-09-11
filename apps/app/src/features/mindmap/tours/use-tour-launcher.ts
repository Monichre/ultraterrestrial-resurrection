'use client'

/**
 * One entry point for starting any registered tour from the canvas (T-050 s5).
 * Dispatches on the definition's `mode` so chips, the typer regex and deep
 * links never need to know which engine a tour runs on. Navigation is store
 * state, not a route change — both engines render on this canvas.
 */
import { useCallback, useMemo } from 'react'

import type { AnyTourDefinition } from '@/features/guided-tours/shared/types/tour-definition'

import { GUIDED_TOURS, tourHandle } from './famous-events-tour'
import { useEvidenceTour } from './use-evidence-tour'
import { useGuidedTour } from './use-guided-tour'

const assertNever = (value: never): never => {
  throw new Error(`Unhandled tour mode: ${String(value)}`)
}

/** Match free text typed into the console against a registered tour. */
export const matchTourFromInput = (input: string): AnyTourDefinition | undefined => {
  const text = input.trim().toLowerCase()
  if (!text) return undefined
  return GUIDED_TOURS.find((tour) => {
    const needles = [tour.title, tour.subtitle, tour.id.replace(/-/g, ' ')]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.toLowerCase())
    return needles.some((needle) => text.includes(needle))
  })
}

export function useTourLauncher() {
  const { startTour: startSpineTour, endTour: endSpineTour } = useGuidedTour()
  const { startEvidenceTour, leaveEvidenceTour, isActive: evidenceActive } = useEvidenceTour()

  const startTour = useCallback(
    async (tour: AnyTourDefinition, options?: { resume?: boolean }) => {
      // Only one tour owns the canvas at a time.
      if (evidenceActive) leaveEvidenceTour()
      switch (tour.mode) {
        case 'spine':
          endSpineTour()
          await startSpineTour(tour)
          return
        case 'evidence-graph':
          await startEvidenceTour(tour, options)
          return
        default:
          assertNever(tour)
      }
    },
    [endSpineTour, evidenceActive, leaveEvidenceTour, startEvidenceTour, startSpineTour],
  )

  /** Accepts a tour `id` or its deep-link handle (`?tour=nuclear-shadow`). */
  const startTourById = useCallback(
    async (tourId: string, options?: { resume?: boolean }) => {
      const tour = GUIDED_TOURS.find((item) => item.id === tourId || tourHandle(item) === tourId)
      if (!tour) return false
      await startTour(tour, options)
      return true
    },
    [startTour],
  )

  return useMemo(() => ({ tours: GUIDED_TOURS, startTour, startTourById }), [startTour, startTourById])
}
