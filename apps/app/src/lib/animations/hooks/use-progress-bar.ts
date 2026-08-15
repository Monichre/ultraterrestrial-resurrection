/**
 * useProgressBar Hook
 * 
 * Hook for managing progress bar state and animations
 * Syncs with GSAP timeline progress
 */

import { useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'

export interface UseProgressBarConfig {
  /**
   * Timeline to sync progress with
   */
  timeline?: gsap.core.Timeline | null
  /**
   * Callback when progress updates
   */
  onUpdate?: ( progress: number ) => void
  /**
   * Duration for smooth transitions between progress values
   */
  transitionDuration?: number
}

export interface UseProgressBarReturn {
  /**
   * Current progress value (0-100)
   */
  progress: number
  /**
   * Set progress value directly
   */
  setProgress: ( value: number ) => void
  /**
   * Animate progress to a specific value
   */
  animateProgress: ( value: number, duration?: number ) => void
  /**
   * Reset progress to 0
   */
  reset: () => void
  /**
   * Reference to the progress element
   */
  progressRef: React.RefObject<HTMLDivElement>
}

/**
 * Hook for managing animated progress bar
 * 
 * @param config - Configuration options
 * @returns Progress state and control methods
 * 
 * @example
 * ```tsx
 * const { progress, progressRef, setProgress } = useProgressBar({
 *   timeline: myTimeline,
 *   onUpdate: (p) => console.log(`Progress: ${p}%`)
 * });
 * 
 * return (
 *   <div className="progress-container">
 *     <div 
 *       ref={progressRef}
 *       className="progress-bar"
 *       style={{ width: `${progress}%` }}
 *     />
 *   </div>
 * );
 * ```
 */
export function useProgressBar(
  config: UseProgressBarConfig = {}
): UseProgressBarReturn {
  const progressRef = useRef<HTMLDivElement>( null )
  const progressValueRef = useRef( 0 )
  const animationRef = useRef<gsap.core.Tween | null>( null )

  const { timeline, onUpdate, transitionDuration = 0.3 } = config

  // Sync with timeline progress
  useEffect( () => {
    if ( !timeline ) return

    const updateProgress = () => {
      const timelineProgress = timeline.progress() * 100
      progressValueRef.current = Math.min( 99, timelineProgress )

      if ( progressRef.current ) {
        progressRef.current.style.width = `${progressValueRef.current}%`
      }

      onUpdate?.( progressValueRef.current )
    }

    // Add update callback to timeline
    timeline.eventCallback( 'onUpdate', updateProgress )

    return () => {
      timeline.eventCallback( 'onUpdate', null )
    }
  }, [timeline, onUpdate] )

  /**
   * Set progress value directly without animation
   */
  const setProgress = useCallback( ( value: number ) => {
    const clampedValue = Math.max( 0, Math.min( 100, value ) )
    progressValueRef.current = clampedValue

    if ( progressRef.current ) {
      progressRef.current.style.transition = 'none'
      progressRef.current.style.width = `${clampedValue}%`
    }

    onUpdate?.( clampedValue )
  }, [onUpdate] )

  /**
   * Animate progress to a specific value
   */
  const animateProgress = useCallback(
    ( value: number, duration?: number ) => {
      // Kill any existing animation
      if ( animationRef.current ) {
        animationRef.current.kill()
      }

      const clampedValue = Math.max( 0, Math.min( 100, value ) )
      const animDuration = duration ?? transitionDuration

      if ( progressRef.current ) {
        animationRef.current = gsap.to( progressValueRef, {
          current: clampedValue,
          duration: animDuration,
          ease: 'power2.out',
          onUpdate: () => {
            if ( progressRef.current ) {
              progressRef.current.style.width = `${progressValueRef.current}%`
            }
            onUpdate?.( progressValueRef.current )
          },
        } )
      }
    },
    [transitionDuration, onUpdate]
  )

  /**
   * Reset progress to 0
   */
  const reset = useCallback( () => {
    setProgress( 0 )
  }, [setProgress] )

  // Cleanup on unmount
  useEffect( () => {
    return () => {
      if ( animationRef.current ) {
        animationRef.current.kill()
      }
    }
  }, [] )

  return {
    progress: progressValueRef.current,
    setProgress,
    animateProgress,
    reset,
    progressRef,
  }
}

