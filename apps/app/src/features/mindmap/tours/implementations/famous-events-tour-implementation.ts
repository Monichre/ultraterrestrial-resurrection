/**
 * Famous Events Chronological Tour Implementation
 * Uses Universal Agent Tools for intelligent tour progression
 */

import { getFamousEventsByEra, getDefaultFamousEvents } from '@/services/sightings/get-famous-events'
import type { UltraterrestrialAgentTools, AgentExecutionContext, DatabaseSearchParams, NarrativeContextParams } from '../../tools/ultraterrestrial-agent-tools'
import type { TourWaypoint, Tour } from '../types/tour-types'
import tourConfig from '../famous-events-chronological-tour.json'

export class FamousEventsChronologicalTour {
  private agentTools: UltraterrestrialAgentTools
  private context: AgentExecutionContext
  private currentEraIndex: number = 0
  private eras = [
    'Post-War Genesis (1945-1950)',
    'Government Investigation Era (1950-1970)', 
    'Civilian Research Era (1970-1990)',
    'Modern Research Era (1990-2010)',
    'Disclosure Era (2010-Present)'
  ]

  constructor(agentTools: UltraterrestrialAgentTools, context: AgentExecutionContext) {
    this.agentTools = agentTools
    this.context = context
  }

  /**
   * Initialize the tour with famous events
   */
  async initializeTour(): Promise<Tour> {
    // Get famous events from database or fallback
    const famousEvents = await getDefaultFamousEvents()
    const eventsByEra = await getFamousEventsByEra()

    // Create waypoints from famous events
    const waypoints: TourWaypoint[] = []
    
    for (const event of famousEvents) {
      const waypoint = await this.createSmartWaypoint(event)
      waypoints.push(waypoint)
    }

    // Create the tour structure
    const tour: Tour = {
      id: tourConfig.id,
      name: tourConfig.name,
      description: tourConfig.description,
      waypoints,
      currentWaypointId: waypoints[0]?.id || '',
      metadata: {
        ...tourConfig.metadata,
        totalWaypoints: waypoints.length,
        eventsByEra,
        currentEra: this.eras[0]
      }
    }

    return tour
  }

  /**
   * Create a smart waypoint using universal agent tools
   */
  private async createSmartWaypoint(event: any): Promise<TourWaypoint> {
    // Use narrative context tool to enrich the waypoint
    const narrativeParams: NarrativeContextParams = {
      currentGraphContext: {
        nodes: [event],
        centerNode: event
      },
      narrativeQuery: `Historical significance of ${event.title} in UFO disclosure timeline`,
      searchDepth: 'contextual',
      disclosurePhase: this.determineDisclosurePhase(event.year || new Date(event.date).getFullYear()),
      maxRelatedRecords: 10,
      includeGeographicContext: true
    }

    const narrativeContext = await this.agentTools.analyzeNarrativeContext(narrativeParams)

    // Create enhanced waypoint with AI context
    const waypoint: TourWaypoint = {
      id: event.id || `waypoint-${Date.now()}`,
      entityId: event.id,
      entityType: 'events',
      title: event.title,
      description: event.description,
      narrative: this.generateNarrative(event, narrativeContext),
      position: {
        x: 0, // Will be calculated by layout engine
        y: 0
      },
      visited: false,
      metadata: {
        date: event.date,
        location: event.location,
        year: event.year || new Date(event.date).getFullYear(),
        era: this.determineEra(event.year || new Date(event.date).getFullYear()),
        historicalSignificance: narrativeContext.narrativeContext?.disclosureNarrative.significantEvents.length || 0,
        relatedEntities: narrativeContext.narrativeContext?.contextualIntelligence.relatedEntities || {},
        aiInsights: narrativeContext.suggestedNextActions || []
      }
    }

    return waypoint
  }

  /**
   * Progress to next waypoint using agent tools
   */
  async progressToNextWaypoint(currentWaypointId: string): Promise<{
    nextWaypoint: TourWaypoint | null,
    relatedRecords: any[],
    spatialSuggestions: any[]
  }> {
    // Find current waypoint index
    const tour = await this.initializeTour() // In real implementation, this would be cached
    const currentIndex = tour.waypoints.findIndex(w => w.id === currentWaypointId)
    
    if (currentIndex === -1 || currentIndex >= tour.waypoints.length - 1) {
      return { nextWaypoint: null, relatedRecords: [], spatialSuggestions: [] }
    }

    const nextWaypoint = tour.waypoints[currentIndex + 1]

    // Use database search to find related records
    const searchParams: DatabaseSearchParams = {
      query: `Events related to ${nextWaypoint.title} between ${nextWaypoint.metadata.year - 5} and ${nextWaypoint.metadata.year + 5}`,
      table: 'events',
      context: `Finding events connected to ${nextWaypoint.title} for historical context`,
      historicalFilter: {
        mode: 'chronological',
        dateRange: {
          startYear: nextWaypoint.metadata.year - 5,
          endYear: nextWaypoint.metadata.year + 5
        }
      },
      searchDepth: 'detailed',
      includeRelationships: true
    }

    const searchResult = await this.agentTools.searchDatabase(searchParams)

    return {
      nextWaypoint,
      relatedRecords: searchResult.searchResults?.records || [],
      spatialSuggestions: searchResult.suggestedNextActions || []
    }
  }

  /**
   * Get contextual suggestions for current waypoint
   */
  async getContextualSuggestions(waypointId: string): Promise<{
    relatedPersonnel: string[],
    relatedOrganizations: string[],
    suggestedExplorations: string[]
  }> {
    const tour = await this.initializeTour()
    const waypoint = tour.waypoints.find(w => w.id === waypointId)
    
    if (!waypoint) {
      return { relatedPersonnel: [], relatedOrganizations: [], suggestedExplorations: [] }
    }

    // Use narrative context analysis
    const narrativeParams: NarrativeContextParams = {
      currentGraphContext: {
        nodes: [waypoint],
        centerNode: waypoint
      },
      narrativeQuery: `Key figures and organizations involved in ${waypoint.title}`,
      searchDepth: 'comprehensive',
      maxRelatedRecords: 20,
      includeGeographicContext: false
    }

    const narrativeResult = await this.agentTools.analyzeNarrativeContext(narrativeParams)

    return {
      relatedPersonnel: narrativeResult.narrativeContext?.contextualIntelligence.relatedEntities.personnel || [],
      relatedOrganizations: narrativeResult.narrativeContext?.contextualIntelligence.relatedEntities.organizations || [],
      suggestedExplorations: narrativeResult.suggestedNextActions || []
    }
  }

  /**
   * Helper methods
   */
  private determineEra(year: number): string {
    if (year >= 1945 && year <= 1950) return this.eras[0]
    if (year > 1950 && year <= 1970) return this.eras[1]
    if (year > 1970 && year <= 1990) return this.eras[2]
    if (year > 1990 && year <= 2010) return this.eras[3]
    return this.eras[4]
  }

  private determineDisclosurePhase(year: number): 'genesis' | 'investigation' | 'civilian' | 'modern' | 'disclosure' {
    if (year >= 1945 && year <= 1950) return 'genesis'
    if (year > 1950 && year <= 1970) return 'investigation'
    if (year > 1970 && year <= 1990) return 'civilian'
    if (year > 1990 && year <= 2010) return 'modern'
    return 'disclosure'
  }

  private generateNarrative(event: any, narrativeContext: any): string {
    const base = `${event.title} represents a pivotal moment in UFO history. `
    const significance = narrativeContext.narrativeContext?.disclosureNarrative.significantEvents?.[0] || ''
    const progression = narrativeContext.narrativeContext?.disclosureNarrative.historicalProgression?.rationale || ''
    
    return base + significance + ' ' + progression
  }
}