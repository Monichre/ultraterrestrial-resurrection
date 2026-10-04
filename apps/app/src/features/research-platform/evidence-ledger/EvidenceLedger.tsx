'use client'

import { ResearchShell } from '@/features/research-platform/shared'
import { ResearchIndex } from './ResearchIndex'
import { ClaimWorkspace } from './ClaimWorkspace'
import { ProvenanceInspector } from './ProvenanceInspector'
import type {
  IndexCategory,
  ClaimData,
  SourceData,
  ComparisonRow,
  ProvenanceStep,
  MetricData,
} from './types'
import './ledger.css'

export interface EvidenceLedgerProps {
  categories: IndexCategory[]
  filters: string[]
  claim: ClaimData
  supportingSources: SourceData[]
  challengingSources: SourceData[]
  comparisonRows: ComparisonRow[]
  primaryHeader: string
  reconstructionHeader: string
  lineageTitle: string
  provenanceSteps: ProvenanceStep[]
  metrics: MetricData[]
  aiTitle: string
  aiSuggestion: string
}

export function EvidenceLedger({
  categories,
  filters,
  claim,
  supportingSources,
  challengingSources,
  comparisonRows,
  primaryHeader,
  reconstructionHeader,
  lineageTitle,
  provenanceSteps,
  metrics,
  aiTitle,
  aiSuggestion,
}: EvidenceLedgerProps) {
  return (
    <ResearchShell
      activeRail="ledger"
      context={{ label: 'Evidence Ledger', trail: `Claim ${claim.id}` }}
    >
      <section className="el-ledger">
        <ResearchIndex categories={categories} filters={filters} />
        <ClaimWorkspace
          claim={claim}
          supportingSources={supportingSources}
          challengingSources={challengingSources}
          comparisonRows={comparisonRows}
          primaryHeader={primaryHeader}
          reconstructionHeader={reconstructionHeader}
        />
        <ProvenanceInspector
          lineageTitle={lineageTitle}
          steps={provenanceSteps}
          metrics={metrics}
          aiTitle={aiTitle}
          aiSuggestion={aiSuggestion}
        />
      </section>
    </ResearchShell>
  )
}
