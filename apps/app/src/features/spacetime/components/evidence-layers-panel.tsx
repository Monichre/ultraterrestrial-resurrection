'use client'

import {useMemo, useState} from 'react'
import {Eye, EyeOff, Layers} from 'lucide-react'
import {useSpacetimeStore} from '../state/spacetime-store'
import {filterSpacetimeEvents, eventLayerKey} from '../lib/filter-events'
import {STC_EPISTEMIC_COLOR, STC_LAYER_COLOR} from '../lib/spacetime-theme'
import type {EpistemicStatus, SpacetimeLayerVisibility} from '../types/spacetime'
import {cn} from '@/lib/utils'

/**
 * LAYERS control — concept-01 frame 2 (`LAYER VISIBILITY` + `DENSITY` legend),
 * docked top-right of the map behind a `LAYERS` button as the board shows.
 *
 * Availability is derived from the loaded corpus, not hardcoded: a rail with no
 * records renders as an unavailable row that says so. That self-corrects the
 * moment Lane A's ingestion lands a new type, instead of being a flag someone
 * has to remember to flip.
 */

const LAYER_ROWS: Array<{
  key: keyof SpacetimeLayerVisibility
  label: string
  color: string
}> = [
  {key: 'sightings', label: 'Sightings', color: STC_LAYER_COLOR.sightings},
  {key: 'historicalEvents', label: 'Historical Events', color: STC_LAYER_COLOR.historicalEvents},
  {key: 'military', label: 'Investigations', color: STC_LAYER_COLOR.investigations},
  {key: 'nuclear', label: 'Correlated Activity', color: STC_LAYER_COLOR.correlated},
  {key: 'infrastructure', label: 'Infrastructure', color: STC_LAYER_COLOR.investigations},
  {key: 'testimony', label: 'Testimony', color: STC_LAYER_COLOR.sightings},
  {key: 'documents', label: 'Documents', color: STC_LAYER_COLOR.historicalEvents},
  {key: 'reconstructions', label: 'Reconstructions', color: STC_LAYER_COLOR.correlated},
]

const EPISTEMIC_ROWS: Array<{status: EpistemicStatus; label: string}> = [
  {status: 'documented', label: 'Documented'},
  {status: 'inferred', label: 'Inferred'},
  {status: 'disputed', label: 'Disputed'},
]

/** Mirrors the honest score bands in lib/normalize.ts — see CONFIDENCE_TO_SCORE. */
const CREDIBILITY_TIERS: Array<{value: number; label: string}> = [
  {value: 0, label: 'Any'},
  {value: 0.2, label: 'Thin+'},
  {value: 0.4, label: 'Docmt+'},
  {value: 0.7, label: 'Corrob+'},
]

/** DENSITY key from the board — three sample weights, matching the dial track. */
const DENSITY_SAMPLES: Array<{label: string; opacity: number; height: number}> = [
  {label: 'Sparse', opacity: 0.3, height: 2},
  {label: 'Moderate', opacity: 0.6, height: 4},
  {label: 'Dense', opacity: 1, height: 7},
]

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

  const countsByLayer = useMemo(() => {
    const tally = new Map<keyof SpacetimeLayerVisibility, number>()
    for (const event of events) {
      const key = eventLayerKey(event.type)
      tally.set(key, (tally.get(key) ?? 0) + 1)
    }
    return tally
  }, [events])

  const presentStatuses = useMemo(
    () => new Set(events.map((e) => e.epistemicStatus ?? 'inferred')),
    [events],
  )
  const maxCredibility = useMemo(
    () => events.reduce((max, e) => Math.max(max, e.credibilityScore ?? 0), 0),
    [events],
  )

  return (
    /*
     * Two things this wrapper does:
     *
     * 1. Opening lifts the panel over the inspector (z-30), which shares this
     *    corner. Left at z-20 the panel expands *behind* an open record with
     *    only its last section visible below the inspector's edge.
     * 2. It spans `top-4 → bottom-12` so the expanded panel's max height is
     *    derived from the map region rather than the viewport. A viewport-based
     *    cap overshoots by the header and dial bands and runs the panel off the
     *    bottom edge.
     */
    <div
      className={cn(
        'pointer-events-none absolute top-4 right-4 bottom-12 flex w-64 flex-col items-stretch',
        open ? 'z-40' : 'z-20',
      )}
    >
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'pointer-events-auto flex w-full shrink-0 items-center gap-2 rounded-xl border px-3 py-2 font-mono text-[10px] tracking-[0.22em] uppercase backdrop-blur-md transition-colors',
          open
            ? 'border-[rgba(79,216,232,0.45)] bg-[rgba(79,216,232,0.1)] text-[#4fd8e8]'
            : 'border-[rgba(125,190,210,0.16)] bg-[rgba(8,13,17,0.82)] text-[#a8b8be] hover:border-[rgba(79,216,232,0.35)]',
        )}
      >
        <Layers size={12} strokeWidth={1.6} />
        Layers
        <span className='ml-auto tabular-nums text-[#4fd8e8]'>
          {visibleCount}/{events.length}
        </span>
      </button>

      {open ? (
        // `min-h-0` + `overflow-y-auto` inside the flex column: with eight layer
        // rows, the density key, attestation and the tier section the panel is
        // taller than a short map region, and without this its last section is
        // simply unreachable.
        <div className='pointer-events-auto mt-2 min-h-0 space-y-4 overflow-y-auto rounded-xl border border-[rgba(125,190,210,0.16)] bg-[rgba(8,13,17,0.9)] p-3 backdrop-blur-md'>
          <section>
            <p className='mb-2 font-mono text-[8px] tracking-[0.22em] text-[#7d8f95] uppercase'>
              Layer visibility
            </p>
            <ul className='space-y-0.5'>
              {LAYER_ROWS.map((row) => {
                const count = countsByLayer.get(row.key) ?? 0
                const available = count > 0
                const on = layers[row.key]
                return (
                  <li key={row.key}>
                    <button
                      type='button'
                      disabled={!available}
                      onClick={() => setLayerVisibility({[row.key]: !on})}
                      title={
                        available
                          ? `${count} record${count === 1 ? '' : 's'} loaded`
                          : 'No records of this type in the loaded corpus'
                      }
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-[11px] transition-colors',
                        !available
                          ? 'cursor-not-allowed text-[#3f4b50]'
                          : on
                            ? 'text-[#dbe7ea] hover:bg-white/[0.05]'
                            : 'text-[#6b7c83] hover:bg-white/[0.05]',
                      )}
                    >
                      <span
                        aria-hidden
                        className='flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border'
                        style={{
                          borderColor:
                            available && on ? row.color : 'rgba(125,190,210,0.24)',
                          backgroundColor: available && on ? `${row.color}33` : 'transparent',
                        }}
                      >
                        <span
                          className='h-1 w-1 rounded-full'
                          style={{
                            backgroundColor:
                              available && on ? row.color : 'rgba(125,190,210,0.24)',
                          }}
                        />
                      </span>
                      <span className='flex-1 truncate'>{row.label}</span>
                      {available ? (
                        <>
                          <span className='font-mono text-[9px] tabular-nums text-[#5d6d74]'>
                            {count}
                          </span>
                          {on ? (
                            <Eye size={12} strokeWidth={1.6} className='text-[#4fd8e8]' />
                          ) : (
                            <EyeOff size={12} strokeWidth={1.6} className='text-[#4d5c62]' />
                          )}
                        </>
                      ) : (
                        <span className='font-mono text-[8px] tracking-wider uppercase'>
                          none
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <p className='mb-2 font-mono text-[8px] tracking-[0.22em] text-[#7d8f95] uppercase'>
              Density
            </p>
            <ul className='space-y-1.5'>
              {DENSITY_SAMPLES.map((sample) => (
                <li key={sample.label} className='flex items-center gap-2'>
                  <span
                    aria-hidden
                    className='w-9 shrink-0 rounded-sm bg-[#4fd8e8]'
                    style={{height: sample.height, opacity: sample.opacity}}
                  />
                  <span className='font-mono text-[9px] text-[#8b9ba1]'>{sample.label}</span>
                </li>
              ))}
            </ul>
            <p className='mt-1.5 font-mono text-[8px] leading-relaxed text-[#4d5c62]'>
              Bar weight on the dial track = records per bin.
            </p>
          </section>

          <section>
            <p className='mb-2 font-mono text-[8px] tracking-[0.22em] text-[#7d8f95] uppercase'>
              Attestation
            </p>
            <ul className='space-y-0.5'>
              {EPISTEMIC_ROWS.map((row) => {
                const reachable = presentStatuses.has(row.status)
                const on = filters.epistemic[row.status]
                return (
                  <li key={row.status}>
                    <button
                      type='button'
                      disabled={!reachable}
                      onClick={() => setEpistemicFilter(row.status, !on)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-[11px] transition-colors',
                        !reachable
                          ? 'cursor-not-allowed text-[#3f4b50]'
                          : on
                            ? 'text-[#dbe7ea] hover:bg-white/[0.05]'
                            : 'text-[#6b7c83] hover:bg-white/[0.05]',
                      )}
                    >
                      <span
                        aria-hidden
                        className='h-1.5 w-1.5 shrink-0 rounded-full'
                        style={{
                          backgroundColor: reachable
                            ? STC_EPISTEMIC_COLOR[row.status]
                            : 'rgba(125,190,210,0.24)',
                          opacity: on ? 1 : 0.35,
                        }}
                      />
                      <span className='flex-1'>{row.label}</span>
                      {!reachable ? (
                        <span className='font-mono text-[8px] tracking-wider uppercase'>
                          none
                        </span>
                      ) : on ? (
                        <Eye size={12} strokeWidth={1.6} className='text-[#4fd8e8]' />
                      ) : (
                        <EyeOff size={12} strokeWidth={1.6} className='text-[#4d5c62]' />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <p className='mb-2 font-mono text-[8px] tracking-[0.22em] text-[#7d8f95] uppercase'>
              Min. evidentiary tier
            </p>
            {maxCredibility <= 0 ? (
              /*
               * The curated `events` table carries no corroboration, provenance
               * or source-tier column, so `normalize.ts` deliberately emits no
               * credibilityScore. Rendering four tier buttons that can never
               * match anything would be a dead control dressed as a precise one
               * — say why instead. Returns automatically once Lane A's
               * provenance backfill (H4) gives these records a real score.
               */
              <p className='font-mono text-[9px] leading-relaxed text-[#4d5c62]'>
                No loaded record carries a credibility score — the curated events
                corpus has no provenance tier yet, so this filter stays inert
                rather than inventing one.
              </p>
            ) : (
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
                        'flex-1 rounded-md border px-1.5 py-1 font-mono text-[9px] tracking-wide uppercase transition',
                        !reachable
                          ? 'cursor-not-allowed border-white/5 text-[#3f4b50]'
                          : filters.credibilityMin === tier.value
                            ? 'border-[rgba(79,216,232,0.5)] bg-[rgba(79,216,232,0.14)] text-[#4fd8e8]'
                            : 'border-[rgba(125,190,210,0.16)] text-[#7d8f95] hover:bg-white/[0.05]',
                      )}
                    >
                      {tier.label}
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
