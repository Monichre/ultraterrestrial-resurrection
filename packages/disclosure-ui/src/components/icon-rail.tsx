import { cn } from '../lib/cn'

import type { IconRailProps } from './types'

export function IconRail({ items, className, tone = 'leather' }: IconRailProps) {
  return (
    <nav
      aria-label="Primary utilities"
      className={cn(
        'flex w-12 shrink-0 flex-col items-center gap-1 border-r py-3',
        tone === 'leather'
          ? 'border-[oklch(0.55_0.04_75_/_0.35)] bg-[oklch(0.14_0.015_55)]'
          : 'border-white/10 bg-[oklch(0.12_0.02_255)]',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          title={item.label}
          aria-label={item.label}
          aria-current={item.isActive ? 'page' : undefined}
          onClick={item.onSelect}
          className={cn(
            'flex size-9 items-center justify-center rounded-sm text-zinc-400 transition-colors duration-150',
            'hover:bg-white/5 hover:text-zinc-100 active:scale-[0.97]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70',
            item.isActive &&
              (tone === 'leather'
                ? 'bg-[oklch(0.62_0.09_75_/_0.18)] text-[oklch(0.82_0.08_80)]'
                : 'bg-white/10 text-zinc-50')
          )}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  )
}
