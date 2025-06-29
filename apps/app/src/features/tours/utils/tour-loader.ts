import { parse as parseYaml } from 'yaml'
import type {
  TourDefinition,
  TourWaypoint,
  TourYAMLStructure,
  TourWaypointYAML,
  TourLoadResult,
  TourValidationResult,
  ValidationError,
  ValidationWarning,
  DatabaseReference,
  ContextRules,
  FilterCriteria,
  LayoutPreferences,
  WaypointVisualSettings
} from '../types/tour'

// Cache for loaded tours
const tourCache = new Map<string, TourDefinition>()
const cacheExpiry = new Map<string, number>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Database validation functions
interface DatabaseValidator {
  validateRecord: ( type: string, id: string ) => Promise<boolean>
  validateTable: ( table: string ) => Promise<boolean>
  getRelatedRecords: ( type: string, id: string ) => Promise<string[]>
}

let dbValidator: DatabaseValidator | null = null

export function setDatabaseValidator( validator: DatabaseValidator ) {
  dbValidator = validator
}

/**
 * Load and parse a tour from a YAML file or string
 */
export async function loadTourFromYAML(
  source: string | File,
  options: {
    validate?: boolean
    useCache?: boolean
    cacheKey?: string
  } = {}
): Promise<TourLoadResult> {
  const { validate = true, useCache = true, cacheKey } = options

  try {
    // Check cache first
    if ( useCache && cacheKey ) {
      const cached = getCachedTour( cacheKey )
      if ( cached ) {
        return { success: true, tour: cached }
      }
    }

    // Parse YAML content
    let yamlContent: string

    if ( typeof source === 'string' ) {
      yamlContent = source
    } else {
      yamlContent = await source.text()
    }

    const yamlData = parseYaml( yamlContent ) as TourYAMLStructure

    // Convert YAML structure to TourDefinition
    const tour = await convertYAMLToTourDefinition( yamlData )

    // Validate the tour if requested
    if ( validate ) {
      const validationResult = await validateTour( tour )
      if ( !validationResult.isValid ) {
        return {
          success: false,
          error: 'Tour validation failed',
          validationErrors: validationResult.errors.map( e => e.message )
        }
      }
    }

    // Cache the tour
    if ( useCache && cacheKey ) {
      setCachedTour( cacheKey, tour )
    }

    return { success: true, tour }

  } catch ( error ) {
    console.error( 'Error loading tour from YAML:', error )
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error loading tour'
    }
  }
}

/**
 * Load a tour from a URL or file path
 */
export async function loadTourFromURL(
  url: string,
  options: {
    validate?: boolean
    useCache?: boolean
  } = {}
): Promise<TourLoadResult> {
  const { validate = true, useCache = true } = options

  try {
    // Check cache first
    if ( useCache ) {
      const cached = getCachedTour( url )
      if ( cached ) {
        return { success: true, tour: cached }
      }
    }

    const response = await fetch( url )
    if ( !response.ok ) {
      throw new Error( `Failed to fetch tour: ${response.status} ${response.statusText}` )
    }

    const yamlContent = await response.text()

    return loadTourFromYAML( yamlContent, {
      validate,
      useCache,
      cacheKey: url
    } )

  } catch ( error ) {
    console.error( 'Error loading tour from URL:', error )
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error loading tour from URL'
    }
  }
}

/**
 * Convert YAML structure to TourDefinition
 */
async function convertYAMLToTourDefinition( yamlData: TourYAMLStructure ): Promise<TourDefinition> {
  const { tour } = yamlData

  // Convert waypoints from YAML format
  const waypoints: TourWaypoint[] = await Promise.all(
    tour.waypoints.map( async ( waypointYaml ) => convertWaypointYAMLToWaypoint( waypointYaml ) )
  )

  return {
    id: tour.metadata.id,
    title: tour.metadata.title,
    description: tour.metadata.description,
    difficulty: tour.metadata.difficulty,
    estimatedDuration: tour.metadata.estimatedDuration,
    version: tour.metadata.version,
    createdAt: tour.metadata.createdAt,
    updatedAt: tour.metadata.updatedAt,
    waypoints,
    metadata: tour.metadata.metadata
  }
}

/**
 * Convert YAML waypoint to TourWaypoint
 */
async function convertWaypointYAMLToWaypoint( waypointYaml: TourWaypointYAML ): Promise<TourWaypoint> {
  // Convert database reference
  const dbRef: DatabaseReference = {
    type: waypointYaml.database.type as DatabaseReference['type'],
    id: waypointYaml.database.id,
    table: waypointYaml.database.table,
    relationships: waypointYaml.database.relationships
  }

  // Convert filter criteria
  const filterCriteria: FilterCriteria = {}

  if ( waypointYaml.context.filters ) {
    const filters = waypointYaml.context.filters

    if ( filters.dateRange ) {
      filterCriteria.dateRange = filters.dateRange
    }

    if ( filters.location ) {
      filterCriteria.locationRadius = {
        center: { lat: filters.location.lat, lng: filters.location.lng },
        radiusKm: filters.location.radius
      }
    }

    if ( filters.types ) {
      filterCriteria.entityTypes = filters.types
    }

    if ( filters.keywords ) {
      filterCriteria.keywords = filters.keywords
    }

    if ( filters.exclude ) {
      filterCriteria.excludeKeywords = filters.exclude
    }
  }

  // Convert layout preferences
  const layoutPreferences: LayoutPreferences = {
    type: ( waypointYaml.context.layout?.type as LayoutPreferences['type'] ) || 'horizontal',
    spacing: waypointYaml.context.layout?.spacing || 50,
    centerChildren: waypointYaml.context.layout?.centerChildren ?? true,
    parentChildSpacing: 100 // Default value
  }

  // Convert context rules
  const contextRules: ContextRules = {
    searchRules: waypointYaml.context.searchRules,
    filterCriteria,
    layoutPreferences
  }

  // Convert visual settings
  const visualSettings: WaypointVisualSettings = {
    highlightColor: waypointYaml.visual.highlight,
    nodeStyle: ( waypointYaml.visual.style as WaypointVisualSettings['nodeStyle'] ) || 'default',
    zoomLevel: waypointYaml.visual.zoom,
    centerOnLoad: waypointYaml.visual.center
  }

  return {
    id: waypointYaml.id,
    title: waypointYaml.title,
    description: waypointYaml.description,
    dbRef,
    narrative: waypointYaml.narrative,
    contextRules,
    visualSettings,
    validation: waypointYaml.validation ? {
      required: waypointYaml.validation.required ?? false,
      validationRules: waypointYaml.validation.rules?.map( rule => ( {
        type: rule.type as any,
        criteria: rule.criteria,
        message: rule.message
      } ) ) || []
    } : undefined
  }
}

/**
 * Validate a tour definition
 */
export async function validateTour( tour: TourDefinition ): Promise<TourValidationResult> {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Basic structure validation
  if ( !tour.id || tour.id.trim() === '' ) {
    errors.push( {
      type: 'invalidStructure',
      message: 'Tour must have a valid ID',
      field: 'id'
    } )
  }

  if ( !tour.title || tour.title.trim() === '' ) {
    errors.push( {
      type: 'invalidStructure',
      message: 'Tour must have a title',
      field: 'title'
    } )
  }

  if ( !tour.waypoints || tour.waypoints.length === 0 ) {
    errors.push( {
      type: 'invalidStructure',
      message: 'Tour must have at least one waypoint',
      field: 'waypoints'
    } )
  }

  // Validate waypoints
  const waypointIds = new Set<string>()

  for ( const waypoint of tour.waypoints ) {
    // Check for duplicate waypoint IDs
    if ( waypointIds.has( waypoint.id ) ) {
      errors.push( {
        type: 'invalidStructure',
        waypointId: waypoint.id,
        message: `Duplicate waypoint ID: ${waypoint.id}`,
        field: 'waypoints'
      } )
    }
    waypointIds.add( waypoint.id )

    // Validate database references
    if ( dbValidator ) {
      try {
        const recordExists = await dbValidator.validateRecord( waypoint.dbRef.type, waypoint.dbRef.id )
        if ( !recordExists ) {
          errors.push( {
            type: 'missingReference',
            waypointId: waypoint.id,
            message: `Database record not found: ${waypoint.dbRef.type}/${waypoint.dbRef.id}`,
            field: 'dbRef'
          } )
        }

        const tableExists = await dbValidator.validateTable( waypoint.dbRef.table )
        if ( !tableExists ) {
          errors.push( {
            type: 'missingReference',
            waypointId: waypoint.id,
            message: `Database table not found: ${waypoint.dbRef.table}`,
            field: 'dbRef.table'
          } )
        }
      } catch ( error ) {
        warnings.push( {
          type: 'performanceConcern',
          waypointId: waypoint.id,
          message: `Could not validate database reference: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestion: 'Check database connectivity and permissions'
        } )
      }
    } else {
      warnings.push( {
        type: 'missingOptional',
        waypointId: waypoint.id,
        message: 'Database validator not configured - skipping database reference validation',
        suggestion: 'Set up database validator for comprehensive validation'
      } )
    }

    // Validate prerequisite references
    if ( waypoint.prerequisites ) {
      for ( const prereqId of waypoint.prerequisites ) {
        if ( !waypointIds.has( prereqId ) ) {
          // Check if this prerequisite exists in the waypoints we haven't processed yet
          const prereqExists = tour.waypoints.some( w => w.id === prereqId )
          if ( !prereqExists ) {
            errors.push( {
              type: 'missingReference',
              waypointId: waypoint.id,
              message: `Prerequisite waypoint not found: ${prereqId}`,
              field: 'prerequisites'
            } )
          }
        }
      }
    }
  }

  // Check for cyclic dependencies in prerequisites
  const cyclicDependencies = findCyclicDependencies( tour.waypoints )
  for ( const cycle of cyclicDependencies ) {
    errors.push( {
      type: 'cyclicDependency',
      message: `Cyclic dependency detected: ${cycle.join( ' -> ' )}`,
      field: 'prerequisites'
    } )
  }

  // Version compatibility check
  if ( tour.version && tour.metadata?.compatibilityVersion ) {
    const isCompatible = checkVersionCompatibility( tour.version, tour.metadata.compatibilityVersion )
    if ( !isCompatible ) {
      warnings.push( {
        type: 'deprecatedFeature',
        message: `Tour version ${tour.version} may not be compatible with system version ${tour.metadata.compatibilityVersion}`,
        suggestion: 'Consider updating the tour to the latest version'
      } )
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Find cyclic dependencies in waypoint prerequisites
 */
function findCyclicDependencies( waypoints: TourWaypoint[] ): string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  // Build adjacency list
  const adjList = new Map<string, string[]>()
  for ( const waypoint of waypoints ) {
    adjList.set( waypoint.id, waypoint.prerequisites || [] )
  }

  function dfs( waypointId: string, path: string[] ): void {
    if ( recursionStack.has( waypointId ) ) {
      // Found a cycle
      const cycleStart = path.indexOf( waypointId )
      if ( cycleStart !== -1 ) {
        cycles.push( [...path.slice( cycleStart ), waypointId] )
      }
      return
    }

    if ( visited.has( waypointId ) ) {
      return
    }

    visited.add( waypointId )
    recursionStack.add( waypointId )
    path.push( waypointId )

    const dependencies = adjList.get( waypointId ) || []
    for ( const depId of dependencies ) {
      dfs( depId, path )
    }

    recursionStack.delete( waypointId )
    path.pop()
  }

  for ( const waypoint of waypoints ) {
    if ( !visited.has( waypoint.id ) ) {
      dfs( waypoint.id, [] )
    }
  }

  return cycles
}

/**
 * Check version compatibility
 */
function checkVersionCompatibility( tourVersion: string, systemVersion: string ): boolean {
  // Simple semantic version comparison
  const parseTourVersion = ( version: string ) => {
    const parts = version.split( '.' ).map( Number )
    return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 }
  }

  const tour = parseTourVersion( tourVersion )
  const system = parseTourVersion( systemVersion )

  // Major version must match, minor can be different
  return tour.major === system.major
}

/**
 * Cache management
 */
function getCachedTour( key: string ): TourDefinition | null {
  const expiry = cacheExpiry.get( key )
  if ( expiry && Date.now() > expiry ) {
    tourCache.delete( key )
    cacheExpiry.delete( key )
    return null
  }

  return tourCache.get( key ) || null
}

function setCachedTour( key: string, tour: TourDefinition ): void {
  tourCache.set( key, tour )
  cacheExpiry.set( key, Date.now() + CACHE_DURATION )
}

/**
 * Clear tour cache
 */
export function clearTourCache(): void {
  tourCache.clear()
  cacheExpiry.clear()
}

/**
 * Get available tours from a directory or API endpoint
 */
export async function getAvailableTours( source: string ): Promise<{
  tours: Array<{ id: string; title: string; description: string; difficulty: string }>
  error?: string
}> {
  try {
    // This would typically make an API call or read from a directory
    // For now, return a placeholder
    const response = await fetch( `${source}/tours/index.json` )

    if ( !response.ok ) {
      throw new Error( `Failed to fetch tours index: ${response.status}` )
    }

    const toursIndex = await response.json()
    return { tours: toursIndex.tours || [] }

  } catch ( error ) {
    console.error( 'Error fetching available tours:', error )
    return {
      tours: [],
      error: error instanceof Error ? error.message : 'Unknown error fetching tours'
    }
  }
}

/**
 * Pre-load multiple tours for better performance
 */
export async function preloadTours( tourIds: string[], baseUrl: string ): Promise<void> {
  const loadPromises = tourIds.map( async ( tourId ) => {
    try {
      const url = `${baseUrl}/tours/${tourId}.yaml`
      await loadTourFromURL( url, { useCache: true } )
    } catch ( error ) {
      console.warn( `Failed to preload tour ${tourId}:`, error )
    }
  } )

  await Promise.allSettled( loadPromises )
} 