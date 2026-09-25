export const ZOOM_LEVEL_CONFIG = {
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
export function getZoomConfig(cameraDistance: number) {
	if (cameraDistance > 6) return ZOOM_LEVEL_CONFIG.far;
	if (cameraDistance > 3) return ZOOM_LEVEL_CONFIG.medium;
	return ZOOM_LEVEL_CONFIG.close;
}

/**
 * Groups sightings by decade and returns a Record mapping decade labels to arrays of sightings
 * Example output: { "1950-1959": [...sightings], "1960-1969": [...sightings], ... }
 */
export function groupSightingsByDecade(sightings: any[]) {
	return sightings.reduce((decades: Record<string, any[]>, sighting) => {
		if (!sighting.timestamp && !sighting.date) return decades;
		
		const date = sighting.timestamp || sighting.date;
		const year = new Date(date).getFullYear();
		const decadeStart = Math.floor(year / 10) * 10;
		const decadeLabel = `${decadeStart}-${decadeStart + 9}`;
		
		if (!decades[decadeLabel]) {
			decades[decadeLabel] = [];
		}
		
		decades[decadeLabel].push(sighting);
		return decades;
	}, {});
}

/**
 * Calculates distribution statistics for sightings grouped by decade
 * Returns an object with decade labels as keys and counts as values
 */
export function getDecadeDistribution(sightings: any[]) {
	const decades = groupSightingsByDecade(sightings);
	
	return Object.entries(decades).reduce((distribution: Record<string, number>, [decade, groupSightings]) => {
		distribution[decade] = groupSightings.length;
		return distribution;
	}, {});
}
