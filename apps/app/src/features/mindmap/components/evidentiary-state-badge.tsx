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
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border ${c.border} ${c.bg} px-1 py-px text-[9px] font-semibold uppercase tracking-wide ${c.text} ${className}`}
    >
      {state}
    </span>
  )
}
