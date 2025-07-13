'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { type Node, type Edge } from '@xyflow/react'
import { useTourWithSpatialIntelligence } from './use-tour-with-spatial-intelligence'
import { 
  useIntelligentNarrativeLayout, 
  type NarrativeLayoutConfig,
  type NarrativeLayoutResult 
} from '@/features/mindmap/layouts/intelligent-narrative-layout'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'

export interface EnhancedTourConfig {
  // Spatial intelligence configuration
  spatialConfig: {
    enableAutoGrouping: boolean
    enableNarrativeGrouping: boolean
    autoSuggestConnections: boolean
    spatialProximityThreshold: number
  }
  
  // Narrative layout configuration
  layoutConfig: Partial<NarrativeLayoutConfig>
  
  // Auto-layout behavior
  autoLayout: {
    enableIntelligentPositioning: boolean
    repositionOnWaypointChange: boolean
    animateLayoutTransitions: boolean
    preserveUserPositions: boolean
  }
  
  // Performance settings
  performance: {
    debounceLayoutUpdates: number // ms
    maxNodesForAutoLayout: number
    enableLayoutCaching: boolean
  }
}

export interface EnhancedTourState {
  // Combined spatial and narrative state
  currentLayout: NarrativeLayoutResult | null
  isLayoutUpdating: boolean
  layoutAnimationProgress: number
  
  // Tour enhancement status
  enhancementLevel: {
    spatialIntelligence: number // 0-1
    narrativeFlow: number // 0-1
    overallEnhancement: number // 0-1
  }
  
  // Layout history for undo/redo
  layoutHistory: {
    layouts: NarrativeLayoutResult[]
    currentIndex: number
    maxHistory: number
  }
  
  // Performance metrics
  performanceMetrics: {
    lastLayoutTime: number
    averageLayoutTime: number
    layoutCount: number
  }
}

const DEFAULT_ENHANCED_CONFIG: EnhancedTourConfig = {
  spatialConfig: {
    enableAutoGrouping: true,
    enableNarrativeGrouping: true,
    autoSuggestConnections: true,
    spatialProximityThreshold: 200
  },
  layoutConfig: {
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
    }
  },
  autoLayout: {
    enableIntelligentPositioning: true,
    repositionOnWaypointChange: true,
    animateLayoutTransitions: true,
    preserveUserPositions: false
  },
  performance: {
    debounceLayoutUpdates: 300,
    maxNodesForAutoLayout: 100,
    enableLayoutCaching: true
  }
}

/**
 * Enhanced Tour Controller - Combines spatial intelligence with narrative layout
 * Provides a unified interface for intelligent tour management
 */
export function useEnhancedTourController(
  config: Partial<EnhancedTourConfig> = {},
  canvasSize: { width: number, height: number } = { width: 1200, height: 800 }
) {
  const finalConfig = { ...DEFAULT_ENHANCED_CONFIG, ...config }
  
  // Core hooks
  const spatialTourHook = useTourWithSpatialIntelligence(finalConfig.spatialConfig)
  const { applyLayout, layoutEngine } = useIntelligentNarrativeLayout(finalConfig.layoutConfig, canvasSize)
  const { getNodes, getEdges, setNodes, setEdges } = useMindMap()
  
  // Enhanced tour state
  const [enhancedState, setEnhancedState] = useState<EnhancedTourState>({
    currentLayout: null,
    isLayoutUpdating: false,
    layoutAnimationProgress: 0,
    enhancementLevel: {
      spatialIntelligence: 0,
      narrativeFlow: 0,
      overallEnhancement: 0
    },
    layoutHistory: {
      layouts: [],
      currentIndex: -1,
      maxHistory: 10
    },
    performanceMetrics: {
      lastLayoutTime: 0,
      averageLayoutTime: 0,
      layoutCount: 0
    }
  })
  
  // Debounced layout update
  const layoutUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userModifiedPositionsRef = useRef<Set<string>>(new Set())
  
  /**
   * Apply intelligent layout to current nodes
   */
  const applyIntelligentLayout = useCallback(async (
    forceUpdate: boolean = false,
    preserveUserPositions: boolean = finalConfig.autoLayout.preserveUserPositions
  ) => {
    const currentNodes = getNodes()
    const currentEdges = getEdges()
    
    // Skip if too many nodes for performance
    if (currentNodes.length > finalConfig.performance.maxNodesForAutoLayout && !forceUpdate) {
      console.log('Skipping auto-layout: too many nodes for performance')
      return
    }
    
    setEnhancedState(prev => ({ ...prev, isLayoutUpdating: true }))
    
    const startTime = performance.now()
    
    try {
      // Get current tour context
      const graphContext = getGraphContext(currentNodes)
      const tourContext = spatialTourHook.tourContext
      
      // Filter nodes for layout (preserve user-positioned nodes if configured)
      let nodesForLayout = currentNodes
      if (preserveUserPositions) {
        const userModified = Array.from(userModifiedPositionsRef.current)
        nodesForLayout = currentNodes.map(node => {
          if (userModified.includes(node.id)) {
            // Keep user position but mark as user-positioned
            return {
              ...node,
              data: {
                ...node.data,
                userPositioned: true
              }
            }
          }
          return node
        })
      }
      
      // Apply layout with spatial groups
      const layoutResult = applyLayout(
        nodesForLayout,
        currentEdges,
        spatialTourHook.spatialGroups,
        tourContext || undefined
      )
      
      // Calculate enhancement metrics
      const enhancementLevel = calculateEnhancementLevel(
        layoutResult,
        spatialTourHook.spatialGroups,
        tourContext
      )
      
      // Update layout state
      setEnhancedState(prev => {
        const endTime = performance.now()
        const layoutTime = endTime - startTime
        const newLayoutCount = prev.performanceMetrics.layoutCount + 1
        const newAverageTime = ((prev.performanceMetrics.averageLayoutTime * prev.performanceMetrics.layoutCount) + layoutTime) / newLayoutCount
        
        // Update layout history
        const newLayouts = [...prev.layoutHistory.layouts]
        newLayouts.push(layoutResult)
        if (newLayouts.length > prev.layoutHistory.maxHistory) {
          newLayouts.shift()
        }
        
        return {
          ...prev,
          currentLayout: layoutResult,
          isLayoutUpdating: false,
          enhancementLevel,
          layoutHistory: {
            ...prev.layoutHistory,
            layouts: newLayouts,
            currentIndex: newLayouts.length - 1
          },
          performanceMetrics: {
            lastLayoutTime: layoutTime,
            averageLayoutTime: newAverageTime,
            layoutCount: newLayoutCount
          }
        }
      })
      
      // Apply layout to mindmap if animation is enabled
      if (finalConfig.autoLayout.animateLayoutTransitions) {
        await animateToLayout(layoutResult)
      } else {
        setNodes(layoutResult.nodes)
        setEdges(layoutResult.edges)
      }
      
    } catch (error) {
      console.error('Error applying intelligent layout:', error)
      setEnhancedState(prev => ({ ...prev, isLayoutUpdating: false }))
    }
  }, [getNodes, getEdges, setNodes, setEdges, spatialTourHook, applyLayout, finalConfig])
  
  /**
   * Animate layout transitions smoothly
   */
  const animateToLayout = useCallback(async (layoutResult: NarrativeLayoutResult) => {
    const currentNodes = getNodes()
    const { nodes: targetNodes, edges: targetEdges } = layoutResult
    
    // Create animation frames
    const animationDuration = 1000 // 1 second
    const frameRate = 60
    const totalFrames = Math.floor(animationDuration / (1000 / frameRate))
    
    for (let frame = 0; frame <= totalFrames; frame++) {
      const progress = frame / totalFrames
      const easeProgress = easeInOutCubic(progress)
      
      // Interpolate node positions
      const interpolatedNodes = currentNodes.map(currentNode => {
        const targetNode = targetNodes.find(n => n.id === currentNode.id)
        if (!targetNode || !targetNode.position || !currentNode.position) {
          return currentNode
        }
        
        const startPos = currentNode.position
        const endPos = targetNode.position
        
        return {
          ...targetNode,
          position: {
            x: startPos.x + (endPos.x - startPos.x) * easeProgress,
            y: startPos.y + (endPos.y - startPos.y) * easeProgress
          }
        }
      })
      
      // Update layout animation progress
      setEnhancedState(prev => ({
        ...prev,
        layoutAnimationProgress: progress
      }))
      
      // Apply intermediate positions
      setNodes(interpolatedNodes)
      
      // Wait for next frame
      if (frame < totalFrames) {
        await new Promise(resolve => setTimeout(resolve, 1000 / frameRate))
      }
    }
    
    // Final state
    setNodes(targetNodes)
    setEdges(targetEdges)
    setEnhancedState(prev => ({
      ...prev,
      layoutAnimationProgress: 0
    }))
  }, [getNodes, setNodes, setEdges])
  
  /**
   * Debounced layout update
   */
  const scheduleLayoutUpdate = useCallback(() => {
    if (layoutUpdateTimeoutRef.current) {
      clearTimeout(layoutUpdateTimeoutRef.current)
    }
    
    layoutUpdateTimeoutRef.current = setTimeout(() => {
      if (finalConfig.autoLayout.enableIntelligentPositioning) {
        applyIntelligentLayout()
      }
    }, finalConfig.performance.debounceLayoutUpdates)
  }, [applyIntelligentLayout, finalConfig])
  
  /**
   * Enhanced waypoint navigation with layout updates
   */
  const navigateToWaypointWithLayout = useCallback(async (waypointIndex: number) => {
    // Navigate using spatial intelligence
    await spatialTourHook.navigateToWaypoint(waypointIndex)
    
    // Apply layout if configured
    if (finalConfig.autoLayout.repositionOnWaypointChange) {
      await applyIntelligentLayout()
    }
  }, [spatialTourHook.navigateToWaypoint, applyIntelligentLayout, finalConfig])
  
  /**
   * Track user-modified node positions
   */
  const trackNodePositionChange = useCallback((nodeId: string, newPosition: { x: number, y: number }) => {
    if (finalConfig.autoLayout.preserveUserPositions) {
      userModifiedPositionsRef.current.add(nodeId)
    }
  }, [finalConfig.autoLayout.preserveUserPositions])
  
  /**
   * Reset layout history
   */
  const resetLayoutHistory = useCallback(() => {
    setEnhancedState(prev => ({
      ...prev,
      layoutHistory: {
        layouts: [],
        currentIndex: -1,
        maxHistory: 10
      }
    }))
  }, [])
  
  /**
   * Undo last layout change
   */
  const undoLayout = useCallback(() => {
    setEnhancedState(prev => {
      const newIndex = Math.max(0, prev.layoutHistory.currentIndex - 1)
      const layoutToApply = prev.layoutHistory.layouts[newIndex]
      
      if (layoutToApply) {
        setNodes(layoutToApply.nodes)
        setEdges(layoutToApply.edges)
        
        return {
          ...prev,
          currentLayout: layoutToApply,
          layoutHistory: {
            ...prev.layoutHistory,
            currentIndex: newIndex
          }
        }
      }
      
      return prev
    })
  }, [setNodes, setEdges])
  
  /**
   * Redo layout change
   */
  const redoLayout = useCallback(() => {
    setEnhancedState(prev => {
      const newIndex = Math.min(prev.layoutHistory.layouts.length - 1, prev.layoutHistory.currentIndex + 1)
      const layoutToApply = prev.layoutHistory.layouts[newIndex]
      
      if (layoutToApply && newIndex !== prev.layoutHistory.currentIndex) {
        setNodes(layoutToApply.nodes)
        setEdges(layoutToApply.edges)
        
        return {
          ...prev,
          currentLayout: layoutToApply,
          layoutHistory: {
            ...prev.layoutHistory,
            currentIndex: newIndex
          }
        }
      }
      
      return prev
    })
  }, [setNodes, setEdges])
  
  // Auto-update layout when spatial groups change
  useEffect(() => {
    if (spatialTourHook.spatialGroups.length > 0) {
      scheduleLayoutUpdate()
    }
  }, [spatialTourHook.spatialGroups.length, scheduleLayoutUpdate])
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (layoutUpdateTimeoutRef.current) {
        clearTimeout(layoutUpdateTimeoutRef.current)
      }
    }
  }, [])
  
  return {
    // Include all spatial tour functionality
    ...spatialTourHook,
    
    // Enhanced navigation with layout
    navigateToWaypoint: navigateToWaypointWithLayout,
    
    // Layout control
    applyIntelligentLayout,
    animateToLayout,
    scheduleLayoutUpdate,
    
    // Layout state
    enhancedState,
    currentLayout: enhancedState.currentLayout,
    isLayoutUpdating: enhancedState.isLayoutUpdating,
    enhancementLevel: enhancedState.enhancementLevel,
    
    // Layout history
    undoLayout,
    redoLayout,
    resetLayoutHistory,
    canUndo: enhancedState.layoutHistory.currentIndex > 0,
    canRedo: enhancedState.layoutHistory.currentIndex < enhancedState.layoutHistory.layouts.length - 1,
    
    // User interaction tracking
    trackNodePositionChange,
    
    // Configuration
    config: finalConfig,
    
    // Performance metrics
    performanceMetrics: enhancedState.performanceMetrics
  }
}

// Helper functions

function calculateEnhancementLevel(
  layoutResult: NarrativeLayoutResult,
  spatialGroups: any[],
  tourContext: any
): EnhancedTourState['enhancementLevel'] {
  // Calculate spatial intelligence score (0-1)
  const spatialScore = Math.min(spatialGroups.length / 5, 1) * 0.8 + 
                     (spatialGroups.length > 0 ? 0.2 : 0)
  
  // Calculate narrative flow score (0-1)  
  const narrativeScore = layoutResult.narrativeFlow.primaryPath.length > 0 ? 0.7 : 0.3
  const hasKeyMoments = layoutResult.narrativeFlow.keyMoments.length > 0 ? 0.2 : 0
  const hasSpatialZones = layoutResult.spatialZones.length > 0 ? 0.1 : 0
  
  const narrativeTotal = narrativeScore + hasKeyMoments + hasSpatialZones
  
  // Overall enhancement
  const overall = (spatialScore + narrativeTotal) / 2
  
  return {
    spatialIntelligence: Math.min(spatialScore, 1),
    narrativeFlow: Math.min(narrativeTotal, 1),
    overallEnhancement: Math.min(overall, 1)
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}