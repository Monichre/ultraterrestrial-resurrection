import type { ReactNode } from 'react'

export interface EvidenceRung {
  label: string
  tone: 'teal' | 'amber' | 'red'
}

export interface GatewayHeroProps {
  statement: string
  rungs: EvidenceRung[]
  children?: ReactNode
}

const RUNG_COLOR: Record<EvidenceRung['tone'], string> = {
  teal: 'var(--color-info, #2f6f6f)',
  amber: 'var(--color-warning, #8a6d2f)',
  red: 'var(--color-error, #7a3b2e)',
}

export const GatewayHero = ({ statement, rungs, children }: GatewayHeroProps) => {
  return (
    <section
      style={{
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        padding: 'var(--spacing-2xl, 64px) var(--spacing-lg)',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          maxWidth: 720,
          margin: 0,
        }}
      >
        {statement}
      </h1>
      <ol style={{ listStyle: 'none', padding: 0, margin: 'var(--spacing-xl) 0 0' }}>
        {rungs.map((rung, i) => (
          <li
            key={rung.label}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-sm) 0',
              borderTop: '1px solid var(--color-border-primary)',
            }}
          >
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: 12,
                color: RUNG_COLOR[rung.tone],
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{rung.label}</span>
          </li>
        ))}
      </ol>
      {children}
    </section>
  )
}
