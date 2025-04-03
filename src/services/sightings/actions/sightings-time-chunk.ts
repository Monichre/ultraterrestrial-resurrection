"use server";

import { xata } from "@/db/xata/client";
import { UAPSightingSchema, type ValidatedUAPSighting } from "../uap-sighting";

// Xata response types - define these based on actual API responses
interface XataAggregationResult {
	summaries?: {
		yearCount?: Record<string, number>;
		shapeCount?: Record<string, number>;
		cityCount?: Record<string, number>;
	};
}

interface XataRecord {
	id: string;
	date?: Date;
	description?: string;
	city?: string;
	shape?: string;
	latitude?: number;
	longitude?: number;
	media_link?: string;
	[key: string]: any;
}

/**
 * Fetch sightings within a specified time chunk using Xata's aggregate functionality
 * @param startYear Starting year for the query
 * @param endYear Ending year for the query
 * @param limit Maximum number of records to return
 */
export async function getSightingsByTimeChunk(
	startYear = 1940,
	endYear: number = new Date().getFullYear(),
	limit = 100,
): Promise<ValidatedUAPSighting[]> {
	try {
		// Calculate date range
		const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
		const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

		// Use Xata's filter to get sightings within date range
		// @ts-ignore - Xata API types may need updating
		const sightingsRecords = await xata.db.sightings
			.filter({
				date: {
					$ge: startDate,
					$le: endDate,
				},
			})
			.sort("date", "desc")
			.getPaginated({
				pagination: {
					size: limit,
				},
			});

		// Convert to ValidatedUAPSighting format
		const sightings = sightingsRecords.records
			.map((record: XataRecord) => {
				// Transform from Xata format to UAPSighting format
				const transformed = {
					id: record.id,
					source: "news", // Default source
					title: record.description?.substring(0, 50) || "UAP Sighting",
					content: record.description || "",
					location: {
						city: record.city || undefined,
						state: "NJ", // Default for now
						coordinates:
							record.latitude && record.longitude
								? {
										lat: record.latitude,
										lng: record.longitude,
									}
								: undefined,
					},
					timestamp: record.date || new Date(),
					mediaUrls: record.media_link ? [record.media_link] : [],
					sourceUrl: record.media_link || "",
					category: record.shape ? [record.shape] : [],
					confidence: "medium", // Default confidence
					type: "sighting", // Default type
				};

				// Validate with schema
				try {
					return UAPSightingSchema.parse(transformed);
				} catch (error) {
					console.error("Schema validation error:", error);
					return null;
				}
			})
			.filter(Boolean) as ValidatedUAPSighting[];

		return sightings;
	} catch (error) {
		console.error("Error fetching sightings by time chunk:", error);
		return [];
	}
}

/**
 * Get aggregate statistics for sightings based on time range
 * Uses Xata's aggregate functionality to efficiently compute stats
 */
export async function getSightingsStats(
	startYear = 1940,
	endYear: number = new Date().getFullYear(),
): Promise<{
	totalSightings: number;
	byType: Record<string, number>;
	byYear: Record<string, number>;
	byLocation: Record<string, number>;
	timeRange: {
		startYear: number;
		endYear: number;
	};
}> {
	try {
		// Calculate date range
		const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
		const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

		// Use Xata's summarize for shape distribution
		// @ts-ignore - Xata API types may need updating
		const shapesAggregation: XataAggregationResult =
			await xata.db.sightings.summarize({
				filter: {
					date: {
						$ge: startDate,
						$le: endDate,
					},
				},
				columns: ["shape"],
				summaries: {
					shapeCount: { count: "*" },
				},
			});

		// Summarize for time series data by year
		// @ts-ignore - Xata API types may need updating
		const timeSeriesAggregation: XataAggregationResult =
			await xata.db.sightings.summarize({
				filter: {
					date: {
						$ge: startDate,
						$le: endDate,
					},
				},
				columns: ["date"],
				summaries: {
					yearCount: { count: "*" },
				},
			});

		// Summarize by location
		// @ts-ignore - Xata API types may need updating
		const locationAggregation: XataAggregationResult =
			await xata.db.sightings.summarize({
				filter: {
					date: {
						$ge: startDate,
						$le: endDate,
					},
				},
				columns: ["city"],
				summaries: {
					cityCount: { count: "*" },
				},
			});

		// Process and return the aggregated data
		const yearCounts = timeSeriesAggregation.summaries?.yearCount || {};
		let totalSightings = 0;

		// Calculate total sightings
		Object.values(yearCounts).forEach((count) => {
			totalSightings += count;
		});

		return {
			totalSightings,
			byType: shapesAggregation.summaries?.shapeCount || {},
			byYear: yearCounts,
			byLocation: locationAggregation.summaries?.cityCount || {},
			timeRange: {
				startYear,
				endYear,
			},
		};
	} catch (error) {
		console.error("Error fetching sightings stats:", error);
		return {
			totalSightings: 0,
			byType: {},
			byYear: {},
			byLocation: {},
			timeRange: {
				startYear,
				endYear,
			},
		};
	}
}

/**
 * Fetch a paginated batch of sightings data with time ranges
 * @param timeRanges Array of time ranges to query
 * @param limit Maximum records per time range
 */
export async function getSightingsBatched(
	timeRanges: { startYear: number; endYear: number }[],
	limit = 50,
): Promise<{
	sightings: ValidatedUAPSighting[];
	stats: {
		totalSightings: number;
		byType: Record<string, number>;
		byYear: Record<string, number>;
		byLocation: Record<string, number>;
		timeRange: {
			startYear: number;
			endYear: number;
		};
	};
}> {
	try {
		// Process batches in parallel
		const batchPromises = timeRanges.map((range) =>
			getSightingsByTimeChunk(range.startYear, range.endYear, limit),
		);

		// Stats for the full range
		const startYear = Math.min(...timeRanges.map((r) => r.startYear));
		const endYear = Math.max(...timeRanges.map((r) => r.endYear));
		const statsPromise = getSightingsStats(startYear, endYear);

		// Wait for all promises to resolve
		const [batchResults, stats] = await Promise.all([
			Promise.all(batchPromises),
			statsPromise,
		]);

		// Merge all batches
		const allSightings = batchResults.flat();

		return {
			sightings: allSightings,
			stats,
		};
	} catch (error) {
		console.error("Error fetching batched sightings:", error);
		return {
			sightings: [],
			stats: {
				totalSightings: 0,
				byType: {},
				byYear: {},
				byLocation: {},
				timeRange: {
					startYear: timeRanges[0]?.startYear || 1940,
					endYear:
						timeRanges[timeRanges.length - 1]?.endYear ||
						new Date().getFullYear(),
				},
			},
		};
	}
}

// Configuration for different zoom levels
export const ZOOM_LEVEL_CONFIG = {
	far: {
		// When zoomed out, only show clusters
		showIndividualPoints: false,
		minClusterSize: 1,
		useAggregates: true,
	},
	medium: {
		// At medium zoom, show larger clusters and some individual points
		showIndividualPoints: true,
		minClusterSize: 3,
		maxPointsToShow: 200,
		useAggregates: true,
	},
	close: {
		// When zoomed in, show all individual points in the view
		showIndividualPoints: true,
		minClusterSize: 5,
		maxPointsToShow: 500,
		useAggregates: false,
	},
};

// Select rendering strategy based on camera distance
export function getZoomConfig(cameraDistance: number) {
	if (cameraDistance > 6) return ZOOM_LEVEL_CONFIG.far;
	if (cameraDistance > 3) return ZOOM_LEVEL_CONFIG.medium;
	return ZOOM_LEVEL_CONFIG.close;
}
