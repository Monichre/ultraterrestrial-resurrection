import type { Node } from '@xyflow/react'
import { getNodeType, ENHANCED_FEATURES } from '@/features/mindmap/config/enhanced-node-mapping'
import { getGraphContext } from './contextual-intelligence'

export { getNodeType } from '@/features/mindmap/config/enhanced-node-mapping'

/**
 * Enhances node data with additional properties for the new UI components
 */
export function enhanceNodeData( node: Node, allNodes: Node[] ): Node {
  const graphContext = getGraphContext( allNodes )
  const isContextualNode = graphContext && graphContext.connectedEntityTypes.has( node.data?.type )

  const enhancedData = {
    ...node.data,

    // Contextual intelligence indicators
    isContextual: isContextualNode || node.data?.isContextual,
    contextInfo: node.data?.contextInfo || ( isContextualNode
      ? `Part of ${graphContext?.connectedEntityTypes.size || 0}-entity network`
      : undefined ),

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
    type: getNodeType( node.type || 'entityNode' ),
    data: enhancedData,
  }
}

/**
 * Upgrades a collection of nodes to use enhanced components
 */
export function upgradeNodesToEnhanced( nodes: Node[] ): Node[] {
  return nodes.map( node => enhanceNodeData( node, nodes ) )
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
  const graphContext = getGraphContext( allNodes )
  const isContextual = !!graphContext && allNodes.some( n => n.type !== 'userInputNode' )

  return {
    id,
    type: getNodeType( 'userInputNode' ),
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
  const graphContext = getGraphContext( allNodes )
  const isContextual = graphContext && graphContext.connectedEntityTypes.has( entityData.type )

  return {
    id,
    type: getNodeType( 'entityNode' ),
    position,
    data: {
      ...entityData,
      isContextual,
      contextInfo: isContextual
        ? `Related to ${graphContext?.keyPersonnel.length || 0} key figures`
        : undefined,

      // Enhanced data formatting
      formattedDate: entityData.date ? new Date( entityData.date ).toLocaleDateString() : undefined,

      // Display properties
      credibilityScore: entityData.credibility || entityData.authority || entityData.rank,
      hasPhotos: !!( entityData.photos && entityData.photos.length > 0 ),
      hasLocation: !!( entityData.latitude && entityData.longitude ),

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
export function analyzeNodeConnections( nodes: Node[] ): Map<string, number> {
  const connectionCounts = new Map<string, number>()

  // This would integrate with your existing connection analysis logic
  // For now, we'll use a simplified approach based on shared data properties

  nodes.forEach( node => {
    let connections = 0
    const nodeData = node.data

    // Count potential connections based on shared properties
    nodes.forEach( otherNode => {
      if ( node.id === otherNode.id ) return

      const otherData = otherNode.data

      // Check for direct relationships
      if ( nodeData?.witness?.name === otherData?.name ||
        nodeData?.organization?.name === otherData?.name ||
        nodeData?.name === otherData?.witness?.name ||
        nodeData?.name === otherData?.organization?.name ) {
        connections++
      }

      // Check for shared locations
      if ( nodeData?.location && otherData?.location &&
        nodeData.location === otherData.location ) {
        connections++
      }

      // Check for temporal proximity (same year)
      if ( nodeData?.date && otherData?.date ) {
        const nodeYear = new Date( nodeData.date ).getFullYear()
        const otherYear = new Date( otherData.date ).getFullYear()
        if ( Math.abs( nodeYear - otherYear ) <= 1 ) {
          connections++
        }
      }
    } )

    connectionCounts.set( node.id, connections )
  } )

  return connectionCounts
}

/**
 * Validates enhanced node data structure
 */
export function validateEnhancedNodeData( node: Node ): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Required properties
  if ( !node.id ) errors.push( 'Node missing required id' )
  if ( !node.type ) errors.push( 'Node missing required type' )
  if ( !node.data ) errors.push( 'Node missing required data' )

  // Enhanced node specific validations
  if ( node.data?.isContextual && !node.data?.contextInfo ) {
    warnings.push( 'Contextual node missing context info' )
  }

  if ( node.data?.type && !['events', 'personnel', 'organizations', 'testimonies', 'documents', 'topics'].includes( node.data.type ) ) {
    warnings.push( `Unknown entity type: ${node.data.type}` )
  }

  // Data quality checks
  if ( node.data?.credibilityScore && ( node.data.credibilityScore < 0 || node.data.credibilityScore > 10 ) ) {
    warnings.push( 'Credibility score should be between 0-10' )
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

  if ( nodes.length === 0 ) {
    return basePosition
  }

  if ( isContextual ) {
    // Position contextual nodes near related nodes
    const relatedNodes = nodes.filter( n => n.data?.isContextual )
    if ( relatedNodes.length > 0 ) {
      const avgX = relatedNodes.reduce( ( sum, n ) => sum + n.position.x, 0 ) / relatedNodes.length
      const avgY = relatedNodes.reduce( ( sum, n ) => sum + n.position.y, 0 ) / relatedNodes.length

      return {
        x: avgX + ( Math.random() - 0.5 ) * 200,
        y: avgY + ( Math.random() - 0.5 ) * 200
      }
    }
  }

  // Default positioning with some randomization
  const maxX = Math.max( ...nodes.map( n => n.position.x ) )
  const maxY = Math.max( ...nodes.map( n => n.position.y ) )

  return {
    x: maxX + 350,
    y: basePosition.y + ( nodes.length % 3 ) * 300
  }
}

// Debug utility interfaces
export interface NodeCollision {
  node1: Node
  node2: Node
  distance: number
  overlap: number
}

export interface LayoutDebugInfo {
  totalNodes: number
  collisions: NodeCollision[]
  averageDistance: number
  minDistance: number
  maxDistance: number
  recommendations: string[]
}

// Node positioning utilities
export interface NodeBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface PositionValidationResult {
  isValid: boolean
  conflicts: Node[]
  suggestedPosition?: { x: number; y: number }
}

/**
 * Detects overlapping nodes in the graph
 */
export function detectNodeCollisions(
  nodes: Node[],
  nodeWidth: number = 200,
  nodeHeight: number = 100,
  minDistance: number = 50
): NodeCollision[] {
  try {
    if ( !Array.isArray( nodes ) || nodes.length < 2 ) {
      return []
    }

    const collisions: NodeCollision[] = []

    for ( let i = 0; i < nodes.length; i++ ) {
      for ( let j = i + 1; j < nodes.length; j++ ) {
        const node1 = nodes[i]
        const node2 = nodes[j]

        if ( !node1?.position || !node2?.position ) {
          continue
        }

        const distance = calculateNodeDistance( node1, node2 )
        const requiredDistance = Math.sqrt(
          Math.pow( nodeWidth, 2 ) + Math.pow( nodeHeight, 2 )
        ) / 2 + minDistance

        if ( distance < requiredDistance ) {
          const overlap = requiredDistance - distance
          collisions.push( {
            node1,
            node2,
            distance,
            overlap
          } )
        }
      }
    }

    return collisions.sort( ( a, b ) => b.overlap - a.overlap ) // Sort by highest overlap first
  } catch ( error ) {
    console.error( 'detectNodeCollisions: Error detecting collisions:', error )
    return []
  }
}

/**
 * Calculates distance between two nodes
 */
export function calculateNodeDistance( node1: Node, node2: Node ): number {
  try {
    if ( !node1?.position || !node2?.position ) {
      return Infinity
    }

    const dx = node1.position.x - node2.position.x
    const dy = node1.position.y - node2.position.y
    return Math.sqrt( dx * dx + dy * dy )
  } catch ( error ) {
    console.warn( 'calculateNodeDistance: Error calculating distance:', error )
    return Infinity
  }
}

/**
 * Provides comprehensive debug information about node layout
 */
export function analyzeLayout(
  nodes: Node[],
  nodeWidth: number = 200,
  nodeHeight: number = 100
): LayoutDebugInfo {
  try {
    const collisions = detectNodeCollisions( nodes, nodeWidth, nodeHeight )
    const recommendations: string[] = []

    if ( nodes.length === 0 ) {
      return {
        totalNodes: 0,
        collisions: [],
        averageDistance: 0,
        minDistance: 0,
        maxDistance: 0,
        recommendations: ['No nodes in the graph']
      }
    }

    // Calculate distance statistics
    const distances: number[] = []
    for ( let i = 0; i < nodes.length; i++ ) {
      for ( let j = i + 1; j < nodes.length; j++ ) {
        const distance = calculateNodeDistance( nodes[i], nodes[j] )
        if ( distance !== Infinity ) {
          distances.push( distance )
        }
      }
    }

    const averageDistance = distances.length > 0 ?
      distances.reduce( ( sum, d ) => sum + d, 0 ) / distances.length : 0
    const minDistance = distances.length > 0 ? Math.min( ...distances ) : 0
    const maxDistance = distances.length > 0 ? Math.max( ...distances ) : 0

    // Generate recommendations
    if ( collisions.length > 0 ) {
      recommendations.push( `Found ${collisions.length} node collisions that need resolution` )
      recommendations.push( `Worst collision has ${collisions[0].overlap.toFixed( 1 )}px overlap` )
    }

    if ( minDistance < 100 ) {
      recommendations.push( 'Some nodes are too close together (< 100px)' )
    }

    if ( averageDistance > 500 ) {
      recommendations.push( 'Nodes might be too spread out for optimal viewing' )
    }

    if ( nodes.length > 20 ) {
      recommendations.push( 'Consider using hierarchical layout for better organization' )
    }

    if ( recommendations.length === 0 ) {
      recommendations.push( 'Layout looks good with no major issues detected' )
    }

    return {
      totalNodes: nodes.length,
      collisions,
      averageDistance,
      minDistance,
      maxDistance,
      recommendations
    }
  } catch ( error ) {
    console.error( 'analyzeLayout: Error analyzing layout:', error )
    return {
      totalNodes: nodes.length,
      collisions: [],
      averageDistance: 0,
      minDistance: 0,
      maxDistance: 0,
      recommendations: ['Error analyzing layout']
    }
  }
}

/**
 * Finds an optimal position for a new node that avoids collisions
 */
export function findOptimalPosition(
  existingNodes: Node[],
  preferredPosition: { x: number; y: number },
  nodeWidth: number = 200,
  nodeHeight: number = 100,
  minDistance: number = 50
): { x: number; y: number } {
  try {
    if ( !Array.isArray( existingNodes ) || existingNodes.length === 0 ) {
      return preferredPosition
    }

    // Check if preferred position is already good
    if ( isPositionValid( preferredPosition, existingNodes, nodeWidth, nodeHeight, minDistance ) ) {
      return preferredPosition
    }

    // Try spiral pattern around preferred position
    const maxRadius = 500
    const angleStep = Math.PI / 8 // 22.5 degrees
    const radiusStep = 50

    for ( let radius = radiusStep; radius <= maxRadius; radius += radiusStep ) {
      for ( let angle = 0; angle < 2 * Math.PI; angle += angleStep ) {
        const candidate = {
          x: preferredPosition.x + radius * Math.cos( angle ),
          y: preferredPosition.y + radius * Math.sin( angle )
        }

        if ( isPositionValid( candidate, existingNodes, nodeWidth, nodeHeight, minDistance ) ) {
          return candidate
        }
      }
    }

    // If no good position found, use fallback grid
    const gridSize = nodeWidth + minDistance
    let gridX = 0
    let gridY = 0

    while ( gridX < 2000 && gridY < 2000 ) {
      const candidate = { x: gridX, y: gridY }

      if ( isPositionValid( candidate, existingNodes, nodeWidth, nodeHeight, minDistance ) ) {
        return candidate
      }

      gridX += gridSize
      if ( gridX >= 2000 ) {
        gridX = 0
        gridY += gridSize
      }
    }

    // Ultimate fallback: return preferred position with warning
    console.warn( 'findOptimalPosition: Could not find collision-free position, using preferred position' )
    return preferredPosition
  } catch ( error ) {
    console.error( 'findOptimalPosition: Error finding optimal position:', error )
    return preferredPosition
  }
}

/**
 * Checks if a position is valid (no collisions)
 */
export function isPositionValid(
  position: { x: number; y: number },
  existingNodes: Node[],
  nodeWidth: number = 200,
  nodeHeight: number = 100,
  minDistance: number = 50
): boolean {
  try {
    if ( !Array.isArray( existingNodes ) ) {
      return true
    }

    const requiredDistance = Math.sqrt(
      Math.pow( nodeWidth, 2 ) + Math.pow( nodeHeight, 2 )
    ) / 2 + minDistance

    for ( const node of existingNodes ) {
      if ( !node?.position ) continue

      const distance = Math.sqrt(
        Math.pow( position.x - node.position.x, 2 ) +
        Math.pow( position.y - node.position.y, 2 )
      )

      if ( distance < requiredDistance ) {
        return false
      }
    }

    return true
  } catch ( error ) {
    console.warn( 'isPositionValid: Error validating position:', error )
    return false
  }
}

/**
 * Validates a node position and provides suggestions
 */
export function validateNodePosition(
  targetNode: Node,
  allNodes: Node[],
  nodeWidth: number = 200,
  nodeHeight: number = 100
): PositionValidationResult {
  try {
    if ( !targetNode?.position ) {
      return {
        isValid: false,
        conflicts: [],
        suggestedPosition: { x: 0, y: 0 }
      }
    }

    const otherNodes = allNodes.filter( node => node.id !== targetNode.id )
    const conflicts: Node[] = []
    const minDistance = 50

    // Check for conflicts
    for ( const node of otherNodes ) {
      if ( !node?.position ) continue

      const distance = calculateNodeDistance( targetNode, node )
      const requiredDistance = Math.sqrt(
        Math.pow( nodeWidth, 2 ) + Math.pow( nodeHeight, 2 )
      ) / 2 + minDistance

      if ( distance < requiredDistance ) {
        conflicts.push( node )
      }
    }

    const isValid = conflicts.length === 0

    // If not valid, suggest a better position
    let suggestedPosition: { x: number; y: number } | undefined
    if ( !isValid ) {
      suggestedPosition = findOptimalPosition(
        otherNodes,
        targetNode.position,
        nodeWidth,
        nodeHeight,
        minDistance
      )
    }

    return {
      isValid,
      conflicts,
      suggestedPosition
    }
  } catch ( error ) {
    console.error( 'validateNodePosition: Error validating node position:', error )
    return {
      isValid: false,
      conflicts: [],
      suggestedPosition: { x: 0, y: 0 }
    }
  }
}

/**
 * Resolves node collisions by adjusting positions
 */
export function resolveCollisions(
  nodes: Node[],
  nodeWidth: number = 200,
  nodeHeight: number = 100
): Node[] {
  try {
    if ( !Array.isArray( nodes ) || nodes.length < 2 ) {
      return nodes
    }

    const resolvedNodes = [...nodes]
    const collisions = detectNodeCollisions( resolvedNodes, nodeWidth, nodeHeight )

    // Sort by overlap severity and resolve one by one
    for ( const collision of collisions ) {
      const node1Index = resolvedNodes.findIndex( n => n.id === collision.node1.id )
      const node2Index = resolvedNodes.findIndex( n => n.id === collision.node2.id )

      if ( node1Index === -1 || node2Index === -1 ) continue

      // Move the second node to avoid collision
      const newPosition = findOptimalPosition(
        resolvedNodes.filter( n => n.id !== collision.node2.id ),
        collision.node2.position,
        nodeWidth,
        nodeHeight
      )

      resolvedNodes[node2Index] = {
        ...resolvedNodes[node2Index],
        position: newPosition
      }
    }

    return resolvedNodes
  } catch ( error ) {
    console.error( 'resolveCollisions: Error resolving collisions:', error )
    return nodes
  }
}

/**
 * Debug logging function for layout issues
 */
export function logLayoutDebug( nodes: Node[], context: string = '' ): void {
  try {
    const debugInfo = analyzeLayout( nodes )

    console.group( `🔍 Layout Debug ${context ? `(${context})` : ''}` )
    console.log( `Total nodes: ${debugInfo.totalNodes}` )
    console.log( `Collisions: ${debugInfo.collisions.length}` )
    console.log( `Average distance: ${debugInfo.averageDistance.toFixed( 1 )}px` )
    console.log( `Min distance: ${debugInfo.minDistance.toFixed( 1 )}px` )
    console.log( `Max distance: ${debugInfo.maxDistance.toFixed( 1 )}px` )

    if ( debugInfo.collisions.length > 0 ) {
      console.warn( 'Collision details:', debugInfo.collisions )
    }

    console.log( 'Recommendations:', debugInfo.recommendations )
    console.groupEnd()
  } catch ( error ) {
    console.error( 'logLayoutDebug: Error logging debug info:', error )
  }
}

// Export helper types
export type { NodeCollision, LayoutDebugInfo, NodeBounds, PositionValidationResult }