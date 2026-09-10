'use client'

import {Maximize2, MoveDiagonal, Orbit} from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import {cn} from '@/lib/utils'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {getSpacetimeMap} from '../lib/map-controller'
import {useSpacetimeStore} from '../state/spacetime-store'

export interface SpacetimeTopbarProps {
  /** Loaded-corpus readout: what the bounded query actually returned. */
  meta: {geolocatedCount: number; total: number; range: string} | null
  visibleCount: number
}

/**
 * Observatory header — concept-01 frame 1's `ULTRATERRESTRIAL /
 * TEMPORAL OBSERVATORY` lockup plus the right-hand action cluster.
 *
 * Two deliberate accommodations to the app's global chrome, which is
 * `fixed top-6 left-6` (wordmark) and `fixed top-6 right-6` (hamburger) from
 * `MenuTrigger` in the root layout:
 *
 *   - The wordmark is not repeated here. It already sits in this band, so the
 *     header opens with the *sub*-lockup and leaves `pl-[13.5rem]` for it.
 *     Two "ULTRATERRESTRIAL" marks 40px apart would read as a bug.
 *   - `pr-[4.5rem]` keeps the action cluster clear of the hamburger.
 */
export function SpacetimeTopbar({meta, visibleCount}: SpacetimeTopbarProps) {
  const mode = useSpacetimeStore((s) => s.interactionMode)
  const setInteractionMode = useSpacetimeStore((s) => s.setInteractionMode)

  return (
    <header className='flex h-full items-center gap-4 border-b border-[rgba(125,190,210,0.16)] bg-[rgba(6,10,13,0.92)] pr-[4.5rem] pl-[13.5rem]'>
      <span aria-hidden className='h-6 w-px bg-[rgba(125,190,210,0.22)]' />

      <div className='min-w-0'>
        <div className='font-mono text-[10px] tracking-[0.3em] text-[#4fd8e8] uppercase'>
          Temporal Observatory
        </div>
        <div className='mt-0.5 truncate font-mono text-[9px] tracking-[0.16em] text-[#707f86] uppercase'>
          Spacetime Canvas · curated events corpus
        </div>
      </div>

      <div className='ml-auto flex items-center gap-2'>
        {meta ? (
          <div className='hidden items-center gap-4 rounded-lg border border-[rgba(125,190,210,0.16)] bg-[rgba(8,13,17,0.7)] px-3 py-1.5 lg:flex'>
            <Readout label='On canvas' value={`${visibleCount}/${meta.total}`} />
            <Readout label='Mapped' value={`${meta.geolocatedCount}`} />
            <Readout label='Span' value={meta.range} />
          </div>
        ) : null}

        {/*
         * Mode is a real switch, not decoration: `guided` gives scroll authority
         * over the temporal cursor, `free` gives it to the dial. Keeping it in
         * the header (rather than a floating card) is what the boards show for
         * global state.
         */}
        <div className='flex items-center gap-px overflow-hidden rounded-lg border border-[rgba(125,190,210,0.16)]'>
          {(['guided', 'free'] as const).map((m) => (
            <button
              key={m}
              type='button'
              onClick={() => setInteractionMode(m)}
              className={cn(
                'px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] uppercase transition-colors',
                mode === m
                  ? 'bg-[rgba(79,216,232,0.14)] text-[#4fd8e8]'
                  : 'bg-[rgba(8,13,17,0.7)] text-[#707f86] hover:text-[#a8b8be]',
              )}
              aria-pressed={mode === m}
            >
              {m}
            </button>
          ))}
        </div>

        <IconButton label='Reset camera to the whole corpus' icon={Orbit} action='reset' />
        <IconButton label='Fit the mapped records in view' icon={MoveDiagonal} action='fit' />
        <IconButton label='Toggle full screen' icon={Maximize2} action='fullscreen' />
      </div>
    </header>
  )
}

function Readout({label, value}: {label: string; value: string}) {
  return (
    <span className='flex flex-col leading-tight'>
      <span className='font-mono text-[8px] tracking-[0.2em] text-[#707f86] uppercase'>
        {label}
      </span>
      <span className='font-mono text-[10px] text-[#c3d3d8]'>{value}</span>
    </span>
  )
}

/**
 * Header actions. `reset` / `fit` drive the live map through the registry;
 * there is no icon here that does nothing — the boards' remaining glyphs
 * (help, share) are omitted rather than mocked.
 */
function IconButton({
  label,
  icon: Icon,
  action,
}: {
  label: string
  icon: typeof Orbit
  action: 'reset' | 'fit' | 'fullscreen'
}) {
  const events = useSpacetimeStore((s) => s.events)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)

  const onClick = () => {
    if (action === 'fullscreen') {
      const shell = document.querySelector('[data-spacetime-shell]')
      if (!(shell instanceof HTMLElement)) return
      if (document.fullscreenElement) void document.exitFullscreen()
      else void shell.requestFullscreen().catch(() => {})
      return
    }

    const map = getSpacetimeMap()
    if (!map) return
    // Clear the selection first: both actions widen the view, and leaving a
    // selection set would let the globe's fly-to-selection effect immediately
    // yank the camera back down to that one pin.
    selectEvent(null)

    if (action === 'reset') {
      map.easeTo({center: [-30, 25], zoom: 1.7, pitch: 0, bearing: 0, duration: 1200})
      return
    }

    // Filtered, not raw. "Fit the mapped records in view" has to mean the
    // records actually painted — fitting bounds over layer- or attestation-
    // filtered-out events frames empty space the user cannot see anything in.
    const mapped = filterSpacetimeEvents(events, layers, filters).filter(
      (e) => e.coordinates,
    )
    if (mapped.length === 0) return
    const bounds = new mapboxgl.LngLatBounds()
    for (const e of mapped) {
      bounds.extend([e.coordinates!.longitude, e.coordinates!.latitude])
    }
    map.fitBounds(bounds, {padding: 80, duration: 1200, maxZoom: 6})
  }

  return (
    <button
      type='button'
      onClick={onClick}
      title={label}
      aria-label={label}
      className='flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(125,190,210,0.16)] bg-[rgba(8,13,17,0.7)] text-[#707f86] transition-colors hover:border-[rgba(79,216,232,0.4)] hover:text-[#4fd8e8]'
    >
      <Icon size={14} strokeWidth={1.6} />
    </button>
  )
}
