import {truncateAtWordBoundary} from '@/lib/utils'
import type {SpacetimeEvent, TemporalStation} from '../types/spacetime'

export interface BuildStationsOptions {
  /** Coarse historical ticks always present on the dial */
  includeHistoricalDecades?: boolean
  historicalStartYear?: number
  historicalEndYear?: number
  /** Cap event stations so the dial stays legible */
  maxEventStations?: number
  /** Roughly how many coarse ticks the dial should carry. See `niceYearStep`. */
  historicalTickTarget?: number
}

/**
 * Pick a round year interval that yields ~`target` ticks across `span`.
 *
 * A fixed decade was fine while the corpus started at 1940 (9 ticks). The
 * events corpus reaches back to 196 CE, and a decade step over that span emits
 * **193 ticks** — which is what shipped: a dial rendering "120 130 140 …" as an
 * unreadable ladder down the left edge. Step up through 1/2/5×10ⁿ instead so
 * the ticks stay round numbers (…, 50, 100, 200, 500) at any span.
 */
export function niceYearStep(span: number, target: number): number {
  const raw = Math.max(1, span / Math.max(1, target))
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  for (const multiple of [1, 2, 5]) {
    const step = magnitude * multiple
    if (raw <= step) return step
  }
  return magnitude * 10
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
    historicalTickTarget = 12,
  } = options

  const stations: TemporalStation[] = []

  // Year histogram first — the coarse ticks need it to carry density, and
  // computing it here avoids the old second pass that re-parsed the tick id.
  const byYear = new Map<number, number>()
  for (const event of events) {
    const year = Number(event.timestamp.slice(0, 4))
    if (!Number.isFinite(year)) continue
    byYear.set(year, (byYear.get(year) ?? 0) + 1)
  }

  if (includeHistoricalDecades) {
    const step = niceYearStep(
      Math.max(1, historicalEndYear - historicalStartYear),
      historicalTickTarget,
    )
    const firstTick = Math.floor(historicalStartYear / step) * step
    // Density is per-tick-window occupancy relative to the busiest window, so a
    // 500-year tick and a 10-year tick are each read against their own peers.
    const windows: Array<{year: number; count: number}> = []
    for (let year = firstTick; year <= historicalEndYear; year += step) {
      let count = 0
      for (const [eventYear, n] of byYear) {
        if (eventYear >= year && eventYear < year + step) count += n
      }
      windows.push({year, count})
    }
    const peak = Math.max(1, ...windows.map((w) => w.count))

    for (const {year, count} of windows) {
      stations.push({
        id: `historical-${year}`,
        kind: 'historical',
        // A 10-year window is "1940s"; a 200-year window is not — calling it
        // "1800s" would claim a century it does not cover.
        label: step === 10 ? `${year}s` : `${year}`,
        timestamp: `${String(Math.max(1, year)).padStart(4, '0')}-01-01T00:00:00.000Z`,
        density: count / peak,
      })
    }
  }

  // Bucket events by UTC day, then pick top days per decade so the
  // guided narrative spans history instead of collapsing into one flap.
  const byDay = new Map<string, SpacetimeEvent[]>()
  for (const event of events) {
    const day = event.timestamp.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue
    const bucket = byDay.get(day) ?? []
    bucket.push(event)
    byDay.set(day, bucket)
  }

  const scoredDays = [...byDay.entries()].map(([day, dayEvents]) => ({
    day,
    dayEvents,
    decade: Math.floor(Number(day.slice(0, 4)) / 10) * 10,
    score: dayEvents.length + dayEvents.reduce((s, e) => s + (e.credibilityScore ?? 0.2), 0),
  }))

  const byDecade = new Map<number, typeof scoredDays>()
  for (const entry of scoredDays) {
    const bucket = byDecade.get(entry.decade) ?? []
    bucket.push(entry)
    byDecade.set(entry.decade, bucket)
  }

  const perDecade = Math.max(1, Math.ceil(maxEventStations / Math.max(1, byDecade.size)))
  const rankedDays = [...byDecade.values()]
    .flatMap((entries) =>
      [...entries].sort((a, b) => b.score - a.score).slice(0, perDecade),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, maxEventStations)

  const maxScore = rankedDays[0]?.score ?? 1

  for (const {day, dayEvents, score} of rankedDays) {
    const year = day.slice(0, 4)
    const label =
      dayEvents.length === 1
        ? (dayEvents[0]?.title ? truncateAtWordBoundary(dayEvents[0].title, 42) : day)
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

  // Historical densities are stamped above, inside the tick loop — that loop
  // knows the tick's actual width. A second pass here (as there used to be)
  // could only assume a fixed decade, which is wrong for every other step.

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
