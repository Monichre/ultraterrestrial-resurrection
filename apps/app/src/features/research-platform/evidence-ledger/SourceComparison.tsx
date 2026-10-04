'use client'

import { Smallcaps } from '@/features/research-platform/shared'
import type { ComparisonRow, ComparisonSentiment } from './types'

export interface SourceComparisonProps {
  primaryHeader: string
  reconstructionHeader: string
  rows: ComparisonRow[]
}

const sentimentClass: Record<ComparisonSentiment, string> = {
  good: 'el-good',
  bad: 'el-bad',
  neutral: '',
}

export function SourceComparison({
  primaryHeader,
  reconstructionHeader,
  rows,
}: SourceComparisonProps) {
  return (
    <div className="el-compare">
      <div style={{ marginBottom: '8px' }}>
        <Smallcaps>Source comparison</Smallcaps>
      </div>
      <div className="el-comparegrid">
        <div className="el-label" />
        <div>{primaryHeader}</div>
        <div>{reconstructionHeader}</div>
        {rows.map((row) => (
          <div key={row.label} style={{ display: 'contents' }}>
            <div className="el-label">{row.label}</div>
            <div className={sentimentClass[row.primarySentiment ?? 'neutral']}>
              {row.primaryValue}
            </div>
            <div className={sentimentClass[row.reconstructionSentiment ?? 'neutral']}>
              {row.reconstructionValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
