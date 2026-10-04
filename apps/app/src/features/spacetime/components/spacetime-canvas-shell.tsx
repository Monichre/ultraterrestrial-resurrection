'use client'

import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

/**
 * Docked observatory shell — spec §9's "Primary interaction layout", which is
 * also what all four storyboards show:
 *
 *   ┌───────────────────────────────────────────────┐
 *   │ header: lockup · context · actions            │  72px
 *   ├──────┬────────────────────────────────────────┤
 *   │ rail │  MAP — foreground, interactive         │  1fr
 *   │ 72px │  chrome docks *inside* this region     │
 *   ├──────┴────────────────────────────────────────┤
 *   │ ADAPTIVE TEMPORAL INSTRUMENT                  │  auto
 *   └───────────────────────────────────────────────┘
 *
 * **This replaces a two-layer shell** in which the globe sat in a
 * `pointer-events-none .fixed.inset-0` slot underneath a `z-10` narrative layer
 * that owned the whole viewport. That arrangement is why the globe could not be
 * clicked, panned or zoomed (review §2 Break 1): the scroll surface swallowed
 * every pointer event across the entire frame. Here the map region is the
 * foreground and receives input directly; the guided narrative is inset into it
 * as one docked column rather than laid over everything.
 *
 * The 72px rail / ~68px header / docked bottom instrument proportions come from
 * `docs/vision/prototypes/03-temporal-geospatial-observatory.html`, which the
 * spec marks Primary and which agrees with the boards on structure.
 */

export interface SpacetimeCanvasShellProps {
  /** Full-width header band. */
  topbar: ReactNode
  /** Left icon rail, full height beneath the header. */
  rail: ReactNode
  /**
   * Map region. Everything inside is `position: relative` to this box, so
   * docked chrome (legend, controls, inspector, narrative) positions against
   * the map rather than the viewport — which is what keeps it clear of the
   * rail and the instrument band.
   */
  map: ReactNode
  /** Adaptive temporal instrument, docked full width at the bottom. */
  dial: ReactNode
  className?: string
}

export function SpacetimeCanvasShell({
  topbar,
  rail,
  map,
  dial,
  className,
}: SpacetimeCanvasShellProps) {
  return (
    <div
      data-spacetime-shell
      className={cn(
        'grid h-dvh w-full grid-rows-[72px_minmax(0,1fr)_auto] overflow-hidden bg-[#05080b] text-[#dbe7ea]',
        className,
      )}
    >
      <div data-spacetime-layer='topbar' className='min-w-0'>
        {topbar}
      </div>

      <div className='grid min-h-0 grid-cols-[72px_minmax(0,1fr)]'>
        <div data-spacetime-layer='rail'>{rail}</div>
        <div
          data-spacetime-layer='map'
          className='relative min-h-0 min-w-0 overflow-hidden bg-[#05080b]'
        >
          {map}
        </div>
      </div>

      <div data-spacetime-layer='dial' className='min-w-0'>
        {dial}
      </div>
    </div>
  )
}
