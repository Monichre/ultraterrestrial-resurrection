import {
  getSightingsByDateRange,
  aggregateSightingsByShape,
  aggregateSightingsByCity,
  sightingsTimeSeries,
} from '@db/postgres';
import { ValidatedUAPSighting, UAPSightingSchema } from './uap-sighting';
import { truncateAtWordBoundary } from '@/lib/utils/text';

/**
 * NUFORC/MUFON `sightings` rows carry no verification or corroboration
 * signal (no witness count, no media, no cross-reference) — every record is
 * a single, uncorroborated report by construction. The only honest thing we
 * can differentiate is whether a real narrative was actually captured:
 * `'medium'` = the record has substantive reported content, `'low'` = it's a
 * thin/placeholder row. `'high'` is intentionally never emitted here — this
 * ingestion path has no signal that would justify it.
 */
function inferConfidence(comments: string | null): ValidatedUAPSighting['confidence'] {
  const length = comments?.trim().length ?? 0;
  return length >= 15 ? 'medium' : 'low';
}

/**
 * Fetch sightings within a specified time range
 * @param startYear Starting year for the query
 * @param endYear Ending year for the query
 * @param limit Maximum number of records to return
 */
export async function getSightingsByTimeChunk(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear(),
  limit: number = 100
): Promise<ValidatedUAPSighting[]> {
  try {
    const start = `${startYear}-01-01T00:00:00Z`;
    const end = `${endYear}-12-31T23:59:59Z`;

    const records = await getSightingsByDateRange(start, end, limit);

    // Convert to ValidatedUAPSighting format
    const sightings = records.map(record => {
      // Transform from postgres SightingsRecord to UAPSighting format
      const transformed = {
        id: record.id,
        source: 'news', // Default source
        title: record.comments
          ? truncateAtWordBoundary(record.comments, 70)
          : 'UAP Sighting',
        content: record.comments || '',
        location: {
          city: record.city || undefined,
          state: record.state || undefined,
          coordinates: record.latitude && record.longitude
            ? {
                lat: record.latitude,
                lng: record.longitude,
              }
            : undefined
        },
        timestamp: record.occurred_at ? new Date(record.occurred_at) : new Date(),
        mediaUrls: [],
        sourceUrl: '',
        category: record.shape
          ? [record.shape]
          : [],
        confidence: inferConfidence(record.comments),
        type: 'sighting' // Default type
      };

      // Validate with schema
      try {
        return UAPSightingSchema.parse(transformed);
      } catch (error) {
        console.error('Schema validation error:', error);
        return null;
      }
    }).filter(Boolean) as ValidatedUAPSighting[];

    return sightings;
  } catch (error) {
    console.error('Error fetching sightings by time chunk:', error);
    return [];
  }
}

/**
 * Get aggregate statistics for sightings based on time range
 */
export async function getSightingsStats(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear()
) {
  try {
    const start = `${startYear}-01-01T00:00:00Z`;
    const end = `${endYear}-12-31T23:59:59Z`;

    const [shapeRows, timeSeriesRows, locationRows] = await Promise.all([
      aggregateSightingsByShape(start, end, 20),
      sightingsTimeSeries(start, end),
      aggregateSightingsByCity(start, end, 30),
    ]);

    return {
      total: timeSeriesRows.reduce((sum, item) => sum + item.count, 0),
      shapeDistribution: shapeRows,
      timeseriesData: timeSeriesRows,
      locationData: locationRows,
      timeRange: {
        startYear,
        endYear
      }
    };
  } catch (error) {
    console.error('Error fetching sightings stats:', error);
    return {
      total: 0,
      shapeDistribution: [],
      timeseriesData: [],
      locationData: [],
      timeRange: {
        startYear,
        endYear
      }
    };
  }
}