'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, MutableRefObject } from 'react'

interface AnimationRefs {
  container: MutableRefObject<HTMLDivElement | null>
  moon: MutableRefObject<HTMLDivElement | null>
  earth: MutableRefObject<HTMLDivElement | null>
  nav: MutableRefObject<HTMLDivElement | null>
  title: MutableRefObject<HTMLDivElement | null>
  stars: MutableRefObject<HTMLDivElement | null>
  shootingStars: MutableRefObject<HTMLDivElement | null>
  cursor: MutableRefObject<HTMLDivElement | null>
}

export const useHomeAnimations = () => {
  const refs: AnimationRefs = {
    container: useRef<HTMLDivElement>( null ),
    moon: useRef<HTMLDivElement>( null ),
    earth: useRef<HTMLDivElement>( null ),
    nav: useRef<HTMLDivElement>( null ),
    title: useRef<HTMLDivElement>( null ),
    stars: useRef<HTMLDivElement>( null ),
    shootingStars: useRef<HTMLDivElement>( null ),
    cursor: useRef<HTMLDivElement>( null ),
  }

  useGSAP( () => {
    // Register GSAP plugins if needed
    // gsap.registerPlugin(ScrollTrigger, etc.)

    // Create main timeline
    const tl = gsap.timeline( {
      defaults: {
        ease: 'power3.out',
        duration: 1.2
      },
      onComplete: () => {
        // Start continuous animations after intro
        startContinuousAnimations()
      }
    } )

    // Set initial states
    gsap.set( [
      refs.moon.current,
      refs.earth.current,
      refs.nav.current,
      refs.title.current,
      refs.stars.current,
      refs.shootingStars.current,
      refs.cursor.current
    ], {
      opacity: 0,
      scale: 0.8,
    } )

    // Specific initial states
    gsap.set( refs.moon.current, {
      y: -200,
      rotation: -180,
    } )

    gsap.set( refs.earth.current, {
      scale: 0,
      rotation: -90,
    } )

    gsap.set( refs.nav.current, {
      y: -100,
    } )

    gsap.set( refs.title.current, {
      scale: 0.5,
      y: 50,
    } )

    // Animation sequence
    tl
      // 1. Stars background fade in
      .to( refs.stars.current, {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: 'power2.inOut',
      } )

      // 2. Moon entrance with rotation
      .to( refs.moon.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 2,
        ease: 'elastic.out(1, 0.5)',
      }, '-=1.5' )

      // 3. Earth scales up with bounce
      .to( refs.earth.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 2.5,
        ease: 'elastic.out(1, 0.3)',
        onUpdate: function () {
          // Add subtle glow effect during scale
          const progress = this.progress()
          if ( refs.earth.current ) {
            refs.earth.current.style.filter = `drop-shadow(0 0 ${30 * progress}px rgba(59, 130, 246, 0.5))`
          }
        }
      }, '-=1.8' )

      // 4. Cosmic navigation slides down
      .to( refs.nav.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
      }, '-=1.5' )

      // 5. Title animation with letter stagger
      .to( refs.title.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power4.out',
        onStart: () => {
          // Animate individual letters if title has them
          animateTitleLetters()
        }
      }, '-=1' )

      // 6. Shooting stars and cursor fade in
      .to( [refs.shootingStars.current, refs.cursor.current], {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out',
      }, '-=0.5' )

    // Letter animation for title
    function animateTitleLetters() {
      const titleElement = refs.title.current
      if ( !titleElement ) return

      const letters = titleElement.querySelectorAll( '.letter' )
      if ( letters.length > 0 ) {
        gsap.fromTo( letters,
          {
            opacity: 0,
            y: 30,
            rotationX: -90,
            transformOrigin: '50% 50%',
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: {
              each: 0.05,
              from: 'center',
              ease: 'power2.inOut',
            },
            ease: 'back.out(1.7)',
          }
        )
      }
    }

    // Continuous animations after intro
    function startContinuousAnimations() {
      // Moon floating animation
      if ( refs.moon.current ) {
        gsap.to( refs.moon.current, {
          y: '+=30',
          rotation: '+=10',
          duration: 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        } )
      }

      // Earth rotation
      if ( refs.earth.current ) {
        gsap.to( refs.earth.current, {
          rotation: '+=360',
          duration: 120,
          ease: 'none',
          repeat: -1,
        } )
      }

      // Title subtle pulse
      if ( refs.title.current ) {
        gsap.to( refs.title.current, {
          scale: 1.05,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        } )
      }

      // Parallax effect on mouse move
      setupParallaxEffect()
    }

    // Parallax mouse effect
    function setupParallaxEffect() {
      const handleMouseMove = ( e: MouseEvent ) => {
        const { clientX, clientY } = e
        const xPos = ( clientX / window.innerWidth - 0.5 ) * 2
        const yPos = ( clientY / window.innerHeight - 0.5 ) * 2

        // Different parallax speeds for each element
        if ( refs.moon.current ) {
          gsap.to( refs.moon.current, {
            x: xPos * 50,
            y: yPos * 30,
            duration: 1,
            ease: 'power2.out',
          } )
        }

        if ( refs.stars.current ) {
          gsap.to( refs.stars.current, {
            x: xPos * -20,
            y: yPos * -15,
            duration: 1.5,
            ease: 'power2.out',
          } )
        }

        if ( refs.title.current ) {
          gsap.to( refs.title.current, {
            x: xPos * 15,
            y: yPos * 10,
            duration: 0.8,
            ease: 'power2.out',
          } )
        }
      }

      window.addEventListener( 'mousemove', handleMouseMove )

      // Cleanup
      return () => {
        window.removeEventListener( 'mousemove', handleMouseMove )
      }
    }

    // Add scroll-triggered animations if needed
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Scale earth based on scroll
      if ( refs.earth.current && scrollY < windowHeight ) {
        const scale = 1 + ( scrollY / windowHeight ) * 0.2
        gsap.to( refs.earth.current, {
          scale,
          duration: 0.3,
        } )
      }
    }

    window.addEventListener( 'scroll', handleScroll )

    // Cleanup
    return () => {
      window.removeEventListener( 'scroll', handleScroll )
    }
  }, { scope: refs.container } )

  return refs
} 