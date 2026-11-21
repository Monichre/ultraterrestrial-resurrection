/**
 * TextScramble Component
 *
 * Matrix-style text scramble animation with configurable duration and delay
 * Inspired by classic sci-fi terminal effects
 */

'use client'

import {useEffect, useState, useRef} from 'react'

// ============================================================================
// Types
// ============================================================================

export interface TextScrambleProps {
  text: string
  duration?: number
  delay?: number
  className?: string
  onComplete?: () => void
}

// ============================================================================
// Character Sets
// ============================================================================

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

// ============================================================================
// Component
// ============================================================================

export function TextScramble({
  text,
  duration = 2000,
  delay = 0,
  className = '',
  onComplete,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    // Reset state
    setDisplayText('')
    setIsComplete(false)

    // Start animation after delay
    const delayTimer = setTimeout(() => {
      startTimeRef.current = performance.now()

      const animate = () => {
        const elapsed = performance.now() - (startTimeRef.current || 0)
        const progress = Math.min(elapsed / duration, 1)

        if (progress < 1) {
          // Calculate how many characters should be revealed
          const revealedCount = Math.floor(text.length * progress)

          // Build display text
          let newText = ''
          for (let i = 0; i < text.length; i++) {
            if (i < revealedCount) {
              // Character is revealed
              newText += text[i]
            } else if (text[i] === ' ') {
              // Keep spaces as spaces
              newText += ' '
            } else {
              // Random scramble character
              newText += CHARS[Math.floor(Math.random() * CHARS.length)]
            }
          }

          setDisplayText(newText)
          frameRef.current = requestAnimationFrame(animate)
        } else {
          // Animation complete
          setDisplayText(text)
          setIsComplete(true)
          onComplete?.()
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(delayTimer)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [text, duration, delay, onComplete])

  return <span className={className}>{displayText || text}</span>
}
