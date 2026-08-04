'use client'

/**
 * HeroTypography — Act 1 hero copy for the home cinematic.
 *
 * Structure only — all motion is orchestrated by useUltraterrestrialAnimation
 * against the data attributes below:
 *   [data-wordmark]       wordmark line (letter-spacing / blur tween)
 *   [data-wordmark-char]  per-char masked rise (yPercent / rotateX)
 *   [data-tagline]        masked single-line rise
 *   [data-quote]          SplitType target — lines wrapped in .hero-line-mask
 *   [data-quote-author]   blur fade-in credit
 */

import React from 'react'

const WORDMARK = 'ULTRATERRESTRIAL'
const TAGLINE = 'Tracking the State of Disclosure'
const QUOTE =
  'We live on a placid island of ignorance in the midst of black seas of infinity, and it was not meant that we should voyage far. But some day the piecing together of dissociated knowledge will open up such terrifying vistas of reality that we shall either go mad from the revelation or flee from the deadly light into the peace and safety of a new dark age.'
const AUTHOR = 'H.P. Lovecraft'

const wordmarkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-monument), var(--font-neue-haas), var(--font-league-spartan), sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(2rem, 5vw, 6.5rem)',
  letterSpacing: '0.3em',
  lineHeight: 1.05,
  whiteSpace: 'nowrap',
  color: '#f8fbff',
  textShadow: `
    0 0 25px rgba(164, 212, 255, 0.45),
    0 0 70px rgba(116, 172, 255, 0.35),
    0 2px 12px rgba(4, 8, 20, 0.8)
  `,
}

const monoStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains-mono), var(--font-martian-mono), monospace',
}

export const HeroCopy: React.FC = () => {
  return (
    <div className='flex flex-col items-center text-center px-6'>
      {/* Wordmark — per-char masks */}
      <h1
        data-wordmark
        className='uppercase select-none'
        style={wordmarkStyle}
        aria-label={WORDMARK}>
        {WORDMARK.split('').map((char, i) => (
          <span key={`${char}-${i}`} className='hero-char-mask' aria-hidden='true'>
            <span data-wordmark-char>{char}</span>
          </span>
        ))}
      </h1>

      {/* Tagline — single masked line */}
      <div className='hero-line-mask mt-6'>
        <span
          data-tagline
          className='block text-white/90 text-2xl md:text-3xl site-tagline'
          style={{fontFamily: 'var(--font-neue-haas), sans-serif'}}>
          {TAGLINE}
        </span>
      </div>

      {/* Quote — SplitType line masks applied by the master hook */}
      <p
        data-quote
        className='mt-8 max-w-[640px] text-base md:text-lg leading-7 md:leading-8 text-white/75'
        style={{fontFamily: 'var(--font-neue-haas), sans-serif'}}>
        {QUOTE}
      </p>

      <h3
        data-quote-author
        className='mt-5 text-sm md:text-base uppercase tracking-[0.3em] text-white/60'
        style={monoStyle}>
        {AUTHOR}
      </h3>
    </div>
  )
}
