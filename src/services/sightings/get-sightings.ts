import { xata } from '@/db/xata/client';
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
    // Calculate date range
    const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
    const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

    // Use Xata's filter to get sightings within date range
    const sightingsRecords = await xata.db.sightings
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

    // Convert to ValidatedUAPSighting format
    const sightings = sightingsRecords.records.map(record => {
      // Transform from Xata format to UAPSighting format
      const transformed = {
        id: record.id,
        source: 'news', // Default source
        title: record.description?.substring(0, 50) || 'UAP Sighting',
        content: record.description || '',
        location: {
          city: record.city || undefined,
          state: 'NJ', // Default for now
          coordinates: record.latitude && record.longitude 
            ? { 
                lat: record.latitude, 
                lng: record.longitude 
              } 
            : undefined
        },
        timestamp: record.date || new Date(),
        mediaUrls: record.media_link 
          ? [record.media_link] 
          : [],
        sourceUrl: record.media_link || '',
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
 * Uses Xata's aggregate functionality to efficiently compute stats
 */
export async function getSightingsStats(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear()
) {
  try {
    // Calculate date range
    const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
    const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

    // Use Xata's aggregate to get shape distribution
    const shapesAggregation = await xata.db.sightings
      .filter({
        date: {
          $ge: startDate,
          $le: endDate
        }
      })
      .aggregate({
        shapeDistribution: {
          distinctCount: {
            column: 'id',
            groupBy: 'shape'
          }
        }
      });
    
    // Use aggregate for time series data by year
    const timeSeriesAggregation = await xata.db.sightings
      .filter({
        date: {
          $ge: startDate,
          $le: endDate
        }
      })
      .aggregate({
        sightingsByYear: {
          count: {
            groupBy: {
              dateColumn: 'date',
              method: 'byYear'
            }
          }
        }
      });

    // Aggregate by location
    const locationAggregation = await xata.db.sightings
      .filter({
        date: {
          $ge: startDate,
          $le: endDate
        }
      })
      .aggregate({
        sightingsByLocation: {
          count: {
            groupBy: 'city'
          }
        }
      });

    return {
      total: timeSeriesAggregation.aggs.sightingsByYear.reduce(
        (sum, item) => sum + item.count, 0
      ),
      shapeDistribution: shapesAggregation.aggs.shapeDistribution,
      timeseriesData: timeSeriesAggregation.aggs.sightingsByYear,
      locationData: locationAggregation.aggs.sightingsByLocation,
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