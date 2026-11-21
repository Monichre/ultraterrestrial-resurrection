import type { ReactNode } from 'react'

export interface DocumentPanelProps {
  title: string
  reference?: string
  children?: ReactNode
}

export const DocumentPanel = ({ title, reference, children }: DocumentPanelProps) => {
  return (
    <figure
      style={{
        background: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-xl)',
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: '1px solid var(--color-border-primary)',
          paddingBottom: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <span style={{ fontSize: 'var(--font-size-md, 16px)', color: 'var(--color-text-primary)' }}>
          {title}
        </span>
        {reference ? (
          <span
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
            }}
          >
            {reference}
          </span>
        ) : null}
      </header>
      <div style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{children}</div>
    </figure>
  )
}
