import { motion } from "framer-motion"
import { useState } from "react"

export const AnimatedMenuButton = ( { onClick }: { onClick: () => void } ) => {
  const [crossed, setCrossed] = useState( false )
  const handleClick = () => {
    setCrossed( !crossed )
    onClick()
  }
  return (
    <button
      aria-expanded={crossed}
      onClick={handleClick}
      className={
        'flex aspect-square h-fit select-none flex-col items-center justify-center rounded-full'
      }
    >
      <motion.div
        style={{
          width: '20px',
          borderTop: '2px solid #fff',
          transformOrigin: 'center',
        }}
        initial={{ translateY: '-3px' }}
        animate={
          crossed
            ? { rotate: '45deg', translateY: '1px' }
            : { translateY: '-3px', rotate: '0deg' }
        }
        transition={{ bounce: 0, duration: 0.1 }}
      />
      <motion.div
        transition={{ bounce: 0, duration: 0.1 }}
        style={{
          width: '20px',
          borderTop: '2px solid #fff',
          transformOrigin: 'center',
        }}
        initial={{ translateY: '3px' }}
        animate={
          crossed
            ? { rotate: '-45deg', translateY: '-1px' }
            : { translateY: '3px', rotate: '0deg', scaleX: 1 }
        }
      />
    </button>
  )
}