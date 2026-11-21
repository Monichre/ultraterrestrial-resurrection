import type { Meta, StoryObj } from '@storybook/react'
import GlobeConnections from './GlobeConnectionsExample'

const meta = {
  title: 'Features/3D/Globe Connections/GlobeConnectionsExample',
  component: GlobeConnections,
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
} satisfies Meta<typeof GlobeConnections>

export default meta
type Story = StoryObj<typeof meta>

// Default view with standard dimensions
export const Default: Story = {
  args: {
    width: 800,
    height: 600,
    stats: false,
    vr: false,
  },
}

// Shows the globe with stats overlay
export const WithStats: Story = {
  args: {
    width: 800,
    height: 600,
    stats: true,
    vr: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the globe with performance statistics overlay.',
      },
    },
  },
}

// VR-enabled view
export const VRMode: Story = {
  args: {
    width: 800,
    height: 600,
    stats: false,
    vr: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the globe in VR mode with grabbable interactions.',
      },
    },
  },
}

// Fullscreen view (compute size at render-time to avoid SSR window access)
export const Fullscreen: Story = {
  render: (args) => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 800
    const h = typeof window !== 'undefined' ? window.innerHeight : 600
    return (
      <GlobeConnections {...args} width={w} height={h} />
    )
  },
  args: {
    stats: false,
    vr: false,
  },
  parameters: {
    docs: {
      description: { story: 'Displays the globe in fullscreen mode.' },
    },
  },
}

// Mobile view
export const MobileView: Story = {
  args: {
    width: 375,
    height: 667,
    stats: false,
    vr: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the globe appears on mobile devices.',
      },
    },
  },
}