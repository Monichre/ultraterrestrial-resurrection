import { cn } from '../lib/cn'

import type { ClassificationLevel, ClassificationStampProps } from './types'

const LEVEL_LABEL: Record<ClassificationLevel, string> = {
  unclassified: 'UNCLASSIFIED',
  confidential: 'CONFIDENTIAL',
  secret: 'SECRET',
  'top-secret': 'TOP SECRET',
}

const LEVEL_STYLE: Record<ClassificationLevel, string> = {
  unclassified: 'border-zinc-500/50 text-zinc-300',
  confidential: 'border-[oklch(0.62_0.09_75_/_0.55)] text-[oklch(0.82_0.08_80)]',
  secret: 'border-[oklch(0.48_0.18_25_/_0.65)] text-[oklch(0.75_0.14_25)]',
  'top-secret': 'border-red-500/60 text-red-300',
}

export function ClassificationStamp({
  level = 'confidential',
  label,
  className,
}: ClassificationStampProps) {
  const text = label ?? LEVEL_LABEL[level]

  return (
    <span
      className={cn(
        'inline-flex items-center border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]',
        LEVEL_STYLE[level],
        className
      )}
    >
      {text}
    </span>
  )
}
