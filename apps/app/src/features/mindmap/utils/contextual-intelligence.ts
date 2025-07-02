import type { Node } from '@xyflow/react'

export interface GraphContext {
  seedRecord: Node | null
  connectedEntityTypes: Set<string>
  timelineBounds: {
    earliest?: Date
    latest?: Date
  }
  relatedTopics: string[]
  keyPersonnel: string[]
  organizations: string[]
  locationContext?: {
    latitude: number
    longitude: number
    radius: number // in kilometers
  }
  // Enhanced tour context
  tourContext?: {
    tourId: string
    currentWaypointId: string
    waypointIndex: number
    tourMode: 'guided' | 'free-form'
    historicalProgression: {
      currentEra: string
      nextSuggestedPeriod: string
      chronologicalDirection: 'forward' | 'backward' | 'context-based'
    }
    narrativeContext: string
  }
  // Historical progression tracking
  historicalProgression?: {
    currentPeriod: {
      startYear: number
      endYear: number
      era: string
    }
    significantEvents: string[]
    nextChronologicalStep: {
      direction: 'forward' | 'backward'
      suggestedYear: number
      rationale: string
    }
  }
}

/**
 * Analyzes the current graph to determine contextual relationships
 * for intelligent record filtering
 */
export function getGraphContext( nodes: Node[] ): GraphContext | null {
  try {
    // Validate input
    if ( !Array.isArray( nodes ) ) {
      console.warn( 'getGraphContext: nodes parameter is not an array' )
      return null
    }

    // Filter out user input nodes to focus on actual data nodes
    const dataNodes = nodes.filter( node =>
      node &&
      node.type &&
      node.type !== 'userInputNode' &&
      node.data
    )

    // First record scenario - return null for open exploration
    if ( dataNodes.length === 0 ) {
      return null
    }

    // Extract context from existing nodes
    const context: GraphContext = {
      seedRecord: dataNodes[0], // First record establishes primary context
      connectedEntityTypes: new Set<string>(),
      timelineBounds: {},
      relatedTopics: [],
      keyPersonnel: [],
      organizations: []
    }

    // Track coordinates for location context
    const coordinates: Array<{ lat: number, lon: number }> = []

    // Analyze all data nodes to build context
    dataNodes.forEach( node => {
      try {
        // Extract entity type from node type (e.g., 'eventsNode' -> 'events')
        const entityType = node.type?.replace( 'Node', '' ).replace( 'enhancedEntityNodePOC', '' ).toLowerCase() || ''
        if ( entityType && entityType.length > 0 ) {
          context.connectedEntityTypes.add( entityType )
        }

        // Safely extract temporal context from events
        const nodeDate = extractDateFromNode( node )
        if ( nodeDate && !isNaN( nodeDate.getTime() ) ) {
          if ( !context.timelineBounds.earliest || nodeDate < context.timelineBounds.earliest ) {
            context.timelineBounds.earliest = nodeDate
          }
          if ( !context.timelineBounds.latest || nodeDate > context.timelineBounds.latest ) {
            context.timelineBounds.latest = nodeDate
          }
        }

        // Extract related entities with null safety
        const topics = extractTopicsFromNode( node )
        if ( topics.length > 0 ) {
          context.relatedTopics.push( ...topics )
        }

        const personnel = extractPersonnelFromNode( node )
        if ( personnel.length > 0 ) {
          context.keyPersonnel.push( ...personnel )
        }

        const organizations = extractOrganizationsFromNode( node )
        if ( organizations.length > 0 ) {
          context.organizations.push( ...organizations )
        }

        // Extract coordinates for location context
        const coords = extractCoordinatesFromNode( node )
        if ( coords ) {
          coordinates.push( coords )
        }
      } catch ( error ) {
        console.warn( `getGraphContext: Error processing node ${node.id}:`, error )
        // Continue processing other nodes
      }
    } )

    // Remove duplicates and clean up arrays
    context.relatedTopics = [...new Set( context.relatedTopics )].filter( Boolean )
    context.keyPersonnel = [...new Set( context.keyPersonnel )].filter( Boolean )
    context.organizations = [...new Set( context.organizations )].filter( Boolean )

    // Calculate location context if we have coordinates
    if ( coordinates.length > 0 ) {
      const avgLat = coordinates.reduce( ( sum, coord ) => sum + coord.lat, 0 ) / coordinates.length
      const avgLon = coordinates.reduce( ( sum, coord ) => sum + coord.lon, 0 ) / coordinates.length

      // Calculate radius based on the spread of coordinates
      const maxDistance = coordinates.reduce( ( max, coord ) => {
        const distance = calculateDistance( avgLat, avgLon, coord.lat, coord.lon )
        return Math.max( max, distance )
      }, 0 )

      context.locationContext = {
        latitude: avgLat,
        longitude: avgLon,
        radius: Math.max( 500, maxDistance * 2 ) // At least 500km, or twice the max distance
      }
    }

    // Add historical progression analysis
    context.historicalProgression = determineHistoricalProgression( context )

    return context
  } catch ( error ) {
    console.error( 'getGraphContext: Failed to analyze graph context:', error )
    return null
  }
}

/**
 * Helper functions to safely extract data from nodes
 */
function extractDateFromNode( node: Node ): Date | null {
  try {
    if ( !node.data ) return null

    // Try multiple possible date fields
    const dateFields = ['date', 'timestamp', 'dateTime', 'eventDate', 'createdAt']

    for ( const field of dateFields ) {
      const dateValue = node.data[field]
      if ( dateValue ) {
        const date = new Date( dateValue as string )
        if ( !isNaN( date.getTime() ) ) {
          return date
        }
      }
    }

    return null
  } catch ( error ) {
    console.warn( `extractDateFromNode: Error extracting date from node ${node.id}:`, error )
    return null
  }
}

function extractTopicsFromNode( node: Node ): string[] {
  try {
    if ( !node.data ) return []

    const topics: string[] = []

    // Try multiple possible topic fields
    const topicFields = ['topics', 'tags', 'categories', 'keywords']

    for ( const field of topicFields ) {
      const fieldValue = node.data[field]
      if ( Array.isArray( fieldValue ) ) {
        topics.push( ...fieldValue.filter( item => typeof item === 'string' ) )
      } else if ( typeof fieldValue === 'string' ) {
        topics.push( fieldValue )
      }
    }

    // Also check for topic-related strings in title/name/subject
    const textFields = ['title', 'name', 'subject', 'description']
    for ( const field of textFields ) {
      const fieldValue = node.data[field]
      if ( typeof fieldValue === 'string' && fieldValue.length > 0 ) {
        // Extract potential topic keywords (simple approach)
        if ( fieldValue.toLowerCase().includes( 'ufo' ) || fieldValue.toLowerCase().includes( 'uap' ) ) {
          topics.push( 'UFO/UAP' )
        }
      }
    }

    return topics
  } catch ( error ) {
    console.warn( `extractTopicsFromNode: Error extracting topics from node ${node.id}:`, error )
    return []
  }
}

function extractPersonnelFromNode( node: Node ): string[] {
  try {
    if ( !node.data ) return []

    const personnel: string[] = []

    // Try different possible personnel fields
    const personnelFields = ['witness', 'author', 'person', 'personnel', 'names']

    for ( const field of personnelFields ) {
      const fieldValue = node.data[field]
      if ( fieldValue && typeof fieldValue === 'object' && fieldValue.name ) {
        personnel.push( fieldValue.name as string )
      } else if ( typeof fieldValue === 'string' ) {
        personnel.push( fieldValue )
      } else if ( Array.isArray( fieldValue ) ) {
        personnel.push( ...fieldValue.filter( item => typeof item === 'string' ) )
      }
    }

    return personnel
  } catch ( error ) {
    console.warn( `extractPersonnelFromNode: Error extracting personnel from node ${node.id}:`, error )
    return []
  }
}

function extractOrganizationsFromNode( node: Node ): string[] {
  try {
    if ( !node.data ) return []

    const organizations: string[] = []

    // Try different possible organization fields
    const orgFields = ['organization', 'agency', 'department', 'company', 'institution']

    for ( const field of orgFields ) {
      const fieldValue = node.data[field]
      if ( fieldValue && typeof fieldValue === 'object' && fieldValue.name ) {
        organizations.push( fieldValue.name as string )
      } else if ( typeof fieldValue === 'string' ) {
        organizations.push( fieldValue )
      } else if ( Array.isArray( fieldValue ) ) {
        organizations.push( ...fieldValue.filter( item => typeof item === 'string' ) )
      }
    }

    return organizations
  } catch ( error ) {
    console.warn( `extractOrganizationsFromNode: Error extracting organizations from node ${node.id}:`, error )
    return []
  }
}

function extractCoordinatesFromNode( node: Node ): { lat: number, lon: number } | null {
  try {
    if ( !node.data ) return null

    // Try different possible coordinate fields
    const latFields = ['latitude', 'lat', 'y']
    const lonFields = ['longitude', 'lon', 'lng', 'x']

    let lat: number | null = null
    let lon: number | null = null

    for ( const field of latFields ) {
      const value = node.data[field]
      if ( typeof value === 'number' && !isNaN( value ) ) {
        lat = value
        break
      }
    }

    for ( const field of lonFields ) {
      const value = node.data[field]
      if ( typeof value === 'number' && !isNaN( value ) ) {
        lon = value
        break
      }
    }

    if ( lat !== null && lon !== null &&
      lat >= -90 && lat <= 90 &&
      lon >= -180 && lon <= 180 ) {
      return { lat, lon }
    }

    return null
  } catch ( error ) {
    console.warn( `extractCoordinatesFromNode: Error extracting coordinates from node ${node.id}:`, error )
    return null
  }
}

/**
 * Determines if a new record is contextually related to the existing graph
 */
export function isRecordRelated( record: any, context: GraphContext ): boolean {
  try {
    if ( !record || !context ) {
      return false
    }

    let relationshipScore = 0
    const requiredScore = 1 // Minimum score to be considered related

    // Check temporal relevance for events (weighted: 2 points)
    if ( record.date && context.timelineBounds.earliest && context.timelineBounds.latest ) {
      const recordDate = new Date( record.date )
      if ( !isNaN( recordDate.getTime() ) ) {
        const earliestDate = new Date( context.timelineBounds.earliest )
        const latestDate = new Date( context.timelineBounds.latest )

        // Allow records within a reasonable time window (e.g., +/- 10 years)
        const timeWindow = 10 * 365 * 24 * 60 * 60 * 1000 // 10 years in milliseconds

        if ( recordDate >= new Date( earliestDate.getTime() - timeWindow ) &&
          recordDate <= new Date( latestDate.getTime() + timeWindow ) ) {
          relationshipScore += 2
        }
      }
    }

    // Check for direct entity relationships (weighted: 3 points each)
    const recordPersonnel = extractPersonnelFromRecord( record )
    if ( recordPersonnel.some( person => context.keyPersonnel.includes( person ) ) ) {
      relationshipScore += 3
    }

    const recordOrganizations = extractOrganizationsFromRecord( record )
    if ( recordOrganizations.some( org => context.organizations.includes( org ) ) ) {
      relationshipScore += 3
    }

    // Check for topic overlap (weighted: 2 points)
    const recordTopics = extractTopicsFromRecord( record )
    if ( recordTopics.some( topic => context.relatedTopics.includes( topic ) ) ) {
      relationshipScore += 2
    }

    // Check for location proximity (weighted: 2 points)
    if ( context.locationContext ) {
      const recordCoords = extractCoordinatesFromRecord( record )
      if ( recordCoords ) {
        const distance = calculateDistance(
          context.locationContext.latitude,
          context.locationContext.longitude,
          recordCoords.lat,
          recordCoords.lon
        )

        if ( distance <= context.locationContext.radius ) {
          relationshipScore += 2
        }
      }
    }

    return relationshipScore >= requiredScore
  } catch ( error ) {
    console.warn( 'isRecordRelated: Error checking record relationship:', error )
    return false // Default to not related if error occurs
  }
}

// Helper functions for record data extraction
function extractPersonnelFromRecord( record: any ): string[] {
  // Similar to extractPersonnelFromNode but for raw records
  try {
    if ( !record ) return []

    const personnel: string[] = []
    const personnelFields = ['witness', 'author', 'person', 'personnel', 'names']

    for ( const field of personnelFields ) {
      const fieldValue = record[field]
      if ( fieldValue && typeof fieldValue === 'object' && fieldValue.name ) {
        personnel.push( fieldValue.name )
      } else if ( typeof fieldValue === 'string' ) {
        personnel.push( fieldValue )
      } else if ( Array.isArray( fieldValue ) ) {
        personnel.push( ...fieldValue.filter( item => typeof item === 'string' ) )
      }
    }

    return personnel
  } catch ( error ) {
    return []
  }
}

function extractOrganizationsFromRecord( record: any ): string[] {
  // Similar to extractOrganizationsFromNode but for raw records
  try {
    if ( !record ) return []

    const organizations: string[] = []
    const orgFields = ['organization', 'agency', 'department', 'company', 'institution']

    for ( const field of orgFields ) {
      const fieldValue = record[field]
      if ( fieldValue && typeof fieldValue === 'object' && fieldValue.name ) {
        organizations.push( fieldValue.name )
      } else if ( typeof fieldValue === 'string' ) {
        organizations.push( fieldValue )
      } else if ( Array.isArray( fieldValue ) ) {
        organizations.push( ...fieldValue.filter( item => typeof item === 'string' ) )
      }
    }

    return organizations
  } catch ( error ) {
    return []
  }
}

function extractTopicsFromRecord( record: any ): string[] {
  // Similar to extractTopicsFromNode but for raw records
  try {
    if ( !record ) return []

    const topics: string[] = []
    const topicFields = ['topics', 'tags', 'categories', 'keywords']

    for ( const field of topicFields ) {
      const fieldValue = record[field]
      if ( Array.isArray( fieldValue ) ) {
        topics.push( ...fieldValue.filter( item => typeof item === 'string' ) )
      } else if ( typeof fieldValue === 'string' ) {
        topics.push( fieldValue )
      }
    }

    return topics
  } catch ( error ) {
    return []
  }
}

function extractCoordinatesFromRecord( record: any ): { lat: number, lon: number } | null {
  // Similar to extractCoordinatesFromNode but for raw records
  try {
    if ( !record ) return null

    const latFields = ['latitude', 'lat', 'y']
    const lonFields = ['longitude', 'lon', 'lng', 'x']

    let lat: number | null = null
    let lon: number | null = null

    for ( const field of latFields ) {
      const value = record[field]
      if ( typeof value === 'number' && !isNaN( value ) ) {
        lat = value
        break
      }
    }

    for ( const field of lonFields ) {
      const value = record[field]
      if ( typeof value === 'number' && !isNaN( value ) ) {
        lon = value
        break
      }
    }

    if ( lat !== null && lon !== null &&
      lat >= -90 && lat <= 90 &&
      lon >= -180 && lon <= 180 ) {
      return { lat, lon }
    }

    return null
  } catch ( error ) {
    return null
  }
}

/**
 * Calculates distance between two coordinates in kilometers
 */
function calculateDistance( lat1: number, lon1: number, lat2: number, lon2: number ): number {
  try {
    // Validate inputs
    if ( isNaN( lat1 ) || isNaN( lon1 ) || isNaN( lat2 ) || isNaN( lon2 ) ) {
      return Infinity
    }

    if ( lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90 ||
      lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180 ) {
      return Infinity
    }

    const R = 6371 // Earth's radius in kilometers
    const dLat = toRad( lat2 - lat1 )
    const dLon = toRad( lon2 - lon1 )
    const a =
      Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
      Math.cos( toRad( lat1 ) ) * Math.cos( toRad( lat2 ) ) *
      Math.sin( dLon / 2 ) * Math.sin( dLon / 2 )
    const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) )
    return R * c
  } catch ( error ) {
    console.warn( 'calculateDistance: Error calculating distance:', error )
    return Infinity
  }
}

function toRad( deg: number ): number {
  return deg * ( Math.PI / 180 )
}

/**
 * Enhanced historical progression for guided tours
 */
export function determineHistoricalProgression( context: GraphContext ): GraphContext['historicalProgression'] {
  try {
    if ( !context.timelineBounds.earliest && !context.timelineBounds.latest ) {
      return undefined
    }

    const currentYear = new Date().getFullYear()
    const earliest = context.timelineBounds.earliest?.getFullYear() || currentYear
    const latest = context.timelineBounds.latest?.getFullYear() || currentYear

    // Determine the current historical period
    let era = 'Modern Era'
    let nextSuggestedYear = currentYear
    let direction: 'forward' | 'backward' = 'forward'
    let rationale = 'Continue chronological exploration'

    // Historical period classification for UFO/UAP events
    if ( earliest >= 1945 && latest <= 1950 ) {
      era = 'Post-War UFO Genesis (1945-1950)'
      nextSuggestedYear = 1952
      rationale = 'Transition to systematic government investigation with Project Blue Book'
    } else if ( earliest >= 1950 && latest <= 1970 ) {
      era = 'Government Investigation Era (1950-1970)'
      nextSuggestedYear = 1975
      rationale = 'Move to post-Blue Book era with civilian research groups'
    } else if ( earliest >= 1970 && latest <= 1990 ) {
      era = 'Civilian Research Era (1970-1990)'
      nextSuggestedYear = 1995
      rationale = 'Enter modern disclosure movement and internet age'
    } else if ( earliest >= 1990 && latest <= 2010 ) {
      era = 'Modern Research Era (1990-2010)'
      nextSuggestedYear = 2017
      rationale = 'Move to current disclosure era with Pentagon UAP videos'
    } else if ( earliest >= 2010 ) {
      era = 'Disclosure Era (2010-Present)'
      nextSuggestedYear = currentYear
      rationale = 'Continue exploring current disclosure developments'
    }

    // Identify significant events in the current period
    const significantEvents = getSignificantEventsForPeriod( era )

    return {
      currentPeriod: {
        startYear: earliest,
        endYear: latest,
        era
      },
      significantEvents,
      nextChronologicalStep: {
        direction,
        suggestedYear: nextSuggestedYear,
        rationale
      }
    }
  } catch ( error ) {
    console.error( 'determineHistoricalProgression: Error determining progression:', error )
    return undefined
  }
}

/**
 * Get significant events for a historical period
 */
function getSignificantEventsForPeriod( era: string ): string[] {
  const eventMap: Record<string, string[]> = {
    'Post-War UFO Genesis (1945-1950)': [
      'Roswell Incident (1947)',
      'Kenneth Arnold Sighting (1947)',
      'Project Sign establishment (1948)',
      'Project Grudge (1949)'
    ],
    'Government Investigation Era (1950-1970)': [
      'Project Blue Book (1952-1969)',
      'Robertson Panel (1953)',
      'Washington D.C. UFO incident (1952)',
      'Condon Committee (1966-1968)'
    ],
    'Civilian Research Era (1970-1990)': [
      'MUFON founding (1969)',
      'CUFOS establishment by Hynek (1973)',
      'Phoenix Lights precursor events',
      'Abduction research era'
    ],
    'Modern Research Era (1990-2010)': [
      'Phoenix Lights (1997)',
      'French COMETA Report (1999)',
      'British MoD UAP desk',
      'Leslie Kean investigations'
    ],
    'Disclosure Era (2010-Present)': [
      'Pentagon UAP videos release (2017)',
      'UAPTF establishment (2020)',
      'Congressional UAP hearings (2022)',
      'AARO formation (2022)'
    ]
  }

  return eventMap[era] || []
}

/**
 * Generate tour-aware search rules
 */
export function generateTourAwareSearchRules( context: GraphContext ): string {
  const baseRules = generateContextualSearchRules( context )
  
  if ( !context.tourContext ) {
    return baseRules
  }

  const tourRules: string[] = []

  // Add tour-specific context
  if ( context.tourContext.tourMode === 'guided' ) {
    tourRules.push( `Following guided tour: ${context.tourContext.tourId}` )
    tourRules.push( `Current waypoint context: ${context.tourContext.narrativeContext}` )
    
    // Add chronological progression rules
    if ( context.tourContext.historicalProgression.chronologicalDirection === 'forward' ) {
      tourRules.push( `Focus on events that chronologically follow the current period, leading toward ${context.tourContext.historicalProgression.nextSuggestedPeriod}` )
    } else if ( context.tourContext.historicalProgression.chronologicalDirection === 'backward' ) {
      tourRules.push( `Explore events that preceded the current period, showing historical context and antecedents` )
    }
  } else {
    // Free-form exploration with historical awareness
    tourRules.push( 'Free-form exploration with intelligent historical context preservation' )
    
    if ( context.historicalProgression ) {
      tourRules.push( `Suggest chronological progression: ${context.historicalProgression.nextChronologicalStep.rationale}` )
    }
  }

  return [baseRules, tourRules.join( '. ' )].filter( Boolean ).join( '. ') + '.'
}

/**
 * Generates contextual search rules based on current graph
 */
export function generateContextualSearchRules( context: GraphContext ): string {
  try {
    if ( !context ) {
      return 'Find interesting records with clear relationships'
    }

    const rules: string[] = []

    // Add temporal constraints with historical progression awareness
    if ( context.timelineBounds.earliest && context.timelineBounds.latest ) {
      const earliestYear = context.timelineBounds.earliest.getFullYear()
      const latestYear = context.timelineBounds.latest.getFullYear()

      if ( earliestYear === latestYear ) {
        rules.push( `Focus on events from ${earliestYear}` )
      } else {
        rules.push( `Focus on events between ${earliestYear} and ${latestYear}` )
      }

      // Add historical progression suggestions
      if ( context.historicalProgression ) {
        rules.push( `Consider chronological progression toward ${context.historicalProgression.nextChronologicalStep.suggestedYear}` )
      }
    }

    // Add entity relationship constraints
    if ( context.keyPersonnel.length > 0 ) {
      const personnel = context.keyPersonnel.slice( 0, 3 ) // Limit to top 3 to avoid overly long rules
      rules.push( `Prioritize records involving: ${personnel.join( ', ' )}` )
    }

    if ( context.organizations.length > 0 ) {
      const orgs = context.organizations.slice( 0, 3 ) // Limit to top 3
      rules.push( `Include connections to organizations: ${orgs.join( ', ' )}` )
    }

    if ( context.relatedTopics.length > 0 ) {
      const topics = context.relatedTopics.slice( 0, 5 ) // Limit to top 5
      rules.push( `Focus on topics: ${topics.join( ', ' )}` )
    }

    // Add location constraints
    if ( context.locationContext ) {
      rules.push( `Consider geographic proximity to existing records within ${Math.round( context.locationContext.radius )}km` )
    }

    // Enhanced guided tour context for specific exploration paths
    const seedData = context.seedRecord?.data
    if ( seedData ) {
      const title = seedData.title?.toString() || ''
      const name = seedData.name?.toString() || ''
      const combinedText = ( title + ' ' + name ).toLowerCase()

      if ( combinedText.includes( 'roswell' ) ) {
        rules.push( 'Follow the chronological disclosure narrative starting from Roswell 1947' )
        rules.push( 'Include key witnesses, military personnel, and government agencies involved' )
        rules.push( 'Suggest progression to Project Sign/Grudge era (1948-1952)' )
      } else if ( combinedText.includes( 'phoenix lights' ) ) {
        rules.push( 'Focus on mass sighting events and witness testimonies' )
        rules.push( 'Include related civilian research organizations and investigators' )
      } else if ( combinedText.includes( 'blue book' ) || combinedText.includes( 'grudge' ) || combinedText.includes( 'sign' ) ) {
        rules.push( 'Include military and government investigation projects' )
        rules.push( 'Show evolution from early projects to modern UAP programs' )
      } else if ( combinedText.includes( 'pentagon' ) || combinedText.includes( 'uap' ) || combinedText.includes( '2017' ) ) {
        rules.push( 'Focus on modern disclosure era events and personnel' )
        rules.push( 'Include AATIP, UAPTF, AARO, and congressional involvement' )
      }
    }

    // Ensure we have at least one rule
    if ( rules.length === 0 ) {
      rules.push( 'Find records that connect to and expand the existing knowledge graph' )
    }

    return rules.join( '. ' ) + '.'
  } catch ( error ) {
    console.error( 'generateContextualSearchRules: Error generating contextual rules:', error )
    return 'Find interesting records with clear relationships.'
  }
}