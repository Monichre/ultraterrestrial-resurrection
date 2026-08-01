'use client'

import {useMemo} from 'react'
import {cn} from '@/lib/utils'
import {useSpacetimeStore} from '../state/spacetime-store'
import type {TemporalStation} from '../types/spacetime'

/**
 * Adaptive temporal dial — bidirectional input to temporalCursor.
 *
 * In `free` mode, clicking a station writes the cursor.
 * In `guided` mode, it still writes (user override) and flips to free
 * so scroll and dial don't fight (D1).
 */
export function TemporalDial({className}: {className?: string}) {
  const stations = useSpacetimeStore((s) => s.stations)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)
  const setTemporalCursor = useSpacetimeStore((s) => s.setTemporalCursor)
  const setInteractionMode = useSpacetimeStore((s) => s.setInteractionMode)

  const activeStationId = cursor.mode === 'station' ? cursor.stationId : null

  const ticks = useMemo(() => stations, [stations])

  const onSelect = (station: TemporalStation) => {
    setInteractionMode('free')
    setTemporalCursor({
      mode: 'station',
      stationId: station.id,
      timestamp: station.timestamp,
    })
  }

  if (ticks.length === 0) {
    return (
      <aside
        className={cn(
          'rounded-xl border border-white/10 bg-black/55 px-3 py-4 font-mono text-[10px] text-neutral-500 backdrop-blur',
          className,
        )}
      >
        No stations yet
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        'flex max-h-[70vh] w-14 flex-col overflow-y-auto rounded-xl border border-white/10 bg-black/55 py-2 backdrop-blur',
        className,
      )}
      aria-label='Adaptive temporal dial'
    >
      {ticks.map((station) => {
        const active = station.id === activeStationId
        const density = station.density ?? 0
        return (
          <button
            key={station.id}
            type='button'
            onClick={() => onSelect(station)}
            title={station.label}
            className={cn(
              'relative mx-auto my-0.5 flex h-7 w-10 items-center justify-center rounded-md text-[9px] tracking-wide transition',
              active
                ? 'bg-amber-300/20 text-amber-100 ring-1 ring-amber-200/50'
                : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
            )}
          >
            <span
              aria-hidden
              className='absolute bottom-0.5 left-1 right-1 h-0.5 rounded-full bg-sky-400/80'
              style={{opacity: 0.15 + density * 0.85, transform: `scaleX(${0.35 + density * 0.65})`}}
            />
            <span className='relative z-10'>
              {station.kind === 'historical'
                ? station.label.replace('s', '')
                : station.timestamp.slice(2, 4)}
            </span>
          </button>
        )
      })}
    </aside>
  )
}
