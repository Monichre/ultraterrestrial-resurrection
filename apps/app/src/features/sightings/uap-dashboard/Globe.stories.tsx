import type { Meta, StoryObj } from '@storybook/react'
import Globe from './globe'
import { ValidatedUAPSighting } from '@/services/sightings/uap-sighting'

// Mock UAP sightings data for the globe
const mockSightings: ValidatedUAPSighting[] = [
  {
    id: 'sighting-001',
    source: 'twitter',
    content: 'Triangular craft hovering silently above the city',
    location: {
      city: 'New York',
      state: 'NY',
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    timestamp: new Date('2023-07-15T21:30:00Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/sighting1',
    confidence: 'high',
    type: 'sighting',
  },
  {
    id: 'sighting-002',
    source: 'news',
    title: 'Multiple witnesses report glowing orbs',
    content: 'Several residents observed a formation of glowing orbs over the lake',
    location: {
      city: 'Chicago',
      state: 'IL',
      coordinates: { lat: 41.8781, lng: -87.6298 },
    },
    timestamp: new Date('2023-06-20T23:15:00Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/sighting2',
    confidence: 'medium',
    type: 'sighting',
  },
  {
    id: 'sighting-003',
    source: 'rss',
    title: 'Fast-moving disc reported',
    content: 'A reflective disc-shaped object moved rapidly across the sky before disappearing',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      coordinates: { lat: 34.0522, lng: -118.2437 },
    },
    timestamp: new Date('2023-08-05T14:45:00Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/sighting3',
    confidence: 'medium',
    type: 'sighting',
    category: ['disc', 'high-speed'],
  },
  {
    id: 'sighting-004',
    source: 'rss',
    title: 'Cylindrical object hovering above power plant',
    content: 'Security camera footage shows cylindrical object hovering above nuclear facility',
    location: {
      city: 'Phoenix',
      state: 'AZ',
      coordinates: { lat: 33.4484, lng: -112.0740 },
    },
    timestamp: new Date('2023-05-12T02:30:00Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/sighting4',
    confidence: 'high',
    type: 'incident',
    category: ['cylinder', 'hovering', 'infrastructure'],
  },
  {
    id: 'sighting-005',
    source: 'twitter',
    content: 'Bright lights forming a triangle pattern, moved silently then accelerated rapidly',
    location: {
      city: 'Denver',
      state: 'CO',
      coordinates: { lat: 39.7392, lng: -104.9903 },
    },
    timestamp: new Date('2023-09-01T20:15:00Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/sighting5',
    confidence: 'medium',
    type: 'sighting',
    category: ['lights', 'triangle', 'high-speed'],
  },
]

const meta: Meta<typeof Globe> = {
  title: 'Features/UAP Dashboard/Globe',
  component: Globe,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full h-[800px] bg-black">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Globe>

export const Default: Story = {
  args: {
    sightings: mockSightings,
    focusedLocation: null,
    selectedYear: 2023,
  },
}

export const WithFocusedLocation: Story = {
  args: {
    sightings: mockSightings,
    focusedLocation: { lat: 40.7128, lon: -74.0060 }, // New York
    selectedYear: 2023,
  },
}

export const NoSightings: Story = {
  args: {
    sightings: [],
    focusedLocation: null,
    selectedYear: 2023,
  },
}

export const InvalidCoordinates: Story = {
  args: {
    sightings: [
      ...mockSightings,
      // Add sightings with invalid/missing coordinates
      {
        id: 'sighting-006',
        source: 'twitter',
        content: 'Strange lights in the sky',
        location: {
          city: 'Unknown',
          state: 'Unknown',
          // Missing coordinates
        },
        timestamp: new Date('2023-07-10T22:30:00Z'),
        mediaUrls: [],
        sourceUrl: 'https://example.com/sighting6',
        confidence: 'low',
        type: 'sighting',
      },
      {
        id: 'sighting-007',
        source: 'news',
        title: 'UFO sighting with invalid coordinates',
        content: 'Object reported with impossible location data',
        location: {
          city: 'Error',
          state: 'XX',
          coordinates: { lat: NaN, lng: NaN }, // Invalid coordinates
        },
        timestamp: new Date('2023-08-15T15:45:00Z'),
        mediaUrls: [],
        sourceUrl: 'https://example.com/sighting7',
        confidence: 'low',
        type: 'sighting',
      },
    ],
    focusedLocation: null,
    selectedYear: 2023,
  },
}

export const DifferentYears: Story = {
  args: {
    sightings: mockSightings,
    focusedLocation: null,
    selectedYear: 2022, // Different year than most of the mock data
  },
}

