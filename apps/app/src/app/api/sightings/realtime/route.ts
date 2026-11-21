import { type NextRequest } from 'next/server'
import { getSightingsBatched } from '@/services/sightings/actions/sightings-time-chunk'
import { debugLog } from '@/utils/logger'

interface RealtimeRequest {
  timeRanges: Array<{ startYear: number; endYear: number }>
  limit?: number
  includeCoordinates?: boolean
  sortBy?: 'timestamp' | 'date'
  sortOrder?: 'asc' | 'desc'
}

export async function POST(request: NextRequest) {
  try {
    const body: RealtimeRequest = await request.json()
    const {
      timeRanges,
      limit = 500,
      includeCoordinates = true,
      sortBy = 'timestamp',
      sortOrder = 'desc',
    } = body

    debugLog('🔄 Real-time sightings request:', {
      timeRanges,
      limit,
      includeCoordinates,
      sortBy,
      sortOrder,
    })

    if (!timeRanges || !Array.isArray(timeRanges) || timeRanges.length === 0) {
      return Response.json(
        { error: 'timeRanges array is required' },
        { status: 400 }
      )
    }

    // Validate time ranges
    const currentYear = new Date().getFullYear()
    const validTimeRanges = timeRanges.filter((range) => {
      return (
        range.startYear >= 1947 &&
        range.endYear <= currentYear &&
        range.startYear <= range.endYear
      )
    })

    if (validTimeRanges.length === 0) {
      return Response.json(
        { error: 'No valid time ranges provided' },
        { status: 400 }
      )
    }

    // Fetch sightings data
    const { sightings, stats } = await getSightingsBatched(
      validTimeRanges,
      limit
    )

    debugLog('📊 Fetched sightings:', {
      total: sightings.length,
      withCoords: sightings.filter(
        (s) => s.location?.coordinates?.lat && s.location?.coordinates?.lng
      ).length,
      stats,
    })

    // Filter for coordinates if requested
    let filteredSightings = sightings
    if (includeCoordinates) {
      filteredSightings = sightings.filter(
        (s) => s.location?.coordinates?.lat && s.location?.coordinates?.lng
      )
    }

    // Sort sightings
    filteredSightings.sort((a, b) => {
      const aTime = new Date(
        sortBy === 'timestamp' ? a.timestamp : a.date || a.timestamp
      ).getTime()
      const bTime = new Date(
        sortBy === 'timestamp' ? b.timestamp : b.date || b.timestamp
      ).getTime()

      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime
    })

    // Calculate real-time specific stats
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

    const recentSightings = filteredSightings.filter(
      (s) => new Date(s.timestamp) >= last24Hours
    )
    const veryRecentSightings = filteredSightings.filter(
      (s) => new Date(s.timestamp) >= lastHour
    )

    const realtimeStats = {
      ...stats,
      realtime: {
        totalFetched: sightings.length,
        totalWithCoords: filteredSightings.length,
        last24Hours: recentSightings.length,
        lastHour: veryRecentSightings.length,
        avgPerHour: recentSightings.length / 24,
        lastUpdated: now.toISOString(),
      },
    }

    // Add urgency/priority scoring for real-time display
    const scoredSightings = filteredSightings.map((sighting) => {
      const recency = Math.max(
        0,
        1 - (now.getTime() - new Date(sighting.timestamp).getTime()) / (7 * 24 * 60 * 60 * 1000)
      ) // Score based on recency (last week)
      
      const hasMedia = (sighting.mediaUrls && sighting.mediaUrls.length > 0) ? 0.2 : 0
      const hasDetails = sighting.content && sighting.content.length > 100 ? 0.1 : 0
      const hasLocation = sighting.location?.city ? 0.1 : 0
      
      const priority = Math.min(1, recency + hasMedia + hasDetails + hasLocation)

      return {
        ...sighting,
        _realtimeScore: priority,
        _isRecent: new Date(sighting.timestamp) >= last24Hours,
        _isVeryRecent: new Date(sighting.timestamp) >= lastHour,
      }
    })

    // Sort by real-time score for priority display
    scoredSightings.sort((a, b) => b._realtimeScore - a._realtimeScore)

    debugLog('✅ Real-time response prepared:', {
      sightings: scoredSightings.length,
      recent24h: recentSightings.length,
      recentHour: veryRecentSightings.length,
      avgPerHour: realtimeStats.realtime.avgPerHour.toFixed(2),
    })

    return Response.json({
      sightings: scoredSightings,
      stats: realtimeStats,
      timestamp: now.toISOString(),
      metadata: {
        requestedRanges: validTimeRanges,
        filters: {
          includeCoordinates,
          sortBy,
          sortOrder,
        },
        performance: {
          dataFreshness: 'real-time',
          cacheStatus: 'fresh',
          processingTimeMs: Date.now() - now.getTime(),
        },
      },
    })
  } catch (error) {
    console.error('❌ Error in real-time sightings API:', error)
    
    return Response.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Optional: Add a GET endpoint for health checks
export async function GET() {
  return Response.json({
    status: 'healthy',
    endpoint: 'realtime-sightings',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
}