'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, MotionPathPlugin)
}

interface MorphingMeteorAnimationProps {
  images?: string[]
  onComplete?: () => void
  autoPlay?: boolean
}

export const useMorphingMeteorAnimation = ({ 
  images = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg', 
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg',
    '/assets/cosmic-portals/eclipse-5.jpg',
    '/assets/cosmic-portals/eclipse-6.jpg',
    '/assets/cosmic-portals/eclipse-7.jpg'
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
      background: radial-gradient(ellipse at center, #000814 0%, #000000 100%);
    `
    document.body.appendChild(container)
    containerRef.current = container
    
    // Create custom eases
    CustomEase.create("meteor", "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1")
    CustomEase.create("morph", "M0,0 C0.7,0 0.3,1 1,1")
    
    // Create starfield
    const starfield = document.createElement('div')
    starfield.className = 'starfield'
    starfield.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20% 30%, white, transparent),
        radial-gradient(2px 2px at 60% 70%, white, transparent),
        radial-gradient(1px 1px at 50% 50%, white, transparent),
        radial-gradient(2px 2px at 80% 20%, #adf0dd, transparent),
        radial-gradient(2px 2px at 10% 80%, #ff6b6b, transparent);
      background-size: 400px 400px;
      opacity: 0.7;
    `
    container.appendChild(starfield)
    
    // Create the meteor container
    const meteorContainer = document.createElement('div')
    meteorContainer.className = 'meteor-container'
    meteorContainer.style.cssText = `
      position: absolute;
      width: 250px;
      height: 250px;
      top: -250px;
      left: -250px;
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
    
    // Create enhanced meteor trail
    for (let i = 0; i < 50; i++) {
      const trail = document.createElement('div')
      trail.className = `trail trail-${i}`
      trail.style.cssText = `
        position: absolute;
        width: ${120 - i * 2}px;
        height: ${120 - i * 2}px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(circle at center,
          rgba(173, 240, 221, ${0.6 - i * 0.01}) 0%,
          rgba(255, 107, 107, ${0.4 - i * 0.008}) 50%,
          transparent 100%);
        opacity: 0;
        filter: blur(${i * 0.3}px);
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
      filter: blur(15px);
      animation: corona-pulse 2s infinite ease-in-out;
    `
    meteorContainer.appendChild(corona)
    
    // Add styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes corona-pulse {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(1); 
          opacity: 0.8; 
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.5); 
          opacity: 1; 
        }
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
    path.setAttribute('d', 'M -10 10 Q 20 30, 50 50 T 110 90')
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
        gsap.delayedCall(1, () => {
          container.remove()
          document.body.style.overflow = ''
          style.remove()
        })
      }
    })
    
    animationRef.current = tl
    
    // Set initial position
    tl.set(meteorContainer, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.1,
      rotation: -45
    })
    
    // Phase 1: Meteor enters
    tl.to(meteorContainer, {
      scale: 1,
      duration: 1.5,
      ease: "back.out(1.7)"
    })
    
    // Phase 2: Follow motion path while morphing (total 12s for 7 images)
    .to(meteorContainer, {
      motionPath: {
        path: "#meteor-path",
        align: "#meteor-path",
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      duration: 12,
      ease: "meteor"
    }, 0)
    
    // Morph between all 7 shapes
    const morphDuration = 12 / images.length
    shapes.forEach((shape, index) => {
      if (index === 0) return
      
      const startTime = morphDuration * (index - 0.5)
      
      // Fade out previous
      if (index > 0) {
        tl.to(shapes[index - 1], {
          opacity: 0,
          scale: 0.8,
          rotation: 180,
          duration: morphDuration / 2,
          ease: "power2.in"
        }, startTime)
      }
      
      // Fade in current
      tl.to(shape, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: morphDuration / 2,
        ease: "power2.out"
      }, startTime + morphDuration / 4)
      
      // Morph meteor shape
      tl.to(meteor, {
        borderRadius: `${50 + (index % 3) * 15}% ${50 - (index % 3) * 15}%`,
        duration: morphDuration,
        ease: "morph"
      }, startTime)
      
      // Energy burst at transition
      const burst = document.createElement('div')
      burst.style.cssText = `
        position: absolute;
        width: 300%;
        height: 300%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        border-radius: 50%;
        background: radial-gradient(circle at center,
          rgba(255, 255, 255, 0.9) 0%,
          rgba(173, 240, 221, 0.5) 30%,
          rgba(255, 107, 107, 0.3) 60%,
          transparent 100%);
        pointer-events: none;
      `
      meteorContainer.appendChild(burst)
      
      tl.to(burst, {
        scale: 3,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        onComplete: () => burst.remove()
      }, startTime)
    })
    
    // Enhanced trail effect
    trailRef.current.forEach((trail, i) => {
      tl.to(trail, {
        opacity: 0.8 - i * 0.015,
        x: -i * 15,
        y: i * 5,
        duration: 0.5,
        ease: "power2.out"
      }, 0.5 + i * 0.02)
      .to(trail, {
        opacity: 0,
        x: -i * 30,
        y: i * 10,
        duration: 8,
        ease: "power2.in"
      }, 1 + i * 0.02)
    })
    
    // Exit sequence
    tl.to(meteorContainer, {
      scale: 0.1,
      opacity: 0,
      duration: 2,
      ease: "power3.in"
    }, 11)
    
    // Ambient animations
    gsap.to(starfield, {
      backgroundPosition: "400px 400px",
      duration: 30,
      repeat: -1,
      ease: "none"
    })
    
    gsap.to(meteor, {
      rotation: 360,
      duration: 5,
      repeat: -1,
      ease: "none"
    })
    
    setIsReady(true)
    
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
  
  const restartAnimation = () => {
    if (animationRef.current) {
      animationRef.current.restart()
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
    restartAnimation,
    seekTo,
    isReady
  }
}

// Standalone component
export const MorphingMeteorSequence: React.FC<MorphingMeteorAnimationProps> = (props) => {
  const { isReady } = useMorphingMeteorAnimation(props)
  
  return null
}
