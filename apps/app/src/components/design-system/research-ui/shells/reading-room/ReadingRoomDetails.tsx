import {ChevronRight, FileText} from 'lucide-react'

import {cn} from '@/lib/utils'

import {MetaList, PanelTabs, SectionHeading, TagPill} from '../shared'

import type {ReadingRoomDetailsProps} from './types'

export function ReadingRoomDetails({
  activeTabId,
  onTabChange,
  provenance,
  summary,
  topics,
  relatedFiles,
  relatedCases,
  notesSlot,
  onTopicClick,
  onRelatedFileClick,
  onRelatedCaseClick,
  className,
}: ReadingRoomDetailsProps) {
  return (
    <aside
      className={cn(
        'flex w-[300px] shrink-0 flex-col border-l border-[oklch(0.55_0.04_75_/_0.35)] bg-[oklch(0.15_0.015_55)]',
        className
      )}>
      <PanelTabs
        tone='bronze'
        tabs={[
          {id: 'details', label: 'Details'},
          {id: 'notes', label: 'Notes'},
        ]}
        activeTabId={activeTabId}
        onTabChange={onTabChange}
        className='px-2'
      />

      <div className='min-h-0 flex-1 space-y-5 overflow-y-auto p-3'>
        {activeTabId === 'notes' ? (
          (notesSlot ?? (
            <p className='text-xs leading-relaxed text-zinc-500'>
              No investigator notes yet. Add marginalia from the canvas or paste field observations
              here.
            </p>
          ))
        ) : (
          <>
            <section className='space-y-2'>
              <SectionHeading title='Provenance' />
              <MetaList items={provenance} tone='bronze' />
            </section>

            <section className='space-y-2'>
              <SectionHeading title='Executive Summary' />
              <p className='text-pretty text-xs leading-relaxed text-zinc-300'>{summary}</p>
            </section>

            <section className='space-y-2'>
              <SectionHeading title='Key Topics' />
              <div className='flex flex-wrap gap-1.5'>
                {topics.map((topic) => (
                  <TagPill
                    key={topic}
                    label={topic}
                    variant='bronze'
                    onClick={onTopicClick ? () => onTopicClick(topic) : undefined}
                  />
                ))}
              </div>
            </section>

            <section className='space-y-2'>
              <SectionHeading title='Related Files' />
              <ul className='space-y-1'>
                {relatedFiles.map((file) => (
                  <li key={file.id}>
                    <button
                      type='button'
                      onClick={() => onRelatedFileClick?.(file.id)}
                      className='flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
                      <FileText className='size-3.5 shrink-0 text-[oklch(0.7_0.08_75)]' />
                      <span className='min-w-0 flex-1'>
                        <span className='block truncate text-xs text-zinc-100'>{file.title}</span>
                        {file.date ? (
                          <span className='block text-[10px] uppercase tracking-[0.1em] text-zinc-500'>
                            {file.date}
                          </span>
                        ) : null}
                      </span>
                      <ChevronRight className='size-3.5 shrink-0 text-zinc-600' />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className='space-y-2'>
              <SectionHeading title='Related Case Files' />
              <div className='grid grid-cols-2 gap-2'>
                {relatedCases.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => onRelatedCaseClick?.(item.id)}
                    className='rounded-sm border border-[oklch(0.55_0.04_75_/_0.35)] bg-black/20 px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.82_0.05_80)] transition-colors hover:bg-[oklch(0.62_0.09_75_/_0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'>
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  )
}
