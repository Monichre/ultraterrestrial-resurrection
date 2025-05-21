import type {Meta, StoryObj} from '@storybook/react'
import {WorldMap} from './world-map'
import {ICON_BLUE} from '@/utils/constants/colors'

type Story = StoryObj<typeof WorldMap>

// Extended interface to match both the TypeScript interface and actual implementation
interface MarkerLocation {
  lat: number
  lng: number
  label?: string
  location: [number, number] // Array for actual component implementation
}

interface ExtendedMarker {
  start: MarkerLocation
  end: MarkerLocation
}

const meta: Meta<typeof WorldMap> = {
  title: 'Layouts/Historical Events Timeline/WorldMap',
  component: WorldMap,
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
  argTypes: {
    markers: {
      control: 'object',
      description: 'Array of marker locations with start and end points',
    },
    lineColor: {
      control: 'color',
      description: 'Color of the connection lines',
    },
    activeLocation: {
      control: 'object',
      description: 'Currently active location',
    },
  },
  decorators: [
    (Story) => (
      <div style={{width: '100%', height: '600px', background: '#000', padding: '20px'}}>
        <Story />
      </div>
    ),
  ],
}

export default meta

// Default story with a single connection
export const Default: Story = {
  args: {
    markers: [
      {
        start: {
          lat: 40.7128,
          lng: -74.006,
          label: 'New York',
          location: [40.7128, -74.006],
        } as MarkerLocation,
        end: {
          lat: 34.0522,
          lng: -118.2437,
          label: 'Los Angeles',
          location: [34.0522, -118.2437],
        } as MarkerLocation,
      } as ExtendedMarker,
    ],
    lineColor: ICON_BLUE,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic world map with a single connection from New York to Los Angeles.',
      },
    },
  },
}

// Story with multiple connections
export const MultipleLocations: Story = {
  args: {
    markers: [
      {
        start: {
          lat: 40.7128,
          lng: -74.006,
          label: 'New York',
          location: [40.7128, -74.006],
        } as MarkerLocation,
        end: {
          lat: 51.5074,
          lng: -0.1278,
          label: 'London',
          location: [51.5074, -0.1278],
        } as MarkerLocation,
      } as ExtendedMarker,
      {
        start: {
          lat: 51.5074,
          lng: -0.1278,
          label: 'London',
          location: [51.5074, -0.1278],
        } as MarkerLocation,
        end: {
          lat: 35.6762,
          lng: 139.6503,
          label: 'Tokyo',
          location: [35.6762, 139.6503],
        } as MarkerLocation,
      } as ExtendedMarker,
      {
        start: {
          lat: 35.6762,
          lng: 139.6503,
          label: 'Tokyo',
          location: [35.6762, 139.6503],
        } as MarkerLocation,
        end: {
          lat: -33.8688,
          lng: 151.2093,
          label: 'Sydney',
          location: [-33.8688, 151.2093],
        } as MarkerLocation,
      } as ExtendedMarker,
      {
        start: {
          lat: -33.8688,
          lng: 151.2093,
          label: 'Sydney',
          location: [-33.8688, 151.2093],
        } as MarkerLocation,
        end: {
          lat: 40.7128,
          lng: -74.006,
          label: 'New York',
          location: [40.7128, -74.006],
        } as MarkerLocation,
      } as ExtendedMarker,
    ],
    lineColor: ICON_BLUE,
  },
  parameters: {
    docs: {
      description: {
        story: 'World map showing multiple connections between major cities around the world.',
      },
    },
  },
}

// Story with custom line color
export const CustomColor: Story = {
  args: {
    markers: [
      {
        start: {
          lat: 40.7128,
          lng: -74.006,
          label: 'New York',
          location: [40.7128, -74.006],
        } as MarkerLocation,
        end: {
          lat: 34.0522,
          lng: -118.2437,
          label: 'Los Angeles',
          location: [34.0522, -118.2437],
        } as MarkerLocation,
      } as ExtendedMarker,
    ],
    lineColor: '#FF5733', // Custom orange color
  },
  parameters: {
    docs: {
      description: {
        story: 'World map with custom line color for the connections.',
      },
    },
  },
}
