"use server";
import { UAPMonitorService } from "@/services/sightings/uap-monitor";
import { getSightingsGeoJSON } from "@/services/sightings/uap-sighting";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod"
export const getFullSightingsPayload = async () => {
	const monitor = new UAPMonitorService();

	// console.log( "🚀 ~ file: route.ts:12 ~ GET ~ monitor:", monitor )

	const realtimeSightings = await monitor.getAllSightings();

	// console.log( "🚀 ~ file: route.ts:16 ~ GET ~ sightings:", realtimeSightings )

	const geoJSONSightings = await getSightingsGeoJSON();

	console.log(
		"🚀 ~ file: sightings.ts:17 ~ getSightings ~ geoJSONSightings:",
		geoJSONSightings,
	);

	return { realtimeSightings: {}, geoJSONSightings };
};
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
    | "date";
// Sightings Analysis Type Definitions
export type SightingsAnalysisResult = {
  text: string; // Overall analysis text
  geographicClusters: GeoCluster[];
  temporalPatterns: TemporalPattern[];
  shapePatterns: ShapePattern[];
  anomalies: Anomaly[];
  correlations: Correlation[];
}

export type GeoCluster = {
  region: string;
  latitude?: number;
  longitude?: number;
  sightingCount: number;
  significance: string;
}

export type TemporalPattern = {
  pattern: string;
  timeframe: string;
  frequency: number;
  description: string;
}

export type ShapePattern = {
  shape: string;
  occurrences: number;
  associatedBehaviors: string[];
  notes?: string;
}

export type Anomaly = {
  description: string;
  location?: string;
  date?: string;
  significance: string;
  confidence: number;
}

export type Correlation = {
  pointOfInterest: string;
  poiType: string;
  sightingCount: number;
  distance: string;
  significance: string;
}

/**
 * Analyzes UFO sightings data to identify patterns, trends, and anomalies
 * 
 * @param sightingsData - Array of UFO sighting records to analyze
 * @returns Analysis results with text insights and structured data for visualization
 */
export const analyzeSightingsData = async (sightingsData: any[]): Promise<{ 
  analysis: SightingsAnalysisResult; 
  streamingValue: any;
}> => {
  if (!sightingsData || !Array.isArray(sightingsData) || sightingsData.length === 0) {
    throw new Error("Invalid or empty sightings data provided");
  }

  try {
    // Prepare sightings data summary for the AI prompt
    const sightingsSummary = prepareSightingsDataSummary(sightingsData);

    // Define the analysis schema
    const analysisSchema = z.object({
      text: z.string(),
      geographicClusters: z.array(
        z.object({
          region: z.string(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          sightingCount: z.number(),
          significance: z.string(),
        })
      ),
      temporalPatterns: z.array(
        z.object({
          pattern: z.string(),
          timeframe: z.string(),
          frequency: z.number(),
          description: z.string(),
        })
      ),
      shapePatterns: z.array(
        z.object({
          shape: z.string(),
          occurrences: z.number(),
          associatedBehaviors: z.array(z.string()),
          notes: z.string().optional(),
        })
      ),
      anomalies: z.array(
        z.object({
          description: z.string(),
          location: z.string().optional(),
          date: z.string().optional(),
          significance: z.string(),
          confidence: z.number(),
        })
      ),
      correlations: z.array(
        z.object({
          pointOfInterest: z.string(),
          poiType: z.string(),
          sightingCount: z.number(),
          distance: z.string(),
          significance: z.string(),
        })
      ),
    });

    // Create system prompt for OpenAI
    const systemPrompt = `You are an expert data analyst specializing in UFO/UAP sightings analysis. 
    Analyze the provided UFO sightings data to identify patterns, trends, and anomalies. 
    Focus on the following aspects:
    1. Geographic clusters and hotspots
    2. Temporal patterns (time of day, seasonal variations)
    3. Object shape and behavior patterns
    4. Notable anomalies or outliers
    5. Potential correlations with military bases or other points of interest
    
    Provide a thorough analysis with both general insights and specific observations.`;

    // Create user prompt with the sightings data
    const userPrompt = `Analyze the following UFO sightings data and provide structured insights:\n\n${JSON.stringify(sightingsSummary, null, 2)}`;

    // Create streamable value for incremental updates
    const stream = createStreamableValue();

    // Make the OpenAI API call with streaming
    const { partialObjectStream } = await streamObject({
      model: openai.responses("gpt-4-turbo-preview"), // Using a more capable model for analysis
      system: systemPrompt,
      prompt: userPrompt,
      schema: analysisSchema,
    });

    console.log("🚀 ~ analyzeSightingsData ~ API call initiated");

    // Process the streaming response
    for await (const partialObject of partialObjectStream) {
      console.log("🚀 ~ analyzeSightingsData ~ partialObject update:", 
        Object.keys(partialObject).length);
      stream.update(partialObject);
    }

    stream.done;
    
    // Return both the analysis and the streaming value
    return { 
      analysis: stream.value as SightingsAnalysisResult,
      streamingValue: stream 
    };
  } catch (error) {
    console.error("Error analyzing sightings data:", error);
    throw new Error(`Failed to analyze sightings data: ${error.message}`);
  }
};

/**
 * Prepares a summary of sightings data for AI analysis
 * 
 * @param sightingsData - Raw sightings data array
 * @returns Summarized data suitable for AI analysis
 */
function prepareSightingsDataSummary(sightingsData: any[]): any {
  // Limit the number of full descriptions to avoid token limits
  const MAX_FULL_DESCRIPTIONS = 50;
  
  // Return a processed subset that includes:
  // 1. Key statistics (counts by shape, location, time periods)
  // 2. A sample of descriptions (not all to save tokens)
  // 3. All geographic coordinates for cluster analysis
  // 4. All dates/times for temporal analysis
  
  const summary = {
    totalSightings: sightingsData.length,
    locationData: sightingsData.map(s => ({
      city: s.city || 'Unknown',
      state: s.state || 'Unknown',
      country: s.country || 'Unknown',
      location: s.location || 'Unknown',
      coordinates: s.coordinates || s.geometry?.coordinates || null
    })),
    temporalData: sightingsData.map(s => ({
      date: s.date || 'Unknown',
      reported_date: s.reported_date || 'Unknown',
      duration_seconds: s.duration_seconds || 'Unknown',
      duration_hours_min: s.duration_hours_min || 'Unknown'
    })),
    shapeData: sightingsData.map(s => ({
      shape: s.shape || 'Unknown'
    })),
    // Limit full descriptions to save tokens
    descriptions: sightingsData.slice(0, MAX_FULL_DESCRIPTIONS).map(s => s.description || 'No description'),
  };
  
  return summary;
}
