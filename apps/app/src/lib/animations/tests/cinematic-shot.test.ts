import {describe, expect, test} from 'bun:test'
import {
  bezier,
  clamp01,
  createOrbitShot,
  mixLog,
  SHOT_KEYS,
  SHOT_PRESETS,
  smoothTrack,
  track,
} from '../cinematic-shot'

const DEG2RAD = Math.PI / 180

describe('easing primitives', () => {
  test('clamp01 bounds to [0,1]', () => {
    expect(clamp01(-3)).toBe(0)
    expect(clamp01(0.42)).toBe(0.42)
    expect(clamp01(9)).toBe(1)
  })

  test('mixLog is geometric (constant rate of change of log distance)', () => {
    const a = 100
    const b = 1
    // midpoint in log space is the geometric mean
    expect(mixLog(a, b, 0.5)).toBeCloseTo(Math.sqrt(a * b), 6)
    expect(mixLog(a, b, 0)).toBeCloseTo(a, 6)
    expect(mixLog(a, b, 1)).toBeCloseTo(b, 6)
    // equal log steps => equal ratios
    const q1 = mixLog(a, b, 0.25) / mixLog(a, b, 0)
    const q2 = mixLog(a, b, 0.5) / mixLog(a, b, 0.25)
    expect(q1).toBeCloseTo(q2, 6)
  })

  test('bezier pins endpoints and stays monotonic in [0,1]', () => {
    const ease = bezier(0.62, 0, 0.2, 1)
    expect(ease(0)).toBe(0)
    expect(ease(1)).toBe(1)
    let prev = -Infinity
    for (let i = 0; i <= 20; i++) {
      const v = ease(i / 20)
      expect(v).toBeGreaterThanOrEqual(prev - 1e-9)
      prev = v
    }
  })

  test('track holds before first key and after last key', () => {
    const f = track([
      [0.2, 5],
      [0.8, 9],
    ])
    expect(f(0)).toBe(5)
    expect(f(1)).toBe(9)
    expect(f(0.5)).toBeGreaterThan(5)
    expect(f(0.5)).toBeLessThan(9)
  })

  test('smoothTrack passes through its keys and never overshoots between them', () => {
    const keys: Array<[number, number]> = [
      [0, 0],
      [0.5, 0.72],
      [0.8, 1.08],
      [1, 1],
    ]
    const f = smoothTrack(keys)
    for (const [t, v] of keys) {
      expect(f(t)).toBeCloseTo(v, 6)
    }
    // the 0.8 key is an overshoot apex (turnaround) — nothing between 0.8 and 1
    // should exceed it
    let maxTail = -Infinity
    for (let i = 0; i <= 20; i++) {
      const t = 0.8 + (0.2 * i) / 20
      maxTail = Math.max(maxTail, f(t))
    }
    expect(maxTail).toBeLessThanOrEqual(1.08 + 1e-6)
  })
})

describe('createOrbitShot', () => {
  test('every preset is registered', () => {
    expect(SHOT_KEYS).toEqual(Object.keys(SHOT_PRESETS))
    expect(SHOT_KEYS).toContain('descent')
    expect(SHOT_KEYS).toContain('hyperzoom')
  })

  test('distance lands geometrically from start to end', () => {
    const shot = createOrbitShot({preset: 'descent', startDistance: 42, endDistance: 3.6})
    const start = shot.sampleAtProgress(0)
    const end = shot.sampleAtProgress(1)
    expect(start.distance).toBeCloseTo(42, 3)
    expect(end.distance).toBeCloseTo(3.6, 3)
    // strictly decreasing over the fall
    let prev = Infinity
    for (let i = 0; i <= 20; i++) {
      const s = shot.sampleAtProgress(i / 20)
      expect(s.distance).toBeLessThanOrEqual(prev + 1e-6)
      prev = s.distance
    }
  })

  test('far distance is floored at 10x the near distance', () => {
    // ask for a too-shallow fall; module should keep an order of magnitude
    const shot = createOrbitShot({preset: 'descent', startDistance: 5, endDistance: 4})
    expect(shot.startDistance).toBeCloseTo(40, 3)
  })

  test('hyperzoom keeps the camera further out and drives the lens hard', () => {
    const shot = createOrbitShot({preset: 'hyperzoom', endDistance: 3.6})
    // endDistanceScale 2.6 => lands at 9.36, not 3.6
    expect(shot.endDistance).toBeCloseTo(3.6 * 2.6, 3)
    const start = shot.sampleAtProgress(0)
    const end = shot.sampleAtProgress(1)
    expect(start.fov).toBeCloseTo(62, 3)
    expect(end.fov).toBeCloseTo(14, 3)
  })

  test('homeIntro hands off flat and origin-facing at the rest framing', () => {
    // Contract the home hero relies on: the Act-1 fall must land dead-on +Z
    // (azimuth 0, pitch 0) at the exact rest distance and telephoto FOV so
    // EarthJourneyRig can hold it with no jump. Start bearing is back-solved.
    const REST_DISTANCE = 15.5
    const shot = createOrbitShot({
      preset: 'homeIntro',
      startDistance: 155,
      endDistance: REST_DISTANCE,
      startAzimuthDeg: -SHOT_PRESETS.homeIntro.sweepDeg,
    })
    const start = shot.sampleAtProgress(0)
    const end = shot.sampleAtProgress(1)
    // endDistanceScale 1 => lands exactly at the rest distance (no standoff)
    expect(end.distance).toBeCloseTo(REST_DISTANCE, 3)
    expect(end.azimuth).toBeCloseTo(0, 6)
    expect(end.pitch).toBeCloseTo(0, 6)
    expect(end.roll).toBeCloseTo(0, 6)
    // opens wide, compresses to the long-lens hold
    expect(start.fov).toBeCloseTo(62, 3)
    expect(end.fov).toBeCloseTo(20, 3)
    // distance strictly closes over the fall (dolly in)
    let prev = Infinity
    for (let i = 0; i <= 20; i++) {
      const s = shot.sampleAtProgress(i / 20)
      expect(s.distance).toBeLessThanOrEqual(prev + 1e-6)
      prev = s.distance
    }
  })

  test('azimuth sweeps from the configured start bearing by the preset sweep', () => {
    const shot = createOrbitShot({preset: 'orbit', startAzimuthDeg: 20})
    const start = shot.sampleAtProgress(0)
    const end = shot.sampleAtProgress(1)
    expect(start.azimuth).toBeCloseTo(20 * DEG2RAD, 6)
    expect(end.azimuth).toBeCloseTo((20 + SHOT_PRESETS.orbit.sweepDeg) * DEG2RAD, 5)
  })

  test('sample(seconds) and sampleAtProgress agree on the same normalised time', () => {
    const shot = createOrbitShot({preset: 'flyby', duration: 8})
    const bySeconds = shot.sample(4)
    const byProgress = shot.sampleAtProgress(0.5)
    expect(bySeconds.distance).toBeCloseTo(byProgress.distance, 6)
    expect(bySeconds.fov).toBeCloseTo(byProgress.fov, 6)
    expect(bySeconds.t).toBeCloseTo(0.5, 6)
  })

  test('fov stays within a sane cinematic band for every preset', () => {
    for (const key of SHOT_KEYS) {
      const shot = createOrbitShot({preset: key})
      for (let i = 0; i <= 20; i++) {
        const s = shot.sampleAtProgress(i / 20)
        expect(s.fov).toBeGreaterThan(8)
        expect(s.fov).toBeLessThan(80)
      }
    }
  })
})
