'use client'

/**
 * Drop-to-Canvas (T-060) — match inspector.
 *
 * Opens when a fan-out match node is clicked. Shows the record's table,
 * title, the snippet that matched, and a route through to the full record.
 *
 * Two rules govern what this panel may say:
 *
 *  1. The RRF score is never shown, in any form — not as a number, a
 *     percentage, or a bar. UX_LANGUAGE_GUIDE §6.6 keeps ids, scores and
 *     embeddings out of user-facing text entirely, and RRF is rank
 *     agreement, so a magnitude would be false precision on top of that.
 *     Ordering and edge weight already carry everything the score asserts.
 *
 *  2. When the artifact was an image read via `vision-caption`, that is
 *     stated plainly here as well as on the node: the connection runs
 *     through a machine-written description, not the picture.
 */
import {ExternalLink, X} from 'lucide-react'

import {EvidentiaryStateBadge} from '@/features/mindmap/components/evidentiary-state-badge'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'
import './canvas-drop.css'

/** Table name -> the word a researcher would use for it. */
const TABLE_LABEL: Record<string, string> = {
  documents: 'Document',
  document_chunks: 'Document passage',
  people: 'Person',
  personnel: 'Person',
  organizations: 'Organization',
  events: 'Event',
  sightings: 'Sighting',
  testimonies: 'Testimony',
  topics: 'Topic',
  artifacts: 'Artifact',
}

export function DroppedMatchInspector() {
  const inspectedMatchNodeId = useMindMapUiStore((s) => s.drop.inspectedMatchNodeId)
  const setInspectedMatchNodeId = useMindMapUiStore((s) => s.setInspectedMatchNodeId)
  const {getNodes} = useMindMap()

  if (!inspectedMatchNodeId) return null

  const node = getNodes().find((n) => n.id === inspectedMatchNodeId)
  if (!node) return null

  const data = node.data as Record<string, unknown>
  const table = String(data.table ?? '')
  const title = String(data.title ?? data.label ?? 'Untitled record')
  const snippet = String(data.snippet ?? data.content ?? '')
  const url = typeof data.url === 'string' ? data.url : null

  // Provenance of the artifact this match hangs off, read from the artifact
  // node rather than duplicated onto every match.
  const artifactNodeId = String(data.matchOfArtifact ?? '')
  const artifactNode = getNodes().find((n) => n.id === artifactNodeId)
  const artifactData = artifactNode?.data as Record<string, unknown> | undefined
  const artifact = artifactData?.artifact as {derivedVia?: string; filename?: string} | undefined
  const derivedViaCaption = artifact?.derivedVia === 'vision-caption'

  return (
    <div className='ut-drop-inspector pointer-events-auto flex flex-col overflow-hidden'>
      <div className='flex items-start justify-between gap-2 border-b p-3'
           style={{borderColor: 'var(--ut-line)'}}>
        <div className='min-w-0'>
          <div className='ut-mono text-[8.5px]' style={{color: 'var(--ut-ink-faint)'}}>
            {TABLE_LABEL[table] ?? table ?? 'Record'}
          </div>
          <h3
            className='mt-1 text-[13px] font-medium leading-snug'
            style={{color: 'var(--ut-paper)'}}>
            {title}
          </h3>
        </div>
        <button
          type='button'
          onClick={() => setInspectedMatchNodeId(null)}
          aria-label='Close inspector'
          className='shrink-0 rounded-sm p-1 opacity-60 transition-opacity hover:opacity-100'>
          <X className='size-3.5' style={{color: 'var(--ut-paper)'}} />
        </button>
      </div>

      <div className='min-h-0 flex-1 space-y-3 overflow-y-auto p-3'>
        <div className='flex flex-wrap items-center gap-1.5'>
          <EvidentiaryStateBadge state={derivedViaCaption ? 'Speculative' : 'Inferred'} />
          {derivedViaCaption && (
            <span
              className='ut-drop-stamp'
              style={{color: 'oklch(0.72 0.16 45)'}}>
              Via image description
            </span>
          )}
        </div>

        {derivedViaCaption && (
          <p className='text-[11px] leading-relaxed' style={{color: 'var(--ut-ink-dim)'}}>
            This connection was made from a machine-written description of{' '}
            {artifact?.filename ? <em>{artifact.filename}</em> : 'the dropped image'}, not from the
            image itself. Treat the description as an additional layer of interpretation.
          </p>
        )}

        {snippet && (
          <div>
            <div className='ut-mono mb-1.5 text-[8.5px]' style={{color: 'var(--ut-ink-faint)'}}>
              Matching passage
            </div>
            <p className='ut-drop-inspector-snippet'>{snippet}</p>
          </div>
        )}

        <p className='text-[11px] leading-relaxed' style={{color: 'var(--ut-ink-dim)'}}>
          Surfaced because this record ranked consistently against the dropped file across the
          archive&rsquo;s search signals. Rank agreement indicates proximity, not corroboration —
          what the two share remains for you to establish.
        </p>
      </div>

      {url && (
        <a
          href={url}
          className='ut-mono flex items-center justify-between gap-2 border-t p-3 text-[9px] transition-opacity hover:opacity-80'
          style={{borderColor: 'var(--ut-line)', color: 'var(--ut-paper)'}}>
          Open record
          <ExternalLink className='size-3' />
        </a>
      )}
    </div>
  )
}
