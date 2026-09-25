/**
 * Cinematic Shot — camera choreography for the home celestial hero.
 *
 * Adapted from David Ronai's (@makio64) `threejs-cinematic-world-zoom`
 * (MIT) — specifically the load-bearing ideas from `src/camera/easing.js`
 * and `src/camera/shots.js`:
 *
 *   1. DISTANCE IS INTERPOLATED GEOMETRICALLY. What reads as a constant zoom
 *      rate is a constant rate of change of *log* distance. Linear interpolation
 *      over orders of magnitude reads as "a stall followed by a slam".
 *   2. EVERY CHANNEL RUNS ON ITS OWN CURVE. Distance, azimuth, pitch, fov and
 *      roll each arrive on their own schedule — that offset between channels is
 *      most of what makes a move read as an authored *shot* rather than an
 *      interpolation.
 *   3. THE LENS DOES REAL WORK. FOV is a first-class channel (hyperzoom is
 *      almost entirely lens).
 *
 * What we deliberately did NOT port: the geographic ellipsoid rig, Google 3D
 * tiles, the sun solver and the WebCodecs recorder. Our hero orbits a globe at
 * the scene origin — there is no lat/lon to land on — so the rig collapses to a
 * simple spherical orbit around (0,0,0).
 *
 * This module is framework-free and pure (no three.js in the sampler) so the
 * choreography can be unit-tested without a WebGL context. `applyOrbitState`
 * is the only three.js-touching helper.
 */

// ---------------------------------------------------------------------------
// Easing primitives (ported)
// ---------------------------------------------------------------------------

export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t)

export const smoothstep = (t: number): number => t * t * (3 - 2 * t)

export const smootherstep = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10)

export const cubicInOut = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const sineInOut = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2

/** Geometric (log-space) interpolation — the correct one for distances. */
export const mixLog = (a: number, b: number, t: number): number => a * Math.pow(b / a, t)

export type EaseFn = (t: number) => number

/**
 * CSS-style cubic-bezier(x1,y1,x2,y2), solved with Newton-Raphson and a
 * bisection fallback. Maps [0,1] -> [0,1] with f(0)=0, f(1)=1.
 */
export const bezier = (x1: number, y1: number, x2: number, y2: number): EaseFn => {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx

  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1

    let t = x
    for (let i = 0; i < 10; i++) {
      const err = sampleX(t) - x
      if (Math.abs(err) < 1e-9) return sampleY(t)
      const d = slopeX(t)
      if (Math.abs(d) < 1e-6) break
      t -= err / d
    }

    let lo = 0
    let hi = 1
    t = x
    for (let i = 0; i < 40; i++) {
      const v = sampleX(t)
      if (Math.abs(v - x) < 1e-9) break
      if (v > x) hi = t
      else lo = t
      t = (lo + hi) / 2
    }

    return sampleY(t)
  }
}

/** Nothing happens until `start`, then it eases across the remaining time. */
export const delayed =
  (start = 0.4, ease: EaseFn = cubicInOut): EaseFn =>
  (t: number) =>
    t <= start ? 0 : ease((t - start) / (1 - start))

/** The film-standard "slow in, slow out". */
export const cinematic = bezier(0.62, 0, 0.2, 1)

/** Slow in, still drifting at the cut — hands off into a residual move. */
export const coast = bezier(0.55, 0.02, 0.42, 0.84)

/** `coast` with the start pinned flat (no rate kink under `delayed`). */
export const coastFromRest = bezier(0.55, 0, 0.42, 0.84)

export type TrackKey = [t: number, value: number, ease?: EaseFn]

/**
 * Piecewise keyframe track. A key's third element eases the segment *arriving*
 * at it, which lets a move ease into a beat and continue out of it at a steady
 * rate rather than stalling at every key.
 */
export const track =
  (keys: TrackKey[], ease: EaseFn = smootherstep): EaseFn =>
  (t: number) => {
    if (t <= keys[0][0]) return keys[0][1]
    const last = keys[keys.length - 1]
    if (t >= last[0]) return last[1]

    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, segmentEase] = keys[i]
      if (t > t1) continue
      const [t0, v0] = keys[i - 1]
      const u = (segmentEase || ease)((t - t0) / (t1 - t0))
      return v0 + (v1 - v0) * u
    }

    return last[1]
  }

/**
 * C1 keyframe track — a monotone cubic (Fritsch–Carlson) through `keys`.
 * Passes interior keys at speed (no stall per key), never overshoots between
 * keys, and gives a turnaround (local extremum) a flat tangent so an overshoot
 * apex arrives without a ripple.
 *
 * `endCoast` is a fraction of the last segment's secant kept as the exit slope
 * (0 = settle, 1 = leave at the average rate of the final beat).
 */
export const smoothTrack = (keys: Array<[number, number]>, endCoast = 0): EaseFn => {
  const n = keys.length
  const h: number[] = []
  const d: number[] = []
  for (let i = 0; i < n - 1; i++) {
    h[i] = keys[i + 1][0] - keys[i][0]
    d[i] = (keys[i + 1][1] - keys[i][1]) / h[i]
  }

  const m = new Array<number>(n).fill(0)
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] > 0) {
      const w1 = 2 * h[i] + h[i - 1]
      const w2 = h[i] + 2 * h[i - 1]
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    }
  }

  if (endCoast > 0) m[n - 1] = endCoast * d[n - 2]

  return (t: number) => {
    if (t <= keys[0][0]) return keys[0][1]
    if (t >= keys[n - 1][0]) return keys[n - 1][1]

    let i = n - 2
    while (i > 0 && t < keys[i][0]) i--

    const u = (t - keys[i][0]) / h[i]
    const u2 = u * u
    const u3 = u2 * u
    return (
      (2 * u3 - 3 * u2 + 1) * keys[i][1] +
      (u3 - 2 * u2 + u) * h[i] * m[i] +
      (-2 * u3 + 3 * u2) * keys[i + 1][1] +
      (u3 - u2) * h[i] * m[i + 1]
    )
  }
}

// ---------------------------------------------------------------------------
// Shot presets (tuned for a globe at the scene origin)
// ---------------------------------------------------------------------------

const DEG2RAD = Math.PI / 180

/**
 * A shot preset over normalised time t ∈ [0,1]. Distance is a 0..1 progress fed
 * through geometric interpolation (values > 1 mean "flew past it" for overshoot
 * shots). Angles are in degrees; azimuth/pitch are relative offsets applied on
 * top of the shot's configured start/base.
 */
export type ShotPreset = {
  name: string
  tagline: string
  /** default seconds for autorun playback */
  duration: number
  /** total azimuth sweep in degrees (start bearing back-solves from this) */
  sweepDeg: number
  /** distance progress 0..1 (geometric) */
  distance: EaseFn
  /** azimuth progress 0..1 (multiplied by sweepDeg) */
  azimuth: EaseFn
  /** absolute viewing-latitude (pitch) in degrees */
  pitch: EaseFn
  /** absolute field of view in degrees */
  fov: EaseFn
  /** absolute roll (bank) in degrees */
  roll: EaseFn
  /** end distance is multiplied by this (hyperzoom stays further out) */
  endDistanceScale?: number
}

const pullUp = delayed(0.52, bezier(0.55, 0, 0.22, 0.86))

export const SHOT_PRESETS: Record<string, ShotPreset> = {
  descent: {
    name: 'Descent',
    tagline: 'A long steady fall out of orbit, settling into a slow drift',
    duration: 7,
    sweepDeg: 42,
    distance: coast,
    pitch: smoothTrack([
      [0, 18],
      [0.5, 10],
      [1, 2],
    ]),
    azimuth: coast,
    fov: smoothTrack([
      [0, 34],
      [0.34, 38],
      [1, 46],
    ]),
    roll: (t) => 1.6 * Math.sin(Math.PI * t) ** 2,
  },

  dive: {
    name: 'Dive',
    tagline: 'Hangs high, plunges, pulls up at the last moment',
    duration: 6,
    sweepDeg: 28,
    distance: bezier(0.45, 0.08, 0.28, 0.88),
    pitch: (t) => 34 - 6 * sineInOut(clamp01(t / 0.5)) - 26 * pullUp(t),
    azimuth: delayed(0.52, coastFromRest),
    fov: (t) => 30 + 8 * sineInOut(clamp01(t / 0.5)) + 18 * pullUp(t),
    roll: (t) => 6 * Math.sin(Math.PI * clamp01((t - 0.52) / 0.48)) ** 2,
  },

  orbit: {
    name: 'Orbit',
    tagline: 'Drops hard through the first half, then circles the subject',
    duration: 9,
    sweepDeg: 150,
    distance: smoothTrack([
      [0, 0],
      [0.45, 0.8],
      [1, 1],
    ]),
    pitch: smoothTrack([
      [0, 30],
      [0.44, 14],
      [1, 6],
    ]),
    azimuth: smoothTrack([
      [0, 0],
      [0.4, 0.38],
      [1, 1],
    ]),
    fov: smoothTrack([
      [0, 40],
      [0.44, 47],
      [1, 44],
    ]),
    roll: (t) => 1.4 * Math.sin(Math.PI * t) ** 2,
  },

  flyby: {
    name: 'Flyby',
    tagline: 'Comes in low and fast, overshoots, banks back around',
    duration: 8,
    sweepDeg: 95,
    distance: smoothTrack([
      [0, 0],
      [0.5, 0.72],
      [0.8, 1.08],
      [1, 1],
    ]),
    pitch: smoothTrack([
      [0, 24],
      [0.6, 6],
      [0.82, -2],
      [1, 4],
    ]),
    azimuth: smoothTrack([
      [0, 0],
      [0.56, 0.18],
      [0.86, 0.84],
      [1, 1],
    ]),
    fov: smoothTrack([
      [0, 34],
      [0.56, 44],
      [0.82, 62],
      [1, 54],
    ]),
    roll: smoothTrack([
      [0, 0],
      [0.58, 2],
      [0.78, 12],
      [0.94, 4],
      [1, 0],
    ]),
  },

  hyperzoom: {
    name: 'Hyperzoom',
    tagline: 'Barely moves. The lens does all the work — 62° down to 14°',
    duration: 6,
    sweepDeg: 14,
    endDistanceScale: 2.6,
    distance: bezier(0.5, 0, 0.38, 0.9),
    pitch: track([
      [0, 10],
      [1, 4],
    ], coast),
    azimuth: coast,
    fov: smoothTrack([
      [0, 62],
      [0.22, 50],
      [1, 14],
    ]),
    roll: () => 0,
  },

  // Production home-hero intro. Hyperzoom's lens DNA (opens wide at 62°,
  // compresses to a long-lens 20°) with a *subtle dolly* added: unlike pure
  // hyperzoom (which holds ~2.6× further out), this lands at the exact rest
  // distance (endDistanceScale 1) and keeps drifting in through the tail
  // (`coast` distance) so the camera physically closes the last bit rather than
  // the lens doing all the work. Pitch settles to 0 and azimuth is back-solved
  // to 0 so it lands dead-on +Z, flat and origin-facing — a seamless hand-off
  // to EarthJourneyRig, which then *holds* this telephoto framing as the rest.
  homeIntro: {
    name: 'Home Intro',
    tagline: 'Hyperzoom + a subtle dolly — opens at 62°, compresses to 20° and drifts in to hold',
    duration: 6,
    sweepDeg: 10,
    endDistanceScale: 1,
    distance: coast,
    pitch: track(
      [
        [0, 7],
        [1, 0],
      ],
      coast
    ),
    azimuth: coast,
    fov: smoothTrack([
      [0, 62],
      [0.28, 46],
      [1, 20],
    ]),
    roll: () => 0,
  },
}

export const SHOT_KEYS = Object.keys(SHOT_PRESETS)

export type ShotState = {
  /** eye-to-origin distance in scene units */
  distance: number
  /** azimuth in radians (orbit around +Y) */
  azimuth: number
  /** viewing latitude / pitch in radians */
  pitch: number
  /** field of view in degrees */
  fov: number
  /** roll (bank) in radians */
  roll: number
  /** normalised time 0..1 */
  t: number
}

export type OrbitShotConfig = {
  preset?: string
  /** far distance the flight begins at (scene units) */
  startDistance?: number
  /** close distance the flight lands on (scene units) */
  endDistance?: number
  /** camera's starting compass bearing in degrees */
  startAzimuthDeg?: number
  /** duration override (seconds) */
  duration?: number
}

export type OrbitShot = {
  preset: string
  name: string
  tagline: string
  duration: number
  startDistance: number
  endDistance: number
  /** sample at absolute seconds into the shot */
  sample: (timeSeconds: number, out?: Partial<ShotState>) => ShotState
  /** sample at normalised progress 0..1 (for scrubbing) */
  sampleAtProgress: (p: number, out?: Partial<ShotState>) => ShotState
}

/**
 * Binds a shot preset to a start/end distance and returns a sampler. Distance
 * is always geometric (`mixLog`); the far distance is floored at 10× the near
 * distance so even a shallow config keeps an order of magnitude of fall.
 */
export const createOrbitShot = (config: OrbitShotConfig = {}): OrbitShot => {
  const {
    preset = 'descent',
    startDistance = 42,
    endDistance = 3.6,
    startAzimuthDeg = 0,
    duration,
  } = config

  const shot = SHOT_PRESETS[preset] ?? SHOT_PRESETS.descent
  const d1 = endDistance * (shot.endDistanceScale ?? 1)
  const d0 = Math.max(startDistance, d1 * 10)
  const totalDuration = duration ?? shot.duration
  const startAzimuth = startAzimuthDeg * DEG2RAD
  const sweep = shot.sweepDeg * DEG2RAD

  const sampleAt = (t: number, out: Partial<ShotState> = {}): ShotState => {
    const tc = clamp01(t)
    const state = out as ShotState
    state.distance = mixLog(d0, d1, shot.distance(tc))
    state.azimuth = startAzimuth + sweep * shot.azimuth(tc)
    state.pitch = shot.pitch(tc) * DEG2RAD
    state.fov = shot.fov(tc)
    state.roll = shot.roll(tc) * DEG2RAD
    state.t = tc
    return state
  }

  return {
    preset,
    name: shot.name,
    tagline: shot.tagline,
    duration: totalDuration,
    startDistance: d0,
    endDistance: d1,
    sample: (timeSeconds, out) => sampleAt(timeSeconds / totalDuration, out),
    sampleAtProgress: (p, out) => sampleAt(p, out),
  }
}
