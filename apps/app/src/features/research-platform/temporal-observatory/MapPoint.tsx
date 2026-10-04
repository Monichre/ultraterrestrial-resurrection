'use client'

import type { MapPointData } from './types'

export type MapPointProps = {
  data: MapPointData
}

/** A single event point dot on the observatory map. */
export function MapPoint({ data }: MapPointProps) {
  const { x, y, color, variant } = data
  const variantClass = variant === 'default' ? '' : variant
  return (
    <span
      className={`to-point ${variantClass}`.trim()}
      style={{ left: x, top: y, background: color }}
    />
  )
}
