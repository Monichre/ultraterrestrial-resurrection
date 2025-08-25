'use client'

import {useState, useRef, useEffect, useCallback} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {
  getZoomConfig,
  type ZOOM_LEVEL_CONFIG,
} from '@/services/sightings/actions/sightings-time-chunk'
import {xata} from '@/db/xata/client'

// Define types for the cluster data
export interface ClusterData {
  count: number
  longitude?: number
  latitude?: number
  id: string
  [key: string]: any // For other properties
}

// Props for components
type ClusterLayerProps = {
  clusters: ClusterData[]
}

type PointsLayerProps = {
  points: ValidatedUAPSighting[]
}

// Type for time series data
interface TimeSeriesDataPoint {
  date: Date
  count: number
}

export function ClusterLayer({clusters}: ClusterLayerProps) {
  // Implementation for cluster rendering
  return <div className='cluster-layer'>{/* Render clusters here */}</div>
}

export function PointsLayer({points}: PointsLayerProps) {
  // Implementation for points rendering
  return <div className='points-layer'>{/* Render individual points here */}</div>
}

// Use this in the Globe component to determine what to render
export function renderPoints(
  sightings: ValidatedUAPSighting[],
  clusters: ClusterData[],
  cameraDistance: number
) {
  const config = getZoomConfig(cameraDistance)

  // Extract the maxPointsToShow safely with a fallback
  const maxPointsToShow =
    'maxPointsToShow' in config ? (config as typeof ZOOM_LEVEL_CONFIG.medium).maxPointsToShow : 100

  return (
    <>
      {(config.useAggregates || clusters.length > 0) && (
        <ClusterLayer clusters={clusters.filter((c) => c.count >= config.minClusterSize)} />
      )}

      {config.showIndividualPoints && <PointsLayer points={sightings.slice(0, maxPointsToShow)} />}
    </>
  )
}

// Enhanced time animation with aggregated data
export function useTimeSeriesWithAggregation(timeRange: [Date, Date]) {
  const [currentTime, setCurrentTime] = useState<Date>(timeRange[0])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [timeData, setTimeData] = useState<TimeSeriesDataPoint[]>([])
  const animationRef = useRef<number | null>(null)

  // Fetch time-based data using aggregation
  useEffect(() => {
    async function fetchTimeData() {
      try {
        // Using a simpler approach for time series data
        // This is a placeholder - you may need to adjust based on Xata's actual API
        // @ts-ignore - Handling Xata type issues
        const records = await xata.db.sightings
          .filter({
            date: {
              $ge: timeRange[0],
              $le: timeRange[1],
            },
          })
          .getAll()

        // Group by date manually
        const dateGroups: Record<string, number> = {}
        records.forEach((record: any) => {
          if (!record.date) return

          const dateKey = record.date.toISOString().split('T')[0]
          dateGroups[dateKey] = (dateGroups[dateKey] || 0) + 1
        })

        // Convert to array format
        const formattedData = Object.entries(dateGroups)
          .map(([dateStr, count]) => ({
            date: new Date(dateStr),
            count,
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime())

        setTimeData(formattedData)
      } catch (err) {
        console.error('Error fetching time series data:', err)
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
    play,
    pause,
    setCurrentTime,
  }
}
