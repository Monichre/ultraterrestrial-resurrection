import { type NextRequest } from 'next/server'
import { getSightingsByTimeChunk, getSightingsStats } from '@/services/sightings/get-sightings'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const startYear = parseInt(url.searchParams.get('startYear') || '1940')
    const endYear = parseInt(url.searchParams.get('endYear') || new Date().getFullYear().toString())
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const includeStats = url.searchParams.get('stats') === 'true'

    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (!process.env.INTERNAL_API_KEY || apiKey !== process.env.INTERNAL_API_KEY) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // For large time ranges, fetch in batches of 10 years
    if (endYear - startYear > 10 && !url.searchParams.has('batch')) {
      const batchSize = 10
      const batches = []
      
      for (let year = startYear; year <= endYear; year += batchSize) {
        const batchEndYear = Math.min(year + batchSize - 1, endYear)
        batches.push({ startYear: year, endYear: batchEndYear })
      }
      
      return Response.json({
        batches,
        message: 'Time range exceeds 10 years. Data is split into batches.',
        timeRange: { startYear, endYear }
      })
    }

    // Fetch data based on parameters
    const [sightings, stats] = await Promise.all([
      getSightingsByTimeChunk(startYear, endYear, limit),
      includeStats ? getSightingsStats(startYear, endYear) : null
    ])

    return Response.json({
      sightings,
      stats: includeStats ? stats : undefined,
      timestamp: new Date().toISOString(),
      timeRange: {
        startYear,
        endYear
      }
    })
  } catch (error) {
    console.error('Error fetching UAP sightings:', error)
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}