'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, MorphSVGPlugin, MotionPathPlugin)
}

interface MorphingMeteorAnimationProps {
  images: string[]
  onComplete?: () => void
  autoPlay?: boolean
}

export const useMorphingMeteorAnimation = ({ 
  images = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg', 
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg'
  ],
  onComplete,
  autoPlay = true
}: MorphingMeteorAnimationProps = {}) => {
  const [isReady, setIsReady] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trailRef = useRef<HTMLDivElement[]>([])
  
  useEffect(() => {
    if (!autoPlay) return
    
    // Create the animation container
    const container = document.createElement('div')
    container.className = 'morphing-meteor-container'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 9999;
      background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
    `
    document.body.appendChild(container)
    containerRef.current = container
    
    // Create custom eases
    CustomEase.create("meteor", "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1")
    CustomEase.create("morph", "M0,0 C0.7,0 0.3,1 1,1")
    
    // Create starfield background
    const starfield = document.createElement('div')
    starfield.className = 'starfield'
    starfield.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20% 30%, white, transparent),
        radial-gradient(2px 2px at 60% 70%, white, transparent),
        radial-gradient(1px 1px at 50% 50%, white, transparent);
      background-size: 300px 300px;
      opacity: 0.5;
    `
    container.appendChild(starfield)
    
    // Create the meteor container
    const meteorContainer = document.createElement('div')
    meteorContainer.className = 'meteor-container'
    meteorContainer.style.cssText = `
      position: absolute;
      width: 300px;
      height: 300px;
      top: -300px;
      left: -300px;
    `
    container.appendChild(meteorContainer)
    
    // Create the main meteor body
    const meteor = document.createElement('div')
    meteor.className = 'meteor'
    meteor.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 
        0 0 100px rgba(173, 240, 221, 0.8),
        0 0 200px rgba(255, 107, 107, 0.6),
        inset 0 0 50px rgba(255, 255, 255, 0.5);
    `
    meteorContainer.appendChild(meteor)
    
    // Create morphing shapes for each image
    const shapes = images.map((src, index) => {
      const shape = document.createElement('div')
      shape.className = `meteor-shape shape-${index}`
      shape.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url(${src});
        background-size: cover;
        background-position: center;
        opacity: ${index === 0 ? 1 : 0};
        mix-blend-mode: screen;
        filter: contrast(1.2) brightness(1.1);
      `
      meteor.appendChild(shape)
      return shape
    })
    
    // Create meteor trail
    for (let i = 0; i < 30; i++) {
      const trail = document.createElement('div')
      trail.className = `trail trail-${i}`
      trail.style.cssText = `
        position: absolute;
        width: ${100 - i * 3}px;
        height: ${100 - i * 3}px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(circle at center,
          rgba(173, 240, 221, ${0.6 - i * 0.02}) 0%,
          rgba(255, 107, 107, ${0.4 - i * 0.01}) 50%,
          transparent 100%);
        opacity: 0;
        filter: blur(${i * 0.5}px);
      `
      meteorContainer.appendChild(trail)
      trailRef.current.push(trail)
    }
    
    // Create energy corona
    const corona = document.createElement('div')
    corona.className = 'corona'
    corona.style.cssText = `
      position: absolute;
      width: 150%;
      height: 150%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(circle at center,
        transparent 30%,
        rgba(173, 240, 221, 0.3) 50%,
        rgba(255, 107, 107, 0.2) 70%,
        transparent 100%);
      filter: blur(10px);
      animation: corona-pulse 2s infinite ease-in-out;
    `
    meteorContainer.appendChild(corona)
    
    // Add corona pulse animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes corona-pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    
    // Create motion path
    const pathSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    pathSVG.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `
    pathSVG.setAttribute('viewBox', '0 0 100 100')
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M -10 20 Q 30 40, 50 50 T 110 80')
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', 'none')
    path.id = 'meteor-path'
    
    pathSVG.appendChild(path)
    container.appendChild(pathSVG)
    
    // Master timeline
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onStart: () => {
        console.log("☄️ Meteor sequence initiated...")
        document.body.style.overflow = 'hidden'
      },
      onComplete: () => {
        console.log("✨ Meteor has passed")
        if (onComplete) onComplete()
        // Cleanup after a delay
        gsap.delayedCall(1, () => {
          container.remove()
          document.body.style.overflow = ''
          style.remove()
        })
      }
    })
    
    animationRef.current = tl
    
    // Set initial meteor position
    tl.set(meteorContainer, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.1,
      rotation: -45
    })
    
    // Phase 1: Meteor enters (0-1s)
    tl.to(meteorContainer, {
      scale: 1,
      duration: 1,
      ease: "back.out(1.4)"
    })
    
    // Phase 2: Follow motion path while morphing (0-8s)
    .to(meteorContainer, {
      motionPath: {
        path: "#meteor-path",
        align: "#meteor-path",
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      duration: 8,
      ease: "meteor"
    }, 0)
    
    // Morph between shapes during flight
    shapes.forEach((shape, index) => {
      if (index === 0) return // First shape is already visible
      
      const morphTime = 8 / images.length
      const startTime = morphTime * index
      
      // Fade out previous shape
      tl.to(shapes[index - 1], {
        opacity: 0,
        scale: 0.8,
        rotation: 180,
        duration: morphTime / 2,
        ease: "power2.in"
      }, startTime - morphTime / 2)
      
      // Fade in current shape
      .to(shape, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: morphTime / 2,
        ease: "power2.out"
      }, startTime)
      
      // Add morph effect
      .to(meteor, {
        borderRadius: `${50 + index * 10}% ${50 - index * 10}%`,
        duration: morphTime,
        ease: "morph"
      }, startTime)
    })
    
    // Phase 3: Trail effect (0.5-8s)
    trailRef.current.forEach((trail, i) => {
      tl.to(trail, {
        opacity: 0.8 - i * 0.02,
        x: -i * 20,
        y: i * 10,
        duration: 0.3,
        ease: "power2.out"
      }, 0.5 + i * 0.05)
      .to(trail, {
        opacity: 0,
        x: -i * 40,
        y: i * 20,
        duration: 4,
        ease: "power2.in"
      }, 0.8 + i * 0.05)
    })
    
    // Phase 4: Energy bursts at morph points
    shapes.forEach((_, index) => {
      if (index === 0) return
      
      const burstTime = (8 / images.length) * index
      
      // Create energy burst
      const burst = document.createElement('div')
      burst.style.cssText = `
        position: absolute;
        width: 200%;
        height: 200%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        border-radius: 50%;
        background: radial-gradient(circle at center,
          rgba(255, 255, 255, 0.8) 0%,
          rgba(173, 240, 221, 0.4) 30%,
          rgba(255, 107, 107, 0.2) 60%,
          transparent 100%);
        pointer-events: none;
      `
      meteorContainer.appendChild(burst)
      
      tl.to(burst, {
        scale: 3,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        onComplete: () => burst.remove()
      }, burstTime)
    })
    
    // Phase 5: Exit sequence (7-9s)
    tl.to(meteorContainer, {
      scale: 0.1,
      opacity: 0,
      duration: 2,
      ease: "power3.in"
    }, 7)
    
    // Ambient effects
    gsap.to(starfield, {
      backgroundPosition: "300px 300px",
      duration: 20,
      repeat: -1,
      ease: "none"
    })
    
    gsap.to(meteor, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: "none"
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
      trailRef.current = []
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
export const MorphingMeteorSequence: React.FC<MorphingMeteorAnimationProps> = (props) => {
  const { isReady } = useMorphingMeteorAnimation(props)
  
  return null // This component creates its own DOM elements
}
