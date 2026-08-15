'use client'

import type { TimelineMarkerData } from './types'

export type TimelineMarkerProps = {
  data: TimelineMarkerData
}

/** A single event marker on the timeline axis. */
export function TimelineMarker({ data }: TimelineMarkerProps) {
  const { label, position, color } = data
  return (
    <span
      className="to-marker"
      data-label={label}
      style={{
        left: position,
        ...(color
          ? { background: color, boxShadow: `0 0 0 1px ${color}` }
          : null),
      }}
    />
  )
}
