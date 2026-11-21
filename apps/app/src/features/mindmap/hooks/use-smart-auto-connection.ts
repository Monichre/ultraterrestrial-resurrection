'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type Node, type Edge, useReactFlow } from '@xyflow/react'
import { useMindMapStore } from '@/features/mindmap/store'
import { getGraphContext, isRecordRelated, generateContextualSearchRules } from '@/features/mindmap/utils/contextual-intelligence'
import { useSpatialGrouping } from './use-spatial-grouping'
import { useProximityAnalysis } from './use-proximity-analysis'

export interface AutoConnectionCandidate {
  id: string
  node: Node
  score: number
  reasons: string[]
  suggestedPosition: {
    x: number
    y: number
  }
  connectionStrength: 'strong' | 'medium' | 'weak'
  entityRelationships: {
    temporal?: boolean
    geographic?: boolean
    personnel?: boolean
    organizational?: boolean
    topical?: boolean
  }
}

export interface SmartConnectionSuggestion {
  id: string
  sourceNodeId: string
  targetNodeId: string
  connectionType: 'direct' | 'contextual' | 'spatial' | 'temporal'
  confidence: number
  reason: string
  suggestedEdgeData?: {
    label?: string
    type?: string
    animated?: boolean
    style?: Record<string, any>
  }
}

export interface SmartAutoConnectionOptions {
  enableAutoSuggestion: boolean
  autoConnectThreshold: number // Minimum confidence to auto-connect
  suggestionThreshold: number // Minimum confidence to suggest
  maxSuggestions: number
  spatialProximityWeight: number
  contextualRelevanceWeight: number
  temporalProximityWeight: number
  maxConnectionDistance: number // Max pixels apart for spatial connections
  debounceMs: number
}

const DEFAULT_OPTIONS: SmartAutoConnectionOptions = {
  enableAutoSuggestion: true,
  autoConnectThreshold: 0.85,
  suggestionThreshold: 0.6,
  maxSuggestions: 5,
  spatialProximityWeight: 0.3,
  contextualRelevanceWeight: 0.5,
  temporalProximityWeight: 0.2,
  maxConnectionDistance: 250,
  debounceMs: 1000
}

export function useSmartAutoConnection(options: Partial<SmartAutoConnectionOptions> = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const { nodes, edges, setEdges } = useMindMapStore()
  const { getViewport } = useReactFlow()
  const { spatialGroups } = useSpatialGrouping()
  const { proximityGroups, analysisResults } = useProximityAnalysis()
  
  const [connectionCandidates, setConnectionCandidates] = useState<AutoConnectionCandidate[]>([])
  const [connectionSuggestions, setConnectionSuggestions] = useState<SmartConnectionSuggestion[]>([])
  const [autoConnectionsEnabled, setAutoConnectionsEnabled] = useState(config.enableAutoSuggestion)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const analysisDebounceTimer = useRef<NodeJS.Timeout>()
  const lastAnalysisTime = useRef<Date>(new Date(0))
  const connectedPairs = useRef<Set<string>>(new Set())

  // Calculate distance between two positions
  const calculateDistance = useCallback((pos1: { x: number, y: number }, pos2: { x: number, y: number }): number => {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Generate unique pair key for tracking connections
  const getPairKey = useCallback((nodeId1: string, nodeId2: string): string => {
    return [nodeId1, nodeId2].sort().join('-')
  }, [])

  // Check if two nodes are already connected
  const areNodesConnected = useCallback((nodeId1: string, nodeId2: string): boolean => {
    return edges.some(edge => 
      (edge.source === nodeId1 && edge.target === nodeId2) ||
      (edge.source === nodeId2 && edge.target === nodeId1)
    )
  }, [edges])

  // Calculate spatial proximity score
  const calculateSpatialScore = useCallback((node1: Node, node2: Node): number => {
    const distance = calculateDistance(node1.position, node2.position)
    if (distance > config.maxConnectionDistance) return 0
    
    // Inverse distance scoring - closer nodes get higher scores
    const normalizedDistance = distance / config.maxConnectionDistance
    return Math.max(0, 1 - normalizedDistance)
  }, [calculateDistance, config.maxConnectionDistance])

  // Calculate contextual relevance score using existing contextual intelligence
  const calculateContextualScore = useCallback((node1: Node, node2: Node, graphContext: any): number => {
    if (!graphContext) return 0
    
    let score = 0
    const maxScore = 5 // Normalize to 0-1 scale

    // Check if both nodes are related to the current context
    if (isRecordRelated(node1.data, graphContext) && isRecordRelated(node2.data, graphContext)) {
      score += 1
    }

    // Check for shared entity types
    if (node1.data?.type === node2.data?.type) {
      score += 0.5
    }

    // Check for temporal proximity
    const node1Year = extractYearFromNode(node1)
    const node2Year = extractYearFromNode(node2)
    if (node1Year && node2Year) {
      const yearDiff = Math.abs(node1Year - node2Year)
      if (yearDiff <= 1) score += 1
      else if (yearDiff <= 5) score += 0.5
      else if (yearDiff <= 10) score += 0.2
    }

    // Check for shared personnel
    const node1Personnel = extractPersonnelFromNode(node1)
    const node2Personnel = extractPersonnelFromNode(node2)
    const sharedPersonnel = node1Personnel.filter(p => node2Personnel.includes(p))
    if (sharedPersonnel.length > 0) {
      score += Math.min(1, sharedPersonnel.length * 0.5)
    }

    // Check for shared organizations
    const node1Orgs = extractOrganizationsFromNode(node1)
    const node2Orgs = extractOrganizationsFromNode(node2)
    const sharedOrgs = node1Orgs.filter(o => node2Orgs.includes(o))
    if (sharedOrgs.length > 0) {
      score += Math.min(1, sharedOrgs.length * 0.5)
    }

    // Check for geographic proximity
    const node1Coords = extractCoordinatesFromNode(node1)
    const node2Coords = extractCoordinatesFromNode(node2)
    if (node1Coords && node2Coords && graphContext.locationContext) {
      const geoDistance = calculateGeoDistance(node1Coords, node2Coords)
      if (geoDistance <= graphContext.locationContext.radius) {
        score += 0.5
      }
    }

    return Math.min(1, score / maxScore)
  }, [])

  // Helper functions for data extraction (similar to contextual-intelligence.ts)
  const extractYearFromNode = useCallback((node: Node): number | null => {
    if (!node.data) return null
    
    const dateFields = ['date', 'occurred_on', 'created_at', 'year', 'timestamp']
    for (const field of dateFields) {
      const dateValue = node.data[field]
      if (dateValue) {
        const date = new Date(dateValue as string)
        if (!isNaN(date.getTime())) {
          return date.getFullYear()
        }
        const year = parseInt(dateValue.toString(), 10)
        if (year >= 1900 && year <= new Date().getFullYear()) {
          return year
        }
      }
    }
    return null
  }, [])

  const extractPersonnelFromNode = useCallback((node: Node): string[] => {
    if (!node.data) return []
    
    const personnel: string[] = []
    const personnelFields = ['witness', 'author', 'person', 'personnel', 'names']
    
    for (const field of personnelFields) {
      const fieldValue = node.data[field]
      if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
        personnel.push(fieldValue.name as string)
      } else if (typeof fieldValue === 'string') {
        personnel.push(fieldValue)
      } else if (Array.isArray(fieldValue)) {
        personnel.push(...fieldValue.filter(item => typeof item === 'string'))
      }
    }
    
    return personnel
  }, [])

  const extractOrganizationsFromNode = useCallback((node: Node): string[] => {
    if (!node.data) return []
    
    const organizations: string[] = []
    const orgFields = ['organization', 'agency', 'department', 'company', 'institution']
    
    for (const field of orgFields) {
      const fieldValue = node.data[field]
      if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
        organizations.push(fieldValue.name as string)
      } else if (typeof fieldValue === 'string') {
        organizations.push(fieldValue)
      } else if (Array.isArray(fieldValue)) {
        organizations.push(...fieldValue.filter(item => typeof item === 'string'))
      }
    }
    
    return organizations
  }, [])

  const extractCoordinatesFromNode = useCallback((node: Node): { lat: number, lon: number } | null => {
    if (!node.data) return null
    
    const latFields = ['latitude', 'lat', 'y']
    const lonFields = ['longitude', 'lon', 'lng', 'x']
    
    let lat: number | null = null
    let lon: number | null = null
    
    for (const field of latFields) {
      const value = node.data[field]
      if (typeof value === 'number' && !isNaN(value)) {
        lat = value
        break
      }
    }
    
    for (const field of lonFields) {
      const value = node.data[field]
      if (typeof value === 'number' && !isNaN(value)) {
        lon = value
        break
      }
    }
    
    if (lat !== null && lon !== null && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return { lat, lon }
    }
    
    return null
  }, [])

  const calculateGeoDistance = useCallback((coord1: { lat: number, lon: number }, coord2: { lat: number, lon: number }): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLon = (coord2.lon - coord1.lon) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  // Analyze potential connections between nodes
  const analyzeConnections = useCallback(async () => {
    if (nodes.length < 2 || isAnalyzing) return
    
    setIsAnalyzing(true)
    
    try {
      const graphContext = getGraphContext(nodes)
      const candidates: AutoConnectionCandidate[] = []
      const suggestions: SmartConnectionSuggestion[] = []
      
      // Analyze all node pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i]
          const node2 = nodes[j]
          const pairKey = getPairKey(node1.id, node2.id)
          
          // Skip if already connected or analyzed
          if (areNodesConnected(node1.id, node2.id) || connectedPairs.current.has(pairKey)) {
            continue
          }
          
          // Calculate individual scores
          const spatialScore = calculateSpatialScore(node1, node2)
          const contextualScore = calculateContextualScore(node1, node2, graphContext)
          const temporalScore = calculateTemporalScore(node1, node2)
          
          // Calculate weighted final score
          const finalScore = (
            spatialScore * config.spatialProximityWeight +
            contextualScore * config.contextualRelevanceWeight +
            temporalScore * config.temporalProximityWeight
          )
          
          if (finalScore >= config.suggestionThreshold) {
            const reasons = generateConnectionReasons(node1, node2, {
              spatial: spatialScore,
              contextual: contextualScore,
              temporal: temporalScore
            })
            
            const suggestion: SmartConnectionSuggestion = {
              id: `connection-${pairKey}`,
              sourceNodeId: node1.id,
              targetNodeId: node2.id,
              connectionType: determineConnectionType(spatialScore, contextualScore, temporalScore),
              confidence: finalScore,
              reason: reasons.join(', '),
              suggestedEdgeData: generateEdgeData(node1, node2, finalScore)
            }
            
            suggestions.push(suggestion)
            
            // Auto-connect if score is high enough
            if (finalScore >= config.autoConnectThreshold && autoConnectionsEnabled) {
              await autoConnect(suggestion)
              connectedPairs.current.add(pairKey)
            }
          }
        }
      }
      
      // Sort suggestions by confidence
      suggestions.sort((a, b) => b.confidence - a.confidence)
      setConnectionSuggestions(suggestions.slice(0, config.maxSuggestions))
      
    } catch (error) {
      console.error('Smart auto-connection analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [nodes, config, isAnalyzing, autoConnectionsEnabled, getPairKey, areNodesConnected, calculateSpatialScore, calculateContextualScore])

  // Calculate temporal proximity score
  const calculateTemporalScore = useCallback((node1: Node, node2: Node): number => {
    const year1 = extractYearFromNode(node1)
    const year2 = extractYearFromNode(node2)
    
    if (!year1 || !year2) return 0
    
    const yearDiff = Math.abs(year1 - year2)
    if (yearDiff === 0) return 1
    if (yearDiff <= 1) return 0.8
    if (yearDiff <= 5) return 0.6
    if (yearDiff <= 10) return 0.4
    if (yearDiff <= 20) return 0.2
    return 0
  }, [extractYearFromNode])

  // Generate human-readable connection reasons
  const generateConnectionReasons = useCallback((node1: Node, node2: Node, scores: { spatial: number, contextual: number, temporal: number }): string[] => {
    const reasons: string[] = []
    
    if (scores.spatial > 0.7) {
      reasons.push('close spatial proximity')
    }
    
    if (scores.contextual > 0.7) {
      reasons.push('strong contextual relationship')
    }
    
    if (scores.temporal > 0.8) {
      reasons.push('occurred in same time period')
    } else if (scores.temporal > 0.5) {
      reasons.push('temporally related events')
    }
    
    // Check for specific relationships
    const sharedPersonnel = extractPersonnelFromNode(node1).filter(p => 
      extractPersonnelFromNode(node2).includes(p)
    )
    if (sharedPersonnel.length > 0) {
      reasons.push(`shared personnel: ${sharedPersonnel.slice(0, 2).join(', ')}`)
    }
    
    const sharedOrgs = extractOrganizationsFromNode(node1).filter(o => 
      extractOrganizationsFromNode(node2).includes(o)
    )
    if (sharedOrgs.length > 0) {
      reasons.push(`shared organizations: ${sharedOrgs.slice(0, 2).join(', ')}`)
    }
    
    if (node1.data?.type === node2.data?.type) {
      reasons.push(`same entity type (${node1.data.type})`)
    }
    
    return reasons.length > 0 ? reasons : ['potential correlation detected']
  }, [extractPersonnelFromNode, extractOrganizationsFromNode])

  // Determine connection type based on scores
  const determineConnectionType = useCallback((spatial: number, contextual: number, temporal: number): 'direct' | 'contextual' | 'spatial' | 'temporal' => {
    if (contextual > spatial && contextual > temporal) return 'contextual'
    if (spatial > temporal) return 'spatial'
    return 'temporal'
  }, [])

  // Generate edge data for connection
  const generateEdgeData = useCallback((node1: Node, node2: Node, confidence: number) => {
    return {
      label: confidence > 0.8 ? 'Strong Connection' : confidence > 0.6 ? 'Related' : 'Possible Link',
      type: 'smoothstep',
      animated: confidence > 0.8,
      style: {
        stroke: confidence > 0.8 ? '#10b981' : confidence > 0.6 ? '#3b82f6' : '#6b7280',
        strokeWidth: Math.max(1, confidence * 3),
        opacity: Math.max(0.4, confidence)
      }
    }
  }, [])

  // Auto-connect nodes
  const autoConnect = useCallback(async (suggestion: SmartConnectionSuggestion) => {
    const newEdge: Edge = {
      id: `edge-${suggestion.sourceNodeId}-${suggestion.targetNodeId}`,
      source: suggestion.sourceNodeId,
      target: suggestion.targetNodeId,
      data: {
        ...suggestion.suggestedEdgeData,
        autoGenerated: true,
        confidence: suggestion.confidence,
        reason: suggestion.reason
      },
      ...suggestion.suggestedEdgeData
    }
    
    setEdges(prev => [...prev, newEdge])
  }, [setEdges])

  // Manually accept a connection suggestion
  const acceptSuggestion = useCallback((suggestionId: string) => {
    const suggestion = connectionSuggestions.find(s => s.id === suggestionId)
    if (suggestion) {
      autoConnect(suggestion)
      const pairKey = getPairKey(suggestion.sourceNodeId, suggestion.targetNodeId)
      connectedPairs.current.add(pairKey)
      
      // Remove from suggestions
      setConnectionSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    }
  }, [connectionSuggestions, autoConnect, getPairKey])

  // Dismiss a connection suggestion
  const dismissSuggestion = useCallback((suggestionId: string) => {
    const suggestion = connectionSuggestions.find(s => s.id === suggestionId)
    if (suggestion) {
      const pairKey = getPairKey(suggestion.sourceNodeId, suggestion.targetNodeId)
      connectedPairs.current.add(pairKey) // Mark as analyzed to prevent re-suggestion
      setConnectionSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    }
  }, [connectionSuggestions, getPairKey])

  // Clear all suggestions
  const clearAllSuggestions = useCallback(() => {
    setConnectionSuggestions([])
  }, [])

  // Toggle auto-connections
  const toggleAutoConnections = useCallback(() => {
    setAutoConnectionsEnabled(prev => !prev)
  }, [])

  // Force analysis
  const forceAnalysis = useCallback(() => {
    if (analysisDebounceTimer.current) {
      clearTimeout(analysisDebounceTimer.current)
    }
    analyzeConnections()
  }, [analyzeConnections])

  // Debounced analysis effect
  useEffect(() => {
    if (analysisDebounceTimer.current) {
      clearTimeout(analysisDebounceTimer.current)
    }
    
    analysisDebounceTimer.current = setTimeout(() => {
      const now = new Date()
      if (now.getTime() - lastAnalysisTime.current.getTime() > config.debounceMs) {
        analyzeConnections()
        lastAnalysisTime.current = now
      }
    }, config.debounceMs)
    
    return () => {
      if (analysisDebounceTimer.current) {
        clearTimeout(analysisDebounceTimer.current)
      }
    }
  }, [nodes, analyzeConnections, config.debounceMs])

  return {
    // State
    connectionCandidates,
    connectionSuggestions,
    autoConnectionsEnabled,
    isAnalyzing,
    
    // Actions
    acceptSuggestion,
    dismissSuggestion,
    clearAllSuggestions,
    toggleAutoConnections,
    forceAnalysis,
    
    // Configuration
    config
  }
}