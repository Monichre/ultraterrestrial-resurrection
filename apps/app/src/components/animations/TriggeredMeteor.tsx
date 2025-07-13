'use client'

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, MotionPathPlugin)
}

export interface MeteorAnimationRef {
  trigger: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

interface TriggeredMeteorProps {
  images?: string[]
  onComplete?: () => void
  duration?: number
  path?: 'diagonal' | 'horizontal' | 'arc' | 'custom'
  customPath?: string
  startPosition?: { x: number; y: number }
  endPosition?: { x: number; y: number }
}

export const TriggeredMeteor = forwardRef<MeteorAnimationRef, TriggeredMeteorProps>(({
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
  duration = 8,
  path = 'diagonal',
  customPath,
  startPosition = { x: -10, y: 20 },
  endPosition = { x: 110, y: 80 }
}, ref) => {
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const meteorRef = useRef<HTMLDivElement>(null)
  
  // Define path based on prop
  const getPath = () => {
    if (customPath) return customPath
    
    switch (path) {
      case 'horizontal':
        return `M ${startPosition.x} 50 L ${endPosition.x} 50`
      case 'arc':
        return `M ${startPosition.x} ${startPosition.y} Q 50 10, ${endPosition.x} ${endPosition.y}`
      case 'diagonal':
      default:
        return `M ${startPosition.x} ${startPosition.y} L ${endPosition.x} ${endPosition.y}`
    }
  }
  
  // Create animation
  useEffect(() => {
    if (!containerRef.current || !meteorRef.current) return
    
    // Create custom eases
    CustomEase.create("meteor", "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1")
    
    // Create timeline (paused initially)
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        setIsActive(false)
        if (onComplete) onComplete()
      }
    })
    
    timelineRef.current = tl
    
    // Set initial state
    tl.set(meteorRef.current, {
      scale: 0,
      opacity: 0
    })
    
    // Entrance
    tl.to(meteorRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    })
    
    // Motion along path
    .to(meteorRef.current, {
      motionPath: {
        path: getPath(),
        align: 'self',
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      duration: duration,
      ease: "meteor"
    }, 0)
    
    // Exit
    .to(meteorRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power3.in"
    }, duration - 0.5)
    
    // Morph between images
    const morphElements = containerRef.current.querySelectorAll('.meteor-shape')
    const morphDuration = duration / images.length
    
    morphElements.forEach((el, index) => {
      if (index === 0) {
        tl.set(el, { opacity: 1 }, 0)
      } else {
        const startTime = morphDuration * index
        
        // Fade out previous
        tl.to(morphElements[index - 1], {
          opacity: 0,
          scale: 0.8,
          duration: morphDuration / 2,
          ease: "power2.in"
        }, startTime - morphDuration / 2)
        
        // Fade in current
        tl.to(el, {
          opacity: 1,
          scale: 1,
          duration: morphDuration / 2,
          ease: "power2.out"
        }, startTime)
      }
    })
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [duration, images.length, path, startPosition, endPosition, customPath, onComplete])
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    trigger: () => {
      if (timelineRef.current && !isActive) {
        setIsActive(true)
        timelineRef.current.restart()
      }
    },
    pause: () => {
      if (timelineRef.current) {
        timelineRef.current.pause()
      }
    },
    resume: () => {
      if (timelineRef.current) {
        timelineRef.current.resume()
      }
    },
    reset: () => {
      if (timelineRef.current) {
        timelineRef.current.progress(0).pause()
        setIsActive(false)
      }
    }
  }))
  
  return (
    <div 
      ref={containerRef}
      className={`triggered-meteor-container ${isActive ? 'active' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s'
      }}
    >
      {/* SVG Path (invisible, for motion) */}
      <svg 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          visibility: 'hidden'
        }}
        viewBox="0 0 100 100"
      >
        <path
          id="meteor-motion-path"
          d={getPath()}
          fill="none"
          stroke="none"
        />
      </svg>
      
      {/* Meteor */}
      <div
        ref={meteorRef}
        className="meteor"
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          left: '0',
          top: '0',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: 'radial-gradient(circle, rgba(173,240,221,0.6) 0%, transparent 50%)',
            filter: 'blur(20px)',
            animation: 'pulse 2s infinite'
          }}
        />
        
        {/* Core */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: `
              0 0 50px rgba(173,240,221,0.8),
              0 0 100px rgba(255,107,107,0.6),
              inset 0 0 30px rgba(255,255,255,0.5)
            `
          }}
        >
          {/* Image layers */}
          {images.map((src, index) => (
            <div
              key={index}
              className="meteor-shape"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0,
                mixBlendMode: 'screen',
                filter: 'contrast(1.2) brightness(1.1)'
              }}
            />
          ))}
        </div>
        
        {/* Trail */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${100 - i * 8}px`,
              height: `${100 - i * 8}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle, 
                rgba(173,240,221,${0.3 - i * 0.03}) 0%, 
                rgba(255,107,107,${0.2 - i * 0.02}) 50%, 
                transparent 70%)`,
              filter: `blur(${i * 2}px)`,
              opacity: isActive ? 0.8 - i * 0.08 : 0,
              transform: `translate(-50%, -50%) translateX(${-i * 10}px)`,
              transition: 'opacity 0.3s, transform 0.3s'
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
})

TriggeredMeteor.displayName = 'TriggeredMeteor'

// Hook for easy usage
export function useTriggeredMeteor(props: TriggeredMeteorProps = {}) {
  const ref = useRef<MeteorAnimationRef>(null)
  
  const trigger = () => ref.current?.trigger()
  const pause = () => ref.current?.pause()
  const resume = () => ref.current?.resume()
  const reset = () => ref.current?.reset()
  
  return {
    ref,
    trigger,
    pause,
    resume,
    reset,
    MeteorComponent: () => <TriggeredMeteor ref={ref} {...props} />
  }
}
