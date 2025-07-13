/**
 * Tool Interface Layer for Agentic Chronological Tours
 * Phase 1: Tool Schemas and Type Definitions
 * 
 * Created: July 12, 2025
 * Purpose: Enable AI assistants to control tours through natural language and tool use
 */

import type { Node, Edge } from '@xyflow/react'
import type { TourDefinition, TourWaypoint, DatabaseReference } from '../types/tour'

/**
 * Core tool result interfaces
 */
export interface ToolResult {
  success: boolean
  message: string
  data?: any
  error?: string
  suggestedNextActions?: string[]
}

export interface TourResult extends ToolResult {
  newState: {
    currentWaypointId: string
    waypointTitle: string
    narrative: string
    nodesVisible: number
    edgesVisible: number
    enhancementLevel: {
      spatialIntelligence: number
      narrativeFlow: number
      overallEnhancement: number
    }
  }
  tourContext: {
    tourId: string
    totalWaypoints: number
    currentIndex: number
    completionPercentage: number
  }
}

export interface EntityResult extends ToolResult {
  entities: {
    id: string
    type: 'personnel' | 'events' | 'organizations' | 'documents' | 'testimonies' | 'topics'
    title: string
    date?: string
    significance: number
    relationships: {
      toEntityId: string
      relationshipType: string
      strength: number
    }[]
  }[]
  relationshipNetwork: {
    nodes: Node[]
    edges: Edge[]
    clusters: string[][]
  }
}

export interface ContextResult extends ToolResult {
  analysis: {
    timePeriod: { start_year: number, end_year: number }
    significance: {
      overallImportance: number
      keyEvents: string[]
      significantFigures: string[]
      paradigmShifts: string[]
    }
    connections: {
      causalRelationships: Array<{ from: string, to: string, strength: number }>
      temporalPatterns: string[]
      thematicLinks: string[]
    }
    gaps: {
      missingData: string[]
      unexploredConnections: string[]
      potentialResearch: string[]
    }
  }
}

export interface NarrativeResult extends ToolResult {
  bridge: {
    fromPeriod: string
    toPeriod: string
    bridgeType: 'causal' | 'parallel' | 'context' | 'evolution'
    narrative: string
    keyConnections: Array<{
      entityId: string
      role: string
      significance: number
    }>
    evidenceStrength: number
    confidenceLevel: number
  }
  storyline: {
    acts: Array<{
      title: string
      timespan: string
      keyEvents: string[]
      narrative: string
    }>
    overallTheme: string
    characterArc: string[]
  }
}

export interface SpatialResult extends ToolResult {
  spatialAnalysis: {
    proximityGroups: Array<{
      groupId: string
      entities: string[]
      centerPoint: { x: number, y: number }
      significance: number
      theme: string
    }>
    narrativeFlow: {
      primaryPath: string[]
      keyMoments: string[]
      temporalSequence: string[]
    }
    optimizationSuggestions: Array<{
      action: string
      reason: string
      impact: number
    }>
  }
}

/**
 * Tool parameter interfaces
 */
export interface NavigateHistoricalTourParams {
  direction: "forward" | "backward" | "jump_to_period"
  target_period?: "early_sightings" | "cold_war" | "modern_research" | "disclosure_era"
  target_year?: number
  narrative_focus?: string
  depth_level?: "overview" | "detailed" | "comprehensive"
}

export interface DiscoverRelatedEntitiesParams {
  current_context: string
  entity_types: ("personnel" | "events" | "organizations" | "documents" | "testimonies" | "topics")[]
  relationship_depth: 1 | 2 | 3
  temporal_window?: { years_before: number, years_after: number }
}

export interface AnalyzeTemporalContextParams {
  time_period: { start_year: number, end_year: number }
  analysis_type: "significance" | "connections" | "progression" | "gaps"
  focus_entities?: string[]
}

export interface CreateNarrativeBridgeParams {
  from_period: string
  to_period: string
  bridge_type: "causal" | "parallel" | "context" | "evolution"
  evidence_threshold: number
}

export interface SpatialIntelligenceQueryParams {
  query_type: "proximity" | "clustering" | "narrative_flow" | "temporal_alignment"
  target_entities?: string[]
  optimization_goal: "discovery" | "comprehension" | "narrative_flow"
}

/**
 * Main tool interface definition
 */
export interface TourNavigationTools {
  /**
   * Navigate through historical tour with intelligent waypoint selection
   */
  navigate_historical_tour(params: NavigateHistoricalTourParams): Promise<TourResult>
  
  /**
   * Discover entities related to current tour context
   */
  discover_related_entities(params: DiscoverRelatedEntitiesParams): Promise<EntityResult>
  
  /**
   * Analyze temporal context and significance of time periods
   */
  analyze_temporal_context(params: AnalyzeTemporalContextParams): Promise<ContextResult>
  
  /**
   * Create narrative bridges connecting different historical periods
   */
  create_narrative_bridge(params: CreateNarrativeBridgeParams): Promise<NarrativeResult>
  
  /**
   * Query spatial intelligence for layout and relationship optimization
   */
  spatial_intelligence_query(params: SpatialIntelligenceQueryParams): Promise<SpatialResult>
}

/**
 * Tool implementation class that wraps existing tour infrastructure
 */
export interface TourToolsImplementation extends TourNavigationTools {
  // Internal state management
  getCurrentState(): {
    tourId: string | null
    currentWaypointIndex: number
    totalWaypoints: number
    nodes: Node[]
    edges: Edge[]
    spatialGroups: any[]
    enhancementLevel: any
  }
  
  // Configuration management
  updateConfiguration(config: Partial<any>): void
  
  // Error handling and recovery
  handleToolError(toolName: string, error: Error, params: any): ToolResult
  
  // Context preservation
  preserveContext(): any
  restoreContext(context: any): void
}

/**
 * Tool registry for dynamic tool discovery
 */
export interface ToolRegistry {
  tools: {
    [K in keyof TourNavigationTools]: {
      name: K
      description: string
      parameters: any
      returnType: any
      example: any
    }
  }
  
  validateParameters<K extends keyof TourNavigationTools>(
    toolName: K, 
    params: Parameters<TourNavigationTools[K]>[0]
  ): { valid: boolean, errors: string[] }
}

/**
 * Tool metadata for AI assistant understanding
 */
export const TOOL_METADATA: ToolRegistry['tools'] = {
  navigate_historical_tour: {
    name: 'navigate_historical_tour',
    description: 'Navigate through historical UFO/UAP events chronologically or jump to specific periods. Supports narrative focus and depth control.',
    parameters: {
      direction: 'Direction of navigation: forward, backward, or jump to specific period',
      target_period: 'Predefined historical periods: early_sightings (1940s-1950s), cold_war (1950s-1970s), modern_research (1980s-2000s), disclosure_era (2010s-present)',
      target_year: 'Specific year to navigate to (overrides target_period)',
      narrative_focus: 'Thematic focus for the navigation (e.g., "military_personnel_attitudes", "government_disclosure")',
      depth_level: 'Level of detail: overview (key events only), detailed (comprehensive context), comprehensive (full entity network)'
    },
    returnType: 'TourResult with new tour state, waypoint information, and enhancement metrics',
    example: {
      direction: "jump_to_period",
      target_period: "cold_war",
      narrative_focus: "military_personnel_attitudes",
      depth_level: "detailed"
    }
  },
  
  discover_related_entities: {
    name: 'discover_related_entities',
    description: 'Discover entities related to current tour context within specified relationship depth and temporal windows.',
    parameters: {
      current_context: 'Description of current tour context or specific entity focus',
      entity_types: 'Array of entity types to discover: personnel, events, organizations, documents, testimonies, topics',
      relationship_depth: 'Degrees of separation: 1 (direct connections), 2 (friends of friends), 3 (extended network)',
      temporal_window: 'Optional time constraint with years_before and years_after current context'
    },
    returnType: 'EntityResult with discovered entities, relationships, and network visualization data',
    example: {
      current_context: "Roswell incident 1947",
      entity_types: ["personnel", "events", "organizations"],
      relationship_depth: 2,
      temporal_window: { years_before: 1, years_after: 5 }
    }
  },
  
  analyze_temporal_context: {
    name: 'analyze_temporal_context',
    description: 'Analyze historical significance, connections, progression patterns, or gaps within specified time periods.',
    parameters: {
      time_period: 'Time range with start_year and end_year',
      analysis_type: 'Type of analysis: significance (importance ranking), connections (relationship mapping), progression (temporal evolution), gaps (missing data)',
      focus_entities: 'Optional array of specific entity IDs to focus analysis on'
    },
    returnType: 'ContextResult with detailed temporal analysis including significance, connections, and gaps',
    example: {
      time_period: { start_year: 1947, end_year: 1952 },
      analysis_type: "connections",
      focus_entities: ["roswell-incident", "project-blue-book"]
    }
  },
  
  create_narrative_bridge: {
    name: 'create_narrative_bridge',
    description: 'Create compelling narrative connections between different historical periods, showing evolution, causality, or thematic parallels.',
    parameters: {
      from_period: 'Starting historical period or specific event',
      to_period: 'Target historical period or specific event',
      bridge_type: 'Type of connection: causal (cause-effect), parallel (similar patterns), context (background evolution), evolution (gradual change)',
      evidence_threshold: 'Minimum evidence strength required (0.0-1.0) for including connections'
    },
    returnType: 'NarrativeResult with bridge narrative, key connections, storyline structure, and confidence metrics',
    example: {
      from_period: "Roswell incident",
      to_period: "Pentagon UAP acknowledgments",
      bridge_type: "evolution",
      evidence_threshold: 0.7
    }
  },
  
  spatial_intelligence_query: {
    name: 'spatial_intelligence_query',
    description: 'Query spatial intelligence system for layout optimization, proximity analysis, clustering, and narrative flow enhancement.',
    parameters: {
      query_type: 'Type of spatial analysis: proximity (nearby entity grouping), clustering (thematic grouping), narrative_flow (story progression), temporal_alignment (chronological layout)',
      target_entities: 'Optional array of specific entity IDs to focus spatial analysis on',
      optimization_goal: 'Goal for spatial optimization: discovery (find new connections), comprehension (improve understanding), narrative_flow (enhance storytelling)'
    },
    returnType: 'SpatialResult with proximity groups, narrative flow analysis, and optimization suggestions',
    example: {
      query_type: "narrative_flow",
      target_entities: ["roswell-incident", "project-blue-book", "condon-report"],
      optimization_goal: "comprehension"
    }
  }
}

/**
 * Tool execution context for maintaining state across tool calls
 */
export interface ToolExecutionContext {
  sessionId: string
  userId?: string
  tourId?: string
  currentWaypointId?: string
  contextHistory: Array<{
    toolName: string
    parameters: any
    result: any
    timestamp: string
  }>
  userPreferences: {
    preferred_depth: "overview" | "detailed" | "comprehensive"
    narrative_style: "academic" | "casual" | "storytelling"
    interaction_pattern: "explorer" | "researcher" | "casual" | "deep_dive"
  }
  performanceMetrics: {
    toolCallCount: number
    averageResponseTime: number
    successRate: number
  }
}