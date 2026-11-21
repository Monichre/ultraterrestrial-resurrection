'use client'

import { Smallcaps } from '@/features/research-platform/shared'
import type { RankingItem } from './types'

export interface SynthesisRankingProps {
  smallcaps: string
  title: string
  items: RankingItem[]
}

export function SynthesisRanking({ smallcaps, title, items }: SynthesisRankingProps) {
  return (
    <div className="synth">
      <Smallcaps>{smallcaps}</Smallcaps>
      <h3>{title}</h3>
      {items.map((item) => (
        <div key={item.rank} className="rank">
          <span>{item.rank}</span>
          <b>{item.title}</b>
          <em>{item.score}</em>
        </div>
      ))}
    </div>
  )
}
