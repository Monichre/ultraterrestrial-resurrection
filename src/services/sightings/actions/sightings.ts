"use server";
import { UAPMonitorService } from "@/services/sightings/uap-monitor";
import { getSightingsGeoJSON } from "@/services/sightings/uap-sighting";
import { openai } from "@ai-sdk/openai";
import i streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod"
import { streamObject } from "ai"
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
    
export const analyzeSightingsData = async (prompt, context) => {

    
  const properties: SightingProperty[] = [
    "city",
    "state",
    "country",
    "location",
    "shape",
    "duration_seconds",
    "duration_hours_min",
    "description",
    "reported_date",
    "video",
    "image",
    "date",
  ]
  const schema = z.object({
    id: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    location: z.string().optional(),
    shape: z.string().optional(),
    duration_seconds: z.string().optional(),
    duration_hours_min: z.string().optional(),
    description: z.string().optional(),
    reported_date: z.string().optional(),
    video: z.string().optional(),
    image: z.string().optional(),
    date: z.string().optional()
  })
const stream = createStreamableValue();

const { partialObjectStream } = await streamObject({
  model: openai.responses("o3-mini"),
  system: prompt,
  prompt: context,
  schema: schema,

});

console.log("🚀 ~ analyzeSightingsData ~ partialObjectStream:", partialObjectStream)


for await (const partialObject of partialObjectStream) {
  console.log("🚀 ~ analyzeSightingsData ~ partialObject:", partialObject)
stream.update(partialObject);
}


stream.done;
return { object: stream.value };
}