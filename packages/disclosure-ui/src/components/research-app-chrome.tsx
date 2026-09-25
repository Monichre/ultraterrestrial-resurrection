import { Search, Sun } from 'lucide-react'

import { cn } from '../lib/cn'

import { StatusIndicator } from './status-indicator'
import type { ResearchAppChromeProps } from './types'
import { UserIdentity } from './user-identity'

export function ResearchAppChrome({
  brand,
  brandMark,
  title,
  subtitle,
  searchPlaceholder = 'Search archive…',
  searchValue,
  onSearchChange,
  searchShortcutHint = '⌘K',
  status,
  user,
  actions,
  tone = 'slate',
  className,
  onThemeToggle,
}: ResearchAppChromeProps) {
  const isLeather = tone === 'leather'

  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center gap-4 border-b px-3',
        isLeather
          ? 'border-[oklch(0.55_0.04_75_/_0.4)] bg-[oklch(0.15_0.015_55)]'
          : 'border-white/10 bg-[oklch(0.12_0.02_255)]',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-sm border text-xs font-bold',
            isLeather
              ? 'border-[oklch(0.62_0.09_75_/_0.45)] bg-[oklch(0.62_0.09_75_/_0.12)] text-[oklch(0.84_0.08_80)]'
              : 'border-white/15 bg-white/5 text-zinc-100'
          )}
        >
          {brandMark ?? brand.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
            {brand}
          </p>
          {title ? (
            <p
              className={cn(
                'truncate text-xs font-medium tracking-[0.04em]',
                isLeather ? 'text-[oklch(0.82_0.06_75)]' : 'text-zinc-400'
              )}
            >
              {title}
              {subtitle ? <span className="text-zinc-500"> · {subtitle}</span> : null}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl items-center">
        <label className="relative w-full">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              'h-9 w-full rounded-sm border bg-black/25 pl-9 pr-14 text-sm text-zinc-100 placeholder:text-zinc-500',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/60',
              isLeather ? 'border-[oklch(0.55_0.04_75_/_0.35)]' : 'border-white/10'
            )}
          />
          {searchShortcutHint ? (
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500">
              {searchShortcutHint}
            </kbd>
          ) : null}
        </label>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {actions}
        {onThemeToggle ? (
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={onThemeToggle}
            className="flex size-8 items-center justify-center rounded-sm border border-white/10 text-zinc-300 transition-colors hover:bg-white/5 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70"
          >
            <Sun className="size-3.5" />
          </button>
        ) : null}
        {status ? <StatusIndicator {...status} /> : null}
        <UserIdentity {...user} />
      </div>
    </header>
  )
}
