/**
 * HeroOverlayUI Component
 *
 * Technical overlay UI with animated readouts, glitch effects,
 * and scrambling text inspired by the reference images
 */

'use client'

import {useState, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {TextScramble} from '@/lib/animations/text-scramble'
import {useScrambleText} from '@/lib/animations/hooks'

// ============================================================================
// Types
// ============================================================================

export interface HeroOverlayUIProps {
  isSceneReady?: boolean
  title?: string
  subtitle?: string
  showReadouts?: boolean
}

// ============================================================================
// Technical Readouts
// ============================================================================

function TechnicalReadout({
  label,
  value,
  delay = 0,
}: {
  label: string
  value: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{opacity: 0, x: -20}}
      animate={{opacity: 1, x: 0}}
      transition={{delay, duration: 0.5}}
      className='flex items-center gap-2 font-mono text-xs'>
      <span className='text-cyan-500'>{label}:</span>
      <span className='text-cyan-300/70'>{value}</span>
    </motion.div>
  )
}

// ============================================================================
// Corner Brackets
// ============================================================================

function CornerBrackets() {
  const corners = [
    {position: 'top-4 left-4', rotate: 'rotate-0'},
    {position: 'top-4 right-4', rotate: 'rotate-90'},
    {position: 'bottom-4 right-4', rotate: 'rotate-180'},
    {position: 'bottom-4 left-4', rotate: '-rotate-90'},
  ]

  return (
    <>
      {corners.map((corner, i) => (
        <motion.div
          key={i}
          initial={{opacity: 0, scale: 0.5}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.5 + i * 0.1, duration: 0.5}}
          className={`fixed ${corner.position} ${corner.rotate}`}>
          <svg width='40' height='40' viewBox='0 0 40 40'>
            <path
              d='M 0 15 L 0 0 L 15 0'
              stroke='#40c0ff'
              strokeWidth='2'
              fill='none'
              strokeLinecap='square'
            />
            <circle cx='15' cy='0' r='2' fill='#40c0ff' opacity='0.6' />
            <circle cx='0' cy='15' r='2' fill='#40c0ff' opacity='0.6' />
          </svg>
        </motion.div>
      ))}
    </>
  )
}

// ============================================================================
// Scanning Lines
// ============================================================================

function ScanningLines() {
  return (
    <div className='pointer-events-none fixed inset-0'>
      {/* Horizontal scan line */}
      <motion.div
        className='absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent'
        animate={{
          y: ['0vh', '100vh'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Grid overlay */}
      <div className='absolute inset-0 opacity-10'>
        <svg width='100%' height='100%'>
          <defs>
            <pattern id='grid' width='50' height='50' patternUnits='userSpaceOnUse'>
              <path d='M 50 0 L 0 0 0 50' fill='none' stroke='#40c0ff' strokeWidth='0.5' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' />
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// Data Stream
// ============================================================================

function DataStream() {
  const [numbers, setNumbers] = useState<string[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setNumbers((prev) => {
        const newNumbers = [...prev]
        if (newNumbers.length > 10) newNumbers.shift()
        newNumbers.push(Math.random().toString(16).substring(2, 10).toUpperCase())
        return newNumbers
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 0.3}}
      className='fixed right-8 top-1/2 -translate-y-1/2 font-mono text-[10px] text-cyan-500/50'>
      {numbers.map((num, i) => (
        <motion.div
          key={`${num}-${i}`}
          initial={{opacity: 0, x: 10}}
          animate={{opacity: 1, x: 0}}
          exit={{opacity: 0}}
          className='mb-1'>
          {num}
        </motion.div>
      ))}
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function HeroOverlayUI({
  isSceneReady = false,
  title = 'ULTRATERRESTRIAL',
  subtitle = 'they say say',
  showReadouts = true,
}: HeroOverlayUIProps) {
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)

  useEffect(() => {
    if (isSceneReady) {
      const titleTimer = setTimeout(() => setShowTitle(true), 500)
      const subtitleTimer = setTimeout(() => setShowSubtitle(true), 2000)

      return () => {
        clearTimeout(titleTimer)
        clearTimeout(subtitleTimer)
      }
    }
  }, [isSceneReady])

  return (
    <>
      {/* Background effects */}
      <ScanningLines />
      <CornerBrackets />
      <DataStream />

      {/* Main content */}
      <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center'>
        {/* Top readouts */}
        {showReadouts && isSceneReady && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 1}}
            className='absolute left-8 top-8 space-y-1'>
            <TechnicalReadout label='UPLINK' value='ACTIVE' delay={1.2} />
            <TechnicalReadout label='STATUS' value='SCANNING' delay={1.3} />
            <TechnicalReadout label='SIG STR' value='94.2%' delay={1.4} />
            <TechnicalReadout label='FREQ' value='433.92 MHz' delay={1.5} />
            <TechnicalReadout label='LAT/LONG' value='37.2°N 115.8°W' delay={1.6} />
          </motion.div>
        )}

        {/* Title */}
        <AnimatePresence>
          {showTitle && (
            <motion.div
              initial={{opacity: 0, y: 20, filter: 'blur(10px)'}}
              animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
              transition={{duration: 1}}
              className='text-center'>
              <h1 className='mb-4 font-mono text-7xl font-bold tracking-wider'>
                <TextScramble
                  text={title}
                  duration={2500}
                  className='bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(64,192,255,0.5)]'
                  onComplete={() => setShowSubtitle(true)}
                />
              </h1>

              {/* Subtitle */}
              <AnimatePresence>
                {showSubtitle && (
                  <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    className='font-mono text-sm tracking-widest text-cyan-500/70'>
                    <TextScramble text={subtitle} duration={3000} delay={100} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom tagline */}
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 4}}
                className='mt-8 font-mono text-xs text-cyan-600'>
                <TextScramble text='the old gotrning' duration={2000} delay={500} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom status bar */}
        {showReadouts && isSceneReady && (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 2}}
            className='absolute bottom-8 left-1/2 -translate-x-1/2'>
            <div className='flex items-center gap-8 rounded-full border border-cyan-500/30 bg-black/50 px-8 py-3 backdrop-blur-sm'>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-cyan-400' />
                <span className='font-mono text-xs text-cyan-400'>TRANSMITTING</span>
              </div>
              <div className='h-4 w-px bg-cyan-500/30' />
              <div className='font-mono text-xs text-cyan-500/70'>
                EST. 1947 // AREA 51 // GROOM LAKE
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
