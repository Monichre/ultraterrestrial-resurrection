import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { AnimatedArcLayer } from './animated-arc-layer'
import DeckGL from 'deck.gl'
import { OrthographicView } from '@deck.gl/core'

// Wrapper component to properly render the DeckGL context for the arc layer
const AnimatedArcLayerDemo = ({ 
  data, 
  getSourceColor,
  getTargetColor,
  getWidth,
  visible = true,
  fadeIn = false,
  fadeSpeed = 0.05,
}) => {
  // Create initial view state for the visualization
  const initialViewState = {
    target: [0, 0, 0],
    zoom: 4,
  }

  // Combine the arc layer with other necessary layers
  const layers = [
    AnimatedArcLayer({
      id: 'animated-arc-layer',
      data,
      getSourceColor,
      getTargetColor,
      getWidth,
      visible,
      fadeIn,
      fadeSpeed,
      onClickArc: info => {
        if (info.object) {
          console.log('Arc clicked:', info.object)
        }
      }
    })
  ]

  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        views={new OrthographicView({ 
          flipY: false 
        })}
      >
        {/* Dark background to see arcs clearly */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: '#0a0a20',
            zIndex: -1
          }} 
        />
      </DeckGL>
    </div>
  )
}

// Generate mock data for the arcs
const generateMockArcData = (count = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    source: [Math.cos(i / count * Math.PI * 2) * 100, Math.sin(i / count * Math.PI * 2) * 100, 0],
    target: [Math.cos((i + count / 2) / count * Math.PI * 2) * 100, Math.sin((i + count / 2) / count * Math.PI * 2) * 100, 0],
    sourceName: `Source ${i}`,
    targetName: `Target ${i}`,
    value: Math.random() * 10,
    id: `arc-${i}`
  }))
}

const mockData = generateMockArcData()

// Define the meta for the Storybook
const meta = {
  title: 'Features/Data Viz/Animated Arc Layer',
  component: AnimatedArcLayerDemo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'An animated arc layer that can be used to visualize connections between points with animation effects.'
      },
    },
  },
  argTypes: {
    data: { 
      control: 'object',
      description: 'Array of objects with source and target coordinates'
    },
    getSourceColor: {
      control: 'array',
      description: 'RGB color for the source of arcs'
    },
    getTargetColor: {
      control: 'array',
      description: 'RGB color for the target of arcs'
    },
    getWidth: {
      control: { type: 'range', min: 1, max: 10, step: 0.5 },
      description: 'Width of the arcs'
    },
    visible: {
      control: 'boolean',
      description: 'Whether the layer is visible'
    },
    fadeIn: {
      control: 'boolean',
      description: 'Whether to fade in the arcs'
    },
    fadeSpeed: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 },
      description: 'Speed of the fade-in effect'
    },
  },
} satisfies Meta<typeof AnimatedArcLayerDemo>

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    data: mockData,
    getSourceColor: [0, 128, 255],
    getTargetColor: [255, 0, 128],
    getWidth: 3,
    visible: true,
    fadeIn: false,
  },
}

// Fade-in effect
export const FadeIn: Story = {
  args: {
    data: mockData,
    getSourceColor: [0, 255, 128],
    getTargetColor: [128, 0, 255],
    getWidth: 3,
    visible: true,
    fadeIn: true,
    fadeSpeed: 0.05,
  },
}

// Different colors
export const CustomColors: Story = {
  args: {
    data: mockData,
    getSourceColor: [255, 215, 0], // Gold
    getTargetColor: [0, 191, 255], // Deep sky blue
    getWidth: 3,
    visible: true,
  },
}

// Function-based widths based on data value
export const VariableWidth: Story = {
  args: {
    data: mockData,
    getSourceColor: [64, 224, 208],
    getTargetColor: [255, 105, 180],
    getWidth: d => d.value,
    visible: true,
  },
}

// Circular pattern
export const CircularPattern: Story = {
  args: {
    data: Array.from({ length: 40 }, (_, i) => ({
      source: [Math.cos(i / 40 * Math.PI * 2) * 100, Math.sin(i / 40 * Math.PI * 2) * 100, 0],
      target: [
        Math.cos((i / 40 * Math.PI * 2) + Math.PI / 10) * 80, 
        Math.sin((i / 40 * Math.PI * 2) + Math.PI / 10) * 80, 
        0
      ],
      sourceName: `Point ${i}`,
      targetName: `Point ${i+1}`,
      value: 2 + Math.sin(i / 40 * Math.PI * 4) * 1.5,
      id: `arc-${i}`
    })),
    getSourceColor: [120, 120, 255],
    getTargetColor: [255, 120, 120],
    getWidth: d => d.value,
    visible: true,
    fadeIn: true,
  },
}

// A story showing how to use the layer for geographic data
export const GeographicDemo: Story = {
  args: {
    data: [
      {
        // New York to Los Angeles
        source: [-74.006, 40.7128, 0],
        target: [-118.2437, 34.0522, 0],
        sourceName: 'New York',
        targetName: 'Los Angeles',
        value: 5,
        id: 'nyc-la'
      },
      {
        // London to Tokyo
        source: [-0.1278, 51.5074, 0],
        target: [139.6503, 35.6762, 0],
        sourceName: 'London',
        targetName: 'Tokyo',
        value: 7,
        id: 'london-tokyo'
      },
      {
        // Sydney to Rio
        source: [151.2093, -33.8688, 0],
        target: [-43.1729, -22.9068, 0],
        sourceName: 'Sydney',
        targetName: 'Rio de Janeiro',
        value: 6,
        id: 'sydney-rio'
      },
      {
        // Cape Town to Moscow
        source: [18.4241, -33.9249, 0],
        target: [37.6173, 55.7558, 0],
        sourceName: 'Cape Town',
        targetName: 'Moscow',
        value: 4,
        id: 'cape-moscow'
      },
      {
        // Beijing to Berlin
        source: [116.4074, 39.9042, 0],
        target: [13.4050, 52.5200, 0],
        sourceName: 'Beijing',
        targetName: 'Berlin',
        value: 5.5,
        id: 'beijing-berlin'
      }
    ],
    getSourceColor: [0, 255, 0],
    getTargetColor: [255, 0, 0],
    getWidth: d => d.value,
    visible: true,
    fadeIn: true,
  },
}