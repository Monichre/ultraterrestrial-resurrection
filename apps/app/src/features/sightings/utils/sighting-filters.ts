import type { GeoJSONFeature, FilterOptions } from "../types";

/**
 * Determines if a sighting is a significant event based on properties
 */
export const isSignificantEvent = (feature: GeoJSONFeature): boolean => {
	// Safety check
	if (!feature || !feature.properties) return false;

	// Define criteria for "significant events"

	// 1. Events with longer durations (more than 10 minutes)
	const durationSeconds = Number.parseInt(
		feature.properties.duration_seconds || "0",
		10,
	);
	if (durationSeconds > 600) return true;

	// 2. Events with multiple witnesses or officially documented
	const description = (feature.properties.description || "").toLowerCase();
	if (
		description.includes("multiple witness") ||
		description.includes("military") ||
		description.includes("pilot") ||
		description.includes("police") ||
		description.includes("radar") ||
		description.includes("official")
	)
		return true;

	// 3. Events that have media evidence
	if (feature.properties.video || feature.properties.image) return true;

	// 4. Famous historical cases
	const location = (feature.properties.location || "").toLowerCase();
	if (
		description.includes("roswell") ||
		description.includes("phoenix lights") ||
		description.includes("nimitz") ||
		description.includes("tic tac") ||
		description.includes("rendlesham") ||
		location.includes("roswell") ||
		location.includes("phoenix")
	)
		return true;

	return false;
};

/**
 * Combined filter function for sightings data
 */
export const filterFeature = (
	feature: GeoJSONFeature,
	timeRange: [number, number],
	filters: FilterOptions,
	isSignificantEventFn = isSignificantEvent,
) => {
	// Safety check
	if (!feature || !feature.properties) return false;

	// Get the date from either date or timestamp property
	const date = new Date(
		feature.properties.date || feature.properties.timestamp || 0,
	);
	const timestamp = date.getTime();

	// Check if it's within the selected time range (always applied)
	if (timestamp < timeRange[0] || timestamp > timeRange[1]) return false;

	const {
		shape: featureShape,
		duration_seconds: durationSeconds,
		country: featureCountry,
		state: featureState,
	} = feature.properties;

	// Shape filter
	if (
		filters.shape &&
		featureShape &&
		featureShape.toLowerCase() !== filters.shape.toLowerCase()
	) {
		return false;
	}

	// Duration filter (convert string to number if needed)
	if (filters.duration > 0) {
		const duration =
			typeof durationSeconds === "string"
				? Number.parseInt(durationSeconds, 10)
				: durationSeconds || 0;

		if (duration < filters.duration) return false;
	}

	// Country filter
	if (
		filters.country &&
		featureCountry &&
		featureCountry.toLowerCase() !== filters.country.toLowerCase()
	) {
		return false;
	}

	// State filter
	if (
		filters.state &&
		featureState &&
		featureState.toLowerCase() !== filters.state.toLowerCase()
	) {
		return false;
	}

	// Significant events filter
	if (filters.isSignificantEvent && !isSignificantEventFn(feature)) {
		return false;
	}

	// Feature passed all filters
	return true;
};

/**
 * Find significant events within a specific time window
 */
export const findSignificantEventsInTimeWindow = (
	sightings: GeoJSON.FeatureCollection | null,
	start: number,
	end: number,
	isSignificantEventFn = isSignificantEvent,
): GeoJSONFeature[] => {
	if (!sightings || !sightings.features) return [];

	return sightings.features.filter((feature: any) => {
		// Check if it's in the time window
		const date = new Date(
			feature.properties.date || feature.properties.timestamp || 0,
		);
		const timestamp = date.getTime();
		if (timestamp < start || timestamp > end) return false;

		// Check if it's a significant event
		return isSignificantEventFn(feature as GeoJSONFeature);
	}) as GeoJSONFeature[];
};
