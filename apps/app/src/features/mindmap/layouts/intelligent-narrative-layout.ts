'use client'

import type { Node, Edge, XYPosition } from '@xyflow/react'
import type { SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'
import type { GraphContext } from '@/features/mindmap/utils/contextual-intelligence'

export interface NarrativeLayoutConfig {
  storyflowDirection: 'chronological' | 'thematic' | 'radial' | 'hierarchical'
  nodeSpacing: {
    horizontal: number
    vertical: number
    groupPadding: number
  }
  narrativeArcs: {
    enableStoryArcs: boolean
    arcTension: number // 0-1, how curved the narrative flow is
    arcHeight: number
  }
  temporalAlignment: {
    enforceChronology: boolean
    timelineAxis: 'horizontal' | 'vertical'
    yearSpacing: number
  }
  importanceWeighting: {
    significanceRadius: number // Higher significance = more central
    tourWaypointWeight: number // Weight for tour-specific nodes
    connectionWeight: number // Weight for highly connected nodes
  }
}

export interface NarrativeLayoutResult {
  nodes: Node[]
  edges: Edge[]
  narrativeFlow: {
    primaryPath: string[] // Node IDs in narrative order
    secondaryPaths: string[][] // Alternative narrative branches
    keyMoments: Array<{
      nodeId: string
      narrativeSignificance: 'climax' | 'turning-point' | 'revelation' | 'foundation'
      position: XYPosition
    }>
  }
  spatialZones: Array<{
    id: string
    type: 'introduction' | 'rising-action' | 'climax' | 'resolution' | 'epilogue'
    center: XYPosition
    radius: number
    nodeIds: string[]
  }>
}

const DEFAULT_LAYOUT_CONFIG: NarrativeLayoutConfig = {
  storyflowDirection: 'chronological',
  nodeSpacing: {
    horizontal: 200,
    vertical: 150,
    groupPadding: 50
  },
  narrativeArcs: {
    enableStoryArcs: true,
    arcTension: 0.6,
    arcHeight: 100
  },
  temporalAlignment: {
    enforceChronology: true,
    timelineAxis: 'horizontal',
    yearSpacing: 150
  },
  importanceWeighting: {
    significanceRadius: 300,
    tourWaypointWeight: 2.0,
    connectionWeight: 1.5
  }
}

/**
 * Intelligent Layout Engine for Narrative-Driven Node Positioning
 * Positions nodes to support storytelling and chronological flow
 */
export class IntelligentNarrativeLayout {
  private config: NarrativeLayoutConfig
  private canvasSize: { width: number, height: number }
  
  constructor(
    config: Partial<NarrativeLayoutConfig> = {},
    canvasSize: { width: number, height: number } = { width: 1200, height: 800 }
  ) {
    this.config = { ...DEFAULT_LAYOUT_CONFIG, ...config }
    this.canvasSize = canvasSize
  }
  
  /**
   * Apply intelligent narrative layout to nodes
   */
  applyNarrativeLayout(
    nodes: Node[],
    edges: Edge[],
    spatialGroups: SpatialGroup[],
    tourContext?: GraphContext['tourContext']
  ): NarrativeLayoutResult {
    
    // Step 1: Analyze narrative structure
    const narrativeAnalysis = this.analyzeNarrativeStructure(nodes, edges, tourContext)
    
    // Step 2: Create temporal backbone
    const temporalBackbone = this.createTemporalBackbone(nodes, narrativeAnalysis)
    
    // Step 3: Position nodes using narrative intelligence
    const positionedNodes = this.positionNodesNarratively(
      nodes, 
      edges, 
      temporalBackbone, 
      spatialGroups, 
      narrativeAnalysis
    )
    
    // Step 4: Create narrative flow connections
    const narrativeEdges = this.createNarrativeEdges(edges, positionedNodes, narrativeAnalysis)
    
    // Step 5: Define spatial zones
    const spatialZones = this.createSpatialZones(positionedNodes, narrativeAnalysis)
    
    return {
      nodes: positionedNodes,
      edges: narrativeEdges,
      narrativeFlow: {
        primaryPath: narrativeAnalysis.primaryNarrativePath,
        secondaryPaths: narrativeAnalysis.secondaryPaths,
        keyMoments: narrativeAnalysis.keyMoments.map(moment => ({
          ...moment,
          position: positionedNodes.find(n => n.id === moment.nodeId)?.position || { x: 0, y: 0 }
        }))
      },
      spatialZones
    }
  }
  
  /**
   * Analyze the narrative structure of the current node graph
   */
  private analyzeNarrativeStructure(
    nodes: Node[], 
    edges: Edge[], 
    tourContext?: GraphContext['tourContext']
  ) {
    // Extract temporal information
    const temporalNodes = this.extractTemporalNodes(nodes)
    
    // Identify narrative significance
    const significanceScores = this.calculateNarrativeSignificance(nodes, edges, tourContext)
    
    // Create primary narrative path
    const primaryNarrativePath = this.buildPrimaryNarrativePath(temporalNodes, significanceScores)
    
    // Identify key narrative moments
    const keyMoments = this.identifyKeyNarrativeMoments(nodes, significanceScores, tourContext)
    
    // Find alternative narrative branches
    const secondaryPaths = this.findSecondaryNarrativePaths(nodes, edges, primaryNarrativePath)
    
    return {
      temporalNodes,
      significanceScores,
      primaryNarrativePath,
      keyMoments,
      secondaryPaths,
      narrativeThemes: this.extractNarrativeThemes(nodes, tourContext)
    }
  }
  
  /**
   * Extract temporal information from nodes
   */
  private extractTemporalNodes(nodes: Node[]) {
    return nodes
      .map(node => {
        const date = this.extractDateFromNode(node)
        return {
          nodeId: node.id,
          date,
          year: date ? date.getFullYear() : null,
          temporalWeight: date ? 1.0 : 0.3 // Lower weight for nodes without dates
        }
      })
      .filter(item => item.year !== null)
      .sort((a, b) => (a.year || 0) - (b.year || 0))
  }
  
  /**
   * Calculate narrative significance scores for each node
   */
  private calculateNarrativeSignificance(
    nodes: Node[], 
    edges: Edge[], 
    tourContext?: GraphContext['tourContext']
  ): Map<string, number> {
    const scores = new Map<string, number>()
    
    nodes.forEach(node => {
      let score = 0
      
      // Base significance from node properties
      if (node.data?.significance === 'high') score += 3
      else if (node.data?.significance === 'medium') score += 2
      else score += 1
      
      // Tour waypoint bonus
      if (tourContext && node.data?.waypointId === tourContext.currentWaypointId) {
        score += this.config.importanceWeighting.tourWaypointWeight
      }
      
      // Connection count bonus
      const connectionCount = edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length
      score += connectionCount * this.config.importanceWeighting.connectionWeight * 0.1
      
      // Historical importance keywords
      const nodeText = (node.data?.title || node.data?.name || '').toLowerCase()
      if (this.containsHistoricalKeywords(nodeText)) {
        score += 1.5
      }
      
      // Roswell bonus (special narrative significance)
      if (nodeText.includes('roswell')) {
        score += 2.0
      }
      
      scores.set(node.id, score)
    })
    
    return scores
  }
  
  /**
   * Build the primary narrative path through the data
   */
  private buildPrimaryNarrativePath(
    temporalNodes: Array<{ nodeId: string, year: number | null }>,
    significanceScores: Map<string, number>
  ): string[] {
    // Sort by combination of temporal order and narrative significance
    return temporalNodes
      .sort((a, b) => {
        const yearA = a.year || 0
        const yearB = b.year || 0
        const scoreA = significanceScores.get(a.nodeId) || 0
        const scoreB = significanceScores.get(b.nodeId) || 0
        
        // Primary sort by year, secondary by significance
        if (yearA !== yearB) {
          return yearA - yearB
        }
        return scoreB - scoreA // Higher significance first for same year
      })
      .map(item => item.nodeId)
  }
  
  /**
   * Identify key narrative moments (climax, turning points, etc.)
   */
  private identifyKeyNarrativeMoments(
    nodes: Node[], 
    significanceScores: Map<string, number>,
    tourContext?: GraphContext['tourContext']
  ) {
    const keyMoments: Array<{
      nodeId: string
      narrativeSignificance: 'climax' | 'turning-point' | 'revelation' | 'foundation'
    }> = []
    
    // Find the highest significance node (climax)
    let maxScore = 0
    let climaxNodeId = ''
    significanceScores.forEach((score, nodeId) => {
      if (score > maxScore) {
        maxScore = score
        climaxNodeId = nodeId
      }
    })
    
    if (climaxNodeId) {
      keyMoments.push({
        nodeId: climaxNodeId,
        narrativeSignificance: 'climax'
      })
    }
    
    // Identify foundation events (early high-significance events)
    nodes.forEach(node => {
      const date = this.extractDateFromNode(node)
      const year = date ? date.getFullYear() : null
      const score = significanceScores.get(node.id) || 0
      const nodeText = (node.data?.title || node.data?.name || '').toLowerCase()
      
      // Roswell and early significant events are foundations
      if ((year && year < 1950 && score > 2) || nodeText.includes('roswell')) {
        keyMoments.push({
          nodeId: node.id,
          narrativeSignificance: 'foundation'
        })
      }
      
      // Pentagon videos and modern disclosure are revelations
      if (nodeText.includes('pentagon') || nodeText.includes('tic tac') || 
          (year && year > 2015 && score > 2)) {
        keyMoments.push({
          nodeId: node.id,
          narrativeSignificance: 'revelation'
        })
      }
      
      // Blue Book ending, Phoenix Lights, etc. are turning points
      if (nodeText.includes('blue book') || nodeText.includes('phoenix') ||
          nodeText.includes('project') && score > 1.5) {
        keyMoments.push({
          nodeId: node.id,
          narrativeSignificance: 'turning-point'
        })
      }
    })
    
    return keyMoments
  }
  
  /**
   * Create temporal backbone for chronological positioning
   */
  private createTemporalBackbone(
    nodes: Node[], 
    narrativeAnalysis: any
  ) {
    const { temporalNodes } = narrativeAnalysis
    
    if (!this.config.temporalAlignment.enforceChronology) {
      return null
    }
    
    const minYear = Math.min(...temporalNodes.map((n: any) => n.year))
    const maxYear = Math.max(...temporalNodes.map((n: any) => n.year))
    const yearRange = maxYear - minYear
    
    // Create backbone positions
    const backbone = temporalNodes.map((node: any, index: number) => {
      const yearProgress = yearRange > 0 ? (node.year - minYear) / yearRange : 0
      
      let position: XYPosition
      if (this.config.temporalAlignment.timelineAxis === 'horizontal') {
        position = {
          x: 100 + (yearProgress * (this.canvasSize.width - 200)),
          y: this.canvasSize.height / 2
        }
      } else {
        position = {
          x: this.canvasSize.width / 2,
          y: 100 + (yearProgress * (this.canvasSize.height - 200))
        }
      }
      
      return {
        nodeId: node.nodeId,
        year: node.year,
        backbonePosition: position,
        temporalIndex: index
      }
    })
    
    return backbone
  }
  
  /**
   * Position nodes using narrative intelligence
   */
  private positionNodesNarratively(
    nodes: Node[],
    edges: Edge[],
    temporalBackbone: any,
    spatialGroups: SpatialGroup[],
    narrativeAnalysis: any
  ): Node[] {
    const { significanceScores, keyMoments, primaryNarrativePath } = narrativeAnalysis
    
    return nodes.map(node => {
      const nodeSignificance = significanceScores.get(node.id) || 1
      const isKeyMoment = keyMoments.some((moment: any) => moment.nodeId === node.id)
      const isOnPrimaryPath = primaryNarrativePath.includes(node.id)
      
      let position: XYPosition
      
      // Use temporal backbone if available
      if (temporalBackbone) {
        const backboneEntry = temporalBackbone.find((entry: any) => entry.nodeId === node.id)
        if (backboneEntry) {
          position = this.adjustPositionForNarrative(
            backboneEntry.backbonePosition,
            nodeSignificance,
            isKeyMoment,
            isOnPrimaryPath,
            spatialGroups,
            node
          )
        } else {
          // Node without temporal data - position based on connections and significance
          position = this.positionNonTemporalNode(node, nodes, edges, significanceScores)
        }
      } else {
        // Thematic or radial layout
        position = this.positionByNarrativeFlow(
          node,
          narrativeAnalysis,
          nodeSignificance,
          isKeyMoment,
          isOnPrimaryPath
        )
      }
      
      return {
        ...node,
        position
      }
    })
  }
  
  /**
   * Adjust position based on narrative importance
   */
  private adjustPositionForNarrative(
    basePosition: XYPosition,
    significance: number,
    isKeyMoment: boolean,
    isOnPrimaryPath: boolean,
    spatialGroups: SpatialGroup[],
    node: Node
  ): XYPosition {
    const { importanceWeighting, nodeSpacing, narrativeArcs } = this.config
    
    let adjustedPosition = { ...basePosition }
    
    // Key moments get more central positioning
    if (isKeyMoment) {
      const centerX = this.canvasSize.width / 2
      const centerY = this.canvasSize.height / 2
      
      // Pull towards center based on significance
      const pullStrength = Math.min(significance / 5, 0.6) // Max 60% pull
      adjustedPosition.x = basePosition.x + (centerX - basePosition.x) * pullStrength
      adjustedPosition.y = basePosition.y + (centerY - basePosition.y) * pullStrength
    }
    
    // Primary path nodes stay closer to the main timeline
    if (isOnPrimaryPath) {
      // Reduce vertical offset from timeline
      const timelineY = this.canvasSize.height / 2
      const offsetFromTimeline = adjustedPosition.y - timelineY
      adjustedPosition.y = timelineY + (offsetFromTimeline * 0.7)
    }
    
    // Add narrative arc curvature
    if (narrativeArcs.enableStoryArcs) {
      const progressThroughCanvas = adjustedPosition.x / this.canvasSize.width
      const arcOffset = Math.sin(progressThroughCanvas * Math.PI) * narrativeArcs.arcHeight * narrativeArcs.arcTension
      adjustedPosition.y += arcOffset
    }
    
    // Ensure nodes don't overlap
    adjustedPosition = this.avoidNodeOverlap(adjustedPosition, nodeSpacing)
    
    return adjustedPosition
  }
  
  /**
   * Position nodes without temporal data
   */
  private positionNonTemporalNode(
    node: Node,
    allNodes: Node[],
    edges: Edge[],
    significanceScores: Map<string, number>
  ): XYPosition {
    const significance = significanceScores.get(node.id) || 1
    
    // Find connected nodes that already have positions
    const connectedNodeIds = edges
      .filter(edge => edge.source === node.id || edge.target === node.id)
      .map(edge => edge.source === node.id ? edge.target : edge.source)
    
    const connectedNodes = allNodes.filter(n => connectedNodeIds.includes(n.id) && n.position)
    
    if (connectedNodes.length > 0) {
      // Position near connected nodes
      const avgX = connectedNodes.reduce((sum, n) => sum + (n.position?.x || 0), 0) / connectedNodes.length
      const avgY = connectedNodes.reduce((sum, n) => sum + (n.position?.y || 0), 0) / connectedNodes.length
      
      // Add some randomness to avoid exact overlap
      const offsetX = (Math.random() - 0.5) * this.config.nodeSpacing.horizontal
      const offsetY = (Math.random() - 0.5) * this.config.nodeSpacing.vertical
      
      return {
        x: avgX + offsetX,
        y: avgY + offsetY
      }
    } else {
      // Position based on significance (higher significance = more central)
      const centerX = this.canvasSize.width / 2
      const centerY = this.canvasSize.height / 2
      const maxRadius = Math.min(this.canvasSize.width, this.canvasSize.height) / 3
      
      const radius = maxRadius * (1 - Math.min(significance / 5, 0.8))
      const angle = Math.random() * 2 * Math.PI
      
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      }
    }
  }
  
  /**
   * Position by narrative flow (for non-temporal layouts)
   */
  private positionByNarrativeFlow(
    node: Node,
    narrativeAnalysis: any,
    significance: number,
    isKeyMoment: boolean,
    isOnPrimaryPath: boolean
  ): XYPosition {
    const { storyflowDirection } = this.config
    const { primaryNarrativePath } = narrativeAnalysis
    
    const pathIndex = primaryNarrativePath.indexOf(node.id)
    const pathProgress = pathIndex >= 0 ? pathIndex / (primaryNarrativePath.length - 1) : 0.5
    
    switch (storyflowDirection) {
      case 'radial':
        return this.positionRadial(node, significance, isKeyMoment, pathProgress)
      
      case 'hierarchical':
        return this.positionHierarchical(node, significance, isKeyMoment, pathIndex)
      
      case 'thematic':
        return this.positionThematic(node, narrativeAnalysis, significance)
      
      default: // chronological
        return this.positionChronological(node, pathProgress, significance, isKeyMoment)
    }
  }
  
  /**
   * Create narrative flow edges
   */
  private createNarrativeEdges(
    originalEdges: Edge[],
    positionedNodes: Node[],
    narrativeAnalysis: any
  ): Edge[] {
    const narrativeEdges = [...originalEdges]
    
    // Add narrative flow edges for primary path
    const { primaryNarrativePath } = narrativeAnalysis
    
    for (let i = 0; i < primaryNarrativePath.length - 1; i++) {
      const sourceId = primaryNarrativePath[i]
      const targetId = primaryNarrativePath[i + 1]
      
      // Only add if edge doesn't already exist
      const edgeExists = originalEdges.some(edge => 
        (edge.source === sourceId && edge.target === targetId) ||
        (edge.source === targetId && edge.target === sourceId)
      )
      
      if (!edgeExists) {
        narrativeEdges.push({
          id: `narrative-flow-${i}`,
          source: sourceId,
          target: targetId,
          type: 'narrativeFlow',
          data: {
            isNarrativeFlow: true,
            narrativeIndex: i
          },
          style: {
            stroke: '#4ade80',
            strokeWidth: 2,
            strokeDasharray: '5,5',
            opacity: 0.7
          }
        })
      }
    }
    
    return narrativeEdges
  }
  
  /**
   * Create spatial zones for different parts of the narrative
   */
  private createSpatialZones(
    positionedNodes: Node[],
    narrativeAnalysis: any
  ) {
    const zones: Array<{
      id: string
      type: 'introduction' | 'rising-action' | 'climax' | 'resolution' | 'epilogue'
      center: XYPosition
      radius: number
      nodeIds: string[]
    }> = []
    
    const { keyMoments, primaryNarrativePath } = narrativeAnalysis
    
    // Find climax zone
    const climaxMoment = keyMoments.find((moment: any) => moment.narrativeSignificance === 'climax')
    if (climaxMoment) {
      const climaxNode = positionedNodes.find(n => n.id === climaxMoment.nodeId)
      if (climaxNode?.position) {
        zones.push({
          id: 'climax-zone',
          type: 'climax',
          center: climaxNode.position,
          radius: this.config.importanceWeighting.significanceRadius,
          nodeIds: this.findNodesInRadius(positionedNodes, climaxNode.position, this.config.importanceWeighting.significanceRadius)
        })
      }
    }
    
    // Create temporal zones
    const pathLength = primaryNarrativePath.length
    if (pathLength > 0) {
      const introEnd = Math.floor(pathLength * 0.2)
      const climaxStart = Math.floor(pathLength * 0.6)
      const resolutionStart = Math.floor(pathLength * 0.8)
      
      // Introduction zone
      if (introEnd > 0) {
        const introNodes = primaryNarrativePath.slice(0, introEnd).map(id => 
          positionedNodes.find(n => n.id === id)
        ).filter(Boolean) as Node[]
        
        if (introNodes.length > 0) {
          zones.push({
            id: 'introduction-zone',
            type: 'introduction',
            center: this.calculateZoneCenter(introNodes),
            radius: 200,
            nodeIds: introNodes.map(n => n.id)
          })
        }
      }
      
      // Rising action zone
      const risingNodes = primaryNarrativePath.slice(introEnd, climaxStart).map(id => 
        positionedNodes.find(n => n.id === id)
      ).filter(Boolean) as Node[]
      
      if (risingNodes.length > 0) {
        zones.push({
          id: 'rising-action-zone',
          type: 'rising-action',
          center: this.calculateZoneCenter(risingNodes),
          radius: 250,
          nodeIds: risingNodes.map(n => n.id)
        })
      }
      
      // Resolution zone
      if (resolutionStart < pathLength) {
        const resolutionNodes = primaryNarrativePath.slice(resolutionStart).map(id => 
          positionedNodes.find(n => n.id === id)
        ).filter(Boolean) as Node[]
        
        if (resolutionNodes.length > 0) {
          zones.push({
            id: 'resolution-zone',
            type: 'resolution',
            center: this.calculateZoneCenter(resolutionNodes),
            radius: 200,
            nodeIds: resolutionNodes.map(n => n.id)
          })
        }
      }
    }
    
    return zones
  }
  
  // Helper methods
  
  private extractDateFromNode(node: Node): Date | null {
    const dateFields = ['date', 'timestamp', 'dateTime', 'eventDate', 'createdAt']
    
    for (const field of dateFields) {
      const dateValue = node.data?.[field]
      if (dateValue) {
        const date = new Date(dateValue as string)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }
    
    return null
  }
  
  private containsHistoricalKeywords(text: string): boolean {
    const keywords = ['roswell', 'blue book', 'phoenix', 'pentagon', 'disclosure', 'project', 'incident', 'sighting']
    return keywords.some(keyword => text.includes(keyword))
  }
  
  private findSecondaryNarrativePaths(nodes: Node[], edges: Edge[], primaryPath: string[]): string[][] {
    // Implementation for finding alternative narrative branches
    // This is a simplified version - could be much more sophisticated
    return []
  }
  
  private extractNarrativeThemes(nodes: Node[], tourContext?: GraphContext['tourContext']): string[] {
    const themes = new Set<string>()
    
    nodes.forEach(node => {
      const nodeText = (node.data?.title || node.data?.name || '').toLowerCase()
      
      if (nodeText.includes('military') || nodeText.includes('government')) {
        themes.add('Government Investigation')
      }
      if (nodeText.includes('witness') || nodeText.includes('testimony')) {
        themes.add('Witness Testimonies')
      }
      if (nodeText.includes('technology') || nodeText.includes('craft')) {
        themes.add('Technology & Craft')
      }
      if (nodeText.includes('disclosure') || nodeText.includes('pentagon')) {
        themes.add('Modern Disclosure')
      }
    })
    
    return Array.from(themes)
  }
  
  private positionRadial(node: Node, significance: number, isKeyMoment: boolean, pathProgress: number): XYPosition {
    const centerX = this.canvasSize.width / 2
    const centerY = this.canvasSize.height / 2
    const maxRadius = Math.min(this.canvasSize.width, this.canvasSize.height) / 3
    
    const radius = maxRadius * (1 - Math.min(significance / 5, 0.8))
    const angle = pathProgress * 2 * Math.PI
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    }
  }
  
  private positionHierarchical(node: Node, significance: number, isKeyMoment: boolean, pathIndex: number): XYPosition {
    const levels = 5
    const level = Math.floor(significance * levels)
    const yPosition = 100 + (level * (this.canvasSize.height - 200) / levels)
    const xPosition = 100 + ((pathIndex % 5) * (this.canvasSize.width - 200) / 5)
    
    return { x: xPosition, y: yPosition }
  }
  
  private positionThematic(node: Node, narrativeAnalysis: any, significance: number): XYPosition {
    // Group by themes and position accordingly
    const centerX = this.canvasSize.width / 2
    const centerY = this.canvasSize.height / 2
    
    // Simple implementation - could be much more sophisticated
    return {
      x: centerX + (Math.random() - 0.5) * 400,
      y: centerY + (Math.random() - 0.5) * 400
    }
  }
  
  private positionChronological(node: Node, pathProgress: number, significance: number, isKeyMoment: boolean): XYPosition {
    const x = 100 + (pathProgress * (this.canvasSize.width - 200))
    const y = this.canvasSize.height / 2 + (Math.random() - 0.5) * 200
    
    return { x, y }
  }
  
  private avoidNodeOverlap(position: XYPosition, nodeSpacing: any): XYPosition {
    // Simple overlap avoidance - could be improved with more sophisticated algorithms
    return position
  }
  
  private calculateZoneCenter(nodes: Node[]): XYPosition {
    const avgX = nodes.reduce((sum, n) => sum + (n.position?.x || 0), 0) / nodes.length
    const avgY = nodes.reduce((sum, n) => sum + (n.position?.y || 0), 0) / nodes.length
    
    return { x: avgX, y: avgY }
  }
  
  private findNodesInRadius(nodes: Node[], center: XYPosition, radius: number): string[] {
    return nodes
      .filter(node => {
        if (!node.position) return false
        const dx = node.position.x - center.x
        const dy = node.position.y - center.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance <= radius
      })
      .map(node => node.id)
  }
}

/**
 * Hook for using intelligent narrative layout
 */
export function useIntelligentNarrativeLayout(
  config: Partial<NarrativeLayoutConfig> = {},
  canvasSize: { width: number, height: number } = { width: 1200, height: 800 }
) {
  const layoutEngine = new IntelligentNarrativeLayout(config, canvasSize)
  
  const applyLayout = (
    nodes: Node[],
    edges: Edge[],
    spatialGroups: SpatialGroup[] = [],
    tourContext?: GraphContext['tourContext']
  ): NarrativeLayoutResult => {
    return layoutEngine.applyNarrativeLayout(nodes, edges, spatialGroups, tourContext)
  }
  
  return {
    applyLayout,
    layoutEngine
  }
}