'use client'

import {useEffect, useRef, useState} from 'react'
import {GeometricBackground} from './geometric-background'
import {SoundSystem} from './sound-system'
import {ScrollText} from './scroll-text'

interface ScrollSystemProps {
  children: React.ReactNode
}

export function ScrollSystem({children}: ScrollSystemProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentSection, setCurrentSection] = useState(1)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isInitialized) return

    // Import Lenis for smooth scrolling
    import('@studio-freight/lenis').then(({default: Lenis}) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical' as const,
        gestureDirection: 'vertical' as const,
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
      }
    })

    // Scroll handler
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(scrollY / maxScroll, 1)

      setScrollProgress(progress)

      // Determine current section
      const sectionHeight = window.innerHeight * 2
      if (scrollY < sectionHeight) setCurrentSection(1)
      else if (scrollY < sectionHeight * 2) setCurrentSection(2)
      else setCurrentSection(3)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isInitialized])

  const handleInitialize = () => {
    setIsInitialized(true)
  }

  if (!isInitialized) {
    return (
      <div className='fixed inset-0 z-50 bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='mb-8'>
            <div className='text-white/60 text-sm tracking-wider mb-4'>ENABLE AUDIO EXPERIENCE</div>
            <button
              onClick={handleInitialize}
              className='px-8 py-3 border border-white/20 text-white hover:bg-white/10 transition-colors tracking-wider text-sm'>
              ENTER
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className='relative'>
      <GeometricBackground scrollProgress={scrollProgress} />
      <SoundSystem currentSection={currentSection} />
      <ScrollText scrollProgress={scrollProgress} />

      {/* Main content sections */}
      <div className='relative z-10'>
        {/* Section 1 - Original cosmic landing */}
        <section className='h-screen relative'>{children}</section>

        {/* Section 2 - Extended cosmic journey */}
        <section className='h-[200vh] relative bg-gradient-to-b from-slate-900 via-blue-900 to-purple-900'>
          <div className='sticky top-0 h-screen flex items-center justify-center'>
            <div className='text-center text-white'>
              <h2 className='text-4xl md:text-6xl font-light tracking-wider mb-4 opacity-80'>
                THE JOURNEY
              </h2>
              <p className='text-lg md:text-xl tracking-wider opacity-60'>
                DEEPER INTO THE COSMIC REALM
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 - Infinite expansion */}
        <section className='h-[200vh] relative bg-gradient-to-b from-purple-900 via-indigo-900 to-black'>
          <div className='sticky top-0 h-screen flex items-center justify-center'>
            <div className='text-center text-white'>
              <h2 className='text-4xl md:text-6xl font-light tracking-wider mb-4 opacity-80'>
                TRANSCENDENCE
              </h2>
              <p className='text-lg md:text-xl tracking-wider opacity-60'>
                BEYOND THE BOUNDARIES OF SPACE AND TIME
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
