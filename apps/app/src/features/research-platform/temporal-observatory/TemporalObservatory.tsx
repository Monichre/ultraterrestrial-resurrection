'use client'

import { ResearchShell } from '@/features/research-platform/shared'
import { MapView } from './MapView'
import { TimelinePanel } from './TimelinePanel'
import type {
  MapPointData,
  EventBubbleData,
  ConnectionArcData,
  LegendItem,
  TimelineTick,
  TimelineMarkerData,
  BrushRange,
} from './types'
import './observatory.css'

export type TemporalObservatoryProps = {
  /** Topbar context label. */
  contextLabel?: string
  /** Topbar context trail. */
  contextTrail?: string
  /** Active rail item id. */
  activeRail?: string
  /** Map view props (forwarded). */
  map?: {
    label?: string
    title?: string
    subtitle?: string
    filters?: string[]
    points?: MapPointData[]
    arcs?: ConnectionArcData[]
    bubbles?: EventBubbleData[]
    legend?: LegendItem[]
  }
  /** Timeline panel props (forwarded). */
  timeline?: {
    label?: string
    title?: string
    controls?: string[]
    ticks?: TimelineTick[]
    markers?: TimelineMarkerData[]
    brush?: BrushRange
  }
}

/**
 * Temporal–Geospatial Observatory view.
 *
 * Two-row layout: a flexible map area on top and a 240px timeline at the
 * bottom, wrapped in the shared research-platform shell.
 */
export function TemporalObservatory({
  contextLabel = 'Temporal–Geospatial Observatory',
  contextTrail = 'Nuclear Pattern',
  activeRail = 'observatory',
  map = {},
  timeline = {},
}: TemporalObservatoryProps) {
  return (
    <ResearchShell
      activeRail={activeRail}
      context={{ label: contextLabel, trail: contextTrail }}
    >
      <section className="to-observatory">
        <MapView {...map} />
        <TimelinePanel {...timeline} />
      </section>
    </ResearchShell>
  )
}
