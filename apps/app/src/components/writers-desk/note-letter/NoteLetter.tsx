'use client'

import {
  DEFAULT_LETTER_PARAGRAPHS,
  DEFAULT_LETTER_SIGNATURE,
  DEFAULT_LETTER_TITLE,
} from './fixtures'
import { NoteLetterContent } from './NoteLetterContent'
import { NoteLetterShell } from './NoteLetterShell'
import type { NoteParagraph, NoteSignature } from './types'
import '../writers-desk-notes.css'

export interface NoteLetterProps {
  title?: string
  paragraphs?: NoteParagraph[]
  signature?: NoteSignature
  compact?: boolean
}

export function NoteLetter({
  title = DEFAULT_LETTER_TITLE,
  paragraphs = DEFAULT_LETTER_PARAGRAPHS,
  signature = DEFAULT_LETTER_SIGNATURE,
  compact = false,
}: NoteLetterProps) {
  return (
    <NoteLetterShell compact={compact}>
      <NoteLetterContent title={title} paragraphs={paragraphs} signature={signature} />
    </NoteLetterShell>
  )
}
