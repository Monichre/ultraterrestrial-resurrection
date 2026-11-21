import type {Meta, StoryObj} from '@storybook/react'
import {GraphPaper} from './GraphPaper'

const meta: Meta<typeof GraphPaper> = {
  title: 'UI/GraphPaper',
  component: GraphPaper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='h-screen w-screen bg-black'>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GraphPaper>

export const Default: Story = {}
