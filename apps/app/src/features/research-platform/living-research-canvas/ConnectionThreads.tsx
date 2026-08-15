'use client'

import type { ConnectionThread } from './types'

export type ConnectionThreadsProps = {
  threads: ConnectionThread[]
  viewBox?: string
}

export function ConnectionThreads({ threads, viewBox = '0 0 1368 892' }: ConnectionThreadsProps) {
  return (
    <svg className="lrc-thread" viewBox={viewBox} preserveAspectRatio="none">
      <defs>
        <filter id="lrc-soft">
          <feGaussianBlur stdDeviation="0.65" />
        </filter>
      </defs>
      {threads.map((t) => (
        <path
          key={t.id}
          d={t.d}
          stroke={t.stroke}
          strokeWidth={t.strokeWidth}
          fill="none"
          strokeLinecap="round"
          opacity={t.opacity}
        />
      ))}
    </svg>
  )
}
