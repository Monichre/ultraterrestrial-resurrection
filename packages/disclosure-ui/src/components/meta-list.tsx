import { cn } from '../lib/cn'

import type { MetaListProps } from './types'

export function MetaList({ items, className, tone = 'slate' }: MetaListProps) {
  return (
    <dl
      className={cn(
        'space-y-2 text-xs',
        tone === 'bronze' ? 'text-[oklch(0.78_0.04_75)]' : 'text-zinc-300',
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-b pb-2',
            tone === 'bronze' ? 'border-[oklch(0.55_0.04_75_/_0.25)]' : 'border-white/8'
          )}
        >
          <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{item.label}</dt>
          <dd className="text-right text-zinc-200">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
