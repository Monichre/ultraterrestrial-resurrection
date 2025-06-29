import type { Node, Edge } from 'reactflow'

/**
 * Core tour type definitions for guided mindmap experiences
 */

export interface TourDefinition {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  estimatedDuration: number // in minutes
  tags: string[]
  waypoints: TourWaypoint[]
  metadata?: {
    author?: string
    createdAt?: string
    lastUpdated?: string
    version?: string
  }
}

export interface TourWaypoint {
  id: string
  title: string
  dbRef: DatabaseReference
  narrative: string
  contextRules: ContextRules
  visualSettings: WaypointVisualSettings
  connections?: WaypointConnection[]
  userActions?: UserAction[]
}

export interface DatabaseReference {
  type: 'events' | 'personnel' | 'topics' | 'organizations' | 'testimonies' | 'documents' | 'artifacts'
  id: string
  fallbackQuery?: string // Query to use if record not found
}

export interface ContextRules {
  // Rules for contextual intelligence when adding related records
  temporalWindow?: {
    startYear?: number
    endYear?: number
    relativeYears?: number // +/- years from current waypoint
  }
  entityFilters?: {
    types?: string[]
    excludeTypes?: string[]
    requiredTags?: string[]
    excludeTags?: string[]
  }
  relationshipRules?: {
    maxDegreesSeparation?: number
    requiredRelationships?: string[]
    prioritizeRelationships?: string[]
  }
  contentRules?: string[] // AI rules for content selection
}

export interface WaypointVisualSettings {
  cameraPosition?: {
    zoom: number
    center: { x: number; y: number }
  }
  highlightNodes?: string[]
  highlightEdges?: string[]
  dimOtherNodes?: boolean
  layoutPreference?: 'horizontal' | 'vertical' | 'radial' | 'grid'
  animationDuration?: number
}

export interface WaypointConnection {
  fromWaypointId: string
  toWaypointId: string
  connectionType: 'linear' | 'branching' | 'optional'
  transitionNarrative?: string
}

export interface UserAction {
  type: 'add_records' | 'explore_connections' | 'take_notes' | 'answer_question'
  prompt: string
  required: boolean
  validation?: {
    minRecords?: number
    maxRecords?: number
    requiredTypes?: string[]
  }
}

/**
 * Tour state management types
 */

export interface TourProgress {
  tourId: string
  currentWaypointId: string
  completedWaypoints: string[]
  skippedWaypoints: string[]
  userAddedNodes: string[] // Track nodes added by user during tour
  startedAt: string
  lastActiveAt: string
  completed: boolean
  completionTime?: string
}

export interface TourSession {
  tour: TourDefinition
  progress: TourProgress
  mindmapState: {
    nodes: Node[]
    edges: Edge[]
  }
  notes: TourNote[]
}

export interface TourNote {
  id: string
  waypointId: string
  content: string
  createdAt: string
  tags?: string[]
}

/**
 * Tour validation types
 */

export interface TourValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  waypointId?: string
  field: string
  message: string
  severity: 'error'
}

export interface ValidationWarning {
  waypointId?: string
  field: string
  message: string
  severity: 'warning'
}

/**
 * Predefined tour templates
 */

export interface TourTemplate {
  id: string
  name: string
  description: string
  baseDefinition: Partial<TourDefinition>
  suggestedWaypoints: Partial<TourWaypoint>[]
}

/**
 * Tour event types for tracking and analytics
 */

export type TourEvent = 
  | { type: 'tour_started'; tourId: string; timestamp: string }
  | { type: 'waypoint_reached'; tourId: string; waypointId: string; timestamp: string }
  | { type: 'waypoint_skipped'; tourId: string; waypointId: string; reason?: string; timestamp: string }
  | { type: 'node_added'; tourId: string; waypointId: string; nodeId: string; nodeType: string; timestamp: string }
  | { type: 'note_added'; tourId: string; waypointId: string; noteId: string; timestamp: string }
  | { type: 'tour_completed'; tourId: string; duration: number; timestamp: string }
  | { type: 'tour_abandoned'; tourId: string; lastWaypointId: string; timestamp: string }

/**
 * Tour configuration
 */

export interface TourConfig {
  enableAutoProgress?: boolean
  showProgressIndicator?: boolean
  allowSkipping?: boolean
  allowBacktracking?: boolean
  saveProgressToLocalStorage?: boolean
  analyticsEnabled?: boolean
}

/**
 * Helper type for tour URLs
 */

export interface TourUrlParams {
  tourId: string
  step?: number
  mode?: 'guided' | 'freeform'
}