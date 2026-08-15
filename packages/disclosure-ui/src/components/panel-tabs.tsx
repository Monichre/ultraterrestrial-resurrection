import { cn } from '../lib/cn'

import type { PanelTabsProps } from './types'

export function PanelTabs({
  tabs,
  activeTabId,
  onTabChange,
  className,
  tone = 'slate',
}: PanelTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b',
        tone === 'bronze' ? 'border-[oklch(0.55_0.04_75_/_0.35)]' : 'border-white/10',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-150',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70',
              isActive ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {tab.label}
              {tab.badge != null ? (
                <span className="rounded-sm bg-white/10 px-1 py-px text-[9px] tabular-nums text-zinc-300">
                  {tab.badge}
                </span>
              ) : null}
            </span>
            {isActive ? (
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-2 -bottom-px h-px',
                  tone === 'bronze' ? 'bg-[oklch(0.72_0.1_75)]' : 'bg-amber-300'
                )}
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
