'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react'
import {cn} from '@/lib/utils'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {useSpacetimeStore} from '../state/spacetime-store'

/**
 * Playback transport — concept-04 frames 2–3 (`ACTIVITY PLAYBACK` /
 * `PLAYBACK CONTROLS`: play, speed, prev/next event stepping, `n / N events`).
 *
 * **What is and is not built from that board.** The transport is: it needs only
 * timestamps, which every record has. Concept-04's surrounding panels are not:
 * `AI SYNTHESIS`, `NOTABLE CLUSTERS`, `MILITARY RESPONSE`, and the sighting-type
 * breakdown all require columns this corpus does not carry (sensor modality,
 * sortie counts, cluster attribution). Drawing them would be inventing data —
 * see §3 of the realignment plan for the same call on the credibility ring.
 *
 * **Stepping is event-to-event, not wall-clock.** The board plays a 24-hour flap
 * where uniform time-stepping always has something happening. This corpus spans
 * 196 CE → 2026 with long empty stretches; a uniform sweep would sit on nothing
 * for most of its run. Speed is therefore **records per second**, and the label
 * says so rather than showing a `1.0×` that would imply real-time.
 */

const SPEEDS = [1, 2, 5] as const

export function PlaybackTransport({className}: {className?: string}) {
  const events = useSpacetimeStore((s) => s.events)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)
  const setTemporalCursor = useSpacetimeStore((s) => s.setTemporalCursor)
  const setInteractionMode = useSpacetimeStore((s) => s.setInteractionMode)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)

  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1)

  /** Chronological playback order over what is actually on the canvas. */
  const timeline = useMemo(
    () =>
      filterSpacetimeEvents(events, layers, filters).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    [events, layers, filters],
  )

  /**
   * Current position, derived from the cursor rather than held separately.
   * A second source of truth here would let the transport and the dial disagree
   * about "where we are" the moment anything else moved the cursor — which the
   * store contract (D1) exists to prevent.
   */
  const index = useMemo(() => {
    if (timeline.length === 0) return -1
    const ts = cursor.mode === 'range' ? cursor.start : cursor.timestamp
    const target = new Date(ts).getTime()
    if (!Number.isFinite(target)) return -1
    let best = 0
    let bestDt = Infinity
    timeline.forEach((e, i) => {
      const dt = Math.abs(new Date(e.timestamp).getTime() - target)
      if (dt < bestDt) {
        bestDt = dt
        best = i
      }
    })
    return best
  }, [timeline, cursor])

  const goTo = useCallback(
    (next: number, {select}: {select: boolean}) => {
      const event = timeline[next]
      if (!event) return
      setInteractionMode('free')
      setTemporalCursor({
        mode: 'exact',
        timestamp: event.timestamp,
        precision: event.timePrecision,
      })
      // While playing, opening the inspector on every step would flash a panel
      // 5×/second and drag the camera to ground level each time. Stepping by
      // hand is a deliberate act, so that one does select.
      selectEvent(select ? event.id : null)
    },
    [timeline, setInteractionMode, setTemporalCursor, selectEvent],
  )

  // Advance on an interval while playing. `indexRef` keeps the tick reading the
  // live position without making the interval depend on it — a dependency there
  // would tear down and recreate the timer on every single step.
  const indexRef = useRef(index)
  indexRef.current = index

  useEffect(() => {
    if (!playing || timeline.length === 0) return
    const id = window.setInterval(() => {
      const next = indexRef.current + 1
      if (next >= timeline.length) {
        setPlaying(false)
        return
      }
      goTo(next, {select: false})
    }, 1000 / speed)
    return () => window.clearInterval(id)
  }, [playing, speed, timeline.length, goTo])

  // Stop at the end rather than looping silently back to 196 CE.
  const atEnd = index >= timeline.length - 1
  const disabled = timeline.length === 0

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-md border border-[rgba(125,190,210,0.24)] bg-[rgba(8,13,17,0.8)] px-1.5 py-1',
        className,
      )}
    >
      <button
        type='button'
        disabled={disabled || index <= 0}
        onClick={() => goTo(index - 1, {select: true})}
        aria-label='Previous record'
        title='Previous record'
        className='flex h-5 w-5 items-center justify-center rounded text-[#a8b8be] transition-colors hover:bg-white/[0.07] hover:text-[#4fd8e8] disabled:opacity-25'
      >
        <ChevronLeft size={12} strokeWidth={1.8} />
      </button>

      <button
        type='button'
        disabled={disabled}
        onClick={() => {
          if (atEnd && !playing) {
            // Replaying from the end restarts rather than doing nothing.
            goTo(0, {select: false})
          }
          setPlaying((v) => !v)
        }}
        aria-label={playing ? 'Pause playback' : 'Play activity across time'}
        title={playing ? 'Pause' : 'Play activity across time'}
        aria-pressed={playing}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded transition-colors disabled:opacity-25',
          playing
            ? 'bg-[rgba(79,216,232,0.18)] text-[#4fd8e8]'
            : 'text-[#a8b8be] hover:bg-white/[0.07] hover:text-[#4fd8e8]',
        )}
      >
        {playing ? <Pause size={11} strokeWidth={2} /> : <Play size={11} strokeWidth={2} />}
      </button>

      <button
        type='button'
        disabled={disabled || atEnd}
        onClick={() => goTo(index + 1, {select: true})}
        aria-label='Next record'
        title='Next record'
        className='flex h-5 w-5 items-center justify-center rounded text-[#a8b8be] transition-colors hover:bg-white/[0.07] hover:text-[#4fd8e8] disabled:opacity-25'
      >
        <ChevronRight size={12} strokeWidth={1.8} />
      </button>

      <span aria-hidden className='mx-0.5 h-3 w-px bg-[rgba(125,190,210,0.2)]' />

      {SPEEDS.map((s) => (
        <button
          key={s}
          type='button'
          onClick={() => setSpeed(s)}
          title={`${s} record${s === 1 ? '' : 's'} per second`}
          className={cn(
            'rounded px-1 font-mono text-[9px] tracking-wide transition-colors',
            speed === s
              ? 'bg-[rgba(79,216,232,0.16)] text-[#4fd8e8]'
              : 'text-[#5d6d74] hover:text-[#a8b8be]',
          )}
          aria-pressed={speed === s}
        >
          {s}/s
        </button>
      ))}

      <span className='ml-1 font-mono text-[9px] tabular-nums text-[#7d8f95]'>
        {disabled ? '—' : `${index + 1}/${timeline.length}`}
      </span>
    </div>
  )
}
