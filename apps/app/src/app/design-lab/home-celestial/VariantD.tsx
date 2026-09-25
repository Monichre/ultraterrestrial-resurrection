'use client'

import {useState} from 'react'
import {CelestialStage} from './CelestialStage'

/** Motion axis — Earth + moon-2 with scrubbed flyby (no DOM scale) */
export function VariantD() {
  const [scrub, setScrub] = useState(0.35)

  return (
    <div className='space-y-3' data-testid='variant-d-shell'>
      <CelestialStage
        primary='earth'
        secondary='moon2'
        framing='cinematic-full'
        light='crescent'
        scrub={scrub}
        caption={`D · cinematic flyby scrub ${(scrub * 100).toFixed(0)}% · mesh/camera only`}
      />
      <label className='block rounded border border-[var(--ut-line)] bg-[var(--ut-surface)] px-4 py-3'>
        <span className='ut-mono text-[9px] text-[var(--ut-ink-faint)]'>Journey scrub preview</span>
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={scrub}
          onChange={(e) => setScrub(Number(e.target.value))}
          className='mt-2 w-full accent-emerald-400'
          data-testid='journey-scrub'
        />
        <p className='ut-mono mt-2 text-[9px] text-[var(--ut-ink-faint)]'>
          Proves Act-2 flyby without CSS blur/scale on the WebGL buffer.
        </p>
      </label>
    </div>
  )
}
