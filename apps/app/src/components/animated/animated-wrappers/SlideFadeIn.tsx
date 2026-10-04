'use client'

import { useInView, motion } from 'framer-motion'
import React, { useRef } from 'react'
import { TransitionProps } from './animations.types'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

type SlideFadeInProps = {
  direction?: 'up' | 'down' | 'left' | 'right'
  full?: boolean
  x?: string
  y?: string
  transition?: TransitionProps
  children: any
} & MakeOptional<TransitionProps, 'transition'>

const getSlideTransition = ({ direction, x, y, full }: SlideFadeInProps) => {
  switch (direction) {
    case 'up':
      return {
        // element starts offset to the bottom, moves to top (y)
        y: full ? '100%' : '50px',
      }
    case 'down':
      return {
        // element starts offset to the top, moves to bottom (-y)
        y: full ? '100%' : '-50px',
      }
    case 'left':
      return {
        // element starts offset to the right, moves to left (x)
        x: full ? '100%' : '50px',
      }
    case 'right':
      return {
        // element starts offset to the left, moves to right (-x)
        x: full ? '100%' : '50px',
      }
    default:
      throw Error('Invalid direction.')
  }
}

export const SlideFadeIn: React.FC<SlideFadeInProps> = ({
  direction = 'up',
  full = false,
  x,
  y,
  children,
  transition = {
    duration: 0.4,
    ease: 'easeIn',
  },
}) => {
  const ref = useRef(null)

  const isInView = useInView(ref)
  const initial = getSlideTransition({ x, y, direction, full })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial }}
      // @ts-ignore
      animate={isInView && { x: 0, y: 0, opacity: 1, transition }}
    >
      {children}
    </motion.div>
  )
}
