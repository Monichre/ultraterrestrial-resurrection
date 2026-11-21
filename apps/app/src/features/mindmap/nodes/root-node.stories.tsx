import type {Meta, StoryObj} from '@storybook/react'
import {ReactFlowProvider} from '@xyflow/react'
import {RootNode} from './root-node'

const meta: Meta<typeof RootNode> = {
  title: 'Mindmap/Nodes/RootNode',
  component: RootNode as any,
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className='p-6 bg-neutral-950 min-h-screen'>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RootNode>

export const Default: Story = {
  render: () =>
    (RootNode as any)({
      id: 'root-events',
      data: {
        name: 'Events',
        type: 'events',
        childCount: 0,
        label: 'Events',
        url: '',
        handles: [],
      },
      handles: [],
    }),
}
