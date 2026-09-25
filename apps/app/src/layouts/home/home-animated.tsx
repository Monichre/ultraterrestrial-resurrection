'use client'

/**
 * HomeAnimated — production home experience.
 *
 * Two acts, orchestrated by useUltraterrestrialAnimation (ANIMATION_SEQUENCE.md):
 *   ACT 1 — autorun cinematic intro on a pinned stage.
 *   ACT 2 — scroll-scrubbed 3D journey: departure → lunar flyby → arrival CTA.
 *
 * The stage is sticky-pinned inside a 380vh track; the journey ScrollTrigger
 * scrubs DOM layers and drives the Earth/Moon camera rigs via journeyProgress.
 */

import {HeroCopy} from '@/layouts/home/HeroTypography'
import {useUltraterrestrialAnimation} from '@/hooks/useUltraterrestrialAnimation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {useEffect} from 'react'

const FluidShaderOrbs = dynamic(
  () => import('@/components/animated/FluidShaderOrbs').then((mod) => mod.FluidShaderOrbs),
  {ssr: false}
)

const CanvasCursor = dynamic(
  () => import('@/components/ui/canvas-cursor').then((mod) => mod.CanvasCursor),
  {ssr: false}
)

const ShootingStars = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.ShootingStars),
  {ssr: false}
)

const StarsBackground = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.StarsBackground),
  {ssr: false}
)

const Moon = dynamic(() => import('@/components/moon').then((mod) => mod.Moon), {
  ssr: false,
})

const Earth = dynamic(
  () =>
    import('@/components/earth/Earth')
      .then((mod) => mod.Earth)
      .catch(() => ({default: () => null})),
  {ssr: false, loading: () => null}
)

const Prometheus = dynamic(
  () => import('@/components/prometheus/Prometheus').then((mod) => mod.Prometheus),
  {ssr: false, loading: () => null}
)

const monoFont = {fontFamily: 'var(--font-jetbrains-mono), var(--font-martian-mono), monospace'}

export type HomeProps = {}

export const HomeAnimated: React.FC<HomeProps> = () => {
  const {
    refs,
    isReady,
    staticMode,
    showFluidOrbs,
    navVisible,
    journeyProgress,
    introProgress,
    introComplete,
    pauseAnimation,
    resumeAnimation,
    restartAnimation,
    skipToEnd,
  } = useUltraterrestrialAnimation()

  // Dev keyboard (ANIMATION_SEQUENCE.md)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault()
          pauseAnimation()
          break
        case 'Enter':
          e.preventDefault()
          resumeAnimation()
          break
        case 'r':
          e.preventDefault()
          restartAnimation()
          break
        case 's':
          e.preventDefault()
          skipToEnd()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [pauseAnimation, resumeAnimation, restartAnimation, skipToEnd])

  // Gate global MenuTrigger chrome until the nav phase
  useEffect(() => {
    document.documentElement.dataset.homeCinematic = navVisible ? 'ready' : 'pending'
    return () => {
      delete document.documentElement.dataset.homeCinematic
    }
  }, [navVisible])

  useEffect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-home-cinematic-css', 'true')
    style.textContent = `
      html[data-home-cinematic],
      html[data-home-cinematic] body,
      html[data-home-cinematic] main {
        background-color: #000 !important;
        background: #000 !important;
      }
      html[data-home-cinematic='pending'] a[aria-label='Ultraterrestrial home'],
      html[data-home-cinematic='pending'] button[aria-label='Open navigation menu'] {
        opacity: 0 !important;
        transform: translateY(-20px);
        pointer-events: none !important;
      }
      html[data-home-cinematic='ready'] a[aria-label='Ultraterrestrial home'],
      html[data-home-cinematic='ready'] button[aria-label='Open navigation menu'] {
        transition: opacity 1s cubic-bezier(0.23, 1, 0.32, 1),
          transform 1s cubic-bezier(0.23, 1, 0.32, 1);
      }

      /* Typography masks — motion is driven by the master GSAP timeline */
      .hero-char-mask { display: inline-block; overflow: hidden; vertical-align: top; }
      [data-wordmark-char] { display: inline-block; will-change: transform; }
      .hero-line-mask { display: block; overflow: hidden; }
      [data-tagline], [data-caption-line], [data-arrival-line] { display: inline-block; will-change: transform; }
      .hero-quote-line { will-change: transform; }

      /* Layers stay black until the master timeline is armed */
      [data-home-ready='false'] .hero-layer { opacity: 0; }

      /* Scroll cue bob */
      @keyframes hero-cue-drift {
        0%, 100% { transform: translateY(0); opacity: 0.9; }
        50% { transform: translateY(8px); opacity: 0.4; }
      }
      .hero-cue-line { animation: hero-cue-drift 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }

      /* Arrival CTA */
      .hero-cta {
        transition: border-color 0.3s ease, background-color 0.3s ease, letter-spacing 0.3s ease;
      }
      .hero-cta:hover {
        border-color: rgba(216, 232, 255, 0.9);
        background-color: rgba(164, 212, 255, 0.08);
        letter-spacing: 0.34em;
      }
    `
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [])

  const stage = (
    <div
      ref={refs.container}
      className={
        staticMode
          ? 'h-[100vh] w-[100vw] relative overflow-hidden bg-black'
          : 'sticky top-0 h-screen w-full overflow-hidden bg-black'
      }
      style={{backgroundColor: '#000'}}
      data-home-hero='cinematic'
      data-home-ready={isReady || staticMode ? 'true' : 'false'}>
      {/* Act 1 — Stars (z-[1]) */}
      <div
        ref={refs.stars}
        className='hero-layer stars-background absolute inset-0 z-[1] bg-black'
        style={{backgroundColor: '#000'}}>
        <StarsBackground className='bg-black' />
      </div>

      {/* Act 1 — Shooting stars (z-[2]) */}
      <div ref={refs.shootingStars} className='hero-layer shooting-stars absolute inset-0 z-[2]'>
        <ShootingStars />
      </div>

      {/* Act 1 — Fluid Shader Orbs (z-[3] when visible); transparent so it
          composites over the stars instead of masking them */}
      <div ref={refs.orbs} className='pointer-events-none absolute inset-0 z-[3]'>
        <FluidShaderOrbs isVisible={showFluidOrbs} />
      </div>

      {/* Act 1 — Prometheus (z-[5]); transparent layer over the starfield */}
      <div
        ref={refs.prometheus}
        className='hero-layer absolute inset-0 z-[5] pointer-events-none'>
        <Prometheus />
      </div>

      {/* Celestial — Moon (z-[10]); transparent canvas so Earth shows through */}
      <div ref={refs.moon} className='hero-layer absolute inset-0 h-full w-full z-[10]'>
        <Moon journeyRef={journeyProgress} />
      </div>

      {/* Celestial — Earth (z-[20]); transparent canvas so the Moon / Prometheus
          / orbs / stars beneath composite through. Push-in/recede via camera
          rig, not DOM scale. */}
      <div
        ref={refs.earth}
        className='hero-layer absolute inset-0 h-full w-full z-[20] pointer-events-none'>
        <Earth
          activeLocation={null}
          journeyRef={journeyProgress}
          introRef={introProgress}
          introActive={!staticMode && !introComplete}
          isIdle
        />
      </div>

      <div ref={refs.cursor}>
        <CanvasCursor />
      </div>

      {/* Act 1 — Hero copy (z-[40]); Act 2 departs through the same masks */}
      <div
        ref={refs.heroCopy}
        className='pointer-events-none h-[100vh] w-full absolute top-0 left-0 flex flex-col justify-center items-center z-40 overflow-hidden'
        style={{opacity: isReady || staticMode ? undefined : 0}}>
        <HeroCopy />
        {staticMode ? (
          <Link
            href='/research-canvas'
            className='hero-cta pointer-events-auto mt-10 inline-block border border-white/40 px-8 py-3 text-xs uppercase tracking-[0.3em] text-white/85'
            style={monoFont}>
            Enter the Research Canvas
          </Link>
        ) : null}
      </div>

      {/* Act 2 — Flyby caption (z-[45]) */}
      {!staticMode ? (
        <div
          ref={refs.flybyCaption}
          className='pointer-events-none absolute inset-0 z-[45] flex items-end justify-center pb-[14vh]'
          style={{opacity: 0}}>
          <div className='text-center'>
            <div className='hero-line-mask'>
              <span
                data-caption-line
                className='text-xs md:text-sm uppercase tracking-[0.45em] text-white/60'
                style={monoFont}>
                Lunar Proximity
              </span>
            </div>
            <div className='hero-line-mask mt-3'>
              <span
                data-caption-line
                className='text-2xl md:text-4xl uppercase tracking-[0.18em] text-white/90'
                style={{fontFamily: 'var(--font-monument), var(--font-neue-haas), sans-serif'}}>
                What the far side keeps
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Act 2 — Arrival block + CTA (z-[46]) */}
      {!staticMode ? (
        <div
          ref={refs.arrival}
          className='absolute inset-0 z-[46] flex flex-col items-center justify-center text-center px-6'
          style={{opacity: 0}}>
          <div className='hero-line-mask'>
            <span
              data-arrival-line
              className='text-xs md:text-sm uppercase tracking-[0.5em] text-white/55'
              style={monoFont}>
              The archive is open
            </span>
          </div>
          <div className='hero-line-mask mt-5 max-w-[560px]'>
            <span
              data-arrival-line
              className='text-xl md:text-2xl leading-8 text-white/85'
              style={{fontFamily: 'var(--font-neue-haas), sans-serif'}}>
              Documenting the past, present and future of the phenomenon.
            </span>
          </div>
          <div className='hero-line-mask mt-10'>
            <div data-arrival-line ref={refs.arrivalCta}>
              <Link
                href='/research-canvas'
                className='hero-cta inline-block border border-white/40 px-10 py-4 text-xs uppercase tracking-[0.3em] text-white/85'
                style={monoFont}>
                Enter the Research Canvas&nbsp;&nbsp;→
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Act 1 outro — scroll cue (z-[47]) */}
      {!staticMode ? (
        <div
          ref={refs.scrollCue}
          className='pointer-events-none absolute inset-x-0 bottom-8 z-[47] flex flex-col items-center gap-3'
          style={{opacity: 0}}>
          <span
            className='text-[10px] uppercase tracking-[0.5em] text-white/50'
            style={monoFont}>
            Scroll
          </span>
          <span className='hero-cue-line block h-8 w-px bg-gradient-to-b from-white/70 to-transparent' />
        </div>
      ) : null}

      {/* Navigation chrome target (z-[50]); animates global MenuTrigger via dataset */}
      <div
        ref={refs.nav}
        className='pointer-events-none fixed inset-x-0 top-0 z-[50] h-0'
        aria-hidden
      />
    </div>
  )

  if (staticMode) return stage

  return (
    <div ref={refs.track} className='relative h-[380vh] w-full bg-black'>
      {stage}
    </div>
  )
}
