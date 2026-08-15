import type {Meta, StoryObj} from '@storybook/react'
import {BrainVisualization} from './brain-visualization'

const meta: Meta<typeof BrainVisualization> = {
  title: 'Sci-Fi/BrainVisualization',
  component: BrainVisualization,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BrainVisualization>

export const Default: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-black p-8 w-full'>
        <Story />
      </div>
    ),
  ],
}

export const WithCustomClass: Story = {
  args: {
    className: 'w-[500px] h-[300px]',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-black p-8 w-full'>
        <Story />
      </div>
    ),
  ],
}
