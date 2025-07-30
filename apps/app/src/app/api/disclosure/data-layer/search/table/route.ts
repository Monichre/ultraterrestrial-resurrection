import { NextRequest, NextResponse } from 'next/server'
import { searchXata } from '@db/src/xata-typescript-sdk/api/search'
import { xata } from '@db/xata/client'

export interface SearchResult {
  suggestedSearchResult: {
    record: any
  }
  relatedResults: any[]
  totalCount: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const keyword = searchParams.get('keyword')
    const table = searchParams.get('table')

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword parameter is required' },
        { status: 400 }
      )
    }

    if (!table) {
      return NextResponse.json(
        { error: 'Table parameter is required' },
        { status: 400 }
      )
    }

    console.log('🚀 ~ GET ~ keyword:', keyword)
    console.log('🚀 ~ GET ~ table:', table)

    // Use the searchXata function to get results
    const searchResponse = await searchXata({
      query: keyword,
      table: table
    })

    if (!searchResponse.success) {
      return NextResponse.json(
        { error: searchResponse.error || 'Search failed' },
        { status: 500 }
      )
    }

    const searchResults = searchResponse.searchResults || []
    console.log('🚀 ~ GET ~ searchResults:', searchResults)

    // Format the response to match what the mindmap expects
    const response: SearchResult = {
      suggestedSearchResult: {
        record: searchResults.length > 0 ? searchResults[0] : null
      },
      relatedResults: searchResults.slice(1, 6), // Return up to 5 related results
      totalCount: searchResults.length
    }

    console.log('🚀 ~ GET ~ response:', response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in table search API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to search table',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}