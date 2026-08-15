'use client'

import type {Meta, StoryObj} from '@storybook/react'
import {useState} from 'react'

import {ArchiveNavigator} from './ArchiveNavigator'
import {DocumentViewerHeader} from './DocumentViewerHeader'
import {FieldReportCanvas} from './FieldReportCanvas'
import {LinkedAttachments} from './LinkedAttachments'
import {ReadingRoomDetails} from './ReadingRoomDetails'
import {ReadingRoomShell} from './ReadingRoomShell'
import {
  SAMPLE_ARCHIVE_TREE,
  SAMPLE_ATTACHMENTS,
  SAMPLE_DETAILS,
  SAMPLE_FIELD_REPORT,
} from './sample-data'
import type {ArchiveNavMode} from './types'

const meta: Meta<typeof ReadingRoomShell> = {
  title: 'Research UI/Shells/Reading Room/ReadingRoomShell',
  component: ReadingRoomShell,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'leather',
      values: [{name: 'leather', value: '#14110e'}],
    },
    docs: {
      description: {
        component:
          'Archival-material Declassified Reading Room shell. Compose ArchiveNavigator, FieldReportCanvas, LinkedAttachments, and ReadingRoomDetails with typed props.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

function InteractiveReadingRoom() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<ArchiveNavMode>('collection')
  const [activeId, setActiveId] = useState('roswell-field')
  const [expandedIds, setExpandedIds] = useState<string[]>(['roswell', 'classic'])
  const [detailsTab, setDetailsTab] = useState('details')
  const [isStarred, setIsStarred] = useState(true)

  return (
    <ReadingRoomShell
      navigator={{
        query,
        onQueryChange: setQuery,
        mode,
        onModeChange: setMode,
        nodes: SAMPLE_ARCHIVE_TREE,
        activeId,
        expandedIds,
        onToggleExpand: (id) =>
          setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          ),
        onSelect: setActiveId,
        verifiedCount: 1164,
        totalCount: 1482,
        onPrimaryAction: () => undefined,
      }}
      documentHeader={{
        title: SAMPLE_FIELD_REPORT.title,
        isStarred,
        onToggleStar: () => setIsStarred((value) => !value),
        tags: [
          {label: 'Roswell', variant: 'bronze'},
          {label: '1947', variant: 'bronze'},
          {label: 'Field Report', variant: 'outline'},
          {label: 'AAF', variant: 'bronze'},
        ],
        onPrev: () => undefined,
        onNext: () => undefined,
        onSearch: () => undefined,
        onShare: () => undefined,
      }}
      document={SAMPLE_FIELD_REPORT}
      attachments={SAMPLE_ATTACHMENTS}
      details={{
        ...SAMPLE_DETAILS,
        activeTabId: detailsTab,
        onTabChange: setDetailsTab,
      }}
    />
  )
}

export const Default: Story = {
  render: () => <InteractiveReadingRoom />,
}

export const FieldReportOnly: Story = {
  render: () => (
    <div className='min-h-screen bg-[#1a1410] p-6'>
      <FieldReportCanvas document={SAMPLE_FIELD_REPORT} />
    </div>
  ),
  parameters: {layout: 'fullscreen'},
}

export const NavigatorOnly: Story = {
  render: function NavigatorStory() {
    const [query, setQuery] = useState('')
    const [mode, setMode] = useState<ArchiveNavMode>('collection')
    const [activeId, setActiveId] = useState('roswell')
    const [expandedIds, setExpandedIds] = useState<string[]>(['roswell'])
    return (
      <div className='flex h-[640px] bg-[#14110e]'>
        <ArchiveNavigator
          query={query}
          onQueryChange={setQuery}
          mode={mode}
          onModeChange={setMode}
          nodes={SAMPLE_ARCHIVE_TREE}
          activeId={activeId}
          expandedIds={expandedIds}
          onToggleExpand={(id) =>
            setExpandedIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            )
          }
          onSelect={setActiveId}
          verifiedCount={1164}
          totalCount={1482}
          onPrimaryAction={() => undefined}
        />
      </div>
    )
  },
}

export const ViewerChrome: Story = {
  render: () => (
    <div className='bg-[#1a1410]'>
      <DocumentViewerHeader
        title='Roswell Incident Field Report'
        isStarred
        tags={[
          {label: 'Roswell', variant: 'bronze'},
          {label: '1947', variant: 'bronze'},
        ]}
      />
      <LinkedAttachments items={SAMPLE_ATTACHMENTS} />
    </div>
  ),
}

export const DetailsPanel: Story = {
  render: function DetailsStory() {
    const [tab, setTab] = useState('details')
    return (
      <div className='flex h-[720px] justify-end bg-[#14110e]'>
        <ReadingRoomDetails {...SAMPLE_DETAILS} activeTabId={tab} onTabChange={setTab} />
      </div>
    )
  },
}
