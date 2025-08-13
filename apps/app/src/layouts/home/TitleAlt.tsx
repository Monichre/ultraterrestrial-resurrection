import React, {useMemo} from 'react'
import {motion} from 'framer-motion'

// Correct letter splitting
const letters = 'ULTRATERRESTRIAL'.split('')

/**
 * For each letter index, determine a small y-offset in either
 * a negative (up) or positive (down) direction for the wave.
 *
 * This is a simple “wave” approach: letters near the center move more
 * than letters near the edges, etc. Tweak as needed.
 */
function getYOffset(index, total, amplitude = 10) {
  // Center around total/2
  const mid = (total - 1) / 2
  // Distance from center => bigger amplitude
  const dist = Math.abs(index - mid)
  // We’ll invert so center letters move *more*, outer letters move less
  // (Feel free to change this approach)
  return Math.round((mid - dist) * amplitude)
}

export function TitleAlt({trigger = true}: {trigger?: boolean}) {
  if (!trigger) return null
  // A base variant that handles the overall pulse and perpetual loop
  const basePulse = useMemo(
    () => ({
      initial: {opacity: 0, scale: 0.96},
      animate: {
        opacity: [0, 1, 1, 1],
        scale: [0.96, 1, 1, 0.98, 1],
        transition: {
          duration: 8,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        },
      },
    }),
    []
  )

  // Per-letter shimmer + wave with slight randomization and infinite repeat
  function letterWave(offset: number, index: number) {
    const delay = 0.06 * index
    return {
      initial: {y: 20, opacity: 0, filter: 'blur(6px) saturate(0.8)'},
      animate: {
        y: [20, 0, offset, 0],
        opacity: [0, 1, 1, 1],
        filter: [
          'blur(6px) saturate(0.8)',
          'blur(0px) saturate(1)',
          'blur(0px) saturate(1.2)',
          'blur(0px) saturate(1)',
        ],
        transition: {
          duration: 6,
          ease: 'easeInOut',
          delay,
          repeat: Infinity,
          repeatDelay: 1.2,
        },
      },
      whileHover: {
        y: offset * 1.4,
        scale: 1.08,
        transition: {type: 'spring', stiffness: 260, damping: 20},
      },
    }
  }

  // Let's define two lines: "up" line and "down" line.
  // We'll reuse the same letters array for a mirrored effect.
  return (
    <div
      className='flex items-center justify-center'
      style={
        {
          // fontSize: "3vmin",
          // background:"radial-gradient(ellipse at 50% 50%, #011116 0%, #000000 100%)",
        }
      }>
      <div
        className='relative flex items-center justify-center site-title'
        style={{
          width: 'clamp(320px, 92vw, 1200px)',
          fontSize: 'clamp(2rem, 6vw, 7rem)',
          letterSpacing: 'clamp(0.08em, 0.2vw, 0.22em)',
        }}>
        {/* "Up" line */}
        <motion.div
          className='absolute flex mix-blend-plus-lighter'
          variants={basePulse}
          initial='initial'
          animate={trigger ? 'animate' : 'initial'}>
          {letters.map((letter, i) => {
            const yOffset = -getYOffset(i, letters.length, 3)
            return (
              <motion.span
                key={`up-${i}`}
                className='inline-block text-white/90'
                style={{
                  textShadow: '0 0 6px rgba(255,255,255,0.35), 0 0 18px rgba(120,180,255,0.25)',
                  minWidth: '0.6em',
                }}
                variants={letterWave(yOffset, i)}
                whileHover={{
                  y: yOffset * 1.4,
                  scale: 1.08,
                  transition: {type: 'spring', stiffness: 260, damping: 20},
                }}>
                {letter}
              </motion.span>
            )
          })}
        </motion.div>

        {/* "Down" line */}
        <motion.div
          className='absolute flex mix-blend-plus-lighter'
          variants={basePulse}
          initial='initial'
          animate={trigger ? 'animate' : 'initial'}>
          {letters.map((letter, i) => {
            const yOffset = getYOffset(i, letters.length, 3)
            return (
              <motion.span
                key={`down-${i}`}
                className='inline-block text-white/90'
                style={{
                  textShadow: '0 0 6px rgba(255,255,255,0.35), 0 0 18px rgba(120,180,255,0.25)',
                  minWidth: '0.6em',
                }}
                variants={letterWave(yOffset, i)}
                whileHover={{
                  y: yOffset * 1.4,
                  scale: 1.08,
                  transition: {type: 'spring', stiffness: 260, damping: 20},
                }}>
                {letter}
              </motion.span>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

// export const TitleAlt = () => {
//   return (

//     <div className="content">
//       <div className="up">
//         <span className="up-0">U</span>
//         <span className="up-2-8">L</span>
//         <span className="up-3-7">T</span>
//         <span className="up-4-6">R</span>
//         <span className="up-5">A</span>
//         <span className="up-4-6">T</span>
//         <span className="up-3-7">E</span>
//         <span className="up-2-8">R</span>
//         <span className="up-4-6">R</span>
//         <span className="up-5">E</span>
//         <span className="up-4-6">S</span>
//         <span className="up-3-7">T</span>
//         <span className="up-2-8">R</span>
//         <span className="up-0">I</span>
//         <span className="up-2-8">A</span>
//         <span className="up-3-7">L</span>
//       </div>
//       <div className="down">
//         <span className="down-0">U</span>
//         <span className="down-2-8">L</span>
//         <span className="down-3-7">T</span>
//         <span className="down-4-6">R</span>
//         <span className="down-5">A</span>
//         <span className="down-4-6">T</span>
//         <span className="down-3-7">E</span>
//         <span className="down-2-8">R</span>
//         <span className="down-4-6">R</span>
//         <span className="down-5">E</span>
//         <span className="down-4-6">S</span>
//         <span className="down-3-7">T</span>
//         <span className="down-2-8">R</span>
//         <span className="down-0">I</span>
//         <span className="down-2-8">A</span>
//         <span className="down-3-7">L</span>
//       </div>
//     </div>

//   )
// }
