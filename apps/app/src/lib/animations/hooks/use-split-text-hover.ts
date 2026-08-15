/**
 * useSplitTextHover Hook
 * 
 * Hook for creating animated hover effects on text using SplitText
 * Splits text into characters and animates them on hover
 */

import { useRef, useEffect, useCallback } from 'react'
import { SplitText } from 'gsap/SplitText'
import { createSplitText, createSplitTextHover } from '../gsap-utils'

export interface UseSplitTextHoverConfig {
  /**
   * Type of split (chars, words, or lines)
   */
  splitType?: 'chars' | 'words' | 'lines'
  /**
   * X offset for hover animation
   */
  xOffset?: number
  /**
   * Animation duration
   */
  duration?: number
  /**
   * Stagger delay between characters
   */
  stagger?: number
  /**
   * Enable/disable the hover effect
   */
  enabled?: boolean
}

export interface UseSplitTextHoverReturn {
  /**
   * Reference to attach to the text element
   */
  textRef: React.RefObject<HTMLElement>
  /**
   * The SplitText instance
   */
  splitText: SplitText | null
  /**
   * Manually trigger enter animation
   */
  triggerEnter: () => void
  /**
   * Manually trigger leave animation
   */
  triggerLeave: () => void
  /**
   * Revert split and cleanup
   */
  revert: () => void
}

/**
 * Hook for split text hover animations
 * 
 * @param config - Configuration options
 * @returns Text reference and control methods
 * 
 * @example
 * ```tsx
 * const { textRef } = useSplitTextHover({
 *   xOffset: 0.5,
 *   stagger: 0.015
 * });
 * 
 * return (
 *   <a href="#" ref={textRef}>
 *     Hover Me
 *   </a>
 * );
 * ```
 */
export function useSplitTextHover(
  config: UseSplitTextHoverConfig = {}
): UseSplitTextHoverReturn {
  const textRef = useRef<HTMLElement>( null )
  const splitTextRef = useRef<SplitText | null>( null )
  const hoverHandlersRef = useRef<{
    onEnter: () => void
    onLeave: () => void
  } | null>( null )

  const {
    splitType = 'chars',
    xOffset = 0.5,
    duration = 0.64,
    stagger = 0.015,
    enabled = true,
  } = config

  /**
   * Initialize SplitText
   */
  useEffect( () => {
    if ( !textRef.current || !enabled ) return

    // Create split text instance
    splitTextRef.current = createSplitText( textRef.current, splitType )

    // Create hover handlers
    hoverHandlersRef.current = createSplitTextHover( splitTextRef.current, {
      xOffset,
      duration,
      stagger,
    } )

    // Add event listeners
    const element = textRef.current
    const handlers = hoverHandlersRef.current

    element.addEventListener( 'mouseenter', handlers.onEnter )
    element.addEventListener( 'mouseleave', handlers.onLeave )

    // Cleanup
    return () => {
      element.removeEventListener( 'mouseenter', handlers.onEnter )
      element.removeEventListener( 'mouseleave', handlers.onLeave )

      if ( splitTextRef.current ) {
        splitTextRef.current.revert()
        splitTextRef.current = null
      }
    }
  }, [splitType, xOffset, duration, stagger, enabled] )

  /**
   * Manually trigger enter animation
   */
  const triggerEnter = useCallback( () => {
    hoverHandlersRef.current?.onEnter()
  }, [] )

  /**
   * Manually trigger leave animation
   */
  const triggerLeave = useCallback( () => {
    hoverHandlersRef.current?.onLeave()
  }, [] )

  /**
   * Revert split and cleanup
   */
  const revert = useCallback( () => {
    if ( splitTextRef.current ) {
      splitTextRef.current.revert()
      splitTextRef.current = null
    }
  }, [] )

  return {
    textRef,
    splitText: splitTextRef.current,
    triggerEnter,
    triggerLeave,
    revert,
  }
}

