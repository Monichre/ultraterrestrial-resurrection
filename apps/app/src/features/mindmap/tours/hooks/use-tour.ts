'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { 
  TourDefinition, 
  TourProgress, 
  TourSession, 
  TourEvent,
  TourConfig,
  TourNote
} from '../types/tour'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { getGraphContext, generateTourAwareSearchRules, type GraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { xataToXYFlow } from '@/features/mindmap/actions/xata-to-xyflow'

const DEFAULT_TOUR_CONFIG: TourConfig = {
  enableAutoProgress: false,
  showProgressIndicator: true,
  allowSkipping: true,
  allowBacktracking: true,
  saveProgressToLocalStorage: true,
  analyticsEnabled: true,
}

/**
 * Custom hook for managing guided tour state and navigation
 * Provides URL-driven navigation, progress tracking, and tour validation
 */
export const useTour = (config: Partial<TourConfig> = {}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { getNodes, getEdges, addNodes, addEdges, setNodes, setEdges } = useMindMap()
  
  const finalConfig = { ...DEFAULT_TOUR_CONFIG, ...config }
  
  // Core state
  const [currentTour, setCurrentTour] = useState<TourDefinition | null>(null)
  const [tourProgress, setTourProgress] = useState<TourProgress | null>(null)
  const [tourNotes, setTourNotes] = useState<TourNote[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Enhanced tour state for mindmap integration
  const [tourContext, setTourContext] = useState<GraphContext['tourContext'] | null>(null)
  const [autoProgressEnabled, setAutoProgressEnabled] = useState(false)
  const [tourMode, setTourMode] = useState<'guided' | 'free-form'>('guided')
  
  // Tour events tracking
  const tourEvents = useRef<TourEvent[]>([])
  
  // URL state management
  const tourId = searchParams.get('tourId')
  const stepParam = searchParams.get('step')
  const currentStep = stepParam ? parseInt(stepParam, 10) : 0
  
  /**
   * Load a tour definition and initialize tour state
   */
  const loadTour = useCallback(async (tourDefinition: TourDefinition) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate tour definition
      if (!tourDefinition.waypoints || tourDefinition.waypoints.length === 0) {
        throw new Error('Tour must have at least one waypoint')
      }
      
      setCurrentTour(tourDefinition)
      
      // Initialize or load existing progress
      let progress: TourProgress
      
      if (finalConfig.saveProgressToLocalStorage) {
        const savedProgress = localStorage.getItem(`tour_progress_${tourDefinition.id}`)
        if (savedProgress) {
          progress = JSON.parse(savedProgress)
          // Validate saved progress is still compatible
          if (progress.tourId !== tourDefinition.id) {
            throw new Error('Saved progress is for a different tour')
          }
        } else {
          progress = createNewProgress(tourDefinition)
        }
      } else {
        progress = createNewProgress(tourDefinition)
      }
      
      setTourProgress(progress)
      
      // Load saved notes
      if (finalConfig.saveProgressToLocalStorage) {
        const savedNotes = localStorage.getItem(`tour_notes_${tourDefinition.id}`)
        if (savedNotes) {
          setTourNotes(JSON.parse(savedNotes))
        }
      }
      
      // Track tour start event
      trackEvent({
        type: 'tour_started',
        tourId: tourDefinition.id,
        timestamp: new Date().toISOString(),
      })
      
      // Navigate to first waypoint if not already positioned
      if (currentStep === 0 && tourDefinition.waypoints.length > 0) {
        await navigateToWaypoint(0)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tour'
      setError(errorMessage)
      console.error('Error loading tour:', err)
    } finally {
      setIsLoading(false)
    }
  }, [finalConfig.saveProgressToLocalStorage, currentStep])
  
  /**
   * Navigate to a specific waypoint by index
   */
  const navigateToWaypoint = useCallback(async (waypointIndex: number) => {
    if (!currentTour || !tourProgress) {
      throw new Error('No active tour')
    }
    
    if (waypointIndex < 0 || waypointIndex >= currentTour.waypoints.length) {
      throw new Error('Invalid waypoint index')
    }
    
    const waypoint = currentTour.waypoints[waypointIndex]
    
    // Update URL without triggering full navigation
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('tourId', currentTour.id)
    newUrl.searchParams.set('step', waypointIndex.toString())
    window.history.pushState({}, '', newUrl.toString())
    
    // Update progress
    const updatedProgress: TourProgress = {
      ...tourProgress,
      currentWaypointId: waypoint.id,
      lastActiveAt: new Date().toISOString(),
    }
    
    // Mark waypoint as completed if moving forward
    if (!updatedProgress.completedWaypoints.includes(waypoint.id)) {
      updatedProgress.completedWaypoints.push(waypoint.id)
    }
    
    setTourProgress(updatedProgress)
    
    // Save progress
    if (finalConfig.saveProgressToLocalStorage) {
      localStorage.setItem(`tour_progress_${currentTour.id}`, JSON.stringify(updatedProgress))
    }
    
    // Track waypoint reached event
    trackEvent({
      type: 'waypoint_reached',
      tourId: currentTour.id,
      waypointId: waypoint.id,
      timestamp: new Date().toISOString(),
    })
    
    // Apply visual settings for this waypoint
    await applyWaypointVisualSettings(waypoint)
    
    // Update tour context for contextual intelligence
    await updateTourContext(waypoint)
    
    // Check for auto-progression conditions
    if (finalConfig.enableAutoProgress && autoProgressEnabled) {
      await checkAutoProgressionConditions(waypoint)
    }
    
  }, [currentTour, tourProgress, finalConfig.saveProgressToLocalStorage, autoProgressEnabled])
  
  /**
   * Move to the next waypoint
   */
  const nextWaypoint = useCallback(async () => {
    if (!currentTour) return
    
    const nextIndex = currentStep + 1
    if (nextIndex < currentTour.waypoints.length) {
      await navigateToWaypoint(nextIndex)
    } else {
      // Tour completed
      await completeTour()
    }
  }, [currentTour, currentStep, navigateToWaypoint])
  
  /**
   * Move to the previous waypoint
   */
  const previousWaypoint = useCallback(async () => {
    if (!finalConfig.allowBacktracking) {
      throw new Error('Backtracking is not allowed in this tour')
    }
    
    const previousIndex = currentStep - 1
    if (previousIndex >= 0) {
      await navigateToWaypoint(previousIndex)
    }
  }, [currentStep, finalConfig.allowBacktracking, navigateToWaypoint])
  
  /**
   * Skip the current waypoint
   */
  const skipWaypoint = useCallback(async (reason?: string) => {
    if (!finalConfig.allowSkipping) {
      throw new Error('Skipping is not allowed in this tour')
    }
    
    if (!currentTour || !tourProgress) return
    
    const currentWaypoint = currentTour.waypoints[currentStep]
    
    // Track skip event
    trackEvent({
      type: 'waypoint_skipped',
      tourId: currentTour.id,
      waypointId: currentWaypoint.id,
      reason,
      timestamp: new Date().toISOString(),
    })
    
    // Update progress
    const updatedProgress = {
      ...tourProgress,
      skippedWaypoints: [...tourProgress.skippedWaypoints, currentWaypoint.id],
    }
    setTourProgress(updatedProgress)
    
    // Move to next waypoint
    await nextWaypoint()
  }, [finalConfig.allowSkipping, currentTour, tourProgress, currentStep, nextWaypoint])
  
  /**
   * Complete the entire tour
   */
  const completeTour = useCallback(async () => {
    if (!currentTour || !tourProgress) return
    
    const completionTime = new Date().toISOString()
    const duration = new Date(completionTime).getTime() - new Date(tourProgress.startedAt).getTime()
    
    const finalProgress: TourProgress = {
      ...tourProgress,
      completed: true,
      completionTime,
    }
    
    setTourProgress(finalProgress)
    
    // Save final progress
    if (finalConfig.saveProgressToLocalStorage) {
      localStorage.setItem(`tour_progress_${currentTour.id}`, JSON.stringify(finalProgress))
    }
    
    // Track completion event
    trackEvent({
      type: 'tour_completed',
      tourId: currentTour.id,
      duration: Math.round(duration / 1000 / 60), // duration in minutes
      timestamp: completionTime,
    })
    
  }, [currentTour, tourProgress, finalConfig.saveProgressToLocalStorage])
  
  /**
   * Add a note for the current waypoint
   */
  const addNote = useCallback((content: string, tags?: string[]) => {
    if (!currentTour || !tourProgress) return
    
    const currentWaypoint = currentTour.waypoints[currentStep]
    const note: TourNote = {
      id: `note_${Date.now()}`,
      waypointId: currentWaypoint.id,
      content,
      createdAt: new Date().toISOString(),
      tags,
    }
    
    const updatedNotes = [...tourNotes, note]
    setTourNotes(updatedNotes)
    
    // Save notes
    if (finalConfig.saveProgressToLocalStorage) {
      localStorage.setItem(`tour_notes_${currentTour.id}`, JSON.stringify(updatedNotes))
    }
    
    // Track note event
    trackEvent({
      type: 'note_added',
      tourId: currentTour.id,
      waypointId: currentWaypoint.id,
      noteId: note.id,
      timestamp: new Date().toISOString(),
    })
    
    return note.id
  }, [currentTour, tourProgress, currentStep, tourNotes, finalConfig.saveProgressToLocalStorage])
  
  /**
   * Reset tour progress
   */
  const resetTour = useCallback(() => {
    if (!currentTour) return
    
    const newProgress = createNewProgress(currentTour)
    setTourProgress(newProgress)
    setTourNotes([])
    
    // Clear saved data
    if (finalConfig.saveProgressToLocalStorage) {
      localStorage.removeItem(`tour_progress_${currentTour.id}`)
      localStorage.removeItem(`tour_notes_${currentTour.id}`)
    }
    
    // Navigate to first waypoint
    navigateToWaypoint(0)
  }, [currentTour, finalConfig.saveProgressToLocalStorage, navigateToWaypoint])
  
  /**
   * Get tour session data for export/sharing
   */
  const getTourSession = useCallback((): TourSession | null => {
    if (!currentTour || !tourProgress) return null
    
    return {
      tour: currentTour,
      progress: tourProgress,
      mindmapState: {
        nodes: getNodes(),
        edges: getEdges(),
      },
      notes: tourNotes,
    }
  }, [currentTour, tourProgress, getNodes, getEdges, tourNotes])
  
  /**
   * Update tour context for enhanced contextual intelligence
   */
  const updateTourContext = useCallback(async (waypoint: any) => {
    if (!currentTour) return
    
    const currentNodes = getNodes()
    const graphContext = getGraphContext(currentNodes)
    
    // Determine historical progression
    const currentYear = new Date().getFullYear()
    let nextSuggestedPeriod = 'Modern Era'
    const chronologicalDirection: 'forward' | 'backward' | 'context-based' = 'forward'
    
    // Analyze current waypoint to suggest progression
    if (waypoint.contextRules?.temporalWindow) {
      const { startYear, endYear } = waypoint.contextRules.temporalWindow
      if (startYear && endYear) {
        if (endYear < 1960) {
          nextSuggestedPeriod = 'Government Investigation Era (1950-1970)'
        } else if (endYear < 1980) {
          nextSuggestedPeriod = 'Civilian Research Era (1970-1990)'
        } else if (endYear < 2010) {
          nextSuggestedPeriod = 'Modern Research Era (1990-2010)'
        } else {
          nextSuggestedPeriod = 'Disclosure Era (2010-Present)'
        }
      }
    }
    
    const updatedTourContext: GraphContext['tourContext'] = {
      tourId: currentTour.id,
      currentWaypointId: waypoint.id,
      waypointIndex: currentStep,
      tourMode,
      historicalProgression: {
        currentEra: waypoint.title || 'Unknown Era',
        nextSuggestedPeriod,
        chronologicalDirection
      },
      narrativeContext: waypoint.narrative || ''
    }
    
    setTourContext(updatedTourContext)
  }, [currentTour, currentStep, tourMode, getNodes])
  
  /**
   * Check conditions for automatic tour progression
   */
  const checkAutoProgressionConditions = useCallback(async (waypoint: any) => {
    if (!currentTour || !autoProgressEnabled) return
    
    const currentNodes = getNodes()
    const requiredActions = waypoint.userActions || []
    
    // Check if all required actions are completed
    let allActionsCompleted = true
    
    for (const action of requiredActions) {
      if (action.required) {
        switch (action.type) {
          case 'add_records':
            if (action.validation?.minRecords) {
              const addedNodes = currentNodes.filter(node => 
                node.data?.addedDuringTour && 
                node.data?.waypointId === waypoint.id
              )
              if (addedNodes.length < action.validation.minRecords) {
                allActionsCompleted = false
              }
            }
            break
          case 'explore_connections':
            // Check if user has explored enough connections
            const connections = currentNodes.filter(node => 
              node.data?.exploredDuringTour &&
              node.data?.waypointId === waypoint.id
            )
            if (connections.length === 0) {
              allActionsCompleted = false
            }
            break
        }
      }
    }
    
    // Auto-progress if conditions are met
    if (allActionsCompleted) {
      setTimeout(() => {
        nextWaypoint()
      }, 2000) // 2 second delay for user to review
    }
  }, [currentTour, autoProgressEnabled, getNodes, nextWaypoint])
  
  /**
   * Suggest next historical records based on tour context
   */
  const suggestNextHistoricalRecords = useCallback(async (waypoint: any, count: number = 3) => {
    if (!currentTour || !tourContext) return { nodes: [], edges: [] }
    
    const currentNodes = getNodes()
    const graphContext = getGraphContext(currentNodes)
    
    if (!graphContext) return { nodes: [], edges: [] }
    
    // Update graph context with tour information
    const enhancedContext: GraphContext = {
      ...graphContext,
      tourContext
    }
    
    // Generate tour-aware search rules
    const searchRules = generateTourAwareSearchRules(enhancedContext)
    
    // Determine what type of records to query based on waypoint context
    const targetTable = waypoint.dbRef?.type || 'events'
    
    // Create a contextual question for historical progression
    let question = `Show me ${count} ${targetTable} records that chronologically follow "${waypoint.title}"`
    
    if (tourContext.historicalProgression.chronologicalDirection === 'backward') {
      question = `Show me ${count} ${targetTable} records that preceded and led to "${waypoint.title}"`
    } else if (tourContext.historicalProgression.chronologicalDirection === 'context-based') {
      question = `Show me ${count} ${targetTable} records that are contextually related to "${waypoint.title}"`
    }
    
    // Create a dummy source node for the query
    const sourceNode = {
      id: `tour-${waypoint.id}-source`,
      type: 'tourWaypointNode',
      position: { x: 0, y: 0 },
      data: {
        title: waypoint.title,
        waypointId: waypoint.id,
        tourId: currentTour.id
      }
    }
    
    try {
      const result = await xataToXYFlow({
        question,
        table: targetTable,
        rules: searchRules,
        context: tourContext.narrativeContext,
        existingNodes: currentNodes,
        sourceNode,
        tourContext: {
          tourId: tourContext.tourId,
          waypointId: tourContext.currentWaypointId,
          tourMode: tourContext.tourMode,
          narrativeContext: tourContext.narrativeContext
        },
        historicalFilter: {
          mode: 'chronological',
          dateRange: waypoint.contextRules?.temporalWindow,
          significance: 'historically_important',
          progression: tourContext.historicalProgression.chronologicalDirection
        }
      })
      
      return result
    } catch (error) {
      console.error('Error suggesting next historical records:', error)
      return { nodes: [], edges: [] }
    }
  }, [currentTour, tourContext, getNodes])
  
  /**
   * Toggle between guided and free-form tour modes
   */
  const toggleTourMode = useCallback(() => {
    const newMode = tourMode === 'guided' ? 'free-form' : 'guided'
    setTourMode(newMode)
    
    if (tourContext) {
      setTourContext({
        ...tourContext,
        tourMode: newMode
      })
    }
    
    // Track mode change
    if (currentTour) {
      trackEvent({
        type: 'tour_mode_changed' as any,
        tourId: currentTour.id,
        waypointId: tourContext?.currentWaypointId || '',
        newMode,
        timestamp: new Date().toISOString(),
      })
    }
  }, [tourMode, tourContext, currentTour])
  
  /**
   * Add a waypoint-specific node during tour
   */
  const addTourNode = useCallback(async (nodeData: any, waypointId: string) => {
    if (!currentTour) return null
    
    const currentNodes = getNodes()
    const newNode = {
      id: `tour-${waypointId}-${Date.now()}`,
      type: 'enhancedEntityNodePOC',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        ...nodeData,
        addedDuringTour: true,
        waypointId,
        tourId: currentTour.id
      }
    }
    
    addNodes([newNode])
    
    // Track node addition
    trackEvent({
      type: 'node_added',
      tourId: currentTour.id,
      waypointId,
      nodeId: newNode.id,
      nodeType: newNode.type,
      timestamp: new Date().toISOString(),
    })
    
    return newNode
  }, [currentTour, getNodes, addNodes])
  
  /**
   * Validate tour completion readiness
   */
  const validateTourCompletion = useCallback(() => {
    if (!currentTour || !tourProgress) return { ready: false, issues: [] }
    
    const issues: string[] = []
    
    // Check if all required waypoints have been visited
    const requiredWaypoints = currentTour.waypoints.filter(w => 
      !w.userActions?.some(action => !action.required)
    )
    
    const unvisitedRequired = requiredWaypoints.filter(w => 
      !tourProgress.completedWaypoints.includes(w.id)
    )
    
    if (unvisitedRequired.length > 0) {
      issues.push(`${unvisitedRequired.length} required waypoints not visited`)
    }
    
    // Check if minimum notes/interactions were achieved
    if (tourNotes.length === 0) {
      issues.push('No tour notes recorded - consider adding reflections')
    }
    
    return {
      ready: issues.length === 0,
      issues
    }
  }, [currentTour, tourProgress, tourNotes])

  // Helper functions
  const createNewProgress = (tour: TourDefinition): TourProgress => ({
    tourId: tour.id,
    currentWaypointId: tour.waypoints[0]?.id || '',
    completedWaypoints: [],
    skippedWaypoints: [],
    userAddedNodes: [],
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    completed: false,
  })
  
  const trackEvent = (event: TourEvent) => {
    tourEvents.current.push(event)
    
    if (finalConfig.analyticsEnabled) {
      // Here you could send events to analytics service
      console.log('Tour Event:', event)
    }
  }
  
  const applyWaypointVisualSettings = async (waypoint: any) => {
    // Apply visual settings like camera position, highlights, etc.
    // This would integrate with the mindmap visualization
    if (waypoint.visualSettings?.cameraPosition) {
      // Apply camera positioning
    }
    
    if (waypoint.visualSettings?.highlightNodes) {
      // Highlight specific nodes
    }
  }
  
  // Current waypoint computed value
  const currentWaypoint = currentTour?.waypoints[currentStep] || null
  
  // Progress calculations
  const progressPercentage = currentTour 
    ? (tourProgress?.completedWaypoints.length || 0) / currentTour.waypoints.length * 100
    : 0
  
  const canGoNext = currentTour ? currentStep < currentTour.waypoints.length - 1 : false
  const canGoPrevious = finalConfig.allowBacktracking && currentStep > 0
  const canSkip = finalConfig.allowSkipping && !tourProgress?.completed
  
  return {
    // State
    currentTour,
    currentWaypoint,
    tourProgress,
    tourNotes,
    isLoading,
    error,
    
    // Enhanced tour state
    tourContext,
    tourMode,
    autoProgressEnabled,
    
    // Progress info
    currentStep,
    totalSteps: currentTour?.waypoints.length || 0,
    progressPercentage,
    
    // Navigation capabilities
    canGoNext,
    canGoPrevious,
    canSkip,
    
    // Actions
    loadTour,
    navigateToWaypoint,
    nextWaypoint,
    previousWaypoint,
    skipWaypoint,
    completeTour,
    resetTour,
    addNote,
    
    // Enhanced tour actions
    suggestNextHistoricalRecords,
    toggleTourMode,
    addTourNode,
    validateTourCompletion,
    setAutoProgressEnabled,
    
    // Data access
    getTourSession,
    tourEvents: tourEvents.current,
    
    // Config
    config: finalConfig,
  }
}