import type {SpacetimeEvent, TemporalCursor} from '../types/spacetime'

/**
 * Time-window helpers for the range cursor.
 *
 * `TemporalCursor` has carried a `range` mode since the scaffold, but nothing
 * set it and nothing filtered by it. These are the pure pieces the dial brush
 * (writes a range) and the globe (dims records outside it) share, so the two
 * can never disagree about what "in range" means.
 */

export interface TimeWindow {
  /** Inclusive start, epoch ms. */
  start: number
  /** Inclusive end, epoch ms. */
  end: number
}

/** ISO start of a year. Pads pre-1000 CE years — `196-01-01` does not parse. */
export function yearStartIso(year: number): string {
  return `${String(year).padStart(4, '0')}-01-01T00:00:00.000Z`
}

/** ISO end of a year (last millisecond of 31 December). */
export function yearEndIso(year: number): string {
  return `${String(year).padStart(4, '0')}-12-31T23:59:59.999Z`
}

/**
 * Build a whole-year range cursor from two years in either order.
 * The end year is inclusive: brushing 1947→1952 keeps records dated in 1952.
 */
export function rangeCursorFromYears(a: number, b: number): TemporalCursor {
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  return {mode: 'range', start: yearStartIso(lo), end: yearEndIso(hi)}
}

/** The window a cursor selects, or `null` when it selects a point in time. */
export function cursorWindow(cursor: TemporalCursor): TimeWindow | null {
  if (cursor.mode !== 'range') return null
  const start = new Date(cursor.start).getTime()
  const end = new Date(cursor.end).getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  return start <= end ? {start, end} : {start: end, end: start}
}

/** True when there is no window, or the event's timestamp falls inside it. */
export function isEventInWindow(event: SpacetimeEvent, window: TimeWindow | null): boolean {
  if (!window) return true
  const t = new Date(event.timestamp).getTime()
  return Number.isFinite(t) && t >= window.start && t <= window.end
}

/**
 * Map a horizontal pointer fraction (0–1 across the axis) to a whole year in
 * the dial's domain. Clamped so a drag past either edge pins to the edge.
 */
export function fractionToYear(
  fraction: number,
  domain: {start: number; span: number},
): number {
  const f = Math.min(1, Math.max(0, fraction))
  return Math.round(domain.start + f * domain.span)
}
