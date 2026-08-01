'use client'

import {useEffect, useMemo, useRef, useState, useTransition} from 'react'
import {
  loadSpacetimeEvents,
  type LoadSpacetimeEventsResult,
} from '../actions/load-spacetime-events'
import {useSpacetimeStore} from '../state/spacetime-store'
import {stationAtProgress} from '../lib/temporal-stations'
import {SpacetimeCanvasShell} from './spacetime-canvas-shell'
import {SpacetimeGlobe} from './spacetime-globe'
import {TemporalDial} from './temporal-dial'
import {cn} from '@/lib/utils'

function EventInspector() {
  const selectedEventId = useSpacetimeStore((s) => s.selectedEventId)
  const events = useSpacetimeStore((s) => s.events)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)
  const event = events.find((e) => e.id === selectedEventId)

  if (!event) return null

  return (
    <div className='pointer-events-auto absolute right-4 bottom-4 w-full max-w-sm rounded-2xl border border-white/10 bg-black/70 p-4 text-white shadow-2xl backdrop-blur'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-mono text-[10px] tracking-[0.2em] text-amber-200/80 uppercase'>
            {event.type} · {event.timePrecision}
          </p>
          <h2 className='mt-1 text-lg font-semibold tracking-tight'>{event.title}</h2>
        </div>
        <button
          type='button'
          onClick={() => selectEvent(null)}
          className='text-xs text-neutral-400 hover:text-white'
        >
          Close
        </button>
      </div>
      <p className='mt-2 font-mono text-[11px] text-neutral-400'>
        {event.timestamp.slice(0, 10)}
        {event.locationDescription ? ` · ${event.locationDescription}` : ''}
      </p>
      {event.credibilityScore != null ? (
        <p className='mt-2 text-xs text-neutral-300'>
          Credibility {(event.credibilityScore * 100).toFixed(0)}%
          {event.epistemicStatus ? ` · ${event.epistemicStatus}` : ''}
        </p>
      ) : null}
      {event.summary ? (
        <p className='mt-3 line-clamp-4 text-sm text-neutral-200'>{event.summary}</p>
      ) : null}
      <p className='mt-4 text-[10px] tracking-wide text-neutral-500 uppercase'>
        Reconstruction requires the lever — scroll is not intent
      </p>
    </div>
  )
}

function GuidedNarrative() {
  const stations = useSpacetimeStore((s) => s.stations)
  const events = useSpacetimeStore((s) => s.events)
  const setScrollProgress = useSpacetimeStore((s) => s.setScrollProgress)
  const setTemporalCursor = useSpacetimeStore((s) => s.setTemporalCursor)
  const interactionMode = useSpacetimeStore((s) => s.interactionMode)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)

  const eventStations = useMemo(
    () => stations.filter((s) => s.kind === 'event').slice(0, 16),
    [stations],
  )

  useEffect(() => {
    const narrative = document.querySelector('[data-spacetime-layer="narrative"]')
    if (!(narrative instanceof HTMLElement)) return

    const onScroll = () => {
      if (interactionMode !== 'guided') return
      const max = narrative.scrollHeight - narrative.clientHeight
      const progress = max > 0 ? narrative.scrollTop / max : 0
      setScrollProgress(progress)
      const station = stationAtProgress(stations, progress)
      if (!station) return
      setTemporalCursor({
        mode: 'station',
        stationId: station.id,
        timestamp: station.timestamp,
      })
    }

    narrative.addEventListener('scroll', onScroll, {passive: true})
    onScroll()
    return () => narrative.removeEventListener('scroll', onScroll)
  }, [interactionMode, stations, setScrollProgress, setTemporalCursor])

  if (eventStations.length === 0) {
    return (
      <div className='flex min-h-[120vh] items-center justify-center px-6 text-sm text-neutral-400'>
        Loading waypoints from the bounded sightings query…
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-[55vh] px-6 pt-[18vh] pb-[35vh]'>
      <header className='mx-auto max-w-xl text-center text-white'>
        <p className='font-mono text-[10px] tracking-[0.25em] text-amber-200/70 uppercase'>
          Spacetime Canvas
        </p>
        <h1 className='mt-2 text-3xl font-semibold tracking-tight'>A flight through the unexplained</h1>
        <p className='mt-2 text-sm text-neutral-400'>
          Scroll guides the temporal cursor. The dial overrides into free mode.
        </p>
      </header>

      {eventStations.map((station, i) => {
        const linked = (station.eventIds ?? [])
          .map((id) => events.find((e) => e.id === id))
          .filter(Boolean)
          .slice(0, 3)

        return (
          <article
            key={station.id}
            className='mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-black/55 p-6 text-white shadow-2xl backdrop-blur-md'
            style={{
              transform: `translateZ(${-24 * i}px)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <p className='font-mono text-xs tracking-[0.2em] text-amber-200/80'>
              {station.timestamp.slice(0, 10)}
            </p>
            <h2 className='mt-2 text-2xl font-semibold tracking-tight'>{station.label}</h2>
            <ul className='mt-4 space-y-2'>
              {linked.map((event) =>
                event ? (
                  <li key={event.id}>
                    <button
                      type='button'
                      onClick={() => selectEvent(event.id)}
                      className='w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-left text-sm hover:border-white/20'
                    >
                      <span className='block font-medium'>{event.title}</span>
                      <span className='block text-xs text-neutral-400'>
                        {event.locationDescription || 'Unknown location'}
                        {event.credibilityScore != null
                          ? ` · ${(event.credibilityScore * 100).toFixed(0)}%`
                          : ''}
                      </span>
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          </article>
        )
      })}
    </div>
  )
}

function CanvasChrome({
  meta,
}: {
  meta: {geolocatedCount: number; total: number; range: string} | null
}) {
  const mode = useSpacetimeStore((s) => s.interactionMode)
  const setInteractionMode = useSpacetimeStore((s) => s.setInteractionMode)
  const scrollProgress = useSpacetimeStore((s) => s.scrollProgress)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)

  const cursorLabel =
    cursor.mode === 'range'
      ? `${cursor.start} → ${cursor.end}`
      : cursor.mode === 'station'
        ? cursor.stationId
        : cursor.timestamp.slice(0, 10)

  return (
    <>
      <div className='pointer-events-auto absolute top-4 left-4'>
        <TemporalDial />
      </div>

      <div className='pointer-events-auto absolute top-4 right-4 flex flex-col items-end gap-2'>
        <div className='rounded-xl border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] text-neutral-300 backdrop-blur'>
          <div className='text-neutral-500'>MODE</div>
          <div className='flex gap-2'>
            {(['guided', 'free'] as const).map((m) => (
              <button
                key={m}
                type='button'
                onClick={() => setInteractionMode(m)}
                className={cn(
                  'uppercase tracking-wider',
                  mode === m ? 'text-amber-200' : 'text-neutral-500 hover:text-neutral-300',
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        {meta ? (
          <div className='rounded-xl border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] text-neutral-300 backdrop-blur'>
            <div className='text-neutral-500'>BOUNDED LOAD</div>
            <div>
              {meta.geolocatedCount}/{meta.total} geolocated · {meta.range}
            </div>
          </div>
        ) : null}
      </div>

      <div className='pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] text-neutral-300 backdrop-blur'>
        <div className='text-neutral-500'>CURSOR · SCROLL</div>
        <div>
          {cursorLabel} · {(scrollProgress * 100).toFixed(0)}%
        </div>
      </div>

      <EventInspector />
    </>
  )
}

function metaFromResult(result: LoadSpacetimeEventsResult) {
  return {
    geolocatedCount: result.geolocatedCount,
    total: result.events.length,
    range: `${result.timeRange.startYear}–${result.timeRange.endYear}`,
  }
}

/**
 * Product Spacetime Canvas — M0 shell.
 * Globe in the fixed slot; guided narrative as CSS 3D descent; dial beside.
 *
 * Prefer `initialData` from the server page so first paint isn't empty.
 * Falls back to a client fetch if omitted.
 */
export function SpacetimeCanvas({
  initialData,
}: {
  initialData?: LoadSpacetimeEventsResult
}) {
  const setEvents = useSpacetimeStore((s) => s.setEvents)
  const setStations = useSpacetimeStore((s) => s.setStations)
  const [meta, setMeta] = useState<{
    geolocatedCount: number
    total: number
    range: string
  } | null>(initialData ? metaFromResult(initialData) : null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const didHydrate = useRef(false)

  // Synchronous first-paint hydrate so SSR/CSR narrative isn't empty.
  if (initialData && !didHydrate.current) {
    useSpacetimeStore.setState({
      events: initialData.events,
      stations: initialData.stations,
    })
    didHydrate.current = true
  }

  // Client-only fallback when the server didn't preload.
  useEffect(() => {
    if (initialData) return

    startTransition(async () => {
      try {
        const result = await loadSpacetimeEvents({
          startYear: 1940,
          endYear: new Date().getUTCFullYear(),
          limit: 400,
        })
        setEvents(result.events)
        setStations(result.stations)
        setMeta(metaFromResult(result))
        setError(null)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Failed to load spacetime events')
      }
    })
  }, [initialData, setEvents, setStations])

  return (
    <>
      <SpacetimeCanvasShell
        background={<SpacetimeGlobe />}
        narrative={<GuidedNarrative />}
        chrome={<CanvasChrome meta={meta} />}
      />
      {pending && !meta ? (
        <div className='pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-3'>
          <span className='rounded-full border border-white/10 bg-black/70 px-3 py-1 font-mono text-[10px] tracking-widest text-neutral-300 uppercase'>
            Loading bounded events…
          </span>
        </div>
      ) : null}
      {error ? (
        <div className='fixed inset-x-0 top-3 z-50 flex justify-center'>
          <span className='rounded-full border border-rose-400/30 bg-rose-950/80 px-3 py-1 text-xs text-rose-100'>
            {error}
          </span>
        </div>
      ) : null}
    </>
  )
}
