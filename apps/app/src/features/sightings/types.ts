// Types for the Sightings visualization components

// Deck.gl props interface
export interface DeckProps {
	layers: any[]; // This should be properly typed with deck.gl layer types
	[key: string]: any;
}

// Props for the main SightingsGlobe component
export interface SightingsGlobeProps {
	geoJSONSightings: {
		sightings: GeoJSON.FeatureCollection;
		militaryBases?: GeoJSON.FeatureCollection;
		ufoPosts?: GeoJSON.FeatureCollection;
	};
	useExternalData?: boolean;
}

// Feature information for popups and hover effects
export interface FeatureInfo {
	coordinates: [number, number];
	properties: Record<string, any>;
}

// GeoJSON feature type definition
export interface GeoJSONFeature {
	geometry: {
		coordinates: [number, number];
		type: string;
	};
	properties: {
		date?: string | number;
		timestamp?: string | number;
		city?: string;
		location?: string;
		description?: string;
		comments?: string;
		sourceUrl?: string;
		[key: string]: any;
	};
	type: string;
}

// Map configuration type
export interface MapConfig {
	zoom: [number];
	center: [number, number];
	pitch: [number];
}

// Filter options interface
export interface FilterOptions {
	shape: string;
	duration: number;
	country: string;
	state: string;
	isSignificantEvent: boolean;
}
