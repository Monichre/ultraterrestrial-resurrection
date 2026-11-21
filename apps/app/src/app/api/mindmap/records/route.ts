import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPaginatedRecords } from '@db/postgres'

const QuerySchema = z.object({
  table: z.string().min(1, 'Table parameter is required'),
  size: z.coerce.number().int().positive().optional().default(10),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
  cache: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const rawParams = {
      table: searchParams.get('table') ?? undefined,
      size: searchParams.get('size') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,
      cache: searchParams.get('cache') ?? undefined,
    }

    const parsed = QuerySchema.safeParse(rawParams)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { table, size, offset, cache: cacheParam } = parsed.data

    // Determine cache control based on cache parameter
    // "no-cache" or "reload" forces revalidation (bypasses CDN cache)
    const forceRevalidate = cacheParam === 'no-cache' || cacheParam === 'reload'

    const cacheControlHeader = forceRevalidate
      ? 'no-cache, must-revalidate'
      : 'public, max-age=60, stale-while-revalidate=300'

    const result = await getPaginatedRecords(table, size, offset)

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