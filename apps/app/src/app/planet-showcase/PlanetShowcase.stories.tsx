import type { Meta, StoryObj } from '@storybook/react'
import PlanetShowcasePage from './page'
import { Suspense } from 'react'

const meta: Meta<typeof PlanetShowcasePage> = {
  title: 'Pages/Planet Showcase',
  component: PlanetShowcasePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Planet Showcase Landing Page

A beautiful landing page that presents both the Classic and Enhanced planet journey experiences with interactive cards and detailed feature comparisons.

## Features
- **Responsive grid layout** with animated cards
- **Feature comparison** between Classic and Enhanced versions
- **Interactive buttons** with hover effects and micro-animations
- **Technology showcase** highlighting the tech stack
- **Accessibility information** and usage instructions
- **Mobile-optimized** design with responsive breakpoints

## Design Elements
- Gradient backgrounds with space themes
- Animated technology badges
- Hover effects and scale transformations
- Typography with gradient text effects
- Modern glassmorphism card design

## Use Cases
- Portfolio showcase for 3D work
- Feature comparison landing page
- Technology demonstration
- User onboarding and selection
        `
      }
    },
    backgrounds: {
      default: 'cosmic',
      values: [
        { name: 'cosmic', value: 'linear-gradient(135deg, #000000 0%, #2D1B69 50%, #000000 100%)' },
        { name: 'space', value: '#000014' },
        { name: 'dark', value: '#000000' }
      ]
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Planet Showcase...</div>
      </div>
    }>
      <PlanetShowcasePage />
    </Suspense>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The complete planet showcase landing page with all features and animations.'
      }
    }
  }
}

export const Mobile: Story = {
  render: () => (
    <div className="w-full">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Mobile View...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile responsive version of the planet showcase with optimized layout for small screens.'
      }
    }
  }
}

export const Tablet: Story = {
  render: () => (
    <div className="w-full">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Tablet View...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view showing how the layout adapts to medium screen sizes.'
      }
    }
  }
}

export const DesktopLarge: Story = {
  render: () => (
    <div className="w-full">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Desktop View...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Large desktop view showcasing the full layout with all visual elements.'
      }
    }
  }
}

export const InteractiveDemo: Story = {
  render: () => (
    <div className="w-full relative">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Interactive Demo...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
      
      {/* Overlay instructions */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm border border-cyan-500/30 max-w-sm">
        <h4 className="font-bold mb-2 text-cyan-400">🎮 Interactive Elements</h4>
        <ul className="text-sm space-y-1">
          <li>• Hover over cards to see scale effects</li>
          <li>• Click buttons to navigate (disabled in Storybook)</li>
          <li>• Technology badges have hover animations</li>
          <li>• Try different viewport sizes above</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo highlighting the hover effects, animations, and responsive behavior.'
      }
    }
  }
}

export const ComponentBreakdown: Story = {
  render: () => (
    <div className="w-full relative">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Component Analysis...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
      
      {/* Component breakdown overlay */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm border border-purple-500/30 max-w-xs">
        <h4 className="font-bold mb-2 text-purple-400">🏗️ Components Used</h4>
        <ul className="text-sm space-y-1">
          <li>• Framer Motion animations</li>
          <li>• Responsive grid layout</li>
          <li>• Gradient text effects</li>
          <li>• Glassmorphism cards</li>
          <li>• Next.js Link components</li>
          <li>• Tailwind CSS utilities</li>
          <li>• Custom hover effects</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Technical breakdown showing the components and technologies used in the showcase page.'
      }
    }
  }
}

export const AccessibilityFocus: Story = {
  render: () => (
    <div className="w-full relative">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Accessibility View...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
      
      {/* Accessibility highlights */}
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm border border-green-500/30">
        <h4 className="font-bold mb-2 text-green-400 text-center">♿ Accessibility Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Keyboard Navigation:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Tab through all interactive elements</li>
              <li>• Enter/Space to activate buttons</li>
              <li>• Focus indicators visible</li>
            </ul>
          </div>
          <div>
            <strong>Visual Design:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• High contrast text ratios</li>
              <li>• Readable font sizes</li>
              <li>• Clear visual hierarchy</li>
            </ul>
          </div>
          <div>
            <strong>Screen Readers:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Semantic HTML structure</li>
              <li>• Descriptive alt text</li>
              <li>• Proper heading levels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility focused view highlighting keyboard navigation, screen reader support, and visual accessibility features.'
      }
    }
  }
}

export const PerformanceMetrics: Story = {
  render: () => (
    <div className="w-full relative">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Performance Analysis...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
      
      {/* Performance metrics overlay */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm border border-yellow-500/30 max-w-sm">
        <h4 className="font-bold mb-2 text-yellow-400">⚡ Performance Metrics</h4>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Bundle Size:</span>
            <span className="text-green-400">~45KB</span>
          </div>
          <div className="flex justify-between">
            <span>First Paint:</span>
            <span className="text-green-400">~150ms</span>
          </div>
          <div className="flex justify-between">
            <span>Interactive:</span>
            <span className="text-green-400">~300ms</span>
          </div>
          <div className="flex justify-between">
            <span>Lighthouse:</span>
            <span className="text-green-400">95+</span>
          </div>
          <div className="mt-3 text-xs text-gray-300">
            * Metrics are estimated for this static showcase page
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Performance analysis showing bundle size, loading times, and optimization metrics.'
      }
    }
  }
}

export const DarkMode: Story = {
  render: () => (
    <div className="w-full">
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading Dark Mode...</div>
        </div>
      }>
        <PlanetShowcasePage />
      </Suspense>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }]
    },
    docs: {
      description: {
        story: 'Dark mode version (default) with cosmic gradient backgrounds and space themes.'
      }
    }
  }
}

export const PrintFriendly: Story = {
  render: () => (
    <div className="w-full bg-white text-black">
      {/* Print-friendly version would need custom styling */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-black">
            Cosmic Journey - 3D Planet Animations
          </h1>
          <p className="text-lg text-gray-800 max-w-4xl mx-auto">
            Experience incredible 3D planet animations featuring Earth zoom-ins, 
            spectacular Moon entrances, and seamless GSAP parallax scrolling.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Classic Journey</h2>
            <p className="text-gray-700 mb-4">
              Beautiful 3D space experience with smooth camera movements and elegant animations.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Smooth camera zoom into Earth</li>
              <li>Realistic 3D planetary models</li>
              <li>Moon entrance animation</li>
              <li>GSAP parallax text effects</li>
            </ul>
          </div>
          
          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Enhanced Odyssey</h2>
            <p className="text-gray-700 mb-4">
              Cinematic experience with advanced visual effects and spectacular post-processing.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Advanced atmospheric shaders</li>
              <li>Particle systems & space dust</li>
              <li>Post-processing bloom effects</li>
              <li>Trail effects and enhanced lighting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }]
    },
    docs: {
      description: {
        story: 'Print-friendly version with simplified styling and high contrast for documentation purposes.'
      }
    }
  }
}
