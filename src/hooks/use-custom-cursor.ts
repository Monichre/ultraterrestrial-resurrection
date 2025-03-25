import { useEffect } from 'react'

export const useCustomCursor = () => {
  useEffect( () => {
    const cursorBig = document.querySelector( '.big' ) as HTMLElement
    const cursorSmall = document.querySelector( '.small' ) as HTMLElement
    const links = document.querySelectorAll( 'a' )

    const onMouseMove = ( e: MouseEvent ) => {
      if ( cursorBig ) {
        cursorBig.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
      }
      if ( cursorSmall ) {
        cursorSmall.style.left = `${e.clientX}px`
        cursorSmall.style.top = `${e.clientY}px`
      }
    }

    const onMouseDown = () => {
      cursorBig?.classList.add( 'click' )
      cursorSmall?.classList.add( 'hover__small' )
    }

    const onMouseUp = () => {
      cursorBig?.classList.remove( 'click' )
      cursorSmall?.classList.remove( 'hover__small' )
    }

    const onLinkHover = () => {
      cursorBig?.classList.add( 'hover__big' )
      cursorSmall?.classList.add( 'hover__small' )
    }

    const onLinkLeave = () => {
      cursorBig?.classList.remove( 'hover__big' )
      cursorSmall?.classList.remove( 'hover__small' )
    }

    document.addEventListener( 'mousemove', onMouseMove )
    document.addEventListener( 'mousedown', onMouseDown )
    document.addEventListener( 'mouseup', onMouseUp )

    links.forEach( link => {
      link.addEventListener( 'mouseover', onLinkHover )
      link.addEventListener( 'mouseleave', onLinkLeave )
    } )

    return () => {
      document.removeEventListener( 'mousemove', onMouseMove )
      document.removeEventListener( 'mousedown', onMouseDown )
      document.removeEventListener( 'mouseup', onMouseUp )

      links.forEach( link => {
        link.removeEventListener( 'mouseover', onLinkHover )
        link.removeEventListener( 'mouseleave', onLinkLeave )
      } )
    }
  }, [] )
} 