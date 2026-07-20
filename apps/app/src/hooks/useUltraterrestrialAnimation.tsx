'use client'

import {useEffect, useRef, useState, useCallback, type MutableRefObject} from 'react'
import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'
import {CustomEase} from 'gsap/CustomEase'

/**
 * Master timeline for ANIMATION_SEQUENCE.md
 * Timings are authoritative — do not invent a shorter substitute sequence.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, useGSAP)
}

/** Exact phase anchors from ANIMATION_SEQUENCE.md */
export const CINEMATIC_TIMING = {
  FLASH_PULSES: {start: 0, duration: 0.1, repeat: 5},
  ORBS_SHOW: 0.5,
  ORBS_HIDE: 4.5,
  BIG_FLASH: 5.0,
  BIG_FLASH_FADE: 5.2,
  BIG_FLASH_SCALE: 3,
  STARS: 5.2,
  SHOOTING: 5.3,
  PROMETHEUS: 5.5,
  EARTH: 5.5,
  MOON_START: 8.0,
  MOON_MOVE: 8.0,
  MOON_DURATION: 3,
  EARTH_FLOAT: 9.0,
  TITLE: 8.5,
  QUOTE: 11.5,
  NAV: 13.0,
  READY_FALLBACK_MS: 6000,
} as const

type AnimationRefs = {
  container: MutableRefObject<HTMLDivElement | null>
  moon: MutableRefObject<HTMLDivElement | null>
  earth: MutableRefObject<HTMLDivElement | null>
  nav: MutableRefObject<HTMLDivElement | null>
  title: MutableRefObject<HTMLDivElement | null>
  stars: MutableRefObject<HTMLDivElement | null>
  shootingStars: MutableRefObject<HTMLDivElement | null>
  cursor: MutableRefObject<HTMLDivElement | null>
  orbs: MutableRefObject<HTMLDivElement | null>
  prometheus: MutableRefObject<HTMLDivElement | null>
}

const getGlobalNavChrome = () => {
  if (typeof document === 'undefined') return []
  return [
    document.querySelector('a[aria-label="Ultraterrestrial home"]'),
    document.querySelector('button[aria-label="Open navigation menu"]'),
  ].filter(Boolean) as HTMLElement[]
}

export const useUltraterrestrialAnimation = () => {
  const [isReady, setIsReady] = useState(false)
  const [showFluidOrbs, setShowFluidOrbs] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)
  const [navVisible, setNavVisible] = useState(false)
  const [forcedReveal, setForcedReveal] = useState(false)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const hasRevealedRef = useRef(false)

  const container = useRef<HTMLDivElement>(null)
  const moon = useRef<HTMLDivElement>(null)
  const earth = useRef<HTMLDivElement>(null)
  const nav = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLDivElement>(null)
  const stars = useRef<HTMLDivElement>(null)
  const shootingStars = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const orbs = useRef<HTMLDivElement>(null)
  const prometheus = useRef<HTMLDivElement>(null)

  const refs: AnimationRefs = {
    container,
    moon,
    earth,
    nav,
    title,
    stars,
    shootingStars,
    cursor,
    orbs,
    prometheus,
  }

  const revealSceneImmediately = useCallback(() => {
    if (hasRevealedRef.current) return
    hasRevealedRef.current = true

    setShowFluidOrbs(false)
    setTitleVisible(true)
    setQuoteVisible(true)
    setNavVisible(true)

    const visibleTargets = [
      stars.current,
      shootingStars.current,
      prometheus.current,
      moon.current,
      earth.current,
      title.current,
      ...getGlobalNavChrome(),
    ]

    visibleTargets.forEach((target) => {
      if (!target) return
      gsap.set(target, {
        opacity: 1,
        visibility: 'visible',
        filter: 'none',
        scale: 1,
        x: 0,
        y: 0,
        clearProps: 'transform,filter',
      })
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      const matches = mediaQuery.matches
      setShouldReduceMotion(matches)
      if (matches) {
        setForcedReveal(true)
        revealSceneImmediately()
      }
    }

    updatePreference()
    mediaQuery.addEventListener?.('change', updatePreference)
    return () => mediaQuery.removeEventListener?.('change', updatePreference)
  }, [revealSceneImmediately])

  useEffect(() => {
    if (shouldReduceMotion || forcedReveal) return

    const checkElements = window.setInterval(() => {
      const earthCanvas = document.querySelector('#earth-canvas')
      const moonCanvas = document.querySelector('#moon-canvas')
      const prometheusEl = document.querySelector('.prometheus-container')

      // Prefer all three; start once Earth is up so the sequence isn't blocked forever
      if (earthCanvas && (moonCanvas || prometheusEl)) {
        window.clearInterval(checkElements)
        hasRevealedRef.current = false
        setIsReady(true)
      }
    }, 120)

    const fallbackTimer = window.setTimeout(() => {
      window.clearInterval(checkElements)
      setForcedReveal(true)
      revealSceneImmediately()
    }, CINEMATIC_TIMING.READY_FALLBACK_MS)

    return () => {
      window.clearInterval(checkElements)
      window.clearTimeout(fallbackTimer)
    }
  }, [revealSceneImmediately, shouldReduceMotion, forcedReveal])

  useGSAP(
    () => {
      if (!isReady || forcedReveal || shouldReduceMotion) return

      CustomEase.create(
        'cosmic',
        'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1'
      )
      CustomEase.create(
        'dimensional',
        'M0,0 C0.11,0.494 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1'
      )

      // Phase 0 — hide layers
      if (refs.moon.current) {
        gsap.set(refs.moon.current, {
          opacity: 0,
          scale: 0.3,
          filter: 'blur(50px)',
          x: '-50vw',
          y: '-50vh',
          transformOrigin: 'center center',
          visibility: 'hidden',
        })
      }

      if (refs.earth.current) {
        gsap.set(refs.earth.current, {opacity: 0, visibility: 'visible'})
      }

      if (refs.stars.current) gsap.set(refs.stars.current, {opacity: 0, visibility: 'visible'})
      if (refs.shootingStars.current) {
        gsap.set(refs.shootingStars.current, {opacity: 0, visibility: 'visible'})
      }
      if (refs.title.current) {
        gsap.set(refs.title.current, {opacity: 0, scale: 0.96, filter: 'blur(20px)'})
      }
      if (refs.prometheus.current) gsap.set(refs.prometheus.current, {opacity: 0})

      const navChrome = getGlobalNavChrome()
      if (navChrome.length) {
        gsap.set(navChrome, {opacity: 0, y: -20})
      }

      // Phase 0 — flash overlay
      const flashOverlay = document.createElement('div')
      flashOverlay.className = 'flash-overlay'
      flashOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at center, rgba(173,240,221,0.8) 0%, transparent 70%);
        opacity: 0;
        pointer-events: none;
        mix-blend-mode: screen;
        z-index: 9999;
      `
      document.body.appendChild(flashOverlay)

      const tl = gsap.timeline({
        defaults: {ease: 'power2.inOut'},
      })
      animationRef.current = tl

      // Phase 1: Quick flashes (0–2s)
      tl.to(flashOverlay, {
        opacity: 0.3,
        duration: CINEMATIC_TIMING.FLASH_PULSES.duration,
        repeat: CINEMATIC_TIMING.FLASH_PULSES.repeat,
        yoyo: true,
        ease: 'power4.inOut',
      }).set(flashOverlay, {opacity: 0})

      // Phase 2: Fluid shader orbs (0.5–4.5s)
      tl.call(() => setShowFluidOrbs(true), [], CINEMATIC_TIMING.ORBS_SHOW)
      tl.call(() => setShowFluidOrbs(false), [], CINEMATIC_TIMING.ORBS_HIDE)

      // Phase 3: Big flash transition (5–6s), scale 3x
      tl.to(
        flashOverlay,
        {opacity: 1, duration: 0.2, ease: 'power4.out'},
        CINEMATIC_TIMING.BIG_FLASH
      ).to(
        flashOverlay,
        {
          opacity: 0,
          scale: CINEMATIC_TIMING.BIG_FLASH_SCALE,
          duration: 1.5,
          ease: 'power2.out',
        },
        CINEMATIC_TIMING.BIG_FLASH_FADE
      )

      // Phase 4: Background elements
      if (refs.stars.current) {
        tl.to(
          refs.stars.current,
          {opacity: 1, duration: 1.2, ease: 'power2.inOut'},
          CINEMATIC_TIMING.STARS
        )
      }
      if (refs.shootingStars.current) {
        tl.to(
          refs.shootingStars.current,
          {opacity: 1, duration: 1, ease: 'power2.out'},
          CINEMATIC_TIMING.SHOOTING
        )
      }

      // Phase 5: Celestial bodies
      if (refs.prometheus.current) {
        tl.to(
          refs.prometheus.current,
          {opacity: 0.85, duration: 3, ease: 'power1.inOut'},
          CINEMATIC_TIMING.PROMETHEUS
        )
      }

      if (refs.earth.current) {
        tl.to(
          refs.earth.current,
          {opacity: 1, duration: 2, ease: 'power2.out'},
          CINEMATIC_TIMING.EARTH
        )
      }

      if (refs.moon.current) {
        tl.set(refs.moon.current, {visibility: 'visible'}, CINEMATIC_TIMING.MOON_START).to(
          refs.moon.current,
          {
            opacity: 1,
            x: '25vw',
            y: '-15vh',
            scale: 0.6,
            filter: 'blur(0px)',
            duration: CINEMATIC_TIMING.MOON_DURATION,
            ease: 'power2.inOut',
          },
          CINEMATIC_TIMING.MOON_MOVE
        )
      }

      if (refs.earth.current) {
        tl.to(
          refs.earth.current,
          {y: '+=10', duration: 4, repeat: -1, yoyo: true, ease: 'power1.inOut'},
          CINEMATIC_TIMING.EARTH_FLOAT
        )
      }

      // Phase 6: UI — title 8.5s, quote 11.5s, nav 13s
      tl.call(() => setTitleVisible(true), [], CINEMATIC_TIMING.TITLE)
      if (refs.title.current) {
        tl.to(
          refs.title.current,
          {opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out'},
          CINEMATIC_TIMING.TITLE
        )
      }

      tl.call(() => setQuoteVisible(true), [], CINEMATIC_TIMING.QUOTE)

      tl.call(() => setNavVisible(true), [], CINEMATIC_TIMING.NAV)
      if (navChrome.length) {
        tl.to(
          navChrome,
          {opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.05},
          CINEMATIC_TIMING.NAV
        )
      }

      return () => {
        tl.kill()
        flashOverlay.remove()
      }
    },
    {dependencies: [isReady, forcedReveal, shouldReduceMotion], scope: refs.container}
  )

  const pauseAnimation = useCallback(() => {
    animationRef.current?.pause()
  }, [])

  const resumeAnimation = useCallback(() => {
    animationRef.current?.resume()
  }, [])

  const restartAnimation = useCallback(() => {
    hasRevealedRef.current = false
    setTitleVisible(false)
    setQuoteVisible(false)
    setNavVisible(false)
    setShowFluidOrbs(false)
    if (!animationRef.current) {
      revealSceneImmediately()
      return
    }
    animationRef.current.restart()
  }, [revealSceneImmediately])

  const skipToEnd = useCallback(() => {
    if (!animationRef.current) {
      revealSceneImmediately()
      return
    }
    animationRef.current.progress(1)
    setShowFluidOrbs(false)
    setTitleVisible(true)
    setQuoteVisible(true)
    setNavVisible(true)
  }, [revealSceneImmediately])

  return {
    pauseAnimation,
    resumeAnimation,
    restartAnimation,
    skipToEnd,
    isReady,
    showFluidOrbs,
    titleVisible,
    quoteVisible,
    navVisible,
    refs,
  }
}
