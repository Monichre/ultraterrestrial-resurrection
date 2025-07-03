'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, MotionPathPlugin, ScrollTrigger)
}

interface CosmicPortalAnimationProps {
  images: string[]
  onComplete?: () => void
  autoPlay?: boolean
}

export const useCosmicPortalAnimation = ({ 
  images = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg', 
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg'
  ],
  onComplete,
  autoPlay = true
}: CosmicPortalAnimationProps = {}) => {
  const [isReady, setIsReady] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  
  useEffect(() => {
    if (!autoPlay) return
    
    // Create the animation container
    const container = document.createElement('div')
    container.className = 'cosmic-portal-container'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 9999;
      background: #000;
      perspective: 1000px;
      transform-style: preserve-3d;
    `
    document.body.appendChild(container)
    containerRef.current = container
    
    // Create custom eases
    CustomEase.create("portal", "M0,0 C0.084,0.61 0.214,0.802 0.36,0.90 0.60,1.0 0.72,1.0 1,1")
    CustomEase.create("wormhole", "M0,0 C0.5,0 0.5,1 1,1")
    
    // Create the 3D scene
    const scene = document.createElement('div')
    scene.className = 'portal-scene'
    scene.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transform: translateZ(0);
    `
    container.appendChild(scene)
    
    // Create portal layers
    const portals = images.map((src, index) => {
      const portal = document.createElement('div')
      portal.className = `portal portal-${index}`
      portal.style.cssText = `
        position: absolute;
        width: ${150 - index * 20}vmax;
        height: ${150 - index * 20}vmax;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateZ(${-index * 1000}px);
        background-image: url(${src});
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        opacity: 0;
        filter: blur(${index * 2}px);
        mix-blend-mode: screen;
      `
      scene.appendChild(portal)
      return portal
    })
    
    // Create particle field
    const particleField = document.createElement('div')
    particleField.className = 'particle-field'
    particleField.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
    `
    scene.appendChild(particleField)
    
    // Generate particles
    for (let i = 0; i < 200; i++) {
      const particle = document.createElement('div')
      particle.className = `particle particle-${i}`
      particle.style.cssText = `
        position: absolute;
        width: ${gsap.utils.random(1, 4)}px;
        height: ${gsap.utils.random(1, 4)}px;
        background: ${i % 2 === 0 ? '#adf0dd' : '#ff6b6b'};
        border-radius: 50%;
        left: ${gsap.utils.random(0, 100)}%;
        top: ${gsap.utils.random(0, 100)}%;
        transform: translateZ(${gsap.utils.random(-2000, 1000)}px);
        opacity: 0;
        box-shadow: 0 0 ${gsap.utils.random(5, 20)}px currentColor;
      `
      particleField.appendChild(particle)
      particlesRef.current.push(particle)
    }
    
    // Create lens flare effects
    const lensFlare = document.createElement('div')
    lensFlare.className = 'lens-flare'
    lensFlare.style.cssText = `
      position: absolute;
      width: 200vmax;
      height: 200vmax;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle at center, 
        rgba(255,255,255,0.8) 0%, 
        rgba(173,240,221,0.4) 10%, 
        rgba(255,107,107,0.2) 30%, 
        transparent 50%);
      opacity: 0;
      pointer-events: none;
      mix-blend-mode: screen;
    `
    scene.appendChild(lensFlare)
    
    // Create dimensional rift effect
    const rift = document.createElement('div')
    rift.className = 'dimensional-rift'
    rift.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: conic-gradient(
        from 0deg at 50% 50%,
        transparent 0deg,
        rgba(173,240,221,0.2) 60deg,
        transparent 120deg,
        rgba(255,107,107,0.2) 180deg,
        transparent 240deg,
        rgba(173,240,221,0.2) 300deg,
        transparent 360deg
      );
      opacity: 0;
      transform: scale(0) rotate(0deg);
      mix-blend-mode: screen;
    `
    scene.appendChild(rift)
    
    // Master timeline
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onStart: () => {
        console.log("🌌 Initiating cosmic portal sequence...")
        document.body.style.overflow = 'hidden'
      },
      onComplete: () => {
        console.log("✨ Portal traversal complete")
        if (onComplete) onComplete()
        // Cleanup after a delay
        gsap.delayedCall(1, () => {
          container.remove()
          document.body.style.overflow = ''
        })
      }
    })
    
    animationRef.current = tl
    
    // Phase 1: Dimensional tear (0-2s)
    tl.to(rift, {
      opacity: 1,
      scale: 10,
      rotation: 720,
      duration: 2,
      ease: "portal"
    })
    .to(rift, {
      opacity: 0,
      scale: 20,
      duration: 1,
      ease: "power2.out"
    }, 1.5)
    
    // Phase 2: First portal emergence (1-3s)
    .fromTo(portals[0], {
      opacity: 0,
      scale: 0,
      rotationZ: -180
    }, {
      opacity: 1,
      scale: 1,
      rotationZ: 0,
      duration: 2,
      ease: "back.out(1.4)"
    }, 1)
    
    // Phase 3: Portal cascade (2-5s)
    portals.forEach((portal, index) => {
      if (index === 0) return
      
      tl.fromTo(portal, {
        opacity: 0,
        scale: 0,
        rotationZ: -360 * (index + 1)
      }, {
        opacity: 0.8 - index * 0.1,
        scale: 1,
        rotationZ: 0,
        duration: 1.5,
        ease: "portal"
      }, 2 + index * 0.3)
    })
    
    // Phase 4: Particle activation (3-6s)
    .to(particlesRef.current, {
      opacity: gsap.utils.random(0.3, 1),
      duration: 0.5,
      stagger: {
        each: 0.01,
        from: "random"
      }
    }, 3)
    
    // Phase 5: Wormhole travel (4-8s)
    .to(scene, {
      z: 3000,
      rotationZ: 360,
      duration: 4,
      ease: "wormhole"
    }, 4)
    
    // Animate particles through space
    .to(particlesRef.current, {
      z: "+=2000",
      x: () => gsap.utils.random(-500, 500),
      y: () => gsap.utils.random(-500, 500),
      duration: 4,
      ease: "power1.in",
      stagger: {
        each: 0.01,
        from: "random"
      }
    }, 4)
    
    // Phase 6: Lens flare climax (6-8s)
    .to(lensFlare, {
      opacity: 1,
      scale: 2,
      duration: 1,
      ease: "power4.out"
    }, 6)
    .to(lensFlare, {
      opacity: 0,
      scale: 4,
      duration: 2,
      ease: "power2.in"
    }, 7)
    
    // Phase 7: Portal collapse (7-9s)
    .to(portals, {
      scale: 0,
      opacity: 0,
      rotationZ: 720,
      duration: 2,
      ease: "power3.in",
      stagger: {
        each: 0.1,
        from: "end"
      }
    }, 7)
    
    // Phase 8: Final flash (8.5-9s)
    .to(container, {
      backgroundColor: "#ffffff",
      duration: 0.1,
      ease: "power4.out"
    }, 8.5)
    .to(container, {
      backgroundColor: "#000000",
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, 8.6)
    
    // Ambient rotation for depth
    gsap.to(scene, {
      rotationY: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    })
    
    // Pulse effect for portals
    portals.forEach((portal, index) => {
      gsap.to(portal, {
        scale: 1.1,
        duration: 2 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.2
      })
    })
    
    setIsReady(true)
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
      if (containerRef.current) {
        containerRef.current.remove()
      }
      particlesRef.current = []
    }
  }, [images, onComplete, autoPlay])
  
  // Control methods
  const playAnimation = () => {
    if (animationRef.current) {
      animationRef.current.play()
    }
  }
  
  const pauseAnimation = () => {
    if (animationRef.current) {
      animationRef.current.pause()
    }
  }
  
  const reverseAnimation = () => {
    if (animationRef.current) {
      animationRef.current.reverse()
    }
  }
  
  const seekTo = (progress: number) => {
    if (animationRef.current) {
      animationRef.current.progress(progress)
    }
  }
  
  return {
    playAnimation,
    pauseAnimation,
    reverseAnimation,
    seekTo,
    isReady
  }
}

// Standalone component version
export const CosmicPortalSequence: React.FC<CosmicPortalAnimationProps> = (props) => {
  const { isReady } = useCosmicPortalAnimation(props)
  
  return null // This component creates its own DOM elements
}
