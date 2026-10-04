import type {Meta, StoryObj} from '@storybook/react'
import {ReactFlowProvider} from '@xyflow/react'
import {EntityNode} from './entity-node'

const meta: Meta<typeof EntityNode> = {
  title: 'Mindmap/Nodes/EntityNode',
  component: EntityNode as any,
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
type Story = StoryObj<typeof EntityNode>

export const EventCard: Story = {
  render: () => (
    <EntityNode
      id='event-1'
      data={{type: 'events', input: 'What happened at Roswell?', entities: []}}
    />
  ),
}
