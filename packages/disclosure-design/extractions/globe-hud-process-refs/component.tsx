import type { ReactNode } from 'react'

export interface GlobeHudStripProps {
  readouts?: string[]
  children?: ReactNode
}

export const GlobeHudStrip = ({ readouts = [], children }: GlobeHudStripProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'stretch',
        background: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        minHeight: 220,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', padding: 'var(--spacing-md)' }}>{children}</div>
      <dl
        style={{
          margin: 0,
          padding: 'var(--spacing-md)',
          borderLeft: '1px solid var(--color-border-primary)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          color: 'var(--color-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
          minWidth: 200,
        }}
      >
        {readouts.map((r) => (
          <div key={r}>{r}</div>
        ))}
      </dl>
    </div>
  )
}
