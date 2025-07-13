/**
 * Hook for Famous Events Chronological Tour
 * Integrates with existing tour infrastructure and universal agent tools
 */

import { useState, useEffect, useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useTour } from './use-tour'
import { useSharedAI } from '../../ai-context/shared-ai-context'
import { FamousEventsChronologicalTour } from '../implementations/famous-events-tour-implementation'
import { createAgentToolRegistry, executeAgentTool } from '../../tools/ultraterrestrial-agent-tools'
import type { AgentExecutionContext, UltraterrestrialAgentTools } from '../../tools/ultraterrestrial-agent-tools'
import type { Tour, TourWaypoint } from '../types/tour-types'

export function useFamousEventsTour() {
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow()
  const { handleAIQuery } = useSharedAI()
  const baseTour = useTour()
  
  const [tour, setTour] = useState<Tour | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0)
  const [tourAgent, setTourAgent] = useState<FamousEventsChronologicalTour | null>(null)

  // Initialize the famous events tour
  const initializeFamousEventsTour = useCallback(async () => {
    setIsLoading(true)
    try {
      // Create execution context
      const context: AgentExecutionContext = {
        sessionId: `famous-events-tour-${Date.now()}`,
        agentId: 'famous-events-chronological-tour',
        currentMindmapState: {
          nodes: getNodes(),
          edges: getEdges()
        },
        conversationHistory: [],
        userPreferences: {
          preferredDepth: 'detailed',
          layoutPreference: 'horizontal',
          historicalFocus: true,
          expertiseLevel: 'intermediate'
        },
        performanceMetrics: {
          totalQueries: 0,
          averageResponseTime: 0,
          successRate: 1,
          nodesCreated: 0,
          edgesCreated: 0
        }
      }

      // Create mock agent tools (in production, these would be real implementations)
      const agentTools: UltraterrestrialAgentTools = {
        searchDatabase: async (params) => {
          // Use the AI query handler for database search
          const result = await handleAIQuery(params.query, {
            table: params.table,
            searchDepth: params.searchDepth
          })
          
          return {
            success: true,
            message: 'Database search completed',
            searchResults: {
              records: result.records || [],
              answer: result.answer || '',
              sessionId: context.sessionId,
              totalResults: result.records?.length || 0,
              query: params.query,
              table: params.table,
              confidence: 0.85
            },
            entityAnalysis: {
              primaryEntities: [],
              relationships: [],
              temporalContext: {
                chronologicalOrder: true,
                historicalSignificance: 0.8
              }
            }
          }
        },
        
        transformToGraph: async (params) => {
          // Transform records to graph nodes
          const nodes = params.records.map((record, index) => ({
            id: record.id || `node-${Date.now()}-${index}`,
            type: 'enhancedEntityNodePOC',
            position: { x: index * 200, y: 0 },
            data: record
          }))
          
          return {
            success: true,
            message: 'Graph transformation completed',
            graphData: {
              nodes,
              edges: [],
              layout: {
                type: params.layoutType,
                applied: true,
                nodePositions: {}
              }
            },
            transformationMeta: {
              sourceRecords: params.records.length,
              successfulTransformations: params.records.length,
              layoutOptimizations: ['chronological'],
              enhancementLevel: 1
            }
          }
        },
        
        searchExternalResources: async (params) => ({
          success: true,
          message: 'External resource search completed',
          ragResults: {
            relevantResources: [],
            synthesizedInsights: 'Historical context retrieved',
            additionalContext: [],
            confidenceLevel: 0.75
          },
          integration: {
            potentialConnections: [],
            suggestedQueries: [],
            expertiseAreas: []
          }
        }),
        
        analyzeHistoricalContext: async (params) => ({
          success: true,
          message: 'Historical analysis completed',
          historicalContext: {
            timelinePosition: {
              year: new Date().getFullYear(),
              period: 'disclosure_era',
              significance: 0.9
            },
            precedingEvents: [],
            subsequentEvents: [],
            contextualFactors: []
          },
          narrativeElements: {
            thematicConnections: [],
            causalRelationships: [],
            parallelsWithOtherEvents: [],
            disclosureSignificance: 0.85
          }
        }),
        
        analyzeNarrativeContext: async (params) => ({
          success: true,
          message: 'Narrative context analyzed',
          narrativeContext: {
            disclosureNarrative: {
              currentPhase: 'disclosure',
              historicalProgression: {
                era: 'Disclosure Era',
                startYear: 2010,
                endYear: 2025,
                nextSuggestedYear: 2026,
                rationale: 'Continue exploring current disclosure developments'
              },
              significantEvents: ['Pentagon UAP videos', 'Congressional hearings']
            },
            contextualIntelligence: {
              seedRecord: params.narrativeQuery,
              relatedEntities: {
                personnel: [],
                organizations: ['Pentagon', 'AARO'],
                topics: ['disclosure', 'transparency']
              },
              temporalBounds: {
                earliest: '2010-01-01',
                latest: '2025-12-31'
              }
            }
          },
          relatedRecords: {
            records: [],
            contextualRelevance: [],
            searchRules: 'Focus on disclosure era events',
            totalCandidates: 0
          },
          suggestedNextActions: [
            'Explore related military encounters',
            'Investigate congressional testimony',
            'Review declassified documents'
          ]
        })
      }

      // Create tour agent
      const agent = new FamousEventsChronologicalTour(agentTools, context)
      setTourAgent(agent)

      // Initialize the tour
      const famousTour = await agent.initializeTour()
      setTour(famousTour)

      // Load first waypoint into the mindmap
      if (famousTour.waypoints.length > 0) {
        await loadWaypointIntoMindmap(famousTour.waypoints[0])
      }

    } catch (error) {
      console.error('Failed to initialize famous events tour:', error)
    } finally {
      setIsLoading(false)
    }
  }, [getNodes, getEdges, handleAIQuery])

  // Load a waypoint into the mindmap
  const loadWaypointIntoMindmap = useCallback(async (waypoint: TourWaypoint) => {
    // Create node for the waypoint
    const waypointNode = {
      id: waypoint.id,
      type: 'enhancedEntityNodePOC',
      position: waypoint.position,
      data: {
        ...waypoint,
        tourContext: {
          tourId: 'famous-events-chronological',
          tourMode: 'guided' as const,
          waypointId: waypoint.id,
          waypointIndex: currentWaypointIndex,
          isCurrentWaypoint: true
        }
      }
    }

    // Update nodes
    setNodes(nodes => [...nodes.filter(n => n.id !== waypoint.id), waypointNode])
    
    // Fit view to show the new waypoint
    setTimeout(() => {
      fitView({ nodes: [waypointNode], duration: 800 })
    }, 100)
  }, [currentWaypointIndex, setNodes, fitView])

  // Navigate to next waypoint
  const navigateToNextWaypoint = useCallback(async () => {
    if (!tour || !tourAgent || currentWaypointIndex >= tour.waypoints.length - 1) {
      return
    }

    setIsLoading(true)
    try {
      const currentWaypoint = tour.waypoints[currentWaypointIndex]
      const result = await tourAgent.progressToNextWaypoint(currentWaypoint.id)
      
      if (result.nextWaypoint) {
        setCurrentWaypointIndex(prev => prev + 1)
        await loadWaypointIntoMindmap(result.nextWaypoint)
        
        // Add related records as additional nodes if any
        if (result.relatedRecords.length > 0) {
          const relatedNodes = result.relatedRecords.slice(0, 3).map((record, index) => ({
            id: record.id || `related-${Date.now()}-${index}`,
            type: 'entityNode',
            position: {
              x: result.nextWaypoint.position.x + (index + 1) * 150,
              y: result.nextWaypoint.position.y + 100
            },
            data: record
          }))
          
          setNodes(nodes => [...nodes, ...relatedNodes])
        }
      }
    } catch (error) {
      console.error('Failed to navigate to next waypoint:', error)
    } finally {
      setIsLoading(false)
    }
  }, [tour, tourAgent, currentWaypointIndex, loadWaypointIntoMindmap, setNodes])

  // Navigate to previous waypoint
  const navigateToPreviousWaypoint = useCallback(async () => {
    if (!tour || currentWaypointIndex <= 0) {
      return
    }

    const prevIndex = currentWaypointIndex - 1
    setCurrentWaypointIndex(prevIndex)
    await loadWaypointIntoMindmap(tour.waypoints[prevIndex])
  }, [tour, currentWaypointIndex, loadWaypointIntoMindmap])

  // Get tour progress
  const getTourProgress = useCallback(() => {
    if (!tour) return { current: 0, total: 0, percentage: 0 }
    
    return {
      current: currentWaypointIndex + 1,
      total: tour.waypoints.length,
      percentage: ((currentWaypointIndex + 1) / tour.waypoints.length) * 100
    }
  }, [tour, currentWaypointIndex])

  return {
    // Tour state
    tour,
    isLoading,
    currentWaypoint: tour?.waypoints[currentWaypointIndex] || null,
    tourProgress: getTourProgress(),
    
    // Tour actions
    initializeTour: initializeFamousEventsTour,
    navigateNext: navigateToNextWaypoint,
    navigatePrevious: navigateToPreviousWaypoint,
    
    // Base tour functionality
    ...baseTour
  }
}