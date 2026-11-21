import type { CoordinateExtent, NodeOrigin, XYPosition } from "@xyflow/react"

type Position = 'top' | 'bottom' | 'left' | 'right'

interface Handle {
  type: 'source' | 'target'
  position: Position
  x: number
  y: number
  width: number
  height: number
}

interface NodeData {
  label: string
}

interface PositionCoordinates {
  x: number
  y: number
}

export interface xyFlowNode {
  id: string
  type: 'input' | 'output'
  data: NodeData
  position: PositionCoordinates
  size: { width: number; height: number }
  handles: Handle[]
}

export interface xyEdge {
  id: string
  source: xyFlowNode['id']
  target: xyFlowNode['id']

  animated: boolean
}
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string,
> = {
  id: string
  position: XYPosition
  data: NodeData
  type?: NodeType
  sourcePosition?: Position
  targetPosition?: Position
  hidden?: boolean
  selected?: boolean
  dragging?: boolean
  draggable?: boolean
  selectable?: boolean
  connectable?: boolean
  resizing?: boolean
  deletable?: boolean
  dragHandle?: string
  width?: number | null
  height?: number | null
  parentId?: string
  zIndex?: number
  extent?: 'parent' | CoordinateExtent
  expandParent?: boolean
  ariaLabel?: string
  focusable?: boolean
  style?: React.CSSProperties
  className?: string
  origin?: NodeOrigin
  handles?: NodeHandle[]
  measured?: {
    width?: number
    height?: number
  }
}
