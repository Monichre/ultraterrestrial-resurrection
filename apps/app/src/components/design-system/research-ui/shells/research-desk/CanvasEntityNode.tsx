import {cn} from '@/lib/utils'

import {ENTITY_CATEGORY_COLORS} from '../shared/tokens'

import type {CanvasEntityNodeProps} from './types'

export function CanvasEntityNode({node, isSelected, onSelect, className}: CanvasEntityNodeProps) {
  const accent = ENTITY_CATEGORY_COLORS[node.category]
  const isHypothesis = node.category === 'hypotheses'

  return (
    <button
      type='button'
      onClick={() => onSelect?.(node.id)}
      className={cn(
        'absolute min-w-[148px] max-w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-md border px-3 py-2 text-left shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
        'bg-[oklch(0.2_0.02_255_/_0.95)] transition-transform duration-150 hover:-translate-y-[calc(50%+2px)] active:scale-[0.98]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70',
        isSelected && 'ring-1 ring-white/30',
        className
      )}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        borderColor: `${accent}99`,
        boxShadow: isHypothesis ? `0 0 24px ${accent}55` : undefined,
      }}>
      {node.meta ? (
        <span className='mb-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500'>
          {node.meta}
        </span>
      ) : null}
      <span className='block text-xs font-semibold leading-snug text-zinc-50'>{node.label}</span>
      {typeof node.confidence === 'number' ? (
        <div className='mt-2 space-y-1'>
          <div className='flex justify-between text-[9px] uppercase tracking-[0.12em] text-zinc-400'>
            <span>Confidence</span>
            <span className='tabular-nums'>{node.confidence.toFixed(2)}</span>
          </div>
          <div className='h-1 overflow-hidden rounded-sm bg-black/40'>
            <div
              className='h-full origin-left rounded-sm'
              style={{
                width: '100%',
                transform: `scaleX(${node.confidence})`,
                background: accent,
              }}
            />
          </div>
        </div>
      ) : null}
    </button>
  )
}
