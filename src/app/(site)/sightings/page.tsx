import {SightingsClient} from '@/features/data-viz/sightings/sightings'
import {Suspense} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {getSightingsBatched} from '@/services/sightings/actions/sightings-time-chunk'
import {getEventsBatched} from '@/services/sightings/actions/events-time-chunk'
import {analyzeSightingsData} from '@/services/sightings/actions/sightings-ai-analysis'
import {getYear, subYears} from 'date-fns'
import {serializeXataRecords} from '@/utils/serialization'

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
  const startDate = subYears(currentDate, 10)
  const startYear = getYear(startDate)

  // Use a single time range instead of multiple small chunks
  const timeRange = {
    startYear: 2015,
    endYear: 2025,
  }

  console.log('🔍 Fetching sightings and events with time range:', timeRange)

  try {
    // Fetch both sightings and events data in parallel
    const [sightingsResponse, eventsResponse] = await Promise.all([
      getSightingsBatched([timeRange], 100),
      getEventsBatched([timeRange], 100),
    ])

    console.log('🚀 ~ Index ~ sightingsResponse:', sightingsResponse)

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

    console.log('🚀 ~ Index ~ serialized sightingsResponse:', serializedSightingsResponse)
    console.log('🚀 ~ Index ~ serialized eventsResponse:', serializedEventsResponse)

    const {sightings, stats} = serializedSightingsResponse

    console.log('🚀 ~ Index ~ sightings stats:', stats)

    console.log('🚀 ~ Index ~ sightings:', sightings)

    const {events, stats: eventStats} = serializedEventsResponse

    console.log('🚀 ~ Index ~ sightings length:', sightings?.length || 0)
    console.log('🚀 ~ Index ~ events length:', events?.length || 0)
    console.log('🚀 ~ Index ~ stats:', stats)
    console.log('🚀 ~ Index ~ eventStats:', eventStats)

    // Create stats object with proper typing
    const formattedStats: SightingsStats = {
      totalSightings: stats?.totalSightings || sightings.length,
      byType: stats?.byType || countByField(sightings, 'type'),
      byConfidence: stats?.byConfidence || countByField(sightings, 'confidence'),
      byYear: stats?.byYear || countByYear(sightings),
      timeRange: {
        startYear,
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
    console.error('❌ Error fetching sightings:', error)

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
