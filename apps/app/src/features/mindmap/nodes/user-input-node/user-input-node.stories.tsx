import type {Meta, StoryObj} from '@storybook/react'
import {ReactFlowProvider} from '@xyflow/react'
import {UserInputNode} from './user-input-node'

const meta: Meta<typeof UserInputNode> = {
  title: 'Mindmap/Nodes/UserInputNode',
  component: UserInputNode as any,
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
type Story = StoryObj<typeof UserInputNode>

export const Default: Story = {
  render: () =>
    (UserInputNode as any)({
      id: 'uin-1',
      type: 'userInputNode',
      data: {input: 'Show related events', isLoading: false},
      selected: false,
      dragging: false,
      zIndex: 0,
      selectable: true,
      deletable: true,
      draggable: true,
      isConnectable: false,
      positionAbsolute: {x: 0, y: 0},
      width: 420,
      height: 200,
    }),
}
