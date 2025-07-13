'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { type Node } from '@xyflow/react'
import { useTour } from './use-tour'
import { useSpatialGrouping, type SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'
import { getGraphContext, generateTourAwareSearchRules, type GraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { xataToXYFlow } from '@/features/mindmap/actions/xata-to-xyflow'

export interface TourSpatialState {
  // Spatial grouping during tours
  tourGroups: SpatialGroup[]
  narrativeGroups: Map<string, SpatialGroup[]> // waypoint ID -> groups created during that waypoint
  
  // Spatial progression tracking
  currentSpatialContext: {
    dominantEntityTypes: string[]
    temporalClusters: Array<{
      startYear: number
      endYear: number
      nodeCount: number
      groupIds: string[]
    }>
    narrativeProgression: {
      currentTheme: string
      suggestedNextTheme: string
      spatialEvidence: string[]
    }
  }
  
  // Tour-driven spatial actions
  suggestedGroupActions: Array<{
    groupId: string
    action: 'expand' | 'research' | 'connect' | 'contextualize'
    reason: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export interface TourSpatialConfig {
  enableAutoGrouping: boolean
  groupPersistenceThreshold: number // milliseconds
  maxTourGroups: number
  spatialProximityThreshold: number
  enableNarrativeGrouping: boolean
  autoSuggestConnections: boolean
}

const DEFAULT_SPATIAL_CONFIG: TourSpatialConfig = {
  enableAutoGrouping: true,
  groupPersistenceThreshold: 5000, // 5 seconds
  maxTourGroups: 8,
  spatialProximityThreshold: 180,
  enableNarrativeGrouping: true,
  autoSuggestConnections: true
}

/**
 * Enhanced tour hook that integrates spatial intelligence and grouping
 * Provides tour-aware spatial analysis and group management
 */
export function useTourWithSpatialIntelligence(spatialConfig: Partial<TourSpatialConfig> = {}) {
  const config = { ...DEFAULT_SPATIAL_CONFIG, ...spatialConfig }
  
  // Base tour hook
  const tourHook = useTour({
    enableAutoProgress: false,
    saveProgressToLocalStorage: true,
    analyticsEnabled: true
  })
  
  // Spatial grouping with tour-specific configuration
  const spatialHook = useSpatialGrouping({
    minGroupSize: 2,
    maxGroupDistance: config.spatialProximityThreshold,
    persistenceThreshold: config.groupPersistenceThreshold,
    maxGroupsVisible: config.maxTourGroups,
    autoCollapse: false // Keep groups expanded for tour narrative
  })
  
  const { getNodes, addNodes, addEdges } = useMindMap()
  
  // Tour spatial state
  const [tourSpatialState, setTourSpatialState] = useState<TourSpatialState>({
    tourGroups: [],
    narrativeGroups: new Map(),
    currentSpatialContext: {
      dominantEntityTypes: [],
      temporalClusters: [],
      narrativeProgression: {
        currentTheme: '',
        suggestedNextTheme: '',
        spatialEvidence: []
      }
    },
    suggestedGroupActions: []
  })
  
  // Tour progression with spatial awareness
  const spatialProgressionRef = useRef<{
    waypointGroups: Map<string, string[]> // waypoint ID -> group IDs created
    narrativeFlow: Array<{
      waypointId: string
      spatialChanges: string[]
      groupActions: string[]
    }>
  }>({
    waypointGroups: new Map(),
    narrativeFlow: []
  })
  
  /**
   * Enhanced waypoint navigation with spatial intelligence
   */
  const navigateToWaypointWithSpatialContext = useCallback(async (waypointIndex: number) => {
    if (!tourHook.currentTour) return
    
    // Navigate using base tour functionality
    await tourHook.navigateToWaypoint(waypointIndex)
    
    const waypoint = tourHook.currentTour.waypoints[waypointIndex]
    const currentNodes = getNodes()
    
    // Analyze spatial context for this waypoint
    const graphContext = getGraphContext(currentNodes)
    if (!graphContext) return
    
    // Update spatial context with tour information
    const enhancedContext: GraphContext = {
      ...graphContext,
      tourContext: {
        tourId: tourHook.currentTour.id,
        currentWaypointId: waypoint.id,
        waypointIndex,
        tourMode: tourHook.tourMode,
        historicalProgression: {
          currentEra: waypoint.title || 'Unknown Era',
          nextSuggestedPeriod: determineNextPeriod(waypoint),
          chronologicalDirection: 'forward'
        },
        narrativeContext: waypoint.narrative || ''
      }
    }
    
    // Update tour spatial state based on current groups
    const currentGroups = spatialHook.spatialGroups.filter(group => 
      group.isPersistent || group.metadata.confidence > 0.7
    )
    
    // Analyze spatial context for narrative progression
    const spatialContext = analyzeSpatialContextForTour(currentNodes, currentGroups, waypoint)
    
    // Generate group action suggestions
    const groupActions = generateTourGroupActions(currentGroups, enhancedContext, waypoint)
    
    setTourSpatialState(prev => ({
      ...prev,
      tourGroups: currentGroups,
      currentSpatialContext: spatialContext,
      suggestedGroupActions: groupActions
    }))
    
    // Track waypoint groups
    spatialProgressionRef.current.waypointGroups.set(
      waypoint.id, 
      currentGroups.map(g => g.id)
    )
    
    // Update narrative groups mapping
    setTourSpatialState(prev => {
      const newNarrativeGroups = new Map(prev.narrativeGroups)
      newNarrativeGroups.set(waypoint.id, currentGroups)
      return {
        ...prev,
        narrativeGroups: newNarrativeGroups
      }
    })
    
  }, [tourHook, spatialHook.spatialGroups, getNodes])
  
  /**
   * Create spatial group from tour waypoint context
   */
  const createTourNarrativeGroup = useCallback(async (
    nodeIds: string[], 
    narrativeTheme: string,
    waypointId: string
  ) => {
    if (!tourHook.currentTour) return null
    
    // Create manual group using spatial hook
    const spatialGroup = spatialHook.createManualGroup(nodeIds)
    if (!spatialGroup) return null
    
    // Enhance group with tour narrative context
    const enhancedGroup: SpatialGroup = {
      ...spatialGroup,
      metadata: {
        ...spatialGroup.metadata,
        narrativeTheme,
        waypointId,
        tourId: tourHook.currentTour.id,
        // Increase confidence for manually created tour groups
        confidence: Math.min(spatialGroup.metadata.confidence + 0.3, 1.0)
      }
    }
    
    // Update tour spatial state
    setTourSpatialState(prev => {
      const newNarrativeGroups = new Map(prev.narrativeGroups)
      const waypointGroups = newNarrativeGroups.get(waypointId) || []
      newNarrativeGroups.set(waypointId, [...waypointGroups, enhancedGroup])
      
      return {
        ...prev,
        narrativeGroups: newNarrativeGroups,
        tourGroups: [...prev.tourGroups, enhancedGroup]
      }
    })
    
    // Track tour event
    tourHook.addNote(
      `Created narrative group: "${narrativeTheme}" with ${nodeIds.length} nodes`,
      ['spatial-intelligence', 'narrative-grouping', narrativeTheme]
    )
    
    return enhancedGroup
    
  }, [tourHook, spatialHook.createManualGroup])
  
  /**
   * Suggest next historical records based on spatial groups
   */
  const suggestRecordsFromSpatialContext = useCallback(async (
    group: SpatialGroup,
    count: number = 3
  ) => {
    if (!tourHook.currentTour || !tourHook.currentWaypoint) {
      return { nodes: [], edges: [] }
    }
    
    const currentNodes = getNodes()
    const graphContext = getGraphContext(currentNodes)
    if (!graphContext) return { nodes: [], edges: [] }
    
    // Enhance context with tour and spatial information
    const enhancedContext: GraphContext = {
      ...graphContext,
      tourContext: tourHook.tourContext || undefined
    }
    
    // Create contextual question based on group characteristics
    const dominantType = group.metadata.dominantType
    const groupTimespan = extractGroupTimespan(group.nodes)
    
    let question = `Show me ${count} ${dominantType} records that connect to this spatial group`
    
    if (groupTimespan.startYear && groupTimespan.endYear) {
      question += ` and chronologically follow the ${groupTimespan.startYear}-${groupTimespan.endYear} period`
    }
    
    // Add narrative context from current waypoint
    if (tourHook.currentWaypoint.narrative) {
      question += ` with relevance to: ${tourHook.currentWaypoint.narrative}`
    }
    
    // Generate tour-aware search rules
    const searchRules = generateTourAwareSearchRules(enhancedContext)
    
    // Use group center as source position for new nodes
    const sourceNode = {
      id: `spatial-group-${group.id}-source`,
      type: 'spatialGroupNode',
      position: { x: group.center.x, y: group.center.y },
      data: {
        title: `Spatial Group: ${group.metadata.dominantType}`,
        groupId: group.id,
        waypointId: tourHook.currentWaypoint.id,
        tourId: tourHook.currentTour.id
      }
    }
    
    try {
      const result = await xataToXYFlow({
        question,
        table: dominantType,
        rules: searchRules,
        context: tourHook.currentWaypoint.narrative || '',
        existingNodes: currentNodes,
        sourceNode,
        tourContext: tourHook.tourContext ? {
          tourId: tourHook.tourContext.tourId,
          waypointId: tourHook.tourContext.currentWaypointId,
          tourMode: tourHook.tourContext.tourMode,
          narrativeContext: tourHook.tourContext.narrativeContext
        } : undefined,
        historicalFilter: {
          mode: 'spatial-group-expansion',
          spatialGroup: {
            id: group.id,
            dominantType: group.metadata.dominantType,
            confidence: group.metadata.confidence,
            nodeCount: group.nodes.length
          }
        },
        spatialHint: {
          centerX: group.center.x,
          centerY: group.center.y,
          preferredDistance: 150 // Place new nodes near group center
        }
      })
      
      return result
    } catch (error) {
      console.error('Error suggesting records from spatial context:', error)
      return { nodes: [], edges: [] }
    }
  }, [tourHook, getNodes])
  
  /**
   * Execute a suggested group action
   */
  const executeSuggestedGroupAction = useCallback(async (
    actionId: string,
    groupId: string,
    action: string
  ) => {
    const group = spatialHook.getGroup(groupId)
    if (!group) return
    
    switch (action) {
      case 'expand':
        // Suggest and add related records
        const suggestions = await suggestRecordsFromSpatialContext(group, 3)
        if (suggestions.nodes.length > 0) {
          addNodes(suggestions.nodes)
          if (suggestions.edges.length > 0) {
            addEdges(suggestions.edges)
          }
          
          tourHook.addNote(
            `Expanded spatial group "${group.metadata.dominantType}" with ${suggestions.nodes.length} related records`,
            ['spatial-expansion', 'group-action']
          )
        }
        break
        
      case 'research':
        // Create a research session from this group
        if (tourHook.tourContext) {
          // This would trigger research canvas creation
          console.log('Creating research session from spatial group:', group.id)
          
          tourHook.addNote(
            `Created research session from spatial group: ${group.metadata.dominantType}`,
            ['research-session', 'spatial-intelligence']
          )
        }
        break
        
      case 'connect':
        // Suggest connections between this group and others
        const otherGroups = spatialHook.spatialGroups.filter(g => g.id !== groupId)
        const connectionSuggestions = suggestGroupConnections(group, otherGroups)
        
        tourHook.addNote(
          `Suggested ${connectionSuggestions.length} potential connections for group "${group.metadata.dominantType}"`,
          ['group-connections', 'spatial-analysis']
        )
        break
        
      case 'contextualize':
        // Add historical context to this group
        if (tourHook.currentWaypoint) {
          const contextNotes = generateGroupHistoricalContext(group, tourHook.currentWaypoint)
          
          tourHook.addNote(
            `Historical context for ${group.metadata.dominantType} group: ${contextNotes}`,
            ['historical-context', 'spatial-intelligence']
          )
        }
        break
    }
    
    // Remove executed action from suggestions
    setTourSpatialState(prev => ({
      ...prev,
      suggestedGroupActions: prev.suggestedGroupActions.filter(
        action => !(action.groupId === groupId && action.action === action)
      )
    }))
    
  }, [spatialHook, suggestRecordsFromSpatialContext, addNodes, addEdges, tourHook])
  
  /**
   * Get spatial progression summary for current tour
   */
  const getSpatialProgressionSummary = useCallback(() => {
    if (!tourHook.currentTour) return null
    
    const visitedWaypoints = tourHook.tourProgress?.completedWaypoints || []
    const spatialChanges = visitedWaypoints.map(waypointId => {
      const groups = tourSpatialState.narrativeGroups.get(waypointId) || []
      return {
        waypointId,
        groupCount: groups.length,
        dominantTypes: [...new Set(groups.map(g => g.metadata.dominantType))],
        totalNodes: groups.reduce((sum, g) => sum + g.nodes.length, 0)
      }
    })
    
    return {
      totalGroups: tourSpatialState.tourGroups.length,
      totalNodes: tourSpatialState.tourGroups.reduce((sum, g) => sum + g.nodes.length, 0),
      waypointProgression: spatialChanges,
      narrativeThemes: [...new Set(
        Array.from(tourSpatialState.narrativeGroups.values())
          .flat()
          .map(g => g.metadata.narrativeTheme)
          .filter(Boolean)
      )],
      spatialEvidence: tourSpatialState.currentSpatialContext.spatialEvidence
    }
  }, [tourHook, tourSpatialState])
  
  // Auto-group nodes when waypoints change (if enabled)
  useEffect(() => {
    if (!config.enableAutoGrouping || !tourHook.currentWaypoint) return
    
    const currentNodes = getNodes()
    if (currentNodes.length < 2) return
    
    // Check if we should create narrative groups based on tour context
    if (config.enableNarrativeGrouping && tourHook.tourContext) {
      const thematicGroups = identifyThematicGroups(currentNodes, tourHook.currentWaypoint)
      
      thematicGroups.forEach(async ({ nodeIds, theme }) => {
        if (nodeIds.length >= 2) {
          await createTourNarrativeGroup(nodeIds, theme, tourHook.currentWaypoint!.id)
        }
      })
    }
  }, [tourHook.currentWaypoint, getNodes, config.enableAutoGrouping, config.enableNarrativeGrouping])
  
  return {
    // Include all base tour functionality
    ...tourHook,
    
    // Enhanced spatial intelligence functionality
    navigateToWaypoint: navigateToWaypointWithSpatialContext,
    
    // Spatial tour state
    tourSpatialState,
    spatialGroups: spatialHook.spatialGroups,
    
    // Spatial tour actions
    createTourNarrativeGroup,
    suggestRecordsFromSpatialContext,
    executeSuggestedGroupAction,
    getSpatialProgressionSummary,
    
    // Spatial grouping controls
    toggleGroupCollapse: spatialHook.toggleGroupCollapse,
    dissolveGroup: spatialHook.dissolveGroup,
    selectGroup: spatialHook.selectGroup,
    
    // Configuration
    spatialConfig: config
  }
}

// Helper functions

function determineNextPeriod(waypoint: any): string {
  const title = waypoint.title?.toLowerCase() || ''
  
  if (title.includes('roswell') || title.includes('1947')) {
    return 'Government Investigation Era (1950-1970)'
  } else if (title.includes('blue book') || title.includes('sign') || title.includes('grudge')) {
    return 'Civilian Research Era (1970-1990)'
  } else if (title.includes('phoenix') || title.includes('civilian')) {
    return 'Modern Research Era (1990-2010)'
  } else if (title.includes('pentagon') || title.includes('disclosure')) {
    return 'Current Disclosure Era (2010-Present)'
  }
  
  return 'Modern Era'
}

function analyzeSpatialContextForTour(
  nodes: Node[], 
  groups: SpatialGroup[], 
  waypoint: any
): TourSpatialState['currentSpatialContext'] {
  const entityTypes = [...new Set(nodes.map(n => n.data?.type).filter(Boolean))]
  
  // Analyze temporal clusters
  const temporalClusters = groups.map(group => {
    const groupTimespan = extractGroupTimespan(group.nodes)
    return {
      startYear: groupTimespan.startYear || new Date().getFullYear(),
      endYear: groupTimespan.endYear || new Date().getFullYear(),
      nodeCount: group.nodes.length,
      groupIds: [group.id]
    }
  }).filter(cluster => cluster.startYear > 0)
  
  // Determine narrative progression
  const currentTheme = waypoint.title || 'Exploration'
  const suggestedNextTheme = determineNextPeriod(waypoint)
  
  const spatialEvidence = groups.map(group => 
    `${group.metadata.dominantType} cluster with ${group.nodes.length} nodes (confidence: ${Math.round(group.metadata.confidence * 100)}%)`
  )
  
  return {
    dominantEntityTypes: entityTypes,
    temporalClusters,
    narrativeProgression: {
      currentTheme,
      suggestedNextTheme,
      spatialEvidence
    }
  }
}

function generateTourGroupActions(
  groups: SpatialGroup[], 
  context: GraphContext, 
  waypoint: any
): TourSpatialState['suggestedGroupActions'] {
  const actions: TourSpatialState['suggestedGroupActions'] = []
  
  groups.forEach(group => {
    // Suggest expansion for high-confidence groups
    if (group.metadata.confidence > 0.7 && group.nodes.length < 5) {
      actions.push({
        groupId: group.id,
        action: 'expand',
        reason: `High-confidence ${group.metadata.dominantType} group could reveal more related records`,
        priority: 'high'
      })
    }
    
    // Suggest research sessions for substantial groups
    if (group.nodes.length >= 3) {
      actions.push({
        groupId: group.id,
        action: 'research',
        reason: `Substantial ${group.metadata.dominantType} group warrants deeper investigation`,
        priority: 'medium'
      })
    }
    
    // Suggest contextualization for tour-relevant groups
    if (context.tourContext && group.metadata.dominantType === 'events') {
      actions.push({
        groupId: group.id,
        action: 'contextualize',
        reason: `Event cluster relevant to tour narrative: ${context.tourContext.narrativeContext}`,
        priority: 'medium'
      })
    }
  })
  
  // Suggest connections between compatible groups
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const group1 = groups[i]
      const group2 = groups[j]
      
      if (areGroupsCompatible(group1, group2)) {
        actions.push({
          groupId: group1.id,
          action: 'connect',
          reason: `${group1.metadata.dominantType} and ${group2.metadata.dominantType} groups show potential connections`,
          priority: 'low'
        })
      }
    }
  }
  
  return actions.slice(0, 6) // Limit to 6 suggestions
}

function extractGroupTimespan(nodes: Node[]): { startYear?: number, endYear?: number } {
  const dates = nodes
    .map(node => {
      const date = node.data?.date || node.data?.timestamp || node.data?.eventDate
      return date ? new Date(date as string) : null
    })
    .filter(Boolean)
    .map(date => date!.getFullYear())
  
  if (dates.length === 0) return {}
  
  return {
    startYear: Math.min(...dates),
    endYear: Math.max(...dates)
  }
}

function suggestGroupConnections(group: SpatialGroup, otherGroups: SpatialGroup[]): Array<{
  targetGroupId: string
  connectionType: string
  reason: string
}> {
  return otherGroups
    .filter(otherGroup => areGroupsCompatible(group, otherGroup))
    .map(otherGroup => ({
      targetGroupId: otherGroup.id,
      connectionType: 'thematic',
      reason: `Shared entity types: ${group.metadata.dominantType} + ${otherGroup.metadata.dominantType}`
    }))
    .slice(0, 3)
}

function areGroupsCompatible(group1: SpatialGroup, group2: SpatialGroup): boolean {
  // Groups are compatible if they share entity types or have overlapping timeframes
  const sharedTypes = Object.keys(group1.metadata.entityCounts).some(type => 
    group2.metadata.entityCounts[type] > 0
  )
  
  if (sharedTypes) return true
  
  // Check temporal compatibility
  const timespan1 = extractGroupTimespan(group1.nodes)
  const timespan2 = extractGroupTimespan(group2.nodes)
  
  if (timespan1.startYear && timespan1.endYear && timespan2.startYear && timespan2.endYear) {
    const overlap = !(timespan1.endYear < timespan2.startYear || timespan2.endYear < timespan1.startYear)
    return overlap
  }
  
  return false
}

function generateGroupHistoricalContext(group: SpatialGroup, waypoint: any): string {
  const timespan = extractGroupTimespan(group.nodes)
  const dominantType = group.metadata.dominantType
  
  let context = `${dominantType} cluster`
  
  if (timespan.startYear && timespan.endYear) {
    if (timespan.startYear === timespan.endYear) {
      context += ` from ${timespan.startYear}`
    } else {
      context += ` spanning ${timespan.startYear}-${timespan.endYear}`
    }
  }
  
  context += ` with ${group.nodes.length} records (${Math.round(group.metadata.confidence * 100)}% confidence)`
  
  if (waypoint.narrative) {
    context += `. Relates to tour narrative: ${waypoint.narrative}`
  }
  
  return context
}

function identifyThematicGroups(nodes: Node[], waypoint: any): Array<{
  nodeIds: string[]
  theme: string
}> {
  const groups: Array<{ nodeIds: string[], theme: string }> = []
  
  // Group by entity type
  const typeGroups = new Map<string, string[]>()
  nodes.forEach(node => {
    const type = node.data?.type
    if (type) {
      if (!typeGroups.has(type)) {
        typeGroups.set(type, [])
      }
      typeGroups.get(type)!.push(node.id)
    }
  })
  
  // Convert type groups to thematic groups
  typeGroups.forEach((nodeIds, type) => {
    if (nodeIds.length >= 2) {
      groups.push({
        nodeIds,
        theme: `${type} related to ${waypoint.title || 'current exploration'}`
      })
    }
  })
  
  return groups
}