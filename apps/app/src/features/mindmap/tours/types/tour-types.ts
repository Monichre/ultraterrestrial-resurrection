/**
 * Tour System Type Definitions
 * Compatible with Universal Agent Tools architecture
 */

export interface TourWaypoint {
  id: string
  entityId: string
  entityType: 'events' | 'personnel' | 'organizations' | 'documents' | 'testimonies'
  title: string
  description: string
  narrative: string
  position: {
    x: number
    y: number
  }
  visited: boolean
  metadata: {
    date?: Date | string
    location?: string
    year: number
    era: string
    historicalSignificance: number
    relatedEntities: {
      personnel: string[]
      organizations: string[]
      topics: string[]
    }
    aiInsights: string[]
    [key: string]: any
  }
}

export interface Tour {
  id: string
  name: string
  description: string
  waypoints: TourWaypoint[]
  currentWaypointId: string
  metadata: {
    author?: string
    version?: string
    lastUpdated?: string
    tourType?: 'guided' | 'free-form'
    narrativeStyle?: string
    totalWaypoints: number
    eventsByEra?: any
    currentEra?: string
    [key: string]: any
  }
}

export interface TourProgress {
  current: number
  total: number
  percentage: number
}

export interface TourMode {
  mode: 'guided' | 'free-form'
  isActive: boolean
  currentTourId?: string
}

export interface TourContext {
  tourId: string
  tourMode: 'guided' | 'free-form'
  waypointId: string
  waypointIndex: number
  isCurrentWaypoint: boolean
  historicalProgression?: {
    currentEra: string
    nextSuggestedPeriod: string
    chronologicalDirection: 'forward' | 'backward' | 'context-based'
  }
  narrativeContext?: string
}

export interface TourNavigationResult {
  nextWaypoint: TourWaypoint | null
  relatedRecords: any[]
  spatialSuggestions: any[]
}

export interface TourSuggestions {
  relatedPersonnel: string[]
  relatedOrganizations: string[]
  suggestedExplorations: string[]
}