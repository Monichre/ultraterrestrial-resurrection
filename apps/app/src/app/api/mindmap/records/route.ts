import { NextRequest, NextResponse } from 'next/server'
import { fetchNextMindmapRecords } from '@db/xata/api/xyflow-integration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const table = searchParams.get('table')
    const size = parseInt(searchParams.get('size') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const cursor = searchParams.get('cursor') || undefined

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

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching mindmap records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mindmap records' },
      { status: 500 }
    )
  }
}