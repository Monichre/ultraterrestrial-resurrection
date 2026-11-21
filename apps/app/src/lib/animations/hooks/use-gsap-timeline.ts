/**
 * useGSAPTimeline Hook
 * 
 * Custom hook for managing GSAP timelines with React lifecycle
 * Handles cleanup and provides timeline controls
 */

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

export interface UseGSAPTimelineConfig {
  paused?: boolean
  autoRemoveChildren?: boolean
  onComplete?: () => void
  onStart?: () => void
  onUpdate?: () => void
  onRepeat?: () => void
  onReverseComplete?: () => void
}

export interface UseGSAPTimelineReturn {
  timeline: gsap.core.Timeline | null
  play: () => void
  pause: () => void
  restart: () => void
  reverse: () => void
  seek: ( time: number | string ) => void
  progress: ( value?: number ) => number | void
  isActive: () => boolean
  kill: () => void
}

/**
 * Hook for creating and managing a GSAP timeline with React
 * 
 * @param config - Timeline configuration
 * @returns Timeline instance and control methods
 * 
 * @example
 * ```tsx
 * const { timeline, play, pause } = useGSAPTimeline({
 *   paused: true,
 *   onComplete: () => console.log('Animation complete')
 * });
 * 
 * useEffect(() => {
 *   if (timeline) {
 *     timeline.to('.element', { x: 100 });
 *     play();
 *   }
 * }, [timeline]);
 * ```
 */
export function useGSAPTimeline(
  config: UseGSAPTimelineConfig = {}
): UseGSAPTimelineReturn {
  const timelineRef = useRef<gsap.core.Timeline | null>( null )
  const configRef = useRef( config )

  // Update config ref when it changes
  useEffect( () => {
    configRef.current = config
  }, [config] )

  // Initialize timeline
  useEffect( () => {
    timelineRef.current = gsap.timeline( {
      paused: config.paused ?? true,
      autoRemoveChildren: config.autoRemoveChildren ?? true,
      onComplete: config.onComplete,
      onStart: config.onStart,
      onUpdate: config.onUpdate,
      onRepeat: config.onRepeat,
      onReverseComplete: config.onReverseComplete,
    } )

    // Cleanup on unmount
    return () => {
      if ( timelineRef.current ) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
    }
  }, [] )

  // Control methods
  const play = useCallback( () => {
    timelineRef.current?.play()
  }, [] )

  const pause = useCallback( () => {
    timelineRef.current?.pause()
  }, [] )

  const restart = useCallback( () => {
    timelineRef.current?.restart()
  }, [] )

  const reverse = useCallback( () => {
    timelineRef.current?.reverse()
  }, [] )

  const seek = useCallback( ( time: number | string ) => {
    timelineRef.current?.seek( time )
  }, [] )

  const progress = useCallback( ( value?: number ) => {
    if ( value !== undefined ) {
      timelineRef.current?.progress( value )
      return
    }
    return timelineRef.current?.progress() ?? 0
  }, [] )

  const isActive = useCallback( () => {
    return timelineRef.current?.isActive() ?? false
  }, [] )

  const kill = useCallback( () => {
    timelineRef.current?.kill()
  }, [] )

  return {
    timeline: timelineRef.current,
    play,
    pause,
    restart,
    reverse,
    seek,
    progress,
    isActive,
    kill,
  }
}

