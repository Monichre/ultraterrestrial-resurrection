'use client'

import {useEffect, useRef} from 'react'
import {gsap} from 'gsap'
import {CustomEase} from 'gsap/CustomEase'

// Register GSAP plugins
gsap.registerPlugin(CustomEase)

export const useUltraterrestrialAnimation = () => {
  const animationRef = useRef(null)

  useEffect(() => {
    // Create custom eases for cinematic feel
    CustomEase.create(
      'cosmic',
      'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,0.996 0.818,1.001 1,1'
    )

    // Master timeline
    const tl = gsap.timeline({
      defaults: {ease: 'power2.inOut'},
      onStart: () => {
        console.log('Ultraterrestrial sequence initiated...')
      },
    })

    // Store the timeline reference
    animationRef.current = tl

    // Phase 1: Darkness & Mystery (0-3s)
    tl.set('.app-container', {
      backgroundColor: '#000000',
      visibility: 'visible',
    })
      .set('.earth-container, .moon-container', {
        opacity: 0,
        scale: 0.1,
        rotationY: -180,
      })
      .set('.nav-container', {
        opacity: 0,
        y: -100,
      })
      .set('.hero-content', {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(20px)',
      })

    // Create light flashes
    for (let i = 0; i < 5; i++) {
      tl.to(
        '.flash-overlay',
        {
          opacity: gsap.utils.random(0.1, 0.3),
          duration: 0.1,
          repeat: 1,
          yoyo: true,
          ease: 'power4.in',
        },
        i * 0.4
      )
    }

    // Phase 2: Orb manifestations (1-4s)
    const orbPositions = [
      {x: '20%', y: '30%'},
      {x: '70%', y: '20%'},
      {x: '50%', y: '60%'},
      {x: '80%', y: '70%'},
      {x: '30%', y: '80%'},
    ]

    orbPositions.forEach((pos, i) => {
      tl.fromTo(
        `.orb-${i}`,
        {
          opacity: 0,
          scale: 0,
          x: pos.x,
          y: pos.y,
          filter: 'blur(50px)',
        },
        {
          opacity: 0.7,
          scale: gsap.utils.random(0.5, 1.5),
          duration: 1.5,
          filter: 'blur(0px)',
          ease: 'cosmic',
          stagger: 0.2,
        },
        1 + i * 0.3
      ).to(
        `.orb-${i}`,
        {
          x: '50%',
          y: '50%',
          scale: 0,
          opacity: 0,
          duration: 2,
          ease: 'power2.in',
        },
        3
      )
    })

    // Phase 3: Cosmic reveal with camera movement (3-7s)
    tl.to(
      '.camera-container',
      {
        z: 1000,
        rotationX: 360,
        duration: 4,
        ease: 'power2.inOut',
      },
      3
    )
      .to(
        '.stars-background',
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: 'power1.out',
        },
        3.5
      )
      .fromTo(
        '.earth-container',
        {
          opacity: 0,
          scale: 0.1,
          z: -5000,
          rotationY: -720,
        },
        {
          opacity: 1,
          scale: 1,
          z: 0,
          rotationY: 0,
          duration: 3,
          ease: 'cosmic',
        },
        4
      )
      .fromTo(
        '.moon-container',
        {
          opacity: 0,
          scale: 0.05,
          x: -2000,
          rotationY: 360,
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          rotationY: 0,
          duration: 2.5,
          ease: 'power3.out',
        },
        5
      )

    // Phase 4: Fly-to sequence (6-9s)
    tl.to(
      '.camera-container',
      {
        z: 200,
        x: 50,
        y: -30,
        duration: 3,
        ease: 'power2.inOut',
      },
      6
    )
      .to(
        '.earth-container',
        {
          rotationY: 90,
          rotationX: 23.5,
          duration: 3,
          ease: 'power1.inOut',
        },
        6
      )
      .to(
        '.moon-container',
        {
          x: 300,
          y: -100,
          scale: 0.8,
          duration: 3,
          ease: 'power2.inOut',
        },
        6
      )

    // Phase 5: UI Elements entrance (8-10s)
    tl.to(
      '.nav-container',
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
      },
      8
    )
      .to(
        '.hero-content',
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power2.out',
        },
        8.5
      )
      .fromTo(
        '.cta-buttons > *',
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        },
        9
      )

    // Ambient animations after main sequence
    tl.to(
      '.earth-container',
      {
        rotationY: 360,
        duration: 60,
        repeat: -1,
        ease: 'none',
      },
      10
    ).to(
      '.moon-container',
      {
        rotationY: -360,
        duration: 30,
        repeat: -1,
        ease: 'none',
      },
      10
    )

    // Particle/dust effect
    tl.to(
      '.particle-field',
      {
        opacity: 0.3,
        duration: 2,
        ease: 'power1.out',
      },
      9
    )

    return () => {
      tl.kill()
    }
  }, [])

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

  return {
    pauseAnimation,
    resumeAnimation,
    restartAnimation,
  }
}

// Additional CSS classes needed for the animation
export const animationStyles = `
  .app-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    visibility: hidden;
    background-color: #000000;
  }
  
  .flash-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    pointer-events: none;
    mix-blend-mode: screen;
  }
  
  .orb-0, .orb-1, .orb-2, .orb-3, .orb-4 {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0) 70%);
    box-shadow: 0 0 50px rgba(255,255,255,0.8), 0 0 100px rgba(255,255,255,0.4);
    pointer-events: none;
    transform-origin: center;
  }
  
  .camera-container {
    perspective: 1000px;
    transform-style: preserve-3d;
  }
  
  .stars-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20% 30%, white, transparent),
      radial-gradient(2px 2px at 60% 70%, white, transparent),
      radial-gradient(1px 1px at 50% 50%, white, transparent);
    background-size: 200px 200px;
    opacity: 0;
  }
  
  .particle-field {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.1), transparent),
      radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.1), transparent);
    background-size: 50px 50px;
    opacity: 0;
    animation: float 20s infinite linear;
  }
  
  @keyframes float {
    0% { transform: translateY(0) translateX(0); }
    100% { transform: translateY(-100px) translateX(50px); }
  }
  
  .earth-container,
  .moon-container {
    transform-style: preserve-3d;
    will-change: transform, opacity;
  }
  
  .hero-content {
    position: relative;
    z-index: 10;
  }
  
  .cta-buttons > * {
    display: inline-block;
  }
`

// Helper component for orbs
export const AnimationOrbs = () => {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`orb-${i}`} />
      ))}
    </>
  )
}

// Helper component for overlays
export const AnimationOverlays = () => {
  return (
    <>
      <div className='flash-overlay' />
      <div className='stars-background' />
      <div className='particle-field' />
    </>
  )
}

// Default export required by Next.js App Router
export default function HomeAnimatedPage() {
  const {pauseAnimation, resumeAnimation, restartAnimation} = useUltraterrestrialAnimation()

  return (
    <div className='app-container'>
      {/* Inject scoped styles for the animation */}
      <style dangerouslySetInnerHTML={{__html: animationStyles}} />

      <div className='camera-container'>
        <div className='earth-container' />
        <div className='moon-container' />
      </div>

      <div className='nav-container' />

      <div className='hero-content'>
        <div className='cta-buttons'>
          <button onClick={restartAnimation}>Replay</button>
          <button onClick={pauseAnimation}>Pause</button>
          <button onClick={resumeAnimation}>Resume</button>
        </div>
      </div>

      <AnimationOrbs />
      <AnimationOverlays />
    </div>
  )
}
