"use server";

import { xata } from "@/db/xata/client";
import { UAPSightingSchema, type ValidatedUAPSighting } from "../uap-sighting";
import { useState, useRef, useEffect, useCallback } from "react";

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
			.map((record) => {
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
) {
	try {
		// Calculate date range
		const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
		const endDate = new Date(`${endYear}-12-31T23:59:59Z`);

		// Use Xata's summarize for shape distribution
		const shapesAggregation = await xata.db.sightings.summarize({
				filter: {
					date: {
						$ge: startDate,
						$le: endDate,
				},
        	columns: ["shape"],
				summaries: {
					shapeCount: { count: "*" },
				},
			}
			
		

			})

		// Summarize for time series data by year
		const timeSeriesAggregation = await xata.db.sightings.summarize({
      filter: {
				date: {
					$ge: startDate,
					$le: endDate,
				},
				columns: ["date"],
				summaries: {
					yearCount: { count: "*" },
				},
      }
			});
			


		// Summarize by location
    // @ts-ignore
		const locationAggregation = await xata.db.sightings.summarize({
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
		return {
			totalSightings: timeSeriesAggregation.summaries?.yearCount
				? Object.values(timeSeriesAggregation.summaries.yearCount).reduce(
						(sum: number, count: any) => sum + (count as number),
						0
				  )
				: 0,
			byType: shapesAggregation.summaries?.shapeCount || {},
			byYear: timeSeriesAggregation.summaries?.yearCount || {},
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
): Promise<{ sightings: ValidatedUAPSighting[]; stats: any }> {
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
					endYear: timeRanges[timeRanges.length - 1]?.endYear || new Date().getFullYear(),
				},
			},
		};
	}
}

// Configuration for different zoom levels
const ZOOM_LEVEL_CONFIG = {
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
function getZoomConfig(cameraDistance: number) {
	if (cameraDistance > 6) return ZOOM_LEVEL_CONFIG.far;
	if (cameraDistance > 3) return ZOOM_LEVEL_CONFIG.medium;
	return ZOOM_LEVEL_CONFIG.close;
}

// Use this in the Globe component to determine what to render
function renderPoints(sightings, clusters, cameraDistance) {
	const config = getZoomConfig(cameraDistance);

	return (
		<>
			{(config.useAggregates || clusters.length > 0) && (
				<ClusterLayer 
					clusters={clusters.filter(c => c.count >= config.minClusterSize)} 
				/>
			)}
			
			{config.showIndividualPoints && (
				<PointsLayer 
					points={sightings.slice(0, config.maxPointsToShow)} 
				/>
			)}
		</>
	);
}

// Enhanced time animation with aggregated data
function useTimeSeriesWithAggregation(timeRange: [Date, Date]) {
	const [currentTime, setCurrentTime] = useState(timeRange[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [timeData, setTimeData] = useState([]);
	const animationRef = useRef<number | null>(null);

	// Fetch time-based data using aggregation
	useEffect(() => {
		async function fetchTimeData() {
			try {
				const results = await xata.db.sightings.aggregate(
					{
						byDay: {
							count: {
								groupBy: {
									dateColumn: "date",
									method: "byDay",
								},
							},
						},
					},
					{
						filter: {
							date: {
								$ge: timeRange[0],
								$le: timeRange[1],
							},
						},
						consistency: "eventual",
					},
				);

				// Format the time series data
				const formattedData = results.aggs.byDay
					.map((day) => ({
						date: new Date(day.value),
						count: day.count,
					}))
					.sort((a, b) => a.date.getTime() - b.date.getTime());

				setTimeData(formattedData);
			} catch (err) {
				console.error("Error fetching time series data:", err);
			}
		}

		fetchTimeData();
	}, [timeRange]);

	// Animation control functions
	const play = useCallback(() => {
		if (isPlaying) return;

		setIsPlaying(true);
		const startTime = Date.now();
		const timeSpan = timeRange[1].getTime() - timeRange[0].getTime();
		const animationDuration = 10000; // 10 seconds for full animation

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / animationDuration, 1);

			// Calculate current time based on progress
			const currentTimeValue = new Date(
				timeRange[0].getTime() + progress * timeSpan,
			);
			setCurrentTime(currentTimeValue);

			if (progress < 1) {
				animationRef.current = requestAnimationFrame(animate);
			} else {
				setIsPlaying(false);
			}
		};

		animationRef.current = requestAnimationFrame(animate);
	}, [timeRange, isPlaying]);

	const pause = useCallback(() => {
		if (!isPlaying || animationRef.current === null) return;

		cancelAnimationFrame(animationRef.current);
		animationRef.current = null;
		setIsPlaying(false);
	}, [isPlaying]);

	// Cleanup
	useEffect(() => {
		return () => {
			if (animationRef.current !== null) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, []);

	return {
		currentTime,
		isPlaying,
		timeData,
		play,
		pause,
		setCurrentTime,
	};
}
