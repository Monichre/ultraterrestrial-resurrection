'use client'

import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { useTour } from '../hooks/use-tour'
import { TourLoader } from '../utils/tour-loader'
import { validateTourFlow, quickValidate } from '../utils/tour-validation'
import type { 
  TourDefinition, 
  TourProgress, 
  TourSession,
  TourEvent,
  TourConfig
} from '../types/tour'
import type { GraphContext } from '@/features/mindmap/utils/contextual-intelligence'

/**
 * Tour Context Provider for Global Tour State Management
 * Integrates tour system with mindmap context and spatial intelligence
 * 
 * Created: 2025-07-02
 */

interface TourContextType {
  // Current tour state
  currentTour: TourDefinition | null
  tourProgress: TourProgress | null
  isTourActive: boolean
  tourMode: 'guided' | 'free-form'
  
  // Tour context for contextual intelligence
  tourContext: GraphContext['tourContext'] | null
  
  // Tour actions
  startTour: (tourId: string) => Promise<void>
  stopTour: () => void
  pauseTour: () => void
  resumeTour: () => void
  
  // Navigation
  goToWaypoint: (waypointIndex: number) => Promise<void>
  nextWaypoint: () => Promise<void>
  previousWaypoint: () => Promise<void>
  
  // Tour management
  loadAvailableTours: () => Promise<{ id: string; title: string; description: string }[]>
  exportTourSession: () => string | null
  importTourSession: (sessionData: string) => Promise<void>
  
  // Validation and debugging
  validateCurrentTour: () => Promise<{ valid: boolean; issues: string[] }>
  getTourEvents: () => TourEvent[]
  
  // State
  isLoading: boolean
  error: string | null
}

const TourContext = createContext<TourContextType | null>(null)

interface TourProviderProps {
  children: React.ReactNode
  config?: Partial<TourConfig>
}

export const TourProvider: React.FC<TourProviderProps> = ({ children, config = {} }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getNodes, getEdges } = useMindMap()
  
  // Initialize the tour hook with the provided config
  const tour = useTour(config)
  
  // Local state for provider-specific functionality
  const [isTourActive, setIsTourActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [availableTours, setAvailableTours] = useState<{ id: string; title: string; description: string }[]>([])
  
  // References for cleanup and state management
  const tourEventHistory = useRef<TourEvent[]>([])
  const autoSaveInterval = useRef<NodeJS.Timeout>()
  
  // Monitor URL parameters for tour activation
  useEffect(() => {
    const tourId = searchParams.get('tourId')
    if (tourId && !tour.currentTour) {
      startTour(tourId).catch(error => {
        console.error('Failed to auto-start tour from URL:', error)
      })
    }
  }, [searchParams])
  
  // Auto-save tour progress
  useEffect(() => {
    if (isTourActive && tour.tourProgress && tour.config.saveProgressToLocalStorage) {
      autoSaveInterval.current = setInterval(() => {
        const sessionData = tour.getTourSession()
        if (sessionData) {
          localStorage.setItem(`tour_autosave_${tour.currentTour?.id}`, JSON.stringify(sessionData))
        }
      }, 30000) // Auto-save every 30 seconds
      
      return () => {
        if (autoSaveInterval.current) {
          clearInterval(autoSaveInterval.current)
        }
      }
    }
  }, [isTourActive, tour.tourProgress, tour.config.saveProgressToLocalStorage])
  
  // Track tour events
  useEffect(() => {
    if (tour.tourEvents.length > tourEventHistory.current.length) {
      const newEvents = tour.tourEvents.slice(tourEventHistory.current.length)
      tourEventHistory.current = [...tourEventHistory.current, ...newEvents]
    }
  }, [tour.tourEvents])
  
  /**
   * Start a tour by ID
   */
  const startTour = useCallback(async (tourId: string) => {
    try {
      tour.setError(null)
      
      // Load the tour definition
      const tourDefinition = await TourLoader.getBuiltinTour(tourId)
      
      // Quick validation before starting
      if (!quickValidate(tourDefinition)) {
        throw new Error('Tour failed basic validation checks')
      }
      
      // Load the tour
      await tour.loadTour(tourDefinition)
      
      setIsTourActive(true)
      setIsPaused(false)
      
      // Update URL to reflect tour state
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('tourId', tourId)
      newUrl.searchParams.set('step', '0')
      window.history.pushState({}, '', newUrl.toString())
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start tour'
      tour.setError(message)
      throw error
    }
  }, [tour])
  
  /**
   * Stop the current tour
   */
  const stopTour = useCallback(() => {
    if (tour.currentTour) {
      // Save final state before stopping
      const sessionData = tour.getTourSession()
      if (sessionData && tour.config.saveProgressToLocalStorage) {
        localStorage.setItem(`tour_final_${tour.currentTour.id}`, JSON.stringify(sessionData))
      }
      
      // Track tour termination
      if (tour.tourProgress && !tour.tourProgress.completed) {
        const stopEvent: TourEvent = {
          type: 'tour_abandoned',
          tourId: tour.currentTour.id,
          lastWaypointId: tour.tourProgress.currentWaypointId,
          timestamp: new Date().toISOString(),
        }
        tourEventHistory.current.push(stopEvent)
      }
    }
    
    setIsTourActive(false)
    setIsPaused(false)
    
    // Clear tour parameters from URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('tourId')
    newUrl.searchParams.delete('step')
    window.history.pushState({}, '', newUrl.toString())
    
    // Reset tour state
    tour.resetTour()
  }, [tour])
  
  /**
   * Pause the current tour
   */
  const pauseTour = useCallback(() => {
    setIsPaused(true)
    
    // Save state when pausing
    const sessionData = tour.getTourSession()
    if (sessionData && tour.config.saveProgressToLocalStorage) {
      localStorage.setItem(`tour_paused_${tour.currentTour?.id}`, JSON.stringify(sessionData))
    }
  }, [tour])
  
  /**
   * Resume a paused tour
   */
  const resumeTour = useCallback(() => {
    setIsPaused(false)
  }, [])
  
  /**
   * Navigate to a specific waypoint
   */
  const goToWaypoint = useCallback(async (waypointIndex: number) => {
    if (!isTourActive || isPaused) return
    
    await tour.navigateToWaypoint(waypointIndex)
    
    // Update URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('step', waypointIndex.toString())
    window.history.pushState({}, '', newUrl.toString())
  }, [tour, isTourActive, isPaused])
  
  /**
   * Move to next waypoint
   */
  const nextWaypoint = useCallback(async () => {
    if (!isTourActive || isPaused) return
    
    await tour.nextWaypoint()
    
    // Update URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('step', (tour.currentStep + 1).toString())
    window.history.pushState({}, '', newUrl.toString())
  }, [tour, isTourActive, isPaused])
  
  /**
   * Move to previous waypoint
   */
  const previousWaypoint = useCallback(async () => {
    if (!isTourActive || isPaused || !tour.canGoPrevious) return
    
    await tour.previousWaypoint()
    
    // Update URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('step', Math.max(0, tour.currentStep - 1).toString())
    window.history.pushState({}, '', newUrl.toString())
  }, [tour, isTourActive, isPaused])
  
  /**
   * Load available tours
   */
  const loadAvailableTours = useCallback(async () => {
    try {
      const tours = await TourLoader.listAvailableTours()
      setAvailableTours(tours)
      return tours
    } catch (error) {
      console.error('Failed to load available tours:', error)
      return []
    }
  }, [])
  
  /**
   * Export current tour session
   */
  const exportTourSession = useCallback(() => {
    const sessionData = tour.getTourSession()
    if (!sessionData) return null
    
    const exportData = {
      ...sessionData,
      exportedAt: new Date().toISOString(),
      tourEvents: tourEventHistory.current,
      mindmapSnapshot: {
        nodes: getNodes(),
        edges: getEdges()
      }
    }
    
    return JSON.stringify(exportData, null, 2)
  }, [tour, getNodes, getEdges])
  
  /**
   * Import tour session data
   */
  const importTourSession = useCallback(async (sessionData: string) => {
    try {
      const data = JSON.parse(sessionData)
      
      if (!data.tour || !data.progress) {
        throw new Error('Invalid tour session data format')
      }
      
      // Validate the tour definition
      if (!quickValidate(data.tour)) {
        throw new Error('Tour data failed validation')
      }
      
      // Load the tour
      await tour.loadTour(data.tour)
      
      // Restore progress (would need to implement this in the tour hook)
      // For now, we'll start from the beginning with the imported tour
      setIsTourActive(true)
      setIsPaused(false)
      
      // Restore mindmap state if available
      if (data.mindmapSnapshot) {
        // This would need to be implemented in the mindmap context
        console.log('Tour session imported with mindmap snapshot')
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import tour session'
      tour.setError(message)
      throw error
    }
  }, [tour])
  
  /**
   * Validate current tour
   */
  const validateCurrentTour = useCallback(async () => {
    if (!tour.currentTour) {
      return { valid: false, issues: ['No active tour to validate'] }
    }
    
    try {
      const currentNodes = getNodes()
      const validationResult = await validateTourFlow(tour.currentTour, currentNodes, tour.tourProgress || undefined)
      
      const issues = [
        ...validationResult.errors.map(error => error.message),
        ...validationResult.warnings.map(warning => warning.message)
      ]
      
      return {
        valid: validationResult.valid,
        issues
      }
    } catch (error) {
      return {
        valid: false,
        issues: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }, [tour, getNodes])
  
  /**
   * Get tour events for debugging and analytics
   */
  const getTourEvents = useCallback(() => {
    return [...tourEventHistory.current, ...tour.tourEvents]
  }, [tour.tourEvents])
  
  const contextValue: TourContextType = {
    // State
    currentTour: tour.currentTour,
    tourProgress: tour.tourProgress,
    isTourActive,
    tourMode: tour.tourMode,
    tourContext: tour.tourContext,
    isLoading: tour.isLoading,
    error: tour.error,
    
    // Actions
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    
    // Navigation
    goToWaypoint,
    nextWaypoint,
    previousWaypoint,
    
    // Management
    loadAvailableTours,
    exportTourSession,
    importTourSession,
    
    // Validation
    validateCurrentTour,
    getTourEvents,
  }
  
  return (
    <TourContext.Provider value={contextValue}>
      {children}
    </TourContext.Provider>
  )
}

/**
 * Hook to use the tour context
 */
export const useTourContext = () => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTourContext must be used within a TourProvider')
  }
  return context
}

/**
 * Hook for tour-aware mindmap operations
 */
export const useTourAwareMindMap = () => {
  const tourContext = useTourContext()
  const mindMap = useMindMap()
  
  /**
   * Add nodes with tour context
   */
  const addTourAwareNodes = useCallback((nodes: any[]) => {
    if (tourContext.isTourActive && tourContext.currentTour && tourContext.tourProgress) {
      const enhancedNodes = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          addedDuringTour: true,
          tourId: tourContext.currentTour?.id,
          waypointId: tourContext.tourProgress?.currentWaypointId,
          addedAt: new Date().toISOString()
        }
      }))
      
      mindMap.addNodes(enhancedNodes)
      return enhancedNodes
    } else {
      mindMap.addNodes(nodes)
      return nodes
    }
  }, [tourContext, mindMap])
  
  /**
   * Check if a node was added during the current tour
   */
  const isTourNode = useCallback((nodeId: string) => {
    const node = mindMap.getNode(nodeId)
    return !!(node?.data?.addedDuringTour && node?.data?.tourId === tourContext.currentTour?.id)
  }, [mindMap, tourContext.currentTour])
  
  /**
   * Get all nodes added during the current tour
   */
  const getTourNodes = useCallback(() => {
    if (!tourContext.currentTour) return []
    
    return mindMap.getNodes().filter(node => 
      node.data?.addedDuringTour && 
      node.data?.tourId === tourContext.currentTour?.id
    )
  }, [mindMap, tourContext.currentTour])
  
  return {
    ...mindMap,
    addTourAwareNodes,
    isTourNode,
    getTourNodes
  }
}

/**
 * Helper function to check if tours are available
 */
export const checkTourAvailability = async (): Promise<boolean> => {
  try {
    const tours = await TourLoader.listAvailableTours()
    return tours.length > 0
  } catch (error) {
    console.error('Failed to check tour availability:', error)
    return false
  }
}