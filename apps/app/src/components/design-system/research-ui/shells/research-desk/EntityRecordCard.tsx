import {FileText, MapPin, Package, Sparkles, User, Calendar} from 'lucide-react'

import {cn} from '@/lib/utils'

import {ENTITY_CATEGORY_COLORS} from '../shared/tokens'
import type {EntityCategory} from '../shared'

import type {EntityRecordCardProps} from './types'

const ICONS: Partial<Record<EntityCategory, typeof FileText>> = {
  documents: FileText,
  people: User,
  events: Calendar,
  locations: MapPin,
  artifacts: Package,
  hypotheses: Sparkles,
}

export function EntityRecordCard({record, onSelect, className}: EntityRecordCardProps) {
  const Icon = ICONS[record.category] ?? FileText
  const accent = ENTITY_CATEGORY_COLORS[record.category]
  const Comp = onSelect ? 'button' : 'div'

  return (
    <Comp
      type={onSelect ? 'button' : undefined}
      onClick={onSelect ? () => onSelect(record.id) : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-sm border px-2 py-2 text-left transition-colors duration-150',
        'border-white/10 bg-[oklch(0.22_0.02_255)] hover:bg-[oklch(0.26_0.02_255)]',
        record.isActive && 'border-white/25 bg-[oklch(0.28_0.025_255)]',
        onSelect &&
          'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70',
        className
      )}>
      <span
        className='flex size-7 shrink-0 items-center justify-center rounded-[3px] border'
        style={{borderColor: `${accent}66`, color: accent, background: `${accent}18`}}>
        <Icon className='size-3.5' />
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block truncate text-xs font-medium text-zinc-100'>{record.title}</span>
        {record.subtitle ? (
          <span className='block truncate text-[10px] text-zinc-500'>{record.subtitle}</span>
        ) : null}
      </span>
    </Comp>
  )
}
