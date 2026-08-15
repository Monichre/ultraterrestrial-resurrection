'use client'

import {FeedbackOverlay} from '../FeedbackOverlay'
import {CinematicStage} from './CinematicStage'

export default function CinematicZoomLabPage() {
  return (
    <div className='dark min-h-screen bg-[var(--ut-void)] text-[var(--ut-paper)]'>
      <header className='border-b border-[var(--ut-line)] px-6 py-5'>
        <p className='ut-mono text-[9px] text-[var(--ut-ink-faint)]'>
          Design lab · cinematic zoom · ported from Makio64/threejs-cinematic-world-zoom (MIT)
        </p>
        <h1 className='ut-typewriter mt-1 text-xl text-[var(--ut-paper)]'>HomeCinematicZoom</h1>
        <p className='mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--ut-ink-dim)]'>
          The opening fall-from-orbit for the home hero. Distance is interpolated{' '}
          <strong className='text-[var(--ut-paper)]'>geometrically</strong> (constant rate of change
          of log-distance), every channel — distance, azimuth, pitch, FOV, roll — runs on its own
          curve, and the lens does real work. Pick the shot you want, then I&apos;ll wire it into{' '}
          <code className='ut-mono text-[11px] text-[var(--ut-paper)]'>home-animated.tsx</code>.
        </p>
        <ul className='mt-3 flex flex-wrap gap-2 text-[11px] text-[var(--ut-ink-faint)]'>
          <li className='rounded border border-emerald-400/35 px-2 py-0.5 text-emerald-300/90'>
            log-distance zoom
          </li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>per-channel easing</li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>animated FOV</li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>bank / roll</li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>no DOM scale</li>
        </ul>
      </header>

      <main className='px-6 py-8'>
        <section data-variant='CINEMATIC' className='mx-auto max-w-4xl space-y-3'>
          <div className='flex items-baseline gap-3'>
            <span className='ut-mono text-[11px] text-emerald-300/90'>Cinematic rig</span>
            <h2 className='text-[15px] font-medium text-[var(--ut-paper)]'>
              Play a shot, or scrub it like Act 2
            </h2>
          </div>
          <CinematicStage />
          <p className='ut-mono text-[9px] leading-relaxed text-[var(--ut-ink-faint)]'>
            Descent = long steady arrival · Dive = hang then plunge · Orbit = drop then circle ·
            Flyby = overshoot &amp; bank back · Hyperzoom = the lens does everything. Tune Far/Near
            for how dramatic the fall reads.
          </p>
        </section>
      </main>

      <FeedbackOverlay targetName='HomeCinematicZoom' />
    </div>
  )
}
