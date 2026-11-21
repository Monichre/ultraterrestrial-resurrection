'use client'

import {FeedbackOverlay} from './FeedbackOverlay'
import {VariantA} from './VariantA'
import {VariantB} from './VariantB'
import {VariantC} from './VariantC'
import {VariantD} from './VariantD'
import {VariantE} from './VariantE'

const VARIANTS = [
  {
    id: 'A',
    title: 'Earth + moon-2 (baseline upgrade)',
    why: 'Production shoulder framing + prod Earth PBR, swapped to high-res moon-2. Sharp crescent without DOM scale/blur.',
    Component: VariantA,
    elite: false,
  },
  {
    id: 'B',
    title: 'Mars + moon-2 (elite)',
    why: 'Same grammar as A; Mars as primary body with ochre crescent. Disclosure under a different sky.',
    Component: VariantB,
    elite: true,
  },
  {
    id: 'C',
    title: 'Neptune + moon-2 (elite)',
    why: 'Ice-giant primary + cold rim light. Deep-archive chill vs Mars heat.',
    Component: VariantC,
    elite: true,
  },
  {
    id: 'D',
    title: 'Cinematic flyby scrub',
    why: 'Motion axis — proves Act-2 moon flyby via mesh/camera only (scrubber).',
    Component: VariantD,
    elite: false,
  },
  {
    id: 'E',
    title: 'Mars + Neptune ghost',
    why: 'Expressive dual-body constellation. Push brand; may be too busy for landing still.',
    Component: VariantE,
    elite: false,
  },
] as const

export default function HomeCelestialDesignLabPage() {
  return (
    <div className='dark min-h-screen bg-[var(--ut-void)] text-[var(--ut-paper)]'>
      <header className='border-b border-[var(--ut-line)] px-6 py-5'>
        <p className='ut-mono text-[9px] text-[var(--ut-ink-faint)]'>
          Design lab · home celestial hero · ultraterrestrial.app SoT
        </p>
        <h1 className='ut-typewriter mt-1 text-xl text-[var(--ut-paper)]'>HomeCelestialHero</h1>
        <p className='mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--ut-ink-dim)]'>
          Improve the existing Earth/Moon hero, then pick between two elite planetary variations
          (Mars, Neptune) using new GLTF packs. Target wiring:{' '}
          <code className='ut-mono text-[11px] text-[var(--ut-paper)]'>
            layouts/home/home-animated.tsx
          </code>
          . Hard constraint: never DOM-scale or CSS-blur WebGL canvases.
        </p>
        <ul className='mt-3 flex flex-wrap gap-2 text-[11px] text-[var(--ut-ink-faint)]'>
          <li className='rounded border border-emerald-400/35 px-2 py-0.5 text-emerald-300/90'>
            elite: B Mars · C Neptune
          </li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>moon-2 pack</li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>prod Earth stack</li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>
            ACES + anisotropy 16
          </li>
        </ul>
      </header>

      <main className='space-y-12 px-6 py-8'>
        <div className='grid grid-cols-1 gap-10 xl:grid-cols-2'>
          {VARIANTS.map(({id, title, why, Component, elite}) => (
            <section key={id} data-variant={id} className='space-y-3'>
              <div className='flex flex-wrap items-baseline gap-3'>
                <span
                  className={`ut-mono text-[11px] ${
                    elite ? 'text-amber-300/90' : 'text-emerald-300/90'
                  }`}>
                  Variant {id}
                </span>
                <h2 className='text-[15px] font-medium text-[var(--ut-paper)]'>{title}</h2>
                {elite ? <span className='ut-mono text-[8px] text-amber-300/70'>elite</span> : null}
              </div>
              <p className='max-w-3xl text-[12px] leading-relaxed text-[var(--ut-ink-dim)]'>
                <span className='ut-mono text-[8px] text-[var(--ut-ink-faint)]'>Why · </span>
                {why}
              </p>
              <Component />
            </section>
          ))}
        </div>
      </main>

      <FeedbackOverlay targetName='HomeCelestialHero' />
    </div>
  )
}
