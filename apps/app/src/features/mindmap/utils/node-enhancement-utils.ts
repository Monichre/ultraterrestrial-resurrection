import type { Node } from '@xyflow/react'
import { getNodeType, ENHANCED_FEATURES } from '@/features/mindmap/config/enhanced-node-mapping'
import { getGraphContext } from './contextual-intelligence'

/**
 * Enhances node data with additional properties for the new UI components
 */
export function enhanceNodeData(node: Node, allNodes: Node[]): Node {
  const graphContext = getGraphContext(allNodes)
  const isContextualNode = graphContext && graphContext.connectedEntityTypes.has(node.data?.type)
  
  const enhancedData = {
    ...node.data,
    
    // Contextual intelligence indicators
    isContextual: isContextualNode || node.data?.isContextual,
    contextInfo: node.data?.contextInfo || (isContextualNode 
      ? `Part of ${graphContext?.connectedEntityTypes.size || 0}-entity network`
      : undefined),
    
    // Enhanced visual properties
    credibilityScore: node.data?.credibility || node.data?.authority || node.data?.rank,
    connectionCount: 0, // Will be calculated by the component
    
    // Research integration
    isBookmarked: node.data?.isBookmarked || false,
    hasNotes: node.data?.hasNotes || false,
    
    // UI state
    isExpanded: node.data?.isExpanded || false,
    lastInteraction: node.data?.lastInteraction || Date.now(),
  }
  
  return {
    ...node,
    type: getNodeType(node.type || 'entityNode'),
    data: enhancedData,
  }
}

/**
 * Upgrades a collection of nodes to use enhanced components
 */
export function upgradeNodesToEnhanced(nodes: Node[]): Node[] {
  return nodes.map(node => enhanceNodeData(node, nodes))
}

/**
 * Creates an enhanced user input node with contextual awareness
 */
export function createEnhancedUserInputNode(
  id: string,
  input: string,
  position: { x: number; y: number },
  allNodes: Node[],
  entityType?: string
): Node {
  const graphContext = getGraphContext(allNodes)
  const isContextual = !!graphContext && allNodes.some(n => n.type !== 'userInputNode')
  
  return {
    id,
    type: getNodeType('userInputNode'),
    position,
    data: {
      input,
      label: isContextual ? 'Contextual Search' : 'Your Query',
      type: entityType,
      isContextual,
      contextInfo: isContextual 
        ? `Building on ${graphContext?.connectedEntityTypes.size || 0} connected entity types`
        : 'Starting open exploration',
      isLoading: false,
      hasContent: true,
      lastUpdated: Date.now(),
    },
  }
}

/**
 * Creates an enhanced entity node with rich UFO data display
 */
export function createEnhancedEntityNode(
  id: string,
  entityData: any,
  position: { x: number; y: number },
  allNodes: Node[]
): Node {
  const graphContext = getGraphContext(allNodes)
  const isContextual = graphContext && graphContext.connectedEntityTypes.has(entityData.type)
  
  return {
    id,
    type: getNodeType('entityNode'),
    position,
    data: {
      ...entityData,
      isContextual,
      contextInfo: isContextual 
        ? `Related to ${graphContext?.keyPersonnel.length || 0} key figures`
        : undefined,
      
      // Enhanced data formatting
      formattedDate: entityData.date ? new Date(entityData.date).toLocaleDateString() : undefined,
      
      // Display properties
      credibilityScore: entityData.credibility || entityData.authority || entityData.rank,
      hasPhotos: !!(entityData.photos && entityData.photos.length > 0),
      hasLocation: !!(entityData.latitude && entityData.longitude),
      
      // UI state
      isExpanded: false,
      isBookmarked: false,
      lastViewed: Date.now(),
    },
  }
}

/**
 * Analyzes node relationships and adds connection metadata
 */
export function analyzeNodeConnections(nodes: Node[]): Map<string, number> {
  const connectionCounts = new Map<string, number>()
  
  // This would integrate with your existing connection analysis logic
  // For now, we'll use a simplified approach based on shared data properties
  
  nodes.forEach(node => {
    let connections = 0
    const nodeData = node.data
    
    // Count potential connections based on shared properties
    nodes.forEach(otherNode => {
      if (node.id === otherNode.id) return
      
      const otherData = otherNode.data
      
      // Check for direct relationships
      if (nodeData?.witness?.name === otherData?.name ||
          nodeData?.organization?.name === otherData?.name ||
          nodeData?.name === otherData?.witness?.name ||
          nodeData?.name === otherData?.organization?.name) {
        connections++
      }
      
      // Check for shared locations
      if (nodeData?.location && otherData?.location && 
          nodeData.location === otherData.location) {
        connections++
      }
      
      // Check for temporal proximity (same year)
      if (nodeData?.date && otherData?.date) {
        const nodeYear = new Date(nodeData.date).getFullYear()
        const otherYear = new Date(otherData.date).getFullYear()
        if (Math.abs(nodeYear - otherYear) <= 1) {
          connections++
        }
      }
    })
    
    connectionCounts.set(node.id, connections)
  })
  
  return connectionCounts
}

/**
 * Validates enhanced node data structure
 */
export function validateEnhancedNodeData(node: Node): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required properties
  if (!node.id) errors.push('Node missing required id')
  if (!node.type) errors.push('Node missing required type')
  if (!node.data) errors.push('Node missing required data')
  
  // Enhanced node specific validations
  if (node.data?.isContextual && !node.data?.contextInfo) {
    warnings.push('Contextual node missing context info')
  }
  
  if (node.data?.type && !['events', 'personnel', 'organizations', 'testimonies', 'documents', 'topics'].includes(node.data.type)) {
    warnings.push(`Unknown entity type: ${node.data.type}`)
  }
  
  // Data quality checks
  if (node.data?.credibilityScore && (node.data.credibilityScore < 0 || node.data.credibilityScore > 10)) {
    warnings.push('Credibility score should be between 0-10')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Generates enhanced node positioning for better visual layout
 */
export function calculateEnhancedNodePosition(
  nodes: Node[],
  newNodeType: string,
  isContextual: boolean
): { x: number; y: number } {
  const basePosition = { x: 100, y: 100 }
  
  if (nodes.length === 0) {
    return basePosition
  }
  
  if (isContextual) {
    // Position contextual nodes near related nodes
    const relatedNodes = nodes.filter(n => n.data?.isContextual)
    if (relatedNodes.length > 0) {
      const avgX = relatedNodes.reduce((sum, n) => sum + n.position.x, 0) / relatedNodes.length
      const avgY = relatedNodes.reduce((sum, n) => sum + n.position.y, 0) / relatedNodes.length
      
      return {
        x: avgX + (Math.random() - 0.5) * 200,
        y: avgY + (Math.random() - 0.5) * 200
      }
    }
  }
  
  // Default positioning with some randomization
  const maxX = Math.max(...nodes.map(n => n.position.x))
  const maxY = Math.max(...nodes.map(n => n.position.y))
  
  return {
    x: maxX + 350,
    y: basePosition.y + (nodes.length % 3) * 300
  }
}