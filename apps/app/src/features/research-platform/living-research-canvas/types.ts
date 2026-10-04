export type CanvasCardVariant = 'paper' | 'gray' | 'photo'

export type CanvasCardType =
  | 'government-record'
  | 'organization'
  | 'event'
  | 'testimony'
  | 'hypothesis'
  | 'photo'

export type CanvasCardMeta = {
  left: string
  right: string
}

export type CanvasCardPosition = {
  left: number
  top: number
  width: number
}

export type CanvasCardData = {
  id: string
  type: CanvasCardType
  typeLabel: string
  title: string
  description?: string
  meta: CanvasCardMeta
  position: CanvasCardPosition
  rotation: number
  cardVariant: CanvasCardVariant
  /** Optional override gradient for paper/gray cards */
  background?: string
  /** Pin position on the canvas */
  pin: { left: number; top: number }
  /** Photo cards render a title size override */
  photoTitleSize?: number
}

export type Layer = {
  id: string
  label: string
  color: string
  count?: number
  active?: boolean
}

export type SavedView = {
  id: string
  label: string
}

export type ConnectionThread = {
  id: string
  d: string
  stroke: string
  strokeWidth: number
  opacity: number
}

export type EntityFact = {
  label: string
  value: string
}
