'use client'

import {CanvasChrome, Stamp, TourMeta} from './CanvasChrome'
import {INTELLIGENCE, TOUR} from './fixtures'

/**
 * D — Interaction: fully dynamic on-canvas tour.
 * Camera/path is the UI; narrative rides the tour path; no modal card.
 */
export function VariantD() {
  return (
    <CanvasChrome dimInactive showTourPath>
      <div
        data-testid='path-narrator'
        className='absolute z-30 max-w-[280px] -translate-x-1/2 -translate-y-1/2 border border-dashed border-amber-400/45 bg-[var(--ut-void)]/80 px-3 py-2 backdrop-blur-sm'
        style={{left: '57%', top: '53%'}}>
        <div className='flex items-center gap-2'>
          <Stamp tone='amber'>Live path</Stamp>
          <TourMeta tour={TOUR} />
        </div>
        <p className='mt-1 text-[12px] font-medium text-[var(--ut-paper)]'>
          <span className='ut-mono mr-1.5 text-[10px] text-amber-300/90'>{TOUR.year}</span>
          {TOUR.stopTitle}
        </p>
        <p className='mt-1 text-[10px] leading-snug text-[var(--ut-ink-dim)]'>
          Path advances with the camera. Click nowhere — Continue steps the graph.
        </p>
        <div className='mt-2 flex items-center gap-2'>
          <button
            type='button'
            className='ut-mono rounded border border-[var(--ut-line)] px-2 py-0.5 text-[8px] text-[var(--ut-ink-dim)]'>
            Back
          </button>
          <button
            type='button'
            className='ut-mono rounded border border-emerald-400/45 bg-emerald-400/15 px-2 py-0.5 text-[8px] text-emerald-300'>
            Continue along path
          </button>
        </div>
      </div>

      <div className='pointer-events-none absolute left-14 top-3 z-20 opacity-40'>
        <p className='ut-mono text-[8px] text-[var(--ut-paper)]'>Tour · {TOUR.title}</p>
      </div>
      <div className='pointer-events-none absolute right-4 top-3 z-20 text-right opacity-45'>
        <Stamp tone='violet'>AI layer</Stamp>
        <p className='ut-mono mt-1 text-[8px] text-[var(--ut-ink-faint)]'>
          {INTELLIGENCE.affinity}
        </p>
      </div>

      <div
        aria-hidden
        className='pointer-events-none absolute z-[9] size-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/35'
        style={{left: '42%', top: '48%'}}
      />
    </CanvasChrome>
  )
}
