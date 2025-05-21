'use client'

import {useState, useEffect} from 'react'
import {getSightingsBatched} from '@/services/sightings/actions/sightings-time-chunk'
import {renderPoints, useTimeSeriesWithAggregation, type ClusterData} from './GlobePointsRenderer'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'

interface GlobeProps {
  initialYear?: number
  endYear?: number
  maxSightings?: number
}

export default function Globe({
  initialYear = 1940,
  endYear = new Date().getFullYear(),
  maxSightings = 500,
}: GlobeProps) {
  const [sightings, setSightings] = useState<ValidatedUAPSighting[]>([])
  const [clusters, setClusters] = useState<ClusterData[]>([])
  const [loading, setLoading] = useState(true)
  const [cameraDistance, setCameraDistance] = useState(5) // Medium zoom level

  // Time range for the visualization
  const timeRange: [Date, Date] = [
    new Date(`${initialYear}-01-01T00:00:00Z`),
    new Date(`${endYear}-12-31T23:59:59Z`),
  ]

  // Use the time series animation hook
  const {currentTime, isPlaying, timeData, play, pause, setCurrentTime} =
    useTimeSeriesWithAggregation(timeRange)

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        // Fetch sightings data in batches
        const timeRanges = [{startYear: initialYear, endYear}]
        const {sightings: fetchedSightings, stats} = await getSightingsBatched(
          timeRanges,
          maxSightings
        )

        setSightings(fetchedSightings)

        // Generate clusters from the data
        // This is a placeholder - actual clustering algorithm would be implemented here
        const generatedClusters = generateClusters(fetchedSightings)
        setClusters(generatedClusters)
      } catch (error) {
        console.error('Error fetching globe data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialYear, endYear, maxSightings])

  // Handle camera zoom changes
  function handleZoomChange(distance: number) {
    setCameraDistance(distance)
  }

  // Placeholder function for generating clusters
  function generateClusters(data: ValidatedUAPSighting[]): ClusterData[] {
    // This is a simplified implementation. In a real app, you would:
    // 1. Group sightings by geographic proximity
    // 2. Assign count and aggregate position data
    // 3. Return properly structured clusters

    const clusters: ClusterData[] = []
    const gridSize = 5 // Degrees
    const grid: Record<string, {count: number; lats: number[]; lngs: number[]; ids: string[]}> = {}

    // Group sightings into a grid
    data.forEach((sighting) => {
      if (!sighting.location.coordinates) return

      const {lat, lng} = sighting.location.coordinates
      const gridLat = Math.floor(lat / gridSize) * gridSize
      const gridLng = Math.floor(lng / gridSize) * gridSize
      const key = `${gridLat},${gridLng}`

      if (!grid[key]) {
        grid[key] = {count: 0, lats: [], lngs: [], ids: []}
      }

      grid[key].count++
      grid[key].lats.push(lat)
      grid[key].lngs.push(lng)
      grid[key].ids.push(sighting.id)
    })

    // Convert grid to clusters
    for (const [key, cell] of Object.entries(grid)) {
      if (cell.count > 0) {
        // Calculate average position
        const avgLat = cell.lats.reduce((sum, val) => sum + val, 0) / cell.count
        const avgLng = cell.lngs.reduce((sum, val) => sum + val, 0) / cell.count

        clusters.push({
          id: `cluster-${key}`,
          count: cell.count,
          latitude: avgLat,
          longitude: avgLng,
          sightingIds: cell.ids,
        })
      }
    }

    return clusters
  }

  return (
    <div className='globe-container h-full w-full relative'>
      {loading ? (
        <div className='loading-indicator'>Loading globe data...</div>
      ) : (
        <div className='globe-visualization h-full w-full'>
          {/* Placeholder for the actual 3D globe rendering */}
          <div className='globe-wrapper h-full w-full'>
            {/* This would be replaced with an actual 3D globe library */}
            <div className='globe-placeholder bg-gray-800 h-full w-full flex items-center justify-center text-white'>
              3D Globe Visualization
              {/* Render the points and clusters using our function */}
              <div className='globe-points'>
                {renderPoints(sightings, clusters, cameraDistance)}
              </div>
            </div>
          </div>

          {/* Time controls */}
          <div className='time-controls absolute bottom-4 left-0 right-0 mx-auto w-full max-w-lg bg-black/50 p-4 rounded-lg text-white'>
            <div className='flex justify-between items-center'>
              <button
                onClick={isPlaying ? pause : play}
                className='play-button px-4 py-2 bg-blue-600 rounded'>
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <div className='current-time'>{currentTime.toLocaleDateString()}</div>

              <div className='zoom-controls'>
                <button
                  onClick={() => handleZoomChange(Math.max(1, cameraDistance - 1))}
                  className='zoom-in px-3 py-1 bg-gray-700 rounded mr-2'>
                  +
                </button>
                <button
                  onClick={() => handleZoomChange(Math.min(10, cameraDistance + 1))}
                  className='zoom-out px-3 py-1 bg-gray-700 rounded'>
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
