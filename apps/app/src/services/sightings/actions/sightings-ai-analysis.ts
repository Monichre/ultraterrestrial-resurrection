"use server"
import { UAPMonitorService } from "@/services/sightings/uap-monitor"
// import { getSightingsGeoJSON } from "@/services/sightings/uap-sighting";
import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { createStreamableValue } from "@ai-sdk/rsc"
import { z } from "zod"
export const getFullSightingsPayload = async () => {
	const monitor = new UAPMonitorService()

	// console.log( "🚀 ~ file: route.ts:12 ~ GET ~ monitor:", monitor )

	// const realtimeSightings = await monitor.getAllSightings();

	// console.log( "🚀 ~ file: route.ts:16 ~ GET ~ sightings:", realtimeSightings )

	// const geoJSONSightings = await getSightingsGeoJSON();

	// console.log(
	// 	"🚀 ~ file: sightings.ts:17 ~ getSightings ~ geoJSONSightings:",
	// 	geoJSONSightings,
	// );

	// return { realtimeSightings: {}, geoJSONSightings };
}
type SightingProperty =
	| "city"
	| "state"
	| "country"
	| "location"
	| "shape"
	| "duration_seconds"
	| "duration_hours_min"
	| "description"
	| "reported_date"
	| "video"
	| "image"
	| "date"
// Sightings Analysis Type Definitions
export type SightingsAnalysisResult = {
	text: string // Overall analysis text
	geographicClusters: GeoCluster[]
	temporalPatterns: TemporalPattern[]
	shapePatterns: ShapePattern[]
	anomalies: Anomaly[]
	correlations: Correlation[]
}

export type GeoCluster = {
	region: string
	latitude?: number
	longitude?: number
	sightingCount: number
	significance: string
}

export type TemporalPattern = {
	pattern: string
	timeframe: string
	frequency: number
	description: string
}

export type ShapePattern = {
	shape: string
	occurrences: number
	associatedBehaviors: string[]
	notes?: string
}

export type Anomaly = {
	description: string
	location?: string
	date?: string
	significance: string
	confidence: number
}

export type Correlation = {
	pointOfInterest: string
	poiType: string
	sightingCount: number
	distance: string
	significance: string
}

// Define interfaces for sightings and events
export interface SightingData {
	id: string
	title?: string
	content: string
	location: {
		city?: string
		state: string
		coordinates?: {
			lat: number
			lng: number
		}
	}
	timestamp: Date
	shape?: string
	category?: string[]
	mediaUrls?: string[]
	sourceUrl?: string
	confidence?: "high" | "medium" | "low"
	type?: "sighting" | "incident" | "news" | "analysis"
}

export interface EventData {
	id: string
	title?: string
	name?: string
	description: string
	date: Date
	location?: string
	latitude?: number
	longitude?: number
	category?: string
}

/**
 * Analyzes both UFO sightings and events data to identify patterns, trends, and anomalies
 *
 * @param sightingsData - Array of sightings records to analyze
 * @param eventsData - Array of events records to analyze
 * @returns Analysis results with text insights and structured data for visualization
 */
export const analyzeSightingsData = async (
	sightingsData: SightingData[],
	eventsData: EventData[],
): Promise<{
	analysis: SightingsAnalysisResult
	streamingValue: ReturnType<typeof createStreamableValue>
}> => {
	if (
		!sightingsData ||
		!Array.isArray( sightingsData ) ||
		sightingsData.length === 0 ||
		!eventsData ||
		!Array.isArray( eventsData ) ||
		eventsData.length === 0
	) {
		throw new Error( "Invalid or empty data provided" )
	}

	try {
		// Normalize and prepare data for analysis
		const normalizedData = normalizeDataForAnalysis( sightingsData, eventsData )

		// Create a data summary for the AI prompt
		const dataSummary = prepareCombinedDataSummary( normalizedData )

		// Define the analysis schema
		const analysisSchema = z.object( {
			text: z.string(),
			geographicClusters: z.array(
				z.object( {
					region: z.string(),
					latitude: z.number().optional(),
					longitude: z.number().optional(),
					sightingCount: z.number(),
					significance: z.string(),
				} ),
			),
			temporalPatterns: z.array(
				z.object( {
					pattern: z.string(),
					timeframe: z.string(),
					frequency: z.number(),
					description: z.string(),
				} ),
			),
			shapePatterns: z.array(
				z.object( {
					shape: z.string(),
					occurrences: z.number(),
					associatedBehaviors: z.array( z.string() ),
					notes: z.string().optional(),
				} ),
			),
			anomalies: z.array(
				z.object( {
					description: z.string(),
					location: z.string().optional(),
					date: z.string().optional(),
					significance: z.string(),
					confidence: z.number(),
				} ),
			),
			correlations: z.array(
				z.object( {
					pointOfInterest: z.string(),
					poiType: z.string(),
					sightingCount: z.number(),
					distance: z.string(),
					significance: z.string(),
				} ),
			),
		} )

		// Create system prompt for OpenAI
		const systemPrompt = `You are an expert data analyst specializing in UFO/UAP sightings and events analysis. 
    Analyze the provided combined dataset of UFO sightings and related events to identify patterns, trends, and anomalies. 
    Focus on the following aspects:
    1. Geographic clusters and hotspots where both sightings and events occur
    2. Temporal patterns (time of day, seasonal variations, historical trends)
    3. Object shape and behavior patterns in sightings
    4. Notable anomalies or outliers in either sightings or events
    5. Potential correlations between sightings and official events
    
    Provide a thorough analysis with both general insights and specific observations.`

		// Create user prompt with the combined data
		const userPrompt = `Analyze the following combined UFO sightings and events data and provide structured insights:\n\n${JSON.stringify( dataSummary, null, 2 )}`

		// Create streamable value for incremental updates
		const stream = createStreamableValue()

		// Make the OpenAI API call with streaming
		const { partialObjectStream } = await streamObject( {
			model: openai.responses( "gpt-4-turbo-preview" ),
			system: systemPrompt,
			prompt: userPrompt,
			schema: analysisSchema,
		} )

		console.log(
			"🚀 ~ analyzeSightingsData ~ API call initiated for combined data analysis",
		)

		// Process the streaming response
		for await ( const partialObject of partialObjectStream ) {
			console.log(
				"🚀 ~ analyzeSightingsData ~ partialObject update:",
				Object.keys( partialObject ).length,
			)
			stream.update( partialObject )
		}

		stream.done

		// Return both the analysis and the streaming value
		return {
			analysis: stream.value as SightingsAnalysisResult,
			streamingValue: stream,
		}
	} catch ( error ) {
		console.error( "Error analyzing combined data:", error )
		throw new Error(
			`Failed to analyze combined data: ${error instanceof Error ? error.message : String( error )}`,
		)
	}
}

/**
 * Normalize both sightings and events data into a common format for analysis
 *
 * @param sightingsData - Array of sightings data
 * @param eventsData - Array of events data
 * @returns Normalized data array
 */
function normalizeDataForAnalysis(
	sightingsData: SightingData[],
	eventsData: EventData[],
): Array<{
	id: string
	type: "sighting" | "event"
	title: string
	description: string
	date: Date
	location: {
		name: string
		coordinates?: { lat: number; lng: number }
	}
	shape?: string
	category?: string | string[]
	originalItem: SightingData | EventData
}> {
	// Process sightings
	const normalizedSightings = sightingsData.map( ( item ) => {
		return {
			id: item.id,
			type: "sighting" as const,
			title: item.title || "UAP Sighting",
			description: item.content,
			date: item.timestamp,
			location: {
				name: item.location?.city || "Unknown",
				coordinates: item.location?.coordinates,
			},
			shape: item.shape || item.category?.[0],
			category: item.category,
			originalItem: item,
		}
	} )

	// Process events
	const normalizedEvents = eventsData.map( ( item ) => {
		return {
			id: item.id,
			type: "event" as const,
			title: item.title || item.name || "Event",
			description: item.description,
			date: item.date,
			location: {
				name: item.location || "Unknown",
				coordinates:
					item.latitude && item.longitude
						? { lat: item.latitude, lng: item.longitude }
						: undefined,
			},
			category: item.category,
			originalItem: item,
		}
	} )

	// Combine and return
	return [...normalizedSightings, ...normalizedEvents]
}

/**
 * Prepares a summary of combined sightings and events data for AI analysis
 *
 * @param normalizedData - Normalized data array containing both sightings and events
 * @returns Summarized data suitable for AI analysis
 */
function prepareCombinedDataSummary(
	normalizedData: Array<{
		id: string
		type: "sighting" | "event"
		title: string
		description: string
		date: Date
		location: {
			name: string
			coordinates?: { lat: number; lng: number }
		}
		shape?: string
		category?: string | string[]
		originalItem: SightingData | EventData
	}>,
) {
	// Limit the number of full descriptions to avoid token limits
	const MAX_FULL_DESCRIPTIONS = 50

	// Separate sightings and events
	const sightings = normalizedData.filter( ( item ) => item.type === "sighting" )
	const events = normalizedData.filter( ( item ) => item.type === "event" )

	// Create a combined summary
	const summary = {
		totalSightings: sightings.length,
		totalEvents: events.length,
		locationData: normalizedData.map( ( item ) => ( {
			type: item.type,
			location: item.location?.name || "Unknown",
			coordinates: item.location?.coordinates || null,
		} ) ),
		temporalData: normalizedData.map( ( item ) => ( {
			type: item.type,
			date: item.date,
		} ) ),
		shapeData: sightings.map( ( item ) => ( {
			shape: item.shape || "Unknown",
		} ) ),
		categoryData: events.map( ( item ) => ( {
			category: item.category || "Unknown",
		} ) ),
		// Limit full descriptions to save tokens
		descriptions: normalizedData
			.slice( 0, MAX_FULL_DESCRIPTIONS )
			.map( ( item ) => ( {
				type: item.type,
				description: item.description || "No description",
			} ) ),
	}

	return summary
}
