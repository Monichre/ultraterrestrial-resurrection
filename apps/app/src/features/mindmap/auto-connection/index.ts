/**
 * Smart Contextual Node Auto-Connection System
 * 
 * This module provides intelligent auto-connection capabilities for mindmap nodes
 * based on contextual intelligence, spatial relationships, and temporal proximity.
 * 
 * Key Features:
 * - Contextual Intelligence Integration: Uses existing contextual intelligence 
 *   to identify meaningful relationships between entities
 * - Spatial Awareness: Leverages spatial grouping to detect proximity-based connections
 * - Temporal Analysis: Analyzes temporal relationships and chronological patterns
 * - AI-Enhanced Analysis: Uses OpenAI for sophisticated connection reasoning
 * - User Control: Provides configuration options and manual override capabilities
 * 
 * Architecture Integration:
 * - Built on existing Contextual Intelligence foundation
 * - Uses Enhanced Nodes for consistent UI presentation
 * - Integrates with Spatial Intelligence for proximity analysis
 * - Maintains compatibility with existing tour systems
 * 
 * Usage:
 * ```tsx
 * import { SmartMindmapWithAutoConnections } from '@/features/mindmap/auto-connection'
 * 
 * function MyMindmap() {
 *   return <SmartMindmapWithAutoConnections />
 * }
 * ```
 */

// Core hook for auto-connection functionality
export { useSmartAutoConnection } from '../hooks/use-smart-auto-connection'

// UI components
export { SmartAutoConnectionPanel } from '../components/smart-auto-connection-panel'

// Enhanced mindmap components
export { 
  SmartMindmapWithAutoConnections,
  WrapWithSmartConnections,
  AutoConnectionEnabledGraph
} from '../smart-mindmap-with-auto-connections'

// Server actions for AI analysis
export { 
  analyzeSmartConnections,
  quickConnectionAnalysis,
  type ConnectionAnalysisRequest,
  type ConnectionAnalysisResult
} from '../actions/smart-connection-analysis'

// Type definitions
export type {
  AutoConnectionCandidate,
  SmartConnectionSuggestion,
  SmartAutoConnectionOptions
} from '../hooks/use-smart-auto-connection'

/**
 * Default configuration for auto-connection system
 */
export const DEFAULT_AUTO_CONNECTION_CONFIG = {
  enableAutoSuggestion: true,
  autoConnectThreshold: 0.85,
  suggestionThreshold: 0.6,
  maxSuggestions: 5,
  spatialProximityWeight: 0.3,
  contextualRelevanceWeight: 0.5,
  temporalProximityWeight: 0.2,
  maxConnectionDistance: 250,
  debounceMs: 1000
} as const

/**
 * Helper function to determine if auto-connections are beneficial for a given graph
 */
export function shouldEnableAutoConnections(nodeCount: number, existingEdgeCount: number): boolean {
  // Enable if we have enough nodes but sparse connections
  const connectionDensity = existingEdgeCount / Math.max(1, nodeCount * (nodeCount - 1) / 2)
  return nodeCount >= 3 && connectionDensity < 0.3
}

/**
 * Helper function to calculate optimal auto-connection settings based on graph characteristics
 */
export function getOptimalAutoConnectionSettings(
  nodeCount: number, 
  averageNodeDistance: number,
  entityTypeDistribution: Record<string, number>
) {
  const config = { ...DEFAULT_AUTO_CONNECTION_CONFIG }
  
  // Adjust thresholds based on node count
  if (nodeCount > 20) {
    config.autoConnectThreshold = 0.9 // Be more selective with many nodes
    config.suggestionThreshold = 0.7
  } else if (nodeCount < 5) {
    config.autoConnectThreshold = 0.7 // Be more permissive with few nodes
    config.suggestionThreshold = 0.5
  }
  
  // Adjust distance based on average spacing
  if (averageNodeDistance > 300) {
    config.maxConnectionDistance = Math.min(500, averageNodeDistance * 0.8)
  }
  
  // Adjust weights based on entity diversity
  const uniqueTypes = Object.keys(entityTypeDistribution).length
  if (uniqueTypes === 1) {
    // Homogeneous entities - focus more on spatial and temporal
    config.contextualRelevanceWeight = 0.3
    config.spatialProximityWeight = 0.4
    config.temporalProximityWeight = 0.3
  } else if (uniqueTypes > 5) {
    // Diverse entities - rely more on contextual intelligence
    config.contextualRelevanceWeight = 0.6
    config.spatialProximityWeight = 0.2
    config.temporalProximityWeight = 0.2
  }
  
  return config
}