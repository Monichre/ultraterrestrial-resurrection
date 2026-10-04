'use client'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

export const Radar = ( { className, children }: any ) => {
  const circles = new Array( 8 ).fill( 1 )

  const [isOverlapping, setIsOverlapping] = useState( false )
  console.log( 'isOverlapping: ', isOverlapping )
  const [currentTargets, setCurrentTargets] = useState( [] as HTMLElement[] )

  console.log( 'currentTarget: ', currentTargets )
  const radarLine = useRef( null )

  useEffect( () => {
    const targets = Array.from( document.querySelectorAll( '.radar-target' ) )
    console.log( 'Initial targets: ', targets )

    const observer = new IntersectionObserver(
      ( entries: IntersectionObserverEntry[] ) => {
        const intersectingEntries = entries.filter(
          ( entry ) => entry.isIntersecting
        )
        console.log( 'Intersecting entries: ', intersectingEntries )

        intersectingEntries.forEach( ( entry ) => {
          entry.target.classList.add( 'bg-blue' )
        } )

        setCurrentTargets( ( prevTargets ) => [
          ...new Set( [
            ...prevTargets,
            ...intersectingEntries.map( ( entry ) => entry.target as HTMLElement ),
          ] ),
        ] )
      },
      { root: radarLine.current }
    )

    // Observe existing targets
    if ( targets.length ) {
      targets.forEach( ( target ) => observer.observe( target ) )
    }

    // MutationObserver to detect newly added targets
    const mutationObserver = new MutationObserver( ( mutationsList ) => {
      mutationsList.forEach( ( mutation ) => {
        if ( mutation.type === 'childList' ) {
          const addedNodes = Array.from( mutation.addedNodes ) as HTMLElement[]
          addedNodes.forEach( ( node ) => {
            if ( node.classList && node.classList.contains( 'radar-target' ) ) {
              observer.observe( node )
            }
          } )
        }
      } )
    } )

    mutationObserver.observe( document.body, { childList: true, subtree: true } )

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [] )

  return (
    <div
      className={` flex h-full w-full items-center justify-center rounded-full ${className}`}
    >
      <div
        style={{
          transformOrigin: 'right center',
        }}
        className='absolute right-1/2 top-1/2  z-40 flex h-[5px]
        overflow-hidden animate-radar-spin w-[400px]  items-end justify-center bg-transparent'
      >
        {/* Radar line that rotates */}
        <div
          className='relative z-40 h-[1px] w-full bg-gradient-to-r from-transparent  via-sky-600 to-transparent'
          ref={radarLine}
        />
      </div>
      {children}
      {/* concentric circles */}
      {circles.map( ( circle, idx ) => (
        <Circle
          style={{
            height: `${( idx + 1 ) * 5}rem`,
            width: `${( idx + 1 ) * 5}rem`,
            border: `1px solid rgba(71, 85, 105, ${1 - ( idx + 1 ) * 0.1})`,
          }}
          key={`motion-${idx}`}
          idx={idx}
        />
      ) )}
    </div>
  )
}

const Circle = ( { className, children, idx, ...rest }: any ) => {
  return (
    <motion.div
      {...rest}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: idx * 0.1,
        duration: 0.2,
        ease: 'easeInOut',
        // repeat: Infinity,
      }}
      className={
        'absolute inset-0 left-1/2 top-1/2 h-10 w-10  -translate-x-1/2 -translate-y-1/2 transform rounded-full border !border-dashed !border-[#78efff]'
      }
    ></motion.div>
  )
}
