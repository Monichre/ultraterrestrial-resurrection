'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

if ( typeof window !== 'undefined' ) {
  gsap.registerPlugin( useGSAP )
}

export type HomeHeroPhase = 'booting' | 'stars' | 'earth' | 'title' | 'idle'

type HeroRefs = {
  container: RefObject<HTMLDivElement | null>
  stars: RefObject<HTMLDivElement | null>
  shootingStars: RefObject<HTMLDivElement | null>
  earth: RefObject<HTMLDivElement | null>
  title: RefObject<HTMLDivElement | null>
}

const HERO_TIMING = {
  STARS_START: 0,
  STARS_DURATION: 1.2,
  SHOOTING_START: 0.6,
  SHOOTING_DURATION: 0.8,
  EARTH_START: 1.2,
  EARTH_DURATION: 1.6,
  TITLE_AT: 2.8,
  TITLE_DURATION: 0.8,
  IDLE_AT: 4.0,
  READY_FALLBACK_MS: 3000,
} as const

const revealTargets = ( refs: HeroRefs ) => {
  const targets = [
    refs.stars.current,
    refs.shootingStars.current,
    refs.earth.current,
    refs.title.current,
  ]

  targets.forEach( ( target ) => {
    if ( !target ) return
    gsap.set( target, {
      opacity: 1,
      visibility: 'visible',
      scale: 1,
      x: 0,
      y: 0,
      clearProps: 'transform',
    } )
  } )
}

export const useHomeHeroSequence = () => {
  const [phase, setPhase] = useState<HomeHeroPhase>( 'booting' )
  const [isIdle, setIsIdle] = useState( false )
  const [isReady, setIsReady] = useState( false )
  const [titleVisible, setTitleVisible] = useState( false )
  const [shouldReduceMotion, setShouldReduceMotion] = useState( false )

  const timelineRef = useRef<gsap.core.Timeline | null>( null )
  const hasRevealedRef = useRef( false )

  const container = useRef<HTMLDivElement>( null )
  const stars = useRef<HTMLDivElement>( null )
  const shootingStars = useRef<HTMLDivElement>( null )
  const earth = useRef<HTMLDivElement>( null )
  const title = useRef<HTMLDivElement>( null )

  const refs: HeroRefs = {
    container,
    stars,
    shootingStars,
    earth,
    title,
  }

  const skipToEnd = useCallback( () => {
    hasRevealedRef.current = true
    timelineRef.current?.progress( 1 ).pause()
    setTitleVisible( true )
    setIsIdle( true )
    setPhase( 'idle' )
    revealTargets( {
      container,
      stars,
      shootingStars,
      earth,
      title,
    } )
  }, [] )

  const pauseAnimation = useCallback( () => {
    timelineRef.current?.pause()
  }, [] )

  const resumeAnimation = useCallback( () => {
    timelineRef.current?.resume()
  }, [] )

  const restartAnimation = useCallback( () => {
    hasRevealedRef.current = false
    setIsIdle( false )
    setTitleVisible( false )
    setPhase( 'booting' )

    if ( !timelineRef.current ) {
      skipToEnd()
      return
    }

    timelineRef.current.restart()
  }, [skipToEnd] )

  useEffect( () => {
    if ( typeof window === 'undefined' ) return

    const mediaQuery = window.matchMedia( '(prefers-reduced-motion: reduce)' )
    const updatePreference = () => {
      const matches = mediaQuery.matches
      setShouldReduceMotion( matches )
      if ( matches ) skipToEnd()
    }

    updatePreference()
    mediaQuery.addEventListener?.( 'change', updatePreference )
    return () => mediaQuery.removeEventListener?.( 'change', updatePreference )
  }, [skipToEnd] )

  useEffect( () => {
    if ( shouldReduceMotion ) return

    const checkReady = window.setInterval( () => {
      const earthCanvas = document.querySelector( '#earth-canvas' )
      if ( !earthCanvas ) return

      window.clearInterval( checkReady )
      setIsReady( true )
    }, 100 )

    const fallbackTimer = window.setTimeout( () => {
      window.clearInterval( checkReady )
      if ( !hasRevealedRef.current ) {
        setIsReady( true )
        skipToEnd()
      }
    }, HERO_TIMING.READY_FALLBACK_MS )

    return () => {
      window.clearInterval( checkReady )
      window.clearTimeout( fallbackTimer )
    }
  }, [shouldReduceMotion, skipToEnd] )

  useGSAP(
    () => {
      if ( !isReady || shouldReduceMotion || hasRevealedRef.current ) return

      const layers = {
        stars: refs.stars.current,
        shootingStars: refs.shootingStars.current,
        earth: refs.earth.current,
        title: refs.title.current,
      }

      gsap.set(
        [layers.stars, layers.shootingStars, layers.earth, layers.title].filter( Boolean ),
        {
          opacity: 0,
          visibility: 'visible',
        }
      )

      if ( layers.stars ) gsap.set( layers.stars, { scale: 0.98 } )
      if ( layers.earth ) gsap.set( layers.earth, { scale: 0.92 } )
      if ( layers.title ) gsap.set( layers.title, { scale: 0.96 } )

      const tl = gsap.timeline( {
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          setPhase( 'idle' )
          setIsIdle( true )
          hasRevealedRef.current = true
        },
      } )

      timelineRef.current = tl

      tl.call( () => setPhase( 'stars' ), [], HERO_TIMING.STARS_START )

      if ( layers.stars ) {
        tl.to(
          layers.stars,
          {
            opacity: 1,
            scale: 1,
            duration: HERO_TIMING.STARS_DURATION,
            ease: 'power2.inOut',
          },
          HERO_TIMING.STARS_START
        )
      }

      if ( layers.shootingStars ) {
        tl.to(
          layers.shootingStars,
          {
            opacity: 1,
            duration: HERO_TIMING.SHOOTING_DURATION,
          },
          HERO_TIMING.SHOOTING_START
        )
      }

      tl.call( () => setPhase( 'earth' ), [], HERO_TIMING.EARTH_START )

      if ( layers.earth ) {
        tl.to(
          layers.earth,
          {
            opacity: 1,
            scale: 1,
            duration: HERO_TIMING.EARTH_DURATION,
            ease: 'power2.out',
          },
          HERO_TIMING.EARTH_START
        )
      }

      tl.call(
        () => {
          setPhase( 'title' )
          setTitleVisible( true )
        },
        [],
        HERO_TIMING.TITLE_AT
      )

      if ( layers.title ) {
        tl.to(
          layers.title,
          {
            opacity: 1,
            scale: 1,
            duration: HERO_TIMING.TITLE_DURATION,
            ease: 'power2.out',
          },
          HERO_TIMING.TITLE_AT
        )
      }

      tl.call(
        () => {
          setPhase( 'idle' )
          setIsIdle( true )
          hasRevealedRef.current = true
        },
        [],
        HERO_TIMING.IDLE_AT
      )

      return () => {
        tl.kill()
      }
    },
    { dependencies: [isReady, shouldReduceMotion], scope: container }
  )

  useEffect( () => {
    if ( typeof window === 'undefined' || process.env.NODE_ENV === 'production' ) return

    const handleKeyPress = ( event: KeyboardEvent ) => {
      switch ( event.key ) {
        case ' ':
          event.preventDefault()
          pauseAnimation()
          break
        case 'Enter':
          event.preventDefault()
          resumeAnimation()
          break
        case 'r':
          event.preventDefault()
          restartAnimation()
          break
        case 's':
          event.preventDefault()
          skipToEnd()
          break
        default:
          break
      }
    }

    window.addEventListener( 'keydown', handleKeyPress )
    return () => window.removeEventListener( 'keydown', handleKeyPress )
  }, [pauseAnimation, resumeAnimation, restartAnimation, skipToEnd] )

  return {
    refs,
    phase,
    isIdle,
    isReady,
    titleVisible,
    shouldReduceMotion,
    pauseAnimation,
    resumeAnimation,
    restartAnimation,
    skipToEnd,
  }
}

export { HERO_TIMING }
