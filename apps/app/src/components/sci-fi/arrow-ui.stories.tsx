import type {Meta, StoryObj} from '@storybook/react'
import {ArrowUI} from './arrow-ui'

const meta: Meta<typeof ArrowUI> = {
  title: 'Sci-Fi/ArrowUI',
  component: ArrowUI,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ArrowUI>

export const Default: Story = {
  args: {},
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const ActiveState: Story = {
  args: {
    active: true,
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const CustomClass: Story = {
  args: {
    className: 'w-[600px] h-[300px]',
    active: true,
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}
