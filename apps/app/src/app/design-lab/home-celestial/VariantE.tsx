'use client'

import {CelestialStage} from './CelestialStage'

/** Expressive — Mars primary with Neptune ghost (dual-body constellation) */
export function VariantE() {
  return (
    <div className='space-y-3' data-testid='variant-e-shell'>
      <CelestialStage
        primary='mars'
        secondary='neptune-ghost'
        framing='dual-ghost'
        light='ochre'
        caption='E · Mars + Neptune ghost · dual-body constellation · max expressive'
      />
      <div className='rounded border border-[var(--ut-line)] bg-[var(--ut-surface)] px-4 py-3'>
        <p className='ut-typewriter text-[17px] tracking-[0.18em] text-[var(--ut-paper)]'>
          ULTRATERRESTRIAL
        </p>
        <p className='mt-1 text-[12px] text-[var(--ut-ink-dim)]'>
          Parallel skies — one claim, two atmospheres
        </p>
        <p className='ut-mono mt-2 text-[9px] text-[var(--ut-ink-faint)]'>
          Pushes brand toward multi-body archive; may be too busy for the landing still.
        </p>
      </div>
    </div>
  )
}
