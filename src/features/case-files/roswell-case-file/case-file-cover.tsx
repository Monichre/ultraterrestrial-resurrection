'use client'

import {motion} from 'framer-motion'
import type {CaseFileRecord} from './data'

interface CaseFileCoverProps {
  record: CaseFileRecord
  onOpen: () => void
}

export function CaseFileCover({record, onOpen}: CaseFileCoverProps) {
  return (
    <motion.button
      type='button'
      onClick={onOpen}
      initial={{opacity: 1}}
      exit={{opacity: 0, scale: 0.92}}
      transition={{duration: 0.4, ease: 'easeInOut'}}
      className='group relative flex w-full max-w-sm cursor-pointer flex-col gap-4 rounded-sm border border-amber-900/40 bg-[#d8c9a3] p-8 text-left shadow-2xl'
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.06) 0.5px, transparent 0.5px)',
        backgroundSize: '3px 3px',
      }}>
      <div className='absolute inset-3 rounded-sm border border-amber-950/20' />

      <div className='relative space-y-1'>
        <p className='font-mono text-[11px] uppercase tracking-[0.2em] text-red-800/80'>
          {record.classification.replace('-', ' ')}
        </p>
        <h2 className='font-mono text-2xl font-bold uppercase tracking-wide text-neutral-900'>
          {record.name}
        </h2>
      </div>

      <div className='relative flex items-center gap-6 border-t border-amber-950/20 pt-4 font-mono text-xs text-neutral-800'>
        <span>{record.date}</span>
        <span className='truncate'>{record.location}</span>
      </div>

      <div className='relative mt-2 flex items-center gap-2 font-mono text-[11px] text-neutral-700 opacity-70 transition-opacity group-hover:opacity-100'>
        <span className='inline-block h-1.5 w-1.5 rounded-full bg-red-800/80' />
        Click to open case file
      </div>

      <div className='pointer-events-none absolute -bottom-2 left-1/2 h-4 w-[92%] -translate-x-1/2 rounded-b-sm bg-[#c2b28c] opacity-80' />
      <div className='pointer-events-none absolute -bottom-4 left-1/2 h-4 w-[84%] -translate-x-1/2 rounded-b-sm bg-[#ab9c78] opacity-60' />
    </motion.button>
  )
}
