'use client'

import { ResearchShell, Smallcaps, H1, Btn } from '@/features/research-platform/shared'
import type { HypothesisData, RankingItem, MatrixBlob, MatrixAxisLabel, DecisionData } from './types'
import { HypothesisCard } from './HypothesisCard'
import { SynthesisRanking } from './SynthesisRanking'
import { EvidenceMatrix } from './EvidenceMatrix'
import { DecisionPanel } from './DecisionPanel'
import './lab.css'

export interface HypothesisLabProps {
  smallcaps: string
  title: string
  subtitle: string
  actions: { id: string; label: string; variant?: 'default' | 'primary' }[]
  hypotheses: HypothesisData[]
  ranking: {
    smallcaps: string
    title: string
    items: RankingItem[]
  }
  matrix: {
    smallcaps: string
    title: string
    blobs: MatrixBlob[]
    axisLabels: MatrixAxisLabel[]
  }
  decision: DecisionData
}

export function HypothesisLab({
  smallcaps,
  title,
  subtitle,
  actions,
  hypotheses,
  ranking,
  matrix,
  decision,
}: HypothesisLabProps) {
  return (
    <ResearchShell
      activeRail="lab"
      context={{ label: 'Hypothesis Lab', trail: 'Competing Explanations' }}
    >
      <section className="lab">
        <div className="labhead">
          <div>
            <Smallcaps>{smallcaps}</Smallcaps>
            <H1>{title}</H1>
            <p>{subtitle}</p>
          </div>
          <div className="actions">
            {actions.map((action) => (
              <Btn key={action.id} variant={action.variant}>
                {action.label}
              </Btn>
            ))}
          </div>
        </div>
        <div className="grid">
          {hypotheses.map((hyp) => (
            <HypothesisCard key={hyp.id} data={hyp} />
          ))}
          <div className="stack">
            <SynthesisRanking
              smallcaps={ranking.smallcaps}
              title={ranking.title}
              items={ranking.items}
            />
            <EvidenceMatrix
              smallcaps={matrix.smallcaps}
              title={matrix.title}
              blobs={matrix.blobs}
              axisLabels={matrix.axisLabels}
            />
            <DecisionPanel data={decision} />
          </div>
        </div>
      </section>
    </ResearchShell>
  )
}
