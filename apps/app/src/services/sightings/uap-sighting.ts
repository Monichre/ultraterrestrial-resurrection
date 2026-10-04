import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

// Add type definition for SightingProperty
type SightingProperty = string;

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
];
// Helper function to validate coordinates
export const isValidCoordinates = (coords: any): boolean => {
  if (!coords || typeof coords !== 'object') return false;
  
  const { lat, lng } = coords;
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' && 
    !isNaN(lat) && 
    !isNaN(lng) &&
    lat >= -90 && lat <= 90 && 
    lng >= -180 && lng <= 180
  );
};

// Helper function to get valid coordinates or null
export const getValidCoordinates = (coords: any): { lat: number; lng: number } | null => {
  if (!isValidCoordinates(coords)) return null;
  return { lat: coords.lat, lng: coords.lng };
};

// Helper function to ensure valid coordinates (throws error if invalid)
export const ensureValidCoordinates = (coords: any): { lat: number; lng: number } => {
  const validCoords = getValidCoordinates(coords);
  if (!validCoords) {
    throw new Error('Invalid coordinates provided');
  }
  return validCoords;
};

// Define coordinates schema with validation
const CoordinatesSchema = z.object({
  lat: z.number()
    .refine(val => !isNaN(val) && val >= -90 && val <= 90, {
      message: "Latitude must be between -90 and 90 degrees"
    }),
  lng: z.number()
    .refine(val => !isNaN(val) && val >= -180 && val <= 180, {
      message: "Longitude must be between -180 and 180 degrees"
    })
}).optional();

export const UAPSightingSchema = z.object({
	id: z.string(),
	source: z.enum(["twitter", "news", "rss"]),
	title: z.string().optional(),
	content: z.string(),
	location: z.object({
		city: z.string().optional(),
		state: z.string().optional(), // Make state optional
		coordinates: CoordinatesSchema,
	}),
	timestamp: z.date(),
	mediaUrls: z.array(z.string()),
	sourceUrl: z.string(),
	category: z.array(z.string()).optional(),
	confidence: z.enum(["high", "medium", "low"]),
	type: z.enum(["sighting", "incident", "news", "analysis"]),
});

export type ValidatedUAPSighting = z.infer<typeof UAPSightingSchema>;

export const getSightingsGeoJSON = async () => {
	let sightingsFileContents, ufoPostsFileContents, militaryBasesFileContents;

	try {
		// Try to load the real data files if they exist
		const sightingsFilePath = path.join(
			process.cwd(),
			"public",
			"sightings.geojson",
		);
		sightingsFileContents = await fs.promises.readFile(
			sightingsFilePath,
			"utf8",
		);

		const ufoPostsFilePath = path.join(
			process.cwd(),
			"public",
			"ufo-posts.geojson",
		);
		ufoPostsFileContents = await fs.promises.readFile(ufoPostsFilePath, "utf8");

		const militaryBasesFilePath = path.join(
			process.cwd(),
			"public",
			"military-bases.geojson",
		);
		militaryBasesFileContents = await fs.promises.readFile(
			militaryBasesFilePath,
			"utf8",
		);
	} catch (error) {
		// If real data files don't exist, use mock data
		console.log("Using mock data files since real data files weren't found");

		const mockSightingsFilePath = path.join(
			process.cwd(),
			"public",
			"mock-sightings.geojson",
		);
		sightingsFileContents = await fs.promises.readFile(
			mockSightingsFilePath,
			"utf8",
		);

		const mockUfoPostsFilePath = path.join(
			process.cwd(),
			"public",
			"mock-ufo-posts.geojson",
		);
		ufoPostsFileContents = await fs.promises.readFile(
			mockUfoPostsFilePath,
			"utf8",
		);

		const mockMilitaryBasesFilePath = path.join(
			process.cwd(),
			"public",
			"mock-military-bases.geojson",
		);
		militaryBasesFileContents = await fs.promises.readFile(
			mockMilitaryBasesFilePath,
			"utf8",
		);
	}

	// Parse the JSON content
	const sightings = JSON.parse(sightingsFileContents);
	const militaryBases = JSON.parse(militaryBasesFileContents);
	const ufoPosts = JSON.parse(ufoPostsFileContents);
	console.log(
		"🚀 ~ file: uap-sighting.ts:65 ~ getSightingsGeoJSON ~ ufoPosts:",
		ufoPosts,
	);
	console.log(
		"🚀 ~ file: uap-sighting.ts:65 ~ getSightingsGeoJSON ~ militaryBases:",
		militaryBases,
	);
	console.log(
		"🚀 ~ file: uap-sighting.ts:65 ~ getSightingsGeoJSON ~ sightings:",
		sightings,
	);
	// Return the parsed GeoJSON content
	return {
		sightings,
		militaryBases,
		ufoPosts,
	};
};

/**
 * Safely extracts coordinates from a sighting object
 * Returns null if coordinates are invalid or missing
 */
export function getSightingCoordinates(sighting: ValidatedUAPSighting | undefined | null): { lat: number; lng: number } | null {
  if (!sighting || !sighting.location) return null;
  return getValidCoordinates(sighting.location.coordinates);
}

/**
 * Creates fallback coordinates when original coordinates are missing or invalid
 * This is useful for visualization when exact coordinates aren't available
 */
export function createFallbackCoordinates(sighting: ValidatedUAPSighting | undefined | null): { lat: number; lng: number } | null {
  // First try to use the sighting's actual coordinates
  const coords = getSightingCoordinates(sighting);
  if (coords) return coords;
  
  // If we have location information but no coordinates, we could potentially
  // generate approximate coordinates based on city/state in the future
  
  // For now, return null when we don't have valid coordinates
  return null;
}
