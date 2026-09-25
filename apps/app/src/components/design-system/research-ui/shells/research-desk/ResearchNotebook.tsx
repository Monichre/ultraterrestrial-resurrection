import {Bold, Heading2, Heading3, Italic, List, LayoutTemplate} from 'lucide-react'

import {cn} from '@/lib/utils'

import {PanelTabs, PostItNote, SectionHeading, TagPill} from '../shared'
import {PAPER_TEXTURES} from '../shared/tokens'

import type {ResearchNotebookProps} from './types'

export function ResearchNotebook({
  activeTabId,
  onTabChange,
  noteTitle,
  noteBody,
  tags,
  postIts,
  handwrittenNotes = [],
  className,
  onTagClick,
}: ResearchNotebookProps) {
  return (
    <aside
      className={cn(
        'flex w-[320px] shrink-0 flex-col border-l border-white/10 bg-[oklch(0.16_0.02_255)]',
        className
      )}>
      <PanelTabs
        tabs={[
          {id: 'notes', label: 'Notes'},
          {id: 'inspector', label: 'Inspector'},
          {id: 'provenance', label: 'Provenance'},
        ]}
        activeTabId={activeTabId}
        onTabChange={onTabChange}
        className='px-2'
      />

      <div className='min-h-0 flex-1 space-y-4 overflow-y-auto p-3'>
        {activeTabId !== 'notes' ? (
          <p className='text-xs leading-relaxed text-zinc-500'>
            {activeTabId === 'inspector'
              ? 'Inspector binds to the selected canvas node. Select a node to load field-level metadata.'
              : 'Provenance for the active hypothesis will appear here once a record is focused.'}
          </p>
        ) : (
          <>
            <div className='space-y-2'>
              <div className='flex items-center justify-between gap-2'>
                <SectionHeading title='Research Notebook' />
                <button
                  type='button'
                  className='inline-flex items-center gap-1 rounded-sm border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
                  <LayoutTemplate className='size-3' />
                  Templates
                </button>
              </div>
              <div className='flex items-center gap-1 rounded-sm border border-white/10 bg-black/20 p-1'>
                {[Heading2, Heading3, Bold, Italic, List].map((Icon, index) => (
                  <button
                    key={index}
                    type='button'
                    className='flex size-7 items-center justify-center rounded-[3px] text-zinc-400 hover:bg-white/5 hover:text-zinc-100'>
                    <Icon className='size-3.5' />
                  </button>
                ))}
              </div>
            </div>

            <div
              className='relative overflow-hidden rounded-sm border border-white/10 px-3 py-3'
              style={{
                backgroundColor: 'oklch(0.93 0.01 95)',
                backgroundImage: `linear-gradient(oklch(0.93 0.01 95 / 0.92), oklch(0.91 0.015 90 / 0.94)), url(${PAPER_TEXTURES.twill})`,
              }}>
              <h4
                className='mb-2 text-base font-semibold text-zinc-900'
                style={{fontFamily: "var(--font-neue-haas), 'PP Neue Montreal', sans-serif"}}>
                {noteTitle}
              </h4>
              <div className='mb-3 flex flex-wrap gap-1.5'>
                {tags.map((tag) => (
                  <TagPill
                    key={tag}
                    label={tag}
                    variant='outline'
                    className='border-zinc-400/40 text-zinc-700'
                    onClick={onTagClick ? () => onTagClick(tag) : undefined}
                  />
                ))}
              </div>
              <p className='text-pretty text-sm leading-relaxed text-zinc-800'>{noteBody}</p>
              {handwrittenNotes.map((note, index) => (
                <p
                  key={note}
                  className={cn(
                    'mt-3 text-[17px] leading-snug text-blue-800',
                    index % 2 === 0 ? '-rotate-1' : 'rotate-1'
                  )}
                  style={{fontFamily: "var(--font-caveat), 'Caveat', cursive"}}>
                  {note}
                </p>
              ))}
            </div>

            <section className='space-y-2'>
              <SectionHeading title='Quick Notes' />
              <div className='flex flex-wrap gap-2'>
                {postIts.map((note, index) => (
                  <PostItNote key={`${note.content}-${index}`} {...note} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  )
}
