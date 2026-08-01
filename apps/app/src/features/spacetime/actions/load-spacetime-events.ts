'use server'

import {getSightingsByTimeChunk} from '@/services/sightings/get-sightings'
import {sightingsToSpacetimeEvents} from '../lib/normalize'
import {buildTemporalStations} from '../lib/temporal-stations'
import type {SpacetimeEvent, TemporalStation} from '../types/spacetime'

export interface LoadSpacetimeEventsInput {
  startYear?: number
  endYear?: number
  limit?: number
}

export interface LoadSpacetimeEventsResult {
  events: SpacetimeEvent[]
  stations: TemporalStation[]
  timeRange: {startYear: number; endYear: number}
  /** Events that have coordinates — what the globe can render */
  geolocatedCount: number
}

/**
 * M0.5 data path: bounded Postgres query → SpacetimeEvent[] + stations.
 *
 * Uses the existing `getSightingsByTimeChunk` service (same substrate as
 * `/api/disclosure/uap-sightings`) via a server action so the canvas does
 * not need the INTERNAL_API_KEY header the REST route requires.
 *
 * Does NOT load static `/sightings.geojson`.
 */
export async function loadSpacetimeEvents(
  input: LoadSpacetimeEventsInput = {},
): Promise<LoadSpacetimeEventsResult> {
  const startYear = input.startYear ?? 1940
  const endYear = input.endYear ?? new Date().getUTCFullYear()
  // Keep first paint bounded; later milestones page by viewport + cursor.
  const limit = Math.min(input.limit ?? 400, 800)

  const sightings = await getSightingsByTimeChunk(startYear, endYear, limit)
  const events = sightingsToSpacetimeEvents(sightings)
  const stations = buildTemporalStations(events, {
    historicalStartYear: startYear,
    historicalEndYear: endYear,
  })

  return {
    events,
    stations,
    timeRange: {startYear, endYear},
    geolocatedCount: events.filter((e) => e.coordinates).length,
  }
}
