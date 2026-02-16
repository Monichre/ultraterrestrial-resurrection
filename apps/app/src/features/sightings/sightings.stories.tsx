import type {Meta, StoryObj} from '@storybook/react'
import {SightingsClient} from './sightings'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {Suspense} from 'react'

// Mock sightings data
const mockSightings: ValidatedUAPSighting[] = [
  {
    id: 'sighting-1',
    source: 'news',
    title: 'Phoenix Lights',
    content: 'Massive V-shaped craft observed by thousands of witnesses over Phoenix, Arizona.',
    location: {
      city: 'Phoenix',
      state: 'Arizona',
      coordinates: {lat: 33.4484, lng: -112.074},
    },
    timestamp: new Date('1997-03-13T19:30:00.000Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/phoenix-lights',
    category: ['mass sighting', 'structured craft'],
    confidence: 'high',
    type: 'sighting',
  },
  {
    id: 'sighting-2',
    source: 'news',
    title: 'Tic Tac UFO',
    content: 'Navy pilots encounter unidentified aerial phenomenon during training exercises.',
    location: {
      city: 'San Diego',
      state: 'California',
      coordinates: {lat: 32.7157, lng: -117.1611},
    },
    timestamp: new Date('2004-11-14T14:00:00.000Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/tic-tac',
    category: ['military', 'video evidence'],
    confidence: 'high',
    type: 'incident',
  },
  {
    id: 'sighting-3',
    source: 'twitter',
    title: 'Triangle Craft Over Texas',
    content: 'Multiple witnesses report large triangular craft with lights at each corner.',
    location: {
      city: 'Houston',
      state: 'Texas',
      coordinates: {lat: 29.7604, lng: -95.3698},
    },
    timestamp: new Date('2023-08-15T22:45:00.000Z'),
    mediaUrls: [],
    sourceUrl: 'https://twitter.com/example',
    category: ['triangle', 'multiple witnesses'],
    confidence: 'medium',
    type: 'sighting',
  },
  {
    id: 'sighting-4',
    source: 'news',
    title: 'Roswell Incident',
    content: 'Debris recovered from unknown craft near Roswell, New Mexico.',
    location: {
      city: 'Roswell',
      state: 'New Mexico',
      coordinates: {lat: 33.3943, lng: -104.5230},
    },
    timestamp: new Date('1947-07-08T12:00:00.000Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/roswell',
    category: ['crash retrieval', 'historical'],
    confidence: 'high',
    type: 'incident',
  },
]

// Mock events data
const mockEvents = [
  {
    id: 'event-1',
    title: 'Congressional UAP Hearing',
    name: 'Congressional UAP Hearing 2023',
    description: 'Historic Congressional hearing on UAP with military witnesses.',
    location: 'Washington, D.C.',
    date: new Date('2023-07-26T10:00:00.000Z'),
    latitude: 38.9072,
    longitude: -77.0369,
    category: 'disclosure',
  },
  {
    id: 'event-2',
    title: 'Project Blue Book Closes',
    name: 'Project Blue Book Termination',
    description: 'US Air Force ends official investigation into UFOs.',
    location: 'Wright-Patterson AFB, Ohio',
    date: new Date('1969-12-17T00:00:00.000Z'),
    latitude: 39.8260,
    longitude: -84.0456,
    category: 'historic',
  },
]

// Mock stats
const mockStats = {
  totalSightings: mockSightings.length,
  byType: {
    sighting: 2,
    incident: 2,
  },
  byConfidence: {
    high: 3,
    medium: 1,
  },
  byYear: {
    '1947': 1,
    '1997': 1,
    '2004': 1,
    '2023': 1,
  },
  timeRange: {
    startYear: 1947,
    endYear: 2023,
  },
}

const meta = {
  title: 'Pages/Sightings/SightingsClient',
  component: SightingsClient,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#000000'}]},
    chromatic: {
      delay: 2000,
      pauseAnimationAtEnd: true,
    },
  },
  argTypes: {
    sightings: {
      description: 'Array of validated UAP sightings',
    },
    events: {
      description: 'Array of historical events',
    },
    stats: {
      description: 'Statistics object for the sightings data',
    },
    analysis: {
      description: 'Optional AI analysis result',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000000',
        }}>
        <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
          <Story />
        </Suspense>
      </div>
    ),
  ],
} satisfies Meta<typeof SightingsClient>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sightings: mockSightings,
    events: mockEvents,
    stats: mockStats,
  },
}

export const WithAnalysis: Story = {
  args: {
    sightings: mockSightings,
    events: mockEvents,
    stats: mockStats,
    analysis: {
      summary: 'Analysis indicates clustering of sightings near military installations.',
      patterns: ['Geographic clustering near bases', 'Increase in sightings post-2020'],
      recommendations: ['Monitor military exercise schedules', 'Cross-reference with aviation data'],
    },
  },
}

export const Empty: Story = {
  args: {
    sightings: [],
    events: [],
    stats: {
      totalSightings: 0,
      timeRange: {
        startYear: 1947,
        endYear: 2023,
      },
    },
  },
}

export const SightingsOnly: Story = {
  args: {
    sightings: mockSightings,
    events: [],
    stats: mockStats,
  },
}

export const EventsOnly: Story = {
  args: {
    sightings: [],
    events: mockEvents,
    stats: {
      totalSightings: 0,
      timeRange: {
        startYear: 1969,
        endYear: 2023,
      },
    },
  },
}
