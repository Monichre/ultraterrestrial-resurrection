import type {Meta, StoryObj} from '@storybook/react'
import {ReactFlowProvider} from '@xyflow/react'
import {AIAnnotationNode} from './ai-annotation-node'

const meta: Meta<typeof AIAnnotationNode> = {
  title: 'Mindmap/Nodes/AIAnnotationNode',
  component: AIAnnotationNode as any,
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
type Story = StoryObj<typeof AIAnnotationNode>

export const Default: Story = {
  render: () =>
    (AIAnnotationNode as any)({
      id: 'ai-anno-1',
      data: {
        text: 'Detected connection between Roswell witnesses and Blue Book briefings',
        insightType: 'connection',
      },
      selected: false,
      dragging: false,
      zIndex: 0,
      selectable: true,
      deletable: true,
      draggable: true,
      isConnectable: false,
      positionAbsolute: {x: 0, y: 0},
      width: 320,
      height: 160,
    }),
}
