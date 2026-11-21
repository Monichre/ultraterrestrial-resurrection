'use client'

import {CanvasChrome, Stamp, TourMeta} from './CanvasChrome'
import {INTELLIGENCE, TOUR} from './fixtures'

/** C — Density: spacious progressive disclosure — one layer visible at a time. */
export function VariantC() {
  return (
    <CanvasChrome dimInactive showTourPath={false}>
      <div
        aria-hidden
        className='pointer-events-none absolute z-[5] size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full'
        style={{
          left: '42%',
          top: '48%',
          background: 'radial-gradient(circle, oklch(0.72 0.12 160 / 0.18) 0%, transparent 70%)',
        }}
      />

      <div
        data-testid='node-caption'
        className='absolute z-30 w-[240px] -translate-x-1/2 border border-[var(--ut-line)] bg-[var(--ut-surface)]/92 px-3 py-2.5 backdrop-blur-md'
        style={{
          left: '42%',
          top: '68%',
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
        }}>
        <div className='flex items-center gap-2'>
          <Stamp>{TOUR.year}</Stamp>
          <TourMeta tour={TOUR} />
        </div>
        <p className='ut-typewriter mt-1.5 text-[14px] text-[var(--ut-paper)]'>{TOUR.stopTitle}</p>
        <p className='mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>
          {TOUR.narrative}
        </p>
        <button
          type='button'
          className='ut-mono mt-2 text-[8px] text-emerald-300/90 underline-offset-2 hover:underline'>
          Reveal intelligence →
        </button>
      </div>

      <div className='absolute right-4 bottom-4 z-20 opacity-50'>
        <Stamp tone='violet'>Intelligence · folded</Stamp>
        <p className='ut-mono mt-1 max-w-[160px] text-[8px] text-[var(--ut-ink-faint)]'>
          {INTELLIGENCE.affinity}
        </p>
      </div>
    </CanvasChrome>
  )
}
