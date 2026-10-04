import type {Meta, StoryObj} from '@storybook/react'
import {HudUapInterface} from './HudUapInterface'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {Suspense} from 'react'

// Mock sightings data
const mockSightings: ValidatedUAPSighting[] = [
  {
    id: 'sighting-phoenix',
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
    id: 'sighting-nimitz',
    source: 'news',
    title: 'Tic Tac UFO - USS Nimitz',
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
    id: 'sighting-triangle-tx',
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
    id: 'sighting-roswell',
    source: 'news',
    title: 'Roswell Incident',
    content: 'Debris recovered from unknown craft near Roswell, New Mexico.',
    location: {
      city: 'Roswell',
      state: 'New Mexico',
      coordinates: {lat: 33.3943, lng: -104.523},
    },
    timestamp: new Date('1947-07-08T12:00:00.000Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/roswell',
    category: ['crash retrieval', 'historical'],
    confidence: 'high',
    type: 'incident',
  },
  {
    id: 'sighting-rendlesham',
    source: 'news',
    title: 'Rendlesham Forest Incident',
    content: 'USAF personnel reported unusual lights and a possible landing near RAF Woodbridge.',
    location: {
      city: 'Rendlesham',
      state: 'Suffolk',
      coordinates: {lat: 52.0838, lng: 1.4333},
    },
    timestamp: new Date('1980-12-26T03:00:00.000Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/rendlesham',
    category: ['military', 'landing trace'],
    confidence: 'high',
    type: 'incident',
  },
  {
    id: 'sighting-chicago-ohare',
    source: 'news',
    title: "O'Hare Airport UFO",
    content:
      "Metallic disc-shaped object hovering over O'Hare Airport gate C17, witnessed by pilots and ground crew.",
    location: {
      city: 'Chicago',
      state: 'Illinois',
      coordinates: {lat: 41.9742, lng: -87.9073},
    },
    timestamp: new Date('2006-11-07T16:15:00.000Z'),
    mediaUrls: [],
    sourceUrl: 'https://example.com/ohare',
    category: ['airport', 'multiple witnesses', 'disc'],
    confidence: 'high',
    type: 'sighting',
  },
]

// Mock events data
const mockEvents = [
  {
    id: 'event-congressional-2023',
    title: 'Congressional UAP Hearing 2023',
    name: 'Congressional UAP Hearing',
    description:
      'Historic Congressional hearing on UAP featuring testimony from David Grusch, Ryan Graves, and David Fravor.',
    location: 'Washington, D.C.',
    date: new Date('2023-07-26T10:00:00.000Z'),
    latitude: 38.9072,
    longitude: -77.0369,
    category: 'disclosure',
  },
  {
    id: 'event-bluebook',
    title: 'Project Blue Book Ends',
    name: 'Project Blue Book Termination',
    description: 'US Air Force ends official investigation into UFOs.',
    location: 'Wright-Patterson AFB, Ohio',
    date: new Date('1969-12-17T00:00:00.000Z'),
    latitude: 39.826,
    longitude: -84.0456,
    category: 'historic',
  },
  {
    id: 'event-aatip',
    title: 'AATIP Revealed',
    name: 'NYT Reveals Pentagon UFO Program',
    description:
      "New York Times publishes story revealing the Pentagon's secret Advanced Aerospace Threat Identification Program.",
    location: 'New York, NY',
    date: new Date('2017-12-16T00:00:00.000Z'),
    latitude: 40.7128,
    longitude: -74.006,
    category: 'disclosure',
  },
]

const meta = {
  title: 'Pages/Sightings/HudUapInterface',
  component: HudUapInterface,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#000000'}]},
    chromatic: {
      delay: 2000,
      pauseAnimationAtEnd: true,
    },
  },
  argTypes: {
    initialSightings: {
      description: 'Array of validated UAP sightings to display on the globe',
    },
    events: {
      description: 'Array of historical events',
    },
    analysisResults: {
      description: 'Optional AI analysis results',
    },
    initialLocations: {
      description: 'Pre-calculated top locations',
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
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-white">
              Loading HUD Interface...
            </div>
          }>
          <Story />
        </Suspense>
      </div>
    ),
  ],
} satisfies Meta<typeof HudUapInterface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    initialSightings: mockSightings,
    events: mockEvents,
  },
}

export const SightingsOnly: Story = {
  args: {
    initialSightings: mockSightings,
    events: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'HUD interface showing only sightings without historical events',
      },
    },
  },
}

export const WithAnalysis: Story = {
  args: {
    initialSightings: mockSightings,
    events: mockEvents,
    analysisResults: {
      summary:
        'Analysis indicates significant clustering of UAP sightings near military installations and nuclear facilities.',
      patterns: [
        'Geographic clustering near US military bases',
        'Temporal clustering around dusk hours',
        'Increase in sightings correlating with disclosure events',
        'Higher concentration along coastal regions',
      ],
      hotspots: ['Southwest United States', 'Eastern Seaboard', 'Gulf Coast'],
      recommendations: [
        'Cross-reference with military exercise schedules',
        'Monitor nuclear facility proximity',
        'Track correlation with atmospheric conditions',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'HUD interface with AI-generated analysis overlay',
      },
    },
  },
}

export const HistoricalView: Story = {
  args: {
    initialSightings: mockSightings.filter(
      (s) => new Date(s.timestamp).getFullYear() < 2000
    ),
    events: mockEvents.filter((e) => new Date(e.date).getFullYear() < 2000),
  },
  parameters: {
    docs: {
      description: {
        story: 'HUD interface showing only pre-2000 historical data',
      },
    },
  },
}

export const ModernView: Story = {
  args: {
    initialSightings: mockSightings.filter(
      (s) => new Date(s.timestamp).getFullYear() >= 2000
    ),
    events: mockEvents.filter((e) => new Date(e.date).getFullYear() >= 2000),
  },
  parameters: {
    docs: {
      description: {
        story: 'HUD interface showing only modern (2000+) data',
      },
    },
  },
}

export const Empty: Story = {
  args: {
    initialSightings: [],
    events: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty HUD interface with no data',
      },
    },
  },
}
