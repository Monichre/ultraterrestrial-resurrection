'use client'

/**
 * HomeAnimated — production home hero.
 * Implements ANIMATION_SEQUENCE.md via useUltraterrestrialAnimation.
 * Layers: flash → fluid orbs → stars/shooting → Prometheus → Earth → Moon → title → quote → nav
 */

import {LovecraftQuote} from '@/layouts/home/LovecraftQuote'
import {TitleAlt} from '@/layouts/home/TitleAlt'
import {useUltraterrestrialAnimation} from '@/hooks/useUltraterrestrialAnimation'
import {AnimatePresence} from 'framer-motion'
import dynamic from 'next/dynamic'
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

export type HomeProps = {}

export const HomeAnimated: React.FC<HomeProps> = () => {
  const {
    refs,
    isReady,
    showFluidOrbs,
    titleVisible,
    quoteVisible,
    navVisible,
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

  // Gate global MenuTrigger chrome until Phase 6 nav (13s)
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
    `
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [])

  return (
    <div
      ref={refs.container}
      className='h-[100vh] w-[100vw] relative overflow-hidden bg-black'
      style={{backgroundColor: '#000'}}
      data-home-hero='cinematic'
      data-home-ready={isReady ? 'true' : 'false'}>
      {/* Phase 2 — Fluid Shader Orbs (z-[3] when visible) */}
      <div
        ref={refs.orbs}
        className='pointer-events-none absolute inset-0 z-[3] bg-black'
        style={{backgroundColor: '#000'}}>
        <FluidShaderOrbs isVisible={showFluidOrbs} />
      </div>

      {/* Phase 5 — Prometheus (z-[5]) */}
      <div
        ref={refs.prometheus}
        className='absolute inset-0 z-[5] pointer-events-none bg-black'
        style={{backgroundColor: '#000'}}>
        <Prometheus />
      </div>

      {/* Phase 5 — Moon (z-[10]) */}
      <div
        ref={refs.moon}
        className='absolute top-0 left-0 h-[100vh] w-[100vw] z-[10] bg-black'
        style={{backgroundColor: '#000'}}>
        <Moon />
      </div>

      {/* Phase 5 — Earth (z-[20]) */}
      <div
        ref={refs.earth}
        className='absolute top-0 left-0 right-0 bottom-0 h-full w-full z-[20] flex flex-col justify-center items-center bg-black'
        style={{backgroundColor: '#000'}}>
        <Earth activeLocation={null} />
      </div>

      <div ref={refs.cursor}>
        <CanvasCursor />
      </div>

      {/* Phase 6 — Title + Quote (z-[40]) */}
      <div
        ref={refs.title}
        className='astronaut pointer-events-none h-[100vh] w-full absolute top-0 left-0 flex flex-col justify-center align-middle overflow-hidden items-center z-40'>
        <AnimatePresence mode='wait'>
          {titleVisible ? (
            <div key='title-block' className='flex flex-col items-center'>
              <TitleAlt trigger={titleVisible} scrambleDuration={2500} />
              {quoteVisible ? <LovecraftQuote trigger={quoteVisible} /> : null}
            </div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Phase 6 — Navigation chrome target (z-[50]); animates global MenuTrigger via dataset */}
      <div
        ref={refs.nav}
        className='pointer-events-none fixed inset-x-0 top-0 z-[50] h-0'
        aria-hidden
      />

      {/* Phase 4 — Shooting stars (z-[2]) */}
      <div ref={refs.shootingStars} className='shooting-stars absolute inset-0 z-[2]'>
        <ShootingStars />
      </div>

      {/* Phase 4 — Stars (z-[1]) */}
      <div
        ref={refs.stars}
        className='stars-background absolute inset-0 z-[1] bg-black'
        style={{backgroundColor: '#000'}}>
        <StarsBackground className='bg-black' />
      </div>
    </div>
  )
}
