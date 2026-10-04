import type { Meta, StoryObj } from '@storybook/react'
import Globe from './Globe'
import { Canvas3D } from 'troika-3d'

// Wrapper component to provide necessary Canvas3D context
const GlobeWrapper = (props: any) => {
  return (
    <div>
      <Canvas3D
        antialias
        width={800}
        height={600}
        lights={[
          {
            type: 'ambient',
          },
          {
            type: 'directional',
            x: 0,
            y: 0,
            z: 1,
          },
        ]}
        objects={[
          {
            key: 'globe',
            facade: Globe,
            scale: 0.075,
            pointerEvents: true,
            animation: {
              from: { rotateY: -Math.PI },
              to: { rotateY: Math.PI },
              duration: 24000,
              iterations: Infinity,
            },
          },
        ]}
      />
    </div>
  )
}

const meta = {
  title: 'Features/3D/Globe Connections/Globe',
  component: GlobeWrapper,
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
} satisfies Meta<typeof GlobeWrapper>

export default meta
type Story = StoryObj<typeof meta>

// Basic globe with default rotation
export const Default: Story = {}

// Static globe without animation
export const Static: Story = {
  render: () => (
    <Canvas3D
      antialias
      width={800}
      height={600}
      lights={[
        {
          type: 'ambient',
        },
        {
          type: 'directional',
          x: 0,
          y: 0,
          z: 1,
        },
      ]}
      objects={[
        {
          key: 'globe',
          facade: Globe,
          scale: 0.075,
          pointerEvents: true,
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Globe without rotation animation.',
      },
    },
  },
}

// Globe with custom lighting
export const CustomLighting: Story = {
  render: () => (
    <Canvas3D
      antialias
      width={800}
      height={600}
      lights={[
        {
          type: 'ambient',
          intensity: 0.8,
        },
        {
          type: 'directional',
          x: 1,
          y: 1,
          z: 1,
          intensity: 0.5,
        },
        {
          type: 'point',
          x: -5,
          y: 2,
          z: -10,
          intensity: 0.3,
        },
      ]}
      objects={[
        {
          key: 'globe',
          facade: Globe,
          scale: 0.075,
          pointerEvents: true,
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Globe with enhanced lighting setup.',
      },
    },
  },
}

// Large scale view
export const LargeScale: Story = {
  render: () => (
    <Canvas3D
      antialias
      width={800}
      height={600}
      lights={[
        {
          type: 'ambient',
        },
        {
          type: 'directional',
          x: 0,
          y: 0,
          z: 1,
        },
      ]}
      objects={[
        {
          key: 'globe',
          facade: Globe,
          scale: 0.15, // Larger scale
          pointerEvents: true,
          animation: {
            from: { rotateY: -Math.PI },
            to: { rotateY: Math.PI },
            duration: 24000,
            iterations: Infinity,
          },
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Larger scale view of the globe.',
      },
    },
  },
}

// Interactive view with pointer events highlighted
export const Interactive: Story = {
  render: () => (
    <Canvas3D
      antialias
      width={800}
      height={600}
      lights={[
        {
          type: 'ambient',
        },
        {
          type: 'directional',
          x: 0,
          y: 0,
          z: 1,
        },
      ]}
      objects={[
        {
          key: 'globe',
          facade: Globe,
          scale: 0.075,
          pointerEvents: true,
          onPointerMove: () => console.log('Globe pointer move'),
          onPointerDown: () => console.log('Globe pointer down'),
          onPointerUp: () => console.log('Globe pointer up'),
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive globe with pointer events logging to console.',
      },
    },
  },
}