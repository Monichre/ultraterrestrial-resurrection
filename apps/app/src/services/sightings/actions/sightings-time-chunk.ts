"use server"

import {
	getSightingsByDateRange,
	getSightingsWithCoords,
	aggregateSightingsByShape,
	aggregateSightingsByCity,
} from "@db/postgres"
import { debugLog } from '@/utils/logger'
import { UAPSightingSchema, type ValidatedUAPSighting } from "../uap-sighting"

interface XataRecord {
	id: string
	date?: Date
	description?: string
	city?: string
	state?: string
	country?: string
	shape?: string
	latitude?: number
	longitude?: number
	media_link?: string
	[key: string]: any
}

/**
 * Helper function to convert Xata records to plain objects for serialization
 * Prevents "Only plain objects can be passed to Client Components" errors
 */
function sanitizeXataRecord( record: XataRecord ): Record<string, any> {
	// Create a new plain object with only the data properties
	const sanitized: Record<string, any> = {}

	// Only copy primitive values and simple objects
	for ( const [key, value] of Object.entries( record ) ) {
		// Skip the xata object and any methods
		if ( key === "xata" || typeof value === "function" ) continue

		// Handle date objects
		if ( value instanceof Date ) {
			sanitized[key] = value.toISOString()
		}
		// Skip non-serializable objects (null prototype objects, classes, etc)
		else if (
			typeof value !== "object" ||
			value === null ||
			Array.isArray( value ) ||
			Object.getPrototypeOf( value ) === Object.prototype
		) {
			sanitized[key] = value
		}
	}

	return sanitized
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
	const parts = []
	if ( city ) parts.push( city.toLowerCase() )
	if ( state ) parts.push( state.toLowerCase() )
	if ( country ) parts.push( country.toLowerCase() )

	if ( parts.length === 0 ) return "unknown"
	return parts.join( ", " )
}

/**
 * Fetch sightings within a specified time chunk using Xata's search functionality
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
		const startDate = new Date( Date.UTC( startYear, 0, 1, 0, 0, 0 ) )
		const endDate = new Date( Date.UTC( endYear, 11, 31, 23, 59, 59, 999 ) )

		console.log(
			"🔍 Fetching sightings for year range:",
			startYear,
			"to",
			endYear,
		)
		console.log(
			"🔍 Date range:",
			startDate.toISOString(),
			"to",
			endDate.toISOString(),
		)

		// Use Postgres layer to fetch sightings in date range
		const rawRecords = await getSightingsByDateRange( startDate, endDate, Math.min( limit, 200 ) )

		console.log(
			"🔍 Found sightings records:",
			rawRecords?.length || 0,
			"for year range:",
			startYear,
			"-",
			endYear,
		)

		// Map directly to ValidatedUAPSighting without strict schema validation for debugging
		// This will show us what data we have even if it doesn't match the schema perfectly
		const sightings = rawRecords
			.map( ( record: XataRecord ) => {
				try {
					// Postgres records are plain objects; sanitize for serialization safety
					const serializedRecord = sanitizeXataRecord( record )

					const timestamp = serializedRecord.date
						? new Date( serializedRecord.date )
						: new Date()

					// Check if we have coordinates and log them
					const hasCoordinates =
						serializedRecord.latitude && serializedRecord.longitude
					if ( hasCoordinates ) {
						console.log(
							`🗺️ Sighting ${serializedRecord.id} has coordinates: [${serializedRecord.latitude}, ${serializedRecord.longitude}]`,
						)
					}

					// Construct the sighting object
					const sightingObject = {
						id: serializedRecord.id,
						source: "news", // Default source
						title:
							serializedRecord.description?.substring( 0, 50 ) || "UAP Sighting",
						content: serializedRecord.description || "",
						date: timestamp,
						latitude: serializedRecord.latitude,
						longitude: serializedRecord.longitude,
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
					}

					// Try to parse with schema but don't fail if validation fails
					try {
						return UAPSightingSchema.parse( sightingObject )
					} catch ( validationError ) {
						console.error(
							`Validation error for sighting ${serializedRecord.id}:`,
							validationError,
						)
						// Return the object anyway - we want to preserve data even if not perfectly valid
						return sightingObject as ValidatedUAPSighting
					}
				} catch ( error ) {
					console.error( "Error mapping sighting:", error )
					return null
				}
			} )
			.filter( Boolean ) as ValidatedUAPSighting[]

		// Count and log how many sightings have coordinates
		const sightingsWithCoordinates = sightings.filter(
			( s ) => s.location?.coordinates?.lat && s.location?.coordinates?.lng,
		)
		console.log(
			`🗺️ Found ${sightingsWithCoordinates.length} out of ${sightings.length} sightings with coordinates for mapping`,
		)

		// If no sightings have coordinates for mapping but we need them, try fetching more
		if ( sightingsWithCoordinates.length === 0 && sightings.length > 0 ) {
			console.log(
				"⚠️ No sightings with coordinates found. Fetching a larger batch to find mappable sightings...",
			)

			// Search specifically for records with coordinates using Postgres layer
			const expandedRecords = await getSightingsWithCoords( startDate, endDate, Math.min( limit, 200 ) )

			if ( expandedRecords.length > 0 ) {
				console.log(
					`✅ Found ${expandedRecords.length} mappable sightings with location data`,
				)

				// Add any new records with coordinates to our result
				const additionalSightings = expandedRecords
					.map( ( record: XataRecord ) => {
						try {
							const serializedRecord = sanitizeXataRecord( record )

							const sightingObject = {
								id: serializedRecord.id,
								source: "news",
								title:
									serializedRecord.description?.substring( 0, 50 ) ||
									"UAP Sighting",
								content: serializedRecord.description || "",
								date: serializedRecord.date
									? new Date( serializedRecord.date )
									: new Date(),
								latitude: serializedRecord.latitude,
								longitude: serializedRecord.longitude,
								location: {
									city: serializedRecord.city || undefined,
									state: serializedRecord.state || "Unknown", // Allow any state
									coordinates: {
										lat: serializedRecord.latitude,
										lng: serializedRecord.longitude,
									},
								},
								timestamp: serializedRecord.date
									? new Date( serializedRecord.date )
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
							}

							// Try to parse with schema but don't fail if validation fails
							try {
								return UAPSightingSchema.parse( sightingObject )
							} catch ( validationError ) {
								console.error(
									`Validation error for additional sighting ${serializedRecord.id}:`,
									validationError,
								)
								// Return the object anyway - we want to preserve data even if not perfectly valid
								return sightingObject as ValidatedUAPSighting
							}
						} catch ( error ) {
							console.error( "Error mapping additional sighting:", error )
							return null
						}
					} )
					.filter( Boolean ) as ValidatedUAPSighting[]

				// Combine the results, avoiding duplicates by ID
				const existingIds = new Set( sightings.map( ( s ) => s.id ) )
				const uniqueAdditionalSightings = additionalSightings.filter(
					( s ) => !existingIds.has( s.id ),
				)

				console.log(
					`✅ Adding ${uniqueAdditionalSightings.length} unique sightings with coordinates to the result`,
				)
				sightings.push( ...uniqueAdditionalSightings )
			}
		}

		// Log a sample of the processed sightings to verify structure
		if ( sightings.length > 0 ) {
			console.log( "🔍 Sample of processed sightings:", sightings.slice( 0, 2 ) )
		} else {
			console.log( "⚠️ No sightings were processed from records after mapping!" )
		}

		console.log(
			"🔍 Mapped",
			sightings.length,
			"sightings for",
			startYear,
			"-",
			endYear,
		)

		return sightings
	} catch ( error ) {
		console.error( "Error fetching sightings by time chunk:", error )
		console.error(
			"Stack trace:",
			error instanceof Error ? error.stack : "No stack trace",
		)
		return []
	}
}

/**
 * Get aggregate statistics for sightings based on time range
 * Uses Xata's search functionality with aggregation to efficiently compute stats
 * @param startDate Starting date for the query (optional, defaults to Jan 1 of startYear)
 * @param endDate Ending date for the query (optional, defaults to Dec 31 of endYear)
 * @param startYear Starting year for the query (used if startDate not provided)
 * @param endYear Ending year for the query (used if endDate not provided)
 */
export async function getSightingsStats(
	startDateOrYear: Date | number = 1940,
	endDateOrYear: Date | number = new Date().getFullYear(),
): Promise<{
	totalSightings: number
	byType: Record<string, number>
	byYear: Record<string, number>
	byLocation: Record<string, number>
	timeRange: {
		startYear: number
		endYear: number
	}
}> {
	// Initialize these variables at the top level to ensure they're in scope for error handler
	let startYear: number
	let endYear: number

	if ( startDateOrYear instanceof Date ) {
		startYear = startDateOrYear.getFullYear()
	} else {
		startYear = startDateOrYear
	}

	if ( endDateOrYear instanceof Date ) {
		endYear = endDateOrYear.getFullYear()
	} else {
		endYear = endDateOrYear
	}

	try {
		// Handle date or year parameters
		let startDate: Date
		let endDate: Date

		if ( startDateOrYear instanceof Date ) {
			startDate = startDateOrYear
		} else {
			startDate = new Date( Date.UTC( startYear, 0, 1, 0, 0, 0 ) )
		}

		if ( endDateOrYear instanceof Date ) {
			endDate = endDateOrYear
		} else {
			endDate = new Date( Date.UTC( endYear, 11, 31, 23, 59, 59, 999 ) )
		}

		// Ensure we don't query future years beyond the current year
		const currentYear = new Date().getFullYear()
		const maxAllowedYear = Math.min( endYear, currentYear )

		if ( endYear > currentYear ) {
			endDate = new Date( Date.UTC( currentYear, 11, 31, 23, 59, 59, 999 ) )
		}

		console.log(
			"🔍 Using date range for stats:",
			startDate.toISOString(),
			"to",
			endDate.toISOString(),
		)

		// Use Postgres aggregation functions
		const [shapeAggs, cityAggs, sampleRecords] = await Promise.all( [
			aggregateSightingsByShape( startDate, endDate, 20 ),
			aggregateSightingsByCity( startDate, endDate, 30 ),
			getSightingsByDateRange( startDate, endDate, 200 ),
		] )

		console.log( "🔍 Postgres aggregation results: shapes, cities, sample records fetched" )

		// Format into expected return structure
		const shapeCounts: Record<string, number> = {}
		const yearCounts: Record<string, number> = {}
		const locationCounts: Record<string, number> = {}

		// First initialize all years in the range with zero counts for complete timeseries
		for ( let year = startYear; year <= maxAllowedYear; year++ ) {
			yearCounts[year.toString()] = 0
		}

		console.log(
			`📊 Got ${sampleRecords.length} sample records for year counting`,
		)

		// Count years from records
		for ( const record of sampleRecords ) {
			if ( record.date ) {
				const year = new Date( record.date ).getFullYear()
				if ( year >= startYear && year <= maxAllowedYear ) {
					yearCounts[year.toString()] =
						( yearCounts[year.toString()] || 0 ) + 1
				}
			}
		}

		// Process shapes from aggregation
		for ( const { shape, count } of shapeAggs ) {
			if ( shape ) {
				shapeCounts[shape.toLowerCase()] = count
			}
		}

		// Process locations from aggregation
		for ( const { city, count } of cityAggs ) {
			if ( city ) {
				const normalizedLocation = city.toLowerCase()
				if ( normalizedLocation !== "unknown" ) {
					locationCounts[normalizedLocation] = count
				}
			}
		}

		// Get total count from year sums
		const totalSightings = Object.values( yearCounts ).reduce( ( a, b ) => a + b, 0 )

		console.log( "📊 Year distribution:", yearCounts )
		console.log( "📊 Shape distribution:", shapeCounts )
		console.log( "📊 Location distribution:", locationCounts )

		return {
			totalSightings,
			byType: shapeCounts,
			byYear: yearCounts,
			byLocation: locationCounts,
			timeRange: {
				startYear,
				endYear: maxAllowedYear,
			},
		}
	} catch ( error ) {
		console.error( "Error fetching sightings stats:", error )
		console.error(
			"Aggregation error details:",
			error instanceof Error ? error.message : "Unknown error",
			"\nStack trace:",
			error instanceof Error ? error.stack : "No stack trace",
		)
		return {
			totalSightings: 0,
			byType: {},
			byYear: {},
			byLocation: {},
			timeRange: {
				startYear,
				endYear,
			},
		}
	}
}

/**
 * Fetch sightings records within a specified time range without aggregation
 * Focused only on retrieving the actual records efficiently
 * @param startDate Starting date for the query (optional, defaults to Jan 1 of startYear)
 * @param endDate Ending date for the query (optional, defaults to Dec 31 of endYear)
 * @param startYear Starting year for the query (used if startDate not provided)
 * @param endYear Ending year for the query (used if endDate not provided)
 * @param limit Maximum number of records to return
 */
export async function fetchSightingsRecords(
	startDateOrYear: Date | number = 1940,
	endDateOrYear: Date | number = new Date().getFullYear(),
	limit = 500,
): Promise<ValidatedUAPSighting[]> {
	try {
		// Handle date or year parameters
		let startDate: Date
		let endDate: Date

		if ( startDateOrYear instanceof Date ) {
			startDate = startDateOrYear
		} else {
			// If a year was provided, create a date for January 1st of that year
			startDate = new Date( Date.UTC( startDateOrYear, 0, 1, 0, 0, 0 ) )
		}

		if ( endDateOrYear instanceof Date ) {
			endDate = endDateOrYear
		} else {
			// If a year was provided, create a date for December 31st of that year
			endDate = new Date( Date.UTC( endDateOrYear, 11, 31, 23, 59, 59, 999 ) )
		}

		// Ensure we don't query future dates
		const currentDate = new Date()
		if ( endDate > currentDate ) {
			endDate = currentDate
		}

		console.log(
			"🔍 Fetching sightings records for time range:",
			startDate.toISOString(),
			"to",
			endDate.toISOString(),
		)

		// Use Postgres layer to fetch sightings records
		const rawRecords = await getSightingsByDateRange( startDate, endDate, limit )

		console.log(
			`🔍 Retrieved ${rawRecords.length} sightings records`,
		)

		// Map records to ValidatedUAPSighting format
		const sightings = rawRecords
			.map( ( record: XataRecord ) => {
				try {
					// Postgres records are plain objects; sanitize for serialization safety
					const serializedRecord = sanitizeXataRecord( record )

					const timestamp = serializedRecord.date
						? new Date( serializedRecord.date )
						: new Date()

					// Check if we have coordinates and log them
					const hasCoordinates =
						serializedRecord.latitude && serializedRecord.longitude

					// Construct the sighting object
					const sightingObject = {
						id: serializedRecord.id,
						source: "news", // Default source
						title:
							serializedRecord.description?.substring( 0, 50 ) || "UAP Sighting",
						content: serializedRecord.description || "",
						date: timestamp,
						timestamp,
						latitude: serializedRecord.latitude,
						longitude: serializedRecord.longitude,
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
						mediaUrls: serializedRecord.media_link
							? [serializedRecord.media_link]
							: [],
						sourceUrl: serializedRecord.media_link || "",
						category: serializedRecord.shape ? [serializedRecord.shape] : [],
						confidence: "medium", // Default confidence
						type: "sighting", // Default type
					}

					// Try to parse with schema but don't fail if validation fails
					try {
						return UAPSightingSchema.parse( sightingObject )
					} catch ( validationError ) {
						console.error(
							`Validation error for sighting ${serializedRecord.id}:`,
							validationError,
						)
						// Return the object anyway - we want to preserve data even if not perfectly valid
						return sightingObject as ValidatedUAPSighting
					}
				} catch ( error ) {
					console.error( "Error mapping sighting:", error )
					return null
				}
			} )
			.filter( Boolean ) as ValidatedUAPSighting[]

		// Log results and return
		console.log( `✅ Successfully mapped ${sightings.length} sightings` )

		// If we need more records with coordinates, we could fetch them here
		const mappableSightings = sightings.filter(
			( s ) => s.location?.coordinates?.lat && s.location?.coordinates?.lng,
		)

		console.log(
			`📍 Found ${mappableSightings.length}/${sightings.length} sightings with coordinates`,
		)

		return sightings
	} catch ( error ) {
		console.error( "Error fetching sightings records:", error )
		return []
	}
}

/**
 * Fetch a paginated batch of sightings data with time ranges
 * @param timeRanges Array of time ranges (can contain Date objects or year numbers)
 * @param limit Maximum records per time range
 */
export async function getSightingsBatched(
	timeRanges: Array<
		{ startYear: number; endYear: number } | { startDate: Date; endDate: Date }
	>,
	limit = 500,
): Promise<{
	sightings: ValidatedUAPSighting[]
	stats: {
		totalSightings: number
		byType: Record<string, number>
		byYear: Record<string, number>
		byLocation: Record<string, number>
		timeRange: {
			startYear: number
			endYear: number
		}
	}
}> {
	try {
		debugLog(
			"🔍 getSightingsBatched called with time ranges:",
			timeRanges,
			"and limit:",
			limit,
		)

		// Determine overall date range from the provided time ranges
		let startYear = Number.MAX_SAFE_INTEGER
		let endYear = Number.MIN_SAFE_INTEGER
		let startDate: Date | null = null
		let endDate: Date | null = null

		// Process all time ranges to find the overall bounds
		for ( const range of timeRanges ) {
			if ( "startYear" in range && "endYear" in range ) {
				// Year-based range
				startYear = Math.min( startYear, range.startYear )
				endYear = Math.max( endYear, range.endYear )

				// Also update date bounds if we have them
				const rangeStartDate = new Date(
					Date.UTC( range.startYear, 0, 1, 0, 0, 0 ),
				)
				const rangeEndDate = new Date(
					Date.UTC( range.endYear, 11, 31, 23, 59, 59, 999 ),
				)

				if ( !startDate || rangeStartDate < startDate ) {
					startDate = rangeStartDate
				}

				if ( !endDate || rangeEndDate > endDate ) {
					endDate = rangeEndDate
				}
			} else if ( "startDate" in range && "endDate" in range ) {
				// Date-based range
				const rangeStartYear = range.startDate.getFullYear()
				const rangeEndYear = range.endDate.getFullYear()

				startYear = Math.min( startYear, rangeStartYear )
				endYear = Math.max( endYear, rangeEndYear )

				if ( !startDate || range.startDate < startDate ) {
					startDate = range.startDate
				}

				if ( !endDate || range.endDate > endDate ) {
					endDate = range.endDate
				}
			}
		}

		// Ensure date bounds are set even if no valid ranges were provided
		if ( !startDate ) {
			startDate = new Date( Date.UTC( startYear, 0, 1, 0, 0, 0 ) )
		}

		if ( !endDate ) {
			endDate = new Date( Date.UTC( endYear, 11, 31, 23, 59, 59, 999 ) )
		}

		// Ensure we don't query future dates
		const currentDate = new Date()
		const currentYear = currentDate.getFullYear()
		const maxAllowedYear = Math.min( endYear, currentYear )

		if ( endDate > currentDate ) {
			endDate = currentDate
		}

		debugLog(
			"🔍 Using consolidated date range:",
			startDate.toISOString(),
			"to",
			endDate.toISOString(),
		)

		// Fetch both stats and records in parallel for better performance
		// Use the consolidated date range derived from provided timeRanges
		const [stats, allSightings] = await Promise.all( [
			// Get aggregated statistics for the requested window
			getSightingsStats( startDate, endDate ),

			// Get actual sightings records within the requested window
			fetchSightingsRecords( startDate, endDate, limit ),
		] )

		debugLog( "🚀 ~ allSightings:", allSightings )

		debugLog( "📊 Stats fetched:", stats )
		debugLog( `📄 Fetched ${allSightings.length} sightings records` )

		// Check how many records have mappable coordinates
		const mappableSightings = allSightings.filter(
			( s ) => s.location?.coordinates?.lat && s.location?.coordinates?.lng,
		)

		debugLog(
			`📍 Found ${mappableSightings.length}/${allSightings.length} sightings with coordinates for mapping`,
		)

		// If we don't have many mappable sightings but there are sightings in the database,
		// fetch some specifically with coordinates
		if ( mappableSightings.length < 50 && allSightings.length > 0 ) {
			try {
				debugLog(
					"📍 Fetching additional sightings with coordinates for mapping",
				)

				// Use Postgres layer to fetch sightings with coordinates
				const mappableRaw = await getSightingsWithCoords( startDate!, endDate!, 200 )

				if ( mappableRaw.length > 0 ) {
					debugLog(
						`📍 Found ${mappableRaw.length} additional sightings with coordinates`,
					)

					// Convert to our format
					const additionalMappableSightings = mappableRaw
						.map( ( record: XataRecord ) => {
							try {
								const serializedRecord = sanitizeXataRecord( record )

								const sightingObject = {
									id: serializedRecord.id,
									source: "news",
									title:
										serializedRecord.description?.substring( 0, 50 ) ||
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
										? new Date( serializedRecord.date )
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
								}

								// Try to parse with schema but don't fail if validation fails
								try {
									return UAPSightingSchema.parse( sightingObject )
								} catch ( validationError ) {
									console.error(
										`Validation error for mappable sighting ${serializedRecord.id}:`,
										validationError,
									)
									// Return the object anyway
									return sightingObject as ValidatedUAPSighting
								}
							} catch ( error ) {
								console.error( "Error mapping mappable sighting:", error )
								return null
							}
						} )
						.filter( Boolean ) as ValidatedUAPSighting[]

					// Add to our list, avoiding duplicates
					const existingIds = new Set( allSightings.map( ( s ) => s.id ) )
					const uniqueMappableSightings = additionalMappableSightings.filter(
						( s ) => !existingIds.has( s.id ),
					)

					debugLog(
						`📍 Adding ${uniqueMappableSightings.length} unique mappable sightings to results`,
					)
					allSightings.push( ...uniqueMappableSightings )
				}
			} catch ( mappingError ) {
				console.error(
					"Error fetching additional mappable sightings:",
					mappingError,
				)
			}
		}

		return {
			sightings: allSightings,
			stats,
		}
	} catch ( error ) {
		console.error( "Error fetching batched sightings:", error )
		// Check if the error is a ReferenceError for startYear
		if (
			error instanceof ReferenceError &&
			error.message.includes( "startYear" )
		) {
			console.error(
				"Reference error with startYear. This might be due to a scope issue in the error handler.",
			)
			// Use a fallback value
			const fallbackStartYear = new Date().getFullYear() - 10 // Last 10 years
			const fallbackEndYear = new Date().getFullYear()
			return {
				sightings: [],
				stats: {
					totalSightings: 0,
					byType: {},
					byYear: {},
					byLocation: {},
					timeRange: {
						startYear: fallbackStartYear,
						endYear: fallbackEndYear,
					},
				},
			}
		}
		return {
			sightings: [],
			stats: {
				totalSightings: 0,
				byType: {},
				byYear: {},
				byLocation: {},
				timeRange: {
					// Type-safe access to startYear and endYear with default values
					startYear:
						"startYear" in timeRanges[0]
							? ( timeRanges[0] as { startYear: number } ).startYear
							: ( timeRanges[0] as { startDate: Date } ).startDate.getFullYear(),
					endYear: ( () => {
						const last = timeRanges[timeRanges.length - 1]
						const yr =
							"endYear" in last
								? ( last as { endYear: number } ).endYear
								: ( last as { endDate: Date } ).endDate.getFullYear()
						return Math.min( yr, new Date().getFullYear() )
					} )(),
				},
			},
		}
	}
}
