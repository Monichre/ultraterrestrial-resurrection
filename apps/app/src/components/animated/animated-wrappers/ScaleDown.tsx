import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import { TransitionProps } from './animations.types'

type ScaleDownprops = {
  when: boolean
  by?: number
} & TransitionProps

export const ScaleDown: React.FC<ScaleDownprops> = ({
  when = false,
  by = 0.5,
  children,
  transition = {
    duration: 0.5,
    ease: 'easeOut',
  },
}) => {
  const ref = useRef(null)

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 1 }}
      animate={when && { scale: by, transition }}
    >
      {children}
    </motion.div>
  )
}
