'use client'

import {CanvasChrome, Stamp, TourMeta} from './CanvasChrome'
import {INTELLIGENCE, TOUR} from './fixtures'

/** B — Layout: bottom chronobar + right dossier rail (no center modal). */
export function VariantB() {
  return (
    <CanvasChrome dimInactive={false} showTourPath>
      <aside
        data-testid='dossier-rail'
        className='ut-panel absolute bottom-16 right-3 top-3 z-20 flex w-[240px] flex-col overflow-hidden backdrop-blur-md'>
        <div className='border-b border-[var(--ut-line)] px-3 py-2'>
          <p className='ut-typewriter text-[13px] text-[var(--ut-paper)]'>{TOUR.stopTitle}</p>
          <div className='mt-1 flex items-center gap-2'>
            <Stamp>{TOUR.year}</Stamp>
            <TourMeta tour={TOUR} />
          </div>
        </div>
        <div className='flex-1 space-y-3 overflow-auto px-3 py-2.5'>
          <p className='text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>{TOUR.narrative}</p>
          <div className='border border-dashed border-violet-400/30 px-2 py-2'>
            <Stamp tone='violet'>Field hypothesis</Stamp>
            <p className='mt-1.5 text-[10px] leading-relaxed text-[var(--ut-ink-dim)]'>
              {INTELLIGENCE.hypothesis}
            </p>
          </div>
          <div className='space-y-1.5'>
            {INTELLIGENCE.figures.map((f) => (
              <div
                key={f.name}
                className='flex items-center justify-between border border-[var(--ut-line)] px-2 py-1.5'>
                <span className='text-[11px] text-[var(--ut-paper)]'>{f.name}</span>
                <Stamp>{f.state}</Stamp>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div
        data-testid='chrono-bar'
        className='absolute bottom-3 left-14 right-[260px] z-30 flex items-center gap-2 border border-[var(--ut-line)] bg-[var(--ut-surface)]/95 px-3 py-2 backdrop-blur-md'>
        <Stamp>Chronological path</Stamp>
        <div className='flex flex-1 items-center gap-1'>
          {Array.from({length: TOUR.total}).map((_, i) => (
            <button
              key={i}
              type='button'
              aria-label={`Stop ${i + 1}`}
              className={`h-1.5 flex-1 rounded-full transition ${
                i + 1 === TOUR.step
                  ? 'bg-emerald-400'
                  : i + 1 < TOUR.step
                    ? 'bg-emerald-400/40'
                    : 'bg-[var(--ut-line-strong)]'
              }`}
            />
          ))}
        </div>
        <button
          type='button'
          className='ut-mono rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-[8px] text-emerald-300'>
          Next stop
        </button>
      </div>
    </CanvasChrome>
  )
}
