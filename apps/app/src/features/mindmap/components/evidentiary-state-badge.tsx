'use client'

/**
 * Tiny uppercase chip marking a claim's evidentiary state ("claim
 * temperature") — the visible surface of the epistemic-tier requirement in
 * the Voice Contract (features/mindmap/CLAUDE.md). Shared by the research
 * suggestions dock (suggestion cards) and canvas edges (relationship
 * badges) so the vocabulary and colors stay in one place.
 */
import {EVIDENTIARY_STATE_COLORS, type EvidentiaryState} from '@/features/mindmap/utils/evidentiary-state'

export function EvidentiaryStateBadge({
  state,
  className = '',
}: {
  state: EvidentiaryState
  className?: string
}) {
  const c = EVIDENTIARY_STATE_COLORS[state]
  // Bracketed mono, mirroring the `[State]` wire prefix in edge reasoning:
  // the UI shows the same notation the data actually carries.
  return (
    <span
      className={`ut-mono inline-flex shrink-0 items-center rounded-[2px] border ${c.border} ${c.bg} px-1 py-px text-[8.5px] font-medium ${c.text} ${className}`}
    >
      [&thinsp;{state}&thinsp;]
    </span>
  )
}
