import type {Meta, StoryObj} from '@storybook/react'
import {TimelineViews} from './timeline-views'
import type {EventsRecord} from '@db/postgres'
import type {JSONData} from '@xata.io/client'
import {Suspense} from 'react'

// Mock events data with historical UAP events
const mockEvents: JSONData<EventsRecord>[] = [
  {
    id: 'evt-1947-roswell',
    name: 'Roswell Incident',
    description:
      'An unidentified object crashed on a ranch near Roswell, New Mexico. The US Army Air Forces initially announced recovery of a "flying disc" before retracting the statement.',
    location: 'Roswell, New Mexico',
    latitude: 33.3943,
    longitude: -104.523,
    date: '1947-07-08T00:00:00.000Z',
    photos: null,
    xata: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
  },
  {
    id: 'evt-1952-washington',
    name: 'Washington D.C. UFO Incident',
    description:
      'Series of UFO sightings over Washington D.C. accompanied by radar contacts. Jets were scrambled to intercept.',
    location: 'Washington, D.C.',
    latitude: 38.9072,
    longitude: -77.0369,
    date: '1952-07-19T00:00:00.000Z',
    photos: null,
    xata: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
  },
  {
    id: 'evt-1980-rendlesham',
    name: 'Rendlesham Forest Incident',
    description:
      'US Air Force personnel reported unusual lights and a possible landing near RAF Woodbridge in Suffolk, England.',
    location: 'Rendlesham Forest, Suffolk, England',
    latitude: 52.0838,
    longitude: 1.4333,
    date: '1980-12-26T00:00:00.000Z',
    photos: null,
    xata: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
  },
  {
    id: 'evt-1997-phoenix',
    name: 'Phoenix Lights',
    description:
      'Thousands of witnesses observed a massive V-shaped craft and series of lights over Phoenix, Arizona.',
    location: 'Phoenix, Arizona',
    latitude: 33.4484,
    longitude: -112.074,
    date: '1997-03-13T00:00:00.000Z',
    photos: null,
    xata: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
  },
  {
    id: 'evt-2004-nimitz',
    name: 'USS Nimitz Encounter (Tic Tac)',
    description:
      'Navy pilots from USS Nimitz carrier group encountered and recorded unidentified aerial phenomena off San Diego coast.',
    location: 'Pacific Ocean, off San Diego',
    latitude: 32.0,
    longitude: -118.0,
    date: '2004-11-14T00:00:00.000Z',
    photos: null,
    xata: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
  },
  {
    id: 'evt-2017-nyt',
    name: 'NYT AATIP Revelation',
    description:
      'New York Times publishes story revealing Pentagon\'s secret Advanced Aerospace Threat Identification Program.',
    location: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.006,
    date: '2017-12-16T00:00:00.000Z',
    photos: null,
    xata: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
  },
  {
    id: 'evt-2023-hearing',
    name: 'Congressional UAP Hearing',
    description:
      'Historic Congressional hearing featuring testimony from David Grusch, Ryan Graves, and David Fravor on UAP.',
    location: 'Washington, D.C.',
    latitude: 38.9072,
    longitude: -77.0369,
    date: '2023-07-26T00:00:00.000Z',
    photos: null,
    xata: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
  },
]

const meta = {
  title: 'Pages/Timeline/TimelineViews',
  component: TimelineViews,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#000000'}]},
    chromatic: {
      delay: 1000,
      pauseAnimationAtEnd: true,
    },
  },
  argTypes: {
    events: {
      description: 'Array of historical events to display',
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
} satisfies Meta<typeof TimelineViews>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    events: mockEvents,
  },
}

export const HistoricalEvents: Story = {
  args: {
    events: mockEvents.filter((e) => new Date(e.date as string).getFullYear() < 2000),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows only pre-2000 historical UAP events',
      },
    },
  },
}

export const ModernEvents: Story = {
  args: {
    events: mockEvents.filter((e) => new Date(e.date as string).getFullYear() >= 2000),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows only modern (2000+) UAP events',
      },
    },
  },
}

export const SingleEvent: Story = {
  args: {
    events: [mockEvents[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'Timeline with a single event',
      },
    },
  },
}

export const Empty: Story = {
  args: {
    events: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Timeline with no events',
      },
    },
  },
}
