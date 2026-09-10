'use client'

import {useEffect, useMemo, useRef} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {cn} from '@/lib/utils'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {useSpacetimeStore} from '../state/spacetime-store'
import type {TemporalStation} from '../types/spacetime'

/**
 * Guided narrative — concept-02 frames 2–4.
 *
 * **What changed and why.** This replaces a full-viewport `preserve-3d` scroll
 * of cards. That device was never on any board: concept-02 drives chapters with
 * an explicit `‹ CURRENT CHAPTER ›` control over a waypoint strip, and every
 * board keeps the globe as an interactive foreground with chrome docked around
 * it. The scroll layer was also the direct cause of both shipped breaks — it
 * spanned the frame, so it swallowed every click meant for the globe, and it
 * mapped raw scroll offset onto a *different* station list than the one it
 * rendered, so the camera and the visible card disagreed.
 *
 * Here the chapter list is a docked column and the cursor is written by an
 * explicit selection. Scroll still moves the cursor in `guided` mode — the
 * user asked for that — but it now reads from the same array it renders, so
 * the two cannot drift apart.
 */

/** Chapters shown. Above this the column reads as a list, not a narrative. */
const MAX_CHAPTERS = 12

export function WaypointNarrative() {
  const stations = useSpacetimeStore((s) => s.stations)
  const events = useSpacetimeStore((s) => s.events)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)
  const interactionMode = useSpacetimeStore((s) => s.interactionMode)
  const setScrollProgress = useSpacetimeStore((s) => s.setScrollProgress)
  const setTemporalCursor = useSpacetimeStore((s) => s.setTemporalCursor)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)

  const listRef = useRef<HTMLDivElement>(null)

  const visibleEvents = useMemo(
    () => filterSpacetimeEvents(events, layers, filters),
    [events, layers, filters],
  )
  const visibleIds = useMemo(
    () => new Set(visibleEvents.map((e) => e.id)),
    [visibleEvents],
  )

  /**
   * The chapter list. **This exact array is what scroll indexes into** — the
   * shipped bug was `stationAtProgress(stations, …)` against the full station
   * set (including every decade tick) while the UI rendered this filtered,
   * sliced subset. Progress 0.5 therefore selected a station that was nowhere
   * near the card on screen.
   *
   * Selection is a stratified spread, densest-per-bucket. Two rejected
   * alternatives, both of which produce a list that is not an investigation:
   *
   *   - `.slice(0, 12)` off the time-sorted stations (what shipped) yields the
   *     twelve *earliest* — against this corpus that is Angel hair 196,
   *     Clonmacnoise 740, Nuremberg 1561 and nothing after 1803. The chapters
   *     covered only antiquity while most records sat below the fold.
   *   - Top-12 by density alone degenerates for the same reason: with no
   *     credibility signal in this corpus, `density` is essentially "how many
   *     records share this day", which is 1 for nearly every station. The sort
   *     is then a near-total tie and falls back to input order — earliest again.
   *
   * Bucketing the eligible stations into `MAX_CHAPTERS` equal slices and taking
   * the densest from each guarantees the chain traverses the corpus, which is
   * what concept-02's waypoint sequence (1942 → 1947 → 1961 → 1980 → 2004) is.
   */
  const chapters = useMemo(() => {
    const eligible = stations
      .filter((s) => s.kind === 'event')
      .filter((s) => (s.eventIds ?? []).some((id) => visibleIds.has(id)))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    if (eligible.length <= MAX_CHAPTERS) return eligible

    const picked: TemporalStation[] = []
    const bucketSize = eligible.length / MAX_CHAPTERS
    for (let i = 0; i < MAX_CHAPTERS; i++) {
      const from = Math.floor(i * bucketSize)
      const to = Math.max(from + 1, Math.floor((i + 1) * bucketSize))
      const best = eligible
        .slice(from, to)
        .reduce((a, b) => ((b.density ?? 0) > (a.density ?? 0) ? b : a))
      if (best && !picked.includes(best)) picked.push(best)
    }
    return picked
  }, [stations, visibleIds])

  const activeIndex = useMemo(() => {
    const activeId = cursor.mode === 'station' ? cursor.stationId : null
    const byId = chapters.findIndex((c) => c.id === activeId)
    if (byId >= 0) return byId
    // No station cursor (dial set an exact timestamp, say) — fall back to the
    // chapter nearest in time so the column always agrees with the cursor.
    const ts = cursor.mode === 'range' ? cursor.start : cursor.timestamp
    const target = new Date(ts).getTime()
    if (!Number.isFinite(target) || chapters.length === 0) return -1
    let best = 0
    let bestDt = Infinity
    chapters.forEach((c, i) => {
      const dt = Math.abs(new Date(c.timestamp).getTime() - target)
      if (dt < bestDt) {
        bestDt = dt
        best = i
      }
    })
    return best
  }, [chapters, cursor])

  const goTo = (index: number) => {
    const station = chapters[index]
    if (!station) return
    setTemporalCursor({
      mode: 'station',
      stationId: station.id,
      timestamp: station.timestamp,
    })
    setScrollProgress(chapters.length > 1 ? index / (chapters.length - 1) : 0)
    const only = station.eventIds?.length === 1 ? station.eventIds[0] : null
    selectEvent(only ?? null)
  }

  // Guided mode: scrolling the column advances the chapter. Indexing the same
  // `chapters` array the column renders is the whole fix for Break 2.
  useEffect(() => {
    const list = listRef.current
    if (!list || interactionMode !== 'guided' || chapters.length === 0) return

    const onScroll = () => {
      const max = list.scrollHeight - list.clientHeight
      const progress = max > 0 ? list.scrollTop / max : 0
      setScrollProgress(progress)
      const index = Math.min(
        chapters.length - 1,
        Math.round(progress * (chapters.length - 1)),
      )
      const station = chapters[index]
      if (!station) return
      setTemporalCursor({
        mode: 'station',
        stationId: station.id,
        timestamp: station.timestamp,
      })
    }

    list.addEventListener('scroll', onScroll, {passive: true})
    return () => list.removeEventListener('scroll', onScroll)
  }, [interactionMode, chapters, setScrollProgress, setTemporalCursor])

  /**
   * Keep the active chapter in view when the *dial* moved it.
   *
   * Free mode only, deliberately. In guided mode the user's own scroll is what
   * set `activeIndex`, so scrolling the list again would fight them — and worse,
   * a programmatic scroll fires the handler above, which writes the cursor,
   * which flies the camera. On mount that produced a canvas that opened already
   * descended on a region instead of showing the globe.
   */
  useEffect(() => {
    if (activeIndex < 0 || interactionMode !== 'free') return
    listRef.current
      ?.querySelector(`[data-chapter-index="${activeIndex}"]`)
      ?.scrollIntoView({block: 'nearest', behavior: 'smooth'})
  }, [activeIndex, interactionMode])

  if (chapters.length === 0) return null

  const active = chapters[activeIndex] ?? null

  return (
    <aside
      aria-label='Guided investigation'
      className='pointer-events-auto absolute top-4 bottom-12 left-4 z-20 flex w-[19rem] flex-col overflow-hidden rounded-xl border border-[rgba(125,190,210,0.16)] bg-[rgba(8,13,17,0.86)] backdrop-blur-md'
    >
      <header className='border-b border-[rgba(125,190,210,0.14)] px-3.5 py-2.5'>
        <div className='font-mono text-[8px] tracking-[0.24em] text-[#7d8f95] uppercase'>
          Guided investigation
        </div>
        <div className='mt-1 text-[12px] leading-snug text-[#c3d3d8]'>
          A flight through the unexplained
        </div>

        {/* Explicit chapter control — concept-02 frame 4's `‹ … ›`. */}
        <div className='mt-2.5 flex items-center gap-2'>
          <button
            type='button'
            disabled={activeIndex <= 0}
            onClick={() => goTo(activeIndex - 1)}
            aria-label='Previous chapter'
            className='flex h-6 w-6 items-center justify-center rounded-md border border-[rgba(125,190,210,0.2)] text-[#a8b8be] transition-colors hover:border-[rgba(79,216,232,0.5)] hover:text-[#4fd8e8] disabled:opacity-25'
          >
            <ChevronLeft size={12} strokeWidth={1.8} />
          </button>
          <span className='flex-1 truncate text-center font-mono text-[9px] tracking-[0.14em] text-[#8b9ba1] uppercase'>
            {active
              ? `${activeIndex + 1}/${chapters.length} · ${active.timestamp.slice(0, 4)}`
              : `— / ${chapters.length}`}
          </span>
          <button
            type='button'
            disabled={activeIndex < 0 || activeIndex >= chapters.length - 1}
            onClick={() => goTo(activeIndex + 1)}
            aria-label='Next chapter'
            className='flex h-6 w-6 items-center justify-center rounded-md border border-[rgba(125,190,210,0.2)] text-[#a8b8be] transition-colors hover:border-[rgba(79,216,232,0.5)] hover:text-[#4fd8e8] disabled:opacity-25'
          >
            <ChevronRight size={12} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <div ref={listRef} className='min-h-0 flex-1 overflow-y-auto px-2.5 py-2.5'>
        <ol className='space-y-1.5'>
          {chapters.map((station, index) => (
            <ChapterRow
              key={station.id}
              station={station}
              index={index}
              active={index === activeIndex}
              onSelect={() => goTo(index)}
            />
          ))}
        </ol>
      </div>

      <footer className='border-t border-[rgba(125,190,210,0.14)] px-3.5 py-2'>
        <div className='font-mono text-[8px] leading-relaxed tracking-[0.14em] text-[#707f86] uppercase'>
          {interactionMode === 'guided'
            ? 'Guided · scroll advances the chapter'
            : 'Free · the dial owns the cursor'}
        </div>
      </footer>
    </aside>
  )
}

function ChapterRow({
  station,
  index,
  active,
  onSelect,
}: {
  station: TemporalStation
  index: number
  active: boolean
  onSelect: () => void
}) {
  return (
    <li data-chapter-index={index}>
      <button
        type='button'
        onClick={onSelect}
        className={cn(
          'flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors',
          active
            ? 'border-[rgba(79,216,232,0.45)] bg-[rgba(79,216,232,0.1)]'
            : 'border-transparent hover:border-[rgba(125,190,210,0.2)] hover:bg-white/[0.04]',
        )}
      >
        <span
          className={cn(
            'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border font-mono text-[8px]',
            active
              ? 'border-[#4fd8e8] bg-[rgba(79,216,232,0.2)] text-[#dff8fb]'
              : 'border-[rgba(125,190,210,0.3)] text-[#707f86]',
          )}
        >
          {index + 1}
        </span>
        <span className='min-w-0 flex-1'>
          <span
            className={cn(
              'block font-mono text-[9px] tracking-[0.16em]',
              active ? 'text-[#4fd8e8]' : 'text-[#707f86]',
            )}
          >
            {station.timestamp.slice(0, 10)}
          </span>
          <span
            className={cn(
              'mt-0.5 block text-[12px] leading-snug',
              active ? 'text-[#eef6f8]' : 'text-[#a8b8be]',
            )}
          >
            {station.label}
          </span>
        </span>
        {/* Density bar — same encoding as the dial track. */}
        <span
          aria-hidden
          className='mt-1 h-6 w-[3px] shrink-0 rounded-full bg-[#4fd8e8]'
          style={{opacity: 0.18 + (station.density ?? 0) * 0.72}}
        />
      </button>
    </li>
  )
}
