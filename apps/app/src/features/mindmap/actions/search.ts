import axios from 'axios'

// Define interfaces for consistent typing
export interface SearchResult {
  suggestedSearchResult: {
    record: any
  }
  relatedResults: any[]
  totalCount: number
}

export interface ConnectionSearchParams {
  id: string
  type: string
}

export interface RagEnrichmentParams {
  subject: string
  type: string
}

export interface TableQueryParams {
  keyword: string
  table: string
}

export const initiateDatabaseWideConnectionSearch = async ( { id, type }: ConnectionSearchParams ) => {
  try {
    // Input validation
    if ( !id || typeof id !== 'string' || id.trim().length === 0 ) {
      throw new Error( 'initiateDatabaseWideConnectionSearch: Invalid or empty id parameter' )
    }

    if ( !type || typeof type !== 'string' || type.trim().length === 0 ) {
      throw new Error( 'initiateDatabaseWideConnectionSearch: Invalid or empty type parameter' )
    }

    console.log( `🔍 Searching connections for ${type} ID: ${id}` )

    const response = await axios.get( '/api/disclosure/data-layer/search/connections', {
      params: {
        id: id.trim(),
        type: type.trim(),
      },
      timeout: 10000, // 10 second timeout
    } )

    if ( !response.data ) {
      throw new Error( 'initiateDatabaseWideConnectionSearch: No data received from API' )
    }

    console.log( '🔍 Connection search response:', response.data )
    return response.data
  } catch ( error ) {
    console.error( 'initiateDatabaseWideConnectionSearch: Search failed:', error )

    // Return a structured error response instead of undefined
    if ( axios.isAxiosError( error ) ) {
      if ( error.code === 'ECONNABORTED' ) {
        throw new Error( 'Connection search timed out. Please try again.' )
      } else if ( error.response?.status === 404 ) {
        throw new Error( `No connections found for ${type} with ID: ${id}` )
      } else if ( error.response?.status >= 500 ) {
        throw new Error( 'Server error during connection search. Please try again later.' )
      }
    }

    throw new Error( `Connection search failed: ${error instanceof Error ? error.message : 'Unknown error'}` )
  }
}

export const initiateRagEnrichedDatabaseSearch = async ( { subject, type }: RagEnrichmentParams ) => {
  try {
    // Input validation
    if ( !subject || typeof subject !== 'string' || subject.trim().length === 0 ) {
      throw new Error( 'initiateRagEnrichedDatabaseSearch: Invalid or empty subject parameter' )
    }

    if ( !type || typeof type !== 'string' || type.trim().length === 0 ) {
      throw new Error( 'initiateRagEnrichedDatabaseSearch: Invalid or empty type parameter' )
    }

    console.log( `🧠 Initiating RAG enriched search for subject: "${subject}" in type: "${type}"` )

    const response = await axios.post( '/api/disclosure/data-layer/enrich', {
      data: {
        subject: subject.trim(),
        type: type.trim(),
      },
    }, {
      timeout: 15000, // 15 second timeout for potentially longer RAG operations
      headers: {
        'Content-Type': 'application/json',
      },
    } )

    if ( !response.data ) {
      throw new Error( 'initiateRagEnrichedDatabaseSearch: No data received from API' )
    }

    console.log( '🧠 RAG enriched search response:', response.data )
    return response.data
  } catch ( error ) {
    console.error( 'initiateRagEnrichedDatabaseSearch: Search failed:', error )

    // Return a structured error response
    if ( axios.isAxiosError( error ) ) {
      if ( error.code === 'ECONNABORTED' ) {
        throw new Error( 'RAG enriched search timed out. Please try again.' )
      } else if ( error.response?.status === 400 ) {
        throw new Error( 'Invalid search parameters provided' )
      } else if ( error.response?.status >= 500 ) {
        throw new Error( 'Server error during RAG enriched search. Please try again later.' )
      }
    }

    throw new Error( `RAG enriched search failed: ${error instanceof Error ? error.message : 'Unknown error'}` )
  }
}

export const initiateDatabaseTableQuery = async ( {
  keyword,
  table,
}: TableQueryParams ): Promise<SearchResult | undefined> => {
  try {
    // Input validation
    if ( !keyword || typeof keyword !== 'string' || keyword.trim().length === 0 ) {
      throw new Error( 'initiateDatabaseTableQuery: Invalid or empty keyword parameter' )
    }

    if ( !table || typeof table !== 'string' || table.trim().length === 0 ) {
      throw new Error( 'initiateDatabaseTableQuery: Invalid or empty table parameter' )
    }

    // Validate table against known entity types
    const validTables = ['events', 'personnel', 'organizations', 'testimonies', 'documents', 'sightings', 'topics', 'artifacts']
    if ( !validTables.includes( table.toLowerCase() ) ) {
      console.warn( `initiateDatabaseTableQuery: Unknown table "${table}". Proceeding anyway.` )
    }

    console.log( `🔍 Searching table "${table}" for keyword: "${keyword}"` )

    const response = await axios.get( '/api/disclosure/data-layer/search/table', {
      params: {
        keyword: keyword.trim(),
        table: table.trim().toLowerCase(),
      },
      timeout: 10000, // 10 second timeout
    } )

    if ( !response.data ) {
      throw new Error( 'initiateDatabaseTableQuery: No data received from API' )
    }

    console.log( "🔍 Table query response:", response.data )

    // Validate response structure
    const { data } = response
    if ( !data || typeof data !== 'object' ) {
      throw new Error( 'initiateDatabaseTableQuery: Invalid response structure' )
    }

    const {
      suggestedSearchResult,
      relatedResults,
      totalCount
    } = data

    // Validate required fields
    if ( !suggestedSearchResult && ( !relatedResults || relatedResults.length === 0 ) ) {
      console.warn( `initiateDatabaseTableQuery: No results found for "${keyword}" in table "${table}"` )
      return {
        suggestedSearchResult: { record: null },
        relatedResults: [],
        totalCount: 0
      }
    }

    console.log( '🔍 Suggested search result:', suggestedSearchResult )
    console.log( '🔍 Related results count:', relatedResults?.length || 0 )
    console.log( '🔍 Total count:', totalCount )

    return {
      suggestedSearchResult: suggestedSearchResult || { record: null },
      relatedResults: Array.isArray( relatedResults ) ? relatedResults : [],
      totalCount: typeof totalCount === 'number' ? totalCount : 0
    }
  } catch ( error ) {
    console.error( 'initiateDatabaseTableQuery: Query failed:', error )

    // Return a structured error response instead of undefined
    if ( axios.isAxiosError( error ) ) {
      if ( error.code === 'ECONNABORTED' ) {
        console.error( 'Database table query timed out' )
        return {
          suggestedSearchResult: { record: null },
          relatedResults: [],
          totalCount: 0
        }
      } else if ( error.response?.status === 404 ) {
        console.warn( `No results found for "${keyword}" in table "${table}"` )
        return {
          suggestedSearchResult: { record: null },
          relatedResults: [],
          totalCount: 0
        }
      } else if ( error.response?.status >= 500 ) {
        console.error( 'Server error during table query' )
        return {
          suggestedSearchResult: { record: null },
          relatedResults: [],
          totalCount: 0
        }
      }
    }

    // Log the error but return empty results to prevent UI crashes
    console.error( `Table query failed for "${keyword}" in "${table}":`, error )
    return {
      suggestedSearchResult: { record: null },
      relatedResults: [],
      totalCount: 0
    }
  }
}

// New helper function to validate search results
export const validateSearchResult = ( result: any ): boolean => {
  try {
    if ( !result || typeof result !== 'object' ) {
      return false
    }

    // Check if result has an ID (required for graph nodes)
    if ( !result.id || typeof result.id !== 'string' ) {
      return false
    }

    return true
  } catch ( error ) {
    console.warn( 'validateSearchResult: Error validating result:', error )
    return false
  }
}

// New helper function to sanitize search inputs
export const sanitizeSearchInput = ( input: string ): string => {
  try {
    if ( !input || typeof input !== 'string' ) {
      return ''
    }

    // Basic sanitization: trim whitespace and remove control characters
    return input.trim().replace( /[\x00-\x1F\x7F]/g, '' )
  } catch ( error ) {
    console.warn( 'sanitizeSearchInput: Error sanitizing input:', error )
    return ''
  }
}

// Export types for use in other modules
export type { SearchResult, ConnectionSearchParams, RagEnrichmentParams, TableQueryParams }
