'use client'

import {useEffect, useRef, useState, useCallback, MutableRefObject} from 'react'
import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'
import {CustomEase} from 'gsap/CustomEase'

// Register only the GSAP plugins we actually use
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, useGSAP)
}

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

export const useUltraterrestrialAnimation = () => {
  const [isReady, setIsReady] = useState(false)
  const [showFluidOrbs, setShowFluidOrbs] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [navVisible, setNavVisible] = useState(false)
  const [forcedReveal, setForcedReveal] = useState(false)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const orbsRef = useRef<HTMLDivElement[]>([])
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
    setNavVisible(true)

    const visibleTargets = [
      stars.current,
      shootingStars.current,
      prometheus.current,
      moon.current,
      earth.current,
      nav.current,
      title.current,
    ]

    visibleTargets.forEach((target) => {
      if (target) {
        gsap.set(target, {
          opacity: 1,
          visibility: 'visible',
          filter: 'none',
          scale: 1,
          x: 0,
          y: 0,
          clearProps: 'all',
        })
      }
    })
  }, [])

  // Debug: Log state changes
  useGSAP(() => {
    console.log('🔮 showFluidOrbs state changed:', showFluidOrbs)
  }, [showFluidOrbs])

  useEffect(() => {
    console.log('🔮 isReady state changed:', isReady)
  }, [isReady])

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
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference)
    } else {
      mediaQuery.addListener(updatePreference)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updatePreference)
      } else {
        mediaQuery.removeListener(updatePreference)
      }
    }
  }, [revealSceneImmediately])

  useEffect(() => {
    if (shouldReduceMotion || forcedReveal) return

    let fallbackTimer: number | null = null

    const checkElements = window.setInterval(() => {
      const earthCanvas = document.querySelector('#earth-canvas')
      const moonCanvas = document.querySelector('#moon-canvas')
      const prometheusEl = document.querySelector('.prometheus-container')

      if (earthCanvas && moonCanvas && prometheusEl) {
        console.log('✅ All elements found, starting animation')
        window.clearInterval(checkElements)
        if (fallbackTimer) {
          window.clearTimeout(fallbackTimer)
        }
        hasRevealedRef.current = false
        setIsReady(true)
      }
    }, 120)

    fallbackTimer = window.setTimeout(() => {
      console.warn('⚠️ Ultraterrestrial hero animation fallback triggered')
      window.clearInterval(checkElements)
      setForcedReveal(true)
      revealSceneImmediately()
    }, 4000)

    return () => {
      window.clearInterval(checkElements)
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer)
      }
    }
  }, [revealSceneImmediately, shouldReduceMotion, forcedReveal])

  useGSAP(
    () => {
      if (!isReady || forcedReveal || shouldReduceMotion) {
        return
      }

      console.log('🚀 Starting animation sequence...')

      // Create custom eases for cinematic feel
      CustomEase.create(
        'cosmic',
        'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1'
      )
      CustomEase.create(
        'dimensional',
        'M0,0 C0.11,0.494 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1'
      )

      // Set initial states first - IMPORTANT: Don't hide Earth's parent container
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

      // Target the Earth canvas more specifically and ensure z-index doesn't hide it
      if (refs.earth.current) {
        gsap.set(refs.earth.current, {opacity: 0, visibility: 'visible'})
      }

      if (refs.nav.current) gsap.set(refs.nav.current, {opacity: 0, y: -20})
      if (refs.title.current)
        gsap.set(refs.title.current, {opacity: 0, scale: 0.8, filter: 'blur(20px)'})

      // Hide Prometheus initially - will fade in ethereally
      if (refs.prometheus.current) gsap.set(refs.prometheus.current, {opacity: 0})

      // Create flash overlay
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

      // Note: Orb container is now handled by the FluidShaderOrbs React component

      // Master timeline
      const tl = gsap.timeline({
        defaults: {ease: 'power2.inOut'},
        onStart: () => {
          console.log('✨ Animation started')
        },
        onComplete: () => {
          console.log('✅ Animation complete')
          // Ensure Earth is visible at the end
          gsap.set('#earth-canvas', {clearProps: 'all'})
        },
      })

      // Store the timeline reference
      animationRef.current = tl

      // Phase 1: Quick flashes (0-2s)
      tl.to(flashOverlay, {
        opacity: 0.3,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: 'power4.inOut',
      }).set(flashOverlay, {opacity: 0})

      // Phase 2: Fluid shader orbs (0.5-4.8s) - Seamless transition to flash
      // Control FluidShaderOrbs visibility via React state
      tl.call(
        () => {
          console.log('🔮 Showing fluid orbs')
          setShowFluidOrbs(true)
        },
        [],
        0.5
      ) // Start orbs at 0.5s
        .call(
          () => {
            console.log('🔮 Fading fluid orbs')
            setShowFluidOrbs(false)
          },
          [],
          4.8
        ) // Hide orbs just before flash for seamless transition

        // Phase 3: Big flash (5s) - Synchronized with orb fade
        .to(
          flashOverlay,
          {
            opacity: 1,
            duration: 0.2,
            ease: 'power4.out',
          },
          4.9
        )
        .to(
          flashOverlay,
          {
            opacity: 0,
            scale: 2,
            duration: 1.5,
            ease: 'power2.out',
          },
          5.1
        )

        // Prometheus fades in slowly and ethereally, watching over the cosmic dance
        .to(
          refs.prometheus.current,
          {
            opacity: 0.85,
            duration: 3,
            ease: 'power1.inOut',
            onStart: () => console.log('👁️ Prometheus awakening...'),
            onComplete: () => console.log('👁️ Prometheus watching'),
          },
          5.5
        )

        // Phase 5: Reveal Earth - SIMPLIFIED
        .to(
          refs.earth.current,
          {
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            onStart: () => console.log('🌍 Earth SIMPLE animation starting'),
            onComplete: () => console.log('🌍 Earth SIMPLE animation complete'),
          },
          5.5
        )

        // Moon comes in AFTER Earth - from behind over left shoulder
        .set(refs.moon.current, {visibility: 'visible'}, 8)
        .to(
          refs.moon.current,
          {
            opacity: 1,
            x: '25vw',
            y: '-15vh',
            scale: 0.6,
            filter: 'blur(0px)',
            duration: 3,
            ease: 'power2.inOut',
            onStart: () =>
              console.log('🌙 Moon orbital animation starting - coming from behind left shoulder'),
            onComplete: () => console.log('🌙 Moon reached final orbital position'),
          },
          8.2
        )

        // Phase 6: UI elements appear after celestial bodies are in place
        .call(
          () => {
            console.log('📝 Title appearing')
            setTitleVisible(true)
          },
          [],
          9
        )
        // Animate title with GSAP
        .to(
          refs.title.current,
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power2.out',
          },
          9
        )
        .call(
          () => {
            console.log('🧭 Navigation appearing')
            setNavVisible(true)
          },
          [],
          10.5
        )
        // Animate nav with GSAP
        .to(
          refs.nav.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          },
          10.5
        )

        // Add subtle floating animation to Earth after it appears
        .to(
          refs.earth.current,
          {y: '+=10', duration: 4, repeat: -1, yoyo: true, ease: 'power1.inOut'},
          9
        )

      // Cleanup function
      return () => {
        if (animationRef.current) {
          animationRef.current.kill()
        }
        flashOverlay?.remove()
        // Note: orbContainer cleanup is now handled by the FluidShaderOrbs React component
        orbsRef.current = []
      }
    },
    {dependencies: [isReady, forcedReveal, shouldReduceMotion], scope: refs.container}
  )

  // Control methods
  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause()
    }
  }, [])

  const resumeAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.resume()
    }
  }, [])

  const restartAnimation = useCallback(() => {
    if (!animationRef.current) {
      revealSceneImmediately()
      return
    }
    setTitleVisible(false)
    setNavVisible(false)
    animationRef.current.restart()
  }, [revealSceneImmediately])

  const skipToEnd = useCallback(() => {
    if (!animationRef.current) {
      revealSceneImmediately()
      return
    }
    animationRef.current.progress(1)
    setTitleVisible(true)
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
    navVisible,
    refs,
  }
}
