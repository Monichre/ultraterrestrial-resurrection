'use client'

import {useEffect, useRef, useState, useCallback} from 'react'
import {gsap} from 'gsap'
import {CustomEase} from 'gsap/CustomEase'
import {MotionPathPlugin} from 'gsap/MotionPathPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, MotionPathPlugin)
}

export const useUltraterrestrialAnimation = () => {
  const [isReady, setIsReady] = useState(false)
  const [showFluidOrbs, setShowFluidOrbs] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const orbsRef = useRef<HTMLDivElement[]>([])

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

  useEffect(() => {
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
    gsap.set('#moon-canvas', {
      opacity: 0,
      scale: 0.3,
      filter: 'blur(50px)',
      // Position moon behind us (upper left, as if behind our left shoulder)
      x: '-50vw',
      y: '-50vh',
      transformOrigin: 'center center',
      visibility: 'hidden', // Keep hidden until Earth appears
    })

    // Target the Earth canvas more specifically and ensure z-index doesn't hide it
    gsap.set('#earth-canvas', {
      opacity: 0,
      visibility: 'visible',
    })

    gsap.set('.cosmic-nav', {
      opacity: 0,
    })
    gsap.set('.astronaut', {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(20px)',
    })

    // Also hide the shooting stars initially
    gsap.set('.shooting-stars', {opacity: 0})
    gsap.set('.stars-background', {opacity: 0})

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

    // Phase 2: Fluid shader orbs (1-4s)
    // Control FluidShaderOrbs visibility via React state
    tl.call(() => setShowFluidOrbs(true), [], 1) // Start orbs at 1s
      .call(() => setShowFluidOrbs(false), [], 3) // Hide orbs at 3s

      // Phase 3: Big flash (4s)
      .to(
        flashOverlay,
        {
          opacity: 1,
          duration: 0.1,
          ease: 'power4.out',
        },
        4
      )
      .to(
        flashOverlay,
        {
          opacity: 0,
          scale: 3,
          duration: 1,
          ease: 'power2.out',
        },
        4.1
      )

      // Phase 4: Reveal background elements first
      .to(
        '.stars-background',
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power1.out',
        },
        4.2
      )
      .to(
        '.shooting-stars',
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power1.out',
        },
        4.3
      )

      // Phase 5: Reveal Earth - SIMPLIFIED
      .to(
        '#earth-canvas',
        {
          opacity: 1,
          duration: 2,
          ease: 'power2.out',
          onStart: () => {
            console.log('🌍 Earth SIMPLE animation starting')
          },
          onComplete: () => {
            console.log('🌍 Earth SIMPLE animation complete')
          },
        },
        4.5
      )

      // Moon comes in AFTER Earth - from behind over left shoulder
      .set('#moon-canvas', {visibility: 'visible'}, 7) // Make visible only after Earth
      .to(
        '#moon-canvas',
        {
          opacity: 1,
          x: '25vw', // Arc over to upper right
          y: '-15vh', // Above and to the right of Earth
          scale: 0.6, // Smaller than Earth
          filter: 'blur(0px)',
          duration: 3,
          ease: 'power2.inOut',
          onStart: () => {
            console.log('🌙 Moon orbital animation starting - coming from behind left shoulder')
          },
          onComplete: () => {
            console.log('🌙 Moon reached final orbital position')
          },
        },
        7.2
      ) // Start well after Earth is established

      // Phase 6: UI elements (6-8s)
      .to(
        '.cosmic-nav',
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        },
        6
      )
      .to(
        '.astronaut',
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power2.out',
        },
        6.5
      )

      // Add subtle floating animation to Earth after it appears
      .to(
        '#earth-canvas',
        {
          y: '+=10',
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        },
        8
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
  }, [isReady])

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
  }
}
