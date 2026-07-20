'use client'

import {CanvasChrome, Stamp, TourMeta} from './CanvasChrome'
import {INTELLIGENCE, TOUR} from './fixtures'

/** A — Hierarchy: graph primary; tour as slim HUD strip; intelligence collapsed to stamp. */
export function VariantA() {
  return (
    <CanvasChrome dimInactive showTourPath>
      <div
        data-testid='tour-hud'
        className='absolute left-1/2 top-3 z-30 flex w-[min(520px,calc(100%-5rem))] -translate-x-1/2 items-center gap-3 border border-[var(--ut-line)] bg-[var(--ut-surface)]/90 px-3 py-1.5 backdrop-blur-md'
        style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'}}>
        <Stamp>Guided tour</Stamp>
        <span className='ut-mono truncate text-[9px] text-[var(--ut-ink-dim)]'>{TOUR.title}</span>
        <span className='truncate text-[12px] text-[var(--ut-paper)]'>
          <span className='ut-mono mr-2 text-emerald-400/90'>{TOUR.year}</span>
          {TOUR.stopTitle}
        </span>
        <TourMeta tour={TOUR} />
        <button
          type='button'
          className='ut-mono ml-auto rounded border border-[var(--ut-line)] px-2 py-0.5 text-[8px] text-[var(--ut-ink-dim)] hover:text-[var(--ut-paper)]'>
          Continue
        </button>
      </div>

      <button
        type='button'
        data-testid='intel-stamp'
        className='absolute right-4 top-14 z-20 flex max-w-[200px] flex-col gap-1 border border-dashed border-violet-400/40 bg-[var(--ut-surface)]/80 px-2.5 py-2 text-left backdrop-blur-md'>
        <Stamp tone='violet'>Tour intelligence</Stamp>
        <p className='text-[10px] leading-snug text-[var(--ut-ink-dim)]'>
          Tap to expand field hypothesis · {INTELLIGENCE.figures.length} key figures
        </p>
      </button>

      <div className='pointer-events-none absolute left-[42%] top-[62%] z-20 -translate-x-1/2'>
        <p className='ut-mono max-w-[220px] text-center text-[8px] text-emerald-300/80'>
          Active stop · graph remains readable
        </p>
      </div>
    </CanvasChrome>
  )
}
