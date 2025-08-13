'use client'

import {useEffect, useRef, useState, useCallback, MutableRefObject} from 'react'
// import {useEffect, useRef, useState, useCallback} from 'react'
// import {gsap} from 'gsap'
// import {CustomEase} from 'gsap/CustomEase'
// import {MotionPathPlugin} from 'gsap/MotionPathPlugin'
// import { gsap } from "gsap";
// import { useGSAP } from "@gsap/react";

// import { CustomEase } from "gsap/CustomEase";
// // CustomBounce requires CustomEase
// import { CustomBounce } from "gsap/CustomBounce";
// // CustomWiggle requires CustomEase
// import { CustomWiggle } from "gsap/CustomWiggle";
// import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

// import { Draggable } from "gsap/Draggable";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { EaselPlugin } from "gsap/EaselPlugin";
// import { Flip } from "gsap/Flip";
// import { GSDevTools } from "gsap/GSDevTools";
// import { InertiaPlugin } from "gsap/InertiaPlugin";
// import { MotionPathHelper } from "gsap/MotionPathHelper";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
// import { Observer } from "gsap/Observer";
// import { Physics2DPlugin } from "gsap/Physics2DPlugin";
// import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
// import { PixiPlugin } from "gsap/PixiPlugin";
// import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// // ScrollSmoother requires ScrollTrigger
// import { ScrollSmoother } from "gsap/ScrollSmoother";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { SplitText } from "gsap/SplitText";
// import { TextPlugin } from "gsap/TextPlugin";
import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'

import {CustomEase} from 'gsap/CustomEase'
// CustomBounce requires CustomEase
import {CustomBounce} from 'gsap/CustomBounce'
// CustomWiggle requires CustomEase
import {CustomWiggle} from 'gsap/CustomWiggle'
import {RoughEase, ExpoScaleEase, SlowMo} from 'gsap/EasePack'

import {Draggable} from 'gsap/Draggable'
import {DrawSVGPlugin} from 'gsap/DrawSVGPlugin'
import {EaselPlugin} from 'gsap/EaselPlugin'
import {Flip} from 'gsap/Flip'
import {GSDevTools} from 'gsap/GSDevTools'
import {InertiaPlugin} from 'gsap/InertiaPlugin'
import {MotionPathHelper} from 'gsap/MotionPathHelper'
import {MotionPathPlugin} from 'gsap/MotionPathPlugin'
import {MorphSVGPlugin} from 'gsap/MorphSVGPlugin'
import {Observer} from 'gsap/Observer'
import {Physics2DPlugin} from 'gsap/Physics2DPlugin'
import {PhysicsPropsPlugin} from 'gsap/PhysicsPropsPlugin'
import {PixiPlugin} from 'gsap/PixiPlugin'
import {ScrambleTextPlugin} from 'gsap/ScrambleTextPlugin'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
// ScrollSmoother requires ScrollTrigger
import {ScrollSmoother} from 'gsap/ScrollSmoother'
import {ScrollToPlugin} from 'gsap/ScrollToPlugin'
import {SplitText} from 'gsap/SplitText'
import {TextPlugin} from 'gsap/TextPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    CustomEase,
    MotionPathPlugin,
    useGSAP,
    Draggable,
    DrawSVGPlugin,
    EaselPlugin,
    Flip,
    GSDevTools,
    InertiaPlugin,
    MotionPathHelper,
    MotionPathPlugin,
    MorphSVGPlugin,
    Observer,
    Physics2DPlugin,
    PhysicsPropsPlugin,
    PixiPlugin,
    ScrambleTextPlugin,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    SplitText,
    TextPlugin,
    RoughEase,
    ExpoScaleEase,
    SlowMo,
    CustomEase,
    CustomBounce,
    CustomWiggle
  )
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
}

export const useUltraterrestrialAnimation = () => {
  const [isReady, setIsReady] = useState(false)
  const [showFluidOrbs, setShowFluidOrbs] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const orbsRef = useRef<HTMLDivElement[]>([])

  const refs: AnimationRefs = {
    container: useRef<HTMLDivElement>(null),
    moon: useRef<HTMLDivElement>(null),
    earth: useRef<HTMLDivElement>(null),
    nav: useRef<HTMLDivElement>(null),
    title: useRef<HTMLDivElement>(null),
    stars: useRef<HTMLDivElement>(null),
    shootingStars: useRef<HTMLDivElement>(null),
    cursor: useRef<HTMLDivElement>(null),
    orbs: useRef<HTMLDivElement>(null),
  }

  // Debug: Log state changes
  useGSAP(() => {
    console.log('🔮 showFluidOrbs state changed:', showFluidOrbs)
  }, [showFluidOrbs])

  useEffect(() => {
    console.log('🔮 isReady state changed:', isReady)
  }, [isReady])

  useEffect(() => {
    // Wait for all elements to be in the DOM
    const checkElements = setInterval(() => {
      const earthCanvas = document.querySelector('#earth-canvas')
      const moonCanvas = document.querySelector('#moon-canvas')
      const astronaut = document.querySelector('.astronaut')
      const cosmicNav = document.querySelector('.cosmic-nav')

      console.log('🔍 Checking elements:', {
        earthCanvas: !!earthCanvas,
        moonCanvas: !!moonCanvas,
        astronaut: !!astronaut,
        cosmicNav: !!cosmicNav,
      })

      if (earthCanvas && moonCanvas && astronaut && cosmicNav) {
        console.log('✅ All elements found, starting animation')
        clearInterval(checkElements)
        setIsReady(true)
      }
    }, 100)

    return () => clearInterval(checkElements)
  }, [])

  useGSAP(
    () => {
      if (!isReady) return

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

      if (refs.nav.current) gsap.set(refs.nav.current, {opacity: 0})
      if (refs.title.current)
        gsap.set(refs.title.current, {opacity: 0, scale: 0.8, filter: 'blur(20px)'})

      // Also hide the shooting stars initially
      if (refs.shootingStars.current) gsap.set(refs.shootingStars.current, {opacity: 0})
      if (refs.stars.current) gsap.set(refs.stars.current, {opacity: 0})

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

      // Phase 2: Fluid shader orbs (0.5-4.5s) - Extended duration with better timing
      // Control FluidShaderOrbs visibility via React state
      tl.call(
        () => {
          console.log('🔮 Showing fluid orbs')
          setShowFluidOrbs(true)
        },
        [],
        0.5
      ) // Start orbs earlier at 0.5s
        .call(
          () => {
            console.log('🔮 Hiding fluid orbs')
            setShowFluidOrbs(false)
          },
          [],
          4.5
        ) // Hide orbs later at 4.5s

        // Phase 3: Big flash (5s) - Moved later to allow orbs to complete
        .to(
          flashOverlay,
          {
            opacity: 1,
            duration: 0.1,
            ease: 'power4.out',
          },
          5
        )
        .to(
          flashOverlay,
          {
            opacity: 0,
            scale: 3,
            duration: 1,
            ease: 'power2.out',
          },
          5.1
        )

        // Phase 4: Reveal background elements first
        .to(refs.stars.current, {opacity: 1, duration: 1.5, ease: 'power1.out'}, 5.2)
        .to(refs.shootingStars.current, {opacity: 1, duration: 1.5, ease: 'power1.out'}, 5.3)

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

        // Phase 6: UI elements (7-9s)
        .to(refs.nav.current, {opacity: 1, duration: 1, ease: 'power2.out'}, 7)
        .to(
          refs.title.current,
          {opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out'},
          7.5
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
    {dependencies: [isReady], scope: refs.container}
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
    if (animationRef.current) {
      animationRef.current.restart()
    }
  }, [])

  const skipToEnd = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.progress(1)
    }
  }, [])

  return {
    pauseAnimation,
    resumeAnimation,
    restartAnimation,
    skipToEnd,
    isReady,
    showFluidOrbs,
    refs,
  }
}
