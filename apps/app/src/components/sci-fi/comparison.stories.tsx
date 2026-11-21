import type {Meta, StoryObj} from '@storybook/react'
import {Comparison} from './comparison'

const meta: Meta<typeof Comparison> = {
  title: 'Sci-Fi-HUD/Comparison',
  component: Comparison,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Comparison>

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
