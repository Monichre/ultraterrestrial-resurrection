"use server"

import { sightingsTimeSeries, getPaginatedSightings } from '@db/postgres'

export interface TimeDataPoint {
  date: Date
  count: number
}

export interface FetchTimeSeriesDataParams {
  timeRange: [Date, Date]
}

export interface FetchTimeSeriesDataResult {
  success: boolean
  data: TimeDataPoint[]
  error?: string
}

export async function fetchTimeSeriesData( {
  timeRange
}: FetchTimeSeriesDataParams ): Promise<FetchTimeSeriesDataResult> {
  try {
    const rows = await sightingsTimeSeries( timeRange[0], timeRange[1] )

    const formattedData = rows
      .map( ( { date, count } ) => ( {
        date: new Date( date ),
        count,
      } ) )
      .sort( ( a, b ) => a.date.getTime() - b.date.getTime() )

    return {
      success: true,
      data: formattedData
    }
  } catch ( err ) {
    console.error( 'Error fetching time series data:', err )
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export interface FetchPaginatedSightingsParams {
  timeRange: [Date, Date]
  /** Numeric offset (page * size). Replaces the old Xata cursor. */
  offset?: number
}

export interface FetchPaginatedSightingsResult {
  success: boolean
  records: any[]
  cursor: string | null
  hasMore: boolean
  error?: string
}

const PAGE_SIZE = 100

export async function fetchPaginatedSightings( {
  timeRange,
  offset = 0
}: FetchPaginatedSightingsParams ): Promise<FetchPaginatedSightingsResult> {
  try {
    const { records, hasMore } = await getPaginatedSightings(
      timeRange[0],
      timeRange[1],
      PAGE_SIZE,
      offset,
    )

    return {
      success: true,
      records,
      // Encode next offset as a string cursor so callers don't need to change their interface
      cursor: hasMore ? String( offset + PAGE_SIZE ) : null,
      hasMore,
    }
  } catch ( err ) {
    console.error( 'Error fetching paginated sightings:', err )
    return {
      success: false,
      records: [],
      cursor: null,
      hasMore: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
} 