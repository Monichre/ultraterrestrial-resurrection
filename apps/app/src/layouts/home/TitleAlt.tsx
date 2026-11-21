'use client'

import {TextScramble} from '@/lib/animations/text-scramble'
import React from 'react'

const WORDMARK = 'ULTRATERRESTRIAL'

const titleShellStyle: React.CSSProperties = {
  width: 'clamp(320px, 92vw, 1200px)',
  fontSize: 'clamp(2.5rem, 7vw, 8rem)',
  letterSpacing: 'clamp(0.14em, 0.5vw, 0.4em)',
}

const wordmarkStyle: React.CSSProperties = {
  fontFamily:
    'var(--font-monument-grotesk), var(--font-neue-haas-grotesk), var(--font-league-spartan), sans-serif',
  fontWeight: 700,
  color: '#f8fbff',
  textShadow: `
    0 0 25px rgba(164, 212, 255, 0.45),
    0 0 70px rgba(116, 172, 255, 0.35),
    0 2px 12px rgba(4, 8, 20, 0.8)
  `,
}

type TitleAltProps = {
  trigger?: boolean
  reduceMotion?: boolean
  /** ANIMATION_SEQUENCE.md: 2.5s scramble */
  scrambleDuration?: number
}

export function TitleAlt({
  trigger = true,
  reduceMotion = false,
  scrambleDuration = 2500,
}: TitleAltProps) {
  if (!trigger) return null

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='relative flex items-center justify-center site-title' style={titleShellStyle}>
        <div className='font-semibold uppercase tracking-[0.35em]' style={wordmarkStyle}>
          <span className='inline-block bg-[radial-gradient(circle_at_top,#fdfefe,#dbe7ff,#fefefe)] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(148,197,255,0.35)]'>
            {reduceMotion ? (
              WORDMARK
            ) : (
              <TextScramble text={WORDMARK} duration={scrambleDuration} delay={0} />
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
