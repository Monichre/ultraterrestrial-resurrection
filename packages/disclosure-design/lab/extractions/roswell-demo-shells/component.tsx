import type { ReactNode } from 'react'

export interface ResearchShellFrameProps {
  caseId: string
  title: string
  toolbar?: ReactNode
  children?: ReactNode
}

export const ResearchShellFrame = ({ caseId, title, toolbar, children }: ResearchShellFrameProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderBottom: '1px solid var(--color-border-primary)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>
          {caseId} — {title}
        </span>
        {toolbar}
      </header>
      <main
        style={{
          flex: 1,
          margin: 'var(--spacing-lg)',
          background: 'var(--color-bg-document, #e5dfd5)',
          color: 'var(--color-text-on-document, #1c1c1c)',
          padding: 'var(--spacing-xl)',
          overflow: 'auto',
          lineHeight: 1.6,
        }}
      >
        {children}
      </main>
    </div>
  )
}
