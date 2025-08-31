import type { Meta, StoryObj } from '@storybook/react'
import { CanvasAnnotations } from './canvas-annotations'

const meta = {
  title: 'Features/Research Canvas/Canvas/CanvasAnnotations',
  component: CanvasAnnotations,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A canvas overlay component for displaying interactive annotations with pulsing indicators and content popups.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    annotations: {
      control: 'object',
      description: 'Array of annotation objects with id, x/y coordinates, and content',
    },
    onAnnotationClick: {
      action: 'annotation clicked',
      description: 'Callback function when an annotation is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof CanvasAnnotations>

export default meta
type Story = StoryObj<typeof meta>

const sampleAnnotations = [
  {
    id: '1',
    x: 25,
    y: 30,
    content: 'Evidence marker #1',
  },
  {
    id: '2',
    x: 75,
    y: 60,
    content: 'Witness location',
  },
  {
    id: '3',
    x: 50,
    y: 80,
    content: 'Point of interest',
  },
]

export const Default: Story = {
  args: {
    annotations: sampleAnnotations,
  },
  decorators: [
    Story => (
      <div className="relative w-[600px] h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Default canvas annotations with evidence markers and witness locations.',
      },
  },
},
}

export const SingleAnnotation: Story = {
  args: {
    annotations: [
      {
        id: '1',
        x: 50,
        y: 50,
        content: 'Central point of interest',
      },
    ],
  },
  decorators: [
    Story => (
      <div className="relative w-[400px] h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Canvas with a single centered annotation.',
      },
  },
},
}

export const ManyAnnotations: Story = {
  args: {
    annotations: [
      { id: '1', x: 15, y: 20, content: 'Entry point' },
      { id: '2', x: 35, y: 45, content: 'First evidence' },
      { id: '3', x: 65, y: 30, content: 'Witness A' },
      { id: '4', x: 80, y: 55, content: 'Witness B' },
      { id: '5', x: 45, y: 70, content: 'Exit route' },
      { id: '6', x: 25, y: 85, content: 'Additional clue' },
      { id: '7', x: 70, y: 85, content: 'Final location' },
      { id: '8', x: 90, y: 15, content: 'Vantage point' },
    ],
  },
  decorators: [
    Story => (
      <div className="relative w-[700px] h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Canvas with multiple annotations scattered across the area.',
      },
  },
},
}

export const DetailedAnnotations: Story = {
  args: {
    annotations: [
      {
        id: '1',
        x: 30,
        y: 25,
        content: (
          <div className="space-y-1">
          <div className="font-semibold"> Crime Scene #1 </div>
            <div className="text-xs text-gray-600"> Timestamp: 10: 30 PM</div>
      </div>
        ),
      },
{
  id: '2',
    x: 70,
      y: 65,
        content: (
          <div className="space-y-1">
          <div className="font-semibold"> Witness Location </div>
            <div className="text-xs text-gray-600"> John Doe - Primary witness </div>
              </div>
        ),
},
{
  id: '3',
    x: 50,
      y: 90,
        content: (
          <div className="space-y-1">
          <div className="font-semibold"> Evidence Found </div>
            <div className="text-xs text-gray-600"> Item #E-001: Footprint </div>
              </div>
        ),
},
    ],
  },
decorators: [
  Story => (
    <div className="relative w-[600px] h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg border">
    <Story />
    </div>
    ),
],
  parameters: {
  docs: {
    description: {
      story: 'Canvas annotations with detailed content including timestamps and descriptions.',
      },
  },
},
}

export const OnImageBackground: Story = {
  args: {
    annotations: [
      { id: '1', x: 20, y: 30, content: 'Entrance' },
      { id: '2', x: 60, y: 50, content: 'Main area' },
      { id: '3', x: 80, y: 75, content: 'Exit' },
    ],
  },
  decorators: [
    Story => (
      <div className="relative w-[600px] h-[400px] rounded-lg overflow-hidden border">
      <div 
          className="absolute inset-0 bg-cover bg-center"
          style = {{
      backgroundImage: 'url("https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop")'
    }}
  />
  <div className="absolute inset-0 bg-black bg-opacity-30" />
    <Story />
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Canvas annotations overlaid on an image background.',
      },
  },
},
}

export const InteractiveAnnotations: Story = {
  args: {
    annotations: sampleAnnotations,
    onAnnotationClick: ( id ) => {
      alert( `Clicked annotation: ${id}` )
    },
  },
  decorators: [
    Story => (
      <div className="relative w-[600px] h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Canvas annotations with click interaction - click any annotation to see the callback.',
      },
  },
},
}

export const EmptyCanvas: Story = {
  args: {
    annotations: [],
  },
  decorators: [
    Story => (
      <div className="relative w-[600px] h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
    No annotations to display
    </div>
    <Story />
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Empty canvas with no annotations.',
      },
  },
},
}

export const CornerAnnotations: Story = {
  args: {
    annotations: [
      { id: '1', x: 5, y: 5, content: 'Top Left' },
      { id: '2', x: 95, y: 5, content: 'Top Right' },
      { id: '3', x: 5, y: 95, content: 'Bottom Left' },
      { id: '4', x: 95, y: 95, content: 'Bottom Right' },
      { id: '5', x: 50, y: 50, content: 'Center' },
    ],
  },
  decorators: [
    Story => (
      <div className="relative w-[500px] h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Annotations positioned at the corners and center to test edge cases.',
      },
  },
},
}
