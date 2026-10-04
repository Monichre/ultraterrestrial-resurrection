import type { ValidatedUAPSighting } from '@/services/sightings/uap-sighting'

// Comprehensive coordinate mapping for US states and countries
export const LOCATION_COORDINATES = {
  // US States (geographic centers)
  'ALABAMA': { lat: 32.3182, lon: -86.9023 },
  'ALASKA': { lat: 61.2181, lon: -149.9003 },
  'ARIZONA': { lat: 33.7298, lon: -111.4312 },
  'ARKANSAS': { lat: 34.9697, lon: -92.3731 },
  'CALIFORNIA': { lat: 36.1162, lon: -119.6816 },
  'COLORADO': { lat: 39.0598, lon: -105.3111 },
  'CONNECTICUT': { lat: 41.5978, lon: -72.7554 },
  'DELAWARE': { lat: 39.3185, lon: -75.5071 },
  'FLORIDA': { lat: 27.7663, lon: -81.6868 },
  'GEORGIA': { lat: 33.0406, lon: -83.6431 },
  'HAWAII': { lat: 21.0943, lon: -157.4983 },
  'IDAHO': { lat: 44.2405, lon: -114.4788 },
  'ILLINOIS': { lat: 40.3495, lon: -88.9861 },
  'INDIANA': { lat: 39.8494, lon: -86.2583 },
  'IOWA': { lat: 42.0115, lon: -93.2105 },
  'KANSAS': { lat: 38.5266, lon: -96.7265 },
  'KENTUCKY': { lat: 37.6681, lon: -84.6701 },
  'LOUISIANA': { lat: 31.1695, lon: -91.8678 },
  'MAINE': { lat: 44.6939, lon: -69.3819 },
  'MARYLAND': { lat: 39.0639, lon: -76.8021 },
  'MASSACHUSETTS': { lat: 42.2081, lon: -71.0275 },
  'MICHIGAN': { lat: 43.3266, lon: -84.5361 },
  'MINNESOTA': { lat: 45.7326, lon: -93.9196 },
  'MISSISSIPPI': { lat: 32.7414, lon: -89.6781 },
  'MISSOURI': { lat: 38.4561, lon: -92.2884 },
  'MONTANA': { lat: 47.0527, lon: -110.2148 },
  'NEBRASKA': { lat: 41.1254, lon: -98.2681 },
  'NEVADA': { lat: 38.3135, lon: -117.0554 },
  'NEW HAMPSHIRE': { lat: 43.4525, lon: -71.5639 },
  'NEW JERSEY': { lat: 40.3573, lon: -74.4057 },
  'NEW MEXICO': { lat: 34.8405, lon: -106.2485 },
  'NEW YORK': { lat: 42.1657, lon: -74.9481 },
  'NORTH CAROLINA': { lat: 35.6301, lon: -79.8064 },
  'NORTH DAKOTA': { lat: 47.5289, lon: -99.7840 },
  'OHIO': { lat: 40.3888, lon: -82.7649 },
  'OKLAHOMA': { lat: 35.5653, lon: -96.9289 },
  'OREGON': { lat: 44.5672, lon: -122.1269 },
  'PENNSYLVANIA': { lat: 40.5908, lon: -77.2098 },
  'RHODE ISLAND': { lat: 41.6809, lon: -71.5118 },
  'SOUTH CAROLINA': { lat: 33.8569, lon: -80.9450 },
  'SOUTH DAKOTA': { lat: 44.2998, lon: -99.4388 },
  'TENNESSEE': { lat: 35.7478, lon: -86.7923 },
  'TEXAS': { lat: 31.0545, lon: -97.5635 },
  'UTAH': { lat: 40.1135, lon: -111.8535 },
  'VERMONT': { lat: 44.0459, lon: -72.7107 },
  'VIRGINIA': { lat: 37.7693, lon: -78.2057 },
  'WASHINGTON': { lat: 47.4009, lon: -121.4905 },
  'WEST VIRGINIA': { lat: 38.4912, lon: -80.9545 },
  'WISCONSIN': { lat: 44.2685, lon: -89.6165 },
  'WYOMING': { lat: 42.7559, lon: -107.3025 },

  // Major Countries (capital cities or geographic centers)
  'UNITED STATES': { lat: 39.8283, lon: -98.5795 },
  'CANADA': { lat: 56.1304, lon: -106.3468 },
  'UNITED KINGDOM': { lat: 55.3781, lon: -3.4360 },
  'AUSTRALIA': { lat: -25.2744, lon: 133.7751 },
  'GERMANY': { lat: 51.1657, lon: 10.4515 },
  'FRANCE': { lat: 46.2276, lon: 2.2137 },
  'ITALY': { lat: 41.8719, lon: 12.5674 },
  'SPAIN': { lat: 40.4637, lon: -3.7492 },
  'JAPAN': { lat: 36.2048, lon: 138.2529 },
  'CHINA': { lat: 35.8617, lon: 104.1954 },
  'RUSSIA': { lat: 61.5240, lon: 105.3188 },
  'BRAZIL': { lat: -14.2350, lon: -51.9253 },
  'MEXICO': { lat: 23.6345, lon: -102.5528 },
  'INDIA': { lat: 20.5937, lon: 78.9629 },
  'SOUTH AFRICA': { lat: -30.5595, lon: 22.9375 },
  'ARGENTINA': { lat: -38.4161, lon: -63.6167 },
  'CHILE': { lat: -35.6751, lon: -71.5430 },
  'NORWAY': { lat: 60.4720, lon: 8.4689 },
  'SWEDEN': { lat: 60.1282, lon: 18.6435 },
  'NETHERLANDS': { lat: 52.1326, lon: 5.2913 },
  'BELGIUM': { lat: 50.5039, lon: 4.4699 },
  'SWITZERLAND': { lat: 46.8182, lon: 8.2275 },
  'AUSTRIA': { lat: 47.5162, lon: 14.5501 },
  'POLAND': { lat: 51.9194, lon: 19.1451 },
  'TURKEY': { lat: 38.9637, lon: 35.2433 },
  'ISRAEL': { lat: 31.0461, lon: 34.8516 },
  'SOUTH KOREA': { lat: 35.9078, lon: 127.7669 },
  'THAILAND': { lat: 15.8700, lon: 100.9925 },
  'SINGAPORE': { lat: 1.3521, lon: 103.8198 },
  'NEW ZEALAND': { lat: -40.9006, lon: 174.8860 },
} as const

// Known UAP hotspot regions based on historical data
export const DEFAULT_UAP_HOTSPOTS = [
  { name: 'CALIFORNIA', lat: 36.1162, lon: -119.6816, count: 0 },
  { name: 'ARIZONA', lat: 33.7298, lon: -111.4312, count: 0 },
  { name: 'NEW MEXICO', lat: 34.8405, lon: -106.2485, count: 0 },
  { name: 'NEVADA', lat: 38.3135, lon: -117.0554, count: 0 },
  { name: 'TEXAS', lat: 31.0545, lon: -97.5635, count: 0 },
  { name: 'FLORIDA', lat: 27.7663, lon: -81.6868, count: 0 },
  { name: 'WASHINGTON', lat: 47.4009, lon: -121.4905, count: 0 },
  { name: 'OREGON', lat: 44.5672, lon: -122.1269, count: 0 },
  { name: 'UNITED KINGDOM', lat: 55.3781, lon: -3.4360, count: 0 },
  { name: 'AUSTRALIA', lat: -25.2744, lon: 133.7751, count: 0 },
  { name: 'CANADA', lat: 56.1304, lon: -106.3468, count: 0 },
  { name: 'BRAZIL', lat: -14.2350, lon: -51.9253, count: 0 },
] as const

export interface LocationWithCount {
  name: string
  lat: number
  lon: number
  count: number
}

export interface LocationCoordinate {
  name: string
  lat: number
  lon: number
}

/**
 * Analyzes UAP sightings data to determine top locations by sighting count
 * @param sightings Array of validated UAP sightings
 * @param maxLocations Maximum number of locations to return (default: 12)
 * @returns Array of locations with their sighting counts, sorted by count descending
 */
export function calculateTopSightingLocations(
  sightings: ValidatedUAPSighting[],
  maxLocations: number = 12
): LocationWithCount[] {
  // Count sightings by state/country
  const locationCounts = new Map<string, number>()

  sightings.forEach( sighting => {
    if ( !sighting.location?.coordinates ) return

    // Try to extract state or country from the location
    const state = sighting.location.state?.toUpperCase()
    const country = sighting.location.country?.toUpperCase()
    const city = sighting.location.city?.toUpperCase()

    // Priority: US State > Country > Major City
    let locationKey: string | null = null

    if ( state && LOCATION_COORDINATES[state as keyof typeof LOCATION_COORDINATES] ) {
      locationKey = state
    } else if ( country && LOCATION_COORDINATES[country as keyof typeof LOCATION_COORDINATES] ) {
      locationKey = country
    } else if ( city && LOCATION_COORDINATES[city as keyof typeof LOCATION_COORDINATES] ) {
      locationKey = city
    }

    if ( locationKey ) {
      locationCounts.set( locationKey, ( locationCounts.get( locationKey ) || 0 ) + 1 )
    }
  } )

  // Convert to array and sort by count
  const sortedLocations = Array.from( locationCounts.entries() )
    .map( ( [name, count] ) => ( {
      name,
      count,
      ...LOCATION_COORDINATES[name as keyof typeof LOCATION_COORDINATES]
    } ) )
    .sort( ( a, b ) => b.count - a.count )
    .slice( 0, maxLocations )

  // If we don't have enough locations from data, fill with high-activity defaults
  const existingNames = new Set( sortedLocations.map( loc => loc.name ) )
  const additionalLocations = DEFAULT_UAP_HOTSPOTS
    .filter( loc => !existingNames.has( loc.name ) )
    .slice( 0, maxLocations - sortedLocations.length )

  return [...sortedLocations, ...additionalLocations]
}

/**
 * Gets coordinate information for a specific location
 * @param locationName Name of the location (case insensitive)
 * @returns Coordinate object or null if not found
 */
export function getLocationCoordinates( locationName: string ): LocationCoordinate | null {
  const normalizedName = locationName.toUpperCase()
  const coords = LOCATION_COORDINATES[normalizedName as keyof typeof LOCATION_COORDINATES]

  if ( coords ) {
    return {
      name: normalizedName,
      ...coords
    }
  }

  return null
}

/**
 * Checks if a location name exists in our coordinate database
 * @param locationName Name to check
 * @returns True if location exists in database
 */
export function isKnownLocation( locationName: string ): boolean {
  return getLocationCoordinates( locationName ) !== null
}

/**
 * Gets all available location names in the coordinate database
 * @returns Array of all location names
 */
export function getAllLocationNames(): string[] {
  return Object.keys( LOCATION_COORDINATES )
}

/**
 * Analyzes sightings to generate location statistics
 * @param sightings Array of UAP sightings
 * @returns Statistics about location distribution
 */
export function analyzeLocationDistribution( sightings: ValidatedUAPSighting[] ) {
  const stats = {
    totalSightings: sightings.length,
    sightingsWithCoordinates: 0,
    sightingsWithState: 0,
    sightingsWithCountry: 0,
    sightingsWithCity: 0,
    unknownLocations: 0,
    topStates: new Map<string, number>(),
    topCountries: new Map<string, number>(),
    topCities: new Map<string, number>()
  }

  sightings.forEach( sighting => {
    if ( sighting.location?.coordinates ) {
      stats.sightingsWithCoordinates++
    }

    if ( sighting.location?.state ) {
      stats.sightingsWithState++
      const state = sighting.location.state.toUpperCase()
      stats.topStates.set( state, ( stats.topStates.get( state ) || 0 ) + 1 )
    }

    if ( sighting.location?.country ) {
      stats.sightingsWithCountry++
      const country = sighting.location.country.toUpperCase()
      stats.topCountries.set( country, ( stats.topCountries.get( country ) || 0 ) + 1 )
    }

    if ( sighting.location?.city ) {
      stats.sightingsWithCity++
      const city = sighting.location.city.toUpperCase()
      stats.topCities.set( city, ( stats.topCities.get( city ) || 0 ) + 1 )
    }

    if ( !sighting.location?.state && !sighting.location?.country && !sighting.location?.city ) {
      stats.unknownLocations++
    }
  } )

  return {
    ...stats,
    coverage: {
      withCoordinates: ( stats.sightingsWithCoordinates / stats.totalSightings ) * 100,
      withState: ( stats.sightingsWithState / stats.totalSightings ) * 100,
      withCountry: ( stats.sightingsWithCountry / stats.totalSightings ) * 100,
      withCity: ( stats.sightingsWithCity / stats.totalSightings ) * 100,
      unknown: ( stats.unknownLocations / stats.totalSightings ) * 100
    }
  }
}
