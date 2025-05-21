import type { SearchResult } from '@/app/api/disclosure/data-layer/search/table/route'
import axios from 'axios'

export const initiateDatabaseWideConnectionSearch = async ( { id, type }: any ) => {
  try {
    const response = await axios.get( '/api/disclosure/data-layer/search/connections', {
      params: {
        id,
        type,
      },
    } )
    console.log( 'response: ', response )
    // Handle the response data here
    console.log( response.data )
    return response.data
  } catch ( error ) {
    // Handle the error here
    console.error( error )
  }
}

export const initiateRagEnrichedDatabaseSearch = async ( { subject, type }: any ) => {
  try {
    const response = await axios.post( '/api/disclosure/data-layer/enrich', {
      data: {
        subject,
        type,
      },
    } )
    console.log( 'response: ', response )
    // Handle the response data here
    console.log( response.data )
    return response.data
  } catch ( error ) {
    // Handle the error here
    console.error( error )
  }
}

export const initiateDatabaseTableQuery = async ( {
  keyword,
  table,
}: {
  keyword: string
  table: string
} ): Promise<SearchResult | undefined> => {
  try {
    const response: any = await axios.get( '/api/disclosure/data-layer/search/table', {
      params: {
        keyword,
        table,
      },
    } )
    console.log( "🚀 ~ file: search.ts:54 ~ response:", response )
    // console.log( 'response: ', response 
    // Handle the response data here
    const { data: {
      suggestedSearchResult,
      relatedResults,
      totalCount
    } } = response
    console.log( 'suggestedSearchResult: ', suggestedSearchResult )
    return { suggestedSearchResult, relatedResults, totalCount }
  } catch ( error ) {
    // Handle the error here
    console.error( error )
    return
  }
}
