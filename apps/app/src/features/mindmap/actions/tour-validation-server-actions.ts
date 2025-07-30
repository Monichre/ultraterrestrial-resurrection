'use server'

import { xata } from '@db'

export interface DatabaseReferenceValidationParams {
  type: string
  id: string
  waypointId: string
  hasFallbackQuery?: boolean
}

export interface DatabaseReferenceValidationResult {
  exists: boolean
  error?: string
  shouldUseFallback: boolean
}

/**
 * Server Action to validate database references for tours
 */
export async function validateDatabaseReference(
  params: DatabaseReferenceValidationParams
): Promise<DatabaseReferenceValidationResult> {
  try {
    if ( !params.type || !params.id ) {
      return {
        exists: false,
        error: 'Database reference must have type and id',
        shouldUseFallback: false
      }
    }

    // Check if the record exists in the database
    const record = await xata.db[params.type].read( params.id )

    if ( !record ) {
      return {
        exists: false,
        error: `Referenced record ${params.id} not found`,
        shouldUseFallback: Boolean( params.hasFallbackQuery )
      }
    }

    return {
      exists: true,
      shouldUseFallback: false
    }
  } catch ( error ) {
    return {
      exists: false,
      error: `Failed to validate database reference: ${error instanceof Error ? error.message : 'Unknown error'}`,
      shouldUseFallback: Boolean( params.hasFallbackQuery )
    }
  }
} 