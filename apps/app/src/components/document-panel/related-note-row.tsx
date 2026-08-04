'use client'

import {FileText, MoreHorizontal} from 'lucide-react'
import type {RelatedNote} from '@/components/document-panel/lib/document-panel-data'

type RelatedNoteRowProps = {
  note: RelatedNote
  selected: boolean
  onSelect: (id: string) => void
  onOverflow: (id: string) => void
}

export function RelatedNoteRow({note, selected, onSelect, onOverflow}: RelatedNoteRowProps) {
  return (
    <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
      <button
        type='button'
        className='dp-related-row'
        data-selected={selected}
        aria-pressed={selected}
        onClick={() => onSelect(note.id)}
      >
        <FileText
          width={12}
          height={12}
          strokeWidth={1.7}
          aria-hidden
          style={{color: 'var(--ink-muted)', flex: '0 0 auto'}}
        />
        <span className='dp-related-title'>{note.title}</span>
        <span className='dp-related-meta'>{note.updatedLabel}</span>
        <span style={{width: '18px', flex: '0 0 auto'}} aria-hidden='true' />
      </button>

      <button
        type='button'
        className='dp-iconbtn dp-iconbtn--ghost dp-iconbtn--dim'
        style={{position: 'absolute', right: '5px', width: '20px', height: '20px'}}
        aria-label={`More actions for ${note.title}`}
        aria-haspopup='menu'
        onClick={() => onOverflow(note.id)}
      >
        <MoreHorizontal width={13} height={13} strokeWidth={1.8} aria-hidden />
      </button>
    </div>
  )
}
