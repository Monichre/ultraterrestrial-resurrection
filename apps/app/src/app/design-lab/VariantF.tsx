'use client'

import {CanvasChrome, Stamp, TourMeta} from './CanvasChrome'
import {TOUR} from './fixtures'

/**
 * F — Synthesis: A hierarchy + D path tour + apossible chrome-minimal.
 * Intelligence lives on the active record and waypoint edges — never a side card.
 * Side nav auto-hides; peek from left edge / pin to keep open.
 */
export function VariantF() {
  return (
    <CanvasChrome dimInactive showTourPath navMode='auto-hide' showEdgeLabels bakeIntelIntoRecord>
      {/* A: slim tour HUD — graph stays primary */}
      <div
        data-testid='tour-hud'
        className='absolute left-1/2 top-3 z-30 flex w-[min(480px,calc(100%-3rem))] -translate-x-1/2 items-center gap-2.5 border border-[var(--ut-line)] bg-[var(--ut-surface)]/90 px-3 py-1.5 backdrop-blur-md'
        style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'}}>
        <Stamp>Guided tour</Stamp>
        <span className='ut-mono truncate text-[9px] text-[var(--ut-ink-dim)]'>{TOUR.title}</span>
        <TourMeta tour={TOUR} />
        <span className='ml-auto truncate text-[11px] text-[var(--ut-paper)]'>
          <span className='ut-mono mr-1.5 text-emerald-400/90'>{TOUR.year}</span>
          {TOUR.stopTitle}
        </span>
      </div>

      {/* D: narrative rides the live path — not a modal intelligence drawer */}
      <div
        data-testid='path-narrator'
        className='absolute z-30 max-w-[220px] -translate-x-1/2 border border-dashed border-amber-400/45 bg-[var(--ut-void)]/80 px-2.5 py-2 backdrop-blur-sm'
        style={{left: '57%', top: '53%'}}>
        <div className='flex items-center gap-2'>
          <Stamp tone='amber'>Waypoint</Stamp>
          <span className='ut-mono text-[8px] text-[var(--ut-ink-faint)]'>path · live</span>
        </div>
        <p className='mt-1 text-[10px] leading-snug text-[var(--ut-ink-dim)]'>
          Continue steps the camera along the amber path. Affinity / evidentiary labels sit on the
          edges; field reading is on the active record.
        </p>
        <div className='mt-2 flex items-center gap-1.5'>
          <button
            type='button'
            className='ut-mono rounded border border-[var(--ut-line)] px-2 py-0.5 text-[8px] text-[var(--ut-ink-dim)]'>
            Back
          </button>
          <button
            type='button'
            className='ut-mono rounded border border-emerald-400/45 bg-emerald-400/15 px-2 py-0.5 text-[8px] text-emerald-300'>
            Continue
          </button>
        </div>
      </div>

      <div
        aria-hidden
        className='pointer-events-none absolute z-[9] size-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/30'
        style={{left: '42%', top: '48%'}}
      />

      <p className='pointer-events-none absolute bottom-3 right-3 z-20 max-w-[200px] text-right ut-mono text-[7px] leading-relaxed text-[var(--ut-ink-faint)]'>
        Nav peeks from left edge · pin to keep · no intel sidebar
      </p>
    </CanvasChrome>
  )
}
