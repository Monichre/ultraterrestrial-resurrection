'use client'

import {BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps} from '@xyflow/react'
import {EvidentiaryStateBadge} from '@/features/mindmap/components/evidentiary-state-badge'
import type {EvidentiaryState} from '@/features/mindmap/utils/evidentiary-state'
import type {RelationKind, SourceRef} from './types'
import {cn} from '@/utils'

/**
 * EvidenceEdge — ReactFlow edge that encodes epistemic tier in stroke +
 * dash (NarrativeEdge dash grammar) and stamps the canonical
 * EvidentiaryStateBadge at its midpoint.
 */

export type EvidenceEdgeFlowData = {
  relation: RelationKind
  tier: EvidentiaryState
  via: SourceRef[]
  counterReading?: string
  note?: string
  dimmed?: boolean
  /** Tier is collapsed in the legend — render as a faint ghost so topology stays honest. */
  ghosted?: boolean
  /** Called when the label pill is clicked — the pill is portaled out of the edge group, so it needs its own handler. */
  onInspect?: (edgeId: string) => void
}

/** Hex strokes — mirrors EVIDENTIARY_STATE_COLORS (tailwind classes aren't usable as SVG stroke). */
export const TIER_STROKE: Record<EvidentiaryState, string> = {
  Observed: '#34d399',
  Corroborated: '#6ee7b7',
  Contested: '#fbbf24',
  Inferred: '#38bdf8',
  Speculative: '#fb923c',
  Resonant: '#a78bfa',
  Unverified: '#a1a1aa',
  Disconfirmed: '#f87171',
}

/** Dash grammar by tier — reuses NarrativeEdge conventions (evidentiary `8 7`, hypothesis `2 8`, contradiction `12 4 2 4`). */
export const TIER_DASH: Record<EvidentiaryState, string | undefined> = {
  Observed: undefined,
  Corroborated: undefined,
  Contested: '12 4 2 4',
  Inferred: '8 7',
  Speculative: '2 8',
  Resonant: '4 3',
  Unverified: '6 6',
  Disconfirmed: '2 6',
}

/** Weight ramps with claim strength — corroboration is the thickest line on the desk. */
const TIER_WIDTH: Record<EvidentiaryState, number> = {
  Observed: 1.5,
  Corroborated: 3,
  Contested: 2,
  Inferred: 1.75,
  Speculative: 1.5,
  Resonant: 1.5,
  Unverified: 1.25,
  Disconfirmed: 1.75,
}

export function EvidenceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const d = (data ?? {}) as EvidenceEdgeFlowData
  const tier = d.tier ?? 'Unverified'

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
    offset: 24,
  })

  const stroke = TIER_STROKE[tier]
  const dimmed = d.dimmed
  const ghosted = d.ghosted

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={ghosted ? undefined : markerEnd}
        style={{
          stroke,
          strokeWidth: ghosted ? 1 : selected ? TIER_WIDTH[tier] + 1 : TIER_WIDTH[tier],
          strokeDasharray: ghosted ? '3 6' : TIER_DASH[tier],
          opacity: ghosted ? 0.1 : dimmed ? 0.12 : selected ? 0.9 : 0.6,
          pointerEvents: ghosted ? 'none' : undefined,
          transition: 'opacity 150ms ease',
        }}
      />
      {!dimmed && !ghosted && (
        <EdgeLabelRenderer>
          <button
            type='button'
            className={cn(
              'nodrag nopan absolute flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950 px-2 py-0.5 hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-400',
            )}
            onClick={(e) => {
              e.stopPropagation()
              d.onInspect?.(id)
            }}
            aria-label={`inspect ${d.relation?.replaceAll('_', ' ')} — ${tier}`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}>
            <span className='text-[9.5px] font-medium text-zinc-400'>
              {d.relation?.replaceAll('_', ' ')}
            </span>
            <EvidentiaryStateBadge state={tier} />
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
