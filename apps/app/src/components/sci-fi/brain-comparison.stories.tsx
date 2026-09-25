import type {Meta, StoryObj} from '@storybook/react'
import {BrainComparison} from './brain-comparison'

const meta: Meta<typeof BrainComparison> = {
  title: 'Sci-Fi/BrainComparison',
  component: BrainComparison,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BrainComparison>

export const Default: Story = {
  args: {},
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const WithCustomClass: Story = {
  args: {
    className: 'w-[500px] h-[300px]',
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}
