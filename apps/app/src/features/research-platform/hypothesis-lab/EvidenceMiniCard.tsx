'use client'

import type { EvidenceMiniCardData } from './types'

export interface EvidenceMiniCardProps {
  data: EvidenceMiniCardData
}

export function EvidenceMiniCard({ data }: EvidenceMiniCardProps) {
  return (
    <div className={`mini ${data.variant}`}>
      <h4>{data.title}</h4>
      <p>{data.content}</p>
    </div>
  )
}
