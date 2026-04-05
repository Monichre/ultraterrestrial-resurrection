import { NextRequest, NextResponse } from 'next/server'
import { fetchNextMindmapRecords } from '@db/src/xata-typescript-sdk/api/xyflow-integration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const table = searchParams.get('table')
    const size = parseInt(searchParams.get('size') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const cursor = searchParams.get('cursor') || undefined
    const cacheParam = searchParams.get('cache')

    // Determine cache control based on cache parameter
    // "no-cache" or "reload" forces revalidation (bypasses CDN cache)
    const forceRevalidate = cacheParam === 'no-cache' || cacheParam === 'reload'

    const cacheControlHeader = forceRevalidate
      ? 'no-cache, must-revalidate'
      : 'public, max-age=60, stale-while-revalidate=300'

    if (!table) {
      return NextResponse.json(
        { error: 'Table parameter is required' },
        { status: 400 }
      )
    }

    const result = await fetchNextMindmapRecords({
      table,
      size,
      offset,
      cursor,
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': cacheControlHeader,
      },
    })
  } catch (error) {
    console.error('Error fetching mindmap records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mindmap records' },
      { status: 500 }
    )
  }
}