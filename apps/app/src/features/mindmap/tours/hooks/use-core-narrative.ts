'use client'

import { useState, useCallback } from 'react'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { xataToXYFlow } from '@/features/mindmap/actions/xata-to-xyflow'
import type { 
  CoreNarrativeTour, 
  NarrativeEvent, 
  CoreNarrativeProgress 
} from '../types/core-narrative'
import { CORE_UFO_NARRATIVE } from '../types/core-narrative'

/**
 * Simple hook for managing the core UFO narrative tour
 * Loads events sequentially and generates network connections
 */
export const useCoreNarrative = () => {
  const { addNodes, addEdges, getNodes } = useMindMap()
  
  const [currentTour] = useState<CoreNarrativeTour>(CORE_UFO_NARRATIVE)
  const [progress, setProgress] = useState<CoreNarrativeProgress>({
    tourId: CORE_UFO_NARRATIVE.id,
    currentEventIndex: 0,
    completedEvents: [],
    startedAt: new Date().toISOString()
  })
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Start the core narrative tour
   */
  const startTour = useCallback(async () => {
    setIsLoading(true)
    try {
      // Load the first event (Roswell)
      await loadEvent(0)
    } catch (error) {
      console.error('Failed to start tour:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Load a specific event and its related entities
   */
  const loadEvent = useCallback(async (eventIndex: number) => {
    if (eventIndex >= currentTour.events.length) {
      console.log('Tour completed!')
      return
    }

    const event = currentTour.events[eventIndex]
    setIsLoading(true)

    try {
      // Load the main event
      const eventQuery = `Find the ${event.title} event from ${event.year}`
      
      const eventResult = await xataToXYFlow({
        question: eventQuery,
        table: 'events',
        rules: [`Focus on the specific event: ${event.title} from ${event.year}`],
        context: `Loading core narrative event: ${event.title}. ${event.description}`,
        existingNodes: getNodes(),
        sourceNode: {
          id: `narrative-${event.id}`,
          type: 'userInputNode',
          position: { x: eventIndex * 400, y: 0 },
          data: {
            input: event.title,
            description: event.description,
            year: event.year
          }
        },
        layoutType: 'horizontal'
      })

      if (eventResult.nodes) {
        addNodes(eventResult.nodes)
      }
      if (eventResult.edges) {
        addEdges(eventResult.edges)
      }

      // Load related entities based on the event configuration
      if (event.loadRelated.personnel) {
        await loadRelatedEntities('personnel', event, eventIndex)
      }
      if (event.loadRelated.organizations) {
        await loadRelatedEntities('organizations', event, eventIndex)
      }
      if (event.loadRelated.documents) {
        await loadRelatedEntities('documents', event, eventIndex)
      }
      if (event.loadRelated.topics) {
        await loadRelatedEntities('topics', event, eventIndex)
      }

      // Update progress
      setProgress(prev => ({
        ...prev,
        currentEventIndex: eventIndex,
        completedEvents: [...prev.completedEvents, event.id]
      }))

    } catch (error) {
      console.error(`Failed to load event ${event.title}:`, error)
    } finally {
      setIsLoading(false)
    }
  }, [currentTour, addNodes, addEdges, getNodes])

  /**
   * Load related entities for a specific event
   */
  const loadRelatedEntities = useCallback(async (
    entityType: string, 
    event: NarrativeEvent, 
    eventIndex: number
  ) => {
    try {
      const relatedQuery = `Find ${entityType} related to ${event.title} from ${event.year}`
      
      const relatedResult = await xataToXYFlow({
        question: relatedQuery,
        table: entityType,
        rules: [
          `Focus on ${entityType} directly connected to ${event.title}`,
          `Prioritize key figures and organizations involved in the ${event.year} timeframe`,
          'Include both primary participants and subsequent investigators'
        ],
        context: `Finding ${entityType} related to the core narrative event: ${event.title}`,
        existingNodes: getNodes(),
        sourceNode: {
          id: `narrative-${event.id}-${entityType}`,
          type: 'userInputNode',
          position: { x: eventIndex * 400, y: 200 },
          data: {
            input: `${entityType} related to ${event.title}`,
            parentEvent: event.id
          }
        },
        layoutType: 'radial'
      })

      if (relatedResult.nodes) {
        addNodes(relatedResult.nodes)
      }
      if (relatedResult.edges) {
        addEdges(relatedResult.edges)
      }
    } catch (error) {
      console.error(`Failed to load ${entityType} for ${event.title}:`, error)
    }
  }, [addNodes, addEdges, getNodes])

  /**
   * Move to the next event in the narrative
   */
  const nextEvent = useCallback(async () => {
    const nextIndex = progress.currentEventIndex + 1
    await loadEvent(nextIndex)
  }, [progress.currentEventIndex, loadEvent])

  /**
   * Move to the previous event in the narrative
   */
  const previousEvent = useCallback(async () => {
    if (progress.currentEventIndex > 0) {
      const prevIndex = progress.currentEventIndex - 1
      await loadEvent(prevIndex)
    }
  }, [progress.currentEventIndex, loadEvent])

  // Current event info
  const currentEvent = currentTour.events[progress.currentEventIndex]
  const isFirstEvent = progress.currentEventIndex === 0
  const isLastEvent = progress.currentEventIndex === currentTour.events.length - 1
  const progressPercentage = (progress.currentEventIndex / currentTour.events.length) * 100

  return {
    // Tour data
    currentTour,
    currentEvent,
    progress,
    
    // Status
    isLoading,
    isFirstEvent,
    isLastEvent,
    progressPercentage,
    
    // Actions
    startTour,
    loadEvent,
    nextEvent,
    previousEvent,
    
    // Computed values
    totalEvents: currentTour.events.length,
    currentEventIndex: progress.currentEventIndex,
    completedEventsCount: progress.completedEvents.length
  }
}