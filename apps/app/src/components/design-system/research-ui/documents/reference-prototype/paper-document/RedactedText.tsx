'use client'

import type {CSSProperties} from 'react'
import {generateRedacted} from './generate-redacted-text'
import type {RedactedSpec} from '../types/paper-document'

interface Props {
  spec: RedactedSpec
  className?: string
  style?: CSSProperties
  /** override font size */
  align?: 'left' | 'right'
}

/**
 * Renders a block of decorative, simulated-illegible monospace text.
 * Always aria-hidden — this is NOT real content.
 */
export function RedactedText({spec, className = '', style, align = 'left'}: Props) {
  const lines = generateRedacted({
    lines: spec.lines,
    charsPerLine: spec.charsPerLine,
    redactChance: spec.redactChance,
    seed: spec.seed ?? 1,
  })

  return (
    <div
      aria-hidden='true'
      className={`font-mono select-none pointer-events-none ${className}`}
      style={{
        fontSize: `${spec.sizePx ?? 9}px`,
        lineHeight: 1.35,
        letterSpacing: '0.02em',
        color: 'var(--pd-ink-faded)',
        textAlign: align,
        opacity: spec.opacity ?? 0.55,
        ...style,
      }}>
      {lines.map((l, i) => (
        <div key={i} style={{opacity: l.fade}}>
          {l.text}
        </div>
      ))}
    </div>
  )
}
