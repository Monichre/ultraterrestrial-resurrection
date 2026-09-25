'use client'

import {Archive, Bookmark, Home, Layers, Settings} from 'lucide-react'

import {cn} from '@/lib/utils'

import {IconRail, ResearchAppChrome} from '../shared'
import type {IconRailItem} from '../shared'
import {PAPER_TEXTURES} from '../shared/tokens'

import {ArchiveNavigator} from './ArchiveNavigator'
import {DocumentViewerHeader} from './DocumentViewerHeader'
import {FieldReportCanvas} from './FieldReportCanvas'
import {LinkedAttachments} from './LinkedAttachments'
import {ReadingRoomDetails} from './ReadingRoomDetails'
import type {ReadingRoomShellProps} from './types'

const DEFAULT_RAIL: IconRailItem[] = [
  {id: 'home', label: 'Home', icon: <Home className='size-4' />, isActive: false},
  {id: 'archive', label: 'Archive', icon: <Archive className='size-4' />, isActive: true},
  {id: 'layers', label: 'Collections', icon: <Layers className='size-4' />},
  {id: 'bookmark', label: 'Bookmarks', icon: <Bookmark className='size-4' />},
  {id: 'settings', label: 'Settings', icon: <Settings className='size-4' />},
]

export function ReadingRoomShell({
  brand = 'Ultraterrestrial Research Observer',
  pageTitle = 'Declassified Reading Room',
  pageSubtitle = 'Truth. Archived.',
  userName = 'Liam E.',
  userRole = 'Researcher',
  railItems = DEFAULT_RAIL,
  navigator,
  documentHeader,
  document,
  attachments,
  details,
  className,
}: ReadingRoomShellProps) {
  return (
    <div
      className={cn(
        'relative flex h-[900px] min-h-[720px] w-full flex-col overflow-hidden text-zinc-100',
        'bg-[oklch(0.13_0.015_55)]',
        className
      )}>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.08]'
        style={{backgroundImage: `url(${PAPER_TEXTURES.inflicted})`, backgroundRepeat: 'repeat'}}
      />

      <ResearchAppChrome
        brand={brand}
        title={pageTitle}
        subtitle={pageSubtitle}
        tone='leather'
        searchPlaceholder='Search declassified holdings…'
        status={{label: 'Synced', tone: 'live'}}
        user={{name: userName, role: userRole, initials: 'LE'}}
        onThemeToggle={() => undefined}
        className='relative z-10'
      />

      <div className='relative z-10 flex min-h-0 flex-1'>
        <IconRail tone='leather' items={railItems} />

        <ArchiveNavigator {...navigator} />

        <main className='flex min-w-0 flex-1 flex-col bg-[oklch(0.17_0.015_55)]'>
          <DocumentViewerHeader {...documentHeader} />
          <FieldReportCanvas document={document} className='min-h-0 flex-1' />
          <LinkedAttachments items={attachments} />
        </main>

        <ReadingRoomDetails {...details} />
      </div>
    </div>
  )
}
