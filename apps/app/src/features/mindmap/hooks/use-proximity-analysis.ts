'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type Node, type XYPosition, useReactFlow } from '@xyflow/react'
import { useMindMapStore } from '@/features/mindmap/store'

export interface ProximityEvent {
  id: string
  nodes: Node[]
  positions: XYPosition[]
  distance: number
  timestamp: Date
  type: 'enter' | 'exit' | 'sustained'
}

export interface ProximityAnalysisOptions {
  proximityThreshold: number // Distance in pixels to trigger proximity
  sustainedThreshold: number // Time in ms for sustained proximity
  analysisDelay: number // Delay before triggering analysis
  enableGrouping: boolean // Whether to enable auto-grouping
  enableAIAnalysis: boolean // Whether to trigger AI analysis
}

const DEFAULT_OPTIONS: ProximityAnalysisOptions = {
  proximityThreshold: 150,
  sustainedThreshold: 2000,
  analysisDelay: 1000,
  enableGrouping: true,
  enableAIAnalysis: true
}

export interface ProximityAnalysisResult {
  groupId: string
  nodes: Node[]
  analysis: {
    relationships: string[]
    commonThemes: string[]
    suggestedConnections: Array<{
      sourceId: string
      targetId: string
      reason: string
      confidence: number
    }>
    researchQuestions: string[]
  }
}

export function useProximityAnalysis(options: Partial<ProximityAnalysisOptions> = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const { nodes } = useMindMapStore()
  const { getViewport } = useReactFlow()
  
  const [proximityEvents, setProximityEvents] = useState<ProximityEvent[]>([])
  const [proximityGroups, setProximityGroups] = useState<Map<string, Node[]>>(new Map())
  const [analysisResults, setAnalysisResults] = useState<Map<string, ProximityAnalysisResult>>(new Map())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const proximityTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const sustainedGroups = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const lastAnalysisTime = useRef<Date>(new Date(0))
  
  // Calculate distance between two nodes
  const calculateDistance = useCallback((node1: Node, node2: Node): number => {
    const dx = node1.position.x - node2.position.x
    const dy = node1.position.y - node2.position.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])
  
  // Generate group ID from node IDs
  const generateGroupId = useCallback((nodeIds: string[]): string => {
    return nodeIds.sort().join('-')
  }, [])
  
  // Check for proximity between nodes
  const checkProximity = useCallback(() => {
    if (nodes.length < 2) return
    
    const newGroups = new Map<string, Node[]>()
    const currentTime = new Date()
    
    // Check all pairs of nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i]
        const node2 = nodes[j]
        const distance = calculateDistance(node1, node2)
        
        if (distance <= config.proximityThreshold) {
          const groupId = generateGroupId([node1.id, node2.id])
          
          // Check if this is a new proximity event
          const wasInProximity = proximityGroups.has(groupId)
          
          if (!wasInProximity) {
            // New proximity detected
            const event: ProximityEvent = {
              id: groupId,
              nodes: [node1, node2],
              positions: [node1.position, node2.position],
              distance,
              timestamp: currentTime,
              type: 'enter'
            }
            
            setProximityEvents(prev => [...prev.slice(-20), event]) // Keep last 20 events
            
            // Set timer for sustained proximity analysis
            if (config.enableAIAnalysis) {
              const timer = setTimeout(() => {
                triggerProximityAnalysis([node1, node2], groupId)
              }, config.sustainedThreshold)
              
              sustainedGroups.current.set(groupId, timer)
            }
          }
          
          newGroups.set(groupId, [node1, node2])
        }
      }
    }
    
    // Check for groups that are no longer in proximity
    proximityGroups.forEach((group, groupId) => {
      if (!newGroups.has(groupId)) {
        // Proximity ended
        const timer = sustainedGroups.current.get(groupId)
        if (timer) {
          clearTimeout(timer)
          sustainedGroups.current.delete(groupId)
        }
        
        const event: ProximityEvent = {
          id: groupId,
          nodes: group,
          positions: group.map(n => n.position),
          distance: 0,
          timestamp: currentTime,
          type: 'exit'
        }
        
        setProximityEvents(prev => [...prev.slice(-20), event])
      }
    })
    
    setProximityGroups(newGroups)
  }, [nodes, config, proximityGroups, calculateDistance, generateGroupId])
  
  // Trigger AI analysis for proximity group
  const triggerProximityAnalysis = useCallback(async (groupNodes: Node[], groupId: string) => {
    if (!config.enableAIAnalysis || isAnalyzing) return
    
    // Throttle analysis calls
    const now = new Date()
    if (now.getTime() - lastAnalysisTime.current.getTime() < config.analysisDelay) {
      return
    }
    
    setIsAnalyzing(true)
    lastAnalysisTime.current = now
    
    try {
      // Mock AI analysis - in real implementation, this would call your AI service
      const analysis = await performProximityAnalysis(groupNodes)
      
      const result: ProximityAnalysisResult = {
        groupId,
        nodes: groupNodes,
        analysis
      }
      
      setAnalysisResults(prev => new Map(prev.set(groupId, result)))
      
      // Emit sustained proximity event
      const event: ProximityEvent = {
        id: groupId,
        nodes: groupNodes,
        positions: groupNodes.map(n => n.position),
        distance: calculateDistance(groupNodes[0], groupNodes[1]),
        timestamp: now,
        type: 'sustained'
      }
      
      setProximityEvents(prev => [...prev.slice(-20), event])
      
    } catch (error) {
      console.error('Proximity analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [config, isAnalyzing, calculateDistance])
  
  // Mock AI analysis function
  const performProximityAnalysis = async (nodes: Node[]) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const nodeTypes = nodes.map(n => n.data?.type || 'unknown')
    const nodeNames = nodes.map(n => n.data?.name || n.data?.label || 'Unknown')
    
    return {
      relationships: [
        `${nodeNames[0]} and ${nodeNames[1]} may be connected through shared timeline`,
        `Both entities appear in similar geographic regions`,
        `Potential witness/event correlation detected`
      ],
      commonThemes: [
        'Government Involvement',
        'Military Personnel',
        'Classified Operations',
        'Witness Testimonies'
      ],
      suggestedConnections: [
        {
          sourceId: nodes[0].id,
          targetId: nodes[1].id,
          reason: 'Temporal proximity in events',
          confidence: 0.75
        },
        {
          sourceId: nodes[1].id,
          targetId: nodes[0].id,
          reason: 'Geographic correlation',
          confidence: 0.68
        }
      ],
      researchQuestions: [
        `What is the relationship between ${nodeNames[0]} and ${nodeNames[1]}?`,
        'Are there additional witnesses or documents that connect these entities?',
        'What patterns emerge when analyzing the timeline of these events?',
        'How do these entities fit into the broader disclosure narrative?'
      ]
    }
  }
  
  // Force analysis for specific nodes
  const forceAnalysis = useCallback(async (nodeIds: string[]) => {
    const targetNodes = nodes.filter(n => nodeIds.includes(n.id))
    if (targetNodes.length >= 2) {
      const groupId = generateGroupId(nodeIds)
      await triggerProximityAnalysis(targetNodes, groupId)
    }
  }, [nodes, generateGroupId, triggerProximityAnalysis])
  
  // Clear analysis for group
  const clearAnalysis = useCallback((groupId: string) => {
    setAnalysisResults(prev => {
      const next = new Map(prev)
      next.delete(groupId)
      return next
    })
  }, [])
  
  // Get analysis for specific group
  const getAnalysis = useCallback((groupId: string) => {
    return analysisResults.get(groupId)
  }, [analysisResults])
  
  // Get current proximity groups
  const getCurrentGroups = useCallback(() => {
    return Array.from(proximityGroups.entries()).map(([id, nodes]) => ({
      id,
      nodes,
      hasAnalysis: analysisResults.has(id)
    }))
  }, [proximityGroups, analysisResults])
  
  // Effect to check proximity on node position changes
  useEffect(() => {
    const timer = setInterval(checkProximity, 500) // Check every 500ms
    return () => clearInterval(timer)
  }, [checkProximity])
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      proximityTimers.current.forEach(timer => clearTimeout(timer))
      sustainedGroups.current.forEach(timer => clearTimeout(timer))
    }
  }, [])
  
  return {
    // State
    proximityEvents,
    proximityGroups: getCurrentGroups(),
    analysisResults: Array.from(analysisResults.values()),
    isAnalyzing,
    
    // Actions
    forceAnalysis,
    clearAnalysis,
    getAnalysis,
    
    // Configuration
    config
  }
}