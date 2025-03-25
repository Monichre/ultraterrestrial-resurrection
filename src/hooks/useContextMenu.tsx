// useContextMenu.ts
'use client'

import { useLongPress, useMouse } from '@uidotdev/usehooks'
import { useEffect, useRef, useState } from 'react'

interface MenuPosition {
  x: number
  y: number
}

export function useContextMenu() {
  const [mouse, ref]: any = useMouse()

  const [clickPosition, setClickPosition] = useState<MenuPosition | null>( null )
  const [isOpen, setIsOpen] = useState<boolean>( false )
  const targetRef = useRef<HTMLElement | null>( null )

  const xIntersecting = mouse.elementX > 0 && mouse.elementX < 300
  const yIntersecting = mouse.elementY > 0 && mouse.elementY < 300
  const isIntersecting = xIntersecting && yIntersecting

  const handlePositionChange = ( x: number, y: number ) => {
    if ( targetRef.current ) {
      const rect = targetRef.current.getBoundingClientRect()
      const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      // Note: setIsHovering is removed as it's not defined in the scope
    }
  }

  const handleContextMenu = ( event: any ) => {
    event.preventDefault()
    setClickPosition( { x: event.clientX, y: event.clientY } )
    setIsOpen( true )
  }
  const closeMenu = () => {
    setIsOpen( false )
    setClickPosition( null )
  }

  const attrs = useLongPress(
    () => {
      setIsOpen( true )
    },
    {
      onStart: ( event: any ) => {
        handleContextMenu( event )
      },
      onFinish: () => null,
      onCancel: () => null,
      threshold: 1000,
    }
  )

  useEffect( () => {
    if ( ref?.current ) {
      ref.current.addEventListener( 'contextmenu', handleContextMenu )
      ref.current.addEventListener( 'click', closeMenu )
    }
  }, [ref] )

  return {
    ref,
    mouse,
    clickPosition,
    attrs,
    isOpen,
    setIsOpen,
    targetRef,
    closeMenu,
  }
}
