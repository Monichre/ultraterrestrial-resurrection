'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase)
}

export const useUltraterrestrialAnimation = () => {
  const [isReady, setIsReady] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const orbsRef = useRef<HTMLDivElement[]>([])
  
  useEffect(() => {
    // Wait for all elements to be in the DOM
    const checkElements = setInterval(() => {
      const earthCanvas = document.querySelector('#earth-canvas')
      const moonCanvas = document.querySelector('#moon-canvas')
      const astronaut = document.querySelector('.astronaut')
      const cosmicNav = document.querySelector('.cosmic-nav')
      
      if (earthCanvas && moonCanvas && astronaut && cosmicNav) {
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
    CustomEase.create("cosmic", "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1")
    CustomEase.create("dimensional", "M0,0 C0.11,0.494 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1")
    
    // Set initial states first - IMPORTANT: Don't hide Earth's parent container
    gsap.set("#moon-canvas", { 
      opacity: 0,
      scale: 0.01,
      filter: "blur(50px)"
    })
    
    // Target the Earth canvas more specifically and ensure z-index doesn't hide it
    gsap.set("#earth-canvas", { 
      opacity: 0,
      scale: 0.01,
      filter: "blur(50px)",
      transformOrigin: "center center"
    })
    
    // Make sure the parent containers are visible
    gsap.set("#earth-canvas", { visibility: "visible" })
    gsap.set("#moon-canvas", { visibility: "visible" })
    
    gsap.set(".cosmic-nav", { 
      opacity: 0
    })
    gsap.set(".astronaut", { 
      opacity: 0,
      scale: 0.8,
      filter: "blur(20px)"
    })
    
    // Also hide the shooting stars initially
    gsap.set(".shooting-stars", { opacity: 0 })
    gsap.set(".stars-background", { opacity: 0 })
    
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
    
    // Create orb container
    const orbContainer = document.createElement('div')
    orbContainer.className = 'orb-container'
    orbContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 100;
    `
    document.body.appendChild(orbContainer)
    
    // Master timeline
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onStart: () => {
        console.log("✨ Animation started")
      },
      onComplete: () => {
        console.log("✅ Animation complete")
        // Ensure Earth is visible at the end
        gsap.set("#earth-canvas", { clearProps: "all" })
      }
    })
    
    // Store the timeline reference
    animationRef.current = tl
    
    // Phase 1: Quick flashes (0-2s)
    tl.to(flashOverlay, {
      opacity: 0.3,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power4.inOut"
    })
    .set(flashOverlay, { opacity: 0 })
    
    // Phase 2: Create and animate orbs (1-4s)
    const orbPositions = [
      { x: 20, y: 30, size: 60 },
      { x: 70, y: 20, size: 80 },
      { x: 50, y: 60, size: 100 },
      { x: 80, y: 70, size: 40 },
      { x: 30, y: 80, size: 70 }
    ]
    
    // Create orbs
    orbPositions.forEach((pos, i) => {
      const orb = document.createElement('div')
      orb.className = `orb orb-${i}`
      orb.style.cssText = `
        position: absolute;
        width: ${pos.size}px;
        height: ${pos.size}px;
        left: ${pos.x}%;
        top: ${pos.y}%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, 
          rgba(173,240,221,1) 0%, 
          rgba(173,240,221,0.6) 30%, 
          rgba(173,240,221,0.2) 60%, 
          transparent 100%);
        box-shadow: 
          0 0 ${pos.size/2}px rgba(173,240,221,0.8),
          0 0 ${pos.size}px rgba(173,240,221,0.4);
        opacity: 0;
        scale: 0;
      `
      orbContainer.appendChild(orb)
      orbsRef.current.push(orb)
      
      // Animate each orb
      tl.to(orb, {
        opacity: 0.8,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, 1 + i * 0.1)
    })
    
    // Move orbs to center
    tl.to(orbsRef.current, {
      left: "50%",
      top: "50%",
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: "power3.in",
      stagger: 0.05
    }, 3)
    
    // Phase 3: Big flash (4s)
    .to(flashOverlay, {
      opacity: 1,
      duration: 0.1,
      ease: "power4.out"
    }, 4)
    .to(flashOverlay, {
      opacity: 0,
      scale: 3,
      duration: 1,
      ease: "power2.out"
    }, 4.1)
    
    // Phase 4: Reveal background elements first
    .to(".stars-background", {
      opacity: 1,
      duration: 1.5,
      ease: "power1.out"
    }, 4.2)
    .to(".shooting-stars", {
      opacity: 1,
      duration: 1.5,
      ease: "power1.out"
    }, 4.3)
    
    // Phase 5: Reveal Earth with proper timing and make sure it stays visible
    .to("#earth-canvas", {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 2.5,
      ease: "power2.out",
      onStart: () => {
        console.log("🌍 Earth animation starting")
      },
      onComplete: () => {
        console.log("🌍 Earth animation complete")
        // Force Earth to be visible
        const earthEl = document.querySelector('#earth-canvas') as HTMLElement
        if (earthEl) {
          earthEl.style.opacity = '1'
          earthEl.style.transform = 'scale(1)'
          earthEl.style.filter = 'none'
        }
      }
    }, 4.5)
    
    // Moon comes in slightly after
    .to("#moon-canvas", {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 2,
      ease: "power2.out"
    }, 5)
    
    // Phase 6: UI elements (6-8s)
    .to(".cosmic-nav", {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, 6)
    .to(".astronaut", {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "power2.out"
    }, 6.5)
    
    // Add subtle floating animation to Earth after it appears
    .to("#earth-canvas", {
      y: "+=10",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    }, 8)
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
      flashOverlay?.remove()
      orbContainer?.remove()
      orbsRef.current = []
    }
  }, [isReady])
  
  // Control methods
  const pauseAnimation = () => {
    if (animationRef.current) {
      animationRef.current.pause()
    }
  }
  
  const resumeAnimation = () => {
    if (animationRef.current) {
      animationRef.current.resume()
    }
  }
  
  const restartAnimation = () => {
    if (animationRef.current) {
      animationRef.current.restart()
    }
  }
  
  const skipToEnd = () => {
    if (animationRef.current) {
      animationRef.current.progress(1)
    }
  }
  
  return {
    pauseAnimation,
    resumeAnimation,
    restartAnimation,
    skipToEnd,
    isReady
  }
}
