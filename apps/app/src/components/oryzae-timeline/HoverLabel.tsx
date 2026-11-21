'use client'

import {ORYZAE_COLORS} from './types'

export interface HoverLabelProps {
  label: string
}

export function HoverLabel({label}: HoverLabelProps) {
  return (
    <div
      style={{
        fontFamily: "'Noto Serif JP', serif",
        color: ORYZAE_COLORS.muted,
        fontSize: 14,
        letterSpacing: '0.05em',
      }}>
      {label}
    </div>
  )
}

HoverLabel.displayName = 'HoverLabel'
