import {describe, expect, test} from 'bun:test'
import {
  CHEST_POINT,
  FIGURE_BOUNDS,
  HEAD_TOP,
  SHELL_EPSILON,
  sampleTitanSurface,
  titanSdf,
  TORCH_GRIP,
  TORCH_TIP,
} from './titan-figure'

const HIGH_COUNT = 40_000

const sameArray = (a: Float32Array, b: Float32Array) =>
  a.length === b.length && a.every((value, index) => value === b[index])

describe('sampleTitanSurface', () => {
  test('is deterministic for a seed and varies across seeds', () => {
    const first = sampleTitanSurface(2_000, 7)
    const again = sampleTitanSurface(2_000, 7)
    const other = sampleTitanSurface(2_000, 8)
    expect(sameArray(first.positions, again.positions)).toBe(true)
    expect(sameArray(first.starts, again.starts)).toBe(true)
    expect(sameArray(first.seeds, again.seeds)).toBe(true)
    expect(sameArray(first.positions, other.positions)).toBe(false)
  })

  test('returns exactly the requested count with no NaN values', () => {
    const sample = sampleTitanSurface(5_000, 3)
    expect(sample.count).toBe(5_000)
    expect(sample.positions.length).toBe(15_000)
    expect(sample.normals.length).toBe(15_000)
    expect(sample.starts.length).toBe(15_000)
    expect(sample.seeds.length).toBe(5_000)
    const arrays = [sample.positions, sample.normals, sample.starts, sample.seeds]
    expect(arrays.every((array) => array.every(Number.isFinite))).toBe(true)
  })

  test('places every point on the surface and inside the sampling box', () => {
    const {positions, count} = sampleTitanSurface(10_000, 11)
    let worst = 0
    let outside = 0
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]
      const z = positions[i * 3 + 2]
      worst = Math.max(worst, Math.abs(titanSdf(x, y, z)))
      const inBox = [x, y, z].every(
        (value, axis) => value > FIGURE_BOUNDS.min[axis] && value < FIGURE_BOUNDS.max[axis]
      )
      if (!inBox) outside++
    }
    expect(worst).toBeLessThanOrEqual(SHELL_EPSILON)
    expect(outside).toBe(0)
  })

  test(`samples the high count (${HIGH_COUNT}) under a generous bound`, () => {
    const start = performance.now()
    sampleTitanSurface(HIGH_COUNT, 1)
    const elapsed = performance.now() - start
    console.info(`sampleTitanSurface(${HIGH_COUNT}) took ${elapsed.toFixed(1)} ms`)
    expect(elapsed).toBeLessThan(1_000)
  })
})

describe('titanSdf pose', () => {
  test('is inside at the chest and at the raised torch grip', () => {
    expect(titanSdf(...CHEST_POINT)).toBeLessThan(0)
    expect(titanSdf(...TORCH_GRIP)).toBeLessThan(0)
  })

  test('is outside well above the head', () => {
    expect(titanSdf(HEAD_TOP[0], HEAD_TOP[1] + 0.25, HEAD_TOP[2])).toBeGreaterThan(0)
  })

  test('holds the torch tip above the head', () => {
    expect(TORCH_TIP[1]).toBeGreaterThan(HEAD_TOP[1])
    expect(Math.abs(titanSdf(...TORCH_TIP))).toBeLessThan(0.05)
  })
})
