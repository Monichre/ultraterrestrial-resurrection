"use server"

import { tourStateAgent } from './tour-state-agent'
import type { GraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import type { TourSession } from './tour-state-agent'

/**
 * Server Actions for tour management
 * These are the async convenience functions that need to be Server Actions
 */

export async function startGuidedTour(
  tourId: string,
  initialContext?: GraphContext
): Promise<string> {
  return await tourStateAgent.initializeTour( tourId, 'guided', initialContext )
}

export async function startFreeFormExploration(
  tourId?: string,
  initialContext?: GraphContext
): Promise<string> {
  const defaultTourId = tourId || 'roswell-disclosure' // fallback to default tour structure
  return await tourStateAgent.initializeTour( defaultTourId, 'free-form', initialContext )
}

export async function switchToFreeForm( sessionId: string ): Promise<TourSession> {
  return await tourStateAgent.transitionTour( sessionId, 'free-form' )
}

export async function progressTour( sessionId: string ): Promise<TourSession> {
  return await tourStateAgent.transitionTour( sessionId, 'next' )
}

export async function goBackInTour( sessionId: string ): Promise<TourSession> {
  return await tourStateAgent.transitionTour( sessionId, 'previous' )
}

export async function jumpToWaypoint( sessionId: string, waypointId: string ): Promise<TourSession> {
  return await tourStateAgent.transitionTour( sessionId, { jumpTo: waypointId } )
} 