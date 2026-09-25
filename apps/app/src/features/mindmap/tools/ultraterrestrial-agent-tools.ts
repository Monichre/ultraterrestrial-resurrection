/**
 * Ultraterrestrial Agent Tools - Universal Tool Architecture
 * Created: July 12, 2025
 * Purpose: Standardized tools for all AI agents in the Ultraterrestrial application
 */

import type { Node, Edge } from '@xyflow/react'
import type { ReactFlowNode, ReactFlowEdge } from '@/features/mindmap/actions/xata-to-xyflow'

/**
 * Core tool result interfaces - usable by any agent
 */
export interface AgentToolResult {
  success: boolean
  message: string
  data?: any
  error?: string
  suggestedNextActions?: string[]
  performance?: {
    duration: number
    recordsProcessed: number
    nodesCreated: number
    edgesCreated: number
  }
}

export interface DatabaseSearchResult extends AgentToolResult {
  searchResults: {
    records: any[]
    answer: string
    sessionId: string
    totalResults: number
    query: string
    table: string
    confidence: number
  }
  entityAnalysis: {
    primaryEntities: string[]
    relationships: Array<{
      from: string
      to: string
      type: string
      strength: number
    }>
    temporalContext: {
      dateRange?: { start: string, end: string }
      chronologicalOrder: boolean
      historicalSignificance: number
    }
  }
}

export interface GraphTransformResult extends AgentToolResult {
  graphData: {
    nodes: ReactFlowNode[]
    edges: ReactFlowEdge[]
    layout: {
      type: "horizontal" | "vertical" | "radial" | "grid"
      applied: boolean
      nodePositions: Record<string, { x: number, y: number }>
    }
  }
  transformationMeta: {
    sourceRecords: number
    successfulTransformations: number
    layoutOptimizations: string[]
    enhancementLevel: number
  }
}

export interface ResourceRAGResult extends AgentToolResult {
  ragResults: {
    relevantResources: Array<{
      url: string
      title: string
      relevanceScore: number
      context: string
      category: 'research' | 'government' | 'civilian' | 'academic' | 'media'
    }>
    synthesizedInsights: string
    additionalContext: string[]
    confidenceLevel: number
  }
  integration: {
    potentialConnections: string[]
    suggestedQueries: string[]
    expertiseAreas: string[]
  }
}

export interface HistoricalAnalysisResult extends AgentToolResult {
  historicalContext: {
    timelinePosition: {
      year: number
      period: 'early_sightings' | 'cold_war' | 'modern_research' | 'disclosure_era'
      significance: number
    }
    precedingEvents: Array<{
      id: string
      title: string
      date: string
      connection: string
    }>
    subsequentEvents: Array<{
      id: string
      title: string
      date: string
      connection: string
    }>
    contextualFactors: string[]
  }
  narrativeElements: {
    thematicConnections: string[]
    causalRelationships: string[]
    parallelsWithOtherEvents: string[]
    disclosureSignificance: number
  }
}

export interface NarrativeContextResult extends AgentToolResult {
  narrativeContext: {
    disclosureNarrative: {
      currentPhase: 'genesis' | 'investigation' | 'civilian' | 'modern' | 'disclosure'
      historicalProgression: {
        era: string
        startYear: number
        endYear: number
        nextSuggestedYear: number
        rationale: string
      }
      significantEvents: string[]
    }
    contextualIntelligence: {
      seedRecord: string
      relatedEntities: {
        personnel: string[]
        organizations: string[]
        topics: string[]
      }
      temporalBounds: {
        earliest: string
        latest: string
      }
      locationContext?: {
        latitude: number
        longitude: number
        radius: number
      }
    }
  }
  relatedRecords: {
    records: any[]
    contextualRelevance: Array<{
      recordId: string
      relevanceScore: number
      relationshipType: 'temporal' | 'personnel' | 'organizational' | 'topical' | 'geographic'
      explanation: string
    }>
    searchRules: string
    totalCandidates: number
  }
}

/**
 * Tool parameter interfaces
 */
export interface DatabaseSearchParams {
  query: string
  table: 'all' | 'events' | 'personnel' | 'organizations' | 'documents' | 'testimonies' | 'topics'
  context?: string
  historicalFilter?: {
    mode: 'chronological' | 'contextual' | 'significance'
    dateRange?: { startYear?: number, endYear?: number }
    categories?: string[]
  }
  searchDepth: 'surface' | 'detailed' | 'comprehensive'
  includeRelationships: boolean
}

export interface GraphTransformParams {
  records: any[]
  query: string
  sourceNode: ReactFlowNode
  existingNodes: ReactFlowNode[]
  layoutType: "horizontal" | "vertical" | "radial" | "grid"
  transformationRules: {
    enhanceWithSpatialIntelligence: boolean
    preserveChronology: boolean
    optimizeForNarrative: boolean
    groupSimilarEntities: boolean
  }
  tourContext?: {
    tourId: string
    waypointId: string
    narrativeFlow: string
  }
}

export interface ResourceRAGParams {
  query: string
  context: string
  resourceCategories: ('research' | 'government' | 'civilian' | 'academic' | 'media')[]
  maxResources: number
  relevanceThreshold: number
  synthesizeInsights: boolean
}

export interface HistoricalAnalysisParams {
  entityId: string
  entityType: 'events' | 'personnel' | 'organizations' | 'documents'
  analysisDepth: 'timeline' | 'comprehensive' | 'narrative'
  temporalWindow: {
    yearsBefore: number
    yearsAfter: number
  }
  includeDisclosureContext: boolean
}

export interface NarrativeContextParams {
  currentGraphContext: {
    nodes: any[]
    centerNode?: any
    existingContext?: string
  }
  narrativeQuery: string
  searchDepth: 'contextual' | 'comprehensive' | 'discovery'
  disclosurePhase?: 'genesis' | 'investigation' | 'civilian' | 'modern' | 'disclosure'
  maxRelatedRecords: number
  includeGeographicContext: boolean
}

/**
 * Universal agent tools interface - can be implemented by any agent
 */
export interface UltraterrestrialAgentTools {
  /**
   * Enhanced database search with AI-powered analysis
   */
  searchDatabase(params: DatabaseSearchParams): Promise<DatabaseSearchResult>
  
  /**
   * Transform database records to ReactFlow graph with intelligent layout
   */
  transformToGraph(params: GraphTransformParams): Promise<GraphTransformResult>
  
  /**
   * RAG search using external resources for additional context
   */
  searchExternalResources(params: ResourceRAGParams): Promise<ResourceRAGResult>
  
  /**
   * Deep historical analysis for chronological context
   */
  analyzeHistoricalContext(params: HistoricalAnalysisParams): Promise<HistoricalAnalysisResult>
  
  /**
   * Disclosure narrative context analysis to find related records
   */
  analyzeNarrativeContext(params: NarrativeContextParams): Promise<NarrativeContextResult>
}

/**
 * Agent execution context - universal for all agents
 */
export interface AgentExecutionContext {
  sessionId: string
  agentId: string // identifier for which agent is executing
  userId?: string
  threadId?: string
  currentMindmapState: {
    nodes: ReactFlowNode[]
    edges: ReactFlowEdge[]
    centerNode?: ReactFlowNode
  }
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    toolsUsed?: string[]
    agentId?: string
  }>
  userPreferences: {
    preferredDepth: 'surface' | 'detailed' | 'comprehensive'
    layoutPreference: "horizontal" | "vertical" | "radial" | "grid"
    historicalFocus: boolean
    expertiseLevel: 'novice' | 'intermediate' | 'expert'
  }
  performanceMetrics: {
    totalQueries: number
    averageResponseTime: number
    successRate: number
    nodesCreated: number
    edgesCreated: number
  }
}

/**
 * Universal tool definitions for OpenAI function calling - reusable by any agent
 */
export const ULTRATERRESTRIAL_TOOL_DEFINITIONS = {
  searchDatabase: {
    type: "function" as const,
    function: {
      name: "searchDatabase",
      description: "Search the Xata database for UFO/UAP records with AI-enhanced analysis and entity relationship mapping",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Natural language search query for UFO/UAP related information"
          },
          table: {
            type: "string",
            enum: ["all", "events", "personnel", "organizations", "documents", "testimonies", "topics"],
            description: "Database table to search, or 'all' for comprehensive search"
          },
          context: {
            type: "string",
            description: "Additional context to guide the search (optional)"
          },
          historicalFilter: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["chronological", "contextual", "significance"],
                description: "Filtering approach for historical relevance"
              },
              dateRange: {
                type: "object",
                properties: {
                  startYear: { type: "number", description: "Start year for date filtering" },
                  endYear: { type: "number", description: "End year for date filtering" }
                }
              },
              categories: {
                type: "array",
                items: { type: "string" },
                description: "Specific categories to focus on"
              }
            }
          },
          searchDepth: {
            type: "string",
            enum: ["surface", "detailed", "comprehensive"],
            description: "Depth of search and analysis to perform"
          },
          includeRelationships: {
            type: "boolean",
            description: "Whether to analyze and include entity relationships"
          }
        },
        required: ["query", "searchDepth", "includeRelationships"]
      }
    }
  },

  transformToGraph: {
    type: "function" as const,
    function: {
      name: "transformToGraph",
      description: "Transform database search results into an optimized ReactFlow graph visualization with intelligent layout and spatial awareness",
      parameters: {
        type: "object",
        properties: {
          records: {
            type: "array",
            description: "Database records to transform into graph nodes",
            items: {
              type: "object",
              description: "Individual database record"
            }
          },
          query: {
            type: "string",
            description: "Original query that generated these records"
          },
          sourceNode: {
            type: "object",
            description: "Source node in the mindmap from which this expansion originates"
          },
          existingNodes: {
            type: "array",
            description: "Current nodes in the mindmap to avoid conflicts",
            items: { type: "object" }
          },
          layoutType: {
            type: "string",
            enum: ["horizontal", "vertical", "radial", "grid"],
            description: "Layout algorithm to apply for optimal visualization"
          },
          transformationRules: {
            type: "object",
            properties: {
              enhanceWithSpatialIntelligence: {
                type: "boolean",
                description: "Apply spatial intelligence for proximity-based grouping"
              },
              preserveChronology: {
                type: "boolean",
                description: "Maintain chronological ordering in layout"
              },
              optimizeForNarrative: {
                type: "boolean",
                description: "Optimize layout for storytelling and narrative flow"
              },
              groupSimilarEntities: {
                type: "boolean",
                description: "Group similar entities for better comprehension"
              }
            },
            required: ["enhanceWithSpatialIntelligence", "preserveChronology", "optimizeForNarrative", "groupSimilarEntities"]
          },
          tourContext: {
            type: "object",
            description: "Optional tour context for guided exploration",
            properties: {
              tourId: { type: "string" },
              waypointId: { type: "string" },
              narrativeFlow: { type: "string" }
            }
          }
        },
        required: ["records", "query", "sourceNode", "existingNodes", "layoutType", "transformationRules"]
      }
    }
  },

  searchExternalResources: {
    type: "function" as const,
    function: {
      name: "searchExternalResources",
      description: "Search external UFO/UAP resources for additional context and insights using RAG techniques",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for external resources"
          },
          context: {
            type: "string",
            description: "Current context from the mindmap to guide resource selection"
          },
          resourceCategories: {
            type: "array",
            items: {
              type: "string",
              enum: ["research", "government", "civilian", "academic", "media"]
            },
            description: "Categories of resources to prioritize"
          },
          maxResources: {
            type: "number",
            minimum: 1,
            maximum: 20,
            description: "Maximum number of resources to analyze"
          },
          relevanceThreshold: {
            type: "number",
            minimum: 0.0,
            maximum: 1.0,
            description: "Minimum relevance score for including resources"
          },
          synthesizeInsights: {
            type: "boolean",
            description: "Whether to synthesize insights across multiple resources"
          }
        },
        required: ["query", "context", "resourceCategories", "maxResources", "relevanceThreshold", "synthesizeInsights"]
      }
    }
  },

  analyzeHistoricalContext: {
    type: "function" as const,
    function: {
      name: "analyzeHistoricalContext",
      description: "Perform deep historical analysis to understand chronological context and disclosure significance",
      parameters: {
        type: "object",
        properties: {
          entityId: {
            type: "string",
            description: "ID of the entity to analyze historically"
          },
          entityType: {
            type: "string",
            enum: ["events", "personnel", "organizations", "documents"],
            description: "Type of entity being analyzed"
          },
          analysisDepth: {
            type: "string",
            enum: ["timeline", "comprehensive", "narrative"],
            description: "Depth and approach of historical analysis"
          },
          temporalWindow: {
            type: "object",
            properties: {
              yearsBefore: {
                type: "number",
                minimum: 0,
                maximum: 100,
                description: "Years before the entity to analyze"
              },
              yearsAfter: {
                type: "number",
                minimum: 0,
                maximum: 100,
                description: "Years after the entity to analyze"
              }
            },
            required: ["yearsBefore", "yearsAfter"]
          },
          includeDisclosureContext: {
            type: "boolean",
            description: "Whether to include UFO disclosure timeline context"
          }
        },
        required: ["entityId", "entityType", "analysisDepth", "temporalWindow", "includeDisclosureContext"]
      }
    }
  },

  analyzeNarrativeContext: {
    type: "function" as const,
    function: {
      name: "analyzeNarrativeContext",
      description: "Analyze current disclosure narrative context to find related records using contextual intelligence",
      parameters: {
        type: "object",
        properties: {
          currentGraphContext: {
            type: "object",
            description: "Current mindmap graph context with nodes and center focus",
            properties: {
              nodes: {
                type: "array",
                description: "Current nodes in the mindmap graph",
                items: {
                  type: "object"
                }
              },
              centerNode: {
                type: "object",
                description: "Optional center node for context focus"
              },
              existingContext: {
                type: "string",
                description: "Optional existing contextual information"
              }
            },
            required: ["nodes"]
          },
          narrativeQuery: {
            type: "string",
            description: "Query describing the narrative context or relationship being explored"
          },
          searchDepth: {
            type: "string",
            enum: ["contextual", "comprehensive", "discovery"],
            description: "Depth of contextual analysis and record discovery"
          },
          disclosurePhase: {
            type: "string",
            enum: ["genesis", "investigation", "civilian", "modern", "disclosure"],
            description: "Optional specific phase of UFO disclosure timeline to focus on"
          },
          maxRelatedRecords: {
            type: "number",
            minimum: 1,
            maximum: 50,
            description: "Maximum number of related records to return"
          },
          includeGeographicContext: {
            type: "boolean",
            description: "Whether to include geographic proximity in relationship analysis"
          }
        },
        required: ["currentGraphContext", "narrativeQuery", "searchDepth", "maxRelatedRecords", "includeGeographicContext"]
      }
    }
  }
} as const

/**
 * Tool validation helpers - reusable across agents
 */
export function validateDatabaseSearchParams(params: any): params is DatabaseSearchParams {
  return (
    typeof params.query === 'string' &&
    typeof params.searchDepth === 'string' &&
    ['surface', 'detailed', 'comprehensive'].includes(params.searchDepth) &&
    typeof params.includeRelationships === 'boolean'
  )
}

export function validateGraphTransformParams(params: any): params is GraphTransformParams {
  return (
    Array.isArray(params.records) &&
    typeof params.query === 'string' &&
    params.sourceNode &&
    Array.isArray(params.existingNodes) &&
    typeof params.layoutType === 'string' &&
    ['horizontal', 'vertical', 'radial', 'grid'].includes(params.layoutType) &&
    params.transformationRules &&
    typeof params.transformationRules.enhanceWithSpatialIntelligence === 'boolean'
  )
}

export function validateResourceRAGParams(params: any): params is ResourceRAGParams {
  return (
    typeof params.query === 'string' &&
    typeof params.context === 'string' &&
    Array.isArray(params.resourceCategories) &&
    typeof params.maxResources === 'number' &&
    typeof params.relevanceThreshold === 'number' &&
    typeof params.synthesizeInsights === 'boolean'
  )
}

export function validateHistoricalAnalysisParams(params: any): params is HistoricalAnalysisParams {
  return (
    typeof params.entityId === 'string' &&
    typeof params.entityType === 'string' &&
    ['events', 'personnel', 'organizations', 'documents'].includes(params.entityType) &&
    typeof params.analysisDepth === 'string' &&
    ['timeline', 'comprehensive', 'narrative'].includes(params.analysisDepth) &&
    params.temporalWindow &&
    typeof params.temporalWindow.yearsBefore === 'number' &&
    typeof params.temporalWindow.yearsAfter === 'number' &&
    typeof params.includeDisclosureContext === 'boolean'
  )
}

export function validateNarrativeContextParams(params: any): params is NarrativeContextParams {
  return (
    params.currentGraphContext &&
    Array.isArray(params.currentGraphContext.nodes) &&
    typeof params.narrativeQuery === 'string' &&
    typeof params.searchDepth === 'string' &&
    ['contextual', 'comprehensive', 'discovery'].includes(params.searchDepth) &&
    typeof params.maxRelatedRecords === 'number' &&
    params.maxRelatedRecords >= 1 &&
    params.maxRelatedRecords <= 50 &&
    typeof params.includeGeographicContext === 'boolean'
  )
}

/**
 * Performance tracking utilities - universal across agents
 */
export interface PerformanceTracker {
  startTime: number
  recordsProcessed: number
  nodesCreated: number
  edgesCreated: number
  
  markStart(): void
  markRecordsProcessed(count: number): void
  markNodesCreated(count: number): void
  markEdgesCreated(count: number): void
  getMetrics(): {
    duration: number
    recordsProcessed: number
    nodesCreated: number
    edgesCreated: number
    recordsPerSecond: number
    nodesPerSecond: number
  }
}

export function createPerformanceTracker(): PerformanceTracker {
  return {
    startTime: 0,
    recordsProcessed: 0,
    nodesCreated: 0,
    edgesCreated: 0,
    
    markStart() {
      this.startTime = performance.now()
    },
    
    markRecordsProcessed(count: number) {
      this.recordsProcessed += count
    },
    
    markNodesCreated(count: number) {
      this.nodesCreated += count
    },
    
    markEdgesCreated(count: number) {
      this.edgesCreated += count
    },
    
    getMetrics() {
      const duration = performance.now() - this.startTime
      const durationSeconds = duration / 1000
      
      return {
        duration,
        recordsProcessed: this.recordsProcessed,
        nodesCreated: this.nodesCreated,
        edgesCreated: this.edgesCreated,
        recordsPerSecond: durationSeconds > 0 ? this.recordsProcessed / durationSeconds : 0,
        nodesPerSecond: durationSeconds > 0 ? this.nodesCreated / durationSeconds : 0
      }
    }
  }
}

/**
 * Agent registry for managing multiple agents with shared tools
 */
export interface AgentToolRegistry {
  registerAgent(agentId: string, tools: UltraterrestrialAgentTools): void
  getAgent(agentId: string): UltraterrestrialAgentTools | undefined
  listAgents(): string[]
  executeToolForAgent(agentId: string, toolName: string, params: any): Promise<AgentToolResult>
}

export function createAgentToolRegistry(): AgentToolRegistry {
  const agents = new Map<string, UltraterrestrialAgentTools>()
  
  return {
    registerAgent(agentId: string, tools: UltraterrestrialAgentTools) {
      agents.set(agentId, tools)
    },
    
    getAgent(agentId: string) {
      return agents.get(agentId)
    },
    
    listAgents() {
      return Array.from(agents.keys())
    },
    
    async executeToolForAgent(agentId: string, toolName: string, params: any) {
      const agent = agents.get(agentId)
      if (!agent) {
        throw new Error(`Agent ${agentId} not found in registry`)
      }
      
      switch (toolName) {
        case 'searchDatabase':
          return await agent.searchDatabase(params)
        case 'transformToGraph':
          return await agent.transformToGraph(params)
        case 'searchExternalResources':
          return await agent.searchExternalResources(params)
        case 'analyzeHistoricalContext':
          return await agent.analyzeHistoricalContext(params)
        case 'analyzeNarrativeContext':
          return await agent.analyzeNarrativeContext(params)
        default:
          throw new Error(`Unknown tool: ${toolName}`)
      }
    }
  }
}

/**
 * Tool execution wrapper for consistent error handling and performance tracking
 */
export async function executeAgentTool<T extends AgentToolResult>(
  toolName: string,
  toolFunction: () => Promise<T>,
  context: AgentExecutionContext
): Promise<T> {
  const tracker = createPerformanceTracker()
  tracker.markStart()
  
  try {
    const result = await toolFunction()
    
    // Update context performance metrics
    context.performanceMetrics.totalQueries++
    const metrics = tracker.getMetrics()
    context.performanceMetrics.averageResponseTime = 
      (context.performanceMetrics.averageResponseTime + metrics.duration) / 2
    
    if (result.success) {
      context.performanceMetrics.successRate = 
        ((context.performanceMetrics.successRate * (context.performanceMetrics.totalQueries - 1)) + 1) / 
        context.performanceMetrics.totalQueries
    }
    
    // Add performance data to result
    result.performance = {
      duration: metrics.duration,
      recordsProcessed: metrics.recordsProcessed,
      nodesCreated: metrics.nodesCreated,
      edgesCreated: metrics.edgesCreated
    }
    
    return result
  } catch (error) {
    const metrics = tracker.getMetrics()
    
    // Update failure metrics
    context.performanceMetrics.totalQueries++
    context.performanceMetrics.successRate = 
      ((context.performanceMetrics.successRate * (context.performanceMetrics.totalQueries - 1))) / 
      context.performanceMetrics.totalQueries
    
    return {
      success: false,
      message: `Tool ${toolName} failed`,
      error: error instanceof Error ? error.message : 'Unknown error',
      performance: {
        duration: metrics.duration,
        recordsProcessed: metrics.recordsProcessed,
        nodesCreated: metrics.nodesCreated,
        edgesCreated: metrics.edgesCreated
      }
    } as T
  }
}