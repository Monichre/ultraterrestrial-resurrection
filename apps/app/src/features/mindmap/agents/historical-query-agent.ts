"use server"

import { askXataWithAi } from "@db/xata/api"
import { 
  getGraphContext, 
  generateTourAwareSearchRules, 
  determineHistoricalProgression,
  type GraphContext 
} from '@/features/mindmap/utils/contextual-intelligence'
import type { ReactFlowNode, ReactFlowEdge } from '@/features/mindmap/actions/xata-to-xyflow'

/**
 * Historical Database Query Agent
 * Runs in background to process chronological event progression and tour-aware queries
 * Date: 2025-07-02
 */

export interface HistoricalQueryTask {
  id: string
  type: 'chronological-progression' | 'tour-waypoint' | 'contextual-expansion'
  priority: 'high' | 'medium' | 'low'
  graphContext: GraphContext
  parameters: {
    table: string
    amount?: number
    historicalFilter?: {
      mode: 'chronological' | 'contextual' | 'free-form'
      dateRange?: { startYear?: number; endYear?: number }
      significance?: 'historically_important' | 'all' | 'disclosure_related'
      progression?: 'forward' | 'backward' | 'context-based'
    }
    tourContext?: {
      tourId: string
      waypointId: string
      tourMode: 'guided' | 'free-form'
      narrativeContext: string
    }
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    nodes: ReactFlowNode[]
    edges: ReactFlowEdge[]
    analysis: string
    suggestions: string[]
  }
  createdAt: Date
  completedAt?: Date
}

/**
 * Background Agent for Historical Database Queries
 */
export class HistoricalQueryAgent {
  private taskQueue: HistoricalQueryTask[] = []
  private isProcessing = false
  private processingCallbacks: Map<string, (result: HistoricalQueryTask) => void> = new Map()

  /**
   * Submit a historical query task for background processing
   */
  async submitTask(task: Omit<HistoricalQueryTask, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const taskId = `historical-query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const fullTask: HistoricalQueryTask = {
      ...task,
      id: taskId,
      status: 'pending',
      createdAt: new Date()
    }

    this.taskQueue.push(fullTask)
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue()
    }

    return taskId
  }

  /**
   * Register callback for task completion
   */
  onTaskComplete(taskId: string, callback: (result: HistoricalQueryTask) => void): void {
    this.processingCallbacks.set(taskId, callback)
  }

  /**
   * Process the task queue in background
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.taskQueue.length > 0) {
      // Sort by priority: high -> medium -> low
      this.taskQueue.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

      const task = this.taskQueue.shift()
      if (!task) break

      try {
        task.status = 'processing'
        console.log(`[Historical Query Agent] Processing task ${task.id} of type ${task.type}`)

        const result = await this.executeTask(task)
        
        task.result = result
        task.status = 'completed'
        task.completedAt = new Date()

        // Trigger callback if registered
        const callback = this.processingCallbacks.get(task.id)
        if (callback) {
          callback(task)
          this.processingCallbacks.delete(task.id)
        }

        console.log(`[Historical Query Agent] Completed task ${task.id} in ${task.completedAt.getTime() - task.createdAt.getTime()}ms`)

      } catch (error) {
        console.error(`[Historical Query Agent] Task ${task.id} failed:`, error)
        task.status = 'failed'
        task.completedAt = new Date()

        const callback = this.processingCallbacks.get(task.id)
        if (callback) {
          callback(task)
          this.processingCallbacks.delete(task.id)
        }
      }

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    this.isProcessing = false
  }

  /**
   * Execute a specific historical query task
   */
  private async executeTask(task: HistoricalQueryTask): Promise<HistoricalQueryTask['result']> {
    const { type, graphContext, parameters } = task

    switch (type) {
      case 'chronological-progression':
        return await this.processChronologicalProgression(graphContext, parameters)
      
      case 'tour-waypoint':
        return await this.processTourWaypoint(graphContext, parameters)
      
      case 'contextual-expansion':
        return await this.processContextualExpansion(graphContext, parameters)
      
      default:
        throw new Error(`Unknown task type: ${type}`)
    }
  }

  /**
   * Process chronological progression queries
   */
  private async processChronologicalProgression(
    graphContext: GraphContext, 
    parameters: HistoricalQueryTask['parameters']
  ): Promise<HistoricalQueryTask['result']> {
    
    const progression = graphContext.historicalProgression || determineHistoricalProgression(graphContext)
    
    if (!progression) {
      throw new Error('No historical progression context available')
    }

    const query = this.buildChronologicalQuery(progression, parameters)
    const rules = this.buildChronologicalRules(progression, parameters)

    console.log(`[Historical Query Agent] Chronological query: ${query}`)
    console.log(`[Historical Query Agent] Rules: ${rules.join(', ')}`)

    const response = await askXataWithAi({
      question: query,
      table: parameters.table,
      rules
    })

    const nodes = this.transformRecordsToNodes(response.records, parameters.table, 'chronological')
    const edges = this.generateChronologicalEdges(nodes, progression)

    return {
      nodes,
      edges,
      analysis: `Found ${nodes.length} records in ${progression.currentPeriod.era}. Next suggested period: ${progression.nextChronologicalStep.suggestedYear} (${progression.nextChronologicalStep.rationale}).`,
      suggestions: [
        `Explore ${progression.nextChronologicalStep.suggestedYear} events`,
        `Investigate connections to ${progression.significantEvents.slice(0, 2).join(' and ')}`,
        `Expand research into ${progression.currentPeriod.era}`
      ]
    }
  }

  /**
   * Process tour waypoint queries
   */
  private async processTourWaypoint(
    graphContext: GraphContext, 
    parameters: HistoricalQueryTask['parameters']
  ): Promise<HistoricalQueryTask['result']> {
    
    if (!parameters.tourContext) {
      throw new Error('Tour context required for tour waypoint processing')
    }

    const tourRules = generateTourAwareSearchRules(graphContext)
    const query = `Following guided tour ${parameters.tourContext.tourId}, waypoint ${parameters.tourContext.waypointId}: ${parameters.tourContext.narrativeContext}`

    console.log(`[Historical Query Agent] Tour waypoint query: ${query}`)

    const response = await askXataWithAi({
      question: query,
      table: parameters.table,
      rules: [tourRules]
    })

    const nodes = this.transformRecordsToNodes(response.records, parameters.table, 'tour-guided')
    const edges = this.generateTourEdges(nodes, parameters.tourContext)

    return {
      nodes,
      edges,
      analysis: `Tour waypoint ${parameters.tourContext.waypointId} yielded ${nodes.length} relevant records.`,
      suggestions: [
        `Continue to next waypoint in ${parameters.tourContext.tourId}`,
        `Explore connections discovered in this waypoint`,
        `Deep dive into specific entities from this waypoint`
      ]
    }
  }

  /**
   * Process contextual expansion queries
   */
  private async processContextualExpansion(
    graphContext: GraphContext, 
    parameters: HistoricalQueryTask['parameters']
  ): Promise<HistoricalQueryTask['result']> {
    
    const contextualRules = generateTourAwareSearchRules(graphContext)
    const query = `Expand the knowledge graph with ${parameters.amount || 3} related ${parameters.table} records`

    console.log(`[Historical Query Agent] Contextual expansion query: ${query}`)

    const response = await askXataWithAi({
      question: query,
      table: parameters.table,
      rules: [contextualRules]
    })

    const nodes = this.transformRecordsToNodes(response.records, parameters.table, 'contextual')
    const edges = this.generateContextualEdges(nodes, graphContext)

    return {
      nodes,
      edges,
      analysis: `Contextual expansion added ${nodes.length} records with ${edges.length} new connections.`,
      suggestions: [
        `Investigate key personnel connections`,
        `Explore organizational relationships`,
        `Follow temporal progression threads`
      ]
    }
  }

  /**
   * Build chronological query based on historical progression
   */
  private buildChronologicalQuery(
    progression: NonNullable<GraphContext['historicalProgression']>,
    parameters: HistoricalQueryTask['parameters']
  ): string {
    const direction = progression.nextChronologicalStep.direction
    const targetYear = progression.nextChronologicalStep.suggestedYear
    const currentEra = progression.currentPeriod.era

    if (direction === 'forward') {
      return `Find ${parameters.amount || 3} historically significant ${parameters.table} records that chronologically follow the ${currentEra}, progressing toward ${targetYear}. Focus on events that show historical development and disclosure evolution.`
    } else {
      return `Find ${parameters.amount || 3} historically significant ${parameters.table} records that preceded the ${currentEra}, showing the historical context and antecedents that led to current events.`
    }
  }

  /**
   * Build chronological rules for database queries
   */
  private buildChronologicalRules(
    progression: NonNullable<GraphContext['historicalProgression']>,
    parameters: HistoricalQueryTask['parameters']
  ): string[] {
    const rules = [
      `Current historical period: ${progression.currentPeriod.era} (${progression.currentPeriod.startYear}-${progression.currentPeriod.endYear})`,
      `Next chronological step: ${progression.nextChronologicalStep.rationale}`,
      `Target progression year: ${progression.nextChronologicalStep.suggestedYear}`,
      'Prioritize records with clear chronological significance',
      'Include events that show historical development patterns',
      'Focus on disclosure-related developments and watershed moments'
    ]

    // Add significant events context
    if (progression.significantEvents.length > 0) {
      rules.push(`Consider relationships to significant events: ${progression.significantEvents.join(', ')}`)
    }

    return rules
  }

  /**
   * Transform database records to React Flow nodes
   */
  private transformRecordsToNodes(
    records: any[], 
    table: string, 
    nodeContext: 'chronological' | 'tour-guided' | 'contextual'
  ): ReactFlowNode[] {
    return records.map((record, index) => ({
      id: record.id || `${table}-${index}`,
      type: 'enhancedEntityNodePOC',
      position: { x: index * 250, y: 0 }, // Initial positioning - will be optimized by layout
      data: {
        ...record,
        type: table,
        nodeContext,
        // React Flow specific properties
        connectable: true,
        selectable: true,
        deletable: true,
        focusable: true,
      },
      // React Flow node properties
      connectable: true,
      selectable: true,
      deletable: true,
      focusable: true,
      draggable: true,
    }))
  }

  /**
   * Generate chronological edges between nodes
   */
  private generateChronologicalEdges(
    nodes: ReactFlowNode[], 
    progression: NonNullable<GraphContext['historicalProgression']>
  ): ReactFlowEdge[] {
    const edges: ReactFlowEdge[] = []

    // Create temporal progression edges
    for (let i = 0; i < nodes.length - 1; i++) {
      const sourceNode = nodes[i]
      const targetNode = nodes[i + 1]

      edges.push({
        id: `chronological-${sourceNode.id}-${targetNode.id}`,
        source: sourceNode.id,
        target: targetNode.id,
        type: 'smoothstep',
        animated: false,
        label: 'Chronological progression',
        style: { 
          stroke: '#10b981', 
          strokeWidth: 2 
        },
        // React Flow edge properties
        selectable: true,
        deletable: true,
        focusable: true,
        markerEnd: 'arrow',
      })
    }

    return edges
  }

  /**
   * Generate tour-aware edges between nodes
   */
  private generateTourEdges(
    nodes: ReactFlowNode[], 
    tourContext: NonNullable<HistoricalQueryTask['parameters']['tourContext']>
  ): ReactFlowEdge[] {
    const edges: ReactFlowEdge[] = []

    // Create narrative flow edges for guided tours
    for (let i = 0; i < nodes.length - 1; i++) {
      const sourceNode = nodes[i]
      const targetNode = nodes[i + 1]

      edges.push({
        id: `tour-${tourContext.waypointId}-${sourceNode.id}-${targetNode.id}`,
        source: sourceNode.id,
        target: targetNode.id,
        type: 'step',
        animated: true,
        label: `Tour: ${tourContext.waypointId}`,
        style: { 
          stroke: '#3b82f6', 
          strokeWidth: 2,
          strokeDasharray: '5,5'
        },
        // React Flow edge properties
        selectable: true,
        deletable: false, // Tour edges shouldn't be deletable
        focusable: true,
        markerEnd: 'arrow',
      })
    }

    return edges
  }

  /**
   * Generate contextual edges between nodes
   */
  private generateContextualEdges(
    nodes: ReactFlowNode[], 
    graphContext: GraphContext
  ): ReactFlowEdge[] {
    const edges: ReactFlowEdge[] = []

    // Create relationship-based edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i]
        const nodeB = nodes[j]

        // Check for potential relationships
        const hasRelationship = this.detectNodeRelationship(nodeA, nodeB, graphContext)
        
        if (hasRelationship) {
          edges.push({
            id: `contextual-${nodeA.id}-${nodeB.id}`,
            source: nodeA.id,
            target: nodeB.id,
            type: 'default',
            animated: false,
            label: hasRelationship.type,
            style: { 
              stroke: hasRelationship.color, 
              strokeWidth: 1.5 
            },
            // React Flow edge properties
            selectable: true,
            deletable: true,
            focusable: true,
          })
        }
      }
    }

    return edges
  }

  /**
   * Detect relationships between nodes for edge creation
   */
  private detectNodeRelationship(
    nodeA: ReactFlowNode, 
    nodeB: ReactFlowNode, 
    graphContext: GraphContext
  ): { type: string; color: string } | null {
    
    const dataA = nodeA.data
    const dataB = nodeB.data

    // Temporal relationship
    if (dataA.date && dataB.date) {
      const dateA = new Date(dataA.date)
      const dateB = new Date(dataB.date)
      const timeDiff = Math.abs(dateA.getTime() - dateB.getTime())
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
      
      if (daysDiff < 365) { // Within a year
        return { type: 'Temporal', color: '#f59e0b' }
      }
    }

    // Personnel relationship
    if (dataA.personnel && dataB.personnel) {
      // Check for common personnel
      const personnelA = Array.isArray(dataA.personnel) ? dataA.personnel : [dataA.personnel]
      const personnelB = Array.isArray(dataB.personnel) ? dataB.personnel : [dataB.personnel]
      
      const commonPersonnel = personnelA.filter(p => personnelB.includes(p))
      if (commonPersonnel.length > 0) {
        return { type: 'Personnel', color: '#8b5cf6' }
      }
    }

    // Organizational relationship
    if (dataA.organization && dataB.organization) {
      if (dataA.organization === dataB.organization) {
        return { type: 'Organization', color: '#ef4444' }
      }
    }

    // Geographic relationship
    if (dataA.latitude && dataA.longitude && dataB.latitude && dataB.longitude) {
      const distance = this.calculateDistance(
        dataA.latitude, dataA.longitude,
        dataB.latitude, dataB.longitude
      )
      
      if (distance < 100) { // Within 100km
        return { type: 'Geographic', color: '#06b6d4' }
      }
    }

    return null
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): HistoricalQueryTask | null {
    return this.taskQueue.find(task => task.id === taskId) || null
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { total: number; pending: number; processing: number; completed: number } {
    return {
      total: this.taskQueue.length,
      pending: this.taskQueue.filter(t => t.status === 'pending').length,
      processing: this.taskQueue.filter(t => t.status === 'processing').length,
      completed: this.taskQueue.filter(t => t.status === 'completed').length,
    }
  }
}

// Singleton instance for background processing
export const historicalQueryAgent = new HistoricalQueryAgent()

/**
 * Convenience functions for common historical query patterns
 */

export async function queueChronologicalProgression(
  graphContext: GraphContext,
  table: string,
  amount: number = 3
): Promise<string> {
  return await historicalQueryAgent.submitTask({
    type: 'chronological-progression',
    priority: 'high',
    graphContext,
    parameters: {
      table,
      amount,
      historicalFilter: {
        mode: 'chronological',
        significance: 'historically_important',
        progression: graphContext.historicalProgression?.nextChronologicalStep.direction || 'forward'
      }
    }
  })
}

export async function queueTourWaypoint(
  graphContext: GraphContext,
  table: string,
  tourContext: NonNullable<HistoricalQueryTask['parameters']['tourContext']>
): Promise<string> {
  return await historicalQueryAgent.submitTask({
    type: 'tour-waypoint',
    priority: 'high',
    graphContext: {
      ...graphContext,
      tourContext: {
        tourId: tourContext.tourId,
        currentWaypointId: tourContext.waypointId,
        waypointIndex: 0, // This would come from tour state
        tourMode: tourContext.tourMode,
        historicalProgression: {
          currentEra: graphContext.historicalProgression?.currentPeriod.era || 'Unknown',
          nextSuggestedPeriod: graphContext.historicalProgression?.nextChronologicalStep.rationale || 'Continue exploration',
          chronologicalDirection: 'forward'
        },
        narrativeContext: tourContext.narrativeContext
      }
    },
    parameters: {
      table,
      tourContext
    }
  })
}

export async function queueContextualExpansion(
  graphContext: GraphContext,
  table: string,
  amount: number = 3
): Promise<string> {
  return await historicalQueryAgent.submitTask({
    type: 'contextual-expansion',
    priority: 'medium',
    graphContext,
    parameters: {
      table,
      amount,
      historicalFilter: {
        mode: 'contextual',
        significance: 'all',
        progression: 'context-based'
      }
    }
  })
}