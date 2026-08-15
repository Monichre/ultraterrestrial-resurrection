import type {Meta, StoryObj} from '@storybook/react'
import {WorldMap} from './world-map'
import {ICON_BLUE} from '@/utils/constants/colors'

type Story = StoryObj<typeof WorldMap>

// Marker point format expected by WorldMap (points will be chained in order)
interface MarkerPoint {
  lat: number
  lng: number
  label?: string
  location: [number, number]
}

const meta: Meta<typeof WorldMap> = {
  title: 'Layouts/Historical Events Timeline/WorldMap',
  component: WorldMap,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  argTypes: {
    markers: {
      control: 'object',
      description: 'Array of marker POINTS (each {lat,lng,location:[lat,lng],label?}) chained in order',
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

// Default story with a simple two-point path
export const Default: Story = {
  args: {
    markers: [
      { lat: 40.7128, lng: -74.006, label: 'New York', location: [40.7128, -74.006] } as MarkerPoint,
      { lat: 34.0522, lng: -118.2437, label: 'Los Angeles', location: [34.0522, -118.2437] } as MarkerPoint,
    ],
    lineColor: ICON_BLUE,
  },
  parameters: {
    docs: { description: { story: 'Basic world map with a path from New York to Los Angeles.' } },
  },
}

// Story with multiple chained connections (NYC → London → Tokyo → Sydney → NYC)
export const MultipleLocations: Story = {
  args: {
    markers: [
      { lat: 40.7128, lng: -74.006, label: 'New York', location: [40.7128, -74.006] } as MarkerPoint,
      { lat: 51.5074, lng: -0.1278, label: 'London', location: [51.5074, -0.1278] } as MarkerPoint,
      { lat: 35.6762, lng: 139.6503, label: 'Tokyo', location: [35.6762, 139.6503] } as MarkerPoint,
      { lat: -33.8688, lng: 151.2093, label: 'Sydney', location: [-33.8688, 151.2093] } as MarkerPoint,
      { lat: 40.7128, lng: -74.006, label: 'New York', location: [40.7128, -74.006] } as MarkerPoint,
    ],
    lineColor: ICON_BLUE,
  },
  parameters: {
    docs: { description: { story: 'World map showing multiple chained connections across major cities.' } },
  },
}

// Story with custom line color
export const CustomColor: Story = {
  args: {
    markers: [
      { lat: 40.7128, lng: -74.006, label: 'New York', location: [40.7128, -74.006] } as MarkerPoint,
      { lat: 34.0522, lng: -118.2437, label: 'Los Angeles', location: [34.0522, -118.2437] } as MarkerPoint,
    ],
    lineColor: '#FF5733',
  },
  parameters: {
    docs: { description: { story: 'World map with custom line color for the connections.' } },
  },
}
