import type { Meta, StoryObj } from '@storybook/react'
import { Archive, Bookmark, Home, Layers } from 'lucide-react'
import { useState } from 'react'

import {
  IconRail,
  MetaList,
  PanelTabs,
  PostItNote,
  ProgressMeter,
  ResearchAppChrome,
  SectionHeading,
  StatusIndicator,
  TagPill,
  UserIdentity,
  ClassificationStamp,
} from '../components'

const meta: Meta = {
  title: 'Primitives',
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'desk',
      values: [
        { name: 'desk', value: '#0f181c' },
        { name: 'leather', value: '#1a1410' },
      ],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const TagPillRow: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <TagPill label='Roswell' variant='bronze' />
      <TagPill label='Event' variant='amber' />
      <TagPill label='Location' variant='teal' />
      <TagPill label='Hypothesis' variant='purple' isActive />
      <TagPill label='Hunch' variant='green' />
      <TagPill label='Outline' variant='outline' onClick={() => undefined} />
    </div>
  ),
}

export const ClassificationStamps: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <ClassificationStamp level='unclassified' />
      <ClassificationStamp level='confidential' />
      <ClassificationStamp level='secret' />
      <ClassificationStamp level='top-secret' />
    </div>
  ),
}

export const StatusAndUser: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <StatusIndicator label='Synced' tone='live' />
      <StatusIndicator label='Idle' tone='idle' />
      <StatusIndicator label='Degraded' tone='warn' />
      <StatusIndicator label='Offline' tone='offline' />
      <UserIdentity name='Liam Ellis' role='Researcher' initials='LE' onClick={() => undefined} />
    </div>
  ),
}

export const ProgressAndMeta: Story = {
  render: () => (
    <div className='grid max-w-md gap-6'>
      <ProgressMeter
        label='Verified & Indexed'
        value={1164}
        max={1482}
        helperText='Archive integrity'
      />
      <MetaList
        tone='slate'
        items={[
          { label: 'Originating Agency', value: 'Army Air Forces' },
          { label: 'Docket', value: 'R-47-081' },
          { label: 'Release Date', value: '1994-09-08' },
        ]}
      />
    </div>
  ),
}

export const PostItBoard: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3 bg-zinc-900/40 p-6'>
      <PostItNote content='Check Haut press release timing' color='yellow' rotation={-3} />
      <PostItNote content='Need radiation survey raw numbers' color='green' rotation={2} />
      <PostItNote content='Interview notes contradict base log' color='blue' rotation={-1} />
      <PostItNote content='Follow FOIA packet #44' color='pink' rotation={3} author='LE' />
    </div>
  ),
}

export const TabsAndRail: Story = {
  render: function TabsAndRailStory() {
    const [tab, setTab] = useState('notes')
    return (
      <div className='flex gap-4'>
        <IconRail
          tone='slate'
          items={[
            { id: 'home', label: 'Home', icon: <Home className='size-4' /> },
            { id: 'archive', label: 'Archive', icon: <Archive className='size-4' />, isActive: true },
            { id: 'layers', label: 'Layers', icon: <Layers className='size-4' /> },
            { id: 'bookmark', label: 'Bookmarks', icon: <Bookmark className='size-4' /> },
          ]}
        />
        <div className='w-80 rounded-md border border-white/10 bg-zinc-950/60'>
          <PanelTabs
            tabs={[
              { id: 'notes', label: 'Notes' },
              { id: 'inspector', label: 'Inspector', badge: 3 },
              { id: 'provenance', label: 'Provenance' },
            ]}
            activeTabId={tab}
            onTabChange={setTab}
            className='px-2'
          />
          <div className='p-3'>
            <SectionHeading title='Active Panel' subtitle={`Showing ${tab}`} />
          </div>
        </div>
      </div>
    )
  },
}

export const ChromeLeather: Story = {
  render: () => (
    <ResearchAppChrome
      brand='Ultraterrestrial Research Observer'
      title='Declassified Reading Room'
      subtitle='Truth. Archived.'
      tone='leather'
      status={{ label: 'Synced', tone: 'live' }}
      user={{ name: 'Liam E.', role: 'Researcher', initials: 'LE' }}
      onThemeToggle={() => undefined}
    />
  ),
}

export const ChromeDesk: Story = {
  render: () => (
    <ResearchAppChrome
      brand='Ultraterrestrial Research Desk'
      tone='slate'
      searchShortcutHint='⌘K'
      status={{ label: 'Synced', tone: 'live' }}
      user={{ name: 'Liam Ellis', role: 'Researcher', initials: 'LE' }}
      onThemeToggle={() => undefined}
    />
  ),
}
