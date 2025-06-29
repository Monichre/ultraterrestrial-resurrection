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
    
  }, [currentTour, tourProgress, finalConfig.saveProgressToLocalStorage])
  
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
    
    // Data access
    getTourSession,
    tourEvents: tourEvents.current,
    
    // Config
    config: finalConfig,
  }
}