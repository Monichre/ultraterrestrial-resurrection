// ./src/components/timeline/Timeline.tsx
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'



/* The following eases are Club GSAP perks */

/* The following plugins are Club GSAP perks */

import '@/lib/gsap/inertia.js'



// Register GSAP plugins
if ( typeof window !== 'undefined' ) {
  gsap.registerPlugin( ScrollTrigger, Draggable )
}

interface TimelineEvent {
  year: string
  title: string
  imageUrl: string
}

interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

export const Timeline: React.FC<TimelineProps> = ( { events, className } ) => {
  const trackRef = useRef<HTMLDivElement>( null )
  const navLinksRef = useRef<( HTMLAnchorElement | null )[]>( [] )
  const sectionsRef = useRef<( HTMLElement | null )[]>( [] )

  useEffect( () => {
    if ( typeof window === 'undefined' ) return

    const track = trackRef.current
    const navLinks = navLinksRef.current.filter( Boolean ) as HTMLAnchorElement[]
    const sections = sectionsRef.current.filter( Boolean ) as HTMLElement[]

    if ( !track || navLinks.length === 0 || sections.length === 0 ) return

    const prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' )

    const lastItemWidth = () => navLinks[navLinks.length - 1].offsetWidth
    const getUseableHeight = () => document.documentElement.offsetHeight - window.innerHeight
    const getDraggableWidth = () => ( track.offsetWidth * 0.5 ) - lastItemWidth()

    // Create the main timeline animation
    const tl = gsap.timeline()
      .to( track, {
        x: () => getDraggableWidth() * -1,
        ease: 'none'
      } )

    // Create ScrollTrigger
    const st = ScrollTrigger.create( {
      animation: tl,
      scrub: 0,
    } )

    // Create Draggable instance
    const updatePosition = () => {
      const left = track.getBoundingClientRect().left * -1
      const width = getDraggableWidth()
      const useableHeight = getUseableHeight()
      const y = gsap.utils.mapRange( 0, width, 0, useableHeight, left )
      st.scroll( y )
    }

    const draggableInstance = Draggable.create( track, {
      type: 'x',
      inertia: true,
      bounds: {
        minX: 0,
        maxX: getDraggableWidth() * -1
      },
      edgeResistance: 1,
      onDragStart: () => st.disable(),
      onDragEnd: () => st.enable(),
      onDrag: updatePosition,
      onThrowUpdate: updatePosition
    } )

    // Initialize section animations
    const initSectionAnimation = () => {
      if ( prefersReducedMotion.matches ) return

      sections.forEach( ( section, index ) => {
        const heading = section.querySelector( 'h2' )
        const image = section.querySelector( '.section__image' )

        gsap.set( heading, {
          opacity: 0,
          y: 50
        } )
        gsap.set( image, {
          opacity: 0,
          rotateY: 15
        } )

        const sectionTl = gsap.timeline( {
          scrollTrigger: {
            trigger: section,
            start: () => 'top center',
            end: () => `+=${window.innerHeight}`,
            toggleActions: 'play reverse play reverse',
          }
        } )

        sectionTl
          .to( image, {
            opacity: 1,
            rotateY: -5,
            duration: 6,
            ease: 'elastic'
          } )
          .to( heading, {
            opacity: 1,
            y: 0,
            duration: 2
          }, 0.5 )

        gsap.timeline( {
          scrollTrigger: {
            trigger: section,
            start: 'top 20px',
            end: () => `bottom top`,
            toggleActions: 'play none play reverse',
            onToggle: ( { isActive } ) => {
              const sectionLink = navLinks[index]
              if ( isActive ) {
                sectionLink.classList.add( 'is-active' )
              } else {
                sectionLink.classList.remove( 'is-active' )
              }
            }
          }
        } )
      } )
    }

    initSectionAnimation()

    // Keyboard navigation
    const handleKeyUp = ( e: KeyboardEvent ) => {
      const target = e.target as HTMLElement
      const id = target.getAttribute( 'href' )
      if ( !id || e.key !== 'Tab' ) return

      const section = document.querySelector( id )
      if ( !section ) return

      const y = section.getBoundingClientRect().top + window.scrollY
      st.scroll( y )
    }

    track.addEventListener( 'keyup', handleKeyUp )

    // Cleanup
    return () => {
      track.removeEventListener( 'keyup', handleKeyUp )
      st.kill()
      draggableInstance[0].kill()
    }
  }, [events] )

  return (
    <main className={className}>
      <nav className="timeline-nav">
        <div ref={trackRef} className="timeline-nav__track">
          {events.map( ( event, index ) => (
            <a
              key={index}
              ref={el => navLinksRef.current[index] = el}
              href={`#section_${index + 1}`}
              data-link
              className="timeline-nav__link"
            >
              {event.year}
            </a>
          ) )}
        </div>
      </nav>
      {events.map( ( event, index ) => (
        <section
          key={index}
          id={`section_${index + 1}`}
          ref={el => sectionsRef.current[index] = el}
          style={{ '--i': index } as React.CSSProperties}
        >
          <div className="container">
            <h2 className="section__heading">
              <span>{event.year}</span>
              <span>{event.title}</span>
            </h2>
            <div className="section__image">
              <img src={event.imageUrl} width="1200" height="1200" alt={event.title} />
            </div>
          </div>


        </section>
      ) )}
    </main>
  )
}
