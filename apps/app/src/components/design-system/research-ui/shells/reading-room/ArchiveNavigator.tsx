'use client'

import {ChevronDown, ChevronRight, FileText, Folder, Search} from 'lucide-react'

import {cn} from '@/lib/utils'

import {ProgressMeter} from '../shared'
import {PAPER_TEXTURES} from '../shared/tokens'

import type {ArchiveNavigatorProps, ArchiveTreeNode} from './types'

function TreeNodeRow({
  node,
  depth,
  activeId,
  expandedIds,
  onToggleExpand,
  onSelect,
}: {
  node: ArchiveTreeNode
  depth: number
  activeId?: string
  expandedIds: string[]
  onToggleExpand?: (id: string) => void
  onSelect: (id: string) => void
}) {
  const isExpanded = expandedIds.includes(node.id)
  const isActive = activeId === node.id
  const hasChildren = Boolean(node.children?.length)

  return (
    <div>
      <button
        type='button'
        onClick={() => {
          if (hasChildren) onToggleExpand?.(node.id)
          onSelect(node.id)
        }}
        className={cn(
          'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70',
          isActive
            ? 'bg-[oklch(0.62_0.09_75_/_0.18)] text-[oklch(0.88_0.06_80)]'
            : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-100'
        )}
        style={{paddingLeft: 8 + depth * 12}}>
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className='size-3 shrink-0 opacity-70' />
          ) : (
            <ChevronRight className='size-3 shrink-0 opacity-70' />
          )
        ) : (
          <span className='size-3 shrink-0' />
        )}
        {node.icon ??
          (node.kind === 'folder' ? (
            <Folder className='size-3.5 shrink-0 opacity-80' />
          ) : (
            <FileText className='size-3.5 shrink-0 opacity-80' />
          ))}
        <span className='min-w-0 flex-1 truncate'>{node.label}</span>
        {node.count != null ? (
          <span className='tabular-nums text-[10px] text-zinc-500'>{node.count}</span>
        ) : null}
      </button>
      {hasChildren && isExpanded
        ? node.children!.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))
        : null}
    </div>
  )
}

export function ArchiveNavigator({
  title = 'Archive Navigator',
  query,
  onQueryChange,
  mode,
  onModeChange,
  nodes,
  activeId,
  expandedIds = [],
  onToggleExpand,
  onSelect,
  verifiedCount = 0,
  totalCount = 0,
  primaryActionLabel = 'Request New Declassification',
  onPrimaryAction,
  className,
}: ArchiveNavigatorProps) {
  return (
    <aside
      className={cn(
        'relative flex w-[280px] shrink-0 flex-col border-r border-[oklch(0.55_0.04_75_/_0.35)]',
        'bg-[oklch(0.16_0.015_55)]',
        className
      )}>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.12]'
        style={{backgroundImage: `url(${PAPER_TEXTURES.fabric})`, backgroundRepeat: 'repeat'}}
      />
      <div className='relative flex min-h-0 flex-1 flex-col'>
        <div className='space-y-3 border-b border-[oklch(0.55_0.04_75_/_0.3)] p-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.78_0.05_75)]'>
            {title}
          </p>
          <label className='relative block'>
            <span className='sr-only'>Filter archive</span>
            <Search className='pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500' />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder='Filter collections…'
              className='h-8 w-full rounded-sm border border-[oklch(0.55_0.04_75_/_0.35)] bg-black/25 pl-8 pr-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/60'
            />
          </label>
          <div className='grid grid-cols-2 gap-1 rounded-sm border border-[oklch(0.55_0.04_75_/_0.3)] p-0.5'>
            {(
              [
                ['collection', 'By Collection'],
                ['timeline', 'By Timeline'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type='button'
                onClick={() => onModeChange(id)}
                className={cn(
                  'rounded-[2px] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
                  mode === id
                    ? 'bg-[oklch(0.62_0.09_75_/_0.22)] text-[oklch(0.88_0.06_80)]'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className='min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2'>
          {nodes.map((node) => (
            <TreeNodeRow
              key={node.id}
              node={node}
              depth={0}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))}
        </div>

        <div className='space-y-3 border-t border-[oklch(0.55_0.04_75_/_0.3)] p-3'>
          <ProgressMeter
            label='Verified & Indexed'
            value={verifiedCount}
            max={totalCount}
            helperText='Archive integrity status'
          />
          {onPrimaryAction ? (
            <button
              type='button'
              onClick={onPrimaryAction}
              className='w-full rounded-sm border border-[oklch(0.62_0.09_75_/_0.5)] bg-[oklch(0.62_0.09_75_/_0.16)] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[oklch(0.88_0.06_80)] transition-transform duration-150 hover:bg-[oklch(0.62_0.09_75_/_0.24)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
              {primaryActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
