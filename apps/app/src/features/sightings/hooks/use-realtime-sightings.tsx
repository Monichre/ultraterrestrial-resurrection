'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ValidatedUAPSighting } from '@/services/sightings/uap-sighting'
import { debugLog } from '@/utils/logger'

interface RealtimeSightingsState {
  sightings: ValidatedUAPSighting[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  stats: {
    totalSightings: number
    recentCount: number
    avgPerHour: number
  }
}

interface UseRealtimeSightingsOptions {
  refreshInterval?: number // milliseconds
  maxSightings?: number
  timeWindow?: number // hours for "recent" sightings
  enableAutoRefresh?: boolean
  onNewSighting?: (sighting: ValidatedUAPSighting) => void
  onError?: (error: string) => void
}

export function useRealtimeSightings(options: UseRealtimeSightingsOptions = {}) {
  const {
    refreshInterval = 30000, // 30 seconds
    maxSightings = 1000,
    timeWindow = 24, // 24 hours
    enableAutoRefresh = true,
    onNewSighting,
    onError,
  } = options

  const [state, setState] = useState<RealtimeSightingsState>({
    sightings: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    connectionStatus: 'disconnected',
    stats: {
      totalSightings: 0,
      recentCount: 0,
      avgPerHour: 0,
    },
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchRef = useRef<Set<string>>(new Set())
  const abortControllerRef = useRef<AbortController | null>(null)

  // Calculate recent sightings stats
  const calculateStats = useCallback(
    (sightings: ValidatedUAPSighting[]) => {
      const now = new Date()
      const timeWindowMs = timeWindow * 60 * 60 * 1000 // Convert hours to milliseconds
      const cutoff = new Date(now.getTime() - timeWindowMs)

      const recentSightings = sightings.filter(
        (s) => new Date(s.timestamp) >= cutoff
      )

      return {
        totalSightings: sightings.length,
        recentCount: recentSightings.length,
        avgPerHour: recentSightings.length / timeWindow,
      }
    },
    [timeWindow]
  )

  // Fetch latest sightings with optimized time range
  const fetchLatestSightings = useCallback(async () => {
    debugLog('🔄 Fetching latest sightings...')
    
    setState((prev) => ({
      ...prev,
      isLoading: true,
      connectionStatus: 'connecting',
      error: null,
    }))

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    try {
      // Get current year and recent years for real-time feel
      const currentYear = new Date().getFullYear()
      const startYear = Math.max(currentYear - 2, 1947) // Last 2 years for performance

      const timeRanges = [
        { startYear: currentYear, endYear: currentYear }, // Current year (highest priority)
        { startYear: currentYear - 1, endYear: currentYear - 1 }, // Last year
        { startYear, endYear: currentYear - 2 }, // Earlier years (if needed)
      ]

      const response = await fetch('/api/sightings/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeRanges,
          limit: Math.min(maxSightings, 500), // Reasonable limit for real-time
          includeCoordinates: true, // Only get mappable sightings
          sortBy: 'timestamp',
          sortOrder: 'desc',
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const newSightings = data.sightings || []

      // Check for truly new sightings
      const previousIds = lastFetchRef.current
      const currentIds = new Set(newSightings.map((s: ValidatedUAPSighting) => s.id))
      
      const trulyNewSightings = newSightings.filter(
        (s: ValidatedUAPSighting) => !previousIds.has(s.id)
      )

      // Update our tracking set
      lastFetchRef.current = currentIds

      // Notify about new sightings
      trulyNewSightings.forEach((sighting) => {
        onNewSighting?.(sighting)
        debugLog('🆕 New sighting detected:', sighting.id, sighting.title)
      })

      const stats = calculateStats(newSightings)

      setState((prev) => ({
        ...prev,
        sightings: newSightings,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        connectionStatus: 'connected',
        stats,
      }))

      debugLog('✅ Sightings updated:', {
        total: newSightings.length,
        newCount: trulyNewSightings.length,
        withCoords: newSightings.filter((s: ValidatedUAPSighting) => 
          s.location?.coordinates?.lat && s.location?.coordinates?.lng
        ).length,
        stats,
      })

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        debugLog('🚫 Request aborted')
        return
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      debugLog('❌ Error fetching sightings:', errorMessage)

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        connectionStatus: 'error',
      }))

      onError?.(errorMessage)
    }
  }, [maxSightings, onNewSighting, onError, calculateStats])

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchLatestSightings()
  }, [fetchLatestSightings])

  // Start/stop auto-refresh
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    fetchLatestSightings() // Initial fetch
    intervalRef.current = setInterval(fetchLatestSightings, refreshInterval)

    setState((prev) => ({ ...prev, connectionStatus: 'connecting' }))
    debugLog('🔄 Auto-refresh started', { refreshInterval })
  }, [fetchLatestSightings, refreshInterval])

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setState((prev) => ({ ...prev, connectionStatus: 'disconnected' }))
    debugLog('⏹️ Auto-refresh stopped')
  }, [])

  // Initialize auto-refresh
  useEffect(() => {
    if (enableAutoRefresh) {
      startAutoRefresh()
    }

    return () => {
      stopAutoRefresh()
    }
  }, [enableAutoRefresh, startAutoRefresh, stopAutoRefresh])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoRefresh()
    }
  }, [])

  return {
    ...state,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshActive: intervalRef.current !== null,
  }
}

// Helper hook for filtering real-time sightings
export function useFilteredSightings(
  sightings: ValidatedUAPSighting[],
  filters: {
    timeRange?: [Date, Date]
    location?: string
    shape?: string
    minConfidence?: string
    hasCoordinates?: boolean
  } = {}
) {
  const {
    timeRange,
    location,
    shape,
    minConfidence,
    hasCoordinates = true,
  } = filters

  return useState(() => {
    return sightings.filter((sighting) => {
      // Time range filter
      if (timeRange) {
        const sightingDate = new Date(sighting.timestamp)
        if (sightingDate < timeRange[0] || sightingDate > timeRange[1]) {
          return false
        }
      }

      // Coordinates filter (for mapping)
      if (hasCoordinates) {
        if (
          !sighting.location?.coordinates?.lat ||
          !sighting.location?.coordinates?.lng
        ) {
          return false
        }
      }

      // Location filter
      if (location) {
        const sightingLocation = (
          sighting.location?.city ||
          sighting.location?.state ||
          ''
        ).toLowerCase()
        if (!sightingLocation.includes(location.toLowerCase())) {
          return false
        }
      }

      // Shape filter
      if (shape && shape !== 'all') {
        const sightingShapes = Array.isArray(sighting.category)
          ? sighting.category
          : sighting.category
            ? [sighting.category]
            : []
        
        if (!sightingShapes.some(s => s.toLowerCase().includes(shape.toLowerCase()))) {
          return false
        }
      }

      // Confidence filter
      if (minConfidence && minConfidence !== 'any') {
        const confidenceLevels = ['low', 'medium', 'high']
        const minIndex = confidenceLevels.indexOf(minConfidence)
        const sightingIndex = confidenceLevels.indexOf(sighting.confidence || 'low')
        
        if (sightingIndex < minIndex) {
          return false
        }
      }

      return true
    })
  })[0]
}