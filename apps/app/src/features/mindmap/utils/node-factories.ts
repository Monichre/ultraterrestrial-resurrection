import {ROOT_NODE_POSITIONS} from '@/features/mindmap/config/index.config'
import type {Node} from '@xyflow/react'

// ---------------------------------------------------------------------------
// createRootNode
// ---------------------------------------------------------------------------
export function createRootNode(
  node: {
    id: string
    label?: string
    name?: string
    fill?: string
    data: Record<string, unknown> & {type: string}
    childNodes?: Array<unknown>
  },
  _index: number
) {
  const {id, label, name, fill, data} = node
  const title = label || name
  const childCount = node?.childNodes ? node?.childNodes?.length : 0

  return {
    id,
    type: 'rootNode',
    position: ROOT_NODE_POSITIONS[data.type as keyof typeof ROOT_NODE_POSITIONS],
    data: {
      childCount,
      ...data,
      label: title,
      fill,
    },
  }
}

// ---------------------------------------------------------------------------
// createRootNodeChild
// ---------------------------------------------------------------------------
export function createRootNodeChild(node: {
  id: string
  label?: string
  name?: string
  fill?: string
  data: Record<string, unknown>
}) {
  const {id, label, name, fill, data} = node
  const title = label || name

  return {
    id,
    data: {
      ...data,
      label: title,
      fill,
    },
    type: 'entityNode',
  }
}

// ---------------------------------------------------------------------------
// createSiblingEdge
// ---------------------------------------------------------------------------
export function createSiblingEdge(
  sourceNode: {id: string},
  targetNode: {id: string},
  type?: string
) {
  const id = `${sourceNode.id}:${targetNode.id}`
  const edgeType = type || 'siblingEdge'

  return {
    id,
    source: sourceNode.id,
    target: targetNode.id,
    animated: true,
    type: edgeType,
    markerEnd: 'custom-marker',
    style: {
      stroke: '#fff',
    },
    sourceHandle: `handle:${id}`,
  }
}

// ---------------------------------------------------------------------------
// createRootNodeEdge
// Accepts a getNode function so it can resolve string sources without
// needing a React hook / reactFlowInstance directly.
// ---------------------------------------------------------------------------
export function createRootNodeEdge(
  rootNodeChildNode: {id: string; data?: Record<string, unknown>},
  source: string | {id: string; data?: Record<string, unknown>},
  getNode: (id: string) => Node | undefined
) {
  const isObject = typeof source === 'object'
  const isString = typeof source === 'string'
  const sourceNode = isString ? getNode(source) : isObject ? source : null

  if (!sourceNode) return null

  const id = `${sourceNode.id}:${rootNodeChildNode.id}`

  return {
    id,
    source: sourceNode.id,
    target: rootNodeChildNode.id,
    animated: true,
    type: 'rootNodeEdge',
    markerEnd: 'custom-marker',
    style: {
      stroke: '#fff',
    },
    sourceHandle: `handle:${id}`,
  }
}

// ---------------------------------------------------------------------------
// createRootNodeEdges
// ---------------------------------------------------------------------------
export function createRootNodeEdges(
  rootNodeChildNodes: Node[],
  source: string | {id: string; data?: Record<string, unknown>},
  getNode: (id: string) => Node | undefined
) {
  return rootNodeChildNodes.map((node) => createRootNodeEdge(node, source, getNode))
}
