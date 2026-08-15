import { cn } from '../lib/cn'

import type { StatusIndicatorProps } from './types'

const TONE_DOT: Record<NonNullable<StatusIndicatorProps['tone']>, string> = {
  live: 'bg-emerald-400 shadow-[0_0_0_3px_oklch(0.72_0.12_155_/_0.25)]',
  idle: 'bg-amber-300',
  warn: 'bg-orange-400',
  offline: 'bg-zinc-500',
}

export function StatusIndicator({ label, tone = 'live', className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em]',
        'border-white/10 bg-black/20 text-zinc-200',
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full', TONE_DOT[tone])} aria-hidden />
      {label}
    </span>
  )
}
