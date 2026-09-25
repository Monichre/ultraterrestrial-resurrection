'use client'

import {CelestialStage} from './CelestialStage'

/** Elite 2 — Neptune primary + moon-2 (cold rim light) */
export function VariantC() {
  return (
    <div className='space-y-3' data-testid='variant-c-shell'>
      <CelestialStage
        primary='neptune'
        secondary='moon2'
        framing='prod-shoulder'
        light='cold'
        caption='C · Neptune ice giant + moon-2 · cold rim · deep-archive atmosphere'
      />
      <div className='rounded border border-[var(--ut-line)] bg-[var(--ut-surface)] px-4 py-3'>
        <p className='ut-typewriter text-[17px] tracking-[0.18em] text-[var(--ut-paper)]'>
          ULTRATERRESTRIAL
        </p>
        <p className='mt-1 text-[12px] text-[var(--ut-ink-dim)]'>
          Cold orbit over classified weather
        </p>
        <p className='ut-mono mt-2 text-[9px] text-[var(--ut-ink-faint)]'>
          Elite variation — Neptune as primary body; institutional chill vs Mars heat.
        </p>
      </div>
    </div>
  )
}
