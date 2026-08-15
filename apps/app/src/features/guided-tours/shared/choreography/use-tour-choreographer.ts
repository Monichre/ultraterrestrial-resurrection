'use client'

import { useEffect, useRef, useState } from 'react'
import { useNodesInitialized, useReactFlow } from '@xyflow/react'
import type { TourDefinition } from '../types/tour-definition'
import type { NuclearTourEdge, NuclearTourNode } from '../types/flow-model'
import { useTourStore } from '../state/tour-store'
import {
  focusWaypoint,
  runOpeningSequence,
  runWaypointTransition,
} from './transition-sequence'

/** If measurement stalls (Strict Mode / opacity-0 nodes), still enter the tour. */
const OPENING_READY_FALLBACK_MS = 700
const OPENING_FORCE_ENTER_MS = 2_400

export function useTourChoreographer( definition: TourDefinition ): void {
  const flow = useReactFlow<NuclearTourNode, NuclearTourEdge>()
  const nodesInitialized = useNodesInitialized( { includeHiddenNodes: true } )
  const [openingReady, setOpeningReady] = useState( false )
  const runtime = useTourStore( ( state ) => state.runtime )
  const dispatch = useTourStore( ( state ) => state.dispatch )
  const activeExecution = useRef<AbortController | null>( null )
  const forcedEntry = useRef( false )

  const hydrated = runtime?.hydrated ?? false
  const phase = runtime?.phase
  const reducedMotion = runtime?.reducedMotion ?? false
  const activeWaypointId = runtime?.activeWaypointId ?? null
  const pendingWaypointId = runtime?.pendingWaypointId ?? null
  const transitionToken = runtime?.transitionToken ?? null
  const viewportOwnership = runtime?.viewportOwnership

  useEffect( () => {
    if ( nodesInitialized ) {
      setOpeningReady( true )
      return
    }
    const timer = window.setTimeout( () => setOpeningReady( true ), OPENING_READY_FALLBACK_MS )
    return () => window.clearTimeout( timer )
  }, [nodesInitialized] )

  useEffect( () => {
    if ( !hydrated || !openingReady || phase !== 'overview' ) return

    activeExecution.current?.abort()
    const controller = new AbortController()
    activeExecution.current = controller

    void runOpeningSequence( {
      definition,
      flow,
      dispatch,
      signal: controller.signal,
      reducedMotion,
    } ).catch( ( error: unknown ) => {
      if ( error instanceof DOMException && error.name === 'AbortError' ) return
      // Land on entry even if camera work fails — blank canvas is worse.
      console.warn( '[nuclear-shadow] opening sequence failed; forcing entry', error )
      dispatch( { type: 'OVERVIEW_COMPLETED' } )
      dispatch( {
        type: 'WAYPOINT_ARRIVAL_COMPLETED',
        waypointId: definition.entryWaypointId,
      } )
    } )

    return () => controller.abort()
  }, [definition, dispatch, flow, hydrated, openingReady, phase, reducedMotion] )

  // Hard fallback: if overview never commits (aborted choreography loop), enter WP-01.
  useEffect( () => {
    if ( !hydrated || phase !== 'overview' || forcedEntry.current ) return

    const timer = window.setTimeout( () => {
      const current = useTourStore.getState().runtime
      if ( !current || current.phase !== 'overview' ) return
      forcedEntry.current = true
      dispatch( { type: 'OVERVIEW_COMPLETED' } )
      dispatch( {
        type: 'WAYPOINT_ARRIVAL_COMPLETED',
        waypointId: definition.entryWaypointId,
      } )
    }, OPENING_FORCE_ENTER_MS )

    return () => window.clearTimeout( timer )
  }, [definition.entryWaypointId, dispatch, hydrated, phase] )
  useEffect( () => {
    if (
      phase !== 'departing' ||
      !activeWaypointId ||
      !pendingWaypointId ||
      !transitionToken
    ) {
      return
    }

    activeExecution.current?.abort()
    const controller = new AbortController()
    activeExecution.current = controller

    void runWaypointTransition( {
      definition,
      flow,
      fromId: activeWaypointId,
      toId: pendingWaypointId,
      transitionToken,
      dispatch,
      signal: controller.signal,
      reducedMotion,
    } ).catch( ( error: unknown ) => {
      if ( error instanceof DOMException && error.name === 'AbortError' ) return
      dispatch( {
        type: 'TOUR_FAILED',
        code: 'WAYPOINT_TRANSITION_FAILED',
        message: error instanceof Error ? error.message : 'Waypoint transition failed.',
      } )
    } )

    return () => controller.abort()
  }, [
    activeWaypointId,
    definition,
    dispatch,
    flow,
    pendingWaypointId,
    phase,
    reducedMotion,
    transitionToken,
  ] )

  useEffect( () => {
    if ( !activeWaypointId || viewportOwnership !== 'system' ) return
    if ( phase === 'departing' || phase === 'overview' || phase === 'arriving' ) return

    void focusWaypoint( {
      flow,
      definition,
      waypointId: activeWaypointId,
      duration: reducedMotion ? 0 : 500,
    } )
  }, [activeWaypointId, definition, flow, phase, reducedMotion, viewportOwnership] )
}
