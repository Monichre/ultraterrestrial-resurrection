import type { ReactNode } from 'react'

export interface ResearchDeskPlateProps {
  rail?: ReactNode
  inspector?: ReactNode
  status?: string
  children?: ReactNode
}

export const ResearchDeskPlate = ({ rail, inspector, status, children }: ResearchDeskPlateProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr 280px',
        gridTemplateRows: '40px 1fr',
        height: '100%',
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          gridColumn: '1 / -1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--spacing-md)',
          borderBottom: '1px solid var(--color-border-primary)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>RESEARCH DESK</span>
        <span style={{ color: 'var(--color-primary)' }}>{status ?? 'IDLE'}</span>
      </header>
      <nav
        style={{
          borderRight: '1px solid var(--color-border-primary)',
          padding: 'var(--spacing-sm) 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
        }}
      >
        {rail}
      </nav>
      <main style={{ padding: 'var(--spacing-lg)', overflow: 'auto' }}>{children}</main>
      <aside
        style={{
          borderLeft: '1px solid var(--color-border-primary)',
          padding: 'var(--spacing-md)',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        {inspector}
      </aside>
    </div>
  )
}
