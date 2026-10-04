'use client'

import { Smallcaps, Btn } from '@/features/research-platform/shared'
import type { DecisionData } from './types'

export interface DecisionPanelProps {
  data: DecisionData
}

export function DecisionPanel({ data }: DecisionPanelProps) {
  return (
    <div className="decision">
      <Smallcaps>{data.smallcaps}</Smallcaps>
      <h3>{data.title}</h3>
      <p>{data.conclusion}</p>
      {data.questions.map((q) => (
        <div key={q.id} className="question">
          {q.text}
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {data.actions.map((action) => (
          <Btn key={action.id} variant={action.variant}>
            {action.label}
          </Btn>
        ))}
      </div>
    </div>
  )
}
