'use client'

import {useState, useRef, useEffect, useCallback} from 'react'
import {xata} from '@db/xata/client'

// Configuration for different zoom levels
export const ZOOM_LEVEL_CONFIG = {
  far: {
    showIndividualPoints: false,
    minClusterSize: 1,
    useAggregates: true,
    maxPointsToShow: 0,
  },
  medium: {
    showIndividualPoints: true,
    minClusterSize: 3,
    maxPointsToShow: 200,
    useAggregates: true,
  },
  close: {
    showIndividualPoints: true,
    minClusterSize: 5,
    maxPointsToShow: 500,
    useAggregates: false,
  },
}

// Select rendering strategy based on camera distance
export function getZoomConfig(cameraDistance: number) {
  if (cameraDistance > 6) return ZOOM_LEVEL_CONFIG.far
  if (cameraDistance > 3) return ZOOM_LEVEL_CONFIG.medium
  return ZOOM_LEVEL_CONFIG.close
}

export interface TimeDataPoint {
  date: Date
  count: number
}

type TimeRange = [Date, Date]

// Enhanced time animation with time series data
export function useTimeSeriesAnimation(timeRange: TimeRange) {
  const [currentTime, setCurrentTime] = useState<Date>(timeRange[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeData, setTimeData] = useState<TimeDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const animationRef = useRef<number | null>(null)

  // Fetch time-based data using summarize
  useEffect(() => {
    async function fetchTimeData() {
      setIsLoading(true)
      setError(null)

      try {
        const results = await xata.db.sightings.summarize({
          filter: {
            date: {
              $ge: timeRange[0],
              $le: timeRange[1],
            },
          },
          columns: ['date'],
          summaries: {
            count: {count: '*'},
          },
        })

        // Process the summarized data
        if (results.summaries?.count) {
          const dateMap = results.summaries.count as Record<string, number>

          // Format the time series data
          const formattedData = Object.entries(dateMap)
            .map(([dateStr, count]) => ({
              date: new Date(dateStr),
              count,
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime())

          setTimeData(formattedData)
        } else {
          setTimeData([])
        }
      } catch (err) {
        console.error('Error fetching time series data:', err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimeData()
  }, [timeRange])

  // Animation control functions
  const play = useCallback(() => {
    if (isPlaying) return

    setIsPlaying(true)
    const startTime = Date.now()
    const timeSpan = timeRange[1].getTime() - timeRange[0].getTime()
    const animationDuration = 10000 // 10 seconds for full animation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      // Calculate current time based on progress
      const currentTimeValue = new Date(timeRange[0].getTime() + progress * timeSpan)
      setCurrentTime(currentTimeValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsPlaying(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [timeRange, isPlaying])

  const pause = useCallback(() => {
    if (!isPlaying || animationRef.current === null) return

    cancelAnimationFrame(animationRef.current)
    animationRef.current = null
    setIsPlaying(false)
  }, [isPlaying])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    currentTime,
    isPlaying,
    timeData,
    isLoading,
    error,
    play,
    pause,
    setCurrentTime,
  }
}

// Hook to manage loading paginated sightings with cursor
export function usePaginatedSightings(timeRange: TimeRange) {
  const [sightings, setSightings] = useState<any[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Initial load + reload when time range changes
  useEffect(() => {
    setSightings([])
    setCursor(null)
    setHasMore(true)
    setError(null)
    loadPage()
  }, [timeRange])

  const loadPage = useCallback(async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      // Use Xata's recommended cursor pattern for robustness
      const response = await xata.db.sightings
        .filter({
          date: {
            $ge: timeRange[0],
            $le: timeRange[1],
          },
        })
        .sort('date', 'asc')
        .getPaginated({
          pagination: {
            size: 100,
            // Only include cursor for subsequent pages
            ...(cursor ? {after: cursor} : {}),
          },
        })

      // Store cursor for next page
      setCursor(response.meta?.page?.cursor || null)
      setHasMore(response.meta?.page?.more || false)

      // Add new sightings to existing array
      setSightings((prev) => [...prev, ...response.records])
    } catch (err) {
      console.error('Error fetching paginated sightings:', err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [timeRange, cursor, hasMore, isLoading])

  return {sightings, hasMore, isLoading, error, loadMore: loadPage}
}
