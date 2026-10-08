import type {Node} from '@xyflow/react'

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

/**
 * Resolve once React Flow's measured size for `nodeId` has held steady for three
 * frames (max ~1s). Layout that runs right after updateNodeData otherwise reads
 * the pre-render size and places new nodes inside the answer node.
 */
export async function waitForStableMeasure(
  getNodes: () => Node[],
  nodeId: string
): Promise<Node | undefined> {
  let last = ''
  let stable = 0
  let node: Node | undefined
  for (let frame = 0; frame < 60 && stable < 3; frame++) {
    await nextFrame()
    node = getNodes().find((candidate) => candidate.id === nodeId)
    const size = node?.measured ? `${node.measured.width}x${node.measured.height}` : ''
    stable = size && size === last ? stable + 1 : 0
    last = size
  }
  return node
}
