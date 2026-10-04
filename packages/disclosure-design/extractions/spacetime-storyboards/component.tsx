import type { ReactNode } from 'react'

export interface SpacetimeComparePanelProps {
  before?: ReactNode
  after?: ReactNode
  beforeLabel?: string
  afterLabel?: string
}

export const SpacetimeComparePanel = ({
  before,
  after,
  beforeLabel = 'T-0',
  afterLabel = 'T-1',
}: SpacetimeComparePanelProps) => {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
        background: 'var(--color-border-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      {[
        { label: beforeLabel, body: before },
        { label: afterLabel, body: after },
      ].map((pane) => (
        <div key={pane.label} style={{ background: 'var(--color-bg-primary)', position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              top: 'var(--spacing-sm)',
              left: 'var(--spacing-sm)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              zIndex: 1,
            }}
          >
            {pane.label}
          </span>
          <div style={{ minHeight: 320 }}>{pane.body}</div>
        </div>
      ))}
    </section>
  )
}
