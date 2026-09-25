import { cn } from '../lib/cn'

import type { TagPillProps } from './types'

const VARIANT: Record<NonNullable<TagPillProps['variant']>, string> = {
  bronze:
    'border-[oklch(0.62_0.09_75_/_0.45)] bg-[oklch(0.62_0.09_75_/_0.12)] text-[oklch(0.82_0.08_80)]',
  slate: 'border-white/15 bg-white/5 text-zinc-200',
  amber: 'border-amber-400/35 bg-amber-400/10 text-amber-200',
  teal: 'border-teal-400/35 bg-teal-400/10 text-teal-200',
  purple: 'border-violet-400/35 bg-violet-400/10 text-violet-200',
  green: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200',
  outline: 'border-white/20 bg-transparent text-zinc-300',
}

export function TagPill({
  label,
  variant = 'slate',
  size = 'sm',
  className,
  onClick,
  isActive,
}: TagPillProps) {
  const Comp = onClick ? 'button' : 'span'

  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-sm border font-medium tracking-[0.04em]',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        VARIANT[variant],
        isActive && 'ring-1 ring-amber-300/50',
        onClick &&
          'cursor-pointer transition-transform duration-150 hover:opacity-90 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70',
        className
      )}
    >
      {label}
    </Comp>
  )
}
