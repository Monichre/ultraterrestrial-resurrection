import type {Meta, StoryObj} from '@storybook/react'
import {Scanner} from './scanner'

const meta: Meta<typeof Scanner> = {
  title: 'Sci-Fi-HUD/Scanner',
  component: Scanner,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Scanner>

export const Default: Story = {
  args: {},
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const WithCustomSize: Story = {
  args: {
    className: 'w-[500px] h-[400px]',
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const ActiveState: Story = {
  args: {
    active: true,
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}
