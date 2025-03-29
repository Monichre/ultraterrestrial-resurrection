import type { MapConfig } from "../types";

/**
 * Fly to a specific location on the map
 */
export const flyToLocation = (
	longitude: number,
	latitude: number,
	zoom = 5,
	mapConfig: MapConfig,
	setMapConfig: (config: MapConfig) => void,
) => {
	setMapConfig({
		...mapConfig,
		center: [longitude, latitude] as [number, number],
		zoom: [zoom] as [number],
	});
};

/**
 * Gets the user's current geolocation
 */
export const getUserLocation = (
	mapConfig: MapConfig,
	setMapConfig: (config: MapConfig) => void,
) => {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setMapConfig({
					...mapConfig,
					center: [position.coords.longitude, position.coords.latitude] as [
						number,
						number,
					],
					zoom: [6] as [number],
				});
			},
			(error) => {
				console.error("Error getting user location:", error);
			},
		);
	}
};

/**
 * Load Mapbox tileset for sightings
 */
export const loadMapboxTileset = (
	mapRef: React.RefObject<any>,
	mapLoaded: boolean,
	setPopupInfo: (
		info: {
			coordinates: [number, number];
			properties: Record<string, any>;
		} | null,
	) => void,
) => {
	if (!mapRef.current || !mapLoaded) return;

	// Access map differently depending on react-map-gl version
	const mapInstance = mapRef.current.getMap
		? mapRef.current.getMap()
		: mapRef.current._map
			? mapRef.current._map
			: mapRef.current;

	// Ensure the map is fully initialized and has required methods
	if (!mapInstance) {
		console.error("Map instance is not available yet");
		return;
	}

	if (typeof mapInstance.getSource !== "function") {
		console.error(
			"Map instance does not have getSource method, map might not be fully loaded",
		);
		return;
	}

	try {
		// Remove previous sources/layers if they exist
		if (mapInstance.getSource("sightings-tileset")) {
			if (mapInstance.getLayer("sightings-points"))
				mapInstance.removeLayer("sightings-points");
			mapInstance.removeSource("sightings-tileset");
		}

		// Add the tileset source
		mapInstance.addSource("sightings-tileset", {
			type: "vector",
			url: "mapbox://ellisliam.35z8vcnh",
		});

		// Add a layer for the sightings points
		mapInstance.addLayer({
			id: "sightings-points",
			type: "circle",
			source: "sightings-tileset",
			"source-layer": "sightings", // This should match your tileset source layer name
			paint: {
				"circle-radius": 6,
				"circle-color": "#ff8c00",
				"circle-opacity": 0.8,
				"circle-stroke-width": 2,
				"circle-stroke-color": "rgba(255, 255, 255, 0.5)",
			},
		});

		// Add click handler for the points
		mapInstance.on("click", "sightings-points", (e: any) => {
			if (e.features && e.features.length > 0) {
				const feature = e.features[0];
				setPopupInfo({
					coordinates: feature.geometry.coordinates as [number, number],
					properties: feature.properties,
				});
			}
		});

		// Change cursor on hover
		mapInstance.on("mouseenter", "sightings-points", () => {
			mapInstance.getCanvas().style.cursor = "pointer";
		});

		mapInstance.on("mouseleave", "sightings-points", () => {
			mapInstance.getCanvas().style.cursor = "";
		});
	} catch (error) {
		console.error("Error loading Mapbox tileset:", error);
	}
};

/**
 * Format date for display
 */
export const formatDate = (timestamp: number | string | undefined) => {
	if (!timestamp) return "Unknown date";
	const date = new Date(timestamp);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
};
