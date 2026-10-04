import type {Meta, StoryObj} from '@storybook/react'
import DynamicIsland from './DynamicIsland'

const meta = {
  title: 'Components/SmoothUI/DynamicIsland',
  component: DynamicIsland,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof DynamicIsland>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Timer: Story = {
  args: {
    view: 'timer',
  },
}

export const Ring: Story = {
  args: {
    view: 'ring',
  },
}

export const Notification: Story = {
  args: {
    view: 'notification',
  },
}

export const Music: Story = {
  args: {
    view: 'music',
  },
}
