import type {Meta, StoryObj} from '@storybook/react'
import {ConnectionsFlowDemo} from './ConnectionsFlow'
import type React from 'react'

const meta = {
  title: 'Components/ConnectionsUi/FlowDemo',
  component: ConnectionsFlowDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  args: {
    title: 'Interactive Connection Flow',
    description: 'Scroll down to see the animation',
  },
} satisfies Meta<typeof ConnectionsFlowDemo>

export default meta
type Story = StoryObj<typeof meta>

// Basic story where the component handles its own scroll container and height
export const Default: Story = {
  args: {
    title: 'Interactive Connection Flow',
    description: 'Scroll down to see connections animate',
  },
}

// Story with a viewport-height scroll container
export const WithScrollContainer: Story = {
  args: {
    title: 'Scroll Animation Demo',
    description: 'Scroll down to see the workflow animate',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'auto',
          position: 'relative',
          background: '#0f0f0f',
        }}>
        <Story />
      </div>
    ),
  ],
}

// A more elaborate scrollable container with intro text
export const WithIntroduction: Story = {
  args: {
    title: 'Advanced Flow Animation',
    description: 'Scroll to see connections build progressively',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'auto',
          position: 'relative',
          background: '#0f0f0f',
        }}>
        <Story />
      </div>
    ),
  ],
}
