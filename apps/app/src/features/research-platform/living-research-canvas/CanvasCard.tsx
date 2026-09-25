'use client'

import type { CSSProperties } from 'react'
import type { CanvasCardData } from './types'

export type CanvasCardProps = {
  card: CanvasCardData
}

export function CanvasCard({ card }: CanvasCardProps) {
  const { position, rotation, cardVariant, background, typeLabel, title, description, meta, photoTitleSize } = card

  const style: CSSProperties = {
    left: position.left,
    top: position.top,
    width: position.width,
    // CSS custom property consumed by `.lrc-card { transform: rotate(var(--r)) }`
    ['--r' as string]: `${rotation}deg`,
  }

  if (background) {
    style.background = background
  }

  const isPhoto = cardVariant === 'photo'

  return (
    <article className={`lrc-card ${isPhoto ? 'photo' : ''}`} style={style}>
      {isPhoto ? (
        <>
          <div className="img" />
          <div className="ctitle" style={{ fontSize: photoTitleSize ?? 13, margin: '8px 3px 2px' }}>
            {title}
          </div>
          <div className="meta">
            <span>{meta.left}</span>
            <span>{meta.right}</span>
          </div>
        </>
      ) : (
        <>
          <div className="type">{typeLabel}</div>
          <div className="ctitle">{title}</div>
          {description && <p>{description}</p>}
          <div className="meta">
            <span>{meta.left}</span>
            <span>{meta.right}</span>
          </div>
        </>
      )}
    </article>
  )
}
