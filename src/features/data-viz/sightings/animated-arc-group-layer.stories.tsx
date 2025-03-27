import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import AnimatedArcGroupLayer, { useAnimatedArcGroupLayer } from './animated-arc-group-layer'
import DeckGL from 'deck.gl'
import { OrthographicView } from '@deck.gl/core'

// Wrapper component to properly render the DeckGL context for the arc group layer
const AnimatedArcGroupLayerDemo = ({ 
  id = 'animated-arc-group',
  data, 
  getSourceColor,
  getTargetColor,
  getWidth,
  getHeight,
  getTilt,
  visible = true,
  fadeIn = false,
  fadeSpeed = 0.05,
}) => {
  // Create initial view state for the visualization
  const initialViewState = {
    target: [0, 0, 0],
    zoom: 4,
  }

  // Create the arc group layer
  const arcGroupLayer = useAnimatedArcGroupLayer({
    id,
    data,
    getSourceColor,
    getTargetColor,
    getWidth,
    getHeight,
    getTilt,
    visible,
    fadeIn,
    fadeSpeed,
    onClickArc: info => {
      if (info.object) {
        console.log('Arc clicked:', info.object)
      }
    }
  })

  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={[arcGroupLayer]}
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

// Generate mock data for the arcs in a grid pattern
const generateGridArcData = (count = 5) => {
  const data = []
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      // Create a grid of points
      const sourceX = (i - count/2) * 50
      const sourceY = (j - count/2) * 50
      
      // Connect to adjacent points
      if (i < count - 1) {
        data.push({
          source: [sourceX, sourceY, 0],
          target: [sourceX + 50, sourceY, 0],
          value: 1 + Math.random() * 3,
          id: `arc-h-${i}-${j}`
        })
      }
      
      if (j < count - 1) {
        data.push({
          source: [sourceX, sourceY, 0],
          target: [sourceX, sourceY + 50, 0],
          value: 1 + Math.random() * 3,
          id: `arc-v-${i}-${j}`
        })
      }
    }
  }
  return data
}

// Generate mock data for arcs in a star pattern
const generateStarArcData = (count = 12, innerRadius = 20, outerRadius = 100) => {
  const center = [0, 0, 0]
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const outerPoint = [
      Math.cos(angle) * outerRadius,
      Math.sin(angle) * outerRadius,
      0
    ]
    const innerPoint = [
      Math.cos(angle) * innerRadius,
      Math.sin(angle) * innerRadius,
      0
    ]
    
    return {
      source: center,
      target: outerPoint,
      value: 2 + Math.random() * 2,
      id: `ray-${i}`,
      angle
    }
  })
}

// Generate mock data for arcs in a spiral pattern
const generateSpiralArcData = (turns = 3, pointsPerTurn = 20) => {
  const totalPoints = turns * pointsPerTurn
  const data = []
  
  for (let i = 1; i < totalPoints; i++) {
    const prevAngle = ((i - 1) / pointsPerTurn) * Math.PI * 2
    const prevRadius = ((i - 1) / totalPoints) * 100 + 10
    const prevPoint = [
      Math.cos(prevAngle) * prevRadius,
      Math.sin(prevAngle) * prevRadius,
      0
    ]
    
    const angle = (i / pointsPerTurn) * Math.PI * 2
    const radius = (i / totalPoints) * 100 + 10
    const point = [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ]
    
    data.push({
      source: prevPoint,
      target: point,
      value: 1 + Math.sin(i / 10) * 0.5 + 0.5,
      id: `spiral-${i}`
    })
  }
  
  return data
}

// Define the meta for the Storybook
const meta = {
  title: 'Features/Data Viz/Animated Arc Group Layer',
  component: AnimatedArcGroupLayerDemo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'A composite layer that manages a group of animated arcs, providing coordinated animations and effects.'
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Layer ID'
    },
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
    getHeight: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Height factor for the arcs'
    },
    getTilt: {
      control: { type: 'range', min: 0, max: 90, step: 5 },
      description: 'Tilt angle for the arcs in degrees'
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
} satisfies Meta<typeof AnimatedArcGroupLayerDemo>

export default meta
type Story = StoryObj<typeof meta>

// Grid pattern
export const GridPattern: Story = {
  args: {
    id: 'grid-arcs',
    data: generateGridArcData(6),
    getSourceColor: [64, 224, 208],
    getTargetColor: [255, 105, 180],
    getWidth: 2,
    getHeight: 1,
    getTilt: 0,
    visible: true,
    fadeIn: true,
    fadeSpeed: 0.05,
  },
}

// Star pattern
export const StarPattern: Story = {
  args: {
    id: 'star-arcs',
    data: generateStarArcData(24, 10, 120),
    getSourceColor: [255, 215, 0], // Gold
    getTargetColor: [220, 20, 60], // Crimson
    getWidth: 2.5,
    getHeight: 1,
    getTilt: 0,
    visible: true,
    fadeIn: true,
    fadeSpeed: 0.03,
  },
}

// Spiral pattern
export const SpiralPattern: Story = {
  args: {
    id: 'spiral-arcs',
    data: generateSpiralArcData(4, 24),
    getSourceColor: [0, 191, 255], // Deep sky blue
    getTargetColor: [138, 43, 226], // Blue violet
    getWidth: d => d.value * 1.5,
    getHeight: 1.2,
    getTilt: 0,
    visible: true,
    fadeIn: true,
    fadeSpeed: 0.08,
  },
}

// Tilted arcs
export const TiltedArcs: Story = {
  args: {
    id: 'tilted-arcs',
    data: generateStarArcData(16, 30, 110),
    getSourceColor: [50, 205, 50], // Lime green
    getTargetColor: [255, 69, 0], // Red-orange
    getWidth: 2,
    getHeight: 1.5,
    getTilt: 45, // 45-degree tilt
    visible: true,
    fadeIn: false,
  },
}

// Complex pattern with many arcs
export const ComplexPattern: Story = {
  args: {
    id: 'complex-arcs',
    data: [
      ...generateGridArcData(3),
      ...generateStarArcData(8, 60, 120),
      ...generateSpiralArcData(2, 10),
    ],
    getSourceColor: [70, 130, 180], // Steel blue
    getTargetColor: [218, 112, 214], // Orchid
    getWidth: d => 1 + (d.value || 1) * 0.5,
    getHeight: 1,
    getTilt: 20,
    visible: true,
    fadeIn: true,
    fadeSpeed: 0.05,
  },
}

// Function-based colors
export const DynamicColors: Story = {
  args: {
    id: 'dynamic-color-arcs',
    data: generateSpiralArcData(3, 30),
    getSourceColor: d => [
      128 + Math.sin(d.id.split('-')[1] * 0.2) * 127,
      128 + Math.cos(d.id.split('-')[1] * 0.2) * 127,
      255,
    ],
    getTargetColor: d => [
      255,
      128 + Math.sin(d.id.split('-')[1] * 0.2) * 127,
      128 + Math.cos(d.id.split('-')[1] * 0.2) * 127,
    ],
    getWidth: d => 1 + (d.value || 1),
    getHeight: 1,
    getTilt: 10,
    visible: true,
    fadeIn: true,
  },
}