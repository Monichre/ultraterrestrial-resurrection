import {
  getSightingsByDateRange,
  aggregateSightingsByShape,
  aggregateSightingsByCity,
  sightingsTimeSeries,
} from '@db/postgres';
import { ValidatedUAPSighting, UAPSightingSchema } from './uap-sighting';

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
        title: record.comments?.substring(0, 50) || 'UAP Sighting',
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
        confidence: 'medium', // Default confidence
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