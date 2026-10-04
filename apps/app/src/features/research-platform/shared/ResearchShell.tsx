'use client'

import { type ReactNode } from 'react'
import './shell.css'

export type RailItem = {
  id: string
  icon: string
  active?: boolean
}

export type TopbarContext = {
  label: string
  trail: string
}

const DEFAULT_RAIL: RailItem[] = [
  { id: 'canvas', icon: '⌘' },
  { id: 'ledger', icon: '≣' },
  { id: 'observatory', icon: '◫' },
  { id: 'lab', icon: '◇' },
  { id: 'models', icon: '⌬' },
  { id: 'archive', icon: '▤' },
]

export type ResearchShellProps = {
  /** Active rail item id */
  activeRail?: string
  /** Override the full rail */
  rail?: RailItem[]
  /** Topbar context */
  context: TopbarContext
  /** Main content */
  children: ReactNode
  /** Search placeholder */
  searchPlaceholder?: string
  /** Sync status text */
  syncStatus?: string
  /** User name */
  user?: string
}

export function ResearchShell({
  activeRail,
  rail = DEFAULT_RAIL,
  context,
  children,
  searchPlaceholder = 'Search people, events, claims, sources…',
  syncStatus = 'SYNCED · 12s',
  user = 'Liam Ellis',
}: ResearchShellProps) {
  return (
    <div className="ut-app">
      <aside className="ut-rail">
        <div className="ut-logo">U</div>
        {rail.map((item) => (
          <button
            key={item.id}
            className={`ut-rail-btn ${item.active || item.id === activeRail ? 'active' : ''}`}
            type="button"
          >
            {item.icon}
          </button>
        ))}
        <div className="ut-rail-spacer" />
        <button className="ut-rail-btn" type="button">⚙</button>
        <div className="ut-avatar" />
      </aside>
      <div className="ut-shell">
        <header className="ut-topbar">
          <div className="ut-brand">Ultraterrestrial</div>
          <div className="ut-divider" />
          <div className="ut-context">
            <b>{context.label}</b>
            &nbsp;&nbsp; / &nbsp;&nbsp;{context.trail}
          </div>
          <div className="ut-search">⌕&nbsp;&nbsp; {searchPlaceholder}</div>
          <div className="ut-topchip">{syncStatus}</div>
          <div className="ut-topchip">{user}</div>
        </header>
        <main className="ut-main">{children}</main>
      </div>
    </div>
  )
}

/* === Exported primitive components === */

export function Panel({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ut-panel ${className}`} {...props}>
      {children}
    </div>
  )
}

export function Smallcaps({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`ut-smallcaps ${className}`}>{children}</div>
}

export function Pill({
  children,
  dotColor,
  className = '',
}: {
  children: ReactNode
  dotColor?: string
  className?: string
}) {
  return (
    <span className={`ut-pill ${className}`}>
      {dotColor && <span className="ut-dot" style={{ background: dotColor }} />}
      {children}
    </span>
  )
}

export function Btn({
  children,
  variant = 'default',
  className = '',
  ...props
}: {
  children: ReactNode
  variant?: 'default' | 'primary'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`ut-btn ${variant === 'primary' ? 'primary' : ''} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function H1({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h1 className={`ut-h1 ${className}`}>{children}</h1>
}

export function Status({ children }: { children: ReactNode }) {
  return <span className="ut-status">{children}</span>
}

export function ScoreBlock({
  label,
  value,
  barWidth = '78%',
  footer,
}: {
  label: string
  value: string | number
  barWidth?: string
  footer?: ReactNode
}) {
  return (
    <div className="ut-score">
      <div className="ut-score-top">
        <div>
          <div className="ut-smallcaps">{label}</div>
          <b>{value}</b>
        </div>
        <Pill>Inspectable</Pill>
      </div>
      <div className="ut-bar">
        <i style={{ width: barWidth }} />
      </div>
      {footer && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '9px', color: '#7e8784' }}>
          {footer}
        </div>
      )}
    </div>
  )
}

export function FactRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="ut-factrow">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

export function AIPanel({
  title,
  children,
  actions,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="ut-ai">
      <h4>{title}</h4>
      <p>{children}</p>
      {actions && (
        <div style={{ display: 'flex', gap: '7px', marginTop: '10px' }}>{actions}</div>
      )}
    </div>
  )
}

export function Quote({ children }: { children: ReactNode }) {
  return <div className="ut-quote">{children}</div>
}
