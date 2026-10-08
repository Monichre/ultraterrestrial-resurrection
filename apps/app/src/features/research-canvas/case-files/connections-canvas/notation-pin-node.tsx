'use client'

import {type NodeProps} from '@xyflow/react'
import {X} from 'lucide-react'

export type NotationPinFlowData = {
  text: string
  onTextChange?: (text: string) => void
  onRemove?: () => void
}

/**
 * Session notation pin — a taped-note card dropped on the canvas by
 * double-click. Session-state only; nothing persists (v1).
 */
export function NotationPinNode({data}: NodeProps) {
  const d = data as NotationPinFlowData

  return (
    <div className='w-[160px] rotate-[-1.5deg] rounded-[2px] border border-amber-200/30 bg-amber-100/95 px-3 pb-2 pt-1.5 text-zinc-800 shadow-[0_8px_20px_rgba(0,0,0,0.45)]'>
      {/* tape strip */}
      <div className='absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-[2deg] rounded-[1px] bg-amber-50/70 shadow-sm' />
      <div className='mb-1 flex items-center justify-between'>
        <span className='ut-mono text-[8.5px] font-semibold tracking-widest text-amber-900/60'>
          NOTE
        </span>
        <button
          className='nodrag nopan -mr-1 rounded p-0.5 text-amber-900/40 hover:bg-amber-200/60 hover:text-amber-900'
          onClick={(e) => {
            e.stopPropagation()
            d.onRemove?.()
          }}
          aria-label='Remove note'>
          <X className='h-3 w-3' />
        </button>
      </div>
      <textarea
        autoFocus
        aria-label='Session note'
        className='nodrag nopan nowheel h-14 w-full resize-none bg-transparent text-[11px] leading-snug text-zinc-800 outline-none placeholder:text-amber-900/30'
        placeholder='a thought, a doubt, a next trace…'
        value={d.text}
        onChange={(e) => d.onTextChange?.(e.target.value)}
      />
    </div>
  )
}
