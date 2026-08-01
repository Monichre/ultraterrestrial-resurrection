import type {SpacetimeEvent, TemporalStation} from '../types/spacetime'

export interface BuildStationsOptions {
  /** Coarse historical decades always present on the dial */
  includeHistoricalDecades?: boolean
  historicalStartYear?: number
  historicalEndYear?: number
  /** Cap event stations so the dial stays legible */
  maxEventStations?: number
}

/**
 * Build adaptive temporal stations from event density.
 *
 * - historical: decade ticks across the corpus range
 * - event: densest days / notable years from the loaded events
 *
 * Investigation stations are generated later from a selected case (M4).
 */
export function buildTemporalStations(
  events: SpacetimeEvent[],
  options: BuildStationsOptions = {},
): TemporalStation[] {
  const {
    includeHistoricalDecades = true,
    historicalStartYear = 1940,
    historicalEndYear = new Date().getUTCFullYear(),
    maxEventStations = 24,
  } = options

  const stations: TemporalStation[] = []

  if (includeHistoricalDecades) {
    const startDecade = Math.floor(historicalStartYear / 10) * 10
    const endDecade = Math.floor(historicalEndYear / 10) * 10
    for (let year = startDecade; year <= endDecade; year += 10) {
      stations.push({
        id: `historical-${year}`,
        kind: 'historical',
        label: `${year}s`,
        timestamp: `${year}-01-01T00:00:00.000Z`,
        density: 0,
      })
    }
  }

  // Bucket events by UTC day for event stations
  const byDay = new Map<string, SpacetimeEvent[]>()
  for (const event of events) {
    const day = event.timestamp.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue
    const bucket = byDay.get(day) ?? []
    bucket.push(event)
    byDay.set(day, bucket)
  }

  const rankedDays = [...byDay.entries()]
    .map(([day, dayEvents]) => ({
      day,
      dayEvents,
      score: dayEvents.length + dayEvents.reduce((s, e) => s + (e.credibilityScore ?? 0.5), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxEventStations)

  const maxScore = rankedDays[0]?.score ?? 1

  for (const {day, dayEvents, score} of rankedDays) {
    const year = day.slice(0, 4)
    const label =
      dayEvents.length === 1
        ? dayEvents[0]?.title.slice(0, 42) || day
        : `${dayEvents.length} events · ${year}`

    stations.push({
      id: `event-${day}`,
      kind: 'event',
      label,
      timestamp: `${day}T12:00:00.000Z`,
      density: score / maxScore,
      eventIds: dayEvents.map((e) => e.id),
    })
  }

  // Stamp historical densities from year counts
  const byYear = new Map<number, number>()
  for (const event of events) {
    const year = Number(event.timestamp.slice(0, 4))
    if (!Number.isFinite(year)) continue
    byYear.set(year, (byYear.get(year) ?? 0) + 1)
  }
  const maxYearCount = Math.max(1, ...byYear.values())

  for (const station of stations) {
    if (station.kind !== 'historical') continue
    const decade = Number(station.id.replace('historical-', ''))
    let count = 0
    for (let y = decade; y < decade + 10; y++) count += byYear.get(y) ?? 0
    station.density = count / maxYearCount
  }

  return stations.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
}

/** Map a 0–1 scroll/dial progress onto the nearest station. */
export function stationAtProgress(
  stations: TemporalStation[],
  progress: number,
): TemporalStation | null {
  if (stations.length === 0) return null
  const clamped = Math.min(1, Math.max(0, progress))
  const idx = Math.min(stations.length - 1, Math.round(clamped * (stations.length - 1)))
  return stations[idx] ?? null
}
