"use server";

import { xata } from "@/db/xata/client";
import { UAPSightingSchema, type ValidatedUAPSighting } from "../uap-sighting";

// Xata response types - define these based on actual API responses
interface XataAggregationResult {
	aggs?: {
		shapeDistribution?: Array<{
			value: string;
			count: number;
		}>;
		sightingsByYear?: Array<{
			value: string; // Year string like "2020"
			count: number;
		}>;
		sightingsByLocation?: Array<{
			value: string;
			count: number;
		}>;
	};
}

interface XataRecord {
	id: string;
	date?: Date;
	description?: string;
	city?: string;
	state?: string;
	country?: string;
	shape?: string;
	latitude?: number;
	longitude?: number;
	media_link?: string;
	[key: string]: any;
}

/**
 * Helper function to convert Xata records to plain objects for serialization
 * Prevents "Only plain objects can be passed to Client Components" errors
 */
function sanitizeXataRecord(record: XataRecord): Record<string, any> {
	// Create a new plain object with only the data properties
	const sanitized: Record<string, any> = {};

	// Only copy primitive values and simple objects
	for (const [key, value] of Object.entries(record)) {
		// Skip the xata object and any methods
		if (key === "xata" || typeof value === "function") continue;

		// Handle date objects
		if (value instanceof Date) {
			sanitized[key] = value.toISOString();
		}
		// Skip non-serializable objects (null prototype objects, classes, etc)
		else if (
			typeof value !== "object" ||
			value === null ||
			Array.isArray(value) ||
			Object.getPrototypeOf(value) === Object.prototype
		) {
			sanitized[key] = value;
		}
	}

	return sanitized;
}

/**
 * Format a location string consistently with city, state, country
 * @param city The city name
 * @param state The state or province
 * @param country The country name
 * @returns A normalized location string
 */
function formatLocationString(
	city?: string,
	state?: string,
	country?: string,
): string {
	const parts = [];
	if (city) parts.push(city.toLowerCase());
	if (state) parts.push(state.toLowerCase());
	if (country) parts.push(country.toLowerCase());

	if (parts.length === 0) return "unknown";
	return parts.join(", ");
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
		// Calculate date range using UTC for consistent timezone handling
		const startDate = new Date(Date.UTC(startYear, 0, 1, 0, 0, 0));
		const endDate = new Date(Date.UTC(endYear, 11, 31, 23, 59, 59, 999));

		console.log(
			"🔍 Fetching sightings for year range:",
			startYear,
			"to",
			endYear,
		);
		console.log(
			"🔍 Date range:",
			startDate.toISOString(),
			"to",
			endDate.toISOString(),
		);

		// Use Xata's filter to get sightings within date range
		// First get a raw count to verify filtering using aggregate instead of getCount
		const countResult = await xata.db.sightings
			.filter({
				date: {
					$ge: startDate,
					$le: endDate,
				},
			})
			.aggregate({
				totalCount: {
					count: "*",
				},
			});

		const recordsCount = countResult?.aggs?.totalCount || 0;
		console.log("🔍 Count of matching records in date range:", recordsCount);

		if (recordsCount === 0) {
			console.log(
				"🚨 No records found with filter - trying a broader query to debug",
			);

			// Try with a much broader date range as a test
			const veryBroadQuery = await xata.db.sightings
				.filter({
					date: {
						$ge: new Date("1900-01-01"),
						$le: new Date("2099-12-31"),
					},
				})
				.getPaginated({ pagination: { size: 5 } });

			console.log(
				"🔍 Very broad date query results:",
				veryBroadQuery.records.length,
			);

			// Try without date filtering at all but with a limit
			const allSightingsLimit = await xata.db.sightings.getPaginated({
				pagination: { size: limit },
			});

			console.log("🚀 ~ allSightingsLimit:", allSightingsLimit);
			if (allSightingsLimit.records.length > 0) {
				console.log(
					"🔍 Found records without ANY filtering. Count:",
					allSightingsLimit.records.length,
				);

				// Use these records instead since date filtering isn't working
				const mappedSightings = allSightingsLimit.records
					.map((record: XataRecord) => {
						try {
							// Use Xata's built-in serialization
							const serializedRecord = record.toSerializable
								? record.toSerializable()
								: sanitizeXataRecord(record);

							const timestamp = serializedRecord.date
								? new Date(serializedRecord.date)
								: new Date();

							// Construct sighting object
							const sightingObject = {
								id: serializedRecord.id,
								source: "news", // Default source
								title:
									serializedRecord.comments?.substring(0, 50) || "UAP Sighting",
								content: serializedRecord.comments || "",
								location: {
									city: serializedRecord.city || undefined,
									state: serializedRecord.state || "Unknown", // Allow any state
									coordinates:
										serializedRecord.latitude && serializedRecord.longitude
											? {
													lat: serializedRecord.latitude,
													lng: serializedRecord.longitude,
												}
											: undefined,
								},
								timestamp,
								mediaUrls: serializedRecord.media_link
									? [serializedRecord.media_link]
									: [],
								sourceUrl: serializedRecord.media_link || "",
								category: serializedRecord.shape
									? [serializedRecord.shape]
									: [],
								confidence: "medium", // Default confidence
								type: "sighting", // Default type
							};

							// Try to parse with schema but don't fail if validation fails
							try {
								return UAPSightingSchema.parse(sightingObject);
							} catch (validationError) {
								console.error(
									`Validation error for sighting ${serializedRecord.id}:`,
									validationError,
								);
								// Return the object anyway - we want to preserve data even if not perfectly valid
								return sightingObject as ValidatedUAPSighting;
							}
						} catch (error) {
							console.error("Error mapping unfiltered sighting:", error);
							return null;
						}
					})
					.filter(Boolean) as ValidatedUAPSighting[];

				console.log(
					"🔍 Mapped",
					mappedSightings.length,
					"unfiltered sightings",
				);
				if (mappedSightings.length > 0) {
					console.log(
						"🔍 Sample of unfiltered sightings:",
						mappedSightings.slice(0, 2),
					);
				}

				// Return these sightings instead, ignoring date filtering
				return mappedSightings;
			}

			// Return empty array since we confirmed there are no matching records
			return [];
		}

		// @ts-ignore - Xata API types may need updating
		const sightingsRecords = await xata.db.sightings
			.filter({
				date: {
					$ge: startDate,
					$le: endDate
				}
			})
			.sort("date", "desc")
			.getPaginated({
				pagination: {
					size: limit,
				},
			});

		console.log(
			"🔍 Found sightings records:",
			sightingsRecords?.records?.length || 0,
			"for year range:",
			startYear,
			"-",
			endYear,
		);

		// Map directly to ValidatedUAPSighting without strict schema validation for debugging
		// This will show us what data we have even if it doesn't match the schema perfectly
		const sightings = sightingsRecords.records
			.map((record: XataRecord) => {
				try {
					// Use Xata's built-in serialization
					const serializedRecord = record.toSerializable
						? record.toSerializable()
						: sanitizeXataRecord(record);

					const timestamp = serializedRecord.date
						? new Date(serializedRecord.date)
						: new Date();

					// Check if we have coordinates and log them
					const hasCoordinates =
						serializedRecord.latitude && serializedRecord.longitude;
					if (hasCoordinates) {
						console.log(
							`🗺️ Sighting ${serializedRecord.id} has coordinates: [${serializedRecord.latitude}, ${serializedRecord.longitude}]`,
						);
					}

					// Construct the sighting object
					const sightingObject = {
						id: serializedRecord.id,
						source: "news", // Default source
						title:
							serializedRecord.description?.substring(0, 50) || "UAP Sighting",
						content: serializedRecord.description || "",
						location: {
							city: serializedRecord.city || undefined,
							state: serializedRecord.state || "Unknown", // Allow any state
							coordinates: hasCoordinates
								? {
										lat: serializedRecord.latitude,
										lng: serializedRecord.longitude,
									}
								: undefined,
						},
						timestamp,
						mediaUrls: serializedRecord.media_link
							? [serializedRecord.media_link]
							: [],
						sourceUrl: serializedRecord.media_link || "",
						category: serializedRecord.shape ? [serializedRecord.shape] : [],
						confidence: "medium", // Default confidence
						type: "sighting", // Default type
					};

					// Try to parse with schema but don't fail if validation fails
					try {
						return UAPSightingSchema.parse(sightingObject);
					} catch (validationError) {
						console.error(
							`Validation error for sighting ${serializedRecord.id}:`,
							validationError,
						);
						// Return the object anyway - we want to preserve data even if not perfectly valid
						return sightingObject as ValidatedUAPSighting;
					}
				} catch (error) {
					console.error("Error mapping sighting:", error);
					return null;
				}
			})
			.filter(Boolean) as ValidatedUAPSighting[];

		// Count and log how many sightings have coordinates
		const sightingsWithCoordinates = sightings.filter(
			(s) => s.location?.coordinates?.lat && s.location?.coordinates?.lng,
		);
		console.log(
			`🗺️ Found ${sightingsWithCoordinates.length} out of ${sightings.length} sightings with coordinates for mapping`,
		);

		// If no sightings have coordinates for mapping but we need them, try fetching more
		if (sightingsWithCoordinates.length === 0 && sightings.length > 0) {
			console.log(
				"⚠️ No sightings with coordinates found. Fetching a larger batch to find mappable sightings...",
			);
			const expandedRecords = await xata.db.sightings
				.filter("latitude", { $exists: true })
				.filter("longitude", { $exists: true })
				.getPaginated({
					pagination: {
						size: Math.min(limit * 2, 1000), // Increase limit but cap at 1000
					},
				});

			if (expandedRecords.records.length > 0) {
				console.log(
					`✅ Found ${expandedRecords.records.length} mappable sightings with location data`,
				);

				// Add any new records with coordinates to our result
				const additionalSightings = expandedRecords.records
					.map((record: XataRecord) => {
						try {
							const serializedRecord = record.toSerializable
								? record.toSerializable()
								: sanitizeXataRecord(record);

							const sightingObject = {
								id: serializedRecord.id,
								source: "news",
								title:
									serializedRecord.description?.substring(0, 50) ||
									"UAP Sighting",
								content: serializedRecord.description || "",
								location: {
									city: serializedRecord.city || undefined,
									state: serializedRecord.state || "Unknown", // Allow any state
									coordinates: {
										lat: serializedRecord.latitude,
										lng: serializedRecord.longitude,
									},
								},
								timestamp: serializedRecord.date
									? new Date(serializedRecord.date)
									: new Date(),
								mediaUrls: serializedRecord.media_link
									? [serializedRecord.media_link]
									: [],
								sourceUrl: serializedRecord.media_link || "",
								category: serializedRecord.shape
									? [serializedRecord.shape]
									: [],
								confidence: "medium",
								type: "sighting",
							};

							// Try to parse with schema but don't fail if validation fails
							try {
								return UAPSightingSchema.parse(sightingObject);
							} catch (validationError) {
								console.error(
									`Validation error for additional sighting ${serializedRecord.id}:`,
									validationError,
								);
								// Return the object anyway - we want to preserve data even if not perfectly valid
								return sightingObject as ValidatedUAPSighting;
							}
						} catch (error) {
							console.error("Error mapping additional sighting:", error);
							return null;
						}
					})
					.filter(Boolean) as ValidatedUAPSighting[];

				// Combine the results, avoiding duplicates by ID
				const existingIds = new Set(sightings.map((s) => s.id));
				const uniqueAdditionalSightings = additionalSightings.filter(
					(s) => !existingIds.has(s.id),
				);

				console.log(
					`✅ Adding ${uniqueAdditionalSightings.length} unique sightings with coordinates to the result`,
				);
				sightings.push(...uniqueAdditionalSightings);
			}
		}

		// Log a sample of the processed sightings to verify structure
		if (sightings.length > 0) {
			console.log("🔍 Sample of processed sightings:", sightings.slice(0, 2));
		} else {
			console.log("⚠️ No sightings were processed from records after mapping!");
		}

		console.log(
			"🔍 Mapped",
			sightings.length,
			"sightings for",
			startYear,
			"-",
			endYear,
		);

		return sightings;
	} catch (error) {
		console.error("Error fetching sightings by time chunk:", error);
		console.error(
			"Stack trace:",
			error instanceof Error ? error.stack : "No stack trace",
		);
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
		// Calculate date range using UTC dates for consistent timezone handling
		const startDate = new Date(Date.UTC(startYear, 0, 1, 0, 0, 0));
		const endDate = new Date(Date.UTC(endYear, 11, 31, 23, 59, 59, 999));

		// Ensure we don't query future years beyond the current year
		const currentYear = new Date().getFullYear();
		const maxAllowedYear = Math.min(endYear, currentYear);

		console.log(
			"🔍 Using date range:",
			startDate.toISOString(),
			"to",
			endDate.toISOString(),
		);

		// Use Xata's aggregate for efficient querying with proper filtering
		// FIXED: Put the filter before calling aggregate (Method 3 from our test)
		const aggregationResults: XataAggregationResult = await xata.db.sightings
			.filter({
				date: {
					$ge: startDate,
					$le: endDate,
				},
			})
			.aggregate({
				shapeDistribution: {
					topValues: {
						column: "shape",
						size: 20,
					},
				},
				sightingsByLocation: {
					topValues: {
						column: "city",
						size: 30,
					},
				},
			});

		console.log("🔍 Aggregation results:", aggregationResults);

		// Format into expected return structure
		const shapeCounts: Record<string, number> = {};
		const yearCounts: Record<string, number> = {};
		const locationCounts: Record<string, number> = {};

		// Process shape distribution with type-safe iteration
		if (
			aggregationResults.aggs?.shapeDistribution &&
			typeof aggregationResults.aggs.shapeDistribution === "object"
		) {
			// Handle the actual structure returned by Xata
			const shapeDist = aggregationResults.aggs.shapeDistribution as any;
			if (shapeDist.values && Array.isArray(shapeDist.values)) {
				for (const item of shapeDist.values) {
					if (item && item.$key && item.$count) {
						shapeCounts[item.$key.toLowerCase()] = item.$count;
					}
				}
			}
		} else {
			console.log(
				"🔍 Shape distribution is not available or not in expected format:",
				aggregationResults.aggs?.shapeDistribution,
			);
		}

		// Query all sightings to build year distribution and properly formatted location counts
		const sightingsRecords = await xata.db.sightings
			.filter({
				date: {
					$ge: startDate,
					$le: endDate,
				},
			})
			.getAll(["date", "city", "state", "country"]);

		console.log(
			`🔍 Retrieved ${sightingsRecords.length} records for year and location stats`,
		);

		// IMPROVED YEAR COUNTING LOGIC
		// First initialize all years in the range with zero counts for complete timeseries
		for (let year = startYear; year <= maxAllowedYear; year++) {
			yearCounts[year.toString()] = 0;
		}

		// Then count actual records
		for (const record of sightingsRecords) {
			if (record.date) {
				const date = new Date(record.date);
				// Ensure date is valid
				if (!isNaN(date.getTime())) {
					const year = date.getFullYear();

					// Only include years in our required range (avoid future dates)
					if (year >= startYear && year <= maxAllowedYear) {
						const yearStr = year.toString();
						yearCounts[yearStr] = (yearCounts[yearStr] || 0) + 1;
					}
				}
			}
		}

		// Build normalized location counts
		for (const record of sightingsRecords) {
			// Create a normalized location key
			const normalizedLocation = formatLocationString(
				record.city,
				record.state,
				record.country,
			);

			if (normalizedLocation !== "unknown") {
				locationCounts[normalizedLocation] =
					(locationCounts[normalizedLocation] || 0) + 1;
			}
		}

		// Get top 30 locations by count
		const sortedLocations = Object.entries(locationCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 30)
			.reduce(
				(obj, [key, value]) => {
					obj[key] = value;
					return obj;
				},
				{} as Record<string, number>,
			);

		// Calculate total sightings from our records
		const totalSightings = sightingsRecords.length;

		return {
			totalSightings,
			byType: shapeCounts,
			byYear: yearCounts,
			byLocation: sortedLocations,
			timeRange: {
				startYear,
				endYear: maxAllowedYear, // Use the adjusted end year that doesn't include future years
			},
		};
	} catch (error) {
		console.error("Error fetching sightings stats:", error);
		console.error(
			"Aggregation error details:",
			error instanceof Error ? error.message : "Unknown error",
			"\nStack trace:",
			error instanceof Error ? error.stack : "No stack trace",
		);
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
	limit = 500,
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
		console.log(
			"🔍 getSightingsBatched called with time ranges:",
			timeRanges,
			"and limit:",
			limit,
		);

		// Calculate overall date range
		const startYear = Math.min(...timeRanges.map((r) => r.startYear));
		const endYear = Math.max(...timeRanges.map((r) => r.endYear));

		// Ensure we don't query future years
		const currentYear = new Date().getFullYear();
		const maxAllowedYear = Math.min(endYear, currentYear);

		console.log(
			"🔍 Using consolidated year range:",
			startYear,
			"to",
			maxAllowedYear,
		);

		// Optimization: If there's just one time range or the ranges are contiguous,
		// use a single query instead of multiple parallel queries
		let allSightings: ValidatedUAPSighting[];

		// Check if we only have one time range or if we're querying a single continuous period
		if (
			timeRanges.length === 1 ||
			maxAllowedYear - startYear === timeRanges.length - 1
		) {
			console.log("🔍 Using optimized single query approach");
			// Use a single query with the full date range
			allSightings = await getSightingsByTimeChunk(
				startYear,
				maxAllowedYear,
				limit,
			);
			console.log(
				"🔍 Retrieved",
				allSightings.length,
				"sightings in single query",
			);
		} else {
			// Original approach - multiple parallel queries
			console.log("🔍 Using multiple parallel queries");
			const batchPromises = timeRanges.map((range) => {
				// Adjust each range's end year to not exceed current year
				const adjustedEndYear = Math.min(range.endYear, currentYear);
				return getSightingsByTimeChunk(range.startYear, adjustedEndYear, limit);
			});

			// Wait for all queries to complete
			const batchResults = await Promise.all(batchPromises);

			console.log("🔍 Batch results count:", batchResults.length);
			console.log(
				"🔍 Individual batch sizes:",
				batchResults.map((batch) => batch.length),
			);

			// Merge results
			allSightings = batchResults.flat();
			console.log("🔍 Total sightings after merging:", allSightings.length);
		}

		// After we have the sightings, check how many are mappable (have coordinates)
		const mappableSightings = allSightings.filter(
			(s) => s.location?.coordinates?.lat && s.location?.coordinates?.lng,
		);

		console.log(
			`📍 Found ${mappableSightings.length}/${allSightings.length} sightings with coordinates for mapping`,
		);

		// If we don't have many mappable sightings but there are sightings in the database,
		// fetch some specifically with coordinates
		if (mappableSightings.length < 50 && allSightings.length > 0) {
			try {
				console.log(
					"📍 Fetching additional sightings with coordinates for mapping",
				);

				// Calculate date range
				const startDate = new Date(Date.UTC(startYear, 0, 1, 0, 0, 0));
				const endDate = new Date(
					Date.UTC(maxAllowedYear, 11, 31, 23, 59, 59, 999),
				);

				// Query specifically for records with coordinates
				const mappableRecords = await xata.db.sightings
					// Ensure coordinates exist
					.filter("latitude", { $exists: true })
					.filter("longitude", { $exists: true })
					.filter("date", { $ge: startDate, $le: endDate })
					.sort("date", "desc")
					.getPaginated({
						pagination: { size: 500 },
					});

				if (mappableRecords.records.length > 0) {
					console.log(
						`📍 Found ${mappableRecords.records.length} additional sightings with coordinates`,
					);

					// Convert to our format
					const additionalMappableSightings = mappableRecords.records
						.map((record: XataRecord) => {
							try {
								const serializedRecord = record.toSerializable
									? record.toSerializable()
									: sanitizeXataRecord(record);

								const sightingObject = {
									id: serializedRecord.id,
									source: "news",
									title:
										serializedRecord.description?.substring(0, 50) ||
										"UAP Sighting",
									content: serializedRecord.description || "",
									location: {
										city: serializedRecord.city || undefined,
										state: serializedRecord.state || "Unknown", // Allow any state
										coordinates: {
											lat: serializedRecord.latitude,
											lng: serializedRecord.longitude,
										},
									},
									timestamp: serializedRecord.date
										? new Date(serializedRecord.date)
										: new Date(),
									mediaUrls: serializedRecord.media_link
										? [serializedRecord.media_link]
										: [],
									sourceUrl: serializedRecord.media_link || "",
									category: serializedRecord.shape
										? [serializedRecord.shape]
										: [],
									confidence: "medium",
									type: "sighting",
								};

								// Try to parse with schema but don't fail if validation fails
								try {
									return UAPSightingSchema.parse(sightingObject);
								} catch (validationError) {
									console.error(
										`Validation error for mappable sighting ${serializedRecord.id}:`,
										validationError,
									);
									// Return the object anyway
									return sightingObject as ValidatedUAPSighting;
								}
							} catch (error) {
								console.error("Error mapping mappable sighting:", error);
								return null;
							}
						})
						.filter(Boolean) as ValidatedUAPSighting[];

					// Add to our list, avoiding duplicates
					const existingIds = new Set(allSightings.map((s) => s.id));
					const uniqueMappableSightings = additionalMappableSightings.filter(
						(s) => !existingIds.has(s.id),
					);

					console.log(
						`📍 Adding ${uniqueMappableSightings.length} unique mappable sightings to results`,
					);
					allSightings.push(...uniqueMappableSightings);
				}
			} catch (mappingError) {
				console.error(
					"Error fetching additional mappable sightings:",
					mappingError,
				);
			}
		}

		// Try to get stats for the entire date range
		let stats: {
			totalSightings: number;
			byType: Record<string, number>;
			byYear: Record<string, number>;
			byLocation: Record<string, number>;
			timeRange: {
				startYear: number;
				endYear: number;
			};
		};

		try {
			stats = await getSightingsStats(startYear, maxAllowedYear);
			console.log("🔍 Stats from database aggregation:", stats);
		} catch (error) {
			console.error(
				"Error fetching stats from aggregation, calculating manually:",
				error,
			);

			// Calculate stats manually from the sightings data
			const byType: Record<string, number> = {};

			// IMPROVED MANUAL YEAR COUNTING
			// Initialize all years in the range with zero counts
			const byYear: Record<string, number> = {};
			for (let year = startYear; year <= maxAllowedYear; year++) {
				byYear[year.toString()] = 0;
			}

			const byLocation: Record<string, number> = {};

			for (const sighting of allSightings) {
				// By type
				if (sighting.type) {
					byType[sighting.type] = (byType[sighting.type] || 0) + 1;
				}

				// By year - only increment if within our range
				if (sighting.timestamp) {
					const fullYear: number = new Date(sighting.timestamp).getFullYear();
					if (fullYear >= startYear && fullYear <= maxAllowedYear) {
						byYear[fullYear.toString()] =
							(byYear[fullYear.toString()] || 0) + 1;
					}
				}

				// By location - normalize and group by city, state
				const locationKey = formatLocationString(
					sighting.location?.city || undefined,
					sighting.location?.state || undefined,
					undefined, // No country in the sighting object
				);

				if (locationKey !== "unknown") {
					byLocation[locationKey] = (byLocation[locationKey] || 0) + 1;
				}
			}

			stats = {
				totalSightings: allSightings.length,
				byType,
				byYear,
				byLocation,
				timeRange: {
					startYear,
					endYear: maxAllowedYear,
				},
			};
			console.log("🔍 Stats calculated manually:", stats);
		}

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
					endYear: Math.min(
						timeRanges[timeRanges.length - 1]?.endYear ||
							new Date().getFullYear(),
						new Date().getFullYear(),
					),
				},
			},
		};
	}
}