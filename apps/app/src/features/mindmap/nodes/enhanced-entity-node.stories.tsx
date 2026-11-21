import type {Meta, StoryObj} from '@storybook/react'
import {ReactFlowProvider} from '@xyflow/react'
import {EnhancedEntityNode} from './enhanced-entity-node'

const meta: Meta<typeof EnhancedEntityNode> = {
  title: 'Mindmap/Nodes/EnhancedEntityNode',
  component: EnhancedEntityNode as any,
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
type Story = StoryObj<typeof EnhancedEntityNode>

export const Event: Story = {
  render: () => (
    <EnhancedEntityNode
      id='evt-1'
      data={{
        type: 'events',
        title: 'Roswell Incident',
        description: 'A seminal event in UFO history with wide-ranging impact.',
        date: '1947-07-08',
        location: 'Roswell, NM',
        photos: [{url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400'}],
      }}
    />
  ),
}
