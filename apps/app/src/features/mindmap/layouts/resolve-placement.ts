import type {Node} from '@xyflow/react'

/**
 * Overlap-free placement for cards added to the canvas.
 *
 * Every add path (agent answer, agent-named entities, record rows, tour and
 * signal records) picks a "desired" position from its own layout rule. These
 * helpers keep that intent and only nudge a card to the nearest free spot when
 * its rectangle would cover a card already on the canvas.
 */

export type Size = {width: number; height: number}
type Point = {x: number; y: number}
type Rect = {x: number; y: number; width: number; height: number}

/** Used when a node has not been measured yet (fresh, pre-render). */
export const DEFAULT_CARD_SIZE: Size = {width: 384, height: 300}
const GAP = 40
const STEP = 60
const MAX_RINGS = 40

export function nodeSize(node: Node, fallback: Size = DEFAULT_CARD_SIZE): Size {
  return {
    width: node.measured?.width ?? node.width ?? fallback.width,
    height: node.measured?.height ?? node.height ?? fallback.height,
  }
}

function overlaps(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width + GAP &&
    a.x + a.width + GAP > b.x &&
    a.y < b.y + b.height + GAP &&
    a.y + a.height + GAP > b.y
  )
}

/** Obstacles are top-level nodes only; parent-relative children are skipped. */
function toRects(nodes: Node[]): Rect[] {
  return nodes
    .filter((node) => !node.parentId && !node.hidden)
    .map((node) => ({...node.position, ...nodeSize(node)}))
}

function findFree(desired: Point, size: Size, rects: Rect[]): Point {
  const fits = (p: Point) => !rects.some((r) => overlaps({...p, ...size}, r))
  if (fits(desired)) return desired

  // Square rings around the desired point, nearest ring first.
  for (let ring = 1; ring <= MAX_RINGS; ring++) {
    const d = ring * STEP
    let best: Point | null = null
    let bestDist = Infinity
    for (let i = -ring; i <= ring; i++) {
      const candidates: Point[] = [
        {x: desired.x + i * STEP, y: desired.y - d},
        {x: desired.x + i * STEP, y: desired.y + d},
        {x: desired.x - d, y: desired.y + i * STEP},
        {x: desired.x + d, y: desired.y + i * STEP},
      ]
      for (const c of candidates) {
        const dist = Math.hypot(c.x - desired.x, c.y - desired.y)
        if (dist < bestDist && fits(c)) {
          best = c
          bestDist = dist
        }
      }
    }
    if (best) return best
  }
  return desired
}

/** Nearest free position for one card of `size` near `desired`. */
export function findFreePosition(desired: Point, size: Size, existing: Node[]): Point {
  return findFree(desired, size, toRects(existing))
}

/**
 * Places `incoming` one by one, each avoiding `existing` and the cards placed
 * before it. Parent-relative nodes keep their position untouched.
 */
export function placeNodesAvoiding<T extends Node>(
  incoming: T[],
  existing: Node[],
  fallback: Size = DEFAULT_CARD_SIZE
): T[] {
  const rects = toRects(existing)
  return incoming.map((node) => {
    if (node.parentId) return node
    const size = nodeSize(node, fallback)
    const position = findFree(node.position, size, rects)
    rects.push({...position, ...size})
    return position === node.position ? node : {...node, position}
  })
}
