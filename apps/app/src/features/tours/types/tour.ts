export interface TourDefinition {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  estimatedDuration: number // in minutes
  version: string
  createdAt: string
  updatedAt: string
  waypoints: TourWaypoint[]
  metadata?: TourMetadata
}

export interface TourWaypoint {
  id: string
  title: string
  description: string
  dbRef: DatabaseReference
  narrative: string
  contextRules: ContextRules
  visualSettings: WaypointVisualSettings
  prerequisites?: string[] // IDs of prerequisite waypoints
  triggers?: WaypointTrigger[]
  validation?: WaypointValidation
}

export interface DatabaseReference {
  type: 'events' | 'personnel' | 'topics' | 'organizations' | 'testimonies' | 'documents' | 'sightings'
  id: string
  table: string
  relationships?: {
    includes?: string[] // IDs of related records to include
    excludes?: string[] // IDs of related records to exclude
  }
}

export interface ContextRules {
  searchRules: string[]
  filterCriteria: FilterCriteria
  layoutPreferences: LayoutPreferences
}

export interface FilterCriteria {
  dateRange?: {
    start?: string
    end?: string
  }
  locationRadius?: {
    center: { lat: number; lng: number }
    radiusKm: number
  }
  entityTypes?: string[]
  keywords?: string[]
  excludeKeywords?: string[]
}

export interface LayoutPreferences {
  type: 'horizontal' | 'vertical' | 'radial' | 'grid'
  spacing: number
  centerChildren: boolean
  parentChildSpacing: number
  nodeWidth?: number
  nodeHeight?: number
}

export interface WaypointVisualSettings {
  highlightColor?: string
  nodeStyle?: 'default' | 'highlighted' | 'featured'
  showConnections?: boolean
  zoomLevel?: number
  centerOnLoad?: boolean
  animationDuration?: number
}

export interface WaypointTrigger {
  type: 'nodeClick' | 'timeDelay' | 'userAction' | 'contextMet'
  condition: string
  action: 'nextWaypoint' | 'showHint' | 'updateNarrative' | 'addNodes'
  data?: Record<string, unknown>
}

export interface WaypointValidation {
  required: boolean
  validationRules: ValidationRule[]
  errorMessage?: string
  retryAttempts?: number
}

export interface ValidationRule {
  type: 'nodeExists' | 'connectionExists' | 'userInteraction' | 'timeSpent'
  criteria: Record<string, unknown>
  message?: string
}

export interface TourMetadata {
  tags: string[]
  author: string
  sources: string[]
  lastTested: string
  compatibilityVersion: string
  relatedTours?: string[] // IDs of related tours
}

// Tour State Management Types
export interface TourState {
  isActive: boolean
  currentTourId: string | null
  currentWaypointIndex: number
  currentWaypointId: string | null
  progress: TourProgress
  history: TourHistoryEntry[]
  settings: TourSettings
}

export interface TourProgress {
  completedWaypoints: string[]
  totalWaypoints: number
  percentComplete: number
  timeSpent: number // in seconds
  startedAt: string
  estimatedTimeRemaining: number
}

export interface TourHistoryEntry {
  waypointId: string
  timestamp: string
  action: 'started' | 'completed' | 'skipped' | 'revisited'
  duration: number
  data?: Record<string, unknown>
}

export interface TourSettings {
  autoAdvance: boolean
  showHints: boolean
  playNarration: boolean
  skipValidation: boolean
  debugMode: boolean
}

// Tour Loading and Management Types
export interface TourLoadResult {
  success: boolean
  tour?: TourDefinition
  error?: string
  validationErrors?: string[]
}

export interface TourValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  type: 'missingReference' | 'invalidStructure' | 'cyclicDependency' | 'incompatibleVersion'
  waypointId?: string
  message: string
  field?: string
}

export interface ValidationWarning {
  type: 'deprecatedFeature' | 'performanceConcern' | 'missingOptional'
  waypointId?: string
  message: string
  suggestion?: string
}

// Tour Navigation Types
export interface TourNavigationContext {
  currentTour: TourDefinition
  currentWaypoint: TourWaypoint
  nextWaypoint?: TourWaypoint
  previousWaypoint?: TourWaypoint
  canAdvance: boolean
  canGoBack: boolean
  availableActions: TourAction[]
}

export interface TourAction {
  id: string
  label: string
  description: string
  type: 'navigation' | 'interaction' | 'utility'
  enabled: boolean
  handler: () => void | Promise<void>
}

// YAML Tour File Structure
export interface TourYAMLStructure {
  tour: {
    metadata: Omit<TourDefinition, 'waypoints'>
    waypoints: TourWaypointYAML[]
  }
}

export interface TourWaypointYAML {
  id: string
  title: string
  description: string
  narrative: string
  database: {
    type: string
    id: string
    table: string
    relationships?: {
      includes?: string[]
      excludes?: string[]
    }
  }
  context: {
    searchRules: string[]
    filters?: {
      dateRange?: { start?: string; end?: string }
      location?: { lat: number; lng: number; radius: number }
      types?: string[]
      keywords?: string[]
      exclude?: string[]
    }
    layout?: {
      type?: string
      spacing?: number
      centerChildren?: boolean
    }
  }
  visual: {
    highlight?: string
    style?: string
    zoom?: number
    center?: boolean
  }
  validation?: {
    required?: boolean
    rules?: Array<{
      type: string
      criteria: Record<string, unknown>
      message?: string
    }>
  }
}

// Events and Hooks
export type TourEventType =
  | 'tourStarted'
  | 'tourCompleted'
  | 'tourAborted'
  | 'waypointEntered'
  | 'waypointCompleted'
  | 'waypointFailed'
  | 'validationError'
  | 'navigationError'

export interface TourEvent {
  type: TourEventType
  tourId: string
  waypointId?: string
  timestamp: string
  data?: Record<string, unknown>
}

export type TourEventHandler = ( event: TourEvent ) => void | Promise<void> 