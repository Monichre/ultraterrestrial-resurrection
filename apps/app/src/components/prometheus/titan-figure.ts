export type Vec3 = readonly [number, number, number]
type Mat3 = readonly number[]
type Sdf = (x: number, y: number, z: number) => number
/** An SDF plus a bounding sphere, so unions can skip parts that cannot affect the result. */
type Part = {sdf: Sdf; center: Vec3; radius: number}

export type TitanSample = {
  count: number
  positions: Float32Array
  normals: Float32Array
  starts: Float32Array
  seeds: Float32Array
}

export const SHELL_EPSILON = 0.01
export const FIGURE_BOUNDS = {min: [-0.44, -0.04, -0.26] as Vec3, max: [0.54, 2.44, 0.28] as Vec3}

const SAMPLE_BAND = 0.012
const GRID_CELL = 0.025
const ROOT_CELL = GRID_CELL * 4
const LIPSCHITZ_SLACK = 0.003
const GRADIENT_STEP = 0.001
// Creases where two limbs meet have a collapsed gradient; one Newton step would miss the surface.
const MIN_SLOPE = 0.75
const SCATTER_CENTER: Vec3 = [0.05, 1.2, 0]
const SCATTER_RADII: Vec3 = [2.6, 1.8, 1.4]
const IDENTITY: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]

// Units: feet at y = 0, about 1.82 tall. The figure faces +z; its right side is -x.

const multiply = (a: Mat3, b: Mat3): Mat3 =>
  IDENTITY.map((_, i) => {
    const [row, col] = [i - (i % 3), i % 3]
    return a[row] * b[col] + a[row + 1] * b[col + 3] + a[row + 2] * b[col + 6]
  })

/** Row-major Ry(yaw) · Rx(pitch) · Rz(roll). */
const euler = (pitch: number, yaw: number, roll = 0): Mat3 => {
  const [cx, sx, cy, sy, cz, sz] = [pitch, yaw, roll].flatMap((a) => [Math.cos(a), Math.sin(a)])
  const ry = [cy, 0, sy, 0, 1, 0, -sy, 0, cy]
  return multiply(ry, multiply([1, 0, 0, 0, cx, -sx, 0, sx, cx], [cz, -sz, 0, sz, cz, 0, 0, 0, 1]))
}

const transform = (origin: Vec3, rot: Mat3, offset: Vec3): Vec3 => [
  origin[0] + rot[0] * offset[0] + rot[1] * offset[1] + rot[2] * offset[2],
  origin[1] + rot[3] * offset[0] + rot[4] * offset[1] + rot[5] * offset[2],
  origin[2] + rot[6] * offset[0] + rot[7] * offset[1] + rot[8] * offset[2],
]

const lerp3 = (a: Vec3, b: Vec3, t: number) =>
  a.map((v, i) => v + (b[i] - v) * t) as unknown as Vec3
const scale3 = (v: Vec3, s: number) => v.map((c) => c * s) as unknown as Vec3
const add3 = (a: Vec3, b: Vec3) => a.map((v, i) => v + b[i]) as unknown as Vec3
const length3 = (v: Vec3) => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
const normalize = (v: Vec3) => scale3(v, 1 / length3(v))
const perpendicular = (v: Vec3, axis: Vec3) => {
  const d = v[0] * axis[0] + v[1] * axis[1] + v[2] * axis[2]
  return normalize(add3(v, scale3(axis, -d)))
}

/** k = 0 is a hard union; k > 0 a polynomial smooth union. Exact skips via bounding spheres. */
const blend = (k: number, parts: Part[]): Part => {
  const lo = [0, 1, 2].map((a) => Math.min(...parts.map((p) => p.center[a] - p.radius)))
  const hi = [0, 1, 2].map((a) => Math.max(...parts.map((p) => p.center[a] + p.radius)))
  const center = lerp3(lo as unknown as Vec3, hi as unknown as Vec3, 0.5)
  const radius = Math.max(
    ...parts.map((p) => length3(add3(p.center, scale3(center, -1))) + p.radius)
  )
  const fns = parts.map((p) => p.sdf)
  const bounds = new Float64Array(parts.flatMap((p) => [...p.center, p.radius]))
  const sdf: Sdf = (x, y, z) => {
    let d = Infinity
    for (let i = 0; i < fns.length; i++) {
      const dx = x - bounds[i * 4]
      const dy = y - bounds[i * 4 + 1]
      const dz = z - bounds[i * 4 + 2]
      const reach = d + k + bounds[i * 4 + 3]
      if (reach <= 0 || dx * dx + dy * dy + dz * dz >= reach * reach) continue
      const v = fns[i](x, y, z)
      if (d === Infinity || k === 0) d = Math.min(d, v)
      else {
        const h = Math.max(k - Math.abs(d - v), 0) / k
        d = Math.min(d, v) - h * h * k * 0.25
      }
    }
    return d
  }
  return {sdf, center, radius}
}

/** Exact round cone (tapered capsule) between arbitrary endpoints, after Inigo Quilez. */
const limb = (a: Vec3, b: Vec3, r1: number, r2: number): Part => {
  const [ax, ay, az] = a
  const [bx, by, bz] = [b[0] - ax, b[1] - ay, b[2] - az]
  const l2 = bx * bx + by * by + bz * bz
  const [rr, il2] = [r1 - r2, 1 / l2]
  const a2 = l2 - rr * rr
  const sdf: Sdf = (x, y, z) => {
    const px = x - ax
    const py = y - ay
    const pz = z - az
    const along = px * bx + py * by + pz * bz
    const past = along - l2
    const qx = px * l2 - bx * along
    const qy = py * l2 - by * along
    const qz = pz * l2 - bz * along
    const x2 = qx * qx + qy * qy + qz * qz
    const k = Math.sign(rr) * rr * rr * x2
    if (Math.sign(past) * a2 * past * past * l2 > k)
      return Math.sqrt(x2 + past * past * l2) * il2 - r2
    if (Math.sign(along) * a2 * along * along * l2 < k)
      return Math.sqrt(x2 + along * along * l2) * il2 - r1
    return (Math.sqrt(x2 * a2 * il2) + along * rr) * il2 - r1
  }
  return {sdf, center: lerp3(a, b, 0.5), radius: Math.sqrt(l2) / 2 + Math.max(r1, r2)}
}

/** Ellipsoid distance bound, after Inigo Quilez; `rot` maps local axes to world. */
const ellipsoid = (c: Vec3, r: Vec3, rot: Mat3 = IDENTITY): Part => {
  const [cx, cy, cz] = c
  const [ix, iy, iz] = r.map((v) => 1 / v)
  const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = rot
  const inner = -Math.min(...r)
  const sdf: Sdf = (x, y, z) => {
    const dx = x - cx
    const dy = y - cy
    const dz = z - cz
    const ux = (m0 * dx + m3 * dy + m6 * dz) * ix
    const uy = (m1 * dx + m4 * dy + m7 * dz) * iy
    const uz = (m2 * dx + m5 * dy + m8 * dz) * iz
    const k0 = Math.sqrt(ux * ux + uy * uy + uz * uz)
    const k1 = Math.sqrt(ux * ux * ix * ix + uy * uy * iy * iy + uz * uz * iz * iz)
    return k1 < 1e-9 ? inner : (k0 * (k0 - 1)) / k1
  }
  return {sdf, center: c, radius: Math.max(...r)}
}

/** Flat shackle band around `axis`, broken open where it faces `gapDir`. */
const brokenCuff = (c: Vec3, axis: Vec3, gapDir: Vec3, ring: number): Part => {
  const gap = add3(c, scale3(gapDir, ring))
  const sdf: Sdf = (x, y, z) => {
    const dx = x - c[0]
    const dy = y - c[1]
    const dz = z - c[2]
    const h = dx * axis[0] + dy * axis[1] + dz * axis[2]
    const radial = Math.sqrt(Math.max(dx * dx + dy * dy + dz * dz - h * h, 0))
    const qx = Math.abs(radial - ring) - 0.006
    const qy = Math.abs(h) - 0.016
    const box =
      Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) + Math.min(Math.max(qx, qy), 0)
    const gapDistance = Math.sqrt((x - gap[0]) ** 2 + (y - gap[1]) ** 2 + (z - gap[2]) ** 2) - 0.02
    return Math.max(box - 0.003, -gapDistance)
  }
  return {sdf, center: c, radius: ring + 0.03}
}

/** Elongated chain link hanging along world y, in the XY plane (ZY when `turned`). */
const chainLink = (c: Vec3, turned: boolean): Part => {
  const sdf: Sdf = (x, y, z) => {
    const u = turned ? z - c[2] : x - c[0]
    const w = turned ? x - c[0] : z - c[2]
    const v = Math.max(Math.abs(y - c[1]) - 0.01, 0)
    return Math.sqrt((Math.sqrt(u * u + v * v) - 0.016) ** 2 + w * w) - 0.0055
  }
  return {sdf, center: c, radius: 0.035}
}

// Pose: contrapposto with weight on the left leg (+x), right arm raised high with the torch.
const HEAD_PIVOT: Vec3 = [-0.005, 1.6, 0]
const HEAD_ROTATION = euler(-0.45, -0.36, 0.05)
const TORSO_ROLL = euler(0, 0, -0.035)
const PELVIS_ROLL = euler(0, 0, 0.06)
const R_SHOULDER: Vec3 = [-0.225, 1.48, 0]
const R_ELBOW: Vec3 = [-0.295, 1.76, 0.03]
const R_WRIST: Vec3 = [-0.265, 2.0, 0.07]
const L_SHOULDER: Vec3 = [0.232, 1.43, 0]
const L_ELBOW: Vec3 = [0.3, 1.16, -0.02]
const L_WRIST: Vec3 = [0.36, 0.92, 0.03]

export const TORCH_TIP: Vec3 = [-0.245, 2.35, 0.08]
export const TORCH_GRIP: Vec3 = [-0.262, 2.045, 0.07]
export const CHEST_POINT: Vec3 = [0, 1.32, 0]
export const HEAD_TOP: Vec3 = transform(HEAD_PIVOT, HEAD_ROTATION, [0, 0.217, 0])

const headPart = (offset: Vec3, radii: Vec3) =>
  ellipsoid(transform(HEAD_PIVOT, HEAD_ROTATION, offset), radii, HEAD_ROTATION)

const CUFF_AXIS = normalize(add3(L_WRIST, scale3(L_ELBOW, -1)))
const CUFF_CENTER = lerp3(L_ELBOW, L_WRIST, 0.82)
const CUFF_RING = 0.043
const CHAIN_ANCHOR = add3(
  CUFF_CENTER,
  scale3(perpendicular([1, 0, 0], CUFF_AXIS), CUFF_RING + 0.03)
)

const BODY = blend(0.035, [
  blend(0.05, [
    ellipsoid([0, 1.35, -0.005], [0.165, 0.17, 0.11], TORSO_ROLL),
    limb([-0.2, 1.47, -0.01], [0.2, 1.45, -0.01], 0.07, 0.07),
    limb([-0.15, 1.4, -0.035], [-0.09, 1.13, -0.02], 0.075, 0.05),
    limb([0.15, 1.39, -0.035], [0.09, 1.13, -0.02], 0.075, 0.05),
    ellipsoid([-0.085, 1.39, 0.064], [0.098, 0.058, 0.042], TORSO_ROLL),
    ellipsoid([0.085, 1.383, 0.064], [0.098, 0.058, 0.042], TORSO_ROLL),
    ellipsoid([0, 1.1, 0.012], [0.122, 0.15, 0.09]),
    ellipsoid([0, 1.02, 0.05], [0.08, 0.1, 0.045]),
    ellipsoid([0, 0.95, -0.005], [0.145, 0.1, 0.1], PELVIS_ROLL),
    ellipsoid([-0.065, 0.9, -0.055], [0.08, 0.088, 0.068]),
    ellipsoid([0.065, 0.91, -0.055], [0.08, 0.088, 0.068]),
  ]),
  blend(0.03, [
    headPart([0, 0.1, -0.008], [0.082, 0.1, 0.095]),
    headPart([0, 0.05, 0.048], [0.058, 0.07, 0.062]),
    headPart([0, 0.118, 0.07], [0.07, 0.022, 0.035]),
    headPart([0, 0.08, 0.104], [0.015, 0.03, 0.026]),
    headPart([0, 0.0, 0.07], [0.056, 0.07, 0.056]),
    headPart([0, 0.125, -0.045], [0.072, 0.06, 0.052]),
  ]),
  blend(0.04, [
    limb([0, 1.45, -0.005], transform(HEAD_PIVOT, HEAD_ROTATION, [0, 0.04, 0]), 0.066, 0.056),
    limb([0, 1.55, -0.035], [-0.2, 1.48, -0.02], 0.055, 0.042),
    limb([0, 1.55, -0.035], [0.2, 1.45, -0.02], 0.055, 0.042),
  ]),
  // right arm, raised, fist closed around the fennel stalk
  blend(0.035, [
    ellipsoid([-0.232, 1.49, 0], [0.078, 0.085, 0.076]),
    limb(R_SHOULDER, R_ELBOW, 0.064, 0.046),
    ellipsoid(lerp3(R_SHOULDER, R_ELBOW, 0.5), [0.055, 0.1, 0.058], euler(0, 0, 0.245)),
    limb(R_ELBOW, R_WRIST, 0.05, 0.032),
    ellipsoid(TORCH_GRIP, [0.042, 0.054, 0.044]),
  ]),
  // fennel-stalk torch with two nodes and a flared cup at the tip
  blend(0.012, [
    limb([-0.262, 1.93, 0.07], TORCH_TIP, 0.016, 0.02),
    ellipsoid([-0.255, 2.16, 0.074], [0.024, 0.012, 0.024]),
    ellipsoid([-0.25, 2.26, 0.077], [0.025, 0.012, 0.025]),
    ellipsoid(TORCH_TIP, [0.03, 0.022, 0.03]),
  ]),
  // left arm, lowered and slightly out, open hand
  blend(0.035, [
    ellipsoid([0.235, 1.43, 0], [0.076, 0.088, 0.074]),
    limb(L_SHOULDER, L_ELBOW, 0.062, 0.046),
    ellipsoid(lerp3(L_SHOULDER, L_ELBOW, 0.5), [0.054, 0.1, 0.057], euler(0, 0, 0.245)),
    limb(L_ELBOW, L_WRIST, 0.05, 0.032),
    ellipsoid([0.378, 0.855, 0.035], [0.029, 0.056, 0.046]),
    ellipsoid([0.384, 0.79, 0.04], [0.023, 0.046, 0.039]),
    limb([0.375, 0.88, 0.066], [0.38, 0.84, 0.086], 0.014, 0.011),
  ]),
  // left leg, weight-bearing and straight
  blend(0.04, [
    limb([0.085, 0.93, 0], [0.085, 0.51, 0.015], 0.095, 0.058),
    ellipsoid([0.095, 0.72, 0.035], [0.078, 0.19, 0.072]),
    limb([0.085, 0.51, 0.015], [0.07, 0.085, -0.01], 0.058, 0.034),
    ellipsoid([0.085, 0.37, -0.03], [0.056, 0.115, 0.056]),
    limb([0.07, 0.05, -0.04], [0.09, 0.03, 0.15], 0.043, 0.031),
  ]),
  // right leg, relaxed: knee forward, heel lifted
  blend(0.04, [
    limb([-0.085, 0.905, 0], [-0.13, 0.5, 0.075], 0.093, 0.057),
    ellipsoid([-0.105, 0.7, 0.075], [0.076, 0.18, 0.068]),
    limb([-0.13, 0.5, 0.075], [-0.19, 0.11, -0.06], 0.057, 0.033),
    ellipsoid([-0.16, 0.35, -0.005], [0.055, 0.115, 0.055]),
    limb([-0.19, 0.075, -0.085], [-0.23, 0.028, 0.08], 0.041, 0.03),
  ]),
])

const TITAN = blend(0, [
  BODY,
  brokenCuff(CUFF_CENTER, CUFF_AXIS, perpendicular([0, 0, 1], CUFF_AXIS), CUFF_RING),
  ...[0, 1, 2].map((i) =>
    chainLink(add3(CHAIN_ANCHOR, [0.02 + 0.008 * i, -0.028 - 0.04 * i, 0]), i % 2 === 1)
  ),
])

export const titanSdf: Sdf = TITAN.sdf

const mulberry32 = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), state | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let surfaceCells: Float32Array | null = null

/** Octree descent from ROOT_CELL to GRID_CELL, keeping [center, |sdf(center)|] of shell cells. */
const collectCells = (x: number, y: number, z: number, size: number, out: number[]) => {
  const half = size / 2
  const distance = Math.abs(titanSdf(x + half, y + half, z + half))
  if (distance >= size * 0.87 + SAMPLE_BAND + LIPSCHITZ_SLACK) return
  if (size <= GRID_CELL) {
    out.push(x + half, y + half, z + half, distance)
    return
  }
  for (let c = 0; c < 8; c++)
    collectCells(x + (c & 1) * half, y + ((c >> 1) & 1) * half, z + (c >> 2) * half, half, out)
}

/** Surface-crossing grid cells (seed-independent, so computed once and cached). */
const getSurfaceCells = () => {
  if (surfaceCells) return surfaceCells
  const {min, max} = FIGURE_BOUNDS
  const cells: number[] = []
  for (let x = min[0]; x < max[0]; x += ROOT_CELL)
    for (let y = min[1]; y < max[1]; y += ROOT_CELL)
      for (let z = min[2]; z < max[2]; z += ROOT_CELL) collectCells(x, y, z, ROOT_CELL, cells)
  surfaceCells = new Float32Array(cells)
  return surfaceCells
}

/**
 * Area-uniform points on the Titan surface: rejection-sample a thin shell inside the cached
 * surface cells, then project each hit onto the zero set along the SDF gradient. The cell's
 * center distance rejects most misses before paying for a full SDF evaluation.
 */
export const sampleTitanSurface = (count: number, seed = 1): TitanSample => {
  const cells = getSurfaceCells()
  const random = mulberry32(seed)
  const [positions, normals, starts] = [0, 1, 2].map(() => new Float32Array(count * 3))
  const seeds = new Float32Array(count)
  let filled = 0
  for (let attempt = 0; filled < count && attempt < count * 400; attempt++) {
    const cell = Math.floor((random() * cells.length) / 4) * 4
    const ox = (random() - 0.5) * GRID_CELL
    const oy = (random() - 0.5) * GRID_CELL
    const oz = (random() - 0.5) * GRID_CELL
    const offset = Math.sqrt(ox * ox + oy * oy + oz * oz)
    if (cells[cell + 3] - offset >= SAMPLE_BAND + LIPSCHITZ_SLACK) continue
    const x = cells[cell] + ox
    const y = cells[cell + 1] + oy
    const z = cells[cell + 2] + oz
    const d = titanSdf(x, y, z)
    if (Math.abs(d) > SAMPLE_BAND) continue
    const gx = titanSdf(x + GRADIENT_STEP, y, z) - d
    const gy = titanSdf(x, y + GRADIENT_STEP, z) - d
    const gz = titanSdf(x, y, z + GRADIENT_STEP) - d
    const slope = Math.sqrt(gx * gx + gy * gy + gz * gz) / GRADIENT_STEP
    if (slope < MIN_SLOPE) continue
    const inv = 1 / (slope * GRADIENT_STEP)
    const step = d / slope
    const o = filled * 3
    normals[o] = gx * inv
    normals[o + 1] = gy * inv
    normals[o + 2] = gz * inv
    positions[o] = x - step * normals[o]
    positions[o + 1] = y - step * normals[o + 1]
    positions[o + 2] = z - step * normals[o + 2]
    seeds[filled++] = random()
  }
  if (filled < count) throw new Error(`Titan sampling stalled at ${filled}/${count} points`)
  for (let i = 0; i < count; i++) {
    const theta = random() * Math.PI * 2
    const cosPhi = random() * 2 - 1
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi)
    const r = 0.35 + 0.65 * Math.cbrt(random())
    const direction = [sinPhi * Math.cos(theta), cosPhi, sinPhi * Math.sin(theta)]
    starts.set(
      direction.map((v, a) => SCATTER_CENTER[a] + v * r * SCATTER_RADII[a]),
      i * 3
    )
  }
  return {count, positions, normals, starts, seeds}
}
