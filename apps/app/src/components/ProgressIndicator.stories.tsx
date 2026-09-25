import type {Meta, StoryObj} from '@storybook/react'
import {
  ProgressIndicator,
  TaskProgressIndicator,
  LoadingSpinner,
} from './ProgressIndicator'

const meta = {
  title: 'Components/Progress/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-[400px] space-y-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  args: {
    progress: 0,
    status: 'pending',
    title: 'Waiting to start',
    description: 'Task is queued and waiting for processing',
  },
}

export const InProgress: Story = {
  args: {
    progress: 65,
    status: 'in-progress',
    title: 'Processing data',
    description: 'Analyzing documents and extracting entities',
  },
}

export const Completed: Story = {
  args: {
    progress: 100,
    status: 'completed',
    title: 'Analysis complete',
    description: 'All documents have been processed successfully',
  },
}

export const Error: Story = {
  args: {
    progress: 45,
    status: 'error',
    title: 'Processing failed',
    description: 'An error occurred while analyzing the data',
  },
}

export const WithoutPercentage: Story = {
  args: {
    progress: 50,
    status: 'in-progress',
    title: 'Processing without percentage',
    description: 'Progress bar without the percentage label',
    showPercentage: false,
  },
}

const sampleTasks = [
  {
    id: '1',
    type: 'search',
    status: 'completed' as const,
    progress: 100,
    title: 'Database search',
    description: 'Full-text search completed',
  },
  {
    id: '2',
    type: 'analysis',
    status: 'in-progress' as const,
    progress: 72,
    title: 'Entity analysis',
    description: 'Analyzing extracted entities',
  },
  {
    id: '3',
    type: 'enrichment',
    status: 'pending' as const,
    progress: 0,
    title: 'Data enrichment',
    description: 'Waiting for analysis to complete',
  },
]

export const TaskList: Story = {
  render: () => <TaskProgressIndicator tasks={sampleTasks} />,
}

export const Spinner: Story = {
  render: () => <LoadingSpinner size='lg' />,
}
