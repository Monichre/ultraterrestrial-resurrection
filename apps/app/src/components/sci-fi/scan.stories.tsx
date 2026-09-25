import type {Meta, StoryObj} from '@storybook/react'
import {Scan} from './scan'

const meta: Meta<typeof Scan> = {
  title: 'Sci-Fi-HUD/Scan',
  component: Scan,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Scan>

export const Default: Story = {
  args: {},
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const WithCustomSize: Story = {
  args: {
    className: 'w-[400px] h-[400px]',
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const Scanning: Story = {
  args: {
    isScanning: true,
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}
