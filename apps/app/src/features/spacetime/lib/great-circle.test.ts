import {describe, expect, test} from 'bun:test'
import {greatCircle} from './great-circle'

describe('greatCircle', () => {
  test('starts and ends on the given points', () => {
    const pts = greatCircle([-104.5, 33.4], [139.7, 35.7], 32)
    expect(pts).toHaveLength(33)
    expect(pts[0]![0]).toBeCloseTo(-104.5, 6)
    expect(pts[0]![1]).toBeCloseTo(33.4, 6)
    // End may be unwrapped by ±360 to stay continuous across the antimeridian.
    const end = pts[pts.length - 1]!
    expect(((end[0] % 360) + 360) % 360).toBeCloseTo(139.7 + 0, 6)
    expect(end[1]).toBeCloseTo(35.7, 6)
  })

  test('bows toward the pole on a long east-west route', () => {
    // Roswell → Tokyo crosses the Pacific well north of both endpoints.
    const pts = greatCircle([-104.5, 33.4], [139.7, 35.7], 32)
    const maxLat = Math.max(...pts.map((p) => p[1]))
    expect(maxLat).toBeGreaterThan(50)
  })

  test('never jumps more than 180° of longitude between samples', () => {
    const pts = greatCircle([170, 10], [-170, 10], 16)
    for (let i = 1; i < pts.length; i++) {
      expect(Math.abs(pts[i]![0] - pts[i - 1]![0])).toBeLessThan(180)
    }
  })

  test('returns the two points unchanged when they coincide', () => {
    expect(greatCircle([10, 20], [10, 20])).toEqual([
      [10, 20],
      [10, 20],
    ])
  })
})
