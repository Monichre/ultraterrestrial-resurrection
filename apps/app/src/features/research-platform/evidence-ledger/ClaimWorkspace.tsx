'use client'

import { Smallcaps, Pill, Btn, H1 } from '@/features/research-platform/shared'
import { EvidenceLane } from './EvidenceLane'
import { SourceComparison } from './SourceComparison'
import type { ClaimData, SourceData, ComparisonRow } from './types'

export interface ClaimWorkspaceProps {
  claim: ClaimData
  supportingSources: SourceData[]
  challengingSources: SourceData[]
  comparisonRows: ComparisonRow[]
  primaryHeader: string
  reconstructionHeader: string
}

export function ClaimWorkspace({
  claim,
  supportingSources,
  challengingSources,
  comparisonRows,
  primaryHeader,
  reconstructionHeader,
}: ClaimWorkspaceProps) {
  return (
    <div className="el-center">
      <div className="el-headrow">
        <div>
          <Smallcaps>Claim workspace / {claim.id}</Smallcaps>
          <H1>{claim.headline}</H1>
        </div>
        <div className="el-actions">
          <Btn>Compare sources</Btn>
          <Btn variant="primary">Add evidence</Btn>
        </div>
      </div>

      <div className="el-claim">
        <div className="el-claimmeta">
          <Pill dotColor={claim.statusDotColor ?? '#c98f46'}>{claim.status}</Pill>
          <Pill>Confidence {claim.confidence}</Pill>
          <Pill>
            {claim.supportingCount} supporting · {claim.challengingCount} challenging
          </Pill>
        </div>
        <h2>{claim.question}</h2>
        <Smallcaps>Working interpretation</Smallcaps>
        <p className="el-claim-body">{claim.interpretation}</p>
      </div>

      <div className="el-lanes">
        <EvidenceLane
          lane="support"
          title="Supporting evidence"
          itemCount={claim.supportingCount}
          sources={supportingSources}
        />
        <EvidenceLane
          lane="challenge"
          title="Challenging evidence"
          itemCount={claim.challengingCount}
          sources={challengingSources}
        />
      </div>

      <SourceComparison
        primaryHeader={primaryHeader}
        reconstructionHeader={reconstructionHeader}
        rows={comparisonRows}
      />
    </div>
  )
}
