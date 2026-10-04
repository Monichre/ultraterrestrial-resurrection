'use client'

import {CelestialStage} from './CelestialStage'

/** Elite 1 — Mars primary + moon-2 (ochre archival crescent) */
export function VariantB() {
  return (
    <div className='space-y-3' data-testid='variant-b-shell'>
      <CelestialStage
        primary='mars'
        secondary='moon2'
        framing='prod-shoulder'
        light='ochre'
        caption='B · Mars PBR + moon-2 · ochre crescent · disclosure-as-red-planet'
      />
      <div className='rounded border border-[var(--ut-line)] bg-[var(--ut-surface)] px-4 py-3'>
        <p className='ut-typewriter text-[17px] tracking-[0.18em] text-[var(--ut-paper)]'>
          ULTRATERRESTRIAL
        </p>
        <p className='mt-1 text-[12px] text-[var(--ut-ink-dim)]'>
          Evidence under a different sky
        </p>
        <p className='ut-mono mt-2 text-[9px] text-[var(--ut-ink-faint)]'>
          Elite variation — swaps Earth for Mars while preserving shoulder-moon grammar.
        </p>
      </div>
    </div>
  )
}
