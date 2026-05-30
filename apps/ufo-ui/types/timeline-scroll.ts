import type React from "react"
import type { ReactNode } from "react"

export interface Position3D {
  x: string | number
  y: string | number
  z: number
}

export interface TimelineElement {
  id: string
  type: "text" | "image" | "box" | "html"
  content: string | ReactNode
  date?: string
  imageUrl?: string
  position: Position3D
  style?: React.CSSProperties
}

export interface YearSection {
  year: number
  description: string
  baseZIndex: number
  scrollSpeed?: number
  backgroundColor?: string
  backgroundImage?: string
  backgroundOverlay?: string
  events: TimelineElement[]
}
