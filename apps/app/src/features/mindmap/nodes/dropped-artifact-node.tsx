'use client'

/**
 * Drop-to-Canvas (T-060) — the dropped artifact node.
 *
 * This is the user's own file sitting on the research canvas. It is styled as
 * a PALE sheet against the dark manila corpus nodes precisely so the
 * distinction "my thing" vs "the archive's records" is never ambiguous — the
 * inversion is readable at any zoom, before any text is legible.
 *
 * Nothing this node displays is persisted. Contract §2.1: the artifact is
 * session-scoped, the corpus was queried and not written to.
 */
import {useEffect, useState} from 'react'
import {Handle, Position, type NodeProps} from '@xyflow/react'
import {FileText, Image as ImageIcon, FileType2, AlertTriangle} from 'lucide-react'

import {EvidentiaryStateBadge} from '@/features/mindmap/components/evidentiary-state-badge'
import type {DropArtifact, DropKind, DropMatch, DropResponse} from '@/features/mindmap/drop/drop-contract'
import '@/features/mindmap/drop/canvas-drop.css'

type DroppedArtifactData = {
  dropStatus: 'pending' | 'resolved' | 'failed'
  filename: string
  sizeLabel: string
  kind: DropKind
  startedAt: number
  artifact?: DropArtifact
  matches?: DropMatch[]
  meta?: DropResponse['meta']
  matchCount?: number
  failure?: {code: string; title: string; detail: string}
}

const KIND_ICON: Record<DropKind, typeof FileText> = {
  text: FileText,
  pdf: FileType2,
  image: ImageIcon,
}

const KIND_LABEL: Record<DropKind, string> = {
  text: 'Text',
  pdf: 'PDF',
  image: 'Image',
}

/**
 * Elapsed seconds since the request actually began.
 *
 * This is the ONLY progress signal shown, and it is measured, not scripted.
 * Contract §4 is a single non-streaming POST — the client genuinely cannot
 * observe when extraction ends and embedding starts, so naming those phases
 * would be fabricated telemetry on a product whose whole identity is rigor
 * about evidence. An indeterminate shimmer plus a true clock is the honest
 * pairing.
 */
function useElapsedSeconds(startedAt: number | undefined, active: boolean): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!active || !startedAt) return
    const tick = () => setElapsed(Math.max(0, Math.round((Date.now() - startedAt) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [active, startedAt])

  return elapsed
}

export function DroppedArtifactNode({data}: NodeProps) {
  const d = data as unknown as DroppedArtifactData
  const isPending = d.dropStatus === 'pending'
  const isFailed = d.dropStatus === 'failed'
  const elapsed = useElapsedSeconds(d.startedAt, isPending)

  const Icon = isFailed ? AlertTriangle : (KIND_ICON[d.kind] ?? FileText)
  const matchCount = d.matchCount ?? 0
  const derivedViaCaption = d.artifact?.derivedVia === 'vision-caption'

  return (
    <div className='ut-drop-artifact' data-status={d.dropStatus}>
      <Handle type='target' position={Position.Top} />
      <Handle type='source' position={Position.Bottom} />

      <div className='ut-drop-artifact-edge' />

      <div className='space-y-2.5 p-3'>
        {/* Header: what this is, and that it is the user's, not the archive's. */}
        <div className='flex items-start gap-2'>
          <Icon className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          <div className='min-w-0 flex-1'>
            <div className='ut-drop-artifact-label'>Dropped file · not in archive</div>
            <div className='ut-drop-artifact-filename mt-1 text-[13px] font-medium'>
              {d.filename}
            </div>
          </div>
        </div>

        <div className='ut-drop-artifact-label flex items-center gap-2'>
          <span>{KIND_LABEL[d.kind] ?? 'File'}</span>
          <span aria-hidden>·</span>
          <span>{d.sizeLabel}</span>
          {d.meta?.truncated && (
            <>
              <span aria-hidden>·</span>
              <span title='Only the first 8,000 characters were embedded'>Excerpt embedded</span>
            </>
          )}
        </div>

        {/* --- Pending: indeterminate shimmer + a real clock. --- */}
        {isPending && (
          <div className='space-y-2 pt-1'>
            <div className='ut-drop-redaction w-full' />
            <div className='ut-drop-redaction w-4/5' />
            <div className='ut-drop-artifact-label pt-0.5'>
              Reading and comparing against the corpus · {elapsed}s
            </div>
          </div>
        )}

        {/* --- Failed --- */}
        {isFailed && d.failure && (
          <div className='space-y-1 pt-1'>
            <div className='text-[12px] font-medium' style={{color: 'oklch(0.42 0.17 27)'}}>
              {d.failure.title}
            </div>
            <div className='text-[11px] leading-relaxed' style={{color: 'oklch(0.36 0.02 40)'}}>
              {d.failure.detail}
            </div>
          </div>
        )}

        {/* --- Resolved --- */}
        {d.dropStatus === 'resolved' && (
          <div className='space-y-2.5 pt-0.5'>
            {/* Provenance warning. Contract §4: when derivedVia is
                'vision-caption' the user is seeing connections to a MACHINE
                DESCRIPTION of their image, not to the image. Presenting those
                silently as direct matches would be misleading, so this is
                stated on the node itself, not buried in the inspector. */}
            {derivedViaCaption && (
              <div
                className='ut-drop-stamp inline-block'
                style={{color: 'oklch(0.5 0.17 40)'}}
                title='The image was described in words, and those words were compared to the corpus'>
                Matched via image description
              </div>
            )}

            {d.artifact?.excerpt && (
              <p className='ut-drop-artifact-excerpt'>{d.artifact.excerpt}</p>
            )}

            <div className='flex items-center justify-between gap-2 border-t pt-2'
                 style={{borderColor: 'oklch(0.7 0.03 80 / 0.5)'}}>
              {matchCount === 0 ? (
                // A success state, not a failure (contract §5). The archive
                // was searched and had nothing near this — a real result.
                <span className='ut-drop-artifact-label' style={{color: 'oklch(0.38 0.02 60)'}}>
                  No connections found in the corpus
                </span>
              ) : (
                <span className='ut-drop-artifact-label'>
                  {matchCount} related record{matchCount === 1 ? '' : 's'}
                </span>
              )}
              <EvidentiaryStateBadge state={derivedViaCaption ? 'Speculative' : 'Inferred'} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DroppedArtifactNode
