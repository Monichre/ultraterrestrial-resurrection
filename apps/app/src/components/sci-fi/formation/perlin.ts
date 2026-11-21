/**
 * Gustavson-style 3D Perlin noise (classic permutation table + gradient lattice).
 * Ported from the Formation° vanilla demo — used by cellular / atrophy / monde.
 */

const PERMUTATION = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8,
  99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35,
  11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134,
  139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46,
  245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
  200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124,
  123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28,
  42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
  129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251,
  34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192,
  214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205,
  93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
] as const

const GRAD3: ReadonlyArray<readonly [number, number, number]> = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
]

const perm = new Array<number>(512)
const gradP = new Array<readonly [number, number, number]>(512)

for (let i = 0; i < 256; i++) {
  perm[i] = perm[i + 256] = PERMUTATION[i]
  gradP[i] = gradP[i + 256] = GRAD3[PERMUTATION[i] % 12]
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b
const dot = (g: readonly [number, number, number], x: number, y: number, z: number) =>
  g[0] * x + g[1] * y + g[2] * z

/** Classic 3D Perlin noise in roughly [-1, 1]. */
export const perlin3 = (x: number, y: number, z: number): number => {
  let X = Math.floor(x)
  let Y = Math.floor(y)
  let Z = Math.floor(z)
  x -= X
  y -= Y
  z -= Z
  X &= 255
  Y &= 255
  Z &= 255

  const n000 = dot(gradP[X + perm[Y + perm[Z]]], x, y, z)
  const n001 = dot(gradP[X + perm[Y + perm[Z + 1]]], x, y, z - 1)
  const n010 = dot(gradP[X + perm[Y + 1 + perm[Z]]], x, y - 1, z)
  const n011 = dot(gradP[X + perm[Y + 1 + perm[Z + 1]]], x, y - 1, z - 1)
  const n100 = dot(gradP[X + 1 + perm[Y + perm[Z]]], x - 1, y, z)
  const n101 = dot(gradP[X + 1 + perm[Y + perm[Z + 1]]], x - 1, y, z - 1)
  const n110 = dot(gradP[X + 1 + perm[Y + 1 + perm[Z]]], x - 1, y - 1, z)
  const n111 = dot(gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]], x - 1, y - 1, z - 1)

  const u = fade(x)
  const v = fade(y)
  const w = fade(z)

  return lerp(
    lerp(lerp(n000, n100, u), lerp(n010, n110, u), v),
    lerp(lerp(n001, n101, u), lerp(n011, n111, u), v),
    w,
  )
}
