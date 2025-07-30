'use server'

import { askXataWithAi } from "@db/src/xata-typescript-sdk/api"
import type { GraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import type { ReactFlowNode, ReactFlowEdge } from '@/features/mindmap/actions/xata-to-xyflow'

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

    return {
      success: true,
      records: response.records || [],
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

    return {
      success: true,
      records: response.records || [],
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

    const response = await askXataWithAi( {
      question: params.query,
      table: params.table,
      rules: params.rules
    } )

    return {
      success: true,
      records: response.records || [],
      answer: response.answer || '',
      sessionId: response.sessionId || ''
    }
  } catch ( error ) {
    console.error( '[Historical Query Server] Contextual expansion failed:', error )
    return {
      success: false,
      records: [],
      answer: '',
      sessionId: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 