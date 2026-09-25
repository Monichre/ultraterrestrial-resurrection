'use client'

import {CelestialStage} from './CelestialStage'

/** Baseline upgrade — Earth + moon-2, production shoulder framing */
export function VariantA() {
  return (
    <div className='space-y-3' data-testid='variant-a-shell'>
      <CelestialStage
        primary='earth'
        secondary='moon2'
        framing='prod-shoulder'
        light='crescent'
        caption='A · Earth (prod PBR) + moon-2 · shoulder pocket · hard crescent'
      />
      <HeroChrome
        line='Archive of the unexplained'
        note='Keeps production composition; upgrades moon fidelity + render sharpness.'
      />
    </div>
  )
}

function HeroChrome({line, note}: {line: string; note: string}) {
  return (
    <div className='rounded border border-[var(--ut-line)] bg-[var(--ut-surface)] px-4 py-3'>
      <p className='ut-typewriter text-[17px] tracking-[0.18em] text-[var(--ut-paper)]'>
        ULTRATERRESTRIAL
      </p>
      <p className='mt-1 text-[12px] text-[var(--ut-ink-dim)]'>{line}</p>
      <p className='ut-mono mt-2 text-[9px] text-[var(--ut-ink-faint)]'>{note}</p>
    </div>
  )
}
