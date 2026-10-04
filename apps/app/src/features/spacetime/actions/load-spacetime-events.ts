'use server'

import {
  countEventsByTimeChunk,
  getEventsByTimeChunk,
} from '@/services/sightings/get-events'
import {eventRecordsToSpacetimeEvents} from '../lib/normalize'
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
 * Cap on how many windows the stratified fetch will open. The canvas spans
 * antiquity to the present, so a fixed decade window would issue ~180 queries
 * for the default range; windows widen instead to stay under this bound.
 */
const MAX_WINDOWS = 24

/**
 * Earliest year the corpus covers. The oldest `events` row is "Angel hair",
 * 196 CE — a classical account, not bad data. Defaulting to 1940 (as the
 * sightings-backed version did) silently discarded the deep-time records the
 * Temporal Observatory exists to show: Nuremberg 1561, Basel 1566, the
 * Thutmose III stele, Utsuro-bune 1803, Aurora Texas 1897, Tunguska 1908.
 */
const CORPUS_START_YEAR = 100

/**
 * M0.5 data path: bounded Postgres query → SpacetimeEvent[] + stations.
 *
 * Sources the curated `events` table — named, described historical incidents —
 * via a server action so the canvas does not need the INTERNAL_API_KEY header
 * the REST route requires. It does NOT read `sightings` (43k raw uncorroborated
 * reports) and does NOT load static `/sightings.geojson`.
 *
 * Wide ranges are sampled per window so `ORDER BY date DESC LIMIT n` cannot
 * collapse the canvas into only the most recent years.
 */
export async function loadSpacetimeEvents(
  input: LoadSpacetimeEventsInput = {},
): Promise<LoadSpacetimeEventsResult> {
  const startYear = input.startYear ?? CORPUS_START_YEAR
  const endYear = input.endYear ?? new Date().getUTCFullYear()
  // Keep first paint bounded; later milestones page by viewport + cursor.
  const limit = Math.min(input.limit ?? 400, 800)

  const records = await fetchStratifiedEvents(startYear, endYear, limit)
  const events = eventRecordsToSpacetimeEvents(records).sort(
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

async function fetchStratifiedEvents(
  startYear: number,
  endYear: number,
  limit: number,
) {
  const span = Math.max(1, endYear - startYear + 1)

  // Narrow windows: one query is fine.
  if (span <= DECADE_SPAN) {
    return getEventsByTimeChunk(startYear, endYear, limit)
  }

  // If the whole range already fits the budget, take it in one query.
  // Sampling here would only drop rows: the curated corpus is ~142 events
  // against a 400 default, and windowed sampling caps each window at a share
  // of the limit — which starves the dense modern era where most events sit.
  const total = await countEventsByTimeChunk(startYear, endYear)
  if (total <= limit) {
    return getEventsByTimeChunk(startYear, endYear, limit)
  }

  // Widen the window (in whole decades) until the span fits MAX_WINDOWS.
  // Decades for a 1940→now range; centuries-scale for the full corpus.
  const windowSize =
    Math.ceil(span / MAX_WINDOWS / DECADE_SPAN) * DECADE_SPAN || DECADE_SPAN

  const windows: Array<{from: number; to: number}> = []
  const firstWindow = Math.floor(startYear / windowSize) * windowSize
  for (let year = firstWindow; year <= endYear; year += windowSize) {
    const from = Math.max(startYear, year)
    const to = Math.min(endYear, year + windowSize - 1)
    if (from <= to) windows.push({from, to})
  }

  const perWindow = Math.max(20, Math.ceil(limit / windows.length))
  const batches = await Promise.all(
    windows.map(({from, to}) => getEventsByTimeChunk(from, to, perWindow)),
  )

  const byId = new Map<string, (typeof batches)[number][number]>()
  for (const batch of batches) {
    for (const record of batch) {
      byId.set(record.id, record)
    }
  }

  return [...byId.values()]
    .sort(
      (a, b) =>
        new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
    )
    .slice(0, limit)
}
