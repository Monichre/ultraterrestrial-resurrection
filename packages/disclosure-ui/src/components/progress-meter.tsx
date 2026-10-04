import { cn } from '../lib/cn'

import type { ProgressMeterProps } from './types'

export function ProgressMeter({ label, value, max, helperText, className }: ProgressMeterProps) {
  const safeMax = Math.max(max, 1)
  const pct = Math.min(100, Math.round((value / safeMax) * 100))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-2 text-[10px] uppercase tracking-[0.14em]">
        <span className="text-zinc-300">{label}</span>
        <span className="tabular-nums text-zinc-400">
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-sm bg-black/35"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={value}
        aria-label={label}
      >
        <div
          className="h-full w-full origin-left rounded-sm bg-[oklch(0.62_0.09_75)] transition-transform duration-200 motion-reduce:transition-none"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
      {helperText ? (
        <p className="text-[10px] tracking-[0.08em] text-zinc-500">{helperText}</p>
      ) : null}
    </div>
  )
}
