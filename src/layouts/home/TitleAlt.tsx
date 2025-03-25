import React from "react"
import { motion } from "framer-motion"

// Split the word into an array of letters.
const letters = "ULTRATERRESTRIAL".split( "" )

/**
 * For each letter index, determine a small y-offset in either
 * a negative (up) or positive (down) direction for the wave.
 * 
 * This is a simple “wave” approach: letters near the center move more 
 * than letters near the edges, etc. Tweak as needed.
 */
function getYOffset( index, total, amplitude = 10 ) {
  // Center around total/2
  const mid = ( total - 1 ) / 2
  // Distance from center => bigger amplitude
  const dist = Math.abs( index - mid )
  // We’ll invert so center letters move *more*, outer letters move less
  // (Feel free to change this approach)
  return Math.round( ( mid - dist ) * amplitude )
}

export function TitleAlt() {
  // A base variant that handles the overall "pulsing" (opacity + scale).
  const basePulse = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 1, 1, 1],
      scale: [0.8, 1, 1, 0.8],
      transition: {
        duration: 10,
        ease: "easeInOut",
        // delay: 2,
        // repeat: Infinity,
      },
    },
  }

  // For each letter, we add an up/down wave offset on Y over time:
  // This is a simple keyframes approach: [0, offset, offset, 0].
  function letterWave( offset ) {
    return {
      initial: { y: 0 },
      animate: {
        y: [0, offset, offset, 0],
        transition: {
          duration: 10,
          ease: "easeInOut",
          delay: 5,
          // repeat: Infinity,
        },
      },
      // transition: {
      //   duration: 2,
      //   ease: "easeInOut",
      //   // repeat: Infinity,
      //   delay: 1,
      // },
    }
  }

  // Let's define two lines: "up" line and "down" line.
  // We'll reuse the same letters array for a mirrored effect.
  return (
    <div
      className="flex items-center justify-center"
      style={{

        // fontSize: "3vmin",
        // background:"radial-gradient(ellipse at 50% 50%, #011116 0%, #000000 100%)",
      }}
    >
      <div className="relative flex items-center justify-center w-[90vmin]">
        {/* "Up" line */}
        <motion.div
          className="absolute flex mix-blend-plus-lighter"
          variants={basePulse}
          initial="initial"
          animate="animate"
        >
          {letters.map( ( letter, i ) => {
            const yOffset = -getYOffset( i, letters.length, 1.2 )
            return (
              <motion.span
                key={`up-${i}`}
                className="w-[4vmin] text-center text-white/90"
                style={{ textShadow: "0 0 2px #fff" }}
                variants={letterWave( yOffset )}
              >
                {letter}
              </motion.span>
            )
          } )}
        </motion.div>

        {/* "Down" line */}
        <motion.div
          className="absolute flex mix-blend-plus-lighter"
          variants={basePulse}
          initial="initial"
          animate="animate"
        >
          {letters.map( ( letter, i ) => {
            const yOffset = getYOffset( i, letters.length, 1.2 )
            return (
              <motion.span
                key={`down-${i}`}
                className="w-[4vmin] text-center text-white/90"
                style={{ textShadow: "0 0 2px #fff" }}
                variants={letterWave( yOffset )}
              >
                {letter}
              </motion.span>
            )
          } )}
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