'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { PinnedCard } from '@/contexts/research/research-context'
import type { SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'
import type { TourWaypoint } from '@/features/mindmap/tours/types/tour'
import type { NarrativeLayoutResult } from '@/features/mindmap/layouts/intelligent-narrative-layout'
import { 
  smartTourResearchBridge, 
  type SmartTourResearchState,
  type ResearchSuggestion,
  type CrossSystemInsight,
  type SmartConnection
} from './smart-tour-research-bridge'

export interface SmartTourIntegrationConfig {
  // Auto-update settings
  enableAutoSuggestions: boolean
  enableCrossSystemInsights: boolean
  enableSmartConnections: boolean
  
  // Performance settings
  updateThrottleMs: number
  maxSuggestions: number
  insightConfidenceThreshold: number // 0-1
  
  // Feature toggles
  enableNarrativeProgression: boolean
  enableResearchIntelligence: boolean
  enablePerformanceMetrics: boolean
  
  // User preferences
  suggestionTypes: ResearchSuggestion['type'][]
  insightTypes: CrossSystemInsight['type'][]
  preferredComplexity: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

const DEFAULT_CONFIG: SmartTourIntegrationConfig = {
  enableAutoSuggestions: true,
  enableCrossSystemInsights: true,
  enableSmartConnections: true,
  updateThrottleMs: 500,
  maxSuggestions: 8,
  insightConfidenceThreshold: 0.6,
  enableNarrativeProgression: true,
  enableResearchIntelligence: true,
  enablePerformanceMetrics: true,
  suggestionTypes: ['related-entity', 'temporal-context', 'spatial-connection', 'narrative-bridge'],
  insightTypes: ['pattern-discovery', 'temporal-correlation', 'spatial-clustering', 'narrative-gap'],
  preferredComplexity: 'intermediate'
}

export interface SmartTourIntegrationState {
  // Smart state from bridge
  smartState: SmartTourResearchState
  
  // Filtered and configured suggestions
  activeSuggestions: ResearchSuggestion[]
  priorityInsights: CrossSystemInsight[]
  recommendedConnections: SmartConnection[]
  
  // UI state
  isUpdating: boolean
  lastUpdate: Date
  errorState: string | null
  
  // Performance metrics
  updateCount: number
  averageUpdateTime: number
  userInteractionRate: number
}

export interface SmartTourIntegrationActions {
  // Manual updates
  refreshSmartState: () => void
  updateSystemState: (update: {
    nodes?: Node[]
    edges?: Edge[]
    tourWaypoint?: TourWaypoint | null
    spatialGroups?: SpatialGroup[]
    pinnedCards?: PinnedCard[]
    currentLayout?: NarrativeLayoutResult | null
  }) => void
  
  // Suggestion interactions
  applySuggestion: (suggestionId: string) => Promise<void>
  dismissSuggestion: (suggestionId: string) => void
  rateSuggestion: (suggestionId: string, rating: 1 | 2 | 3 | 4 | 5) => void
  
  // Insight interactions
  expandInsight: (insightId: string) => CrossSystemInsight | null
  markInsightAsApplied: (insightId: string) => void
  exportInsight: (insightId: string) => string
  
  // Connection actions
  createSmartConnection: (connection: SmartConnection) => Promise<void>
  validateConnection: (connectionId: string) => Promise<boolean>
  strengthenConnection: (connectionId: string, evidence: string) => void
  
  // Search integration
  getSmartSearchRules: () => string
  generateContextualQuery: (intent: string) => string
  
  // Configuration
  updateConfig: (config: Partial<SmartTourIntegrationConfig>) => void
  resetToDefaults: () => void
}

/**
 * Smart Tour Integration Hook - Main interface for AI-powered tour-research integration
 */
export function useSmartTourIntegration(
  initialConfig: Partial<SmartTourIntegrationConfig> = {}
): [SmartTourIntegrationState, SmartTourIntegrationActions] {
  
  const config = { ...DEFAULT_CONFIG, ...initialConfig }
  const [state, setState] = useState<SmartTourIntegrationState>({
    smartState: smartTourResearchBridge.getSmartState(),
    activeSuggestions: [],
    priorityInsights: [],
    recommendedConnections: [],
    isUpdating: false,
    lastUpdate: new Date(),
    errorState: null,
    updateCount: 0,
    averageUpdateTime: 0,
    userInteractionRate: 0
  })
  
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const performanceMetrics = useRef({
    updateTimes: [] as number[],
    interactionCount: 0,
    sessionStartTime: Date.now()
  })
  
  // Subscribe to smart bridge state changes
  useEffect(() => {
    const unsubscribe = smartTourResearchBridge.subscribe((smartState) => {
      setState(prev => ({
        ...prev,
        smartState,
        activeSuggestions: filterSuggestions(smartState.tourAwareResearchSuggestions),
        priorityInsights: filterInsights(smartState.crossSystemInsights),
        recommendedConnections: filterConnections(smartState.smartConnectionSuggestions),
        lastUpdate: new Date(),
        updateCount: prev.updateCount + 1
      }))
    })
    
    return unsubscribe
  }, [])
  
  // Filter suggestions based on configuration
  const filterSuggestions = useCallback((suggestions: ResearchSuggestion[]): ResearchSuggestion[] => {
    return suggestions
      .filter(suggestion => config.suggestionTypes.includes(suggestion.type))
      .filter(suggestion => suggestion.confidence >= config.insightConfidenceThreshold)
      .slice(0, config.maxSuggestions)
  }, [config])
  
  // Filter insights based on configuration
  const filterInsights = useCallback((insights: CrossSystemInsight[]): CrossSystemInsight[] => {
    return insights
      .filter(insight => config.insightTypes.includes(insight.type))
      .filter(insight => insight.confidence >= config.insightConfidenceThreshold)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5) // Top 5 insights
  }, [config])
  
  // Filter connections based on research value
  const filterConnections = useCallback((connections: SmartConnection[]): SmartConnection[] => {
    return connections
      .filter(connection => connection.researchValue >= 0.6)
      .sort((a, b) => b.researchValue - a.researchValue)
      .slice(0, 8) // Top 8 connections
  }, [])
  
  // Throttled update function
  const throttledUpdate = useCallback((update: Parameters<SmartTourIntegrationActions['updateSystemState']>[0]) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isUpdating: true }))
      
      const startTime = performance.now()
      
      try {
        smartTourResearchBridge.updateSystemState(update)
        
        const endTime = performance.now()
        const updateTime = endTime - startTime
        
        // Track performance
        performanceMetrics.current.updateTimes.push(updateTime)
        if (performanceMetrics.current.updateTimes.length > 50) {
          performanceMetrics.current.updateTimes.shift() // Keep last 50 measurements
        }
        
        const averageUpdateTime = performanceMetrics.current.updateTimes.reduce((a, b) => a + b, 0) / 
                                 performanceMetrics.current.updateTimes.length
        
        setState(prev => ({
          ...prev,
          isUpdating: false,
          averageUpdateTime,
          errorState: null
        }))
        
      } catch (error) {
        console.error('Smart integration update error:', error)
        setState(prev => ({
          ...prev,
          isUpdating: false,
          errorState: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }, config.updateThrottleMs)
  }, [config.updateThrottleMs])
  
  // Actions implementation
  const actions: SmartTourIntegrationActions = {
    refreshSmartState: useCallback(() => {
      setState(prev => ({
        ...prev,
        smartState: smartTourResearchBridge.getSmartState(),
        lastUpdate: new Date()
      }))
    }, []),
    
    updateSystemState: throttledUpdate,
    
    applySuggestion: useCallback(async (suggestionId: string) => {
      const suggestion = state.activeSuggestions.find(s => s.id === suggestionId)
      if (!suggestion) return
      
      performanceMetrics.current.interactionCount++
      
      // Apply the suggestion based on its action type
      switch (suggestion.actionType) {
        case 'pin-card':
          // Would integrate with research context to pin a card
          console.log('Applying pin-card suggestion:', suggestion)
          break
        case 'explore-connection':
          // Would trigger exploration of related entities
          console.log('Applying explore-connection suggestion:', suggestion)
          break
        case 'add-to-research':
          // Would add content to research editor
          console.log('Applying add-to-research suggestion:', suggestion)
          break
        case 'create-narrative':
          // Would start narrative creation workflow
          console.log('Applying create-narrative suggestion:', suggestion)
          break
      }
      
      // Remove suggestion after application
      setState(prev => ({
        ...prev,
        activeSuggestions: prev.activeSuggestions.filter(s => s.id !== suggestionId)
      }))
    }, [state.activeSuggestions]),
    
    dismissSuggestion: useCallback((suggestionId: string) => {
      setState(prev => ({
        ...prev,
        activeSuggestions: prev.activeSuggestions.filter(s => s.id !== suggestionId)
      }))
    }, []),
    
    rateSuggestion: useCallback((suggestionId: string, rating: 1 | 2 | 3 | 4 | 5) => {
      // Would send feedback to improve AI suggestions
      console.log('Rating suggestion:', suggestionId, rating)
      performanceMetrics.current.interactionCount++
    }, []),
    
    expandInsight: useCallback((insightId: string) => {
      return state.priorityInsights.find(insight => insight.id === insightId) || null
    }, [state.priorityInsights]),
    
    markInsightAsApplied: useCallback((insightId: string) => {
      setState(prev => ({
        ...prev,
        priorityInsights: prev.priorityInsights.map(insight =>
          insight.id === insightId 
            ? { ...insight, confidence: insight.confidence * 0.8 } // Reduce prominence
            : insight
        )
      }))
      performanceMetrics.current.interactionCount++
    }, []),
    
    exportInsight: useCallback((insightId: string) => {
      const insight = state.priorityInsights.find(i => i.id === insightId)
      if (!insight) return ''
      
      return `# ${insight.title}\n\n${insight.summary}\n\n## Evidence:\n${
        insight.evidence.map(e => `- ${e.sourceSystem}: ${e.dataPoints.join(', ')}`).join('\n')
      }\n\n## Recommendations:\n${
        insight.actionableRecommendations.map(r => `- ${r}`).join('\n')
      }`
    }, [state.priorityInsights]),
    
    createSmartConnection: useCallback(async (connection: SmartConnection) => {
      // Would create the connection in the appropriate system
      console.log('Creating smart connection:', connection)
      performanceMetrics.current.interactionCount++
    }, []),
    
    validateConnection: useCallback(async (connectionId: string) => {
      // Would validate the connection using AI analysis
      console.log('Validating connection:', connectionId)
      return true // Placeholder
    }, []),
    
    strengthenConnection: useCallback((connectionId: string, evidence: string) => {
      setState(prev => ({
        ...prev,
        recommendedConnections: prev.recommendedConnections.map(conn =>
          conn.id === connectionId
            ? { ...conn, strength: Math.min(conn.strength + 0.1, 1), reasoning: `${conn.reasoning}. Additional evidence: ${evidence}` }
            : conn
        )
      }))
      performanceMetrics.current.interactionCount++
    }, []),
    
    getSmartSearchRules: useCallback(() => {
      return smartTourResearchBridge.getSmartSearchRules()
    }, []),
    
    generateContextualQuery: useCallback((intent: string) => {
      const rules = smartTourResearchBridge.getSmartSearchRules()
      return `${intent}. Context: ${rules}`
    }, []),
    
    updateConfig: useCallback((newConfig: Partial<SmartTourIntegrationConfig>) => {
      Object.assign(config, newConfig)
      // Re-filter suggestions and insights with new config
      setState(prev => ({
        ...prev,
        activeSuggestions: filterSuggestions(prev.smartState.tourAwareResearchSuggestions),
        priorityInsights: filterInsights(prev.smartState.crossSystemInsights),
        recommendedConnections: filterConnections(prev.smartState.smartConnectionSuggestions)
      }))
    }, [filterSuggestions, filterInsights, filterConnections]),
    
    resetToDefaults: useCallback(() => {
      Object.assign(config, DEFAULT_CONFIG)
      setState(prev => ({
        ...prev,
        activeSuggestions: filterSuggestions(prev.smartState.tourAwareResearchSuggestions),
        priorityInsights: filterInsights(prev.smartState.crossSystemInsights),
        recommendedConnections: filterConnections(prev.smartState.smartConnectionSuggestions)
      }))
    }, [filterSuggestions, filterInsights, filterConnections])
  }
  
  // Calculate user interaction rate
  useEffect(() => {
    const sessionTime = (Date.now() - performanceMetrics.current.sessionStartTime) / 1000 / 60 // minutes
    const interactionRate = performanceMetrics.current.interactionCount / Math.max(sessionTime, 1)
    
    setState(prev => ({
      ...prev,
      userInteractionRate: interactionRate
    }))
  }, [state.updateCount])
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])
  
  return [state, actions]
}

/**
 * Simplified hook for components that only need suggestions
 */
export function useSmartSuggestions() {
  const [state] = useSmartTourIntegration({
    enableCrossSystemInsights: false,
    enableSmartConnections: false,
    maxSuggestions: 5
  })
  
  return {
    suggestions: state.activeSuggestions,
    isLoading: state.isUpdating,
    searchRules: smartTourResearchBridge.getSmartSearchRules()
  }
}

/**
 * Hook specifically for research canvas integration
 */
export function useSmartResearchIntegration() {
  const [state, actions] = useSmartTourIntegration({
    suggestionTypes: ['related-entity', 'spatial-connection'],
    insightTypes: ['pattern-discovery', 'spatial-clustering'],
    maxSuggestions: 6
  })
  
  return {
    // Research-specific state
    researchSuggestions: state.activeSuggestions,
    spatialInsights: state.priorityInsights.filter(i => i.type === 'spatial-clustering'),
    patternInsights: state.priorityInsights.filter(i => i.type === 'pattern-discovery'),
    contextualIntelligence: state.smartState.researchContextualIntelligence,
    
    // Research-specific actions
    applyResearchSuggestion: actions.applySuggestion,
    updateResearchState: actions.updateSystemState,
    getResearchSearchRules: actions.getSmartSearchRules,
    generateResearchQuery: actions.generateContextualQuery
  }
}

/**
 * Hook for tour navigation integration
 */
export function useTourNavigation() {
  const [state, actions] = useSmartTourIntegration({
    suggestionTypes: ['temporal-context', 'narrative-bridge'],
    insightTypes: ['temporal-correlation', 'narrative-gap'],
    enableNarrativeProgression: true
  })
  
  return {
    // Tour-specific state
    narrativeProgression: state.smartState.narrativeProgression,
    tourSuggestions: state.activeSuggestions,
    narrativeInsights: state.priorityInsights.filter(i => i.type === 'narrative-gap'),
    
    // Tour-specific actions
    updateTourState: actions.updateSystemState,
    applyTourSuggestion: actions.applySuggestion,
    getTourSearchRules: actions.getSmartSearchRules
  }
}