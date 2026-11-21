'use client'

import { Smallcaps } from '@/features/research-platform/shared'
import type { MatrixBlob, MatrixAxisLabel } from './types'

export interface EvidenceMatrixProps {
  smallcaps: string
  title: string
  blobs: MatrixBlob[]
  axisLabels: MatrixAxisLabel[]
}

export function EvidenceMatrix({ smallcaps, title, blobs, axisLabels }: EvidenceMatrixProps) {
  return (
    <div className="synth">
      <Smallcaps>{smallcaps}</Smallcaps>
      <h3>{title}</h3>
      <div className="matrix">
        {blobs.map((blob, i) => (
          <span
            key={i}
            className="blob"
            style={{
              width: `${blob.width}px`,
              height: `${blob.height}px`,
              left: `${blob.left}px`,
              top: `${blob.top}px`,
              background: blob.color,
            }}
          />
        ))}
        {axisLabels.map((label, i) => (
          <span key={i} className="axislabel" style={label.style}>
            {label.text}
          </span>
        ))}
      </div>
    </div>
  )
}
