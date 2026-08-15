'use client'

import { Smallcaps, AIPanel } from '@/features/research-platform/shared'
import { RadarChart } from './RadarChart'
import { MetricBar } from './MetricBar'
import type { ProvenanceStep, MetricData } from './types'

export interface ProvenanceInspectorProps {
  lineageTitle: string
  steps: ProvenanceStep[]
  metrics: MetricData[]
  aiTitle: string
  aiSuggestion: string
}

export function ProvenanceInspector({
  lineageTitle,
  steps,
  metrics,
  aiTitle,
  aiSuggestion,
}: ProvenanceInspectorProps) {
  return (
    <aside className="el-right">
      <Smallcaps>Provenance inspector</Smallcaps>
      <h3>{lineageTitle}</h3>
      <div className="el-prov">
        {steps.map((step) => (
          <div key={step.number} className="el-provline">
            <div className="el-n">{step.number}</div>
            <div>
              <b>{step.title}</b>
              <span>{step.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '18px' }}>
        <Smallcaps>Credibility composition</Smallcaps>
      </div>
      <RadarChart />

      {metrics.map((metric) => (
        <MetricBar key={metric.label} metric={metric} />
      ))}

      <AIPanel title={aiTitle}>{aiSuggestion}</AIPanel>
    </aside>
  )
}
