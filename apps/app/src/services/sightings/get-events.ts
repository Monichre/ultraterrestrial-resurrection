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
/**
 * ISO 8601 requires a 4-digit year. The events corpus reaches back to 196 CE,
 * and an unpadded `196-01-01T00:00:00Z` is not a parseable timestamp — pad so
 * pre-1000 CE windows query correctly instead of erroring into an empty array.
 */
function isoYearStart(year: number): string {
  return `${String(year).padStart(4, '0')}-01-01T00:00:00Z`;
}

function isoYearEnd(year: number): string {
  return `${String(year).padStart(4, '0')}-12-31T23:59:59Z`;
}

export async function getEventsByTimeChunk(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear(),
  limit: number = 100
) {
  try {
    const start = isoYearStart(startYear);
    const end = isoYearEnd(endYear);

    return await getEventsByDateRange(start, end, limit);
  } catch (error) {
    console.error('Error fetching events by time chunk:', error);
    return [];
  }
}

/**
 * Count events in a year range. Lets callers skip stratified sampling entirely
 * when the whole range already fits in their budget — sampling a corpus
 * smaller than the limit only loses rows.
 */
export async function countEventsByTimeChunk(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear()
): Promise<number> {
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT count(*)::int AS count
      FROM events
      WHERE date >= ${isoYearStart(startYear)}::timestamptz
        AND date <= ${isoYearEnd(endYear)}::timestamptz
    `) as { count: number }[];
    return rows[0]?.count ?? 0;
  } catch (error) {
    console.error('Error counting events by time chunk:', error);
    return 0;
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
    const start = isoYearStart(startYear);
    const end = isoYearEnd(endYear);
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