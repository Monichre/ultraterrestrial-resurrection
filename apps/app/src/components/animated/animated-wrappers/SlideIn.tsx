import { useInView, motion } from 'framer-motion'
import React, { useRef } from 'react'
import { TransitionProps } from './animations.types'

type SlideInProps = {
  direction?: 'up' | 'down' | 'left' | 'right'
} & TransitionProps



const getSlideTransition = (direction: 'up' | 'down' | 'left' | 'right') => {
  switch (direction) {
    case 'up':
      return {
        // element starts offset to the bottom, moves to top (y)
        y: '50vh',
      }
    case 'down':
      return {
        // element starts offset to the top, moves to bottom (-y)
        y: '-50vh',
      }
    case 'left':
      return {
        // element starts offset to the right, moves to left (x)
        x: '50vw',
      }
    case 'right':
      return {
        // element starts offset to the left, moves to right (-x)
        x: '-50vw',
      }
    default:
      throw Error('Invalid direction.')
  }
}

export const SlideIn: React.FC<SlideInProps> = ({
  direction = 'up',
  children,
  transition = {
    duration: 0.5,
    ease: 'easeOut',
  },
}) => {
  const ref = useRef(null)
  // Might need to change margin values
  const isInView = useInView(ref)
  const initial = getSlideTransition(direction)

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView && { x: 0, y: 0, transition }}
    >
      {children}
    </motion.div>
  )
}
