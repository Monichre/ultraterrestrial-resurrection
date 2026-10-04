'use client'

import { Smallcaps } from '@/features/research-platform/shared'
import type { EventBubbleData } from './types'

export type EventBubbleProps = {
  data: EventBubbleData
}

/** An info bubble popup anchored on the map. */
export function EventBubble({ data }: EventBubbleProps) {
  const { x, y, era, title, description, sourceCount, status } = data
  return (
    <div className="to-eventbubble" style={{ left: x, top: y }}>
      <Smallcaps>{era}</Smallcaps>
      <h4>{title}</h4>
      <p>{description}</p>
      <div className="to-bubble-row">
        <span>{sourceCount}</span>
        <span>{status}</span>
      </div>
    </div>
  )
}
