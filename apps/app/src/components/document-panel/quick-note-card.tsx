'use client'

import type {CSSProperties} from 'react'
import type {QuickNote} from '@/components/document-panel/lib/document-panel-data'

const TONE_STYLES: Record<QuickNote['tone'], CSSProperties> = {
  gold: {
    ['--tone-bg' as string]: 'var(--note-gold)',
    ['--tone-edge' as string]: 'var(--note-gold-edge)',
  },
  green: {
    ['--tone-bg' as string]: 'var(--note-green)',
    ['--tone-edge' as string]: 'var(--note-green-edge)',
  },
  blue: {
    ['--tone-bg' as string]: 'var(--note-blue)',
    ['--tone-edge' as string]: 'var(--note-blue-edge)',
  },
}

const TONE_ROTATION: Record<QuickNote['tone'], string> = {
  gold: 'rotate(-0.6deg)',
  green: 'rotate(0.4deg)',
  blue: 'rotate(-0.3deg)',
}

type QuickNoteCardProps = {
  note: QuickNote
  onOpen: (id: string) => void
}

export function QuickNoteCard({note, onOpen}: QuickNoteCardProps) {
  return (
    <button
      type='button'
      className='dp-note'
      style={{...TONE_STYLES[note.tone], transform: TONE_ROTATION[note.tone]}}
      onClick={() => onOpen(note.id)}
      aria-label={`${note.category}: ${note.body}`}
    >
      <span className='dp-note-heading'>{note.category}</span>
      <span className='dp-note-body'>{note.body}</span>
      {note.signature ? <span className='dp-note-sign'>{note.signature}</span> : null}
    </button>
  )
}
