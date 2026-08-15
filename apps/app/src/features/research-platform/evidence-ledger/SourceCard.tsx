'use client'

import type { SourceData } from './types'

export interface SourceCardProps {
  source: SourceData
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <div
      className="el-sourcecard"
      style={{ ['--el-accent' as string]: source.accentColor }}
    >
      <h4>{source.title}</h4>
      <p>{source.description}</p>
      <div className="el-foot">
        <span>{source.sourceType}</span>
        <span>{source.scoreLabel}</span>
      </div>
    </div>
  )
}
