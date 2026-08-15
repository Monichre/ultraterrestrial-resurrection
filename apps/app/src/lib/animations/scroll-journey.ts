/**
 * Scroll Journey — shared contract between the GSAP scrub timeline
 * (useUltraterrestrialAnimation) and the R3F camera rigs (Earth / Moon).
 *
 * The master hook writes normalized progress (0..1) into a JourneyProgressRef;
 * camera rigs sample their keyframe stops against it inside useFrame.
 */

export type JourneyProgressRef = {current: number}

/** [progress, value] pairs — progress ascending, 0..1 */
export type JourneyStop = [number, number]

/** Piecewise interpolation across stops with smoothstep easing per segment. */
export const sampleStops = (stops: JourneyStop[], t: number): number => {
  if (stops.length === 0) return 0
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, v0] = stops[i]
    const [t1, v1] = stops[i + 1]
    if (t <= t1) {
      const p = (t - t0) / (t1 - t0)
      const s = p * p * (3 - 2 * p)
      return v0 + (v1 - v0) * s
    }
  }
  return stops[stops.length - 1][1]
}

/** Frame-rate independent damping toward a target (Freya Holmér style). */
export const damp = (current: number, target: number, lambda: number, delta: number): number =>
  current + (target - current) * (1 - Math.exp(-lambda * delta))
