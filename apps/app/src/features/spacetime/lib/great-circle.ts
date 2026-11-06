/**
 * Great-circle interpolation between two [lng, lat] points.
 *
 * A two-point LineString is drawn straight in projected space, which on the
 * globe cuts through the planet's limb instead of following its surface. The
 * connection arcs sample the geodesic instead.
 */

const toRad = (deg: number) => (deg * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI

export function greatCircle(
  from: [number, number],
  to: [number, number],
  segments = 64,
): Array<[number, number]> {
  const [lng1, lat1] = [toRad(from[0]), toRad(from[1])]
  const [lng2, lat2] = [toRad(to[0]), toRad(to[1])]

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2,
      ),
    )

  // Coincident points (two records geocoded to the same place): no arc to draw.
  if (d < 1e-9) return [from, to]

  const points: Array<[number, number]> = []
  let prevLng: number | null = null
  for (let i = 0; i <= segments; i++) {
    const f = i / segments
    const a = Math.sin((1 - f) * d) / Math.sin(d)
    const b = Math.sin(f * d) / Math.sin(d)
    const x = a * Math.cos(lat1) * Math.cos(lng1) + b * Math.cos(lat2) * Math.cos(lng2)
    const y = a * Math.cos(lat1) * Math.sin(lng1) + b * Math.cos(lat2) * Math.sin(lng2)
    const z = a * Math.sin(lat1) + b * Math.sin(lat2)
    let lng = toDeg(Math.atan2(y, x))
    const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))
    // Unwrap across the antimeridian so the line does not jump ±360°.
    if (prevLng != null) {
      while (lng - prevLng > 180) lng -= 360
      while (lng - prevLng < -180) lng += 360
    }
    prevLng = lng
    points.push([lng, lat])
  }
  return points
}
