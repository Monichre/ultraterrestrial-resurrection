import { cn } from '../lib/cn'

import type { SectionHeadingProps } from './types'

export function SectionHeading({ title, subtitle, meta, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="text-wrap-balance text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-200">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {meta ? <div className="shrink-0">{meta}</div> : null}
    </div>
  )
}
