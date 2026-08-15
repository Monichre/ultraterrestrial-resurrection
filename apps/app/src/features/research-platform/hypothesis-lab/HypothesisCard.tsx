'use client'

import { Smallcaps } from '@/features/research-platform/shared'
import type { HypothesisData } from './types'
import { EvidenceMiniCard } from './EvidenceMiniCard'
import { TestablePrediction } from './TestablePrediction'

export interface HypothesisCardProps {
  data: HypothesisData
}

export function HypothesisCard({ data }: HypothesisCardProps) {
  return (
    <article className="hyp" style={{ ['--glow' as string]: data.glowColor }}>
      <div className="hyptop">
        <div>
          <Smallcaps>{data.label}</Smallcaps>
          <div className="hyptitle">{data.title}</div>
        </div>
        <div className="score">
          <Smallcaps>Fit</Smallcaps>
          <b>{data.fitScore}</b>
        </div>
      </div>
      <p className="hypdesc">{data.description}</p>
      <div className="evidenceband">
        {data.evidence.map((card) => (
          <EvidenceMiniCard key={card.id} data={card} />
        ))}
      </div>
      <TestablePrediction label="Testable prediction" text={data.prediction} />
    </article>
  )
}
