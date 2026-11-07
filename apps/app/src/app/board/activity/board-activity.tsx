'use client'

// Prop-driven activity pieces for /board. No fetching in here — the page (or
// a story) passes sessions in. Visual grammar: evidence-ledger sourcecard meta
// row (label left / metric right) and a monogram facepile with +N overflow.
// Color: --ut-signal marks "active"; everything else is ink. No evidentiary
// badge colors (locked semantics) and no --ut-inference (AI output only).

import {useId, useState} from 'react'
import {AGENT_MONOGRAM, formatAge, formatLongDate} from './parse'
import type {Recency, SessionActivity} from './types'

const RECENCY_COLOR: Record<Recency, string> = {
  active: 'var(--ut-signal)',
  recent: 'var(--ut-ink-dim)',
  dormant: 'var(--ut-ink-faint)',
}

const FOCUS = 'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--ut-paper)]'

export function AgentMonogram({session}: {session: Pick<SessionActivity, 'agent' | 'recency'>}) {
  const color = RECENCY_COLOR[session.recency]
  return (
    <span
      aria-hidden
      className='ut-mono inline-flex h-[18px] w-[22px] shrink-0 items-center justify-center text-[8px]'
      style={{color, border: `1px solid ${session.recency === 'active' ? 'var(--ut-signal)' : 'var(--ut-line-strong)'}`}}
    >
      {AGENT_MONOGRAM[session.agent]}
    </span>
  )
}

export function SessionTime({iso, now}: {iso: string; now: number}) {
  return (
    <time dateTime={iso} title={formatLongDate(iso)} className='ut-mono shrink-0 text-[8.5px]' style={{color: 'var(--ut-ink-faint)'}}>
      {formatAge(iso, now)}
    </time>
  )
}

/** Redaction-bar skeleton line; reuses .ut-redaction from canvas-animations.css. */
export function RedactionLine({width = '100%'}: {width?: string}) {
  return <span aria-hidden className='ut-redaction block' style={{width}} />
}

/**
 * Footer meta row on a ticket card: the newest session whose first prompt
 * named this ticket. "Named in prompt", not ownership.
 */
export function TicketActivityRow({
  session,
  loading = false,
  now,
}: {
  session?: SessionActivity | null
  loading?: boolean
  now: number
}) {
  if (loading) {
    return (
      <div className='mt-1 flex items-center gap-2 border-t pt-1.5' style={{borderColor: 'var(--ut-line)'}}>
        <RedactionLine width='22px' />
        <RedactionLine width='55%' />
        <span className='sr-only'>Loading session activity</span>
      </div>
    )
  }
  if (!session) return null
  return (
    <div
      className='mt-1 flex items-center gap-2 border-t pt-1.5'
      style={{borderColor: 'var(--ut-line)'}}
      title={`${session.agent} session "${session.title}" named this ticket in its first prompt. Last write ${formatLongDate(session.lastWriteAt)}.`}
    >
      <AgentMonogram session={session} />
      <span className='min-w-0 flex-1 truncate text-[10px]' style={{color: RECENCY_COLOR[session.recency]}}>
        <span className='sr-only'>{session.agent}: </span>
        {session.title}
      </span>
      <SessionTime iso={session.lastWriteAt} now={now} />
    </div>
  )
}

/**
 * Header facepile: newest sessions as monograms, +N reveals the full list
 * (including sessions that name no ticket on the board).
 */
export function AgentFacepile({
  sessions,
  loading = false,
  unavailable = false,
  error,
  now,
  max = 5,
}: {
  sessions: SessionActivity[]
  loading?: boolean
  unavailable?: boolean
  error?: string
  now: number
  max?: number
}) {
  const [open, setOpen] = useState(false)
  const listId = useId()

  if (loading) {
    return (
      <div className='flex flex-col items-end gap-1.5' aria-busy>
        <div className='ut-mono text-[9px] tracking-[0.14em]' style={{color: 'var(--ut-ink-faint)'}}>
          Retrieving sessions…
        </div>
        <div className='flex items-center gap-1'>
          {Array.from({length: max}, (_, i) => (
            <RedactionLine key={i} width='22px' />
          ))}
        </div>
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className='ut-mono text-[9px]' style={{color: 'var(--ut-ink-faint)'}}>
        Session capture not on this host
      </div>
    )
  }

  const activeCount = sessions.filter((s) => s.recency === 'active').length
  const newest = sessions[0]
  const shown = sessions.slice(0, max)
  const overflow = sessions.length - shown.length

  return (
    <div
      className='relative flex flex-col items-end gap-1.5'
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      <div className='ut-mono text-[9px] tracking-[0.14em]' style={{color: 'var(--ut-ink-faint)'}}>
        Agents ·{' '}
        <span style={{color: activeCount ? 'var(--ut-signal)' : 'var(--ut-ink-faint)'}}>{activeCount} active</span>
        {newest && (
          <>
            {' '}· last write <time dateTime={newest.lastWriteAt}>{formatLongDate(newest.lastWriteAt)}</time>
          </>
        )}
        {error && <span style={{color: 'var(--ut-stamp)'}}> · poll failed</span>}
      </div>
      <div className='flex items-center gap-1'>
        {shown.map((s) => (
          <span key={s.id} title={`${s.agent} — ${s.title} — ${formatAge(s.lastWriteAt, now)} ago`}>
            <AgentMonogram session={s} />
            <span className='sr-only'>{`${s.agent}: ${s.title}`}</span>
          </span>
        ))}
        <button
          type='button'
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className={`ut-mono flex h-[18px] items-center px-1.5 text-[8px] ${FOCUS}`}
          style={{color: 'var(--ut-ink-dim)', border: '1px solid var(--ut-line-strong)'}}
        >
          {overflow > 0 ? `+${overflow}` : 'All'} {open ? '▴' : '▾'}
          <span className='sr-only'> recent sessions</span>
        </button>
      </div>
      {open && (
        <ol
          id={listId}
          className='absolute top-full right-0 z-20 mt-1 max-h-[340px] w-[340px] overflow-y-auto border'
          style={{borderColor: 'var(--ut-line-strong)', background: 'var(--ut-void)'}}
        >
          {sessions.map((s, i) => (
            <li
              key={s.id}
              className='flex items-center gap-2 border-b px-2.5 py-1.5 last:border-b-0'
              style={{borderColor: 'var(--ut-line)'}}
            >
              <span className='ut-mono w-4 shrink-0 text-[8px]' style={{color: 'var(--ut-ink-faint)'}}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <AgentMonogram session={s} />
              <span className='min-w-0 flex-1 truncate text-[10.5px]' style={{color: RECENCY_COLOR[s.recency]}}>
                {s.title}
              </span>
              {s.tickets.length > 0 && (
                <span className='ut-mono shrink-0 text-[8px]' style={{color: 'var(--ut-ink-dim)'}}>
                  {s.tickets.slice(0, 2).join(' ')}
                  {s.tickets.length > 2 ? ` +${s.tickets.length - 2}` : ''}
                </span>
              )}
              <SessionTime iso={s.lastWriteAt} now={now} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
