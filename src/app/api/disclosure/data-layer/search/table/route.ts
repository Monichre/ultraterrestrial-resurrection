import { executeDatabaseTableQuery } from '@/db/xata'
import { NextRequest, NextResponse } from 'next/server'

export type SearchResult = {
  suggestedSearchResult: any
  relatedResults: any
  totalCount: number
}

type ErrorResponse = {
  error: string
}

export async function GET( request: NextRequest ): Promise<NextResponse<SearchResult | ErrorResponse>> {
  const searchParams = request.nextUrl.searchParams

  console.log( "🚀 ~ file: route.ts:17 ~ GET ~ searchParams:", searchParams )

  const keyword: string | null = searchParams.get( 'keyword' )
  const table: string | null = searchParams.get( 'table' )

  if ( !keyword || !table ) {
    return NextResponse.json( { error: 'Missing keyword or table parameter' }, { status: 400 } )
  }

  try {
    const { suggestedSearchResult, relatedResults, totalCount }: SearchResult = await executeDatabaseTableQuery( { keyword, table } )

    console.log( "🚀 ~ file: route.ts:29 ~ GET ~ suggestedSearchResult:", suggestedSearchResult )

    return NextResponse.json( { suggestedSearchResult, relatedResults, totalCount } )
  } catch ( error ) {
    return NextResponse.json( { error: 'Failed to execute database query' }, { status: 500 } )
  }
}
