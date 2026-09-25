import { cn } from '../lib/cn'

import type { UserIdentityProps } from './types'

export function UserIdentity({
  name,
  role,
  avatarUrl,
  initials,
  className,
  onClick,
}: UserIdentityProps) {
  const fallback = initials ?? name.slice(0, 2).toUpperCase()
  const Comp = onClick ? 'button' : 'div'

  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border border-white/10 bg-black/15 px-2 py-1 text-left',
        'transition-colors duration-150 hover:border-white/20 hover:bg-black/25',
        onClick &&
          'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/70',
        className
      )}
    >
      <span className="relative size-7 shrink-0 overflow-hidden rounded-sm border border-white/15 bg-zinc-800">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-[10px] font-semibold text-zinc-200">
            {fallback}
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium text-zinc-100">{name}</span>
        {role ? (
          <span className="block truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">
            {role}
          </span>
        ) : null}
      </span>
    </Comp>
  )
}
