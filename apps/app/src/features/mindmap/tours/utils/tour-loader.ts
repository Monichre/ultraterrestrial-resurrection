import { xata } from '@db/xata/client'
import type { 
  TourDefinition, 
  TourValidationResult, 
  DatabaseReference,
  ValidationError,
  ValidationWarning 
} from '../types/tour'

/**
 * Tour loading and validation utilities
 * Handles YAML parsing, database reference validation, and tour content caching
 */

interface TourFile {
  content: string
  path: string
  lastModified?: string
}

// Cache for loaded tours
const tourCache = new Map<string, TourDefinition>()
const validationCache = new Map<string, TourValidationResult>()

/**
 * Load a tour definition from various sources
 */
export class TourLoader {
  
  /**
   * Load tour from YAML content
   */
  static async fromYaml(yamlContent: string): Promise<TourDefinition> {
    try {
      // For now, we'll parse JSON instead of YAML until we add YAML support
      // In a real implementation, you'd use a YAML parser like 'js-yaml'
      const tourData = JSON.parse(yamlContent) as TourDefinition
      
      // Validate basic structure
      if (!tourData.id || !tourData.title || !tourData.waypoints) {
        throw new Error('Invalid tour structure: missing required fields')
      }
      
      return tourData
    } catch (error) {
      throw new Error(`Failed to parse tour YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  /**
   * Load tour from a file path (for development/testing)
   */
  static async fromFile(filePath: string): Promise<TourDefinition> {
    // Check cache first
    if (tourCache.has(filePath)) {
      return tourCache.get(filePath)!
    }
    
    try {
      // In a real implementation, this would fetch from the file system
      // For now, we'll simulate loading from a predefined tour
      const tourData = await TourLoader.getBuiltinTour(filePath)
      
      // Cache the result
      tourCache.set(filePath, tourData)
      
      return tourData
    } catch (error) {
      throw new Error(`Failed to load tour from file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  /**
   * Load tour from API endpoint
   */
  static async fromApi(tourId: string): Promise<TourDefinition> {
    const cacheKey = `api:${tourId}`
    
    // Check cache first
    if (tourCache.has(cacheKey)) {
      return tourCache.get(cacheKey)!
    }
    
    try {
      const response = await fetch(`/api/tours/${tourId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch tour: ${response.statusText}`)
      }
      
      const tourData = await response.json() as TourDefinition
      
      // Cache the result
      tourCache.set(cacheKey, tourData)
      
      return tourData
    } catch (error) {
      throw new Error(`Failed to load tour from API: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  /**
   * Get a built-in tour (for development/demo purposes)
   */
  static async getBuiltinTour(tourId: string): Promise<TourDefinition> {
    const builtinTours: Record<string, TourDefinition> = {
      'roswell-disclosure': {
        id: 'roswell-disclosure',
        title: 'Roswell to Modern Disclosure',
        description: 'A journey from the 1947 Roswell incident through modern UAP disclosure efforts',
        difficulty: 'beginner',
        estimatedDuration: 45,
        tags: ['disclosure', 'historical', 'government'],
        waypoints: [
          {
            id: 'roswell-1947',
            title: 'The Roswell Incident (1947)',
            dbRef: {
              type: 'events',
              id: 'roswell-1947',
              fallbackQuery: 'Roswell incident 1947 crash debris'
            },
            narrative: `Welcome to your journey through UFO disclosure history. We begin with the most famous case in UFO lore: the Roswell incident of July 1947. This event, initially dismissed as a "weather balloon," would become the cornerstone of modern UFO research and government transparency demands.`,
            contextRules: {
              temporalWindow: { startYear: 1945, endYear: 1950 },
              entityFilters: { types: ['personnel', 'organizations'] },
              contentRules: [
                'Focus on military personnel involved in the incident',
                'Include government agencies that investigated the event',
                'Prioritize firsthand witnesses and official documents'
              ]
            },
            visualSettings: {
              cameraPosition: { zoom: 1.2, center: { x: 0, y: 0 } },
              layoutPreference: 'radial',
              animationDuration: 1000
            }
          },
          {
            id: 'project-blue-book',
            title: 'Project Blue Book Era (1952-1969)',
            dbRef: {
              type: 'organizations',
              id: 'project-blue-book',
              fallbackQuery: 'Project Blue Book Air Force UFO investigation'
            },
            narrative: `Following Roswell, the U.S. Air Force established systematic UFO investigation programs. Project Blue Book, the most famous of these, investigated over 12,000 reports from 1952 to 1969. This era represents the first official government acknowledgment of the UFO phenomenon.`,
            contextRules: {
              temporalWindow: { startYear: 1950, endYear: 1970 },
              entityFilters: { types: ['personnel', 'events', 'documents'] },
              contentRules: [
                'Include Project Blue Book investigators and consultants',
                'Show significant cases from this period',
                'Connect to other military investigation programs'
              ]
            },
            visualSettings: {
              layoutPreference: 'horizontal',
              highlightNodes: ['project-blue-book']
            }
          },
          {
            id: 'modern-disclosure',
            title: 'Modern Disclosure Movement (2017-Present)',
            dbRef: {
              type: 'events',
              id: 'pentagon-uap-videos-2017',
              fallbackQuery: 'Pentagon UAP videos disclosure 2017 To The Stars Academy'
            },
            narrative: `The modern disclosure era began in 2017 when the Pentagon officially released three UAP videos. This marked a dramatic shift from decades of secrecy to unprecedented government transparency about unidentified aerial phenomena.`,
            contextRules: {
              temporalWindow: { startYear: 2015, endYear: 2024 },
              entityFilters: { types: ['personnel', 'organizations', 'testimonies'] },
              contentRules: [
                'Focus on government officials involved in recent disclosure',
                'Include AATIP, UAPTF, and AARO programs',
                'Show congressional hearings and official reports'
              ]
            },
            visualSettings: {
              layoutPreference: 'grid',
              dimOtherNodes: true
            }
          }
        ],
        metadata: {
          author: 'Ultraterrestrial Research Team',
          createdAt: '2024-12-29',
          version: '1.0'
        }
      },
      
      'key-figures-network': {
        id: 'key-figures-network',
        title: 'Key Figures in UFO Research',
        description: 'Explore the network of researchers, witnesses, and officials who shaped UFO disclosure',
        difficulty: 'intermediate',
        estimatedDuration: 30,
        tags: ['personnel', 'researchers', 'witnesses'],
        waypoints: [
          {
            id: 'j-allen-hynek',
            title: 'Dr. J. Allen Hynek - The Scientific Approach',
            dbRef: {
              type: 'personnel',
              id: 'j-allen-hynek',
              fallbackQuery: 'J Allen Hynek astronomer Project Blue Book scientific'
            },
            narrative: `Dr. J. Allen Hynek transformed from UFO skeptic to believer, coining the "Close Encounters" classification system. As Project Blue Book's scientific consultant, he witnessed the evolution of official UFO investigation.`,
            contextRules: {
              entityFilters: { types: ['events', 'organizations', 'testimonies'] },
              relationshipRules: { maxDegreesSeparation: 2 },
              contentRules: [
                'Include cases Hynek investigated personally',
                'Show his academic and scientific connections',
                'Connect to modern researchers influenced by his work'
              ]
            },
            visualSettings: {
              layoutPreference: 'radial',
              highlightNodes: ['j-allen-hynek']
            }
          }
        ],
        metadata: {
          author: 'Ultraterrestrial Research Team',
          createdAt: '2024-12-29',
          version: '1.0'
        }
      }
    }
    
    if (!builtinTours[tourId]) {
      throw new Error(`Built-in tour '${tourId}' not found`)
    }
    
    return builtinTours[tourId]
  }
  
  /**
   * List available tours
   */
  static async listAvailableTours(): Promise<{ id: string; title: string; description: string }[]> {
    // In a real implementation, this would scan tour files or query a database
    return [
      {
        id: 'roswell-disclosure',
        title: 'Roswell to Modern Disclosure',
        description: 'A journey from the 1947 Roswell incident through modern UAP disclosure efforts'
      },
      {
        id: 'key-figures-network',
        title: 'Key Figures in UFO Research',
        description: 'Explore the network of researchers, witnesses, and officials who shaped UFO disclosure'
      }
    ]
  }
  
  /**
   * Clear tour cache
   */
  static clearCache(): void {
    tourCache.clear()
    validationCache.clear()
  }
  
  /**
   * Preload multiple tours for better performance
   */
  static async preloadTours(tourIds: string[]): Promise<void> {
    const loadPromises = tourIds.map(id => 
      TourLoader.getBuiltinTour(id).catch(error => {
        console.warn(`Failed to preload tour ${id}:`, error)
        return null
      })
    )
    
    await Promise.all(loadPromises)
  }
}

/**
 * Tour validation utilities
 */
export class TourValidator {
  
  /**
   * Validate a tour definition comprehensively
   */
  static async validateTour(tour: TourDefinition): Promise<TourValidationResult> {
    const cacheKey = `${tour.id}:${tour.metadata?.version || 'unknown'}`
    
    // Check cache first
    if (validationCache.has(cacheKey)) {
      return validationCache.get(cacheKey)!
    }
    
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    // Basic structure validation
    TourValidator.validateBasicStructure(tour, errors)
    
    // Validate waypoints
    for (const waypoint of tour.waypoints) {
      await TourValidator.validateWaypoint(waypoint, errors, warnings)
    }
    
    // Validate waypoint connections
    TourValidator.validateWaypointConnections(tour, errors, warnings)
    
    // Check for cycles
    TourValidator.detectCycles(tour, warnings)
    
    const result: TourValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings
    }
    
    // Cache the result
    validationCache.set(cacheKey, result)
    
    return result
  }
  
  /**
   * Validate basic tour structure
   */
  private static validateBasicStructure(tour: TourDefinition, errors: ValidationError[]): void {
    if (!tour.id) {
      errors.push({ field: 'id', message: 'Tour ID is required', severity: 'error' })
    }
    
    if (!tour.title) {
      errors.push({ field: 'title', message: 'Tour title is required', severity: 'error' })
    }
    
    if (!tour.waypoints || tour.waypoints.length === 0) {
      errors.push({ field: 'waypoints', message: 'Tour must have at least one waypoint', severity: 'error' })
    }
    
    if (tour.estimatedDuration && tour.estimatedDuration <= 0) {
      errors.push({ field: 'estimatedDuration', message: 'Estimated duration must be positive', severity: 'error' })
    }
  }
  
  /**
   * Validate individual waypoint
   */
  private static async validateWaypoint(
    waypoint: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): Promise<void> {
    const waypointId = waypoint.id || 'unknown'
    
    if (!waypoint.id) {
      errors.push({ 
        waypointId, 
        field: 'id', 
        message: 'Waypoint ID is required', 
        severity: 'error' 
      })
    }
    
    if (!waypoint.title) {
      errors.push({ 
        waypointId, 
        field: 'title', 
        message: 'Waypoint title is required', 
        severity: 'error' 
      })
    }
    
    if (!waypoint.dbRef) {
      errors.push({ 
        waypointId, 
        field: 'dbRef', 
        message: 'Database reference is required', 
        severity: 'error' 
      })
    } else {
      // Validate database reference
      await TourValidator.validateDatabaseReference(waypoint.dbRef, waypointId, errors, warnings)
    }
    
    if (!waypoint.narrative) {
      warnings.push({ 
        waypointId, 
        field: 'narrative', 
        message: 'Waypoint narrative is recommended for better user experience', 
        severity: 'warning' 
      })
    }
  }
  
  /**
   * Validate database reference exists
   */
  private static async validateDatabaseReference(
    dbRef: DatabaseReference,
    waypointId: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    try {
      if (!dbRef.type || !dbRef.id) {
        errors.push({
          waypointId,
          field: 'dbRef',
          message: 'Database reference must have type and id',
          severity: 'error'
        })
        return
      }
      
      // Check if the record exists in the database
      const record = await xata.db[dbRef.type].read(dbRef.id)
      
      if (!record) {
        if (dbRef.fallbackQuery) {
          warnings.push({
            waypointId,
            field: 'dbRef',
            message: `Referenced record ${dbRef.id} not found, will use fallback query`,
            severity: 'warning'
          })
        } else {
          errors.push({
            waypointId,
            field: 'dbRef',
            message: `Referenced record ${dbRef.id} not found and no fallback query provided`,
            severity: 'error'
          })
        }
      }
    } catch (error) {
      errors.push({
        waypointId,
        field: 'dbRef',
        message: `Failed to validate database reference: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      })
    }
  }
  
  /**
   * Validate waypoint connections
   */
  private static validateWaypointConnections(
    tour: TourDefinition,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const waypointIds = new Set(tour.waypoints.map(w => w.id))
    
    for (const waypoint of tour.waypoints) {
      if (waypoint.connections) {
        for (const connection of waypoint.connections) {
          if (!waypointIds.has(connection.fromWaypointId)) {
            errors.push({
              waypointId: waypoint.id,
              field: 'connections',
              message: `Connection references non-existent waypoint: ${connection.fromWaypointId}`,
              severity: 'error'
            })
          }
          
          if (!waypointIds.has(connection.toWaypointId)) {
            errors.push({
              waypointId: waypoint.id,
              field: 'connections',
              message: `Connection references non-existent waypoint: ${connection.toWaypointId}`,
              severity: 'error'
            })
          }
        }
      }
    }
  }
  
  /**
   * Detect cycles in tour paths
   */
  private static detectCycles(tour: TourDefinition, warnings: ValidationWarning[]): void {
    // Simple cycle detection - in a real implementation you'd use a proper graph algorithm
    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    
    const hasVisited = (waypointId: string): boolean => {
      if (recursionStack.has(waypointId)) {
        warnings.push({
          field: 'waypoints',
          message: `Potential cycle detected involving waypoint: ${waypointId}`,
          severity: 'warning'
        })
        return true
      }
      
      if (visited.has(waypointId)) {
        return false
      }
      
      visited.add(waypointId)
      recursionStack.add(waypointId)
      
      const waypoint = tour.waypoints.find(w => w.id === waypointId)
      if (waypoint?.connections) {
        for (const connection of waypoint.connections) {
          if (hasVisited(connection.toWaypointId)) {
            return true
          }
        }
      }
      
      recursionStack.delete(waypointId)
      return false
    }
    
    for (const waypoint of tour.waypoints) {
      if (!visited.has(waypoint.id)) {
        hasVisited(waypoint.id)
      }
    }
  }
}

/**
 * Error handling for tour loading
 */
export class TourLoadError extends Error {
  constructor(
    message: string,
    public readonly tourId?: string,
    public readonly validationErrors?: ValidationError[]
  ) {
    super(message)
    this.name = 'TourLoadError'
  }
}

/**
 * Utility functions for tour management
 */
export const tourUtils = {
  
  /**
   * Get the estimated completion time for a tour
   */
  getEstimatedCompletionTime(tour: TourDefinition, progressPercentage: number): number {
    const remainingPercentage = 100 - progressPercentage
    return Math.round((tour.estimatedDuration * remainingPercentage) / 100)
  },
  
  /**
   * Generate a tour URL for sharing
   */
  generateTourUrl(tourId: string, waypointIndex?: number): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = new URL('/mindmap', baseUrl)
    url.searchParams.set('tourId', tourId)
    if (waypointIndex !== undefined) {
      url.searchParams.set('step', waypointIndex.toString())
    }
    return url.toString()
  },
  
  /**
   * Export tour session data
   */
  exportTourSession(session: any): string {
    return JSON.stringify(session, null, 2)
  },
  
  /**
   * Import tour session data
   */
  importTourSession(sessionData: string): any {
    try {
      return JSON.parse(sessionData)
    } catch (error) {
      throw new Error('Invalid tour session data')
    }
  }
}