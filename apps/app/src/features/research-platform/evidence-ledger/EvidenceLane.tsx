'use client'

import { Pill } from '@/features/research-platform/shared'
import { SourceCard } from './SourceCard'
import type { Lane, SourceData } from './types'

export interface EvidenceLaneProps {
  lane: Lane
  title: string
  itemCount: number
  sources: SourceData[]
}

const laneClass: Record<Lane, string> = {
  support: 'support',
  challenge: 'challenge',
}

export function EvidenceLane({ lane, title, itemCount, sources }: EvidenceLaneProps) {
  return (
    <div className={`el-lane ${laneClass[lane]}`}>
      <div className="el-lanehead">
        <b>{title}</b>
        <Pill>{itemCount} items</Pill>
      </div>
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </div>
  )
}
