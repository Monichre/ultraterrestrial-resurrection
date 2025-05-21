import { xata } from '@/db/xata/client';

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
    // Calculate date range
    const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
    const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

    // Use Xata's filter to get events within date range
    const eventsRecords = await xata.db.events
      .filter({
        date: {
          $ge: startDate,
          $le: endDate
        }
      })
      .sort('date', 'desc')
      .getPaginated({
        pagination: {
          size: limit
        }
      });

    return eventsRecords.records;
  } catch (error) {
    console.error('Error fetching events by time chunk:', error);
    return [];
  }
}

/**
 * Get aggregate statistics for events based on time range
 * Uses Xata's aggregate functionality for efficient computation
 */
export async function getEventsStats(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear()
) {
  try {
    // Calculate date range
    const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
    const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

    // Use Xata's aggregate to get category distribution
    const categoryAggregation = await xata.db.events
      .filter({
        date: {
          $ge: startDate,
          $le: endDate
        }
      })
      .aggregate({
        categoryDistribution: {
          distinctCount: {
            column: 'id',
            groupBy: 'category'
          }
        }
      });
    
    // Get time series data by year
    const timeSeriesAggregation = await xata.db.events
      .filter({
        date: {
          $ge: startDate,
          $le: endDate
        }
      })
      .aggregate({
        eventsByYear: {
          count: {
            groupBy: {
              dateColumn: 'date',
              method: 'byYear'
            }
          }
        }
      });

    // Aggregate by location
    const locationAggregation = await xata.db.events
      .filter({
        date: {
          $ge: startDate,
          $le: endDate
        }
      })
      .aggregate({
        eventsByLocation: {
          count: {
            groupBy: 'location'
          }
        }
      });

    return {
      total: timeSeriesAggregation.aggs.eventsByYear.reduce(
        (sum, item) => sum + item.count, 0
      ),
      categoryDistribution: categoryAggregation.aggs.categoryDistribution,
      timeseriesData: timeSeriesAggregation.aggs.eventsByYear,
      locationData: locationAggregation.aggs.eventsByLocation,
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