import type {Meta, StoryObj} from '@storybook/react'
import {ReactFlowProvider} from '@xyflow/react'
import {DocumentNode} from './document-node'

const meta: Meta<typeof DocumentNode> = {
  title: 'Mindmap/Nodes/DocumentNode',
  component: DocumentNode as any,
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
type Story = StoryObj<typeof DocumentNode>

export const Default: Story = {
  render: () => (
    <DocumentNode
      id='doc-1'
      data={{title: 'Classified Memo', content: 'Declassified excerpt...'}}
    />
  ),
}
