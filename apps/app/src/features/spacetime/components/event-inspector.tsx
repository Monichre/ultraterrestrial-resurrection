'use client'

import {useEffect} from 'react'
import {MapPin, X} from 'lucide-react'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {STC_EPISTEMIC_COLOR} from '../lib/spacetime-theme'
import {useSpacetimeStore} from '../state/spacetime-store'
import type {EpistemicStatus, TimePrecision} from '../types/spacetime'

/**
 * Event Inspector — concept-01 frame 3, docked right of the map.
 *
 * The board's stat row is DATE · LOCAL TIME · SOURCES 128 · CREDIBILITY 72%.
 * Three of those four have no backing column in the curated `events` table, and
 * the shipped code already made the right call once by deleting a fabricated
 * "Credibility 55%". So the row keeps the board's shape but is filled with what
 * the record actually carries — and **prints the resolution of the date**, which
 * is a genuine field (`timePrecision`) the normalizer computes and nothing was
 * rendering. A medieval chronicle and a 1947 press date are not the same claim
 * about time, and the inspector is where that has to be visible.
 *
 * The absent cells are named as absent rather than dropped silently: a
 * researcher should be able to see that this record has no source count, not
 * merely fail to find one.
 */

const EPISTEMIC_COPY: Record<EpistemicStatus, string> = {
  documented: 'Documented — the record carries a substantive account',
  inferred: 'Thin record — little or no narrative attached',
  disputed: 'Disputed — sources contradict one another',
}

const PRECISION_COPY: Record<TimePrecision, string> = {
  second: 'to the second',
  minute: 'to the minute',
  hour: 'to the hour',
  day: 'to the day',
  month: 'to the month',
  year: 'year only',
  season: 'to the season',
}

export function EventInspector() {
  const selectedEventId = useSpacetimeStore((s) => s.selectedEventId)
  const events = useSpacetimeStore((s) => s.events)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)

  const event = events.find((e) => e.id === selectedEventId)
  const stillVisible =
    event != null && filterSpacetimeEvents([event], layers, filters).length > 0

  // A record filtered off the canvas must not keep an open inspector — that
  // would leave the panel asserting something the globe no longer shows.
  useEffect(() => {
    if (selectedEventId && event && !stillVisible) selectEvent(null)
  }, [selectedEventId, event, stillVisible, selectEvent])

  // Escape closes, as it does for every other dismissible surface in the app.
  useEffect(() => {
    if (!selectedEventId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectEvent(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedEventId, selectEvent])

  if (!event || !stillVisible) return null

  const status = event.epistemicStatus ?? 'inferred'

  return (
    // `top-14` clears the LAYERS button, which docks at `top-4` in the same
    // corner — an inspector starting at `top-4` covers it, so opening a record
    // would make the layer control unreachable until you closed it again.
    <aside
      aria-label='Event inspector'
      className='pointer-events-auto absolute top-14 right-4 bottom-12 z-30 flex w-[22rem] flex-col overflow-hidden rounded-xl border border-[rgba(125,190,210,0.22)] bg-[rgba(8,13,17,0.94)] shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md'
    >
      <header className='flex items-center gap-2 border-b border-[rgba(125,190,210,0.14)] px-3.5 py-2.5'>
        <span className='font-mono text-[8px] tracking-[0.24em] text-[#7d8f95] uppercase'>
          Event inspector
        </span>
        <button
          type='button'
          onClick={() => selectEvent(null)}
          aria-label='Close inspector'
          className='ml-auto text-[#707f86] transition-colors hover:text-[#dbe7ea]'
        >
          <X size={14} strokeWidth={1.6} />
        </button>
      </header>

      <div className='min-h-0 flex-1 overflow-y-auto px-3.5 py-3'>
        <h2 className='text-[17px] leading-snug font-semibold tracking-tight text-[#eef6f8]'>
          {event.title}
        </h2>

        {event.locationDescription ? (
          <p className='mt-1.5 flex items-center gap-1.5 text-[11px] text-[#8b9ba1]'>
            <MapPin size={11} strokeWidth={1.6} className='shrink-0' />
            {event.locationDescription}
          </p>
        ) : (
          <p className='mt-1.5 flex items-center gap-1.5 text-[11px] text-[#707f86]'>
            <MapPin size={11} strokeWidth={1.6} className='shrink-0' />
            No location recorded
          </p>
        )}

        <dl className='mt-3.5 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-[rgba(125,190,210,0.12)] py-3'>
          <Stat label='Date' value={event.timestamp.slice(0, 10)} />
          <Stat label='Resolution' value={PRECISION_COPY[event.timePrecision]} />
          <Stat
            label='Sources'
            value={event.sourceIds?.length ? String(event.sourceIds.length) : '—'}
            hint={event.sourceIds?.length ? undefined : 'no source list on this record'}
          />
          <Stat
            label='Credibility'
            value={
              event.credibilityScore != null
                ? `${Math.round(event.credibilityScore * 100)}%`
                : '—'
            }
            hint={
              event.credibilityScore != null ? undefined : 'corpus carries no score'
            }
          />
        </dl>

        <div className='mt-3.5'>
          <p className='font-mono text-[8px] tracking-[0.24em] text-[#7d8f95] uppercase'>
            Attestation
          </p>
          <p className='mt-1.5 flex items-start gap-2 text-[11px] leading-relaxed text-[#b6c6cb]'>
            <span
              aria-hidden
              className='mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full'
              style={{backgroundColor: STC_EPISTEMIC_COLOR[status]}}
            />
            {EPISTEMIC_COPY[status]}
          </p>
        </div>

        {event.summary ? (
          <div className='mt-3.5'>
            <p className='font-mono text-[8px] tracking-[0.24em] text-[#7d8f95] uppercase'>
              Account
            </p>
            <p className='mt-1.5 text-[12px] leading-relaxed text-[#c3d3d8]'>
              {event.summary}
            </p>
          </div>
        ) : null}
      </div>

      <footer className='border-t border-[rgba(125,190,210,0.14)] px-3.5 py-2.5'>
        <p className='font-mono text-[8px] tracking-[0.2em] text-[#707f86] uppercase'>
          Provenance · {event.sourceTable ?? 'unknown'}
          {event.sourceRecordId ? ` · ${event.sourceRecordId.slice(0, 8)}` : ''}
        </p>
        {/* Plan §3, the lever principle: browsing is free, generation is not. */}
        <p className='mt-1 font-mono text-[8px] tracking-[0.2em] text-[#707f86] uppercase'>
          Reconstruction requires the lever — scroll is not intent
        </p>
      </footer>
    </aside>
  )
}

function Stat({label, value, hint}: {label: string; value: string; hint?: string}) {
  return (
    <div>
      <dt className='font-mono text-[8px] tracking-[0.22em] text-[#707f86] uppercase'>
        {label}
      </dt>
      <dd className='mt-0.5 font-mono text-[12px] text-[#dbe7ea]'>{value}</dd>
      {hint ? (
        <dd className='mt-0.5 text-[9px] leading-tight text-[#707f86] italic'>{hint}</dd>
      ) : null}
    </div>
  )
}
