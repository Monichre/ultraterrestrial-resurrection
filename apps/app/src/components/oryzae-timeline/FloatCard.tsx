'use client'

import type {CardSpec} from './types'

export interface FloatCardProps {
  spec: CardSpec
  hovered: boolean
}

export function FloatCard({spec, hovered}: FloatCardProps) {
  return (
    <div
      style={{
        width: spec.width,
        background: spec.bg,
        padding: spec.pad,
        boxShadow: spec.shadow,
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hovered
          ? `translateY(-4px) rotate(${spec.hoverRotate}deg)`
          : `rotate(${spec.baseRotate}deg)`,
      }}>
      {spec.body}
    </div>
  )
}

FloatCard.displayName = 'FloatCard'
