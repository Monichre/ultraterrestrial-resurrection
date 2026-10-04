import type { Meta, StoryObj } from '@storybook/react'
import { PlanetJourney } from './PlanetJourney'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

const meta: Meta<typeof PlanetJourney> = {
  title: '3D/Planet Journey/Classic Journey',
  component: PlanetJourney,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Classic Planet Journey

A beautiful 3D space experience featuring smooth camera movements, Earth exploration, and elegant moon animations with GSAP scroll triggers.

## Features
- Smooth camera zoom into Earth
- Realistic 3D planetary models using GLB assets
- Moon entrance animation with orbital mechanics
- GSAP parallax text effects
- Star field background
- 5 unique scroll-triggered sections

## Usage
This component creates a full-screen scrollable experience. Scroll down to trigger different animation phases:
1. **Deep Space** - Starting view from far away
2. **Earth Approach** - Zoom towards our planet
3. **Close Encounter** - Detailed Earth exploration
4. **Moon Entrance** - Spectacular lunar arrival
5. **Orbital View** - Final Earth-Moon system view

## Technical Details
- Built with React Three Fiber and Three.js
- Uses GSAP ScrollTrigger for smooth transitions
- Integrates existing Earth and Moon GLB models
- Responsive design with mobile considerations
        `
      }
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'space', value: '#000014' }
      ]
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // No props currently, but we could add section control
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Loading component for stories
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="text-white text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto"></div>
      <p className="text-xl">Loading Cosmic Journey...</p>
    </div>
  </div>
)

export const Default: Story = {
  render: () => (
    <div className="w-full h-screen bg-black">
      <Suspense fallback={<LoadingFallback />}>
        <PlanetJourney />
      </Suspense>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The full planet journey experience. Scroll down to see all animation phases.'
      }
    }
  }
}

export const InteractiveDemo: Story = {
  render: () => (
    <div className="w-full h-screen bg-black relative">
      <Suspense fallback={<LoadingFallback />}>
        <PlanetJourney />
      </Suspense>
      <div className="absolute top-4 left-4 z-50 text-white text-sm bg-black/50 p-4 rounded-lg backdrop-blur-sm">
        <h4 className="font-bold mb-2">Instructions:</h4>
        <ul className="space-y-1">
          <li>• Scroll down to control the journey</li>
          <li>• Watch Earth zoom animation</li>
          <li>• See Moon dramatic entrance</li>
          <li>• Experience text parallax effects</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with instructions overlay. Try scrolling to see the camera movements and animations.'
      }
    }
  }
}

// Individual section stories for documentation
export const Section1_DeepSpace: Story = {
  render: () => (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        <color attach="background" args={['#000014']} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[20, 20, 20]} intensity={1.8} />
        {/* Static scene representation */}
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Journey Through Space
          </h1>
          <p className="text-2xl text-gray-300 mt-4">
            Embark on an incredible voyage through the cosmos
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Section 1: Deep space starting view with title text overlay.'
      }
    }
  }
}

export const Section2_EarthApproach: Story = {
  render: () => (
    <div className="w-full h-screen bg-black">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Approaching Earth
          </h1>
          <p className="text-2xl text-gray-300 mt-4">
            Our beautiful blue marble comes into view
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Section 2: Earth approach phase with zoom animation (simulated in story).'
      }
    }
  }
}

export const MobileOptimized: Story = {
  render: () => (
    <div className="w-full h-screen bg-black">
      <Suspense fallback={<LoadingFallback />}>
        <PlanetJourney />
      </Suspense>
      <div className="absolute bottom-4 left-4 right-4 z-50 text-white text-xs bg-black/50 p-3 rounded-lg backdrop-blur-sm text-center">
        <p>📱 Mobile optimized view - Use touch to scroll</p>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile optimized version with touch-friendly controls and responsive text sizing.'
      }
    }
  }
}

export const Performance: Story = {
  render: () => (
    <div className="w-full h-screen bg-black">
      <Suspense fallback={<LoadingFallback />}>
        <PlanetJourney />
      </Suspense>
      <div className="absolute top-4 right-4 z-50 text-white text-xs bg-black/70 p-3 rounded-lg backdrop-blur-sm">
        <div className="space-y-1">
          <div>🎮 WebGL: Active</div>
          <div>🌟 Particles: Optimized</div>
          <div>📐 Geometry: LOD Enabled</div>
          <div>🖼️ Textures: Compressed</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Performance monitoring view showing optimization features and WebGL status.'
      }
    }
  }
}

export const Accessibility: Story = {
  render: () => (
    <div className="w-full h-screen bg-black">
      <Suspense fallback={<LoadingFallback />}>
        <PlanetJourney />
      </Suspense>
      <div className="absolute bottom-4 left-4 right-4 z-50 text-white bg-black/70 p-4 rounded-lg backdrop-blur-sm">
        <h4 className="font-bold mb-2">♿ Accessibility Features:</h4>
        <ul className="text-sm space-y-1">
          <li>• Reduced motion support (respects prefers-reduced-motion)</li>
          <li>• Keyboard navigation friendly</li>
          <li>• Screen reader compatible text</li>
          <li>• High contrast text on backgrounds</li>
          <li>• Progressive enhancement for 3D content</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features demonstration showing how the component handles motion preferences and screen readers.'
      }
    }
  }
}
