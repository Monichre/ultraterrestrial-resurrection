'use client'

import {useMemo, useState} from 'react'
import {cn} from '@/lib/utils'
import {niceYearStep} from '../lib/temporal-stations'
import {useSpacetimeStore} from '../state/spacetime-store'
import {PlaybackTransport} from './playback-transport'
import type {TemporalStation} from '../types/spacetime'

/**
 * Adaptive temporal dial — concept-01 frame 2, docked full width at the bottom
 * as in spec §9's layout, with concept-04's density track underneath.
 *
 * Three things the board shows that this has to earn rather than draw:
 *
 * 1. **Milestone chips over a fine tick ruler.** Chips are the densest event
 *    stations, thinned so two never collide; ticks are round years from
 *    `niceYearStep`.
 * 2. **A density track.** Concept-04's "CLUSTER TIMELINE" histogram. Bars are
 *    real per-year record counts, not decoration.
 * 3. **"Adaptive."** The corpus runs 196 CE → present, so a linear axis over the
 *    whole range crushes every modern milestone into the last few percent of the
 *    width — unreadable, and the board's 1900–2024 span never had to face it.
 *    The dial therefore opens on the *dense era* (the window holding ~92% of
 *    records) and collects the deep-time tail into a leading bracket you can
 *    click to widen the domain. The bracket states its own count, so nothing is
 *    hidden — it is scoped, and says so.
 */

/** Fraction of records the default (dense) domain must contain. */
const DENSE_COVERAGE = 0.92
/** Minimum axis separation between two chips, as a fraction of the width. */
const MIN_CHIP_GAP = 0.075
const MAX_CHIPS = 9

function yearOf(timestamp: string): number {
  return Number(timestamp.slice(0, 4))
}

export function TemporalDial({className}: {className?: string}) {
  const stations = useSpacetimeStore((s) => s.stations)
  const events = useSpacetimeStore((s) => s.events)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)
  const setTemporalCursor = useSpacetimeStore((s) => s.setTemporalCursor)
  const setInteractionMode = useSpacetimeStore((s) => s.setInteractionMode)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)

  const [showFullRange, setShowFullRange] = useState(false)

  const years = useMemo(
    () => events.map((e) => yearOf(e.timestamp)).filter(Number.isFinite).sort((a, b) => a - b),
    [events],
  )

  const domain = useMemo(() => computeDomain(years, showFullRange), [years, showFullRange])
  const outsideCount = useMemo(
    () => years.filter((y) => y < domain.start).length,
    [years, domain.start],
  )

  const ticks = useMemo(() => buildTicks(domain), [domain])
  const histogram = useMemo(() => buildHistogram(years, domain), [years, domain])

  const activeStationId = cursor.mode === 'station' ? cursor.stationId : null
  const cursorYear =
    cursor.mode === 'range' ? yearOf(cursor.start) : yearOf(cursor.timestamp)

  const chips = useMemo(
    () => selectChips(stations, domain),
    [stations, domain],
  )

  const onSelect = (station: TemporalStation) => {
    // Dial input is an explicit override — flip to free so scroll stops
    // fighting it for the cursor (store contract D1).
    setInteractionMode('free')
    setTemporalCursor({
      mode: 'station',
      stationId: station.id,
      timestamp: station.timestamp,
    })
    // A station that resolves to exactly one record *is* that record; opening
    // the inspector is what a user means by clicking it.
    const only = station.eventIds?.length === 1 ? station.eventIds[0] : null
    selectEvent(only ?? null)
  }

  const hasData = events.length > 0

  return (
    <section
      aria-label='Adaptive temporal dial'
      className={cn(
        'relative border-t border-[rgba(125,190,210,0.16)] bg-[rgba(6,10,13,0.94)] px-5 pt-3 pb-4',
        className,
      )}
    >
      <div className='flex items-center gap-3'>
        <span className='rounded-md border border-[rgba(125,190,210,0.22)] px-2 py-1 font-mono text-[8px] tracking-[0.22em] text-[#7d8f95] uppercase'>
          Adaptive temporal dial
        </span>

        {outsideCount > 0 || showFullRange ? (
          <button
            type='button'
            onClick={() => setShowFullRange((v) => !v)}
            className='rounded-md border border-[rgba(240,168,96,0.32)] bg-[rgba(240,168,96,0.08)] px-2 py-1 font-mono text-[8px] tracking-[0.16em] text-[#f0a860] uppercase transition-colors hover:bg-[rgba(240,168,96,0.16)]'
          >
            {showFullRange
              ? `Focus ${dense(years)}–${domain.end}`
              : `+ ${outsideCount} before ${domain.start}`}
          </button>
        ) : null}

        <p className='ml-auto flex items-baseline gap-2'>
          <span className='font-mono text-[8px] tracking-[0.22em] text-[#4d5c62] uppercase'>
            Cursor
          </span>
          <span className='font-mono text-[12px] tracking-wide text-[#4fd8e8]'>
            {cursor.mode === 'range'
              ? `${cursor.start.slice(0, 10)} → ${cursor.end.slice(0, 10)}`
              : cursor.timestamp.slice(0, 10)}
          </span>
        </p>

        {/*
         * `LIVE ▶` on the boards streams present-day activity; nothing streams
         * yet. What concept-04 frames 2–3 actually specify — play, speed, and
         * event stepping over the loaded range — is buildable from timestamps
         * alone, so that is what sits here instead of a feed that isn't one.
         */}
        <PlaybackTransport />

        <button
          type='button'
          disabled={!hasData}
          onClick={() => {
            const latest = [...events].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            )[0]
            if (!latest) return
            setInteractionMode('free')
            setTemporalCursor({mode: 'exact', timestamp: latest.timestamp, precision: latest.timePrecision})
            selectEvent(latest.id)
          }}
          title='Jump to the most recent record in the corpus'
          className='rounded-md border border-[rgba(125,190,210,0.24)] bg-[rgba(8,13,17,0.8)] px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#a8b8be] uppercase transition-colors hover:border-[rgba(79,216,232,0.45)] hover:text-[#4fd8e8] disabled:opacity-30'
        >
          Latest
        </button>
      </div>

      {/* ---- axis ------------------------------------------------------- */}
      <div className='relative mt-3 h-[76px]'>
        {/* chips */}
        {chips.map((chip) => {
          const active = chip.station.id === activeStationId
          return (
            <button
              key={chip.station.id}
              type='button'
              onClick={() => onSelect(chip.station)}
              title={chip.station.label}
              style={{left: `${chip.position * 100}%`}}
              className='absolute top-0 -translate-x-1/2'
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-full border font-mono transition-all',
                  active
                    ? 'h-9 w-9 border-[#4fd8e8] bg-[rgba(79,216,232,0.18)] text-[11px] text-[#dff8fb] shadow-[0_0_18px_rgba(79,216,232,0.45)]'
                    : 'h-7 w-[52px] border-[rgba(125,190,210,0.3)] bg-[rgba(8,13,17,0.9)] text-[10px] text-[#a8b8be] hover:border-[rgba(79,216,232,0.6)] hover:text-[#dff8fb]',
                )}
              >
                {yearOf(chip.station.timestamp)}
              </span>
              {/* drop-line to the track, as on the board */}
              <span
                aria-hidden
                className={cn(
                  'absolute left-1/2 w-px -translate-x-1/2',
                  active ? 'bg-[#4fd8e8]' : 'bg-[rgba(125,190,210,0.28)]',
                )}
                style={{top: active ? 36 : 28, height: active ? 12 : 20}}
              />
            </button>
          )
        })}

        {/* density track — concept-04 cluster timeline */}
        <div className='absolute inset-x-0 bottom-[18px] flex h-6 items-end gap-px'>
          {histogram.map((bin) => (
            <span
              key={bin.year}
              title={`${bin.year}–${bin.year + bin.step - 1} · ${bin.count} record${bin.count === 1 ? '' : 's'}`}
              className='flex-1 rounded-sm bg-[#4fd8e8]'
              style={{
                height: `${Math.max(bin.count > 0 ? 8 : 2, bin.intensity * 100)}%`,
                opacity: bin.count > 0 ? 0.28 + bin.intensity * 0.62 : 0.12,
              }}
            />
          ))}
        </div>

        {/* baseline + tick ruler */}
        <div className='absolute inset-x-0 bottom-[16px] h-px bg-[rgba(125,190,210,0.3)]' />
        {ticks.map((tick) => (
          <div
            key={tick.year}
            className='absolute bottom-0 -translate-x-1/2'
            style={{left: `${tick.position * 100}%`}}
          >
            <span
              aria-hidden
              className='mx-auto block h-[5px] w-px bg-[rgba(125,190,210,0.4)]'
            />
            <span className='mt-1 block font-mono text-[8px] tracking-wider text-[#4d5c62] whitespace-nowrap'>
              {tick.year}
            </span>
          </div>
        ))}

        {/* live cursor position on the axis */}
        {Number.isFinite(cursorYear) &&
        cursorYear >= domain.start &&
        cursorYear <= domain.end ? (
          <span
            aria-hidden
            className='absolute bottom-[10px] h-[34px] w-px bg-[#4fd8e8] shadow-[0_0_10px_rgba(79,216,232,0.8)]'
            style={{left: `${((cursorYear - domain.start) / domain.span) * 100}%`}}
          />
        ) : null}
      </div>

      {!hasData ? (
        <p className='absolute inset-x-0 bottom-8 text-center font-mono text-[9px] tracking-[0.2em] text-[#4d5c62] uppercase'>
          Awaiting corpus…
        </p>
      ) : null}
    </section>
  )
}

// ---------------------------------------------------------------------------

interface Domain {
  start: number
  end: number
  span: number
}

function dense(years: number[]): number {
  if (years.length === 0) return 1900
  const idx = Math.floor(years.length * (1 - DENSE_COVERAGE))
  const pivot = years[Math.min(idx, years.length - 1)] ?? years[0]!
  return Math.floor(pivot / 50) * 50
}

function computeDomain(years: number[], full: boolean): Domain {
  const nowYear = new Date().getUTCFullYear()
  if (years.length === 0) return {start: 1900, end: nowYear, span: nowYear - 1900}

  const end = Math.max(years[years.length - 1] ?? nowYear, nowYear)
  const min = years[0] ?? 1900
  const start = full ? Math.floor(min / 50) * 50 : Math.max(Math.floor(min / 50) * 50, dense(years))

  return {start, end, span: Math.max(1, end - start)}
}

function buildTicks(domain: Domain): Array<{year: number; position: number}> {
  const step = niceYearStep(domain.span, 10)
  const first = Math.ceil(domain.start / step) * step
  const ticks: Array<{year: number; position: number}> = []
  for (let year = first; year <= domain.end; year += step) {
    ticks.push({year, position: (year - domain.start) / domain.span})
  }
  return ticks
}

/**
 * Bin record counts across the domain. Bin width is chosen so the track keeps
 * ~72 bars regardless of span — dense enough to read as a distribution, coarse
 * enough that a single record doesn't render as a 1px sliver.
 */
function buildHistogram(
  years: number[],
  domain: Domain,
): Array<{year: number; step: number; count: number; intensity: number}> {
  const binCount = 72
  const step = Math.max(1, Math.ceil(domain.span / binCount))
  const bins: Array<{year: number; step: number; count: number; intensity: number}> = []

  for (let year = domain.start; year <= domain.end; year += step) {
    const count = years.filter((y) => y >= year && y < year + step).length
    bins.push({year, step, count, intensity: 0})
  }

  const peak = Math.max(1, ...bins.map((b) => b.count))
  for (const bin of bins) bin.intensity = bin.count / peak
  return bins
}

/**
 * Thin event stations down to chips that will not collide.
 *
 * Greedy by density: take the busiest station first and reject anything closer
 * than `MIN_CHIP_GAP` on the axis. Sorting the survivors back into time order
 * matters — the boards read left to right as a chronology.
 */
function selectChips(
  stations: TemporalStation[],
  domain: Domain,
): Array<{station: TemporalStation; position: number}> {
  const candidates = stations
    .filter((s) => s.kind === 'event')
    .map((station) => ({
      station,
      position: (yearOf(station.timestamp) - domain.start) / domain.span,
    }))
    .filter((c) => c.position >= 0 && c.position <= 1)
    .sort((a, b) => (b.station.density ?? 0) - (a.station.density ?? 0))

  const accepted: Array<{station: TemporalStation; position: number}> = []
  for (const candidate of candidates) {
    if (accepted.length >= MAX_CHIPS) break
    if (accepted.some((a) => Math.abs(a.position - candidate.position) < MIN_CHIP_GAP)) {
      continue
    }
    accepted.push(candidate)
  }

  return accepted.sort((a, b) => a.position - b.position)
}
