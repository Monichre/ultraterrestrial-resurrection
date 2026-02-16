'use client'

import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useMindMapUiStore, type ActiveView } from '@/features/mindmap/store/mindmap-ui-store'

const VIEW_PATHS: Record<ActiveView, string> = {
  canvas: '/',
  timeline: '/timeline',
  globe: '/sightings',
  search: '/research-canvas',
  detail: '/key-figures',
}

const PATH_TO_VIEW: Record<string, ActiveView> = {
  '/': 'canvas',
  '/timeline': 'timeline',
  '/sightings': 'globe',
  '/sightings/realtime': 'globe',
  '/disclosure': 'search',
  '/key-figures': 'detail',
}

export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const {
    navigation,
    tour,
    setActiveView,
    setFullScreenMenuOpen,
    toggleFullScreenMenu,
    setCommandMenuOpen,
    setModelMenuOpen,
    toggleModelMenu,
    setActiveCommand,
    setSelectedModel,
    clearActiveCommand,
    startTour,
    endTour,
    setTourMode,
  } = useMindMapUiStore()

  const currentView = PATH_TO_VIEW[pathname] || 'canvas'

  const navigateToView = useCallback(
    ( view: ActiveView ) => {
      setActiveView( view )
      setFullScreenMenuOpen( false )
      router.push( VIEW_PATHS[view] )
    },
    [router, setActiveView, setFullScreenMenuOpen]
  )

  const openFullScreenMenu = useCallback( () => {
    setFullScreenMenuOpen( true )
  }, [setFullScreenMenuOpen] )

  const closeFullScreenMenu = useCallback( () => {
    setFullScreenMenuOpen( false )
  }, [setFullScreenMenuOpen] )

  const selectCommand = useCallback(
    ( commandId: string ) => {
      setActiveCommand( commandId.toLowerCase() )
      setCommandMenuOpen( false )
    },
    [setActiveCommand, setCommandMenuOpen]
  )

  const selectModel = useCallback(
    ( modelType: string ) => {
      setSelectedModel( modelType )
      setModelMenuOpen( false )
    },
    [setSelectedModel, setModelMenuOpen]
  )

  const beginTour = useCallback(
    ( tourId: string, mode: 'guided' | 'free-form' = 'guided' ) => {
      startTour( tourId, mode )
    },
    [startTour]
  )

  const stopTour = useCallback( () => {
    endTour()
  }, [endTour] )

  const switchTourMode = useCallback(
    ( mode: 'guided' | 'free-form' ) => {
      setTourMode( mode )
    },
    [setTourMode]
  )

  return {
    // Current state
    currentView,
    activeView: navigation.activeView,
    fullScreenMenuOpen: navigation.fullScreenMenuOpen,
    commandMenuOpen: navigation.commandMenuOpen,
    modelMenuOpen: navigation.modelMenuOpen,
    activeCommand: navigation.activeCommand,
    selectedModel: navigation.selectedModel,

    // Tour state
    tourMode: tour.tourMode,
    activeTourId: tour.activeTourId,
    activeTourSession: tour.activeTourSession,
    currentWaypointIndex: tour.currentWaypointIndex,
    backgroundProcessing: tour.backgroundProcessing,

    // Navigation actions
    navigateToView,
    openFullScreenMenu,
    closeFullScreenMenu,
    toggleFullScreenMenu,

    // Command/Model actions
    setCommandMenuOpen,
    setModelMenuOpen,
    toggleModelMenu,
    selectCommand,
    selectModel,
    clearActiveCommand,

    // Tour actions
    beginTour,
    stopTour,
    switchTourMode,

    // Available views for menus
    availableViews: Object.keys( VIEW_PATHS ) as ActiveView[],
  }
}
