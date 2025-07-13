/**
 * Testing Framework for Agentic Tour Tools
 * Phase 1: Initial testing framework for tool functionality
 * 
 * Created: July 12, 2025
 * Purpose: Validate tool implementations and agent behavior
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import type { Node, Edge } from '@xyflow/react'
import { HistoricalTourToolsImplementation } from '../tour-tools-implementation'
import { ChronologicalTourAgent, createChronologicalTourAgent } from '../agents/chronological-tour-agent'
import type { ToolExecutionContext } from '../tour-navigation-tools'

// Mock external dependencies
vi.mock('@/lib/xata', () => ({
  xata: {
    db: {
      events: {
        filter: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        getAll: vi.fn().mockResolvedValue([]),
        read: vi.fn().mockResolvedValue(null)
      }
    }
  }
}))

vi.mock('@/features/mindmap/utils/contextual-intelligence', () => ({
  getGraphContext: vi.fn().mockReturnValue({
    entities: [],
    relationships: [],
    temporal: { earliest: 1940, latest: 2024 }
  })
}))

// Mock tour controller
const mockTourController = {
  currentWaypointIndex: 0,
  waypoints: [
    {
      id: 'roswell-1947',
      title: 'Roswell Incident',
      dbRef: { type: 'events', id: 'roswell-event' },
      narrative: 'The famous Roswell incident of 1947',
      contextRules: {},
      visualSettings: {}
    },
    {
      id: 'blue-book-1952',
      title: 'Project Blue Book',
      dbRef: { type: 'events', id: 'blue-book-event' },
      narrative: 'Launch of Project Blue Book investigation',
      contextRules: {},
      visualSettings: {}
    }
  ],
  currentTour: { id: 'famous-events-tour' },
  nodes: [] as Node[],
  edges: [] as Edge[],
  enhancementLevel: {
    spatialIntelligence: 0.8,
    narrativeFlow: 0.7,
    overallEnhancement: 0.75
  },
  navigateToWaypoint: vi.fn().mockResolvedValue(true),
  applyIntelligentLayout: vi.fn().mockResolvedValue(true)
}

// Mock spatial grouping
const mockSpatialGrouping = {
  spatialGroups: [
    {
      id: 'group-1',
      entities: ['roswell-event', 'blue-book-event'],
      theme: 'early-investigations',
      significance: 0.9
    }
  ],
  createNarrativeGroup: vi.fn().mockResolvedValue(true)
}

// Test execution context
const testContext: ToolExecutionContext = {
  sessionId: 'test-session-123',
  userId: 'test-user',
  tourId: 'famous-events-tour',
  currentWaypointId: 'roswell-1947',
  contextHistory: [],
  userPreferences: {
    preferred_depth: 'detailed',
    narrative_style: 'storytelling',
    interaction_pattern: 'explorer'
  },
  performanceMetrics: {
    toolCallCount: 0,
    averageResponseTime: 0,
    successRate: 1
  }
}

describe('Tour Tools Implementation', () => {
  let tools: HistoricalTourToolsImplementation
  
  beforeEach(() => {
    vi.clearAllMocks()
    tools = new HistoricalTourToolsImplementation(
      mockTourController as any,
      mockSpatialGrouping as any,
      { ...testContext }
    )
  })
  
  describe('navigate_historical_tour', () => {
    it('should navigate forward successfully', async () => {
      const params = {
        direction: 'forward' as const,
        depth_level: 'detailed' as const
      }
      
      const result = await tools.navigate_historical_tour(params)
      
      expect(result.success).toBe(true)
      expect(result.newState.currentWaypointId).toBe('blue-book-1952')
      expect(result.tourContext.currentIndex).toBe(1)
      expect(mockTourController.navigateToWaypoint).toHaveBeenCalledWith(1)
    })
    
    it('should navigate backward successfully', async () => {
      mockTourController.currentWaypointIndex = 1
      
      const params = {
        direction: 'backward' as const,
        depth_level: 'overview' as const
      }
      
      const result = await tools.navigate_historical_tour(params)
      
      expect(result.success).toBe(true)
      expect(result.newState.currentWaypointId).toBe('roswell-1947')
      expect(result.tourContext.currentIndex).toBe(0)
      expect(mockTourController.navigateToWaypoint).toHaveBeenCalledWith(0)
    })
    
    it('should jump to specific period', async () => {
      const params = {
        direction: 'jump_to_period' as const,
        target_period: 'early_sightings' as const,
        narrative_focus: 'government_response',
        depth_level: 'comprehensive' as const
      }
      
      const result = await tools.navigate_historical_tour(params)
      
      expect(result.success).toBe(true)
      expect(mockSpatialGrouping.createNarrativeGroup).toHaveBeenCalledWith('government_response')
    })
    
    it('should handle navigation errors gracefully', async () => {
      mockTourController.navigateToWaypoint.mockRejectedValueOnce(new Error('Navigation failed'))
      
      const params = {
        direction: 'forward' as const
      }
      
      const result = await tools.navigate_historical_tour(params)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Navigation failed')
      expect(result.suggestedNextActions).toContain('Check tool parameters for validity')
    })
  })
  
  describe('discover_related_entities', () => {
    it('should discover entities with basic parameters', async () => {
      const params = {
        current_context: 'Roswell incident 1947',
        entity_types: ['events', 'personnel'] as const,
        relationship_depth: 1 as const
      }
      
      const result = await tools.discover_related_entities(params)
      
      expect(result.success).toBe(true)
      expect(result.entities).toBeDefined()
      expect(result.relationshipNetwork).toBeDefined()
      expect(result.relationshipNetwork.nodes).toEqual([])
      expect(result.relationshipNetwork.edges).toEqual([])
      expect(result.relationshipNetwork.clusters).toEqual([])
    })
    
    it('should handle temporal windows correctly', async () => {
      const params = {
        current_context: 'Cold War UFO investigations',
        entity_types: ['events', 'organizations', 'documents'] as const,
        relationship_depth: 2 as const,
        temporal_window: {
          years_before: 5,
          years_after: 10
        }
      }
      
      const result = await tools.discover_related_entities(params)
      
      expect(result.success).toBe(true)
      expect(result.suggestedNextActions).toContain('Analyze relationships between discovered entities')
    })
  })
  
  describe('analyze_temporal_context', () => {
    it('should analyze significance correctly', async () => {
      const params = {
        time_period: { start_year: 1947, end_year: 1952 },
        analysis_type: 'significance' as const,
        focus_entities: ['roswell-event', 'blue-book-event']
      }
      
      const result = await tools.analyze_temporal_context(params)
      
      expect(result.success).toBe(true)
      expect(result.analysis.timePeriod).toEqual(params.time_period)
      expect(result.analysis.significance.overallImportance).toBe(0.8)
      expect(result.analysis.connections).toBeDefined()
      expect(result.analysis.gaps).toBeDefined()
    })
    
    it('should handle different analysis types', async () => {
      const analysisTypes = ['significance', 'connections', 'progression', 'gaps'] as const
      
      for (const analysisType of analysisTypes) {
        const params = {
          time_period: { start_year: 1950, end_year: 1970 },
          analysis_type: analysisType
        }
        
        const result = await tools.analyze_temporal_context(params)
        
        expect(result.success).toBe(true)
        expect(result.message).toContain(analysisType)
      }
    })
  })
  
  describe('create_narrative_bridge', () => {
    it('should create evolution bridge successfully', async () => {
      const params = {
        from_period: 'Roswell incident',
        to_period: 'Pentagon UAP disclosures',
        bridge_type: 'evolution' as const,
        evidence_threshold: 0.7
      }
      
      const result = await tools.create_narrative_bridge(params)
      
      expect(result.success).toBe(true)
      expect(result.bridge.fromPeriod).toBe(params.from_period)
      expect(result.bridge.toPeriod).toBe(params.to_period)
      expect(result.bridge.bridgeType).toBe(params.bridge_type)
      expect(result.bridge.evidenceStrength).toBe(0.8)
      expect(result.bridge.confidenceLevel).toBe(0.7)
      expect(result.storyline.acts).toEqual([])
    })
    
    it('should handle different bridge types', async () => {
      const bridgeTypes = ['causal', 'parallel', 'context', 'evolution'] as const
      
      for (const bridgeType of bridgeTypes) {
        const params = {
          from_period: 'Early sightings',
          to_period: 'Modern research',
          bridge_type: bridgeType,
          evidence_threshold: 0.5
        }
        
        const result = await tools.create_narrative_bridge(params)
        
        expect(result.success).toBe(true)
        expect(result.bridge.bridgeType).toBe(bridgeType)
      }
    })
  })
  
  describe('spatial_intelligence_query', () => {
    it('should analyze proximity successfully', async () => {
      const params = {
        query_type: 'proximity' as const,
        target_entities: ['roswell-event', 'blue-book-event'],
        optimization_goal: 'discovery' as const
      }
      
      const result = await tools.spatial_intelligence_query(params)
      
      expect(result.success).toBe(true)
      expect(result.spatialAnalysis.proximityGroups).toEqual([])
      expect(result.spatialAnalysis.narrativeFlow).toBeDefined()
      expect(result.spatialAnalysis.optimizationSuggestions).toEqual([])
    })
    
    it('should handle different query types', async () => {
      const queryTypes = ['proximity', 'clustering', 'narrative_flow', 'temporal_alignment'] as const
      
      for (const queryType of queryTypes) {
        const params = {
          query_type: queryType,
          optimization_goal: 'comprehension' as const
        }
        
        const result = await tools.spatial_intelligence_query(params)
        
        expect(result.success).toBe(true)
        expect(result.message).toContain(queryType)
      }
    })
  })
  
  describe('error handling', () => {
    it('should handle tool errors gracefully', () => {
      const error = new Error('Test error')
      const params = { test: 'parameter' }
      
      const result = tools.handleToolError('test_tool', error, params)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Test error')
      expect(result.suggestedNextActions).toContain('Check tool parameters for validity')
    })
  })
  
  describe('state management', () => {
    it('should get current state correctly', () => {
      const state = tools.getCurrentState()
      
      expect(state.tourId).toBe('famous-events-tour')
      expect(state.currentWaypointIndex).toBe(0)
      expect(state.totalWaypoints).toBe(2)
      expect(state.nodes).toEqual([])
      expect(state.edges).toEqual([])
      expect(state.spatialGroups).toHaveLength(1)
      expect(state.enhancementLevel).toEqual({
        spatialIntelligence: 0.8,
        narrativeFlow: 0.7,
        overallEnhancement: 0.75
      })
    })
  })
})

describe('Chronological Tour Agent', () => {
  let agent: ChronologicalTourAgent
  let tools: HistoricalTourToolsImplementation
  
  beforeEach(() => {
    tools = new HistoricalTourToolsImplementation(
      mockTourController as any,
      mockSpatialGrouping as any,
      { ...testContext }
    )
    agent = new ChronologicalTourAgent(tools, { ...testContext })
  })
  
  describe('executeAction', () => {
    it('should execute navigation action successfully', async () => {
      const action = {
        type: 'navigate' as const,
        params: {
          direction: 'forward' as const,
          depth_level: 'detailed' as const
        }
      }
      
      const result = await agent.executeAction(action)
      
      expect(result.success).toBe(true)
      expect(result.action).toEqual(action)
      expect(result.duration).toBeGreaterThan(0)
      expect(result.userMessage).toContain('Navigated to')
      expect(result.nextSuggestedAction).toBeDefined()
    })
    
    it('should execute discovery action successfully', async () => {
      const action = {
        type: 'discover' as const,
        params: {
          current_context: 'Test context',
          entity_types: ['events'] as const,
          relationship_depth: 1 as const
        }
      }
      
      const result = await agent.executeAction(action)
      
      expect(result.success).toBe(true)
      expect(result.userMessage).toContain('Discovered')
    })
    
    it('should handle action failures gracefully', async () => {
      mockTourController.navigateToWaypoint.mockRejectedValueOnce(new Error('Navigation failed'))
      
      const action = {
        type: 'navigate' as const,
        params: {
          direction: 'forward' as const
        }
      }
      
      const result = await agent.executeAction(action)
      
      expect(result.success).toBe(false)
      expect(result.errorMessage).toBe('Navigation failed')
    })
  })
  
  describe('executeActionSequence', () => {
    it('should execute sequence successfully', async () => {
      const actions = [
        {
          type: 'navigate' as const,
          params: { direction: 'forward' as const }
        },
        {
          type: 'discover' as const,
          params: {
            current_context: 'Test',
            entity_types: ['events'] as const,
            relationship_depth: 1 as const
          }
        }
      ]
      
      const results = await agent.executeActionSequence(actions)
      
      expect(results).toHaveLength(2)
      expect(results[0].success).toBe(true)
      expect(results[1].success).toBe(true)
    })
    
    it('should stop sequence on failure', async () => {
      mockTourController.navigateToWaypoint.mockRejectedValueOnce(new Error('First action failed'))
      
      const actions = [
        {
          type: 'navigate' as const,
          params: { direction: 'forward' as const }
        },
        {
          type: 'discover' as const,
          params: {
            current_context: 'Test',
            entity_types: ['events'] as const,
            relationship_depth: 1 as const
          }
        }
      ]
      
      const results = await agent.executeActionSequence(actions)
      
      expect(results).toHaveLength(1)
      expect(results[0].success).toBe(false)
    })
  })
  
  describe('state management', () => {
    it('should track agent state correctly', async () => {
      const initialState = agent.getState()
      
      expect(initialState.currentPosition.tourId).toBeNull()
      expect(initialState.explorationHistory.visitedWaypoints).toEqual([])
      expect(initialState.performance.successfulActions).toBe(0)
      
      // Execute an action
      const action = {
        type: 'navigate' as const,
        params: { direction: 'forward' as const }
      }
      
      await agent.executeAction(action)
      
      const updatedState = agent.getState()
      expect(updatedState.performance.successfulActions).toBe(1)
      expect(updatedState.explorationHistory.visitedWaypoints).toContain('blue-book-1952')
    })
    
    it('should reset state correctly', () => {
      agent.updateState({
        performance: { successfulActions: 5, failedActions: 1, averageActionTime: 100, userSatisfactionScore: 0.8 }
      })
      
      agent.reset()
      
      const state = agent.getState()
      expect(state.performance.successfulActions).toBe(0)
      expect(state.performance.failedActions).toBe(0)
    })
  })
  
  describe('factory function', () => {
    it('should create agent with custom configuration', () => {
      const customAgent = createChronologicalTourAgent(tools, testContext, {
        userExpertise: 'expert',
        preferredPace: 'fast',
        interestAreas: ['disclosure', 'military']
      })
      
      const state = customAgent.getState()
      expect(state.userContext.expertiseLevel).toBe('expert')
      expect(state.userContext.preferredPace).toBe('fast')
      expect(state.userContext.interestAreas).toEqual(['disclosure', 'military'])
    })
  })
})

describe('Tool Performance', () => {
  let tools: HistoricalTourToolsImplementation
  
  beforeEach(() => {
    tools = new HistoricalTourToolsImplementation(
      mockTourController as any,
      mockSpatialGrouping as any,
      { ...testContext }
    )
  })
  
  it('should complete navigation within performance threshold', async () => {
    const startTime = performance.now()
    
    const result = await tools.navigate_historical_tour({
      direction: 'forward'
    })
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    expect(result.success).toBe(true)
    expect(duration).toBeLessThan(200) // 200ms threshold as per requirements
  })
  
  it('should handle multiple concurrent tool calls', async () => {
    const promises = [
      tools.navigate_historical_tour({ direction: 'forward' }),
      tools.discover_related_entities({
        current_context: 'Test',
        entity_types: ['events'],
        relationship_depth: 1
      }),
      tools.spatial_intelligence_query({
        query_type: 'proximity',
        optimization_goal: 'discovery'
      })
    ]
    
    const results = await Promise.all(promises)
    
    expect(results).toHaveLength(3)
    expect(results.every(r => r.success)).toBe(true)
  })
})

describe('Integration Tests', () => {
  it('should integrate tools with agent for complete workflow', async () => {
    const tools = new HistoricalTourToolsImplementation(
      mockTourController as any,
      mockSpatialGrouping as any,
      { ...testContext }
    )
    
    const agent = createChronologicalTourAgent(tools, testContext, {
      userExpertise: 'intermediate',
      preferredPace: 'normal',
      interestAreas: ['roswell', 'disclosure']
    })
    
    // Execute a typical exploration sequence
    const navigationResult = await agent.executeAction({
      type: 'navigate',
      params: {
        direction: 'jump_to_period',
        target_period: 'early_sightings',
        depth_level: 'detailed'
      }
    })
    
    expect(navigationResult.success).toBe(true)
    
    const discoveryResult = await agent.executeAction({
      type: 'discover',
      params: {
        current_context: 'Early UFO sightings',
        entity_types: ['events', 'personnel'],
        relationship_depth: 2
      }
    })
    
    expect(discoveryResult.success).toBe(true)
    
    const analysisResult = await agent.executeAction({
      type: 'analyze',
      params: {
        time_period: { start_year: 1947, end_year: 1952 },
        analysis_type: 'significance'
      }
    })
    
    expect(analysisResult.success).toBe(true)
    
    // Verify agent state has been updated correctly
    const finalState = agent.getState()
    expect(finalState.performance.successfulActions).toBe(3)
    expect(finalState.explorationHistory.visitedWaypoints.length).toBeGreaterThan(0)
    expect(finalState.explorationHistory.discoveredEntities.length).toBeGreaterThanOrEqual(0)
    expect(finalState.explorationHistory.analyzedPeriods.length).toBe(1)
  })
})