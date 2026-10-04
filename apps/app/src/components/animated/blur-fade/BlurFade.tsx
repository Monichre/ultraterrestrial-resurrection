'use client'
import React from 'react'

import { useRef } from 'react'
import { AnimatePresence, motion, useInView, Variants } from 'framer-motion'
import { cn } from '@/utils'

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: { y: number }
    visible: { y: number }
  }
  duration?: number
  delay?: number
  yOffset?: number
  inView?: boolean
  inViewMargin?: string
  blur?: string
}

export function BlurFade( {
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
}: BlurFadeProps ) {
  const ref = useRef( null )
  const inViewResult = useInView( ref, { once: true, margin: inViewMargin } )
  const isInView = !inView || inViewResult
  const defaultVariants: Variants = {
    hidden: { y: 10, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: `blur(0px)` },
  }
  const combinedVariants = variant || defaultVariants
  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        // exit='hidden'
        variants={combinedVariants}
        transition={{
          delay: 0.5 + delay,
          duration,
          ease: 'easeIn',
        }}
        className={cn( className, isInView ? 'in-view' : '' )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function BlurFadeTextDemo() {
  return (
    <section id='header'>
      <BlurFade delay={0.25} inView>
        <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
          Hello World 👋
        </h2>
      </BlurFade>
      <BlurFade delay={0.25 * 2} inView>
        <span className='text-xl text-pretty tracking-tighter sm:text-3xl xl:text-4xl/none'>
          Nice to meet you
        </span>
      </BlurFade>
    </section>
  )
}
