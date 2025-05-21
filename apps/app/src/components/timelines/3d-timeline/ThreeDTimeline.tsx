// ./src/components/3d-timeline/ThreeDTimeline.tsx
import { cn } from "@/utils"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'

// Register GSAP plugins
if ( typeof window !== 'undefined' ) {
  gsap.registerPlugin( ScrollTrigger )
}

interface Slide {
  id: string
  image: string
  title?: string
}

interface ThreeDTimelineProps {
  slides: Slide[]
  className?: string
  showNavigation?: boolean
}

export const ThreeDTimeline: React.FC<ThreeDTimelineProps> = ( {
  slides,
  className,
  showNavigation = true,
} ) => {
  const containerRef = useRef<HTMLDivElement>( null )
  const slideRefs = useRef<( HTMLDivElement | null )[]>( [] )
  const activeSlideImagesRef = useRef<( HTMLImageElement | null )[]>( [] )

  useEffect( () => {
    if ( typeof window === 'undefined' ) return

    const slideElements = slideRefs.current.filter( Boolean ) as HTMLDivElement[]
    const activeSlideImages = activeSlideImagesRef.current.filter( Boolean ) as HTMLImageElement[]

    function getInitialTranslateZ( slide: HTMLElement ) {
      const style = window.getComputedStyle( slide )
      const matrix = style.transform.match( /matrix3d\((.+)\)/ )
      if ( matrix ) {
        const values = matrix[1].split( ", " )
        return parseFloat( values[14] ) || 0
      }
      return 0
    }

    function mapRange( value: number, inMin: number, inMax: number, outMin: number, outMax: number ) {
      return ( ( value - inMin ) * ( outMax - outMin ) ) / ( inMax - inMin ) + outMin
    }

    slideElements.forEach( ( slide, index ) => {
      const initialZ = getInitialTranslateZ( slide )

      ScrollTrigger.create( {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: ( self ) => {
          const progress = self.progress
          const zIncrement = progress * 22500
          const currentZ = initialZ + zIncrement

          let opacity
          if ( currentZ >= -2500 ) {
            opacity = mapRange( currentZ, -2500, 0, 0.5, 1 )
          } else {
            opacity = mapRange( currentZ, -5000, -2500, 0, 0.5 )
          }

          slide.style.opacity = opacity.toString()
          slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`

          if ( currentZ < 100 ) {
            gsap.to( activeSlideImages[index], {
              opacity: 1,
              duration: 1.5,
              ease: "power3.out",
            } )
          } else {
            gsap.to( activeSlideImages[index], {
              opacity: 0,
              duration: 1.5,
              ease: "power3.out",
            } )
          }
        },
      } )
    } )

    return () => {
      ScrollTrigger.getAll().forEach( trigger => trigger.kill() )
    }
  }, [slides] )

  return (
    <div className={cn( "relative min-h-screen overflow-hidden", className )}>
      {showNavigation && (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between p-8">
          <div className="flex gap-8">
            <a href="#" className="text-white/70 hover:text-white transition-colors">Works</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Archive</a>
          </div>
          <div className="text-white font-bold text-xl">
            <a href="#">Modavate</a>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-white/70 hover:text-white transition-colors">Info</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a>
          </div>
        </nav>
      )}

      <div ref={containerRef} className="container perspective-1000 h-[500vh]">
        <div className="active-slide fixed top-0 left-0 w-full h-screen flex items-center justify-center">
          {slides.map( ( slide, index ) => (
            <img
              key={`active-${slide.id}`}
              ref={el => activeSlideImagesRef.current[index] = el}
              src={slide.image}
              alt={slide.title || ''}
              className="absolute w-[40vw] h-auto opacity-0"
            />
          ) )}
        </div>

        {slides.map( ( slide, index ) => {
          const zPosition = -20000 + ( index * 2500 )
          const xPosition = index % 2 === 0 ? 30 : 70

          return (
            <div
              key={slide.id}
              ref={el => slideRefs.current[index] = el}
              className="slide fixed top-1/2 w-[40vw] aspect-[4/3]"
              style={{
                left: `${xPosition}%`,
                transform: `translateX(-50%) translateY(-50%) translateZ(${zPosition}px)`,
                opacity: index === slides.length - 1 ? 1 : 0,
              }}
            >
              <img
                src={slide.image}
                alt={slide.title || ''}
                className="w-full h-full object-cover"
              />
              {slide.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-white text-xl font-semibold">{slide.title}</h2>
                </div>
              )}
            </div>
          )
        } )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-between p-8 text-white/70">
        <p className="hover:text-white transition-colors cursor-pointer">Watch Showreel</p>
        <p>Launching 2024</p>
      </footer>
    </div>
  )
}
