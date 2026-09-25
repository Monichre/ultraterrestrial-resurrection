import { useInView, motion } from 'framer-motion'
import React, { useRef } from 'react'
import { TransitionProps } from './animations.types'
import { MakeOptional } from './SlideFadeIn'

export const FadeIn: React.FC<MakeOptional<TransitionProps, 'transition'>> = ({
  children,
  transition = {
    duration: 0.4,
    ease: 'easeOut',
  },
}) => {
  const ref = useRef(null)
  // Might need to change margin values
  const isInView: any = useInView(ref)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      // @ts-ignore
      animate={isInView && { opacity: 1, transition }}
    >
      {children}
    </motion.div>
  )
}
