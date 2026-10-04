import type { Meta, StoryObj } from '@storybook/react'
import { AgentNotificationsLog } from './agent-notifications-log'

const meta = {
  title: 'Features/Mindmap/Status UI/AgentNotificationsLog',
  component: AgentNotificationsLog,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black/90 relative">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentNotificationsLog>

export default meta
type Story = StoryObj<typeof meta>

// Default state showing the collapsed tab
export const Default: Story = {}

// Shows the expanded state with notifications
export const Expanded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the notifications panel in its expanded state with animated messages.',
      },
    },
  },
  render: () => {
    return (
      <div className="min-h-screen bg-black/90 relative">
        <div className="fixed right-0 top-[40%] -translate-y-1/2 z-30" style={{ width: '32rem' }}>
          <div className="w-full h-full bg-black/30 backdrop-blur-sm border border-[#adf0dd]/30 rounded-l-md overflow-hidden shadow-[0_0_15px_rgba(173,240,221,0.15)]">
            <AgentNotificationsLog />
          </div>
        </div>
      </div>
    )
  },
}

// Shows the component with multiple notifications
export const WithNotifications: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the component with a list of agent notifications.',
      },
    },
  },
}

// Shows the component in a layout context with other UI elements
export const InLayout: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black/90 flex">
        <div className="flex-1 relative">
          <div className="p-8">
            <h1 className="text-white text-2xl mb-4">Agent Interface</h1>
            <p className="text-gray-400">Main workspace area with agent interactions...</p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows how the notifications log integrates with other interface elements.',
      },
    },
  },
}

// Shows hover and interaction states
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates hover effects and click interactions with the notification panel.',
      },
    },
  },
}