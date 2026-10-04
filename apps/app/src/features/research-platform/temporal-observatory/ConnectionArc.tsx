'use client'

import type { ConnectionArcData } from './types'

export type ConnectionArcProps = {
  data: ConnectionArcData
}

/** A curved connection arc between two map points. */
export function ConnectionArc({ data }: ConnectionArcProps) {
  const { left, top, width, height, rotation, color } = data
  return (
    <div
      className="to-arc"
      style={{
        left,
        top,
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        ...(color ? { borderColor: color } : null),
      }}
    />
  )
}
