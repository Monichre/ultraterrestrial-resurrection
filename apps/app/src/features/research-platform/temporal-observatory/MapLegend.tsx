'use client'

import type { LegendItem } from './types'

export type MapLegendProps = {
  items: LegendItem[]
}

/** The legend bar showing color meanings for map points. */
export function MapLegend({ items }: MapLegendProps) {
  return (
    <div className="to-legend">
      {items.map((item) => (
        <span key={item.id}>
          <i style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
