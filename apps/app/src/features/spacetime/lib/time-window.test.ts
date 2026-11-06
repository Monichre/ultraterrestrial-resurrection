import {describe, expect, test} from 'bun:test'
import {
  cursorWindow,
  fractionToYear,
  isEventInWindow,
  rangeCursorFromYears,
  yearStartIso,
} from './time-window'
import type {SpacetimeEvent} from '../types/spacetime'

function ev(timestamp: string): SpacetimeEvent {
  return {id: timestamp, type: 'historical_event', title: 't', timestamp, timePrecision: 'day'}
}

describe('rangeCursorFromYears', () => {
  test('orders the years and makes the end year inclusive', () => {
    const cursor = rangeCursorFromYears(1952, 1947)
    expect(cursor).toEqual({
      mode: 'range',
      start: '1947-01-01T00:00:00.000Z',
      end: '1952-12-31T23:59:59.999Z',
    })
  })

  test('pads pre-1000 CE years so they parse', () => {
    expect(yearStartIso(196)).toBe('0196-01-01T00:00:00.000Z')
    expect(Number.isFinite(new Date(yearStartIso(196)).getTime())).toBe(true)
  })
})

describe('cursorWindow + isEventInWindow', () => {
  const window = cursorWindow(rangeCursorFromYears(1947, 1952))

  test('point cursors select no window, so every event passes', () => {
    const exact = cursorWindow({mode: 'exact', timestamp: '1947-07-08T00:00:00.000Z', precision: 'day'})
    expect(exact).toBeNull()
    expect(isEventInWindow(ev('1800-01-01T00:00:00.000Z'), exact)).toBe(true)
  })

  test('keeps events inside the range, including the last day of the end year', () => {
    expect(isEventInWindow(ev('1947-07-08T00:00:00.000Z'), window)).toBe(true)
    expect(isEventInWindow(ev('1952-12-31T12:00:00.000Z'), window)).toBe(true)
  })

  test('drops events outside the range', () => {
    expect(isEventInWindow(ev('1946-12-31T23:59:59.000Z'), window)).toBe(false)
    expect(isEventInWindow(ev('1953-01-01T00:00:00.000Z'), window)).toBe(false)
  })

  test('drops events with an unparseable timestamp when a window is active', () => {
    expect(isEventInWindow(ev('not-a-date'), window)).toBe(false)
  })
})

describe('fractionToYear', () => {
  const domain = {start: 1900, span: 126}

  test('maps axis fractions to whole years', () => {
    expect(fractionToYear(0, domain)).toBe(1900)
    expect(fractionToYear(0.5, domain)).toBe(1963)
    expect(fractionToYear(1, domain)).toBe(2026)
  })

  test('clamps drags past either edge', () => {
    expect(fractionToYear(-0.4, domain)).toBe(1900)
    expect(fractionToYear(1.7, domain)).toBe(2026)
  })
})
