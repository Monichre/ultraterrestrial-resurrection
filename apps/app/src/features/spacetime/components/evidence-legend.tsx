'use client'

import {useMemo} from 'react'
import {cn} from '@/lib/utils'
import {eventLayerKey} from '../lib/filter-events'
import {STC_EPISTEMIC_COLOR, STC_LAYER_COLOR} from '../lib/spacetime-theme'
import {useSpacetimeStore} from '../state/spacetime-store'
import type {SpacetimeLayerVisibility} from '../types/spacetime'

/**
 * Evidence key — concept-01 frame 1's bottom-left legend, laid out as the
 * horizontal strip that `prototypes/03-temporal-geospatial-observatory.html`
 * uses for the same job.
 *
 * Horizontal rather than the board's stacked card because the guided narrative
 * already occupies the left column: a stacked legend at `bottom-4 left-4` sits
 * directly underneath it. A single row clears the column and still reads as one
 * key.
 *
 * It is a key, not a control — the control is `EvidenceLayersPanel`. Each entry
 * carries its live count, so the key can never advertise a colour the globe
 * isn't painting: a rail with nothing loaded renders greyed with `0`.
 */

const KEY_ROWS: Array<{
  key: keyof SpacetimeLayerVisibility
  label: string
  color: string
}> = [
  {key: 'sightings', label: 'Sightings', color: STC_LAYER_COLOR.sightings},
  {key: 'historicalEvents', label: 'Historical', color: STC_LAYER_COLOR.historicalEvents},
  {key: 'military', label: 'Investigations', color: STC_LAYER_COLOR.investigations},
  {key: 'nuclear', label: 'Correlated', color: STC_LAYER_COLOR.correlated},
]

export function EvidenceLegend() {
  const events = useSpacetimeStore((s) => s.events)
  const layers = useSpacetimeStore((s) => s.layers)

  const counts = useMemo(() => {
    const tally = new Map<keyof SpacetimeLayerVisibility, number>()
    for (const event of events) {
      const key = eventLayerKey(event.type)
      tally.set(key, (tally.get(key) ?? 0) + 1)
    }
    return tally
  }, [events])

  return (
    <div className='pointer-events-none absolute bottom-11 left-[21rem] z-20 flex max-w-[calc(100%-24rem)] flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-[rgba(125,190,210,0.16)] bg-[rgba(8,13,17,0.82)] px-3 py-2 backdrop-blur-md'>
      {KEY_ROWS.map((row) => {
        const count = counts.get(row.key) ?? 0
        const live = count > 0 && layers[row.key]
        return (
          <span
            key={row.key}
            className={cn(
              'flex items-center gap-1.5 font-mono text-[9px] tracking-wide whitespace-nowrap',
              live ? 'text-[#c3d3d8]' : 'text-[#707f86]',
            )}
          >
            {/* Ring-with-core marker, matching the globe's pin construction. */}
            <span
              aria-hidden
              className='flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border'
              style={{
                borderColor: live ? row.color : 'rgba(125,190,210,0.28)',
                backgroundColor: live ? `${row.color}33` : 'transparent',
              }}
            >
              <span
                className='h-1 w-1 rounded-full'
                style={{backgroundColor: live ? row.color : 'rgba(125,190,210,0.28)'}}
              />
            </span>
            {row.label}
            <span className='tabular-nums opacity-70'>{count}</span>
          </span>
        )
      })}

      <span aria-hidden className='h-3.5 w-px bg-[rgba(125,190,210,0.2)]' />

      {(['documented', 'inferred', 'disputed'] as const).map((status) => (
        <span
          key={status}
          className='flex items-center gap-1.5 font-mono text-[9px] tracking-wide whitespace-nowrap text-[#8b9ba1] capitalize'
        >
          <span
            aria-hidden
            className='h-1.5 w-1.5 rounded-full'
            style={{backgroundColor: STC_EPISTEMIC_COLOR[status]}}
          />
          {status}
        </span>
      ))}
    </div>
  )
}
