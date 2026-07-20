'use client'

import {Plus, RefreshCw} from 'lucide-react'
import {useCallback, useState} from 'react'
import {INITIAL_NOTES, NOTE_TABS} from './fixtures'
import type {DeskNote, NoteTab} from './types'
import '../writers-desk-notes.css'

export interface NoteAppProps {
  initialNotes?: DeskNote[]
  initialTab?: NoteTab
  initialSelectedId?: string
  className?: string
}

export function NoteApp({
  initialNotes = INITIAL_NOTES,
  initialTab = 'Notes',
  initialSelectedId = '1',
  className,
}: NoteAppProps) {
  const [activeTab, setActiveTab] = useState<NoteTab>(initialTab)
  const [notes, setNotes] = useState<DeskNote[]>(initialNotes)
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    initialSelectedId || initialNotes[0]?.id || ''
  )

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? notes[0]

  const updateNote = useCallback(
    (field: 'title' | 'content', value: string) => {
      setNotes((prev) =>
        prev.map((note) => {
          if (note.id !== selectedNoteId) return note
          const updated = {...note, [field]: value}
          if (field === 'content') {
            updated.preview = value.slice(0, 70) + (value.length > 70 ? '...' : '')
          }
          return updated
        })
      )
    },
    [selectedNoteId]
  )

  const addNote = useCallback(() => {
    const newNote: DeskNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      preview: '',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNoteId(newNote.id)
  }, [])

  const refreshNote = useCallback(() => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              }),
            }
          : note
      )
    )
  }, [selectedNoteId])

  return (
    <div
      className={[
        'flex h-[600px] w-full flex-col overflow-hidden rounded-b-3xl rounded-tr-3xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}>
      <div className='relative z-10 flex h-12 items-end pl-5'>
        {NOTE_TABS.map((tab, idx) => (
          <button
            key={tab}
            type='button'
            onClick={() => setActiveTab(tab)}
            className={`mr-0.5 min-w-[130px] rounded-t-xl px-7 py-3 text-center text-sm font-medium tracking-tight transition-colors ${
              activeTab === tab
                ? 'z-30 bg-note-canvas pb-3 text-note-text'
                : idx === 1
                  ? 'z-20 bg-note-tab-1 text-note-text-secondary hover:bg-note-tab-1/80'
                  : 'z-10 bg-note-tab-2 text-note-text-secondary hover:bg-note-tab-2/80'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className='wd-paper-note-body relative z-[5] flex flex-1 overflow-hidden rounded-b-3xl rounded-tr-3xl'>
        <div className='flex w-[340px] flex-col border-r border-note-border bg-note-canvas/80'>
          <div className='flex items-center justify-between border-b border-note-border px-9 py-6'>
            <h3 className='text-base font-medium tracking-tight text-note-text'>All Notes</h3>
            <button
              type='button'
              onClick={addNote}
              className='flex h-7 w-7 items-center justify-center rounded-full border border-transparent transition-colors hover:bg-black/[0.04]'
              aria-label='Add note'>
              <Plus className='h-3.5 w-3.5 text-note-text' strokeWidth={2} />
            </button>
          </div>

          <div className='note-scrollbar flex-1 overflow-y-auto'>
            {notes.map((note) => (
              <button
                key={note.id}
                type='button'
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full border-b border-note-border px-9 py-6 text-left transition-colors ${
                  note.id === selectedNoteId ? 'bg-note-selected' : 'hover:bg-black/[0.02]'
                }`}>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-[10px] font-semibold uppercase tracking-widest text-note-text-secondary'>
                    {note.timestamp}
                  </span>
                </div>
                <h4 className='mb-1.5 text-base font-medium tracking-tight text-note-text'>
                  {note.title}
                </h4>
                <p className='truncate text-sm leading-relaxed text-note-text-preview'>
                  {note.preview}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-1 flex-col bg-note-canvas'>
          <div className='relative px-9 pb-6 pt-9'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <p className='mb-4 text-[11px] font-semibold uppercase tracking-widest text-note-text-secondary'>
                  Last edited today at {selectedNote?.timestamp}
                </p>
                <input
                  type='text'
                  value={selectedNote?.title ?? ''}
                  onChange={(e) => updateNote('title', e.target.value)}
                  className='w-full border-none bg-transparent text-[44px] font-normal leading-tight tracking-tight text-note-text outline-none'
                  spellCheck={false}
                />
              </div>
              <button
                type='button'
                onClick={refreshNote}
                className='p-1 transition-transform duration-500 hover:rotate-180'
                aria-label='Refresh'>
                <RefreshCw className='h-6 w-6 text-note-text' strokeWidth={1.5} />
              </button>
            </div>
            <div className='absolute bottom-0 left-9 right-9 h-px bg-note-border' />
          </div>

          <div className='note-scrollbar max-w-[800px] flex-1 overflow-y-auto px-9 py-6'>
            <textarea
              value={selectedNote?.content ?? ''}
              onChange={(e) => updateNote('content', e.target.value)}
              className='h-full w-full resize-none border-none bg-transparent text-lg font-normal leading-relaxed text-note-text-body outline-none'
              spellCheck={false}
              placeholder='Start writing...'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
