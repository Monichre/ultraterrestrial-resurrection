'use client'

import {Handle, Position, type NodeProps} from '@xyflow/react'
import {
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  FileText,
  Gem,
  Hash,
  MapPin,
  MessageSquareQuote,
  User,
} from 'lucide-react'
import type {EntityKind} from './types'
import {cn} from '@/utils'

export type EntityNodeFlowData = {
  kind: EntityKind
  label: string
  sublabel?: string
  dimmed?: boolean
  focused?: boolean
  /** Neighbors not yet revealed — drives the progressive-disclosure chip. */
  hiddenCount: number
  expanded: boolean
  onToggleExpand?: () => void
}

const KIND_ICON: Record<EntityKind, typeof User> = {
  key_figure: User,
  event: CalendarClock,
  organization: Building2,
  document: FileText,
  testimony: MessageSquareQuote,
  topic: Hash,
  location: MapPin,
  artifact: Gem,
}

const KIND_LABEL: Record<EntityKind, string> = {
  key_figure: 'FIGURE',
  event: 'EVENT',
  organization: 'ORG',
  document: 'DOC',
  testimony: 'TESTIMONY',
  topic: 'TOPIC',
  location: 'LOC',
  artifact: 'ARTIFACT',
}

/**
 * Entity card reskinned on the app's core-node chrome:
 * rounded-2xl neutral-900/80 container + neutral-950 content + pill chip,
 * matching CoreNodeContainer/CoreNodeContent/CoreNodeAvatar in
 * features/mindmap/nodes/core-node-ui.tsx.
 */
export function EntityCanvasNode({data}: NodeProps) {
  const d = data as EntityNodeFlowData
  const Icon = KIND_ICON[d.kind]

  return (
    <div
      className={cn(
        'w-[220px] overflow-hidden rounded-2xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-opacity duration-150',
        d.dimmed && 'opacity-30',
      )}>
      <Handle type='target' position={Position.Left} className='!h-2 !w-2 !border-0 !bg-transparent opacity-0' />
      <Handle type='source' position={Position.Right} className='!h-2 !w-2 !border-0 !bg-transparent opacity-0' />

      <main
        className={cn(
          'relative rounded-2xl border bg-neutral-900/80 p-1.5 transition-colors duration-200',
          !d.dimmed && 'hover:border-neutral-700 hover:bg-white/5',
          d.focused ? 'border-neutral-400 bg-white/5' : 'border-neutral-800',
        )}>
        {d.focused && (
          <>
            <span className='pointer-events-none absolute -left-px -top-px h-2 w-2 border-l border-t border-neutral-300' />
            <span className='pointer-events-none absolute -right-px -top-px h-2 w-2 border-r border-t border-neutral-300' />
            <span className='pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b border-l border-neutral-300' />
            <span className='pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b border-r border-neutral-300' />
          </>
        )}
        <section className='relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-3 shadow-lg shadow-neutral-800/50'>
          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-800 py-0.5 pl-2 pr-2 text-neutral-400'>
              <Icon className='h-3 w-3 stroke-[1.5]' />
              <span className='ut-mono text-[8.5px] font-medium tracking-wider'>
                {KIND_LABEL[d.kind]}
              </span>
            </span>
          </div>
          <div className='mt-2 text-[13px] font-medium leading-tight text-neutral-100'>
            {d.label}
          </div>
          {d.sublabel ? (
            <div className='mt-0.5 text-[10.5px] leading-tight text-neutral-500'>{d.sublabel}</div>
          ) : null}

          {d.hiddenCount > 0 || d.expanded ? (
            <button
              className={cn(
                'nodrag nopan absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-medium transition-colors',
                d.expanded
                  ? 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'border-dashed border-neutral-600 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200',
              )}
              onClick={(e) => {
                e.stopPropagation()
                d.onToggleExpand?.()
              }}
              aria-label={
                d.expanded
                  ? 'collapse neighbors'
                  : `reveal ${d.hiddenCount} connected record${d.hiddenCount === 1 ? '' : 's'}`
              }
              title={d.expanded ? 'collapse neighbors' : `reveal ${d.hiddenCount} connected record${d.hiddenCount === 1 ? '' : 's'}`}>
              {d.expanded ? (
                <>
                  <ChevronUp className='h-2.5 w-2.5' /> collapse
                </>
              ) : (
                <>
                  <ChevronDown className='h-2.5 w-2.5' /> +{d.hiddenCount}
                </>
              )}
            </button>
          ) : null}
        </section>
      </main>
    </div>
  )
}
