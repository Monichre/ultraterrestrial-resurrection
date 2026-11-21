import type {Meta, StoryObj} from '@storybook/react'
import {ViewLabels} from './view-labels'

const meta: Meta<typeof ViewLabels> = {
  title: 'Sci-Fi-HUD/ViewLabels',
  component: ViewLabels,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ViewLabels>

export const Default: Story = {
  args: {
    labels: ['DATA VIEW', 'ANALYSIS VIEW'],
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const WithSelectedIndex: Story = {
  args: {
    labels: ['DATA VIEW', 'ANALYSIS VIEW', 'COMPARISON VIEW'],
    selectedIndex: 1,
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}

export const CustomStyling: Story = {
  args: {
    labels: ['OPTION A', 'OPTION B'],
    selectedIndex: 0,
    className: 'gap-8',
  },
  decorators: [(Story: React.ComponentType) => <Story />],
}
