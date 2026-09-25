'use client'
import * as React from 'react'

import { motion, stagger } from 'framer-motion'

import { cn } from '@/utils/cn'
// const staggerMenuItems: any = stagger(0.1, { startDelay: 0.15 })

interface BlurIntProps {
  word: string
  className?: string
  visible: boolean
  duration?: number
}
export const BlurIn = ( {
  word,
  className,
  visible,
  duration = 1,
}: BlurIntProps ) => {
  const defaultVariants = {
    hidden: { filter: 'blur(10px)', opacity: 0 },
    visible: ( i: any ) => ( {
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        duration: 1,
        delay: i * 1,
      },
    } ),
  }

  return (
    <motion.p
      animate={visible ? 'visible' : 'hidden'}
      variants={defaultVariants}
      className={cn(
        className,
        'font-source text-center font-bold tracking-[-0.02em] drop-shadow-sm md:leading-[5rem] !text-black'
      )}
    >
      {word}
    </motion.p>
  )
}
