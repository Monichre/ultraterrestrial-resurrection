'use client'

import { create } from 'zustand'
import type { TourDefinition } from '../types/tour-definition'
import type { PersistedTourProgress, TourRuntimeState } from '../types/tour-runtime'
import type { TourEvent } from './tour-events'
import {
  createInitialRuntimeState,
  hydrateRuntimeState,
  reduceTourRuntime,
} from './tour-reducer'

interface TourStore {
  definition: TourDefinition | null
  runtime: TourRuntimeState | null
  loadDefinition: (
    definition: TourDefinition,
    progress?: PersistedTourProgress,
    reducedMotion?: boolean,
  ) => void
  dispatch: ( event: TourEvent ) => void
}

export const useTourStore = create<TourStore>()( ( set, get ) => ( {
  definition: null,
  runtime: null,

  loadDefinition( definition, progress, reducedMotion = false ) {
    set( {
      definition,
      runtime: progress
        ? hydrateRuntimeState( definition, progress, reducedMotion )
        : {
          ...createInitialRuntimeState( definition, reducedMotion ),
          phase: 'overview',
          // Seed the entry marker so the inspector + first node render immediately.
          // Choreography still owns the camera; arrival unlocks interactions.
          activeWaypointId: definition.entryWaypointId,
          hydrated: true,
          interactionsLocked: true,
        },
    } )
  },

  dispatch( event ) {
    const { definition, runtime } = get()
    if ( !definition || !runtime ) return
    set( { runtime: reduceTourRuntime( runtime, event, definition ) } )
  },
} ) )
