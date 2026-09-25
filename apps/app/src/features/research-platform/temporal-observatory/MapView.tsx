'use client'

import { Smallcaps, H1, Btn } from '@/features/research-platform/shared'
import { MapPoint } from './MapPoint'
import { EventBubble } from './EventBubble'
import { ConnectionArc } from './ConnectionArc'
import { MapLegend } from './MapLegend'
import type {
  MapPointData,
  EventBubbleData,
  ConnectionArcData,
  LegendItem,
} from './types'

export type MapViewProps = {
  /** Smallcaps label above the map title. */
  label?: string
  /** Map title. */
  title?: string
  /** Subtitle paragraph. */
  subtitle?: string
  /** Filter button labels; the first is rendered as primary. */
  filters?: string[]
  /** Event points. */
  points?: MapPointData[]
  /** Connection arcs. */
  arcs?: ConnectionArcData[]
  /** Event bubbles. */
  bubbles?: EventBubbleData[]
  /** Legend items. */
  legend?: LegendItem[]
}

/** The map area: grid, landmass, header, filters, points, arcs, bubbles, legend. */
export function MapView({
  label = 'Temporal–geospatial observatory',
  title = 'Nuclear-linked anomalous reports',
  subtitle = 'Filtered to multi-witness, military, or sensor-supported events',
  filters = ['1945–2026', 'Infrastructure: Nuclear', 'Confidence ≥ 0.62'],
  points = [],
  arcs = [],
  bubbles = [],
  legend = [],
}: MapViewProps) {
  return (
    <div className="to-mapwrap">
      <div className="to-mapgrid" />
      <div className="to-land" />

      <div className="to-maphead">
        <Smallcaps>{label}</Smallcaps>
        <H1>{title}</H1>
        <p>{subtitle}</p>
      </div>

      <div className="to-filters">
        {filters.map((f, i) => (
          <Btn key={f} variant={i === 0 ? 'primary' : 'default'}>
            {f}
          </Btn>
        ))}
      </div>

      {arcs.map((arc) => (
        <ConnectionArc key={arc.id} data={arc} />
      ))}

      {points.map((point) => (
        <MapPoint key={point.id} data={point} />
      ))}

      {bubbles.map((bubble) => (
        <EventBubble key={bubble.id} data={bubble} />
      ))}

      {legend.length > 0 && <MapLegend items={legend} />}
    </div>
  )
}
