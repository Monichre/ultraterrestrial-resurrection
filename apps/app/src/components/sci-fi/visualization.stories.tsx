import type {Meta, StoryObj} from '@storybook/react'
import {Visualization} from './visualization'

const meta: Meta<typeof Visualization> = {
  title: 'Sci-Fi-HUD/Visualization',
  component: Visualization,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Visualization>

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

export const WithDataPoints: Story = {
  args: {
    dataPoints: [
      {x: 10, y: 20, value: 50},
      {x: 30, y: 40, value: 80},
      {x: 50, y: 60, value: 30},
      {x: 70, y: 80, value: 90},
      {x: 90, y: 100, value: 40},
    ],
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}
