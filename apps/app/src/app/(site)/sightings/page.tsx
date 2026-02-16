import {SightingsClient} from '@/features/sightings/sightings'
import {Suspense} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {getSightingsBatched} from '@/services/sightings/actions/sightings-time-chunk'
import {getEventsBatched} from '@/services/sightings/actions/events-time-chunk'
import {getYear} from 'date-fns'
import {serializeXataRecords} from '@/utils/serialization'
import {debugLog} from '@/utils/logger'

// Define interface for sightings stats matching StatsType in SightingsClient
interface SightingsStats {
  totalSightings: number
  byType?: Record<string, number>
  byConfidence?: Record<string, number>
  byYear?: Record<string, number>
  [key: string]: number | Record<string, number> | undefined
  timeRange: {
    startYear: number
    endYear: number
  }
}

// Define interfaces for serialized data
interface SerializedSightingsResponse {
  sightings: ValidatedUAPSighting[]
  stats: {
    totalSightings: number
    byType: Record<string, number>
    byYear: Record<string, number>
    byLocation: Record<string, number>
    byConfidence?: Record<string, number>
    timeRange: {
      startYear: number
      endYear: number
    }
  }
}

interface EventData {
  id: string
  title?: string
  name?: string
  description: string
  location?: string
  date: Date
  latitude?: number
  longitude?: number
  category?: string
  sourceUrl?: string
  mediaUrls?: string[]
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

interface SerializedEventsResponse {
  events: EventData[]
  stats: {
    total: number
    categoryDistribution: Array<{value: string; count: number}>
    timeseriesData: Array<{value: string; count: number}>
    locationData: Array<{
      location: string
      coordinates: {lat: number; lng: number} | null
      count: number
    }>
    timeRange: {
      startYear: number
      endYear: number
    }
  }
}

export default async function Index() {
  // Create a dynamic 10-year window using date-fns
  const currentDate = new Date()
  const currentYear = getYear(currentDate)

  // Create multiple time ranges for better historical distribution
  const timeRanges = [
    {startYear: 1947, endYear: 1970}, // Classic UFO era (Roswell to early sightings)
    {startYear: 1970, endYear: 1990}, // Modern UFO wave
    {startYear: 1990, endYear: 2010}, // Digital age sightings
    {startYear: 2010, endYear: currentYear}, // Recent UAP disclosure era
  ]

  debugLog('🔍 Fetching sightings and events with expanded historical time ranges:')
  debugLog('  • Classic UFO Era (1947-1970): Roswell to early documented sightings')
  debugLog('  • Modern UFO Wave (1970-1990): Increased public awareness period')
  debugLog('  • Digital Age (1990-2010): Internet documentation boom')
  debugLog('  • UAP Disclosure Era (2010-present): Government acknowledgment period')
  debugLog('  • Total time span:', timeRanges)

  try {
    // Fetch both sightings and events data in parallel with conservative limits
    const [sightingsResponse, eventsResponse] = await Promise.all([
      getSightingsBatched(timeRanges, 200), // Conservative limit per time range
      getEventsBatched(timeRanges, 100), // Conservative limit per time range
    ])

    debugLog('🚀 ~ Index ~ sightingsResponse:', sightingsResponse)

    // Safely serialize the responses for client components
    const serializedResponses = serializeXataRecords([sightingsResponse, eventsResponse])

    if (
      !serializedResponses ||
      !Array.isArray(serializedResponses) ||
      serializedResponses.length !== 2
    ) {
      throw new Error('Failed to serialize data responses')
    }

    const [serializedSightingsResponse, serializedEventsResponse] = serializedResponses as [
      SerializedSightingsResponse,
      SerializedEventsResponse,
    ]

    debugLog('🚀 ~ Index ~ serialized sightingsResponse:', serializedSightingsResponse)
    debugLog('🚀 ~ Index ~ serialized eventsResponse:', serializedEventsResponse)

    const {sightings, stats} = serializedSightingsResponse

    debugLog('🚀 ~ Index ~ sightings stats:', stats)
    debugLog('🚀 ~ Index ~ sightings:', sightings)

    const {events, stats: eventStats} = serializedEventsResponse

    debugLog('📊 DATA SUMMARY:')
    debugLog('  • Sightings loaded:', sightings?.length || 0)
    debugLog('  • Events loaded:', events?.length || 0)
    debugLog('  • Time range covered:', stats?.timeRange || 'Unknown')
    debugLog(
      '  • Distribution by year:',
      Object.keys(stats?.byYear || {}).length,
      'years represented'
    )
    debugLog('  • Geographic coverage:', Object.keys(stats?.byLocation || {}).length, 'locations')
    debugLog('📊 FULL STATS:', stats)
    debugLog('📊 EVENT STATS:', eventStats)

    // Create stats object with proper typing
    const formattedStats: SightingsStats = {
      totalSightings: stats?.totalSightings || sightings.length,
      byType: stats?.byType || countByField(sightings, 'type'),
      byConfidence: stats?.byConfidence || countByField(sightings, 'confidence'),
      byYear: stats?.byYear || countByYear(sightings),
      timeRange: {
        startYear: 1947, // Use the full historical range
        endYear: currentYear,
      },
    }

    // Generate AI analysis if we have data
    const analysisResult = null
    // if (
    //   (sightings?.length > 0 || events?.length > 0) &&
    //   process.env.ENABLE_AI_ANALYSIS === 'true'
    // ) {
    //   try {
    //     const analysisResponse = await analyzeSightingsData(sightings, events)
    //     // Ensure the analysis result is also serialized
    //     analysisResult = serializeXataRecords(analysisResponse.analysis)
    //     console.log('🧠 ~ Index ~ AI analysis completed')
    //   } catch (analysisError) {
    //     console.error('❌ Error generating AI analysis:', analysisError)
    //   }
    // }

    return (
      <Suspense>
        <div className='h-screen w-screen'>
          {sightings.length > 0 || events.length > 0 ? (
            <SightingsClient
              sightings={sightings}
              events={events}
              stats={formattedStats}
              analysis={analysisResult}
            />
          ) : (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold mb-4'>No Data Found</h2>
                <p>We couldn't find any sightings or events for the selected time period.</p>
                <p className='mt-2 text-sm text-gray-600'>
                  Try adjusting the date range or check the logs for more information.
                </p>
              </div>
            </div>
          )}
        </div>
      </Suspense>
    )
  } catch (error) {
    console.error('❌ Error fetching sightings data:')
    console.error('  • Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('  • Error message:', error instanceof Error ? error.message : String(error))
    console.error('  • Time ranges attempted:', timeRanges)
    if (error instanceof Error && error.stack) {
      console.error('  • Stack trace:', error.stack.split('\n').slice(0, 5).join('\n'))
    }

    // Return fallback UI with empty data
    return (
      <Suspense>
        <div className='h-screen w-screen'>
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-4'>Error Loading Sightings</h2>
              <p>There was a problem fetching the sightings data.</p>
              <p className='mt-2 text-sm text-gray-600'>
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          </div>
        </div>
      </Suspense>
    )
  }
}

// Helper function to count records by a specific field
function countByField(
  records: ValidatedUAPSighting[],
  field: keyof ValidatedUAPSighting
): Record<string, number> {
  return records.reduce((acc: Record<string, number>, record) => {
    const value = record[field]
    if (value && typeof value === 'string') {
      acc[value] = (acc[value] || 0) + 1
    }
    return acc
  }, {})
}

// Helper function to count records by year
function countByYear(records: ValidatedUAPSighting[]): Record<string, number> {
  return records.reduce((acc: Record<string, number>, record) => {
    if (record.timestamp) {
      const year = new Date(record.timestamp).getFullYear().toString()
      acc[year] = (acc[year] || 0) + 1
    }
    return acc
  }, {})
}
