'use client'

import {
  AIPanel,
  Btn,
  FactRow,
  Panel,
  Pill,
  Quote,
  ScoreBlock,
  Smallcaps,
  Status,
} from '@/features/research-platform/shared'
import type { EntityFact } from './types'

export type EntityInspectorProps = {
  name: string
  status: string
  quote: string
  facts: EntityFact[]
  scoreLabel: string
  scoreValue: string | number
  scoreBarWidth?: string
  scoreFooter?: React.ReactNode
  aiTitle: string
  aiBody: string
}

export function EntityInspector({
  name,
  status,
  quote,
  facts,
  scoreLabel,
  scoreValue,
  scoreBarWidth,
  scoreFooter,
  aiTitle,
  aiBody,
}: EntityInspectorProps) {
  return (
    <div className="lrc-rightdock ut-panel">
      <div className="lrc-inspector-head">
        <div>
          <Smallcaps>Selected entity</Smallcaps>
          <div className="lrc-inspector-name">{name}</div>
        </div>
        <Status>{status}</Status>
      </div>

      <Quote>{quote}</Quote>

      {facts.map((fact) => (
        <FactRow key={fact.label} label={fact.label} value={fact.value} />
      ))}

      <ScoreBlock
        label={scoreLabel}
        value={scoreValue}
        barWidth={scoreBarWidth}
        footer={scoreFooter}
      />

      <AIPanel title={aiTitle} actions={<><Btn variant="primary">Review</Btn><Btn>Dismiss</Btn></>}>
        {aiBody}
      </AIPanel>
    </div>
  )
}
