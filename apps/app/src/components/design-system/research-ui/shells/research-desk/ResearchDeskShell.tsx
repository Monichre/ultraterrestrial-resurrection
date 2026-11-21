'use client'

import {cn} from '@/lib/utils'

import {ResearchAppChrome} from '../shared'

import {InsightWidgets} from './InsightWidgets'
import {LibrarySidebar} from './LibrarySidebar'
import {ResearchNotebook} from './ResearchNotebook'
import {TheoryCanvasPanel} from './TheoryCanvasPanel'
import type {ResearchDeskShellProps} from './types'

export function ResearchDeskShell({
  brand = 'Ultraterrestrial Research Desk',
  userName = 'Liam Ellis',
  userRole = 'Researcher',
  searchValue,
  onSearchChange,
  library,
  canvas,
  insights,
  notebook,
  className,
}: ResearchDeskShellProps) {
  return (
    <div
      className={cn(
        'flex h-[900px] min-h-[720px] w-full flex-col overflow-hidden bg-[oklch(0.12_0.02_255)] text-zinc-100',
        className
      )}>
      <ResearchAppChrome
        brand={brand}
        tone='slate'
        searchPlaceholder='Search people, events, documents…'
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchShortcutHint='⌘K'
        status={{label: 'Synced', tone: 'live'}}
        user={{name: userName, role: userRole, initials: 'LE'}}
        onThemeToggle={() => undefined}
      />

      <div className='flex min-h-0 flex-1'>
        <LibrarySidebar {...library} />

        <main className='flex min-w-0 flex-1 flex-col gap-3 p-3'>
          <TheoryCanvasPanel {...canvas} />
          <InsightWidgets {...insights} />
        </main>

        <ResearchNotebook {...notebook} />
      </div>
    </div>
  )
}
