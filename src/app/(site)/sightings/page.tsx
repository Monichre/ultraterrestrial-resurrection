import {SightingsClient} from '@/features/data-viz/sightings/sightings'
import {Suspense} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {getSightingsBatched} from '@/services/sightings/actions/sightings-time-chunk'

// Define interface for sightings stats matching StatsType in SightingsClient
interface SightingsStats {
  totalSightings: number
  byType?: Record<string, number>
  byConfidence?: Record<string, number>
  byYear?: Record<string, number>
  [key: string]: number | Record<string, number> | undefined
}

export default async function Index() {
  // Create time ranges from present to 10 years ago
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 10

  // Create array of time ranges (one for each year) to fetch data successively
  const timeRanges = []
  for (let year = startYear; year <= currentYear; year++) {
    timeRanges.push({startYear: year, endYear: year})
  }

  // Fetch sightings data using the batched function
  // This will load data from the last 10 years in batches
  const {sightings, stats} = await getSightingsBatched(timeRanges)

  // Create stats object with proper typing
  const formattedStats: SightingsStats = {
    totalSightings: stats?.totalSightings || sightings.length,
    byType: stats?.byType || countByField(sightings, 'type'),
    byConfidence: stats?.byConfidence || countByField(sightings, 'confidence'),
    byYear: stats?.byYear || countByYear(sightings),
  }

  return (
    <Suspense>
      <div className='h-screen w-screen'>
        <SightingsClient sightings={sightings} stats={formattedStats} />
      </div>
    </Suspense>
  )
}

// Helper function to count records by a specific field
function countByField(
  records: ValidatedUAPSighting[],
  field: keyof ValidatedUAPSighting
): Record<string, number> {
  return records.reduce((acc: Record<string, number>, record) => {
    const value = record[field]
    if (value && typeof value === 'string') {
      acc[value] = (acc[value] || 0) + 1
    }
    return acc
  }, {})
}

// Helper function to count records by year
function countByYear(records: ValidatedUAPSighting[]): Record<string, number> {
  return records.reduce((acc: Record<string, number>, record) => {
    if (record.timestamp) {
      const year = new Date(record.timestamp).getFullYear().toString()
      acc[year] = (acc[year] || 0) + 1
    }
    return acc
  }, {})
}
