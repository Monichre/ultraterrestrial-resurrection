'use client'

import {motion} from 'framer-motion'
import type {ReactNode} from 'react'
import '../writers-desk-notes.css'

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const
const DURATION = 0.32

export interface NoteLetterShellProps {
  children: ReactNode
  /** Compact mode: reduced margins for inline embedding */
  compact?: boolean
}

export function NoteLetterShell({children, compact = false}: NoteLetterShellProps) {
  return (
    <section
      className={`relative ${compact ? 'mx-0 my-4' : 'mx-4 my-12 sm:mx-0 sm:my-12 lg:my-[72px]'}`}>
      <motion.div
        className='wd-paper-sheet pointer-events-none absolute inset-0 rounded-card opacity-70 shadow-sheet3'
        initial={{x: 22, y: 26}}
        animate={{x: compact ? 14 : 18, y: compact ? 16 : 22}}
        transition={{duration: DURATION, ease: EASE_OUT_EXPO, delay: 0.08}}
        aria-hidden='true'
      />

      <motion.div
        className='wd-paper-sheet pointer-events-none absolute inset-0 rounded-card opacity-85 shadow-sheet2'
        initial={{x: 14, y: 16}}
        animate={{x: compact ? 7 : 10, y: compact ? 8 : 12}}
        transition={{duration: DURATION, ease: EASE_OUT_EXPO, delay: 0.04}}
        aria-hidden='true'
      />

      <motion.article
        className={`note-letter-card wd-paper-sheet wd-paper-tooth relative rounded-card border border-divider shadow-sheet1 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sheet1-hover ${compact ? 'w-full min-w-0' : 'mx-auto min-w-[320px] max-w-[640px]'}`}
        initial={{opacity: 0, y: 12, scale: 0.98}}
        animate={{opacity: 1, y: 0, scale: 1}}
        transition={{duration: DURATION, ease: EASE_OUT_EXPO}}>
        <div className={compact ? 'px-5 pb-7 pt-6' : 'px-6 pb-11 pt-9 sm:px-10'}>{children}</div>
      </motion.article>
    </section>
  )
}
