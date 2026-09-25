import type { Meta, StoryObj } from '@storybook/react'
import { CommandSearchMenu } from './command-search-menu'

const meta = {
  title: 'Components/Command/CommandSearchMenu',
  component: CommandSearchMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A command search menu dialog with input, loading states, and grouped results for fruits and other items.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Component doesn't have props in the current implementation
  },
} satisfies Meta<typeof CommandSearchMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default command search menu showing grouped items like fruits.',
      },
    },
  },
}

export const WithLoading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Command search menu in loading state.',
      },
    },
  },
  // Note: The component has hardcoded loading and open state variables
  // In a real implementation, these would be props
}

export const EmptyState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Command search menu when no results are found.',
      },
    },
  },
}

export const Fullscreen: Story = {
  args: {},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Command search menu displayed in fullscreen to show dialog behavior.',
      },
    },
  },
}
