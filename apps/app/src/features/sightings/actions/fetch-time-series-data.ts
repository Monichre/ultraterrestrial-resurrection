"use server"

import { xata } from '@db/xata/client'

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
    const results = await xata.db.sightings.summarize( {
      filter: {
        date: {
          $ge: timeRange[0],
          $le: timeRange[1],
        },
      },
      columns: ['date'],
      summaries: {
        count: { count: '*' },
      },
    } )

    // Process the summarized data
    if ( results.summaries?.count ) {
      const dateMap = results.summaries.count as Record<string, number>

      // Format the time series data
      const formattedData = Object.entries( dateMap )
        .map( ( [dateStr, count] ) => ( {
          date: new Date( dateStr ),
          count,
        } ) )
        .sort( ( a, b ) => a.date.getTime() - b.date.getTime() )

      return {
        success: true,
        data: formattedData
      }
    } else {
      return {
        success: true,
        data: []
      }
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
  cursor?: string | null
}

export interface FetchPaginatedSightingsResult {
  success: boolean
  records: any[]
  cursor: string | null
  hasMore: boolean
  error?: string
}

export async function fetchPaginatedSightings( {
  timeRange,
  cursor
}: FetchPaginatedSightingsParams ): Promise<FetchPaginatedSightingsResult> {
  try {
    // Use Xata's recommended cursor pattern for robustness
    const response = await xata.db.sightings
      .filter( {
        date: {
          $ge: timeRange[0],
          $le: timeRange[1],
        },
      } )
      .sort( 'date', 'asc' )
      .getPaginated( {
        pagination: {
          size: 100,
          // Only include cursor for subsequent pages
          ...( cursor ? { after: cursor } : {} ),
        },
      } )

    return {
      success: true,
      records: response.records,
      cursor: response.meta?.page?.cursor || null,
      hasMore: response.meta?.page?.more || false
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