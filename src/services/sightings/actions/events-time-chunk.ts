"use server";

import { xata } from "@/db/xata/client";
import type { EventsRecord } from "@/db/xata/xata";

// Type definitions for aggregation results based on Xata's documentation
interface XataAggregationResult {
	aggs: {
		categoryDistribution?: {
			values: Array<{ $key: string; $count: number }>;
		};
		eventsByYear?: {
			values: Array<{ $key: string; $count: number }>;
		};
	};
}

/**
 * Fetch events within a specified time range, with pagination
 * @param startYear Starting year for the query
 * @param endYear Ending year for the query
 * @param limit Maximum number of records to return
 */
export async function getEventsByTimeChunk(
	startYear = 1940,
	endYear: number = new Date().getFullYear(),
	limit = 100,
) {
	try {
		// Calculate date range
		const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
		const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

		// Use Xata's filter to get events within date range
		const eventsRecords = await xata.db.events
			.filter("date", { $ge: startDate, $le: endDate })
			.sort("date", "desc")
			.getPaginated({
				pagination: {
					size: limit,
				},
			});

		return eventsRecords.records;
	} catch (error) {
		console.error("Error fetching events by time chunk:", error);
		return [];
	}
}

/**
 * Get aggregate statistics for events based on time range
 * Uses Xata's aggregate functionality for efficient computation
 */
export async function getEventsStats(
	startYear = 1940,
	endYear: number = new Date().getFullYear(),
) {
	try {
		// Calculate date range
		const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
		
		// Ensure we don't query future years beyond the current year
		const currentYear = new Date().getFullYear();
		const maxAllowedYear = Math.min(endYear, currentYear);
		const endDate = new Date(`${maxAllowedYear}-12-31T23:59:59Z`);

		console.log("🔍 Events: Using date range:", startDate.toISOString(), "to", endDate.toISOString());

		// Use Xata's aggregate with filtering to ensure valid date ranges
		const categoryAggregation = (await xata.db.events.aggregate({
			categoryDistribution: {
				topValues: {
					column: "category",
					size: 20,
				},
				filter: {
					date: {
						$ge: startDate,
						$le: endDate
					}
				}
			},
		})) as unknown as XataAggregationResult;

		// Get time series data by year with date filters
		const timeSeriesAggregation = (await xata.db.events.aggregate({
			eventsByYear: {
				dateHistogram: {
					column: "date",
					calendarInterval: "year",
				},
				filter: {
					date: {
						$ge: startDate,
						$le: endDate
					}
				}
			},
		})) as unknown as XataAggregationResult;

		// Fetch all events to process location data with coordinates
		const eventsRecords = await xata.db.events
			.filter("date", { $ge: startDate, $le: endDate })
			.getAll();

		// Process location data to include coordinates
		const locationGroups = new Map<
			string,
			{
				location: string;
				coordinates: { lat: number; lng: number } | null;
				count: number;
			}
		>();

		for (const event of eventsRecords) {
			// Create a composite key that represents this location
			const locationKey = event.location || "Unknown";

			// Initialize the group if it doesn't exist
			if (!locationGroups.has(locationKey)) {
				locationGroups.set(locationKey, {
					location: locationKey,
					coordinates:
						event.latitude && event.longitude
							? { lat: event.latitude, lng: event.longitude }
							: null,
					count: 0,
				});
			}

			// Increment the count
			const group = locationGroups.get(locationKey);
			if (group) {
				group.count++;

				// Update coordinates if they exist on this record but not in the group
				if (!group.coordinates && event.latitude && event.longitude) {
					group.coordinates = { lat: event.latitude, lng: event.longitude };
				}
			}
		}

		// Convert map to array for the response
		const locationData = Array.from(locationGroups.values());

		// After getting the timeSeriesAggregation, add a normalization step for the dates
		const normalizedTimeSeriesData =
			timeSeriesAggregation.aggs.eventsByYear?.values.map((item) => {
				// Check if the date appears to be missing the millennium or is in the future
				if (item.$key && typeof item.$key === "string") {
					try {
						const dateStr = item.$key;
						const parsedDate = new Date(dateStr);
						const year = parsedDate.getFullYear();
						const currentYear = new Date().getFullYear();

						// Filter out future dates beyond next year (allow some buffer)
						if (year > currentYear + 1) {
							console.log(`⚠️ Filtering out future date: ${dateStr} (year ${year})`);
							return {
								value: dateStr,
								count: 0, // Set count to 0 to exclude from visualizations
							};
						}

						// If we got a very old year (like 196 instead of 1996 or 2196)
						// assume it's a modern date missing the millennium
						if (year < 1000) {
							// Determine if this should be 1900s or 2000s based on the original 2-digit year
							let correctedYear;
							if (year < 70) {
								correctedYear = 2000 + year; // 0-69 -> 2000-2069
							} else {
								correctedYear = 1900 + year; // 70-99 -> 1970-1999
							}

							// Create new date with corrected year
							const correctedDate = new Date(parsedDate);
							correctedDate.setFullYear(correctedYear);

							console.log(
								`🔄 Corrected malformed date: ${dateStr} → ${correctedDate.toISOString()}`,
							);

							return {
								value: correctedDate.toISOString(),
								count: item.$count,
							};
						}
					} catch (error) {
						console.error(`Error fixing malformed date: ${item.$key}`, error);
					}
				}

				// If no correction needed or if correction failed, return original
				return {
					value: item.$key,
					count: item.$count,
				};
			}) || [];

		// Filter out any future dates beyond current year + 1
		const filteredTimeSeriesData = normalizedTimeSeriesData.filter(item => {
			try {
				const date = new Date(item.value);
				const year = date.getFullYear();
				const currentYear = new Date().getFullYear();
				return year <= currentYear + 1;
			} catch (e) {
				// If we can't parse the date, keep the item
				return true;
			}
		});

		// Log the corrections for debugging
		if (filteredTimeSeriesData.length > 0) {
			console.log(
				`📅 Original first date: ${timeSeriesAggregation.aggs.eventsByYear?.values[0]?.$key}`,
			);
			console.log(
				`📅 Normalized first date: ${filteredTimeSeriesData[0].value}`,
			);
			console.log(
				`📅 Date counts: ${filteredTimeSeriesData.map((d) => d.count).join(", ")}`,
			);
		}

		// Create a complete timeseries with all years in the range
		// First, convert the filtered data to a map for easy lookup
		const yearCountMap: Record<number, number> = {};
		filteredTimeSeriesData.forEach(item => {
			try {
				const date = new Date(item.value);
				const year = date.getFullYear();
				yearCountMap[year] = item.count;
			} catch (e) {
				console.error(`Error parsing date: ${item.value}`, e);
			}
		});

		// Create a complete timeseries with all years in the range
		const completeTimeseriesData = [];
		for (let year = startYear; year <= maxAllowedYear; year++) {
			// If we have data for this year, use it; otherwise, set count to 0
			const count = yearCountMap[year] || 0;
			
			// Create an ISO date string for this year (January 1st)
			const dateStr = new Date(Date.UTC(year, 0, 1)).toISOString();
			
			completeTimeseriesData.push({
				value: dateStr,
				count: count
			});
		}

		return {
			total: (timeSeriesAggregation.aggs.eventsByYear?.values || []).reduce(
				(sum: number, item) => sum + item.$count,
				0,
			),
			categoryDistribution:
				categoryAggregation.aggs.categoryDistribution?.values.map((item) => ({
					value: item.$key,
					count: item.$count,
				})) || [],
			timeseriesData: completeTimeseriesData, // Use the complete timeseries data with all years
			locationData,
			timeRange: {
				startYear,
				endYear: maxAllowedYear, // Use the adjusted end year that doesn't include future years
			},
		};
	} catch (error) {
		console.error("Error fetching events stats:", error);
		return {
			total: 0,
			categoryDistribution: [],
			timeseriesData: [],
			locationData: [],
			timeRange: {
				startYear,
				endYear: Math.min(endYear, new Date().getFullYear()),
			},
		};
	}
}

/**
 * Fetch a paginated batch of events data with time ranges
 * @param timeRanges Array of time ranges to query
 * @param limit Maximum records per time range
 */
export async function getEventsBatched(
	timeRanges: { startYear: number; endYear: number }[],
	limit = 50,
) {
	try {
		// Ensure we don't query future years
		const currentYear = new Date().getFullYear();
		
		// Process batches in parallel
		const batchPromises = timeRanges.map((range) => {
			// Adjust each range's end year to not exceed current year
			const adjustedEndYear = Math.min(range.endYear, currentYear);
			return getEventsByTimeChunk(range.startYear, adjustedEndYear, limit);
		});

		// Stats for the full range
		const startYear = Math.min(...timeRanges.map((r) => r.startYear));
		const endYear = Math.max(...timeRanges.map((r) => r.endYear));
		const maxAllowedYear = Math.min(endYear, currentYear);
		
		const statsPromise = getEventsStats(startYear, maxAllowedYear);

		// Wait for all promises to resolve
		const [batchResults, stats] = await Promise.all([
			Promise.all(batchPromises),
			statsPromise,
		]);

		// Merge all batches
		const allEvents = batchResults.flat();

		return {
			events: allEvents,
			stats,
		};
	} catch (error) {
		console.error("Error fetching batched events:", error);
		return {
			events: [],
			stats: null,
		};
	}
}