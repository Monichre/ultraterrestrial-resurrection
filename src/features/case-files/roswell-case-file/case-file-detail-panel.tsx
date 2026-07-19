'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {X} from 'lucide-react'
import type {CaseFileLayer} from './data'

interface CaseFileDetailPanelProps {
  layer: CaseFileLayer | null
  onClose: () => void
}

export function CaseFileDetailPanel({layer, onClose}: CaseFileDetailPanelProps) {
  return (
    <AnimatePresence>
      {layer && (
        <motion.aside
          initial={{opacity: 0, x: 40}}
          animate={{opacity: 1, x: 0}}
          exit={{opacity: 0, x: 40}}
          transition={{duration: 0.25, ease: 'easeOut'}}
          className='pointer-events-auto absolute right-6 top-24 z-20 w-80 rounded-lg border border-neutral-800 bg-black/85 p-5 backdrop-blur-md'>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close detail panel'
            className='absolute right-3 top-3 text-neutral-500 hover:text-neutral-200'>
            <X className='h-4 w-4' />
          </button>

          <p className='font-mono text-[10px] uppercase tracking-wider text-neutral-500'>
            {layer.subtitle}
          </p>
          <h3 className='mt-1 font-mono text-lg font-bold text-neutral-100'>{layer.title}</h3>
          <p className='mt-3 text-sm leading-relaxed text-neutral-300'>{layer.body}</p>

          {layer.meta && layer.meta.length > 0 && (
            <div className='mt-4 space-y-1 border-t border-neutral-800 pt-3'>
              {layer.meta.map((m) => (
                <div key={m.label} className='flex justify-between font-mono text-xs'>
                  <span className='text-neutral-600'>{m.label}</span>
                  <span className='text-neutral-300'>{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {layer.tag && (
            <p className='mt-3 font-mono text-[10px] uppercase tracking-wide text-neutral-600'>
              {layer.tag}
            </p>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
