import type { TourDefinition, TourProgress, TourValidationResult, ValidationError, ValidationWarning } from '../types/tour'
import type { Node } from '@xyflow/react'
import { getGraphContext, isRecordRelated, type GraphContext } from '@/features/mindmap/utils/contextual-intelligence'

/**
 * Enhanced tour validation for historical progression and mindmap integration
 * Validates tour flow, chronological consistency, and contextual relationships
 * 
 * Created: 2025-07-02
 */

/**
 * Validate complete tour flow and integration with mindmap context
 */
export async function validateTourFlow(
  tour: TourDefinition,
  currentNodes: Node[],
  tourProgress?: TourProgress
): Promise<TourValidationResult> {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  
  try {
    // Basic tour validation
    validateBasicTourStructure(tour, errors, warnings)
    
    // Validate historical progression between waypoints
    validateHistoricalProgression(tour, errors, warnings)
    
    // Validate contextual relationships between waypoints
    await validateContextualFlow(tour, currentNodes, errors, warnings)
    
    // Validate tour progress if provided
    if (tourProgress) {
      validateTourProgress(tour, tourProgress, errors, warnings)
    }
    
    // Validate waypoint accessibility and database references
    await validateWaypointAccessibility(tour, errors, warnings)
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  } catch (error) {
    errors.push({
      field: 'tour',
      message: `Tour validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'error'
    })
    
    return {
      valid: false,
      errors,
      warnings
    }
  }
}

/**
 * Validate basic tour structure and required fields
 */
function validateBasicTourStructure(
  tour: TourDefinition,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Required fields validation
  if (!tour.id) {
    errors.push({ field: 'id', message: 'Tour ID is required', severity: 'error' })
  }
  
  if (!tour.title) {
    errors.push({ field: 'title', message: 'Tour title is required', severity: 'error' })
  }
  
  if (!tour.waypoints || tour.waypoints.length === 0) {
    errors.push({ field: 'waypoints', message: 'Tour must have at least one waypoint', severity: 'error' })
    return // Can't validate further without waypoints
  }
  
  // Validate tour difficulty and duration
  if (!['beginner', 'intermediate', 'expert'].includes(tour.difficulty)) {
    warnings.push({ 
      field: 'difficulty', 
      message: 'Tour difficulty should be beginner, intermediate, or expert', 
      severity: 'warning' 
    })
  }
  
  if (!tour.estimatedDuration || tour.estimatedDuration <= 0) {
    warnings.push({ 
      field: 'estimatedDuration', 
      message: 'Tour should have a positive estimated duration', 
      severity: 'warning' 
    })
  }
  
  // Validate waypoint structure
  for (const waypoint of tour.waypoints) {
    validateWaypointStructure(waypoint, errors, warnings)
  }
}

/**
 * Validate individual waypoint structure
 */
function validateWaypointStructure(
  waypoint: any,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
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
    if (!waypoint.dbRef.type || !waypoint.dbRef.id) {
      errors.push({
        waypointId,
        field: 'dbRef',
        message: 'Database reference must have type and id',
        severity: 'error'
      })
    }
  }
  
  if (!waypoint.narrative) {
    warnings.push({ 
      waypointId, 
      field: 'narrative', 
      message: 'Waypoint narrative is recommended for better user experience', 
      severity: 'warning' 
    })
  }
  
  // Validate contextRules if present
  if (waypoint.contextRules) {
    validateContextRules(waypoint.contextRules, waypointId, warnings)
  }
  
  // Validate visualSettings if present
  if (waypoint.visualSettings) {
    validateVisualSettings(waypoint.visualSettings, waypointId, warnings)
  }
}

/**
 * Validate context rules for intelligent filtering
 */
function validateContextRules(
  contextRules: any,
  waypointId: string,
  warnings: ValidationWarning[]
): void {
  if (contextRules.temporalWindow) {
    const { startYear, endYear, relativeYears } = contextRules.temporalWindow
    
    if (startYear && endYear && startYear > endYear) {
      warnings.push({
        waypointId,
        field: 'contextRules.temporalWindow',
        message: 'Start year should be before end year',
        severity: 'warning'
      })
    }
    
    if (relativeYears && relativeYears < 0) {
      warnings.push({
        waypointId,
        field: 'contextRules.temporalWindow',
        message: 'Relative years should be positive',
        severity: 'warning'
      })
    }
    
    // Check for reasonable date ranges (UFO era should be 1947+)
    if (startYear && startYear < 1900) {
      warnings.push({
        waypointId,
        field: 'contextRules.temporalWindow',
        message: 'Start year seems unusually early for UFO research context',
        severity: 'warning'
      })
    }
  }
  
  if (contextRules.relationshipRules?.maxDegreesSeparation) {
    if (contextRules.relationshipRules.maxDegreesSeparation > 6) {
      warnings.push({
        waypointId,
        field: 'contextRules.relationshipRules',
        message: 'Max degrees of separation > 6 may lead to overly broad results',
        severity: 'warning'
      })
    }
  }
}

/**
 * Validate visual settings for waypoints
 */
function validateVisualSettings(
  visualSettings: any,
  waypointId: string,
  warnings: ValidationWarning[]
): void {
  if (visualSettings.cameraPosition) {
    const { zoom } = visualSettings.cameraPosition
    if (zoom !== undefined && (zoom < 0.1 || zoom > 5)) {
      warnings.push({
        waypointId,
        field: 'visualSettings.cameraPosition',
        message: 'Zoom level should be between 0.1 and 5 for optimal viewing',
        severity: 'warning'
      })
    }
  }
  
  if (visualSettings.animationDuration) {
    if (visualSettings.animationDuration > 5000) {
      warnings.push({
        waypointId,
        field: 'visualSettings.animationDuration',
        message: 'Animation duration > 5 seconds may feel slow to users',
        severity: 'warning'
      })
    }
  }
}

/**
 * Validate historical progression between waypoints
 */
function validateHistoricalProgression(
  tour: TourDefinition,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (tour.waypoints.length < 2) return // Can't validate progression with only one waypoint
  
  for (let i = 0; i < tour.waypoints.length - 1; i++) {
    const currentWaypoint = tour.waypoints[i]
    const nextWaypoint = tour.waypoints[i + 1]
    
    // Check temporal progression if both have temporal windows
    const currentTemporal = currentWaypoint.contextRules?.temporalWindow
    const nextTemporal = nextWaypoint.contextRules?.temporalWindow
    
    if (currentTemporal && nextTemporal) {
      const currentEndYear = currentTemporal.endYear || currentTemporal.startYear
      const nextStartYear = nextTemporal.startYear || nextTemporal.endYear
      
      if (currentEndYear && nextStartYear) {
        // Allow for some overlap, but warn about significant temporal jumps
        const timeDifference = nextStartYear - currentEndYear
        
        if (timeDifference > 20) {
          warnings.push({
            waypointId: nextWaypoint.id,
            field: 'contextRules.temporalWindow',
            message: `Large time gap (${timeDifference} years) between waypoints "${currentWaypoint.title}" and "${nextWaypoint.title}"`,
            severity: 'warning'
          })
        }
        
        if (timeDifference < -10) {
          warnings.push({
            waypointId: nextWaypoint.id,
            field: 'contextRules.temporalWindow',
            message: `Waypoint "${nextWaypoint.title}" goes backwards in time from "${currentWaypoint.title}"`,
            severity: 'warning'
          })
        }
      }
    }
    
    // Check for thematic consistency
    validateThematicProgression(currentWaypoint, nextWaypoint, warnings)
  }
}

/**
 * Validate thematic progression between consecutive waypoints
 */
function validateThematicProgression(
  currentWaypoint: any,
  nextWaypoint: any,
  warnings: ValidationWarning[]
): void {
  // Check for logical entity type progression
  const currentType = currentWaypoint.dbRef?.type
  const nextType = nextWaypoint.dbRef?.type
  
  if (currentType && nextType) {
    // Define logical progression paths
    const logicalProgressions: Record<string, string[]> = {
      'events': ['personnel', 'organizations', 'documents', 'testimonies'],
      'personnel': ['events', 'organizations', 'testimonies'],
      'organizations': ['events', 'personnel', 'documents'],
      'testimonies': ['personnel', 'events', 'documents'],
      'documents': ['events', 'organizations', 'personnel']
    }
    
    const validNextTypes = logicalProgressions[currentType] || []
    if (validNextTypes.length > 0 && !validNextTypes.includes(nextType)) {
      warnings.push({
        waypointId: nextWaypoint.id,
        field: 'dbRef.type',
        message: `Entity type progression from ${currentType} to ${nextType} may not follow typical research patterns`,
        severity: 'warning'
      })
    }
  }
}

/**
 * Validate contextual flow using the mindmap's contextual intelligence
 */
async function validateContextualFlow(
  tour: TourDefinition,
  currentNodes: Node[],
  errors: ValidationError[],
  warnings: ValidationWarning[]
): Promise<void> {
  if (tour.waypoints.length < 2 || currentNodes.length === 0) return
  
  // Get current graph context
  const graphContext = getGraphContext(currentNodes)
  if (!graphContext) return
  
  // Validate that each waypoint builds upon the previous context
  for (let i = 1; i < tour.waypoints.length; i++) {
    const waypoint = tour.waypoints[i]
    
    try {
      // Create a mock record based on waypoint data for relationship testing
      const mockRecord = {
        id: waypoint.dbRef.id,
        type: waypoint.dbRef.type,
        title: waypoint.title,
        // Add temporal context if available
        ...(waypoint.contextRules?.temporalWindow && {
          date: new Date(`${waypoint.contextRules.temporalWindow.startYear || 2000}-01-01`)
        })
      }
      
      // Check if this waypoint is contextually related to the existing graph
      const isRelated = isRecordRelated(mockRecord, graphContext)
      
      if (!isRelated) {
        warnings.push({
          waypointId: waypoint.id,
          field: 'contextual_flow',
          message: `Waypoint "${waypoint.title}" may not be contextually related to previous tour content`,
          severity: 'warning'
        })
      }
    } catch (error) {
      console.warn(`Error validating contextual flow for waypoint ${waypoint.id}:`, error)
    }
  }
}

/**
 * Validate tour progress consistency
 */
function validateTourProgress(
  tour: TourDefinition,
  tourProgress: TourProgress,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Check that progress references valid waypoints
  const waypointIds = new Set(tour.waypoints.map(w => w.id))
  
  if (!waypointIds.has(tourProgress.currentWaypointId)) {
    errors.push({
      field: 'progress.currentWaypointId',
      message: `Current waypoint ID "${tourProgress.currentWaypointId}" does not exist in tour`,
      severity: 'error'
    })
  }
  
  // Check completed waypoints
  for (const completedId of tourProgress.completedWaypoints) {
    if (!waypointIds.has(completedId)) {
      warnings.push({
        field: 'progress.completedWaypoints',
        message: `Completed waypoint ID "${completedId}" does not exist in current tour`,
        severity: 'warning'
      })
    }
  }
  
  // Check skipped waypoints
  for (const skippedId of tourProgress.skippedWaypoints) {
    if (!waypointIds.has(skippedId)) {
      warnings.push({
        field: 'progress.skippedWaypoints',
        message: `Skipped waypoint ID "${skippedId}" does not exist in current tour`,
        severity: 'warning'
      })
    }
  }
  
  // Validate timestamps
  const startTime = new Date(tourProgress.startedAt)
  const lastActiveTime = new Date(tourProgress.lastActiveAt)
  
  if (lastActiveTime < startTime) {
    errors.push({
      field: 'progress.timestamps',
      message: 'Last active time cannot be before start time',
      severity: 'error'
    })
  }
  
  if (tourProgress.completed && tourProgress.completionTime) {
    const completionTime = new Date(tourProgress.completionTime)
    if (completionTime < startTime) {
      errors.push({
        field: 'progress.completionTime',
        message: 'Completion time cannot be before start time',
        severity: 'error'
      })
    }
  }
}

/**
 * Validate waypoint accessibility and database references
 */
async function validateWaypointAccessibility(
  tour: TourDefinition,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): Promise<void> {
  // Note: In a real implementation, this would check database connectivity
  // and verify that referenced records exist
  
  for (const waypoint of tour.waypoints) {
    if (waypoint.dbRef && !waypoint.dbRef.fallbackQuery) {
      warnings.push({
        waypointId: waypoint.id,
        field: 'dbRef',
        message: 'Consider adding a fallback query in case the referenced record is not found',
        severity: 'warning'
      })
    }
    
    // Validate required user actions are achievable
    if (waypoint.userActions) {
      for (const action of waypoint.userActions) {
        if (action.required && action.validation) {
          if (action.validation.minRecords && action.validation.minRecords > 10) {
            warnings.push({
              waypointId: waypoint.id,
              field: 'userActions',
              message: `Required minimum of ${action.validation.minRecords} records may be difficult to achieve`,
              severity: 'warning'
            })
          }
        }
      }
    }
  }
}

/**
 * Validate tour for historical accuracy and research coherence
 */
export function validateHistoricalAccuracy(tour: TourDefinition): TourValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  
  // Define historical periods for UFO research
  const historicalPeriods = {
    'Pre-UFO Era': { start: 1900, end: 1946 },
    'Early UFO Era': { start: 1947, end: 1952 },
    'Government Investigation Era': { start: 1952, end: 1969 },
    'Post-Blue Book Era': { start: 1970, end: 1989 },
    'Modern Research Era': { start: 1990, end: 2009 },
    'Disclosure Era': { start: 2010, end: 2030 }
  }
  
  for (const waypoint of tour.waypoints) {
    if (waypoint.contextRules?.temporalWindow) {
      const { startYear, endYear } = waypoint.contextRules.temporalWindow
      
      if (startYear) {
        // Check for historically significant periods
        let appropriatePeriod = null
        for (const [period, range] of Object.entries(historicalPeriods)) {
          if (startYear >= range.start && startYear <= range.end) {
            appropriatePeriod = period
            break
          }
        }
        
        if (appropriatePeriod) {
          // Validate that the waypoint narrative mentions appropriate context
          const narrative = waypoint.narrative?.toLowerCase() || ''
          
          if (appropriatePeriod === 'Early UFO Era' && !narrative.includes('roswell') && !narrative.includes('arnold') && !narrative.includes('1947')) {
            warnings.push({
              waypointId: waypoint.id,
              field: 'narrative',
              message: 'Early UFO Era waypoint should reference foundational events like Roswell or Kenneth Arnold',
              severity: 'warning'
            })
          }
          
          if (appropriatePeriod === 'Government Investigation Era' && !narrative.includes('blue book') && !narrative.includes('air force') && !narrative.includes('investigation')) {
            warnings.push({
              waypointId: waypoint.id,
              field: 'narrative',
              message: 'Government Investigation Era waypoint should reference official investigation programs',
              severity: 'warning'
            })
          }
          
          if (appropriatePeriod === 'Disclosure Era' && !narrative.includes('pentagon') && !narrative.includes('uap') && !narrative.includes('disclosure')) {
            warnings.push({
              waypointId: waypoint.id,
              field: 'narrative',
              message: 'Disclosure Era waypoint should reference modern transparency efforts',
              severity: 'warning'
            })
          }
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Quick validation for tour loading
 */
export function quickValidate(tour: TourDefinition): boolean {
  return !!(
    tour.id &&
    tour.title &&
    tour.waypoints &&
    tour.waypoints.length > 0 &&
    tour.waypoints.every(w => w.id && w.title && w.dbRef)
  )
}

/**
 * Get validation summary for UI display
 */
export function getValidationSummary(validationResult: TourValidationResult): string {
  const { valid, errors, warnings } = validationResult
  
  if (valid && warnings.length === 0) {
    return 'Tour validation passed with no issues'
  }
  
  if (valid && warnings.length > 0) {
    return `Tour validation passed with ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`
  }
  
  return `Tour validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'} and ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`
}