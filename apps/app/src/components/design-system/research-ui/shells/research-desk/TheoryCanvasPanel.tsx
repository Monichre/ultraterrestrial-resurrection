'use client'

import {Share2} from 'lucide-react'

import {cn} from '@/lib/utils'

import {CanvasEntityNode} from './CanvasEntityNode'
import type {TheoryCanvasPanelProps} from './types'

export function TheoryCanvasPanel({
  title = 'Theory Canvas',
  tabs,
  activeTabId,
  onTabChange,
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  collaborators = [],
  onShare,
  className,
}: TheoryCanvasPanelProps) {
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]))

  return (
    <section
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-white/10 bg-[oklch(0.15_0.02_255)]',
        className
      )}>
      <div className='flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2'>
        <div className='flex items-center gap-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400'>
            {title}
          </p>
          <div className='flex items-center gap-1'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type='button'
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
                  activeTabId === tab.id
                    ? 'bg-white/10 text-zinc-50'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex -space-x-1.5'>
            {collaborators.map((person) => (
              <span
                key={person.id}
                className='flex size-6 items-center justify-center rounded-full border border-[oklch(0.15_0.02_255)] bg-zinc-700 text-[9px] font-semibold text-zinc-100'>
                {person.initials}
              </span>
            ))}
          </div>
          {onShare ? (
            <button
              type='button'
              onClick={onShare}
              className='inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
              <Share2 className='size-3' />
              Share
            </button>
          ) : null}
        </div>
      </div>

      <div className='relative min-h-[320px] flex-1 overflow-hidden'>
        <div
          aria-hidden
          className='absolute inset-0 opacity-40'
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, oklch(0.55 0.02 255 / 0.35) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />

        <svg className='absolute inset-0 size-full' aria-hidden>
          {edges.map((edge) => {
            const from = byId[edge.from]
            const to = byId[edge.to]
            if (!from || !to) return null
            return (
              <g key={edge.id}>
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke='oklch(0.65 0.02 255 / 0.45)'
                  strokeWidth={1.25}
                  strokeDasharray={edge.style === 'dashed' ? '4 4' : undefined}
                />
                {edge.label ? (
                  <text
                    x={`${(from.x + to.x) / 2}%`}
                    y={`${(from.y + to.y) / 2}%`}
                    fill='oklch(0.72 0.02 255)'
                    fontSize='9'
                    textAnchor='middle'
                    dy='-4'>
                    {edge.label}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>

        {nodes.map((node) => (
          <CanvasEntityNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={onSelectNode}
          />
        ))}
      </div>
    </section>
  )
}
