'use client'
import {useRef, useEffect, useState, useCallback} from 'react'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import './loader.css'
gsap.registerPlugin(useGSAP)
// Prop for onLoadComplete callback
interface SightingsLoaderProps {
  onLoadComplete?: () => void
  minDisplayTime?: number // Minimum time to display the loader in ms
}

export const SightingsLoader = ({
  onLoadComplete,
  minDisplayTime = 9000, // Set a default min display time that matches our animation duration
}: SightingsLoaderProps = {}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLHeadingElement>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const [startTime] = useState(Date.now())

  // Track if we should have started hiding the loader
  const shouldCompleteRef = useRef(false)

  // Function to calculate and simulate load progress
  const simulateProgress = useCallback(() => {
    // Simulate progress in a more controlled way
    // Progress faster at the beginning, slower towards the end
    setLoadProgress((prev) => {
      if (prev >= 100) return 100

      // Calculate next increment - smaller as we get closer to 100
      const remaining = 100 - prev
      const increment = Math.max(1, Math.floor(remaining * 0.1))
      const next = Math.min(99, prev + increment)

      return next
    })
  }, [])

  // Effect to handle the actual loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      simulateProgress()
    }, 300)

    // Resource loading detection
    // This detects when actual page resources are loaded
    const handleResourceLoad = () => {
      clearInterval(progressInterval)
      setLoadProgress(100)
    }

    // When window is fully loaded
    window.addEventListener('load', handleResourceLoad)

    // If the main component signals it's ready
    if (onLoadComplete) {
      const completeLoader = () => {
        shouldCompleteRef.current = true

        // Check if we've shown the loader for the minimum time
        const elapsedTime = Date.now() - startTime

        if (elapsedTime >= minDisplayTime && isAnimationComplete) {
          // If animations are done and min time passed, complete now
          onLoadComplete()
        } else {
          // Otherwise set the flag and let the animation finish
          setLoadProgress(100)
        }
      }

      // Set a fallback timer to ensure we eventually complete
      const fallbackTimer = setTimeout(completeLoader, 12000)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(fallbackTimer)
        window.removeEventListener('load', handleResourceLoad)
      }
    }

    return () => {
      clearInterval(progressInterval)
      window.removeEventListener('load', handleResourceLoad)
    }
  }, [onLoadComplete, isAnimationComplete, minDisplayTime, startTime, simulateProgress])

  // Counter animation that follows the loadProgress
  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = `${loadProgress}%`
    }

    // When we reach 100%, check if we should complete
    if (
      loadProgress === 100 &&
      shouldCompleteRef.current &&
      isAnimationComplete &&
      onLoadComplete
    ) {
      // Check if we've shown the loader for the minimum time
      const elapsedTime = Date.now() - startTime
      if (elapsedTime >= minDisplayTime) {
        onLoadComplete()
      }
    }
  }, [loadProgress, isAnimationComplete, onLoadComplete, minDisplayTime, startTime])

  // GSAP animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimationComplete(true)

          // Check if we should complete the loading
          if (shouldCompleteRef.current && loadProgress === 100 && onLoadComplete) {
            const elapsedTime = Date.now() - startTime
            if (elapsedTime >= minDisplayTime) {
              onLoadComplete()
            }
          }
        },
      })

      tl.from('.circles', 2, {
        top: '-100%',
        ease: 'elastic.out',
      })
        .to(
          '.circle-inner',
          1,
          {
            width: '75px',
            height: '75px',
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .to(
          '.circle-inner-rotator',
          1,
          {
            scale: 1,
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .to(
          '.circles',
          1.5,
          {
            rotation: 360,
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .to(
          '.block',
          0.75,
          {
            display: 'block',
            height: '200px',
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .to(
          '.block',
          0.75,
          {
            width: '800px',
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .fromTo(
          '.container',
          {
            scale: 0,
            opacity: 0,
            ease: 'power4.inOut',
          },
          {
            duration: 1,
            scale: 1,
            opacity: 1,
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .to(
          '.block',
          1.5,
          {
            width: '0px',
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .to(
          '.block',
          0.75,
          {
            height: '0px',
            ease: 'power4.inOut',
          },
          '+=0.5'
        )
        .to(
          '.circles',
          1.5,
          {
            rotation: 0,
            ease: 'power4.inOut',
          },
          '+=0.5'
        )

      // Final animation that hides the loader
      // Only trigger this when loadProgress reaches 100%
      if (loadProgress === 100) {
        tl.to(
          '.loader',
          2.5,
          {
            scale: 0,
            opacity: 0,
            ease: 'power4.inOut',
          },
          '+=0.5'
        ).to(
          '.container',
          2,
          {
            scale: 1,
            ease: 'power4.inOut',
          },
          '-=1.5'
        )
      }

      return () => {
        tl.kill()
      }
    },
    {scope: containerRef, dependencies: [loadProgress]}
  )

  return (
    <div className='loader' ref={containerRef}>
      <h1 className='counter' ref={counterRef}>
        {loadProgress}%
      </h1>

      <div className='circles'>
        <div className='circle circle-outer' />
        <div className='circle circle-inner' />
        <div className='circle-inner-rotator' />
        <div className='block' />
        <div className='half-circle' />
        <div className='half-circle' />
        <div className='half-circle' />
      </div>
    </div>
  )
}
