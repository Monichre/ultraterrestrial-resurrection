import {
  getEventsByDateRange,
  aggregateEventsByYear,
  getSql,
} from '@db/postgres';

/**
 * Fetch events within a specified time range, with pagination
 * @param startYear Starting year for the query
 * @param endYear Ending year for the query
 * @param limit Maximum number of records to return
 */
export async function getEventsByTimeChunk(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear(),
  limit: number = 100
) {
  try {
    const start = `${startYear}-01-01T00:00:00Z`;
    const end = `${endYear}-12-31T23:59:59Z`;

    return await getEventsByDateRange(start, end, limit);
  } catch (error) {
    console.error('Error fetching events by time chunk:', error);
    return [];
  }
}

/**
 * Get aggregate statistics for events based on time range
 */
export async function getEventsStats(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear()
) {
  try {
    const start = `${startYear}-01-01T00:00:00Z`;
    const end = `${endYear}-12-31T23:59:59Z`;
    const sql = getSql();

    // category is a text[] column — unnest to count per category value
    const categoryRows = await sql`
      SELECT cat AS category, count(*)::int AS count
      FROM events,
           LATERAL unnest(category) AS cat
      WHERE date >= ${start}::timestamptz AND date <= ${end}::timestamptz
        AND category IS NOT NULL
      GROUP BY cat
      ORDER BY count DESC
    ` as { category: string; count: number }[];

    const timeSeriesRows = await aggregateEventsByYear(start, end);

    const locationRows = await sql`
      SELECT location, count(*)::int AS count
      FROM events
      WHERE date >= ${start}::timestamptz AND date <= ${end}::timestamptz
        AND location IS NOT NULL
      GROUP BY location
      ORDER BY count DESC
    ` as { location: string; count: number }[];

    return {
      total: timeSeriesRows.reduce((sum, item) => sum + item.count, 0),
      categoryDistribution: categoryRows,
      timeseriesData: timeSeriesRows,
      locationData: locationRows,
      timeRange: {
        startYear,
        endYear
      }
    };
  } catch (error) {
    console.error('Error fetching events stats:', error);
    return {
      total: 0,
      categoryDistribution: [],
      timeseriesData: [],
      locationData: [],
      timeRange: {
        startYear,
        endYear
      }
    };
  }
}