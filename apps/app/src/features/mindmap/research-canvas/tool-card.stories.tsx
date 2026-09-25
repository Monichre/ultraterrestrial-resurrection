import type {Meta, StoryObj} from '@storybook/react'

import type {AgentToolEvent} from '@/features/mindmap/hooks/use-mindmap-agent'
import {AgentToolEventList} from './agent-tool-event-list'
import './canvas-animations.css'

const meta: Meta<typeof AgentToolEventList> = {
  title: 'Research Canvas/ToolCards',
  component: AgentToolEventList,
  tags: ['autodocs'],
  parameters: {layout: 'centered', backgrounds: {default: 'dark'}},
  decorators: [
    (Story) => (
      <div
        className='ut-canvas'
        style={{
          width: 560,
          padding: 16,
          background: 'var(--ut-void)',
          fontFamily: 'var(--font-martian-mono), monospace',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AgentToolEventList>

const STREAM: AgentToolEvent[] = [
  {
    tool: 'searchDatabase',
    status: 'processing',
    parameters: {search_terms: ['Roswell', 'Mogul'], table: 'events', limit: 8},
  },
  {
    tool: 'searchDatabase',
    status: 'complete',
    result: {results: [{}, {}, {}, {}, {}, {}]},
  },
  {
    tool: 'searchExternalResources',
    status: 'processing',
    parameters: {query: 'Roswell debris field 1947 press release'},
  },
  {
    tool: 'searchExternalResources',
    status: 'error',
    message: 'external_search_failed: Exa returned 429',
  },
  {tool: 'addGraphNodes', status: 'processing', parameters: {requested: 6}},
  {tool: 'addGraphNodes', status: 'complete', result: {nodes: [{}, {}, {}, {}, {}, {}]}},
  {tool: 'addGraphEdges', status: 'processing', parameters: {requested: 5}},
  {tool: 'addGraphEdges', status: 'complete', result: {edges: [{}, {}, {}, {}, {}]}},
]

export const CompletedRun: Story = {
  args: {events: STREAM},
}

export const Streaming: Story = {
  args: {events: STREAM.slice(0, 3)},
}

export const ZeroMatches: Story = {
  name: 'Zero matches is a result, not an error',
  args: {
    events: [
      {tool: 'searchDatabase', status: 'processing', parameters: {search_terms: ['Utsuro-bune']}},
      {tool: 'searchDatabase', status: 'complete', result: {results: []}},
    ],
  },
}

export const UnknownTool: Story = {
  args: {
    events: [
      {tool: 'researchExternalTopic', status: 'processing', parameters: {topic: 'Project Mogul'}},
      {tool: 'researchExternalTopic', status: 'complete', message: 'Dossier drafted'},
    ],
  },
}
