'use client'

import {useMemo, useState} from 'react'
import {useSpacetimeStore} from '../state/spacetime-store'
import {filterSpacetimeEvents} from '../lib/filter-events'
import type {EpistemicStatus, SpacetimeLayerVisibility} from '../types/spacetime'
import {cn} from '@/lib/utils'

const LAYER_ROWS: Array<{
  key: keyof SpacetimeLayerVisibility
  label: string
  /** M0 corpus is sightings-only; other rails stay visible but inert until wired. */
  available: boolean
}> = [
  {key: 'sightings', label: 'Sightings', available: true},
  {key: 'historicalEvents', label: 'Historical', available: false},
  {key: 'nuclear', label: 'Nuclear', available: false},
  {key: 'military', label: 'Military', available: false},
  {key: 'infrastructure', label: 'Infrastructure', available: false},
  {key: 'testimony', label: 'Testimony', available: false},
  {key: 'documents', label: 'Documents', available: false},
  {key: 'reconstructions', label: 'Reconstructions', available: false},
]

const EPISTEMIC_ROWS: Array<{status: EpistemicStatus; label: string; swatch: string}> = [
  {status: 'documented', label: 'Documented', swatch: 'bg-emerald-300'},
  {status: 'inferred', label: 'Inferred', swatch: 'bg-sky-300'},
  {status: 'disputed', label: 'Disputed', swatch: 'bg-rose-300'},
]

/**
 * M1 evidence instrument — layer mixer + credibility / provenance filters.
 * Does not trigger reconstruction (the lever is later).
 */
export function EvidenceLayersPanel() {
  const [open, setOpen] = useState(false)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)
  const events = useSpacetimeStore((s) => s.events)
  const setLayerVisibility = useSpacetimeStore((s) => s.setLayerVisibility)
  const setCredibilityMin = useSpacetimeStore((s) => s.setCredibilityMin)
  const setEpistemicFilter = useSpacetimeStore((s) => s.setEpistemicFilter)

  const visibleCount = useMemo(
    () => filterSpacetimeEvents(events, layers, filters).length,
    [events, layers, filters],
  )

  return (
    <div className='pointer-events-auto absolute right-4 bottom-28 w-64'>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/70 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-neutral-200 uppercase backdrop-blur'
      >
        <span>Evidence layers</span>
        <span className='text-amber-200/80'>
          {visibleCount}/{events.length}
        </span>
      </button>

      {open ? (
        <div className='mt-2 space-y-4 rounded-2xl border border-white/10 bg-black/80 p-3 text-white shadow-2xl backdrop-blur'>
          <section>
            <p className='mb-2 font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase'>
              Layers
            </p>
            <ul className='space-y-1.5'>
              {LAYER_ROWS.map((row) => (
                <li key={row.key}>
                  <label
                    className={cn(
                      'flex items-center justify-between gap-2 text-xs',
                      !row.available && 'opacity-40',
                    )}
                  >
                    <span className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={layers[row.key]}
                        disabled={!row.available}
                        onChange={(e) =>
                          setLayerVisibility({[row.key]: e.target.checked})
                        }
                        className='accent-amber-300'
                      />
                      {row.label}
                    </span>
                    {!row.available ? (
                      <span className='font-mono text-[9px] tracking-wider text-neutral-500 uppercase'>
                        soon
                      </span>
                    ) : null}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className='mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase'>
              <span>Credibility</span>
              <span className='text-neutral-300'>
                ≥ {(filters.credibilityMin * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type='range'
              min={0}
              max={100}
              step={5}
              value={Math.round(filters.credibilityMin * 100)}
              onChange={(e) => setCredibilityMin(Number(e.target.value) / 100)}
              className='w-full accent-amber-300'
            />
          </section>

          <section>
            <p className='mb-2 font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase'>
              Provenance
            </p>
            <ul className='space-y-1.5'>
              {EPISTEMIC_ROWS.map((row) => (
                <li key={row.status}>
                  <label className='flex items-center gap-2 text-xs'>
                    <input
                      type='checkbox'
                      checked={filters.epistemic[row.status]}
                      onChange={(e) =>
                        setEpistemicFilter(row.status, e.target.checked)
                      }
                      className='accent-amber-300'
                    />
                    <span className={cn('h-2 w-2 rounded-full', row.swatch)} />
                    {row.label}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  )
}
