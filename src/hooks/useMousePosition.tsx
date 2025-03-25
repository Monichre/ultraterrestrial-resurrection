import { useState, useEffect, type RefObject } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition() {
  const [mousePosition, setMousePosition]: any = useState<MousePosition>( {
    x: 0,
    y: 0,
  } )

  useEffect( () => {
    const handleMouseMove = ( event: MouseEvent ) => {
      setMousePosition( { x: event.clientX, y: event.clientY } )
    }

    window.addEventListener( 'mousemove', handleMouseMove )

    return () => {
      window.removeEventListener( 'mousemove', handleMouseMove )
    }
  }, [] )

  return { mousePosition }
}




export const useFloatingMousePosition = ( containerRef?: RefObject<HTMLElement | SVGElement> ) => {
  const [position, setPosition] = useState( { x: 0, y: 0 } )

  useEffect( () => {
    const updatePosition = ( x: number, y: number ) => {
      if ( containerRef && containerRef.current ) {
        const rect = containerRef.current.getBoundingClientRect()
        const relativeX = x - rect.left
        const relativeY = y - rect.top

        // Calculate relative position even when outside the container
        setPosition( { x: relativeX, y: relativeY } )
      } else {
        setPosition( { x, y } )
      }
    }

    const handleMouseMove = ( ev: MouseEvent ) => {
      updatePosition( ev.clientX, ev.clientY )
    }

    const handleTouchMove = ( ev: TouchEvent ) => {
      const touch = ev.touches[0]
      updatePosition( touch.clientX, touch.clientY )
    }

    // Listen for both mouse and touch events
    window.addEventListener( "mousemove", handleMouseMove )
    window.addEventListener( "touchmove", handleTouchMove )

    return () => {
      window.removeEventListener( "mousemove", handleMouseMove )
      window.removeEventListener( "touchmove", handleTouchMove )
    }

  }, [containerRef] )

  return position
}
