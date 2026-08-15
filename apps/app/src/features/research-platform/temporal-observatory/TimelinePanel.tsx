'use client'

import { Smallcaps, H1, Btn } from '@/features/research-platform/shared'
import { TimelineMarker } from './TimelineMarker'
import type {
  TimelineTick,
  TimelineMarkerData,
  BrushRange,
} from './types'

export type TimelinePanelProps = {
  /** Smallcaps label above the timeline title. */
  label?: string
  /** Timeline title. */
  title?: string
  /** Control button labels; the play button (index 1) is rendered as primary. */
  controls?: string[]
  /** Year ticks on the axis. */
  ticks?: TimelineTick[]
  /** Event markers on the axis. */
  markers?: TimelineMarkerData[]
  /** Brush selection range. When omitted, the default mockup range is used. */
  brush?: BrushRange
}

/** The bottom timeline panel with axis, ticks, markers, and brush. */
export function TimelinePanel({
  label = 'Chronology projection',
  title = 'Disclosure and nuclear infrastructure',
  controls = ['◀', '▶ Play sequence', 'Fit selection'],
  ticks = [],
  markers = [],
  brush = { left: '36%', right: '13%' },
}: TimelinePanelProps) {
  return (
    <div className="to-timeline">
      <div className="to-timeline-head">
        <div>
          <Smallcaps>{label}</Smallcaps>
          <H1>{title}</H1>
        </div>
        <div className="to-controls">
          {controls.map((c, i) => (
            <Btn key={c} variant={i === 1 ? 'primary' : 'default'}>
              {c}
            </Btn>
          ))}
        </div>
      </div>

      <div className="to-axis">
        {ticks.map((tick) => (
          <div key={tick.label} className="to-tick" style={{ left: tick.position }}>
            <label>{tick.label}</label>
          </div>
        ))}

        {markers.map((marker) => (
          <TimelineMarker key={marker.id} data={marker} />
        ))}
      </div>

      <div
        className="to-brush"
        style={{ left: brush.left, right: brush.right }}
      />
    </div>
  )
}
