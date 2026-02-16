/**
 * TerminalPreloader Component
 *
 * Animated terminal-style preloader with scramble text effects
 * and progress bar. Fully configurable and reusable.
 */

'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import gsap from 'gsap'
import {
  clipPaths,
  createScrambleTextAnim,
  createStaggeredFadeOut,
  storeOriginalText,
  ANIMATION_CONSTANTS,
} from '@/lib/animations/gsap-utils'
import {useGSAPTimeline} from '@/lib/animations/hooks/use-gsap-timeline'
import {useProgressBar} from '@/lib/animations/hooks/use-progress-bar'

// ============================================================================
// Types
// ============================================================================

export interface TerminalLine {
  id: string
  content: string | ReactNode
  scramble?: boolean
  opacity?: number
  top?: string
}

export interface TerminalPreloaderConfig {
  /**
   * Terminal lines to display
   */
  lines?: TerminalLine[]
  /**
   * Total animation duration in seconds
   */
  duration?: number
  /**
   * Number of random glitch effects
   */
  glitchCount?: number
  /**
   * Show progress bar
   */
  showProgress?: boolean
  /**
   * Characters for scramble effect
   */
  scrambleChars?: string
  /**
   * Callback when preloader completes
   */
  onComplete?: () => void
  /**
   * Auto-start animation on mount
   */
  autoStart?: boolean
  /**
   * Custom className for container
   */
  className?: string
  /**
   * Custom styles for container
   */
  style?: React.CSSProperties
}

export interface TerminalPreloaderProps extends TerminalPreloaderConfig {
  children?: ReactNode
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_LINES: TerminalLine[] = [
  {
    id: 'line-1',
    content: '[SYSTEM] Initializing...',
    scramble: true,
    opacity: 1,
    top: '20%',
  },
  {
    id: 'line-2',
    content: '[LOADING] Processing data...',
    scramble: true,
    opacity: 0.7,
    top: '35%',
  },
  {
    id: 'line-3',
    content: '[STATUS] Ready',
    scramble: true,
    opacity: 1,
    top: '50%',
  },
]

// ============================================================================
// Component
// ============================================================================

export function TerminalPreloader({
  lines = DEFAULT_LINES,
  duration = 6,
  glitchCount = 3,
  showProgress = true,
  scrambleChars = ANIMATION_CONSTANTS.SPECIAL_CHARS,
  onComplete,
  autoStart = true,
  className = '',
  style = {},
  children,
}: TerminalPreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isComplete, setIsComplete] = useState(false)

  // Create timeline for preloader animation
  const {timeline, play} = useGSAPTimeline({
    paused: !autoStart,
    onComplete: () => {
      setIsComplete(true)
      onComplete?.()
    },
  })

  // Progress bar
  const {progress, progressRef} = useProgressBar({
    timeline,
  })

  // Build animation sequence
  useEffect(() => {
    if (!timeline || !containerRef.current) return

    const container = containerRef.current
    const lineElements = container.querySelectorAll<HTMLElement>('.terminal-line')
    const scrambleElements = container.querySelectorAll<HTMLElement>('[data-scramble="true"]')

    // Store original text for scramble elements
    storeOriginalText(scrambleElements)

    // Set initial states
    gsap.set(lineElements, {opacity: 0})

    // Create text reveal timeline
    const textRevealTl = gsap.timeline()
    const allLines = Array.from(lineElements)

    // Animate each line
    allLines.forEach((line, lineIndex) => {
      const baseOpacity = parseFloat(line.getAttribute('data-opacity') || '1')
      const timePoint = (lineIndex / allLines.length) * (duration * 0.8)

      // Reveal line
      textRevealTl.to(
        line,
        {
          opacity: baseOpacity,
          duration: 0.3,
        },
        timePoint
      )

      // Scramble text spans in this line
      const scrambleSpans = line.querySelectorAll<HTMLElement>('[data-scramble="true"]')

      scrambleSpans.forEach((span) => {
        const originalText = span.getAttribute('data-original-text') || span.textContent || ''

        textRevealTl.to(
          span,
          {
            duration: 0.8,
            ...createScrambleTextAnim({
              text: originalText,
              chars: scrambleChars,
              speed: 0.3,
            }),
          },
          timePoint + 0.1
        )
      })
    })

    // Add text reveal to main timeline
    timeline.add(textRevealTl, 0)

    // Add periodic glitch effects
    const scrambleArray = Array.from(scrambleElements)
    for (let i = 0; i < glitchCount; i++) {
      const randomTime = 1 + i * 1.5

      timeline.call(
        () => {
          const glitchTl = gsap.timeline()
          const numToGlitch = 3 + Math.floor(Math.random() * 3)
          const randomSpans = scrambleArray.sort(() => Math.random() - 0.5).slice(0, numToGlitch)

          randomSpans.forEach((span) => {
            const text = span.textContent || span.getAttribute('data-original-text') || ''

            glitchTl.to(
              span,
              {
                duration: 0.2,
                ...createScrambleTextAnim({
                  text,
                  chars: scrambleChars,
                  speed: 0.1,
                }),
                repeat: 1,
              },
              Math.random() * 0.5
            )
          })
        },
        [],
        randomTime
      )
    }

    // Add disappearing effect at the end
    const disappearTl = createStaggeredFadeOut(allLines, 0.1)
    timeline.add(disappearTl, duration - 1)

    // Force progress to 100% at the end
    timeline.call(
      () => {
        if (progressRef.current) {
          progressRef.current.style.width = '100%'
        }
      },
      [],
      duration - 0.5
    )

    if (autoStart) {
      play()
    }
  }, [timeline, duration, glitchCount, scrambleChars, autoStart, play, progressRef])

  // Render nothing after completion
  if (isComplete && !children) {
    return null
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`terminal-preloader ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          backgroundColor: '#000',
          display: isComplete ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        }}>
        {/* Terminal Lines */}
        <div
          style={{
            position: 'relative',
            width: '80%',
            height: '60%',
          }}>
          {lines.map((line) => (
            <div
              key={line.id}
              className='terminal-line'
              data-opacity={line.opacity ?? 1}
              style={{
                position: 'absolute',
                top: line.top || '50%',
                left: 0,
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                color: '#0f0',
              }}>
              {typeof line.content === 'string' && line.scramble ? (
                <span data-scramble='true'>{line.content}</span>
              ) : (
                line.content
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              width: '80%',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}>
            <div
              ref={progressRef}
              style={{
                height: '100%',
                backgroundColor: '#0f0',
                width: `${progress}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Content after preloader */}
      {isComplete && children}
    </>
  )
}
