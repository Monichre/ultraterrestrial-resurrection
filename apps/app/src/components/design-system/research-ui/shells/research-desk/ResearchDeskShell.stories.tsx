'use client'

import type {Meta, StoryObj} from '@storybook/react'
import {useState} from 'react'

import {CanvasEntityNode} from './CanvasEntityNode'
import {EntityRecordCard} from './EntityRecordCard'
import {InsightWidgets} from './InsightWidgets'
import {LibrarySidebar} from './LibrarySidebar'
import {ResearchDeskShell} from './ResearchDeskShell'
import {ResearchNotebook} from './ResearchNotebook'
import {TheoryCanvasPanel} from './TheoryCanvasPanel'
import {
  SAMPLE_CLUSTERS,
  SAMPLE_EDGES,
  SAMPLE_LIBRARY,
  SAMPLE_NODES,
  SAMPLE_POSTITS,
  SAMPLE_SUGGESTIONS,
  SAMPLE_TIMELINE,
} from './sample-data'

const meta: Meta<typeof ResearchDeskShell> = {
  title: 'Research UI/Shells/Research Desk/ResearchDeskShell',
  component: ResearchDeskShell,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'desk',
      values: [{name: 'desk', value: '#0b1220'}],
    },
    docs: {
      description: {
        component:
          'Techno-analytical Research Desk shell. Library sidebar, theory canvas, insight widgets, and research notebook compose via typed props.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

function InteractiveResearchDesk() {
  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState<string[]>(['documents', 'hypotheses', 'people'])
  const [selectedRecord, setSelectedRecord] = useState('d1')
  const [canvasTab, setCanvasTab] = useState('theory')
  const [selectedNodeId, setSelectedNodeId] = useState('hyp')
  const [notebookTab, setNotebookTab] = useState('notes')

  const library = SAMPLE_LIBRARY.map((category) => ({
    ...category,
    records: category.records.map((record) => ({
      ...record,
      isActive: record.id === selectedRecord,
    })),
  }))

  return (
    <ResearchDeskShell
      searchValue={search}
      onSearchChange={setSearch}
      library={{
        categories: library,
        expandedIds,
        onToggleExpand: (id) =>
          setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          ),
        onSelectRecord: setSelectedRecord,
      }}
      canvas={{
        tabs: [
          {id: 'theory', label: 'Theory Canvas'},
          {id: 'timeline', label: 'Timeline'},
          {id: 'map', label: 'Map'},
        ],
        activeTabId: canvasTab,
        onTabChange: setCanvasTab,
        nodes: SAMPLE_NODES,
        edges: SAMPLE_EDGES,
        selectedNodeId,
        onSelectNode: setSelectedNodeId,
        collaborators: [
          {id: 'c1', initials: 'LE'},
          {id: 'c2', initials: 'AR'},
        ],
        onShare: () => undefined,
      }}
      insights={{
        timeline: SAMPLE_TIMELINE,
        clusters: SAMPLE_CLUSTERS,
        suggestions: SAMPLE_SUGGESTIONS,
      }}
      notebook={{
        activeTabId: notebookTab,
        onTabChange: setNotebookTab,
        noteTitle: 'Nuclear Technology Recovery Program',
        noteBody:
          'Working theory: recovered materials were routed through Wright Field under a nuclear-adjacent exploitation program. MOGUL remains the public cover, but transfer timing and lab destination conflict with balloon recovery norms.',
        tags: ['#hypothesis', '#nuclear', '#roswell'],
        postIts: SAMPLE_POSTITS,
        handwrittenNotes: ['Marcel story holds under cross-check', 'Need lab accession numbers'],
      }}
    />
  )
}

export const Default: Story = {
  render: () => <InteractiveResearchDesk />,
}

export const TheoryCanvasOnly: Story = {
  render: function CanvasStory() {
    const [tab, setTab] = useState('theory')
    const [selected, setSelected] = useState('hyp')
    return (
      <div className='h-[640px] bg-[#0b1220] p-4'>
        <TheoryCanvasPanel
          tabs={[
            {id: 'theory', label: 'Theory Canvas'},
            {id: 'timeline', label: 'Timeline'},
            {id: 'map', label: 'Map'},
          ]}
          activeTabId={tab}
          onTabChange={setTab}
          nodes={SAMPLE_NODES}
          edges={SAMPLE_EDGES}
          selectedNodeId={selected}
          onSelectNode={setSelected}
          collaborators={[{id: 'c1', initials: 'LE'}]}
          onShare={() => undefined}
        />
      </div>
    )
  },
}

export const LibraryOnly: Story = {
  render: function LibraryStory() {
    const [expandedIds, setExpandedIds] = useState(['documents', 'people'])
    return (
      <div className='flex h-[640px] bg-[#0b1220]'>
        <LibrarySidebar
          categories={SAMPLE_LIBRARY}
          expandedIds={expandedIds}
          onToggleExpand={(id) =>
            setExpandedIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            )
          }
          onSelectRecord={() => undefined}
        />
      </div>
    )
  },
}

export const EntityCards: Story = {
  render: () => (
    <div className='grid max-w-sm gap-2 bg-[#0b1220] p-4'>
      {SAMPLE_LIBRARY[0].records.map((record) => (
        <EntityRecordCard key={record.id} record={record} onSelect={() => undefined} />
      ))}
      <EntityRecordCard
        record={{
          id: 'h1',
          title: 'Nuclear Technology Recovery Program',
          subtitle: 'Confidence 0.68',
          category: 'hypotheses',
          isActive: true,
        }}
      />
    </div>
  ),
}

export const InsightStrip: Story = {
  render: () => (
    <div className='bg-[#0b1220] p-4'>
      <InsightWidgets
        timeline={SAMPLE_TIMELINE}
        clusters={SAMPLE_CLUSTERS}
        suggestions={SAMPLE_SUGGESTIONS}
      />
    </div>
  ),
}

export const NotebookOnly: Story = {
  render: function NotebookStory() {
    const [tab, setTab] = useState('notes')
    return (
      <div className='flex h-[720px] justify-end bg-[#0b1220]'>
        <ResearchNotebook
          activeTabId={tab}
          onTabChange={setTab}
          noteTitle='Nuclear Technology Recovery Program'
          noteBody='Draft working note for the active hypothesis. Capture contradictions without collapsing them.'
          tags={['#hypothesis', '#nuclear']}
          postIts={SAMPLE_POSTITS}
          handwrittenNotes={['Cross-check Haut timestamps']}
        />
      </div>
    )
  },
}

export const SingleCanvasNode: Story = {
  render: () => (
    <div className='relative h-64 bg-[#0b1220]'>
      <CanvasEntityNode
        node={{
          id: 'hyp',
          label: 'Nuclear Technology Recovery Program',
          category: 'hypotheses',
          x: 50,
          y: 50,
          confidence: 0.68,
          meta: 'Hypothesis',
        }}
        isSelected
      />
    </div>
  ),
}
