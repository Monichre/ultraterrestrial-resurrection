import {ChevronLeft, ChevronRight, MoreHorizontal, Search, Share2, Star} from 'lucide-react'

import {cn} from '@/lib/utils'

import {TagPill} from '../shared'

import type {DocumentViewerHeaderProps} from './types'

export function DocumentViewerHeader({
  title,
  isStarred,
  onToggleStar,
  tags,
  onPrev,
  onNext,
  onSearch,
  onShare,
  className,
}: DocumentViewerHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-[oklch(0.55_0.04_75_/_0.3)] px-4 py-3',
        className
      )}>
      <div className='min-w-0 space-y-2'>
        <div className='flex items-center gap-2'>
          <h2
            className='text-wrap-balance text-lg font-semibold tracking-tight text-[oklch(0.9_0.03_80)]'
            style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
            {title}
          </h2>
          <button
            type='button'
            aria-label={isStarred ? 'Unstar document' : 'Star document'}
            aria-pressed={Boolean(isStarred)}
            onClick={onToggleStar}
            className='rounded-sm p-1 text-zinc-500 transition-colors hover:text-[oklch(0.78_0.1_80)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
            <Star
              className={cn(
                'size-4',
                isStarred && 'fill-[oklch(0.78_0.1_80)] text-[oklch(0.78_0.1_80)]'
              )}
            />
          </button>
        </div>
        <div className='flex flex-wrap gap-1.5'>
          {tags.map((tag) => (
            <TagPill key={tag.label} label={tag.label} variant={tag.variant ?? 'bronze'} />
          ))}
        </div>
      </div>

      <div className='flex items-center gap-1'>
        {[
          {label: 'Previous document', icon: ChevronLeft, onClick: onPrev},
          {label: 'Next document', icon: ChevronRight, onClick: onNext},
          {label: 'Search in document', icon: Search, onClick: onSearch},
          {label: 'Share document', icon: Share2, onClick: onShare},
        ].map(({label, icon: Icon, onClick}) => (
          <button
            key={label}
            type='button'
            aria-label={label}
            onClick={onClick}
            className='flex size-8 items-center justify-center rounded-sm border border-[oklch(0.55_0.04_75_/_0.3)] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
            <Icon className='size-3.5' />
          </button>
        ))}
        <button
          type='button'
          aria-label='More actions'
          className='flex size-8 items-center justify-center rounded-sm border border-[oklch(0.55_0.04_75_/_0.3)] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
          <MoreHorizontal className='size-3.5' />
        </button>
      </div>
    </div>
  )
}
