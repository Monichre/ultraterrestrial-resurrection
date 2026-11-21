import type {Meta, StoryObj} from '@storybook/react'
import {CustomEntityConnectionsFlow} from './EntityConnectionsFlow'
import type React from 'react'

const meta = {
  title: 'Components/ConnectionsUi/CustomEntity',
  component: CustomEntityConnectionsFlow,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CustomEntityConnectionsFlow>

export default meta
type Story = StoryObj<typeof meta>

// Basic story - the component handles its own scroll container
export const Default: Story = {
  args: {},
  parameters: {
    // This ensures the story viewport is large enough to enable scrolling
    layout: 'fullscreen',
  },
}

// A story with a proper scrollable container
export const WithScrollContainer: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          height: '100vh',
          overflow: 'auto',
          width: '100%',
          // Make sure it's absolutely positioned to get accurate scroll measurements
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <Story />
      </div>
    ),
  ],
}

// A more elaborate scrollable container with intro text
export const WithIntroduction: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <div style={{padding: '20px', background: 'rgba(0,0,0,0.2)'}}>
          <h2 style={{fontSize: '24px', marginBottom: '10px'}}>Interactive Connection Flow</h2>
          <p style={{marginBottom: '20px'}}>
            This component demonstrates an interactive connection flow with animated paths.
            <br />
            <strong>Instructions:</strong> Scroll down to see the connections animate, and use the
            buttons to interact with the flow.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}
