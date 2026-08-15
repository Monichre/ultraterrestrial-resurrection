import type {Meta, StoryObj} from '@storybook/react'
import {
  SessionProgressIndicator,
  SessionProgressBadge,
} from './SessionProgressIndicator'
import type {BackgroundTask} from '@/contexts/SessionContext'

const meta = {
  title: 'Components/Progress/SessionProgressIndicator',
  component: SessionProgressIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-[420px] space-y-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SessionProgressIndicator>

export default meta
type Story = StoryObj<typeof meta>

const sampleTasks: BackgroundTask[] = [
  {
    id: 'task-1',
    type: 'search',
    status: 'running',
    progress: 65,
    title: 'Searching database',
    description: 'Full-text search across entity tables',
    createdAt: new Date(),
  },
  {
    id: 'task-2',
    type: 'analysis',
    status: 'completed',
    progress: 100,
    title: 'Entity analysis',
    description: 'Analyzing extracted entities',
    createdAt: new Date(),
    completedAt: new Date(),
    data: {entities: 42, confidence: 0.89},
  },
  {
    id: 'task-3',
    type: 'enrichment',
    status: 'pending',
    progress: 0,
    title: 'Data enrichment',
    description: 'Enriching entities with external sources',
    createdAt: new Date(),
  },
  {
    id: 'task-4',
    type: 'connection',
    status: 'failed',
    progress: 30,
    title: 'External API connection',
    description: 'Connecting to external data source',
    error: 'Connection timeout',
    createdAt: new Date(),
  },
]

export const Default: Story = {
  args: {
    tasks: sampleTasks,
  },
}

export const WithDetailsExpanded: Story = {
  args: {
    tasks: sampleTasks,
    showDetails: true,
  },
}

export const Empty: Story = {
  args: {
    tasks: [],
  },
}

export const Badge: Story = {
  render: () => <SessionProgressBadge tasks={sampleTasks} />,
}
