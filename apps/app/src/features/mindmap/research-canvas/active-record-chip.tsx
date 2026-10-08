'use client'

/**
 * The console's view of the canvas's active record. While a card is selected,
 * questions asked in the console carry that record as context (graph state
 * `activeNodeId`), so the chip says so — and × releases it.
 */
import {Crosshair, X} from 'lucide-react'
import {useNodesData, useReactFlow} from '@xyflow/react'

import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'
import {toRecordDossierView} from '@/features/mindmap/nodes/record-dossier-node/record-dossier-node'

export function useActiveRecord() {
  const activeId = useMindMapUiStore((s) => s.canvas.activeNode?.id ?? null)
  // Live data, not the stored node: the store copy goes stale after drag/measure.
  const live = useNodesData(activeId ?? '')
  if (!activeId || !live) return null
  return {
    id: activeId,
    ...toRecordDossierView(activeId, (live.data ?? {}) as Record<string, unknown>),
  }
}

export function useReleaseActiveRecord() {
  const {setNodes} = useReactFlow()
  const setActiveNode = useMindMapUiStore((s) => s.setActiveNode)
  return () => {
    setNodes((nodes) => nodes.map((node) => (node.selected ? {...node, selected: false} : node)))
    setActiveNode(null)
  }
}

export function ActiveRecordChip() {
  const record = useActiveRecord()
  const release = useReleaseActiveRecord()
  if (!record) return null

  return (
    <div
      role='status'
      aria-live='polite'
      className='flex h-10 max-w-[360px] items-center gap-2 rounded-full border border-[rgba(240,106,42,0.6)] bg-[var(--ut-surface)] pl-3 pr-1 text-[var(--ut-paper)] backdrop-blur-md'
    >
      <Crosshair className='size-4 shrink-0 text-[#f06a2a]' aria-hidden />
      <span className='shrink-0 font-[family-name:var(--font-martian-mono)] text-[9.5px] uppercase tracking-[0.14em] text-[#f06a2a]'>
        Tracing · {record.kind}
      </span>
      <span className='truncate text-[13px]'>{record.title}</span>
      <button
        type='button'
        onClick={release}
        aria-label={`Release ${record.title}`}
        className='flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--ut-ink-dim)] transition-colors hover:bg-white/10 hover:text-[var(--ut-paper)]'
      >
        <X className='size-4' />
      </button>
    </div>
  )
}
