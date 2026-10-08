'use client'

/**
 * RecordDossierNode — the one card every corpus record uses on the Research
 * Canvas (events, key figures, topics, organizations, documents, plus records
 * named by the agent). Same archival language as the tour's WaypointNode:
 * hairline frame, clipped corner, mono label row, serif title, provenance stamp.
 *
 * Provenance is the stamp's job: a solid stamp means the record exists in the
 * archive; a dashed stamp means the agent named it and no archive record backs
 * it (inference grammar, never presented as evidence).
 */
import {memo, useState} from 'react'
import {Handle, Position, type NodeProps} from '@xyflow/react'

import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'

import './record-dossier-node.css'

type RecordData = Record<string, unknown>

const KIND_LABEL: Record<string, string> = {
  events: 'Event',
  personnel: 'Key figure',
  key_figures: 'Key figure',
  topics: 'Topic',
  organizations: 'Organization',
  documents: 'Document',
  testimonies: 'Testimony',
  artifacts: 'Artifact',
  artifact: 'Artifact',
  sightings: 'Sighting',
  document_chunks: 'Document',
}

const DETAIL_ROUTE: Record<string, string> = {
  events: '/events',
  personnel: '/key-figures',
  key_figures: '/key-figures',
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function ordinal(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`
  return `${day}${['th', 'st', 'nd', 'rd'][day % 10] ?? 'th'}`
}

/** "March 16th, 1967" — the house date format. Unparseable input passes through. */
export function formatRecordDate(value: unknown): string | null {
  if (typeof value !== 'string' && !(value instanceof Date)) return null
  const raw = value instanceof Date ? value.toISOString() : value.trim()
  if (!raw) return null
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, y, m, d] = match
    return `${MONTHS[Number(m) - 1]} ${ordinal(Number(d))}, ${y}`
  }
  if (/^\d{4}$/.test(raw)) return raw
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return raw
  return `${MONTHS[parsed.getUTCMonth()]} ${ordinal(parsed.getUTCDate())}, ${parsed.getUTCFullYear()}`
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

/** First usable image URL from the shapes records use (string, {url}, [{url}]). */
function imageUrl(data: RecordData): string | null {
  for (const key of ['photo', 'photos', 'image', 'images']) {
    const value = data[key]
    const first = Array.isArray(value) ? value[0] : value
    const url = typeof first === 'string' ? first : (first as {url?: unknown} | undefined)?.url
    if (typeof url === 'string' && /^(https?:\/\/|\/)/.test(url.trim())) return url.trim()
  }
  return null
}

function location(data: RecordData): string | null {
  const place = text(data.location)
  if (place) return place
  const parts = [text(data.city), text(data.state), text(data.country)].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

export type RecordDossierView = {
  kind: string
  title: string
  subtitle: string | null
  date: string | null
  excerpt: string | null
  image: string | null
  provenance: 'archive' | 'agent'
  table: string | null
  href: string | null
}

/** Pure projection from raw node data to what the card shows. */
export function toRecordDossierView(id: string, data: RecordData): RecordDossierView {
  // `_table` is the search hit's real source; `type` is often the query's table.
  const table = text(data._table) ?? text(data.table) ?? text(data.type)
  const kind = (table && KIND_LABEL[table]) ?? 'Record'
  const title = text(data.name) ?? text(data.title) ?? text(data.label) ?? 'Untitled record'
  // Set explicitly by the agent path; every other add path places archive records.
  const provenance: RecordDossierView['provenance'] =
    data.provenance === 'agent' ? 'agent' : 'archive'
  const route = table ? DETAIL_ROUTE[table] : undefined

  return {
    kind,
    title,
    subtitle: text(data.role) ?? location(data),
    date: formatRecordDate(data.date ?? data.event_date ?? data.date_published),
    excerpt: text(data.description) ?? text(data.summary) ?? text(data.bio) ?? text(data.content),
    image: imageUrl(data),
    provenance,
    table,
    href: route && provenance === 'archive' ? `${route}/${id}` : null,
  }
}

export type RecordFocus = 'none' | 'active' | 'linked' | 'receded'

export const RecordDossierNode = memo(function RecordDossierNode({id, data, selected}: NodeProps) {
  const view = toRecordDossierView(id, (data ?? {}) as RecordData)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(view.image) && !imageFailed
  // Primitive selector: an object selector re-renders every card on any store write.
  const focus = useMindMapUiStore((s): RecordFocus => {
    const activeId = s.canvas.activeNode?.id
    if (!activeId) return 'none'
    if (activeId === id) return 'active'
    return s.canvas.activeNeighborIds.includes(id) ? 'linked' : 'receded'
  })
  const requestRecordAction = useMindMapUiStore((s) => s.requestRecordAction)

  return (
    <article
      className='ut-dossier-card'
      data-provenance={view.provenance}
      data-selected={selected ? 'true' : undefined}
      data-focus={focus}
      aria-label={`${view.kind}: ${view.title}`}
    >
      <Handle type='target' position={Position.Top} className='ut-dossier-card__handle' />

      <div className='ut-dossier-card__body'>
        <header className='ut-dossier-card__meta'>
          <span className='ut-dossier-card__kind'>{view.kind}</span>
          {view.date ? <span>{view.date}</span> : null}
        </header>

        <div className='ut-dossier-card__headline'>
          <div className='ut-dossier-card__titles'>
            <h3 className='ut-dossier-card__title'>{view.title}</h3>
            {view.subtitle ? (
              <div className='ut-dossier-card__subtitle'>{view.subtitle}</div>
            ) : null}
          </div>
          {showImage ? (
            // Plain img: corpus URLs are arbitrary hosts, and a dead one must
            // vanish instead of rendering a broken frame with alt text.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className='ut-dossier-card__plate'
              src={view.image as string}
              alt=''
              loading='lazy'
              onError={() => setImageFailed(true)}
            />
          ) : null}
        </div>

        {view.excerpt ? <div className='ut-dossier-card__excerpt'>{view.excerpt}</div> : null}

        <footer className='ut-dossier-card__footer'>
          <span className='ut-dossier-card__stamp'>
            {view.provenance === 'archive'
              ? `Archive record${view.table ? ` · ${view.table.replace(/_/g, ' ')}` : ''}`
              : 'Named by agent · no archive record'}
          </span>
          {focus === 'linked' ? <span className='ut-dossier-card__link-note'>Linked</span> : null}
        </footer>

        {selected ? (
          <div className='ut-dossier-card__actions nodrag nopan'>
            <button
              type='button'
              className='ut-dossier-card__action ut-dossier-card__action--primary'
              onClick={(event) => {
                event.stopPropagation()
                requestRecordAction(id, 'trace')
              }}
            >
              Trace connections
            </button>
            {view.href ? (
              <a className='ut-dossier-card__action' href={view.href}>
                Open record
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <Handle type='source' position={Position.Bottom} className='ut-dossier-card__handle' />
    </article>
  )
})
