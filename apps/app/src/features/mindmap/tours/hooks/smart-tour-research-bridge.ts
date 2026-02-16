'use client'

import type { Node, Edge } from '@xyflow/react'
import type { PinnedCard } from '@/contexts/research/research-context'
import type { SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'
import type { TourWaypoint } from '@/features/mindmap/tours/types/tour'
import type { NarrativeLayoutResult } from '@/features/mindmap/research-canvas/intelligent-narrative-layout'
import { getGraphContext, generateTourAwareSearchRules, type GraphContext } from '@/features/mindmap/utils/contextual-intelligence'

export interface SmartTourResearchState {
  // Tour-Research Integration
  activeTourWaypoint: TourWaypoint | null
  tourAwareResearchSuggestions: ResearchSuggestion[]
  pinnedCardsFromTour: PinnedCard[]

  // AI-Driven Analysis
  crossSystemInsights: CrossSystemInsight[]
  narrativeProgression: NarrativeProgression
  smartConnectionSuggestions: SmartConnection[]

  // Intelligence Enhancement
  researchContextualIntelligence: {
    dominantThemes: string[]
    temporalFocus: {
      era: string
      yearRange: [number, number]
      significance: string
    }
    spatialRelevance: {
      locations: string[]
      geographicScope: 'local' | 'regional' | 'national' | 'global'
    }
    entityNetworkStrength: number // 0-1
  }

  // Performance Metrics
  integrationMetrics: {
    tourResearchAlignment: number // 0-1
    aiInsightAccuracy: number // 0-1
    userEngagementScore: number // 0-1
    knowledgeDiscoveryRate: number // insights per minute
  }
}

export interface ResearchSuggestion {
  id: string
  type: 'related-entity' | 'temporal-context' | 'spatial-connection' | 'narrative-bridge'
  confidence: number // 0-1
  title: string
  description: string
  source: 'tour-context' | 'spatial-analysis' | 'narrative-intelligence' | 'user-pattern'
  actionType: 'pin-card' | 'explore-connection' | 'add-to-research' | 'create-narrative'
  metadata: {
    tourWaypointId?: string
    spatialGroupId?: string
    relevanceScore: number
    estimatedResearchValue: number // 0-1
  }
}

export interface CrossSystemInsight {
  id: string
  type: 'pattern-discovery' | 'temporal-correlation' | 'spatial-clustering' | 'narrative-gap'
  confidence: number
  title: string
  summary: string
  evidence: {
    sourceSystem: 'tour' | 'spatial' | 'research' | 'narrative'
    dataPoints: string[]
    supportingMetrics: Record<string, number>
  }[]
  actionableRecommendations: string[]
  impactPotential: 'low' | 'medium' | 'high' | 'breakthrough'
}

export interface NarrativeProgression {
  currentPhase: 'introduction' | 'rising-action' | 'climax' | 'resolution' | 'synthesis'
  storyArcCompletion: number // 0-1
  nextSuggestedNarrative: {
    direction: 'chronological' | 'thematic' | 'investigative' | 'comparative'
    focusAreas: string[]
    estimatedDuration: number // minutes
    complexityLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }
  narrativeGaps: Array<{
    area: string
    description: string
    priority: 'low' | 'medium' | 'high'
    fillSuggestions: string[]
  }>
}

export interface SmartConnection {
  id: string
  sourceType: 'tour-waypoint' | 'pinned-card' | 'spatial-group' | 'research-note'
  targetType: 'tour-waypoint' | 'pinned-card' | 'spatial-group' | 'research-note'
  sourceId: string
  targetId: string
  connectionType: 'temporal' | 'spatial' | 'thematic' | 'causal' | 'correlational'
  strength: number // 0-1
  reasoning: string
  discoveryMethod: 'ai-analysis' | 'spatial-proximity' | 'temporal-sequence' | 'user-pattern'
  researchValue: number // 0-1
}

/**
 * Smart Tour Research Bridge - Comprehensive AI Integration Layer
 * Connects tour system, spatial intelligence, narrative layout, and research canvas
 */
export class SmartTourResearchBridge {
  private graphContext: GraphContext | null = null
  private tourContext: TourWaypoint | null = null
  private spatialGroups: SpatialGroup[] = []
  private pinnedCards: PinnedCard[] = []
  private currentLayout: NarrativeLayoutResult | null = null

  // State management
  private smartState: SmartTourResearchState = {
    activeTourWaypoint: null,
    tourAwareResearchSuggestions: [],
    pinnedCardsFromTour: [],
    crossSystemInsights: [],
    narrativeProgression: this.initializeNarrativeProgression(),
    smartConnectionSuggestions: [],
    researchContextualIntelligence: {
      dominantThemes: [],
      temporalFocus: {
        era: 'Modern Era',
        yearRange: [1947, new Date().getFullYear()],
        significance: 'Ongoing disclosure evolution'
      },
      spatialRelevance: {
        locations: [],
        geographicScope: 'global'
      },
      entityNetworkStrength: 0
    },
    integrationMetrics: {
      tourResearchAlignment: 0,
      aiInsightAccuracy: 0,
      userEngagementScore: 0,
      knowledgeDiscoveryRate: 0
    }
  }

  private listeners: Array<( state: SmartTourResearchState ) => void> = []

  constructor() {
    // Initialize performance tracking
    this.initializePerformanceTracking()
  }

  /**
   * Update system state with new data from all connected systems
   */
  updateSystemState( update: {
    nodes?: Node[]
    edges?: Edge[]
    tourWaypoint?: TourWaypoint | null
    spatialGroups?: SpatialGroup[]
    pinnedCards?: PinnedCard[]
    currentLayout?: NarrativeLayoutResult | null
  } ) {
    let hasChanges = false

    // Update graph context if nodes changed
    if ( update.nodes ) {
      const newContext = getGraphContext( update.nodes )
      if ( this.hasContextChanged( newContext ) ) {
        this.graphContext = newContext
        hasChanges = true
      }
    }

    // Update tour context
    if ( update.tourWaypoint !== undefined ) {
      this.tourContext = update.tourWaypoint
      this.smartState.activeTourWaypoint = update.tourWaypoint
      hasChanges = true
    }

    // Update spatial groups
    if ( update.spatialGroups ) {
      this.spatialGroups = update.spatialGroups
      hasChanges = true
    }

    // Update pinned cards
    if ( update.pinnedCards ) {
      this.pinnedCards = update.pinnedCards
      hasChanges = true
    }

    // Update layout
    if ( update.currentLayout !== undefined ) {
      this.currentLayout = update.currentLayout
      hasChanges = true
    }

    if ( hasChanges ) {
      this.recomputeSmartIntegration()
    }
  }

  /**
   * Generate AI-powered research suggestions based on current tour and spatial state
   */
  generateTourAwareResearchSuggestions(): ResearchSuggestion[] {
    const suggestions: ResearchSuggestion[] = []

    // Tour-based suggestions
    if ( this.tourContext && this.graphContext ) {
      suggestions.push( ...this.generateTourBasedSuggestions() )
    }

    // Spatial group suggestions
    if ( this.spatialGroups.length > 0 ) {
      suggestions.push( ...this.generateSpatialBasedSuggestions() )
    }

    // Narrative progression suggestions
    if ( this.currentLayout ) {
      suggestions.push( ...this.generateNarrativeBasedSuggestions() )
    }

    // Cross-system pattern suggestions
    suggestions.push( ...this.generateCrossSystemSuggestions() )

    // Sort by relevance and confidence
    return suggestions
      .sort( ( a, b ) => ( b.confidence * b.metadata.relevanceScore ) - ( a.confidence * a.metadata.relevanceScore ) )
      .slice( 0, 10 ) // Top 10 suggestions
  }

  /**
   * Discover cross-system insights using AI analysis
   */
  discoverCrossSystemInsights(): CrossSystemInsight[] {
    const insights: CrossSystemInsight[] = []

    // Temporal pattern analysis
    insights.push( ...this.analyzeTemporalPatterns() )

    // Spatial clustering analysis
    insights.push( ...this.analyzeSpatialClusters() )

    // Narrative gap analysis
    insights.push( ...this.analyzeNarrativeGaps() )

    // Connection strength analysis
    insights.push( ...this.analyzeConnectionStrengths() )

    return insights.filter( insight => insight.confidence > 0.6 )
  }

  /**
   * Generate smart connection suggestions between different system components
   */
  generateSmartConnections(): SmartConnection[] {
    const connections: SmartConnection[] = []

    // Tour waypoint to spatial group connections
    if ( this.tourContext && this.spatialGroups.length > 0 ) {
      connections.push( ...this.findTourToSpatialConnections() )
    }

    // Pinned card to tour connections
    if ( this.pinnedCards.length > 0 && this.tourContext ) {
      connections.push( ...this.findCardToTourConnections() )
    }

    // Spatial group to narrative connections
    if ( this.spatialGroups.length > 0 && this.currentLayout ) {
      connections.push( ...this.findSpatialToNarrativeConnections() )
    }

    // Cross-card connections based on AI analysis
    if ( this.pinnedCards.length > 1 ) {
      connections.push( ...this.findCrossCardConnections() )
    }

    return connections
      .filter( conn => conn.strength > 0.5 )
      .sort( ( a, b ) => b.researchValue - a.researchValue )
  }

  /**
   * Update narrative progression based on current research and tour state
   */
  updateNarrativeProgression(): NarrativeProgression {
    const progression = { ...this.smartState.narrativeProgression }

    // Determine current phase based on tour and research state
    if ( this.tourContext && this.graphContext ) {
      progression.currentPhase = this.determineNarrativePhase()
      progression.storyArcCompletion = this.calculateStoryCompletion()
      progression.nextSuggestedNarrative = this.suggestNextNarrative()
      progression.narrativeGaps = this.identifyNarrativeGaps()
    }

    return progression
  }

  /**
   * Get current smart integration state
   */
  getSmartState(): SmartTourResearchState {
    return { ...this.smartState }
  }

  /**
   * Subscribe to state changes
   */
  subscribe( listener: ( state: SmartTourResearchState ) => void ) {
    this.listeners.push( listener )
    return () => {
      const index = this.listeners.indexOf( listener )
      if ( index > -1 ) {
        this.listeners.splice( index, 1 )
      }
    }
  }

  /**
   * Generate contextual search rules for research integration
   */
  getSmartSearchRules(): string {
    if ( !this.graphContext ) {
      return 'Explore connections between UFO/UAP entities and events'
    }

    const baseRules = generateTourAwareSearchRules( this.graphContext )
    const smartEnhancements: string[] = []

    // Add spatial intelligence enhancements
    if ( this.spatialGroups.length > 0 ) {
      const dominantGroup = this.spatialGroups.reduce( ( max, group ) =>
        group.metadata.confidence > max.metadata.confidence ? group : max
      )
      smartEnhancements.push( `Focus on entities similar to the ${dominantGroup.metadata.dominantType} spatial cluster` )
    }

    // Add narrative progression enhancements
    if ( this.smartState.narrativeProgression.currentPhase !== 'introduction' ) {
      smartEnhancements.push( `Consider ${this.smartState.narrativeProgression.currentPhase} narrative elements` )
    }

    // Add research context enhancements
    if ( this.smartState.researchContextualIntelligence.dominantThemes.length > 0 ) {
      const themes = this.smartState.researchContextualIntelligence.dominantThemes.slice( 0, 3 )
      smartEnhancements.push( `Prioritize themes: ${themes.join( ', ' )}` )
    }

    return [baseRules, ...smartEnhancements].join( '. ' ) + '.'
  }

  // Private methods for internal logic

  private recomputeSmartIntegration() {
    // Update all smart suggestions and insights
    this.smartState.tourAwareResearchSuggestions = this.generateTourAwareResearchSuggestions()
    this.smartState.crossSystemInsights = this.discoverCrossSystemInsights()
    this.smartState.smartConnectionSuggestions = this.generateSmartConnections()
    this.smartState.narrativeProgression = this.updateNarrativeProgression()
    this.smartState.researchContextualIntelligence = this.updateResearchContext()
    this.smartState.integrationMetrics = this.calculateIntegrationMetrics()

    // Notify listeners
    this.listeners.forEach( listener => listener( this.smartState ) )
  }

  private hasContextChanged( newContext: GraphContext | null ): boolean {
    if ( !this.graphContext && !newContext ) return false
    if ( !this.graphContext || !newContext ) return true

    // Simple comparison - in production, would be more sophisticated
    return JSON.stringify( this.graphContext ) !== JSON.stringify( newContext )
  }

  private generateTourBasedSuggestions(): ResearchSuggestion[] {
    if ( !this.tourContext || !this.graphContext ) return []

    const suggestions: ResearchSuggestion[] = []

    // Suggest related entities from tour waypoint
    if ( this.tourContext.contextRules?.entityFilters ) {
      const entityTypes = this.tourContext.contextRules.entityFilters.types || []
      entityTypes.forEach( type => {
        suggestions.push( {
          id: `tour-entity-${type}`,
          type: 'related-entity',
          confidence: 0.8,
          title: `Explore ${type} from ${this.tourContext!.title}`,
          description: `Find ${type} entities related to the current tour waypoint`,
          source: 'tour-context',
          actionType: 'explore-connection',
          metadata: {
            tourWaypointId: this.tourContext.id,
            relevanceScore: 0.9,
            estimatedResearchValue: 0.8
          }
        } )
      } )
    }

    // Suggest temporal context exploration
    if ( this.tourContext.contextRules?.temporalWindow ) {
      const { startYear, endYear } = this.tourContext.contextRules.temporalWindow
      suggestions.push( {
        id: `tour-temporal-${startYear}-${endYear}`,
        type: 'temporal-context',
        confidence: 0.9,
        title: `Deep dive into ${startYear}-${endYear} period`,
        description: `Research events and entities from the ${this.tourContext.title} time period`,
        source: 'tour-context',
        actionType: 'add-to-research',
        metadata: {
          tourWaypointId: this.tourContext.id,
          relevanceScore: 0.95,
          estimatedResearchValue: 0.9
        }
      } )
    }

    return suggestions
  }

  private generateSpatialBasedSuggestions(): ResearchSuggestion[] {
    const suggestions: ResearchSuggestion[] = []

    this.spatialGroups.forEach( group => {
      if ( group.metadata.confidence > 0.7 ) {
        suggestions.push( {
          id: `spatial-${group.id}`,
          type: 'spatial-connection',
          confidence: group.metadata.confidence,
          title: `Research ${group.metadata.dominantType} cluster`,
          description: `Investigate the spatial cluster of ${group.nodes.length} ${group.metadata.dominantType} entities`,
          source: 'spatial-analysis',
          actionType: 'pin-card',
          metadata: {
            spatialGroupId: group.id,
            relevanceScore: group.metadata.confidence,
            estimatedResearchValue: Math.min( group.nodes.length / 10, 1 )
          }
        } )
      }
    } )

    return suggestions
  }

  private generateNarrativeBasedSuggestions(): ResearchSuggestion[] {
    if ( !this.currentLayout ) return []

    const suggestions: ResearchSuggestion[] = []

    // Suggest exploring key narrative moments
    this.currentLayout.narrativeFlow.keyMoments.forEach( moment => {
      suggestions.push( {
        id: `narrative-${moment.nodeId}`,
        type: 'narrative-bridge',
        confidence: 0.85,
        title: `Explore ${moment.narrativeSignificance} moment`,
        description: `Research the ${moment.narrativeSignificance} event and its connections`,
        source: 'narrative-intelligence',
        actionType: 'pin-card',
        metadata: {
          relevanceScore: 0.9,
          estimatedResearchValue: 0.8
        }
      } )
    } )

    return suggestions
  }

  private generateCrossSystemSuggestions(): ResearchSuggestion[] {
    const suggestions: ResearchSuggestion[] = []

    // Pattern-based suggestions
    if ( this.spatialGroups.length > 0 && this.pinnedCards.length > 0 ) {
      suggestions.push( {
        id: 'cross-pattern-analysis',
        type: 'related-entity',
        confidence: 0.7,
        title: 'Cross-reference spatial patterns with research',
        description: 'Analyze how pinned research entities relate to spatial groupings',
        source: 'user-pattern',
        actionType: 'create-narrative',
        metadata: {
          relevanceScore: 0.8,
          estimatedResearchValue: 0.9
        }
      } )
    }

    return suggestions
  }

  private analyzeTemporalPatterns(): CrossSystemInsight[] {
    // Implementation for temporal pattern analysis
    return []
  }

  private analyzeSpatialClusters(): CrossSystemInsight[] {
    // Implementation for spatial clustering analysis
    return []
  }

  private analyzeNarrativeGaps(): CrossSystemInsight[] {
    // Implementation for narrative gap analysis
    return []
  }

  private analyzeConnectionStrengths(): CrossSystemInsight[] {
    // Implementation for connection strength analysis
    return []
  }

  private findTourToSpatialConnections(): SmartConnection[] {
    // Implementation for tour-spatial connections
    return []
  }

  private findCardToTourConnections(): SmartConnection[] {
    // Implementation for card-tour connections
    return []
  }

  private findSpatialToNarrativeConnections(): SmartConnection[] {
    // Implementation for spatial-narrative connections
    return []
  }

  private findCrossCardConnections(): SmartConnection[] {
    // Implementation for cross-card connections
    return []
  }

  private determineNarrativePhase(): NarrativeProgression['currentPhase'] {
    // Logic to determine current narrative phase
    return 'rising-action'
  }

  private calculateStoryCompletion(): number {
    // Logic to calculate story arc completion
    return 0.4
  }

  private suggestNextNarrative(): NarrativeProgression['nextSuggestedNarrative'] {
    return {
      direction: 'chronological',
      focusAreas: ['Government Response', 'Witness Testimonies'],
      estimatedDuration: 15,
      complexityLevel: 'intermediate'
    }
  }

  private identifyNarrativeGaps(): NarrativeProgression['narrativeGaps'] {
    return []
  }

  private updateResearchContext(): SmartTourResearchState['researchContextualIntelligence'] {
    const context = { ...this.smartState.researchContextualIntelligence }

    // Update dominant themes based on current data
    if ( this.graphContext && this.pinnedCards.length > 0 ) {
      const themes = new Set<string>()

      // Extract themes from pinned cards
      this.pinnedCards.forEach( card => {
        if ( card.data?.topics ) {
          ( card.data.topics as string[] ).forEach( topic => themes.add( topic ) )
        }
      } )

      context.dominantThemes = Array.from( themes ).slice( 0, 5 )
    }

    // Update temporal focus
    if ( this.graphContext?.timelineBounds.earliest && this.graphContext?.timelineBounds.latest ) {
      const earliest = this.graphContext.timelineBounds.earliest.getFullYear()
      const latest = this.graphContext.timelineBounds.latest.getFullYear()
      context.temporalFocus.yearRange = [earliest, latest]

      if ( earliest >= 1947 && latest <= 1970 ) {
        context.temporalFocus.era = 'Early UFO Era'
        context.temporalFocus.significance = 'Foundation of modern UFO investigation'
      } else if ( latest >= 2017 ) {
        context.temporalFocus.era = 'Modern Disclosure Era'
        context.temporalFocus.significance = 'Government transparency and UAP acknowledgment'
      }
    }

    // Calculate entity network strength
    context.entityNetworkStrength = this.calculateNetworkStrength()

    return context
  }

  private calculateNetworkStrength(): number {
    const totalEntities = this.pinnedCards.length + this.spatialGroups.reduce( ( sum, group ) => sum + group.nodes.length, 0 )
    const connectionScore = this.spatialGroups.reduce( ( sum, group ) => sum + group.metadata.confidence, 0 ) / Math.max( this.spatialGroups.length, 1 )

    return Math.min( ( totalEntities / 20 ) * connectionScore, 1 )
  }

  private calculateIntegrationMetrics(): SmartTourResearchState['integrationMetrics'] {
    return {
      tourResearchAlignment: this.calculateTourResearchAlignment(),
      aiInsightAccuracy: 0.85, // Would be calculated based on user feedback
      userEngagementScore: this.calculateEngagementScore(),
      knowledgeDiscoveryRate: this.calculateDiscoveryRate()
    }
  }

  private calculateTourResearchAlignment(): number {
    if ( !this.tourContext || this.pinnedCards.length === 0 ) return 0

    // Calculate how well research cards align with tour context
    const alignedCards = this.pinnedCards.filter( card => {
      // Check if card relates to current tour waypoint
      return this.isCardRelevantToTour( card )
    } )

    return alignedCards.length / this.pinnedCards.length
  }

  private calculateEngagementScore(): number {
    // Would track user interactions, time spent, actions taken
    const baseScore = 0.7
    const activityBonus = Math.min( this.pinnedCards.length / 10, 0.3 )
    return Math.min( baseScore + activityBonus, 1 )
  }

  private calculateDiscoveryRate(): number {
    // Would track insights generated per unit time
    const insightCount = this.smartState.crossSystemInsights.length
    const timeSpent = 10 // minutes - would be tracked
    return insightCount / timeSpent
  }

  private isCardRelevantToTour( card: PinnedCard ): boolean {
    if ( !this.tourContext ) return false

    // Check temporal alignment
    if ( this.tourContext.contextRules?.temporalWindow && card.data?.date ) {
      const cardDate = new Date( card.data.date )
      const { startYear, endYear } = this.tourContext.contextRules.temporalWindow
      const cardYear = cardDate.getFullYear()

      if ( cardYear >= startYear && cardYear <= endYear ) {
        return true
      }
    }

    // Check entity type alignment
    if ( this.tourContext.contextRules?.entityFilters?.types ) {
      return this.tourContext.contextRules.entityFilters.types.includes( card.type )
    }

    return false
  }

  private initializeNarrativeProgression(): NarrativeProgression {
    return {
      currentPhase: 'introduction',
      storyArcCompletion: 0,
      nextSuggestedNarrative: {
        direction: 'chronological',
        focusAreas: ['Historical Context'],
        estimatedDuration: 10,
        complexityLevel: 'beginner'
      },
      narrativeGaps: []
    }
  }

  private initializePerformanceTracking() {
    // Initialize performance tracking systems
    // Would include metrics collection, user behavior analysis, etc.
  }
}

/**
 * Global instance for smart tour research integration
 */
export const smartTourResearchBridge = new SmartTourResearchBridge()