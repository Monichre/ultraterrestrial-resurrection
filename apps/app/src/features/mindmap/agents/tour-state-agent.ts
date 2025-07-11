import { TourLoader, type TourDefinition } from '@/features/mindmap/tours/utils/tour-loader'
import { historicalQueryAgent, queueTourWaypoint, queueChronologicalProgression } from './historical-query-agent'
import type { GraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import type { ReactFlowNode, ReactFlowEdge } from '@/features/mindmap/actions/xata-to-xyflow'

/**
 * Tour State Management Agent
 * Orchestrates guided tours vs free-form exploration with React Flow integration
 * Date: 2025-07-02
 * 
 * This agent ensures 100% React Flow compatibility by:
 * - Managing node positioning optimized for React Flow layouts
 * - Creating edges that follow React Flow standards
 * - Handling tour progression with proper node/edge lifecycle
 * - Supporting dynamic layout changes during tours
 */

export interface TourSession {
  id: string
  tourId: string
  mode: 'guided' | 'free-form'
  currentWaypointIndex: number
  tour: TourDefinition
  progress: {
    completed: string[] // waypoint IDs
    current: string | null
    next: string | null
  }
  state: {
    nodes: ReactFlowNode[]
    edges: ReactFlowEdge[]
    viewport: {
      x: number
      y: number
      zoom: number
    }
    graphContext: GraphContext | null
  }
  settings: {
    autoProgress: boolean
    showNarrative: boolean
    highlightActive: boolean
    layoutType: 'horizontal' | 'vertical' | 'radial' | 'grid'
  }
  createdAt: Date
  updatedAt: Date
}

export interface TourTransition {
  from: string | null
  to: string
  type: 'next' | 'previous' | 'jump' | 'auto'
  timestamp: Date
  triggerReason: 'user-action' | 'completion-threshold' | 'time-based' | 'context-based'
}

/**
 * Tour State Management Agent
 */
export class TourStateAgent {
  private activeSessions: Map<string, TourSession> = new Map()
  private sessionCallbacks: Map<string, ( session: TourSession ) => void> = new Map()

  /**
   * Initialize a new tour session
   */
  async initializeTour(
    tourId: string,
    mode: 'guided' | 'free-form' = 'guided',
    initialGraphContext?: GraphContext
  ): Promise<string> {
    try {
      // Load tour definition
      const tour = await TourLoader.getBuiltinTour( tourId )

      const sessionId = `tour-session-${Date.now()}-${Math.random().toString( 36 ).substr( 2, 9 )}`

      const session: TourSession = {
        id: sessionId,
        tourId,
        mode,
        currentWaypointIndex: 0,
        tour,
        progress: {
          completed: [],
          current: tour.waypoints[0]?.id || null,
          next: tour.waypoints[1]?.id || null
        },
        state: {
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
          graphContext: initialGraphContext || null
        },
        settings: {
          autoProgress: mode === 'guided',
          showNarrative: true,
          highlightActive: true,
          layoutType: this.determineOptimalLayout( tour.waypoints[0] )
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.activeSessions.set( sessionId, session )

      // Start the first waypoint
      if ( session.progress.current ) {
        await this.processWaypoint( sessionId, session.progress.current, 'auto' )
      }

      console.log( `[Tour State Agent] Initialized ${mode} tour session ${sessionId} for tour ${tourId}` )

      return sessionId

    } catch ( error ) {
      console.error( `[Tour State Agent] Failed to initialize tour ${tourId}:`, error )
      throw error
    }
  }

  /**
   * Transition to next waypoint or switch to free-form mode
   */
  async transitionTour(
    sessionId: string,
    transition: 'next' | 'previous' | 'free-form' | { jumpTo: string }
  ): Promise<TourSession> {
    const session = this.activeSessions.get( sessionId )
    if ( !session ) {
      throw new Error( `Tour session ${sessionId} not found` )
    }

    if ( transition === 'free-form' ) {
      // Switch to free-form exploration
      session.mode = 'free-form'
      session.settings.autoProgress = false
      session.updatedAt = new Date()

      console.log( `[Tour State Agent] Switched session ${sessionId} to free-form mode` )

      this.notifySessionUpdate( sessionId, session )
      return session
    }

    if ( typeof transition === 'object' && transition.jumpTo ) {
      // Jump to specific waypoint
      const waypointIndex = session.tour.waypoints.findIndex( w => w.id === transition.jumpTo )
      if ( waypointIndex === -1 ) {
        throw new Error( `Waypoint ${transition.jumpTo} not found in tour` )
      }

      session.currentWaypointIndex = waypointIndex
      session.progress.current = transition.jumpTo
      session.progress.next = session.tour.waypoints[waypointIndex + 1]?.id || null

      await this.processWaypoint( sessionId, transition.jumpTo, 'jump' )

    } else if ( transition === 'next' ) {
      // Move to next waypoint
      if ( session.progress.next ) {
        session.progress.completed.push( session.progress.current! )
        session.currentWaypointIndex++
        session.progress.current = session.progress.next
        session.progress.next = session.tour.waypoints[session.currentWaypointIndex + 1]?.id || null

        await this.processWaypoint( sessionId, session.progress.current, 'next' )
      }

    } else if ( transition === 'previous' ) {
      // Move to previous waypoint
      if ( session.currentWaypointIndex > 0 ) {
        session.currentWaypointIndex--
        const previous = session.tour.waypoints[session.currentWaypointIndex]

        // Remove from completed if going back
        session.progress.completed = session.progress.completed.filter( id => id !== previous.id )
        session.progress.current = previous.id
        session.progress.next = session.tour.waypoints[session.currentWaypointIndex + 1]?.id || null

        await this.processWaypoint( sessionId, previous.id, 'previous' )
      }
    }

    session.updatedAt = new Date()
    this.notifySessionUpdate( sessionId, session )

    return session
  }

  /**
   * Process a specific waypoint
   */
  private async processWaypoint(
    sessionId: string,
    waypointId: string,
    transitionType: 'next' | 'previous' | 'jump' | 'auto'
  ): Promise<void> {
    const session = this.activeSessions.get( sessionId )
    if ( !session ) return

    const waypoint = session.tour.waypoints.find( w => w.id === waypointId )
    if ( !waypoint ) {
      console.error( `[Tour State Agent] Waypoint ${waypointId} not found` )
      return
    }

    console.log( `[Tour State Agent] Processing waypoint ${waypointId} for session ${sessionId}` )

    // Update layout type based on waypoint visual settings
    if ( waypoint.visualSettings?.layoutPreference ) {
      session.settings.layoutType = waypoint.visualSettings.layoutPreference as any
    }

    // Queue background query for this waypoint
    const tourContext = {
      tourId: session.tourId,
      waypointId: waypointId,
      tourMode: session.mode,
      narrativeContext: waypoint.narrative || ''
    }

    try {
      const taskId = await queueTourWaypoint(
        session.state.graphContext || this.createMinimalGraphContext(),
        waypoint.dbRef.type,
        tourContext
      )

      // Register callback for when the query completes
      historicalQueryAgent.onTaskComplete( taskId, ( result ) => {
        if ( result.status === 'completed' && result.result ) {
          this.handleWaypointQueryComplete( sessionId, waypointId, result.result )
        }
      } )

    } catch ( error ) {
      console.error( `[Tour State Agent] Failed to queue waypoint query:`, error )
    }

    // Update session state
    session.state.graphContext = this.updateGraphContextForWaypoint(
      session.state.graphContext,
      waypoint,
      session
    )
  }

  /**
   * Handle completion of waypoint background query
   */
  private handleWaypointQueryComplete(
    sessionId: string,
    waypointId: string,
    result: { nodes: ReactFlowNode[]; edges: ReactFlowEdge[]; analysis: string; suggestions: string[] }
  ): void {
    const session = this.activeSessions.get( sessionId )
    if ( !session ) return

    // Update session state with new nodes and edges
    const updatedNodes = this.integrateNodesWithReactFlow( session.state.nodes, result.nodes, session.settings.layoutType )
    const updatedEdges = this.integrateEdgesWithReactFlow( session.state.edges, result.edges )

    session.state.nodes = updatedNodes
    session.state.edges = updatedEdges
    session.updatedAt = new Date()

    console.log( `[Tour State Agent] Waypoint ${waypointId} completed: ${result.nodes.length} nodes, ${result.edges.length} edges` )

    // Trigger auto-progression if enabled
    if ( session.settings.autoProgress && session.mode === 'guided' ) {
      // Auto-progress after analyzing the results
      setTimeout( () => {
        if ( this.shouldAutoProgress( session, result ) ) {
          this.transitionTour( sessionId, 'next' )
        }
      }, 5000 ) // 5 second delay for user to observe
    }

    this.notifySessionUpdate( sessionId, session )
  }

  /**
   * Integrate new nodes with existing React Flow setup
   */
  private integrateNodesWithReactFlow(
    existingNodes: ReactFlowNode[],
    newNodes: ReactFlowNode[],
    layoutType: TourSession['settings']['layoutType']
  ): ReactFlowNode[] {
    // Calculate optimal positions for new nodes based on layout type and existing nodes
    const positionedNodes = this.calculateOptimalNodePositions( newNodes, existingNodes, layoutType )

    // Ensure React Flow compatibility
    const reactFlowCompatibleNodes = positionedNodes.map( node => ( {
      ...node,
      // Ensure all React Flow required properties are set
      connectable: node.connectable ?? true,
      selectable: node.selectable ?? true,
      deletable: node.deletable ?? true,
      focusable: node.focusable ?? true,
      draggable: node.draggable ?? true,
      // Add tour-specific styling
      className: `tour-node ${node.className || ''}`.trim(),
      style: {
        ...node.style,
        border: '2px solid #3b82f6',
        borderRadius: '8px'
      }
    } ) )

    return [...existingNodes, ...reactFlowCompatibleNodes]
  }

  /**
   * Integrate new edges with existing React Flow setup
   */
  private integrateEdgesWithReactFlow(
    existingEdges: ReactFlowEdge[],
    newEdges: ReactFlowEdge[]
  ): ReactFlowEdge[] {
    // Ensure React Flow compatibility
    const reactFlowCompatibleEdges = newEdges.map( edge => ( {
      ...edge,
      // Ensure all React Flow required properties are set
      selectable: edge.selectable ?? true,
      deletable: edge.deletable ?? true,
      focusable: edge.focusable ?? true,
      updatable: edge.updatable ?? true,
      // Add tour-specific styling
      className: `tour-edge ${edge.className || ''}`.trim(),
      style: {
        ...edge.style,
        strokeWidth: 2,
        stroke: '#3b82f6'
      },
      markerEnd: edge.markerEnd || 'arrow'
    } ) )

    return [...existingEdges, ...reactFlowCompatibleEdges]
  }

  /**
   * Calculate optimal node positions for React Flow layouts
   */
  private calculateOptimalNodePositions(
    newNodes: ReactFlowNode[],
    existingNodes: ReactFlowNode[],
    layoutType: TourSession['settings']['layoutType']
  ): ReactFlowNode[] {
    const nodeWidth = 250
    const nodeHeight = 150
    const spacing = 50

    switch ( layoutType ) {
      case 'horizontal':
        return newNodes.map( ( node, index ) => ( {
          ...node,
          position: {
            x: ( existingNodes.length + index ) * ( nodeWidth + spacing ),
            y: 0
          }
        } ) )

      case 'vertical':
        return newNodes.map( ( node, index ) => ( {
          ...node,
          position: {
            x: 0,
            y: ( existingNodes.length + index ) * ( nodeHeight + spacing )
          }
        } ) )

      case 'radial':
        const radius = 300
        const totalNodes = existingNodes.length + newNodes.length
        return newNodes.map( ( node, index ) => {
          const angle = ( ( existingNodes.length + index ) * 2 * Math.PI ) / totalNodes
          return {
            ...node,
            position: {
              x: radius * Math.cos( angle ),
              y: radius * Math.sin( angle )
            }
          }
        } )

      case 'grid':
        const cols = Math.ceil( Math.sqrt( existingNodes.length + newNodes.length ) )
        return newNodes.map( ( node, index ) => {
          const totalIndex = existingNodes.length + index
          const row = Math.floor( totalIndex / cols )
          const col = totalIndex % cols
          return {
            ...node,
            position: {
              x: col * ( nodeWidth + spacing ),
              y: row * ( nodeHeight + spacing )
            }
          }
        } )

      default:
        return newNodes
    }
  }

  /**
   * Determine if tour should auto-progress
   */
  private shouldAutoProgress(
    session: TourSession,
    result: { nodes: ReactFlowNode[]; edges: ReactFlowEdge[]; analysis: string; suggestions: string[] }
  ): boolean {
    // Auto-progress if we have substantial results and haven't reached the end
    return result.nodes.length > 0 && session.progress.next !== null
  }

  /**
   * Create minimal graph context for initial queries
   */
  private createMinimalGraphContext(): GraphContext {
    return {
      seedRecord: null,
      connectedEntityTypes: new Set(),
      timelineBounds: {},
      relatedTopics: [],
      keyPersonnel: [],
      organizations: []
    }
  }

  /**
   * Update graph context based on waypoint
   */
  private updateGraphContextForWaypoint(
    existingContext: GraphContext | null,
    waypoint: any,
    session: TourSession
  ): GraphContext {
    const context: GraphContext = existingContext || this.createMinimalGraphContext()

    // Add tour context
    context.tourContext = {
      tourId: session.tourId,
      currentWaypointId: waypoint.id,
      waypointIndex: session.currentWaypointIndex,
      tourMode: session.mode,
      historicalProgression: {
        currentEra: waypoint.contextRules?.temporalWindow ?
          `${waypoint.contextRules.temporalWindow.startYear}-${waypoint.contextRules.temporalWindow.endYear}` :
          'Unknown Era',
        nextSuggestedPeriod: 'Next chronological period',
        chronologicalDirection: 'forward'
      },
      narrativeContext: waypoint.narrative || ''
    }

    // Add temporal context from waypoint
    if ( waypoint.contextRules?.temporalWindow ) {
      const { startYear, endYear } = waypoint.contextRules.temporalWindow
      context.timelineBounds = {
        earliest: new Date( startYear, 0, 1 ),
        latest: new Date( endYear, 11, 31 )
      }
    }

    return context
  }

  /**
   * Determine optimal layout for waypoint
   */
  private determineOptimalLayout( waypoint: any ): TourSession['settings']['layoutType'] {
    if ( waypoint?.visualSettings?.layoutPreference ) {
      return waypoint.visualSettings.layoutPreference as TourSession['settings']['layoutType']
    }

    // Default based on waypoint type
    if ( waypoint?.dbRef?.type === 'events' ) return 'horizontal'
    if ( waypoint?.dbRef?.type === 'personnel' ) return 'radial'
    if ( waypoint?.dbRef?.type === 'organizations' ) return 'radial'
    if ( waypoint?.dbRef?.type === 'documents' ) return 'grid'

    return 'horizontal'
  }

  /**
   * Notify session update to registered callbacks
   */
  private notifySessionUpdate( sessionId: string, session: TourSession ): void {
    const callback = this.sessionCallbacks.get( sessionId )
    if ( callback ) {
      callback( session )
    }
  }

  /**
   * Register callback for session updates
   */
  onSessionUpdate( sessionId: string, callback: ( session: TourSession ) => void ): void {
    this.sessionCallbacks.set( sessionId, callback )
  }

  /**
   * Get current session state
   */
  getSession( sessionId: string ): TourSession | null {
    return this.activeSessions.get( sessionId ) || null
  }

  /**
   * Update session settings
   */
  updateSessionSettings(
    sessionId: string,
    settings: Partial<TourSession['settings']>
  ): TourSession | null {
    const session = this.activeSessions.get( sessionId )
    if ( !session ) return null

    session.settings = { ...session.settings, ...settings }
    session.updatedAt = new Date()

    this.notifySessionUpdate( sessionId, session )
    return session
  }

  /**
   * End tour session and cleanup
   */
  endSession( sessionId: string ): void {
    this.activeSessions.delete( sessionId )
    this.sessionCallbacks.delete( sessionId )
    console.log( `[Tour State Agent] Ended session ${sessionId}` )
  }

  /**
   * Get all active sessions (for debugging)
   */
  getActiveSessions(): Map<string, TourSession> {
    return new Map( this.activeSessions )
  }
}

// Singleton instance
export const tourStateAgent = new TourStateAgent()