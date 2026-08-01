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

const DECADE_SPAN = 10

/**
 * M0.5 data path: bounded Postgres query → SpacetimeEvent[] + stations.
 *
 * Uses the existing `getSightingsByTimeChunk` service (same substrate as
 * `/api/disclosure/uap-sightings`) via a server action so the canvas does
 * not need the INTERNAL_API_KEY header the REST route requires.
 *
 * Wide ranges are sampled per decade so `ORDER BY occurred_at DESC LIMIT n`
 * cannot collapse the canvas into only the most recent years.
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

  const sightings = await fetchStratifiedSightings(startYear, endYear, limit)
  const events = sightingsToSpacetimeEvents(sightings).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
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

async function fetchStratifiedSightings(
  startYear: number,
  endYear: number,
  limit: number,
) {
  const span = Math.max(1, endYear - startYear + 1)

  // Narrow windows: one query is fine.
  if (span <= DECADE_SPAN) {
    return getSightingsByTimeChunk(startYear, endYear, limit)
  }

  const decades: Array<{from: number; to: number}> = []
  const startDecade = Math.floor(startYear / DECADE_SPAN) * DECADE_SPAN
  for (let year = startDecade; year <= endYear; year += DECADE_SPAN) {
    const from = Math.max(startYear, year)
    const to = Math.min(endYear, year + DECADE_SPAN - 1)
    if (from <= to) decades.push({from, to})
  }

  const perDecade = Math.max(20, Math.ceil(limit / decades.length))
  const batches = await Promise.all(
    decades.map(({from, to}) => getSightingsByTimeChunk(from, to, perDecade)),
  )

  const byId = new Map<string, (typeof batches)[number][number]>()
  for (const batch of batches) {
    for (const sighting of batch) {
      byId.set(sighting.id, sighting)
    }
  }

  return [...byId.values()]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(0, limit)
}
