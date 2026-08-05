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

/** Mirrors the honest score bands in lib/normalize.ts — see CONFIDENCE_TO_SCORE. */
const CREDIBILITY_TIERS: Array<{value: number; label: string}> = [
  {value: 0, label: 'Any'},
  {value: 0.2, label: 'Thin+'},
  {value: 0.4, label: 'Docmt+'},
  {value: 0.7, label: 'Corrob+'},
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

  // Which statuses/scores the loaded corpus can actually produce right now —
  // a filter stop no loaded event can satisfy is a dead control, not a
  // precise one. Derived from the live corpus so this self-corrects the
  // moment a richer ingestion path (testimonies, corroborated reports) lands,
  // instead of staying a hardcoded flag someone has to remember to flip.
  const presentStatuses = useMemo(
    () => new Set(events.map((e) => e.epistemicStatus ?? 'inferred')),
    [events],
  )
  const maxCredibility = useMemo(
    () => events.reduce((max, e) => Math.max(max, e.credibilityScore ?? 0), 0),
    [events],
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
            <p className='mb-2 font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase'>
              Min. evidentiary tier
            </p>
            {/*
             * Stepped, not continuous — the scored corpus only actually
             * occupies a handful of tiers (see normalize.ts). A smooth 0–100
             * slider over that implies precision the source data doesn't
             * have, and reads as broken once a drag crosses a tier boundary
             * with nothing in between. Snap to the tiers that are real.
             */}
            <div className='flex gap-1'>
              {CREDIBILITY_TIERS.map((tier) => {
                const reachable = tier.value <= maxCredibility
                return (
                  <button
                    key={tier.value}
                    type='button'
                    disabled={!reachable}
                    title={reachable ? undefined : 'No loaded event reaches this tier yet'}
                    onClick={() => setCredibilityMin(tier.value)}
                    className={cn(
                      'flex-1 rounded-md border px-1.5 py-1 text-[10px] tracking-wide uppercase transition',
                      !reachable
                        ? 'cursor-not-allowed border-white/5 text-neutral-600'
                        : filters.credibilityMin === tier.value
                          ? 'border-amber-200/50 bg-amber-300/20 text-amber-100'
                          : 'border-white/10 text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
                    )}
                  >
                    {tier.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <p className='mb-2 font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase'>
              Provenance
            </p>
            <ul className='space-y-1.5'>
              {EPISTEMIC_ROWS.map((row) => {
                const reachable = presentStatuses.has(row.status)
                return (
                <li key={row.status}>
                  <label
                    className={cn(
                      'flex items-center justify-between gap-2 text-xs',
                      !reachable && 'opacity-40',
                    )}
                  >
                    <span className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={filters.epistemic[row.status]}
                      disabled={!reachable}
                      onChange={(e) =>
                        setEpistemicFilter(row.status, e.target.checked)
                      }
                      className='accent-amber-300'
                    />
                    <span className={cn('h-2 w-2 rounded-full', row.swatch)} />
                    {row.label}
                    </span>
                    {!reachable ? (
                      <span className='font-mono text-[9px] tracking-wider text-neutral-500 uppercase'>
                        none loaded
                      </span>
                    ) : null}
                  </label>
                </li>
                )
              })}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  )
}
