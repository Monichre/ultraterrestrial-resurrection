'use server'

import { askXataWithAi } from "@db/src/xata-typescript-sdk/api/ask"
import { fetchRecords } from '@/features/mindmap/actions/xata-to-xyflow'

export interface HistoricalQueryServerParams {
  table: string
  query: string
  rules: string[]
  amount?: number
  historicalFilter?: {
    mode: 'chronological' | 'contextual' | 'free-form'
    dateRange?: { startYear?: number; endYear?: number }
    significance?: 'historically_important' | 'all' | 'disclosure_related'
    progression?: 'forward' | 'backward' | 'context-based'
  }
  tourContext?: {
    tourId: string
    waypointId: string
    tourMode: 'guided' | 'free-form'
    narrativeContext: string
  }
}

export interface HistoricalQueryServerResponse {
  success: boolean
  records: any[]
  answer: string
  sessionId: string
  error?: string
}


/**
 * Server Action for chronological progression queries
 */
export async function executeChronologicalProgression(
  params: HistoricalQueryServerParams
): Promise<HistoricalQueryServerResponse> {
  try {
    console.log( `[Historical Query Server] Processing chronological progression for ${params.table}` )

    const response = await askXataWithAi( {
      question: params.query,
      table: params.table,
      rules: params.rules
    } )

    // Fetch actual record data using the record IDs and table parameter
    const recordIds = response.records || []
    const fullRecords = recordIds.length > 0 ? await fetchRecords(recordIds, params.table) : []

    return {
      success: true,
      records: fullRecords,
      answer: response.answer || '',
      sessionId: response.sessionId || ''
    }
  } catch ( error ) {
    console.error( '[Historical Query Server] Chronological progression failed:', error )
    return {
      success: false,
      records: [],
      answer: '',
      sessionId: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Server Action for tour waypoint queries
 */
export async function executeTourWaypoint(
  params: HistoricalQueryServerParams
): Promise<HistoricalQueryServerResponse> {
  try {
    console.log( `[Historical Query Server] Processing tour waypoint for ${params.table}` )

    const response = await askXataWithAi( {
      question: params.query,
      table: params.table,
      rules: params.rules
    } )

    // Fetch actual record data using the record IDs and table parameter
    const recordIds = response.records || []
    const fullRecords = recordIds.length > 0 ? await fetchRecords(recordIds, params.table) : []

    return {
      success: true,
      records: fullRecords,
      answer: response.answer || '',
      sessionId: response.sessionId || ''
    }
  } catch ( error ) {
    console.error( '[Historical Query Server] Tour waypoint failed:', error )
    return {
      success: false,
      records: [],
      answer: '',
      sessionId: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Server Action for contextual expansion queries
 */
export async function executeContextualExpansion(
  params: HistoricalQueryServerParams
): Promise<HistoricalQueryServerResponse> {
  try {
    console.log( `[Historical Query Server] Processing contextual expansion for ${params.table}` )
    console.log( `[Historical Query Server] Query: ${params.query}` )
    console.log( `[Historical Query Server] Rules: ${JSON.stringify(params.rules)}` )

    const response = await askXataWithAi( {
      question: params.query,
      table: params.table,
      rules: params.rules
    } )
    
    console.log( `[Historical Query Server] askXataWithAi response:`, response )

    // Fetch actual record data using the record IDs and table parameter
    const recordIds = response.records || []
    console.log( `[Historical Query Server] Record IDs from askXataWithAi:`, recordIds )
    
    const fullRecords = recordIds.length > 0 ? await fetchRecords(recordIds, params.table) : []
    console.log( `[Historical Query Server] Full records fetched:`, fullRecords.length )

    return {
      success: true,
      records: fullRecords,
      answer: response.answer || '',
      sessionId: response.sessionId || ''
    }
  } catch ( error: any ) {
    console.error( '[Historical Query Server] Contextual expansion failed:', error )
    
    // Enhanced error messages based on error type
    let userFriendlyMessage = 'Unknown error occurred'
    
    if ( error?.code === 'MAX_RETRIES_EXCEEDED' ) {
      userFriendlyMessage = 'Database connection timeout - the request took too long to process. Please try again with a simpler query.'
    } else if ( error?.code === 'FETCH_TIMEOUT' || error?.code === 'ETIMEDOUT' ) {
      userFriendlyMessage = 'Request timeout - the database server is taking too long to respond. Please try again in a moment.'
    } else if ( error?.name === 'TypeError' && error?.message?.includes('fetch failed') ) {
      userFriendlyMessage = 'Network connection error - unable to reach the database server. Please check your connection and try again.'
    } else if ( error?.message ) {
      userFriendlyMessage = error.message
    }

    return {
      success: false,
      records: [],
      answer: '',
      sessionId: '',
      error: userFriendlyMessage
    }
  }
} 