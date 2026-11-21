'use client'

import {ChevronDown, ChevronRight} from 'lucide-react'

import {cn} from '@/lib/utils'

import {SectionHeading} from '../shared'
import {ENTITY_CATEGORY_COLORS} from '../shared/tokens'

import {EntityRecordCard} from './EntityRecordCard'
import type {LibrarySidebarProps} from './types'

export function LibrarySidebar({
  title = 'Library',
  categories,
  expandedIds,
  onToggleExpand,
  onSelectRecord,
  className,
}: LibrarySidebarProps) {
  return (
    <aside
      className={cn(
        'flex w-[280px] shrink-0 flex-col border-r border-white/10 bg-[oklch(0.16_0.02_255)]',
        className
      )}>
      <div className='border-b border-white/10 px-3 py-3'>
        <SectionHeading title={title} subtitle='Records available to the canvas' />
      </div>
      <div className='min-h-0 flex-1 space-y-1 overflow-y-auto p-2'>
        {categories.map((category) => {
          const isExpanded = expandedIds.includes(category.id)
          const accent = ENTITY_CATEGORY_COLORS[category.category]
          return (
            <div key={category.id}>
              <button
                type='button'
                onClick={() => onToggleExpand(category.id)}
                className='flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-xs text-zinc-200 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
                {isExpanded ? (
                  <ChevronDown className='size-3.5 opacity-70' />
                ) : (
                  <ChevronRight className='size-3.5 opacity-70' />
                )}
                <span className='size-2 rounded-full' style={{background: accent}} aria-hidden />
                <span className='min-w-0 flex-1 truncate font-medium'>{category.label}</span>
                <span className='rounded-sm bg-white/8 px-1.5 py-0.5 text-[10px] tabular-nums text-zinc-400'>
                  {category.count}
                </span>
              </button>
              {isExpanded ? (
                <div className='ml-4 space-y-1 border-l border-white/8 py-1 pl-2'>
                  {category.records.map((record) => (
                    <EntityRecordCard key={record.id} record={record} onSelect={onSelectRecord} />
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
