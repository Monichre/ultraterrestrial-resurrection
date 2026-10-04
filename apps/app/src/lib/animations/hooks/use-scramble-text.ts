/**
 * useScrambleText Hook
 * 
 * Hook for creating scramble text animations on elements
 * Provides methods for scrambling, glitching, and revealing text
 */

import { useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import {
  createScrambleTextAnim,
  ANIMATION_CONSTANTS,
  type ScrambleTextConfig,
} from '../gsap-utils'

// Register plugin
if ( typeof window !== 'undefined' ) {
  gsap.registerPlugin( ScrambleTextPlugin )
}

export interface UseScrambleTextConfig {
  /**
   * Characters to use for scrambling
   */
  scrambleChars?: string
  /**
   * Default animation duration
   */
  duration?: number
  /**
   * Auto-store original text on mount
   */
  autoStore?: boolean
}

export interface UseScrambleTextReturn {
  /**
   * Reference to attach to the text element
   */
  textRef: React.RefObject<HTMLElement>
  /**
   * Scramble text to reveal the target text
   */
  scramble: ( text: string, config?: Partial<ScrambleTextConfig> ) => gsap.core.Tween
  /**
   * Quick glitch effect
   */
  glitch: ( duration?: number ) => gsap.core.Tween
  /**
   * Reveal original text with scramble effect
   */
  reveal: ( config?: Partial<ScrambleTextConfig> ) => gsap.core.Tween
  /**
   * Store current text as original
   */
  storeOriginalText: () => void
  /**
   * Get stored original text
   */
  getOriginalText: () => string
  /**
   * Clear text content
   */
  clear: () => void
}

/**
 * Hook for scramble text animations
 * 
 * @param config - Configuration options
 * @returns Text reference and animation methods
 * 
 * @example
 * ```tsx
 * const { textRef, scramble, glitch } = useScrambleText({
 *   autoStore: true
 * });
 * 
 * return (
 *   <span ref={textRef} onClick={() => scramble('New Text!')}>
 *     Original Text
 *   </span>
 * );
 * ```
 */
export function useScrambleText(
  config: UseScrambleTextConfig = {}
): UseScrambleTextReturn {
  const textRef = useRef<HTMLElement>( null )
  const originalTextRef = useRef<string>( '' )
  const currentAnimationRef = useRef<gsap.core.Tween | null>( null )

  const {
    scrambleChars = ANIMATION_CONSTANTS.SPECIAL_CHARS,
    duration = 0.8,
    autoStore = true,
  } = config

  // Store original text on mount
  useEffect( () => {
    if ( autoStore && textRef.current ) {
      const text = textRef.current.textContent || ''
      originalTextRef.current = text
      textRef.current.setAttribute( 'data-original-text', text )
    }
  }, [autoStore] )

  /**
   * Store current text as original
   */
  const storeOriginalText = useCallback( () => {
    if ( textRef.current ) {
      const text = textRef.current.textContent || ''
      originalTextRef.current = text
      textRef.current.setAttribute( 'data-original-text', text )
    }
  }, [] )

  /**
   * Get stored original text
   */
  const getOriginalText = useCallback( () => {
    if ( originalTextRef.current ) {
      return originalTextRef.current
    }
    return textRef.current?.getAttribute( 'data-original-text' ) || ''
  }, [] )

  /**
   * Clear text content
   */
  const clear = useCallback( () => {
    if ( textRef.current ) {
      textRef.current.textContent = ''
    }
  }, [] )

  /**
   * Scramble text to reveal target text
   */
  const scramble = useCallback(
    ( text: string, scrambleConfig?: Partial<ScrambleTextConfig> ) => {
      // Kill any existing animation
      if ( currentAnimationRef.current ) {
        currentAnimationRef.current.kill()
      }

      const element = textRef.current
      if ( !element ) {
        // Return dummy tween if element doesn't exist
        return gsap.to( {}, { duration: 0 } )
      }

      const animConfig = createScrambleTextAnim( {
        text,
        chars: scrambleConfig?.chars ?? scrambleChars,
        revealDelay: scrambleConfig?.revealDelay ?? 0,
        speed: scrambleConfig?.speed ?? 0.3,
      } )

      currentAnimationRef.current = gsap.to( element, {
        duration,
        ...animConfig,
      } )

      return currentAnimationRef.current
    },
    [scrambleChars, duration]
  )

  /**
   * Quick glitch effect
   */
  const glitch = useCallback(
    ( glitchDuration: number = 0.2 ) => {
      const element = textRef.current
      const text = element?.textContent || getOriginalText()

      if ( !element || !text ) {
        return gsap.to( {}, { duration: 0 } )
      }

      // Kill any existing animation
      if ( currentAnimationRef.current ) {
        currentAnimationRef.current.kill()
      }

      const animConfig = createScrambleTextAnim( {
        text,
        chars: scrambleChars,
        revealDelay: 0,
        speed: 0.1,
      } )

      currentAnimationRef.current = gsap.to( element, {
        duration: glitchDuration,
        ...animConfig,
        repeat: 1,
      } )

      return currentAnimationRef.current
    },
    [scrambleChars, getOriginalText]
  )

  /**
   * Reveal original text with scramble effect
   */
  const reveal = useCallback(
    ( scrambleConfig?: Partial<ScrambleTextConfig> ) => {
      const originalText = getOriginalText()
      return scramble( originalText, scrambleConfig )
    },
    [scramble, getOriginalText]
  )

  // Cleanup on unmount
  useEffect( () => {
    return () => {
      if ( currentAnimationRef.current ) {
        currentAnimationRef.current.kill()
      }
    }
  }, [] )

  return {
    textRef,
    scramble,
    glitch,
    reveal,
    storeOriginalText,
    getOriginalText,
    clear,
  }
}

