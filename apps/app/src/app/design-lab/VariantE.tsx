'use client'

import {CanvasChrome, Stamp, TourMeta} from './CanvasChrome'
import {INTELLIGENCE, TOUR} from './fixtures'

/**
 * E — Expressive: archival dossier sheet + clinical HUD ghosts.
 * Tour reads as a microfilm frame pulled into the lamp light.
 */
export function VariantE() {
  return (
    <CanvasChrome dimInactive showTourPath>
      <div
        data-testid='microfilm-frame'
        className='absolute z-30 w-[300px] -translate-x-1/2 border border-[var(--ut-line-strong)] bg-[var(--ut-surface)] shadow-[0_24px_60px_oklch(0.1_0.01_85/0.55)]'
        style={{
          left: '38%',
          top: '12%',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }}>
        <div className='flex items-center justify-between border-b border-[var(--ut-line)] px-3 py-1.5'>
          <span className='ut-mono text-[8px] text-[var(--ut-stamp)]'>Declassified excerpt</span>
          <TourMeta tour={TOUR} />
        </div>
        <div className='px-3 py-3'>
          <p className='ut-typewriter text-[15px] leading-tight text-[var(--ut-paper)]'>
            {TOUR.year} · {TOUR.stopTitle}
          </p>
          <p className='mt-2 text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>
            {TOUR.narrative}
          </p>
          <div className='mt-3 flex flex-wrap gap-1.5'>
            <Stamp>Sourced</Stamp>
            <Stamp tone='amber'>Contested hinge</Stamp>
          </div>
        </div>
        <div className='flex border-t border-[var(--ut-line)]'>
          <button
            type='button'
            className='ut-mono flex-1 px-2 py-2 text-[8px] text-[var(--ut-ink-dim)] hover:bg-[var(--ut-surface-2)]'>
            Prev plate
          </button>
          <button
            type='button'
            className='ut-mono flex-1 border-l border-[var(--ut-line)] bg-emerald-400/10 px-2 py-2 text-[8px] text-emerald-300'>
            Next plate
          </button>
        </div>
      </div>

      <div className='pointer-events-none absolute bottom-4 right-4 z-20 w-[200px] opacity-55'>
        <div className='border border-dashed border-violet-400/30 bg-[var(--ut-void)]/60 px-2 py-2'>
          <Stamp tone='violet'>Ghost layer · inference</Stamp>
          <p className='mt-1 text-[9px] leading-snug text-[var(--ut-ink-faint)]'>
            {INTELLIGENCE.hypothesis.slice(0, 110)}…
          </p>
        </div>
      </div>
    </CanvasChrome>
  )
}
