'use client'

import '@/features/mindmap/research-canvas/canvas-animations.css'

import {useState} from 'react'
import {GLOSSARY, LAST_SYNCED, TICKETING_SYSTEM, TICKETS, type Status, type Ticket} from './data'

const STATUS_ORDER: {status: Status; label: string; accent: string}[] = [
  {status: 'blocked', label: 'Blocked', accent: 'var(--ut-stamp)'},
  {status: 'in_progress', label: 'In Progress', accent: '#d4a017'},
  {status: 'decision_ready', label: 'Decision Ready', accent: '#9b7bb8'},
  {status: 'open', label: 'Open', accent: 'var(--ut-ink-dim)'},
]

const LANE_LABEL: Record<string, string> = {A: 'Lane A · Corpus & Ingestion', B: 'Lane B · Platform & Experience'}

function LaneTag({lane}: {lane: Ticket['lane']}) {
  if (!lane) return null
  const color = lane === 'A' ? '#d4a017' : '#6bbf7a'
  return (
    <span
      className='ut-mono shrink-0 rounded-sm px-1.5 py-0.5 text-[8px] tracking-[0.12em] uppercase'
      style={{color, border: `1px solid ${color}55`}}
    >
      {lane}
    </span>
  )
}

function TicketCard({t}: {t: Ticket}) {
  return (
    <div
      className='flex flex-col gap-1 border-b px-3 py-2.5 last:border-b-0'
      style={{borderColor: 'var(--ut-line)'}}
    >
      <div className='flex items-start justify-between gap-2'>
        <span className='ut-mono text-[9px] tracking-[0.1em]' style={{color: 'var(--ut-ink-faint)'}}>
          {t.id}
        </span>
        <LaneTag lane={t.lane} />
      </div>
      <p className='text-[12.5px] leading-snug' style={{color: 'var(--ut-paper)'}}>
        {t.title}
      </p>
      {t.note && (
        <p className='text-[10.5px] leading-snug italic' style={{color: 'var(--ut-ink-dim)'}}>
          {t.note}
        </p>
      )}
    </div>
  )
}

function GlossaryRail() {
  const [open, setOpen] = useState<string | null>('H1')
  return (
    <aside
      className='flex w-[300px] shrink-0 flex-col border-r'
      style={{borderColor: 'var(--ut-line)', background: 'var(--ut-surface)'}}
    >
      <div className='border-b px-4 py-3' style={{borderColor: 'var(--ut-line)'}}>
        <p className='ut-mono text-[9px] tracking-[0.14em] uppercase' style={{color: 'var(--ut-ink-faint)'}}>
          Glossary
        </p>
        <p className='mt-1 text-[11px]' style={{color: 'var(--ut-ink-dim)'}}>
          What H1, M0, D3, Lane A etc. mean — click a term.
        </p>
      </div>
      <div className='flex flex-1 flex-col overflow-y-auto'>
        {GLOSSARY.map((g) => {
          const isOpen = open === g.term
          return (
            <button
              key={g.term}
              type='button'
              onClick={() => setOpen(isOpen ? null : g.term)}
              className='flex flex-col gap-1 border-b px-4 py-3 text-left transition-colors'
              style={{borderColor: 'var(--ut-line)', background: isOpen ? 'var(--ut-surface-2, rgba(255,255,255,0.03))' : 'transparent'}}
            >
              <div className='flex items-baseline justify-between gap-2'>
                <span className='ut-mono text-[11px] tracking-[0.06em]' style={{color: 'var(--ut-paper)'}}>
                  {g.term}
                </span>
                <span className='text-[10px]' style={{color: 'var(--ut-ink-faint)'}}>
                  {isOpen ? '−' : '+'}
                </span>
              </div>
              <span className='text-[10.5px]' style={{color: 'var(--ut-ink-dim)'}}>
                {g.meaning}
              </span>
              {isOpen && (
                <p className='mt-1 text-[10.5px] leading-relaxed' style={{color: 'var(--ut-ink-dim)'}}>
                  {g.detail}
                </p>
              )}
            </button>
          )
        })}
      </div>
      <div className='border-t px-4 py-3' style={{borderColor: 'var(--ut-line)'}}>
        <p className='ut-mono text-[9px] tracking-[0.14em] uppercase' style={{color: 'var(--ut-ink-faint)'}}>
          Where tickets live
        </p>
        <p className='mt-1.5 text-[10.5px] leading-relaxed' style={{color: 'var(--ut-ink-dim)'}}>
          <code className='ut-mono' style={{color: 'var(--ut-paper)'}}>{TICKETING_SYSTEM.where}</code> — {TICKETING_SYSTEM.what}
        </p>
        <p className='mt-2 text-[10.5px] leading-relaxed' style={{color: 'var(--ut-ink-dim)'}}>
          {TICKETING_SYSTEM.who}
        </p>
        <p className='mt-2 text-[10.5px] leading-relaxed' style={{color: 'var(--ut-stamp)'}}>
          {TICKETING_SYSTEM.rule}
        </p>
      </div>
    </aside>
  )
}

function RoadmapStrip({title, steps, current}: {title: string; steps: string[]; current: string}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <p className='ut-mono text-[9px] tracking-[0.14em] uppercase' style={{color: 'var(--ut-ink-faint)'}}>
        {title}
      </p>
      <div className='flex items-center gap-1'>
        {steps.map((s, i) => {
          const isCurrent = s === current
          const isPast = steps.indexOf(current) > i
          return (
            <div key={s} className='flex items-center gap-1'>
              <span
                className='ut-mono rounded-sm px-1.5 py-0.5 text-[9px]'
                style={{
                  color: isCurrent ? 'var(--ut-void)' : isPast ? 'var(--ut-ink-dim)' : 'var(--ut-ink-faint)',
                  background: isCurrent ? '#d4a017' : 'transparent',
                  border: isCurrent ? 'none' : '1px solid var(--ut-line)',
                }}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <span style={{color: 'var(--ut-line)'}}>—</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function BoardPage() {
  const done = TICKETS.filter((t) => t.status === 'done')
  const [showDone, setShowDone] = useState(false)

  return (
    <div className='dark flex h-screen' style={{background: 'var(--ut-void)', color: 'var(--ut-paper)'}}>
      <GlossaryRail />

      <main className='flex flex-1 flex-col overflow-hidden'>
        <header className='flex items-start justify-between border-b px-6 py-5' style={{borderColor: 'var(--ut-line)'}}>
          <div>
            <p className='ut-mono text-[9px] tracking-[0.14em] uppercase' style={{color: 'var(--ut-ink-faint)'}}>
              Ultraterrestrial · shared reference · not the source of truth
            </p>
            <h1 className='ut-typewriter mt-1 text-xl' style={{color: 'var(--ut-paper)'}}>
              Board
            </h1>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <span className='ut-mono text-[9px]' style={{color: 'var(--ut-ink-faint)'}}>
              synced {LAST_SYNCED} · regenerated from docs/plans/TODO.md
            </span>
            <div className='flex gap-4'>
              <RoadmapStrip title='Lane A · T-048' steps={['H0', 'H0.5', 'H1', 'H2', 'H3', 'H4', 'H5']} current='H0' />
              <RoadmapStrip title='Lane B · T-047' steps={['M0', 'M1', 'M2', 'M3', 'M4']} current='M0' />
            </div>
          </div>
        </header>

        <div className='flex flex-1 gap-4 overflow-x-auto p-4'>
          {STATUS_ORDER.map(({status, label, accent}) => {
            const items = TICKETS.filter((t) => t.status === status)
            if (items.length === 0) return null
            return (
              <div
                key={status}
                className='flex w-[280px] shrink-0 flex-col rounded-sm border'
                style={{borderColor: 'var(--ut-line)', background: 'var(--ut-surface)'}}
              >
                <div
                  className='flex items-center justify-between border-b px-3 py-2'
                  style={{borderColor: 'var(--ut-line)'}}
                >
                  <span className='ut-mono text-[9px] tracking-[0.12em] uppercase' style={{color: accent}}>
                    {label}
                  </span>
                  <span className='ut-mono text-[9px]' style={{color: 'var(--ut-ink-faint)'}}>
                    {items.length}
                  </span>
                </div>
                <div className='flex flex-1 flex-col overflow-y-auto'>
                  {items.map((t) => (
                    <TicketCard key={t.id} t={t} />
                  ))}
                </div>
              </div>
            )
          })}

          <div
            className='flex w-[280px] shrink-0 flex-col rounded-sm border'
            style={{borderColor: 'var(--ut-line)', background: 'var(--ut-surface)'}}
          >
            <button
              type='button'
              onClick={() => setShowDone((v) => !v)}
              className='flex items-center justify-between border-b px-3 py-2'
              style={{borderColor: 'var(--ut-line)'}}
            >
              <span className='ut-mono text-[9px] tracking-[0.12em] uppercase' style={{color: '#6bbf7a'}}>
                Done {showDone ? '▾' : '▸'}
              </span>
              <span className='ut-mono text-[9px]' style={{color: 'var(--ut-ink-faint)'}}>
                {done.length}
              </span>
            </button>
            {showDone && (
              <div className='flex flex-1 flex-col overflow-y-auto'>
                {done.map((t) => (
                  <TicketCard key={t.id} t={t} />
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className='border-t px-6 py-2.5' style={{borderColor: 'var(--ut-line)'}}>
          <p className='ut-mono text-[9px]' style={{color: 'var(--ut-ink-faint)'}}>
            This page updates live via Next.js Fast Refresh while `bun run dev` is running —
            keep this tab open and it reflects edits to data.ts as they're saved, no manual reload needed.
          </p>
        </footer>
      </main>
    </div>
  )
}
