'use client'

import {useEffect, useRef, useState, useCallback, type MutableRefObject} from 'react'
import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'
import {CustomEase} from 'gsap/CustomEase'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import type {JourneyProgressRef} from '@/lib/animations/scroll-journey'

/**
 * Master orchestration for the home experience — two acts:
 *
 *   ACT 1 — INTRO (autorun timeline): flash → orbs → big flash → stars →
 *           prometheus → earth → moon orbit → wordmark → tagline → quote →
 *           author → nav → scroll cue. Scroll stays locked until it resolves;
 *           any wheel/touch intent fast-forwards it.
 *
 *   ACT 2 — JOURNEY (scrubbed ScrollTrigger): hero copy exits, camera pushes
 *           toward Earth, the Moon sweeps across frame for a flyby, then the
 *           arrival block + CTA resolves the journey. Drives both the DOM
 *           layers and the R3F camera rigs via `journeyProgress`.
 *
 * Timings are authoritative — keep ANIMATION_SEQUENCE.md in sync.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, ScrollTrigger, useGSAP)
}

/** Exact phase anchors from ANIMATION_SEQUENCE.md (Act 1, seconds) */
export const CINEMATIC_TIMING = {
  FLASH_PULSES: {start: 0, duration: 0.09, repeat: 5},
  ORBS_SHOW: 0.4,
  ORBS_HIDE: 3.6,
  BIG_FLASH: 3.8,
  BIG_FLASH_FADE: 4.0,
  BIG_FLASH_SCALE: 3,
  STARS: 4.0,
  SHOOTING: 4.1,
  PROMETHEUS: 4.2,
  EARTH: 4.2,
  MOON_START: 5.4,
  MOON_DURATION: 2.4,
  TITLE: 5.8,
  TAGLINE: 6.9,
  QUOTE: 7.1,
  AUTHOR: 8.9,
  NAV: 9.2,
  SCROLL_CUE: 9.4,
  READY_FALLBACK_MS: 6000,
} as const

/** Act 2 beat anchors (journey timeline units — scrubbed, total 10) */
export const JOURNEY_TIMING = {
  DEPART: 0,
  FLYBY: 2.2,
  FLYBY_CAPTION_IN: 2.8,
  FLYBY_CAPTION_OUT: 5.4,
  ARRIVAL: 6.2,
  ARRIVAL_KICKER: 6.9,
  ARRIVAL_LINE: 7.5,
  ARRIVAL_CTA: 8.2,
  END: 10,
} as const

type AnimationRefs = {
  track: MutableRefObject<HTMLDivElement | null>
  container: MutableRefObject<HTMLDivElement | null>
  moon: MutableRefObject<HTMLDivElement | null>
  earth: MutableRefObject<HTMLDivElement | null>
  nav: MutableRefObject<HTMLDivElement | null>
  heroCopy: MutableRefObject<HTMLDivElement | null>
  stars: MutableRefObject<HTMLDivElement | null>
  shootingStars: MutableRefObject<HTMLDivElement | null>
  cursor: MutableRefObject<HTMLDivElement | null>
  orbs: MutableRefObject<HTMLDivElement | null>
  prometheus: MutableRefObject<HTMLDivElement | null>
  flybyCaption: MutableRefObject<HTMLDivElement | null>
  arrival: MutableRefObject<HTMLDivElement | null>
  arrivalCta: MutableRefObject<HTMLDivElement | null>
  scrollCue: MutableRefObject<HTMLDivElement | null>
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
  const [introComplete, setIntroComplete] = useState(false)
  const [forcedReveal, setForcedReveal] = useState(false)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const hasRevealedRef = useRef(false)

  const track = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const moon = useRef<HTMLDivElement>(null)
  const earth = useRef<HTMLDivElement>(null)
  const nav = useRef<HTMLDivElement>(null)
  const heroCopy = useRef<HTMLDivElement>(null)
  const stars = useRef<HTMLDivElement>(null)
  const shootingStars = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const orbs = useRef<HTMLDivElement>(null)
  const prometheus = useRef<HTMLDivElement>(null)
  const flybyCaption = useRef<HTMLDivElement>(null)
  const arrival = useRef<HTMLDivElement>(null)
  const arrivalCta = useRef<HTMLDivElement>(null)
  const scrollCue = useRef<HTMLDivElement>(null)

  /** Written by the journey ScrollTrigger, read by the R3F camera rigs */
  const journeyProgress = useRef(0)

  const refs: AnimationRefs = {
    track,
    container,
    moon,
    earth,
    nav,
    heroCopy,
    stars,
    shootingStars,
    cursor,
    orbs,
    prometheus,
    flybyCaption,
    arrival,
    arrivalCta,
    scrollCue,
  }

  const staticMode = shouldReduceMotion || forcedReveal

  // Dev introspection — sampled by e2e/debug tooling
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      ;(window as unknown as Record<string, unknown>).__homeAnimState = {
        t: Math.round(performance.now()),
        isReady,
        staticMode,
        shouldReduceMotion,
        forcedReveal,
        introComplete,
      }
    }
  }, [isReady, staticMode, shouldReduceMotion, forcedReveal, introComplete])

  const revealSceneImmediately = useCallback(() => {
    if (hasRevealedRef.current) return
    hasRevealedRef.current = true

    setShowFluidOrbs(false)
    setTitleVisible(true)
    setQuoteVisible(true)
    setNavVisible(true)
    setIntroComplete(true)

    const visibleTargets = [
      stars.current,
      shootingStars.current,
      prometheus.current,
      moon.current,
      earth.current,
      heroCopy.current,
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

    if (moon.current) {
      gsap.set(moon.current, {x: '25vw', y: '-15vh', scale: 0.6, opacity: 1})
    }
    if (prometheus.current) gsap.set(prometheus.current, {opacity: 0.85})
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
    if (staticMode || isReady) return

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
  }, [revealSceneImmediately, staticMode, isReady])

  // Act 1 scroll lock — intro owns the viewport until it resolves.
  useEffect(() => {
    if (!isReady || staticMode) return

    const body = document.body
    const previousOverflow = body.style.overflow
    const previousRestoration =
      'scrollRestoration' in window.history ? window.history.scrollRestoration : undefined

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousOverflow
      if (previousRestoration) window.history.scrollRestoration = previousRestoration
    }
  }, [isReady, staticMode])

  useGSAP(
    () => {
      if (!isReady || staticMode) return

      CustomEase.create(
        'cosmic',
        'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1'
      )
      CustomEase.create(
        'dimensional',
        'M0,0 C0.11,0.494 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1'
      )

      const q = gsap.utils.selector(refs.container)

      // ---- Typography segmentation --------------------------------------
      const wordmarkChars = q('[data-wordmark-char]') as HTMLElement[]
      const tagline = q('[data-tagline]') as HTMLElement[]
      const authorEl = q('[data-quote-author]') as HTMLElement[]
      const captionLines = q('[data-caption-line]') as HTMLElement[]
      const arrivalLines = q('[data-arrival-line]') as HTMLElement[]
      const quoteEl = q('[data-quote]')[0] as HTMLElement | undefined

      let quoteSplit: SplitType | null = null
      let quoteLines: HTMLElement[] = []
      if (quoteEl) {
        quoteSplit = new SplitType(quoteEl, {types: 'lines', lineClass: 'hero-quote-line'})
        quoteLines = (quoteSplit.lines ?? []) as HTMLElement[]
        quoteLines.forEach((line) => {
          const mask = document.createElement('div')
          mask.className = 'hero-line-mask'
          line.parentNode?.insertBefore(mask, line)
          mask.appendChild(line)
        })
      }

      // ---- Phase 0: initial states --------------------------------------
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
      if (refs.earth.current) gsap.set(refs.earth.current, {opacity: 0, visibility: 'visible'})
      if (refs.stars.current) gsap.set(refs.stars.current, {opacity: 0, visibility: 'visible'})
      if (refs.shootingStars.current) {
        gsap.set(refs.shootingStars.current, {opacity: 0, visibility: 'visible'})
      }
      if (refs.prometheus.current) gsap.set(refs.prometheus.current, {opacity: 0})
      if (refs.heroCopy.current) gsap.set(refs.heroCopy.current, {opacity: 0})

      if (wordmarkChars.length) {
        gsap.set(wordmarkChars, {yPercent: 118, rotateX: -42, transformPerspective: 600})
      }
      if (tagline.length) gsap.set(tagline, {yPercent: 120, filter: 'blur(8px)'})
      if (quoteLines.length) gsap.set(quoteLines, {yPercent: 112, filter: 'blur(6px)'})
      if (authorEl.length) gsap.set(authorEl, {opacity: 0, y: 12, filter: 'blur(8px)'})
      if (captionLines.length) gsap.set(captionLines, {yPercent: 112})
      if (arrivalLines.length) gsap.set(arrivalLines, {yPercent: 115, filter: 'blur(8px)'})
      if (refs.flybyCaption.current) gsap.set(refs.flybyCaption.current, {opacity: 0})
      if (refs.arrival.current) gsap.set(refs.arrival.current, {opacity: 0})
      if (refs.arrivalCta.current) gsap.set(refs.arrivalCta.current, {pointerEvents: 'none'})
      if (refs.scrollCue.current) gsap.set(refs.scrollCue.current, {opacity: 0})

      const navChrome = getGlobalNavChrome()
      if (navChrome.length) gsap.set(navChrome, {opacity: 0, y: -20})

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

      // ====================================================================
      // ACT 1 — INTRO (autorun)
      // ====================================================================
      const T = CINEMATIC_TIMING
      const intro = gsap.timeline({
        defaults: {ease: 'power2.inOut'},
        onComplete: () => {
          setIntroComplete(true)
          document.body.style.overflow = ''
        },
      })
      animationRef.current = intro

      // Phase 1: Quick flashes
      intro
        .to(flashOverlay, {
          opacity: 0.3,
          duration: T.FLASH_PULSES.duration,
          repeat: T.FLASH_PULSES.repeat,
          yoyo: true,
          ease: 'power4.inOut',
        })
        .set(flashOverlay, {opacity: 0})

      // Phase 2: Fluid shader orbs
      intro.call(() => setShowFluidOrbs(true), [], T.ORBS_SHOW)
      intro.call(() => setShowFluidOrbs(false), [], T.ORBS_HIDE)

      // Phase 3: Big flash transition
      intro
        .to(flashOverlay, {opacity: 1, duration: 0.18, ease: 'power4.out'}, T.BIG_FLASH)
        .to(
          flashOverlay,
          {opacity: 0, scale: T.BIG_FLASH_SCALE, duration: 1.3, ease: 'power2.out'},
          T.BIG_FLASH_FADE
        )

      // Phase 4: Background elements
      if (refs.stars.current) {
        intro.to(refs.stars.current, {opacity: 1, duration: 0.9}, T.STARS)
      }
      if (refs.shootingStars.current) {
        intro.to(refs.shootingStars.current, {opacity: 1, duration: 0.8, ease: 'power2.out'}, T.SHOOTING)
      }

      // Phase 5: Celestial bodies
      if (refs.prometheus.current) {
        intro.to(
          refs.prometheus.current,
          {opacity: 0.85, duration: 2.2, ease: 'power1.inOut'},
          T.PROMETHEUS
        )
      }
      if (refs.earth.current) {
        intro.to(refs.earth.current, {opacity: 1, duration: 1.6, ease: 'power2.out'}, T.EARTH)
      }
      if (refs.moon.current) {
        intro
          .set(refs.moon.current, {visibility: 'visible'}, T.MOON_START)
          .to(
            refs.moon.current,
            {
              opacity: 1,
              x: '25vw',
              y: '-15vh',
              scale: 0.6,
              filter: 'blur(0px)',
              duration: T.MOON_DURATION,
              ease: 'cosmic',
            },
            T.MOON_START
          )
      }

      // Phase 6: Typography — masked per-char wordmark, line-revealed copy
      if (refs.heroCopy.current) {
        intro.to(refs.heroCopy.current, {opacity: 1, duration: 0.2}, T.TITLE)
      }
      intro.call(() => setTitleVisible(true), [], T.TITLE)
      if (wordmarkChars.length) {
        intro.to(
          wordmarkChars,
          {yPercent: 0, rotateX: 0, duration: 1.1, ease: 'power4.out', stagger: 0.038},
          T.TITLE
        )
      }
      const wordmark = q('[data-wordmark]')[0]
      if (wordmark) {
        intro.fromTo(
          wordmark,
          {letterSpacing: '0.55em', filter: 'blur(7px)'},
          {letterSpacing: '0.3em', filter: 'blur(0px)', duration: 1.6, ease: 'power3.out'},
          T.TITLE
        )
      }
      if (tagline.length) {
        intro.to(
          tagline,
          {yPercent: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out'},
          T.TAGLINE
        )
      }
      intro.call(() => setQuoteVisible(true), [], T.QUOTE)
      if (quoteLines.length) {
        intro.to(
          quoteLines,
          {yPercent: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out', stagger: 0.085},
          T.QUOTE
        )
      }
      if (authorEl.length) {
        intro.to(
          authorEl,
          {opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out'},
          T.AUTHOR
        )
      }

      // Phase 7: Chrome — nav + scroll cue, then release the viewport
      intro.call(() => setNavVisible(true), [], T.NAV)
      if (navChrome.length) {
        intro.to(
          navChrome,
          {opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.05},
          T.NAV
        )
      }
      if (refs.scrollCue.current) {
        intro.to(
          refs.scrollCue.current,
          {opacity: 1, duration: 0.6, ease: 'power1.out'},
          T.SCROLL_CUE
        )
      }

      // ====================================================================
      // ACT 2 — JOURNEY (scrubbed)
      // ====================================================================
      const J = JOURNEY_TIMING
      const journey = gsap.timeline({
        defaults: {ease: 'none'},
        scrollTrigger: {
          trigger: refs.track.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            journeyProgress.current = self.progress
          },
        },
      })

      // J1 — Departure: copy exits up through its masks, camera pushes on Earth
      if (wordmarkChars.length) {
        journey.to(
          wordmarkChars,
          {
            yPercent: -118,
            filter: 'blur(10px)',
            duration: 1.4,
            stagger: {each: 0.03, from: 'start'},
          },
          J.DEPART
        )
      }
      if (tagline.length) {
        journey.to(tagline, {yPercent: -120, filter: 'blur(8px)', duration: 1}, J.DEPART)
      }
      if (quoteLines.length) {
        journey.to(
          quoteLines,
          {yPercent: -112, filter: 'blur(6px)', duration: 1.1, stagger: 0.045},
          J.DEPART + 0.2
        )
      }
      if (authorEl.length) {
        journey.to(authorEl, {opacity: 0, y: -12, filter: 'blur(8px)', duration: 0.6}, J.DEPART + 0.3)
      }
      if (refs.heroCopy.current) {
        journey.set(refs.heroCopy.current, {pointerEvents: 'none'}, J.DEPART)
      }
      if (refs.scrollCue.current) {
        journey.to(refs.scrollCue.current, {opacity: 0, duration: 0.4}, J.DEPART)
      }
      if (refs.earth.current) {
        journey.fromTo(
          refs.earth.current,
          {scale: 1, x: '0vw', y: '0vh', opacity: 1},
          {scale: 1.14, y: '4vh', duration: J.FLYBY - J.DEPART},
          J.DEPART
        )
      }
      if (refs.prometheus.current) {
        journey.to(refs.prometheus.current, {opacity: 0.3, duration: 1.6}, J.DEPART + 0.4)
      }

      // J2 — Lunar flyby: the Moon sweeps across frame and owns it.
      // Z-swap: the moon canvas is opaque, so it must stack above Earth to pass in front.
      if (refs.moon.current) {
        journey.set(refs.moon.current, {zIndex: 10}, J.DEPART)
        journey.set(refs.moon.current, {zIndex: 30}, J.FLYBY)
        journey.fromTo(
          refs.moon.current,
          {x: '25vw', y: '-15vh', scale: 0.6, opacity: 1},
          {x: '0vw', y: '0vh', scale: 2.35, duration: 4},
          J.FLYBY
        )
      }
      if (refs.earth.current) {
        journey.to(
          refs.earth.current,
          {x: '-22vw', y: '14vh', scale: 0.8, opacity: 0.45, duration: 4},
          J.FLYBY
        )
      }
      if (refs.prometheus.current) {
        journey.to(refs.prometheus.current, {opacity: 0, duration: 1.8}, J.FLYBY + 0.4)
      }
      if (refs.stars.current) {
        journey.to(refs.stars.current, {y: '-5vh', scale: 1.06, duration: 4}, J.FLYBY)
      }
      if (refs.flybyCaption.current && captionLines.length) {
        journey.to(refs.flybyCaption.current, {opacity: 1, duration: 0.3}, J.FLYBY_CAPTION_IN)
        journey.to(
          captionLines,
          {yPercent: 0, duration: 0.9, stagger: 0.14, ease: 'power1.out'},
          J.FLYBY_CAPTION_IN
        )
        journey.to(
          captionLines,
          {yPercent: -112, duration: 0.8, stagger: 0.1, ease: 'power1.in'},
          J.FLYBY_CAPTION_OUT
        )
        journey.to(refs.flybyCaption.current, {opacity: 0, duration: 0.3}, J.FLYBY_CAPTION_OUT + 0.8)
      }

      // J3 — Arrival: Moon settles, the archive opens
      if (refs.moon.current) {
        journey.to(refs.moon.current, {x: '10vw', y: '-4vh', scale: 1.55, duration: 1.8}, J.ARRIVAL)
      }
      if (refs.earth.current) {
        journey.to(refs.earth.current, {opacity: 0.15, scale: 0.7, duration: 1.8}, J.ARRIVAL)
      }
      if (refs.stars.current) {
        journey.to(refs.stars.current, {y: '-8vh', duration: 1.8}, J.ARRIVAL)
      }
      if (refs.arrival.current && arrivalLines.length) {
        journey.to(refs.arrival.current, {opacity: 1, duration: 0.4}, J.ARRIVAL + 0.5)
        journey.to(
          arrivalLines[0],
          {yPercent: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power1.out'},
          J.ARRIVAL_KICKER
        )
        if (arrivalLines[1]) {
          journey.to(
            arrivalLines[1],
            {yPercent: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power1.out'},
            J.ARRIVAL_LINE
          )
        }
        if (arrivalLines[2]) {
          journey.to(
            arrivalLines[2],
            {yPercent: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power1.out'},
            J.ARRIVAL_CTA
          )
        }
      }
      if (refs.arrivalCta.current) {
        journey.set(refs.arrivalCta.current, {pointerEvents: 'auto'}, J.END - 0.2)
      }

      // Interruptibility: any scroll intent during the intro fast-forwards it
      const fastForward = () => {
        if (intro.progress() < 1) intro.progress(1)
      }
      window.addEventListener('wheel', fastForward, {passive: true})
      window.addEventListener('touchmove', fastForward, {passive: true})

      return () => {
        window.removeEventListener('wheel', fastForward)
        window.removeEventListener('touchmove', fastForward)
        journey.scrollTrigger?.kill()
        journey.kill()
        intro.kill()
        quoteSplit?.revert()
        flashOverlay.remove()
        document.body.style.overflow = ''
      }
    },
    {dependencies: [isReady, staticMode], scope: refs.container}
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
    setIntroComplete(false)
    journeyProgress.current = 0
    window.scrollTo(0, 0)
    if (!animationRef.current) {
      revealSceneImmediately()
      return
    }
    document.body.style.overflow = 'hidden'
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
    introComplete,
    staticMode,
    showFluidOrbs,
    titleVisible,
    quoteVisible,
    navVisible,
    journeyProgress: journeyProgress as JourneyProgressRef,
    refs,
  }
}
