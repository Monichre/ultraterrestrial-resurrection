import type {CSSProperties, ReactNode} from 'react'
import {PAPER_SURFACE_CLASS, type PaperSurfaceVariant} from './paper-textures'
import './writers-desk-notes.css'

export interface PaperSurfaceProps {
  variant?: PaperSurfaceVariant
  className?: string
  style?: CSSProperties
  children?: ReactNode
  as?: 'div' | 'main' | 'section'
}

/** Tiled paper / document texture surface for writers-desk UIs. */
export function PaperSurface({
  variant = 'desk',
  className,
  style,
  children,
  as: Tag = 'div',
}: PaperSurfaceProps) {
  return (
    <Tag
      className={[PAPER_SURFACE_CLASS[variant], className].filter(Boolean).join(' ')}
      style={style}>
      {children}
    </Tag>
  )
}
