import type { Meta, StoryObj } from '@storybook/react'
import { OracleSphere } from './oracle-sphere'

const meta = {
  title: 'Features/Mindmap/Components/OracleSphere',
  component: OracleSphere,
  parameters: {
    layout: 'centered',
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
} satisfies Meta<typeof OracleSphere>

export default meta
type Story = StoryObj<typeof meta>

// Default view with standard dimensions
export const Default: Story = {
  args: {
    size: 1.5,
    color: '#1E88E5',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

// Shows the sphere with particle system
export const ParticleSystem: Story = {
  args: {
    size: 1.5,
    color: '#1E88E5',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Oracle sphere using particle system visualization.',
      },
    },
  },
}

// Shows the sphere with custom color
export const CustomColor: Story = {
  args: {
    size: 1.5,
    color: '#FF4081',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Oracle sphere with custom color configuration.',
      },
    },
  },
}

// Shows the sphere at a larger scale
export const LargeScale: Story = {
  args: {
    size: 2.5,
    color: '#1E88E5',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Oracle sphere at a larger scale.',
      },
    },
  },
}

// Shows the sphere in a layout context
export const InLayout: Story = {
  args: {
    size: 1.5,
    color: '#1E88E5',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black/90 flex items-center justify-center">
        <div className="w-[400px] h-[400px]">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Oracle sphere integrated into a layout.',
      },
    },
  },
}

// Shows mobile responsive view
export const MobileView: Story = {
  args: {
    size: 1.2,
    color: '#1E88E5',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Oracle sphere optimized for mobile devices.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
}