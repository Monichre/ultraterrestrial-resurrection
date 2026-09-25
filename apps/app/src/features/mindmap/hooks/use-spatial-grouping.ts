'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type Node, type XYPosition } from '@xyflow/react'
import { useMindMapStore } from '@/features/mindmap/store'
import { useProximityAnalysis } from './use-proximity-analysis'

export interface SpatialGroup {
  id: string
  nodes: Node[]
  boundary: {
    x: number
    y: number
    width: number
    height: number
  }
  center: XYPosition
  createdAt: Date
  lastUpdated: Date
  isCollapsed: boolean
  isPersistent: boolean // Survives node movement
  metadata: {
    dominantType: string // Most common entity type in group
    entityCounts: Record<string, number>
    confidence: number // How stable the grouping is
  }
}

export interface GroupingOptions {
  minGroupSize: number // Minimum nodes to form a group
  maxGroupDistance: number // Maximum distance between group members
  persistenceThreshold: number // Time before group becomes persistent
  boundaryPadding: number // Visual padding around group boundary
  autoCollapse: boolean // Automatically collapse large groups
  maxGroupsVisible: number // Maximum concurrent groups
}

const DEFAULT_OPTIONS: GroupingOptions = {
  minGroupSize: 2,
  maxGroupDistance: 200,
  persistenceThreshold: 3000, // 3 seconds
  boundaryPadding: 30,
  autoCollapse: false,
  maxGroupsVisible: 5
}

export function useSpatialGrouping(options: Partial<GroupingOptions> = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const { nodes } = useMindMapStore()
  const { proximityGroups, analysisResults } = useProximityAnalysis()
  
  const [spatialGroups, setSpatialGroups] = useState<Map<string, SpatialGroup>>(new Map())
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null)
  
  const persistenceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const groupIdCounter = useRef(0)
  
  // Calculate boundary box for a set of nodes
  const calculateBoundary = useCallback((groupNodes: Node[]) => {
    if (groupNodes.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }
    
    const positions = groupNodes.map(node => ({
      x: node.position.x,
      y: node.position.y,
      width: node.measured?.width || 200,
      height: node.measured?.height || 100
    }))
    
    const minX = Math.min(...positions.map(p => p.x))
    const minY = Math.min(...positions.map(p => p.y))
    const maxX = Math.max(...positions.map(p => p.x + p.width))
    const maxY = Math.max(...positions.map(p => p.y + p.height))
    
    return {
      x: minX - config.boundaryPadding,
      y: minY - config.boundaryPadding,
      width: maxX - minX + (config.boundaryPadding * 2),
      height: maxY - minY + (config.boundaryPadding * 2)
    }
  }, [config.boundaryPadding])
  
  // Calculate center point of a group
  const calculateCenter = useCallback((groupNodes: Node[]): XYPosition => {
    if (groupNodes.length === 0) return { x: 0, y: 0 }
    
    const totalX = groupNodes.reduce((sum, node) => sum + node.position.x + ((node.measured?.width || 200) / 2), 0)
    const totalY = groupNodes.reduce((sum, node) => sum + node.position.y + ((node.measured?.height || 100) / 2), 0)
    
    return {
      x: totalX / groupNodes.length,
      y: totalY / groupNodes.length
    }
  }, [])
  
  // Analyze group metadata
  const analyzeGroupMetadata = useCallback((groupNodes: Node[]) => {
    const entityCounts: Record<string, number> = {}
    let dominantType = 'unknown'
    let maxCount = 0
    
    groupNodes.forEach(node => {
      const type = node.data?.type || 'unknown'
      entityCounts[type] = (entityCounts[type] || 0) + 1
      
      if (entityCounts[type] > maxCount) {
        maxCount = entityCounts[type]
        dominantType = type
      }
    })
    
    // Calculate confidence based on group stability and analysis results
    let confidence = 0.5 // Base confidence
    
    // Increase confidence if we have AI analysis
    const nodeIds = groupNodes.map(n => n.id).sort().join('-')
    const hasAnalysis = analysisResults.some(result => 
      result.groupId === nodeIds || 
      result.nodes.some(n => groupNodes.find(gn => gn.id === n.id))
    )
    
    if (hasAnalysis) confidence += 0.3
    
    // Increase confidence for homogeneous groups (same entity types)
    const uniqueTypes = Object.keys(entityCounts).length
    if (uniqueTypes === 1) confidence += 0.2
    else if (uniqueTypes === 2) confidence += 0.1
    
    return {
      dominantType,
      entityCounts,
      confidence: Math.min(confidence, 1.0)
    }
  }, [analysisResults])
  
  // Generate unique group ID
  const generateGroupId = useCallback(() => {
    return `group-${++groupIdCounter.current}-${Date.now()}`
  }, [])
  
  // Create spatial group from proximity group
  const createSpatialGroup = useCallback((proximityGroup: { id: string, nodes: Node[] }, isPersistent = false) => {
    const groupId = generateGroupId()
    const boundary = calculateBoundary(proximityGroup.nodes)
    const center = calculateCenter(proximityGroup.nodes)
    const metadata = analyzeGroupMetadata(proximityGroup.nodes)
    const now = new Date()
    
    const spatialGroup: SpatialGroup = {
      id: groupId,
      nodes: proximityGroup.nodes,
      boundary,
      center,
      createdAt: now,
      lastUpdated: now,
      isCollapsed: config.autoCollapse && proximityGroup.nodes.length > 4,
      isPersistent,
      metadata
    }
    
    return spatialGroup
  }, [generateGroupId, calculateBoundary, calculateCenter, analyzeGroupMetadata, config.autoCollapse])
  
  // Update spatial groups based on proximity analysis
  useEffect(() => {
    const newGroups = new Map<string, SpatialGroup>()
    const currentTime = new Date()
    
    // Process each proximity group
    proximityGroups.forEach(proximityGroup => {
      if (proximityGroup.nodes.length < config.minGroupSize) return
      
      // Check if we already have a spatial group for these nodes
      const nodeIds = proximityGroup.nodes.map(n => n.id).sort()
      const existingGroup = Array.from(spatialGroups.values()).find(group => {
        const groupNodeIds = group.nodes.map(n => n.id).sort()
        return nodeIds.length === groupNodeIds.length && 
               nodeIds.every(id => groupNodeIds.includes(id))
      })
      
      if (existingGroup) {
        // Update existing group
        const updatedGroup: SpatialGroup = {
          ...existingGroup,
          nodes: proximityGroup.nodes, // Update with current node positions
          boundary: calculateBoundary(proximityGroup.nodes),
          center: calculateCenter(proximityGroup.nodes),
          lastUpdated: currentTime,
          metadata: analyzeGroupMetadata(proximityGroup.nodes)
        }
        
        newGroups.set(existingGroup.id, updatedGroup)
      } else {
        // Create new group
        const newGroup = createSpatialGroup(proximityGroup)
        newGroups.set(newGroup.id, newGroup)
        
        // Set persistence timer
        if (!newGroup.isPersistent) {
          const timer = setTimeout(() => {
            setSpatialGroups(prev => {
              const updated = new Map(prev)
              const group = updated.get(newGroup.id)
              if (group) {
                updated.set(newGroup.id, { ...group, isPersistent: true })
              }
              return updated
            })
          }, config.persistenceThreshold)
          
          persistenceTimers.current.set(newGroup.id, timer)
        }
      }
    })
    
    // Keep persistent groups that may have lost proximity but are still valid
    spatialGroups.forEach((group, groupId) => {
      if (group.isPersistent && !newGroups.has(groupId)) {
        // Check if nodes are still reasonably close
        const distances = []
        for (let i = 0; i < group.nodes.length; i++) {
          for (let j = i + 1; j < group.nodes.length; j++) {
            const node1 = nodes.find(n => n.id === group.nodes[i].id)
            const node2 = nodes.find(n => n.id === group.nodes[j].id)
            if (node1 && node2) {
              const dx = node1.position.x - node2.position.x
              const dy = node1.position.y - node2.position.y
              distances.push(Math.sqrt(dx * dx + dy * dy))
            }
          }
        }
        
        const maxDistance = Math.max(...distances)
        if (maxDistance <= config.maxGroupDistance) {
          // Update the persistent group with current node positions
          const currentNodes = group.nodes.map(gNode => 
            nodes.find(n => n.id === gNode.id) || gNode
          )
          
          const updatedGroup: SpatialGroup = {
            ...group,
            nodes: currentNodes,
            boundary: calculateBoundary(currentNodes),
            center: calculateCenter(currentNodes),
            lastUpdated: currentTime
          }
          
          newGroups.set(groupId, updatedGroup)
        }
      }
    })
    
    // Limit total groups
    if (newGroups.size > config.maxGroupsVisible) {
      const sortedGroups = Array.from(newGroups.values())
        .sort((a, b) => b.metadata.confidence - a.metadata.confidence)
        .slice(0, config.maxGroupsVisible)
      
      const limitedGroups = new Map()
      sortedGroups.forEach(group => limitedGroups.set(group.id, group))
      setSpatialGroups(limitedGroups)
    } else {
      setSpatialGroups(newGroups)
    }
  }, [proximityGroups, nodes, config, spatialGroups, calculateBoundary, calculateCenter, analyzeGroupMetadata, createSpatialGroup])
  
  // Manual group creation
  const createManualGroup = useCallback((nodeIds: string[]) => {
    const groupNodes = nodes.filter(node => nodeIds.includes(node.id))
    if (groupNodes.length < config.minGroupSize) return null
    
    const proximityGroup = { id: 'manual', nodes: groupNodes }
    const spatialGroup = createSpatialGroup(proximityGroup, true) // Immediately persistent
    
    setSpatialGroups(prev => new Map(prev.set(spatialGroup.id, spatialGroup)))
    return spatialGroup
  }, [nodes, config.minGroupSize, createSpatialGroup])
  
  // Group management actions
  const toggleGroupCollapse = useCallback((groupId: string) => {
    setSpatialGroups(prev => {
      const updated = new Map(prev)
      const group = updated.get(groupId)
      if (group) {
        updated.set(groupId, { ...group, isCollapsed: !group.isCollapsed })
      }
      return updated
    })
  }, [])
  
  const dissolveGroup = useCallback((groupId: string) => {
    setSpatialGroups(prev => {
      const updated = new Map(prev)
      updated.delete(groupId)
      return updated
    })
    
    // Clear persistence timer
    const timer = persistenceTimers.current.get(groupId)
    if (timer) {
      clearTimeout(timer)
      persistenceTimers.current.delete(groupId)
    }
  }, [])
  
  const selectGroup = useCallback((groupId: string | null) => {
    setSelectedGroupId(groupId)
  }, [])
  
  // Get group by ID
  const getGroup = useCallback((groupId: string) => {
    return spatialGroups.get(groupId)
  }, [spatialGroups])
  
  // Get groups containing a specific node
  const getGroupsContainingNode = useCallback((nodeId: string) => {
    return Array.from(spatialGroups.values()).filter(group =>
      group.nodes.some(node => node.id === nodeId)
    )
  }, [spatialGroups])
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      persistenceTimers.current.forEach(timer => clearTimeout(timer))
    }
  }, [])
  
  return {
    // State
    spatialGroups: Array.from(spatialGroups.values()),
    selectedGroupId,
    draggedGroupId,
    
    // Actions
    createManualGroup,
    toggleGroupCollapse,
    dissolveGroup,
    selectGroup,
    setDraggedGroupId,
    
    // Queries
    getGroup,
    getGroupsContainingNode,
    
    // Configuration
    config
  }
}