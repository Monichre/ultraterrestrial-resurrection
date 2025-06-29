'use client'

import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type {
  TourDefinition,
  TourState,
  TourWaypoint,
  TourProgress,
  TourHistoryEntry,
  TourNavigationContext,
  TourEvent,
  TourEventHandler,
  TourEventType,
  TourSettings
} from '../types/tour'

// Tour State Actions
type TourAction =
  | { type: 'START_TOUR'; payload: { tour: TourDefinition; waypointIndex?: number } }
  | { type: 'END_TOUR' }
  | { type: 'NAVIGATE_TO_WAYPOINT'; payload: { waypointIndex: number } }
  | { type: 'COMPLETE_WAYPOINT'; payload: { waypointId: string; duration: number } }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<TourProgress> }
  | { type: 'ADD_HISTORY_ENTRY'; payload: TourHistoryEntry }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TourSettings> }
  | { type: 'SET_STATE'; payload: Partial<TourState> }

const initialTourState: TourState = {
  isActive: false,
  currentTourId: null,
  currentWaypointIndex: 0,
  currentWaypointId: null,
  progress: {
    completedWaypoints: [],
    totalWaypoints: 0,
    percentComplete: 0,
    timeSpent: 0,
    startedAt: '',
    estimatedTimeRemaining: 0
  },
  history: [],
  settings: {
    autoAdvance: false,
    showHints: true,
    playNarration: true,
    skipValidation: false,
    debugMode: process.env.NODE_ENV === 'development'
  }
}

function tourReducer( state: TourState, action: TourAction ): TourState {
  switch ( action.type ) {
    case 'START_TOUR':
      const { tour, waypointIndex = 0 } = action.payload
      const startTime = new Date().toISOString()

      return {
        ...state,
        isActive: true,
        currentTourId: tour.id,
        currentWaypointIndex: waypointIndex,
        currentWaypointId: tour.waypoints[waypointIndex]?.id || null,
        progress: {
          completedWaypoints: [],
          totalWaypoints: tour.waypoints.length,
          percentComplete: 0,
          timeSpent: 0,
          startedAt: startTime,
          estimatedTimeRemaining: tour.estimatedDuration * 60 // Convert to seconds
        },
        history: [{
          waypointId: tour.waypoints[waypointIndex]?.id || '',
          timestamp: startTime,
          action: 'started',
          duration: 0
        }]
      }

    case 'END_TOUR':
      return {
        ...initialTourState,
        settings: state.settings, // Preserve settings
        history: state.history // Preserve history for analysis
      }

    case 'NAVIGATE_TO_WAYPOINT':
      return {
        ...state,
        currentWaypointIndex: action.payload.waypointIndex,
        currentWaypointId: state.currentTourId ?
          // This would need the tour definition, but we'll handle this in the hook
          `waypoint-${action.payload.waypointIndex}` : null
      }

    case 'COMPLETE_WAYPOINT':
      const { waypointId, duration } = action.payload
      const completedWaypoints = [...state.progress.completedWaypoints, waypointId]
      const percentComplete = ( completedWaypoints.length / state.progress.totalWaypoints ) * 100

      return {
        ...state,
        progress: {
          ...state.progress,
          completedWaypoints,
          percentComplete,
          timeSpent: state.progress.timeSpent + duration
        }
      }

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          ...action.payload
        }
      }

    case 'ADD_HISTORY_ENTRY':
      return {
        ...state,
        history: [...state.history, action.payload]
      }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      }

    case 'SET_STATE':
      return {
        ...state,
        ...action.payload
      }

    default:
      return state
  }
}

export function useTour() {
  const [state, dispatch] = useReducer( tourReducer, initialTourState )
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Event handlers and tour definition storage
  const eventHandlers = useRef<Map<TourEventType, TourEventHandler[]>>( new Map() )
  const currentTour = useRef<TourDefinition | null>( null )
  const waypointStartTime = useRef<number>( 0 )

  // URL-driven navigation support
  const updateURL = useCallback( ( tourId: string, waypointIndex: number ) => {
    const params = new URLSearchParams( searchParams )
    params.set( 'step', waypointIndex.toString() )

    const newURL = `/mindmap/tour/${tourId}?${params.toString()}`
    router.push( newURL, { scroll: false } )
  }, [router, searchParams] )

  // Parse URL parameters for tour state
  const parseURLParams = useCallback( () => {
    const pathSegments = pathname.split( '/' )
    const tourId = pathSegments[pathSegments.indexOf( 'tour' ) + 1]
    const step = searchParams.get( 'step' )

    return {
      tourId: tourId || null,
      waypointIndex: step ? parseInt( step, 10 ) : 0
    }
  }, [pathname, searchParams] )

  // Event system
  const addEventListener = useCallback( ( eventType: TourEventType, handler: TourEventHandler ) => {
    const handlers = eventHandlers.current.get( eventType ) || []
    handlers.push( handler )
    eventHandlers.current.set( eventType, handlers )

    // Return cleanup function
    return () => {
      const currentHandlers = eventHandlers.current.get( eventType ) || []
      const filteredHandlers = currentHandlers.filter( h => h !== handler )
      eventHandlers.current.set( eventType, filteredHandlers )
    }
  }, [] )

  const dispatchEvent = useCallback( ( event: TourEvent ) => {
    const handlers = eventHandlers.current.get( event.type ) || []
    handlers.forEach( handler => {
      try {
        handler( event )
      } catch ( error ) {
        console.error( `Error in tour event handler for ${event.type}:`, error )
      }
    } )
  }, [] )

  // Tour control methods
  const startTour = useCallback( async ( tour: TourDefinition, waypointIndex = 0 ) => {
    try {
      currentTour.current = tour
      waypointStartTime.current = Date.now()

      dispatch( {
        type: 'START_TOUR',
        payload: { tour, waypointIndex }
      } )

      // Update URL to reflect tour state
      updateURL( tour.id, waypointIndex )

      // Dispatch tour started event
      dispatchEvent( {
        type: 'tourStarted',
        tourId: tour.id,
        waypointId: tour.waypoints[waypointIndex]?.id,
        timestamp: new Date().toISOString()
      } )

    } catch ( error ) {
      console.error( 'Error starting tour:', error )
      dispatchEvent( {
        type: 'navigationError',
        tourId: tour.id,
        timestamp: new Date().toISOString(),
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      } )
    }
  }, [updateURL, dispatchEvent] )

  const endTour = useCallback( () => {
    if ( state.isActive && currentTour.current ) {
      const tourId = currentTour.current.id

      dispatch( { type: 'END_TOUR' } )
      currentTour.current = null

      // Clear URL parameters
      router.push( '/mindmap', { scroll: false } )

      dispatchEvent( {
        type: 'tourCompleted',
        tourId,
        timestamp: new Date().toISOString(),
        data: {
          progress: state.progress,
          completedWaypoints: state.progress.completedWaypoints.length,
          totalWaypoints: state.progress.totalWaypoints
        }
      } )
    }
  }, [state.isActive, state.progress, router, dispatchEvent] )

  const navigateToWaypoint = useCallback( async ( waypointIndex: number ) => {
    if ( !currentTour.current || !state.isActive ) {
      console.warn( 'Cannot navigate: no active tour' )
      return false
    }

    const tour = currentTour.current
    const waypoint = tour.waypoints[waypointIndex]

    if ( !waypoint ) {
      console.warn( `Waypoint at index ${waypointIndex} not found` )
      return false
    }

    // Record completion of previous waypoint if applicable
    if ( state.currentWaypointId && waypointStartTime.current > 0 ) {
      const duration = Math.floor( ( Date.now() - waypointStartTime.current ) / 1000 )

      dispatch( {
        type: 'COMPLETE_WAYPOINT',
        payload: {
          waypointId: state.currentWaypointId,
          duration
        }
      } )

      dispatch( {
        type: 'ADD_HISTORY_ENTRY',
        payload: {
          waypointId: state.currentWaypointId,
          timestamp: new Date().toISOString(),
          action: 'completed',
          duration
        }
      } )
    }

    // Navigate to new waypoint
    dispatch( {
      type: 'NAVIGATE_TO_WAYPOINT',
      payload: { waypointIndex }
    } )

    // Update current waypoint ID
    dispatch( {
      type: 'SET_STATE',
      payload: { currentWaypointId: waypoint.id }
    } )

    // Update URL
    updateURL( tour.id, waypointIndex )

    // Record waypoint entry
    waypointStartTime.current = Date.now()

    dispatch( {
      type: 'ADD_HISTORY_ENTRY',
      payload: {
        waypointId: waypoint.id,
        timestamp: new Date().toISOString(),
        action: 'started',
        duration: 0
      }
    } )

    dispatchEvent( {
      type: 'waypointEntered',
      tourId: tour.id,
      waypointId: waypoint.id,
      timestamp: new Date().toISOString(),
      data: { waypointIndex, waypoint }
    } )

    return true
  }, [state.isActive, state.currentWaypointId, updateURL, dispatchEvent] )

  const nextWaypoint = useCallback( () => {
    if ( currentTour.current && state.currentWaypointIndex < currentTour.current.waypoints.length - 1 ) {
      return navigateToWaypoint( state.currentWaypointIndex + 1 )
    }
    return Promise.resolve( false )
  }, [state.currentWaypointIndex, navigateToWaypoint] )

  const previousWaypoint = useCallback( () => {
    if ( state.currentWaypointIndex > 0 ) {
      return navigateToWaypoint( state.currentWaypointIndex - 1 )
    }
    return Promise.resolve( false )
  }, [state.currentWaypointIndex, navigateToWaypoint] )

  const skipWaypoint = useCallback( () => {
    if ( !state.currentWaypointId ) return

    dispatch( {
      type: 'ADD_HISTORY_ENTRY',
      payload: {
        waypointId: state.currentWaypointId,
        timestamp: new Date().toISOString(),
        action: 'skipped',
        duration: Math.floor( ( Date.now() - waypointStartTime.current ) / 1000 )
      }
    } )

    return nextWaypoint()
  }, [state.currentWaypointId, nextWaypoint] )

  // Settings management
  const updateSettings = useCallback( ( newSettings: Partial<TourSettings> ) => {
    dispatch( {
      type: 'UPDATE_SETTINGS',
      payload: newSettings
    } )
  }, [] )

  // Navigation context
  const getNavigationContext = useCallback( (): TourNavigationContext | null => {
    if ( !currentTour.current || !state.isActive ) return null

    const tour = currentTour.current
    const currentWaypoint = tour.waypoints[state.currentWaypointIndex]
    const nextWaypointObj = tour.waypoints[state.currentWaypointIndex + 1]
    const previousWaypointObj = tour.waypoints[state.currentWaypointIndex - 1]

    if ( !currentWaypoint ) return null

    return {
      currentTour: tour,
      currentWaypoint,
      nextWaypoint: nextWaypointObj,
      previousWaypoint: previousWaypointObj,
      canAdvance: !!nextWaypointObj,
      canGoBack: !!previousWaypointObj,
      availableActions: [
        {
          id: 'next',
          label: 'Next',
          description: 'Move to the next waypoint',
          type: 'navigation',
          enabled: !!nextWaypointObj,
          handler: nextWaypoint
        },
        {
          id: 'previous',
          label: 'Previous',
          description: 'Go back to the previous waypoint',
          type: 'navigation',
          enabled: !!previousWaypointObj,
          handler: previousWaypoint
        },
        {
          id: 'skip',
          label: 'Skip',
          description: 'Skip this waypoint',
          type: 'navigation',
          enabled: !!nextWaypointObj,
          handler: skipWaypoint
        },
        {
          id: 'end',
          label: 'End Tour',
          description: 'End the current tour',
          type: 'utility',
          enabled: true,
          handler: endTour
        }
      ]
    }
  }, [state.isActive, state.currentWaypointIndex, nextWaypoint, previousWaypoint, skipWaypoint, endTour] )

  // Initialize from URL on mount
  useEffect( () => {
    const { tourId, waypointIndex } = parseURLParams()

    if ( tourId && !state.isActive ) {
      // TODO: Load tour definition from storage/API and start tour
      console.log( `Should load tour: ${tourId} at waypoint: ${waypointIndex}` )
    }
  }, [parseURLParams, state.isActive] )

  // Cleanup on unmount
  useEffect( () => {
    return () => {
      eventHandlers.current.clear()
    }
  }, [] )

  return {
    // State
    state,
    currentTour: currentTour.current,
    navigationContext: getNavigationContext(),

    // Actions
    startTour,
    endTour,
    navigateToWaypoint,
    nextWaypoint,
    previousWaypoint,
    skipWaypoint,
    updateSettings,

    // Events
    addEventListener,
    dispatchEvent,

    // Utils
    isActive: state.isActive,
    progress: state.progress,
    settings: state.settings,
    history: state.history
  }
} 