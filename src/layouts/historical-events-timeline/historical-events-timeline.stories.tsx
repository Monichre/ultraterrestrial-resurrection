import type { EventsRecord } from '@/db/xata'
import type { Meta, StoryObj } from '@storybook/react'
import type { JSONData } from '@xata.io/client'
import { Suspense } from 'react'
import { HistoricalEventsTimeline } from './historical-events-timeline'

const mockEvents = [
  {
    date: '2023-05-01T00:00:00.000Z',
    id: 'rec_com4tkrj94t17efdaqc0',
    latitude: 36.17497,
    location: 'Las Vegas, Nevada',
    longitude: -115.13722,
    name: 'Vegas Ufo Crash & Alien Sighting',
    photos: null,
    xata: {
      createdAt: '2024-04-27T01:03:15.238Z',
      updatedAt: '2024-04-29T06:56:27.556Z',
      version: 2,
    },
  },
  {
    date: '1980-12-24T06:00:00.000Z',
    description: 'United States Air Force personnel reported various unusual observations at RAF Woodbridge and RAF Bentwaters, two American air bases located in England. Their reports included lights in the sky, a metallic triangular object in the forest, multi-colored lights moving through the forest, and higher levels of radiation.',
    id: 'rec_cobdg3tbjt595h63762g',
    latitude: 52.0838,
    location: 'Rendlesham Forest, Suffolk, England EU, United Kingdom',
    longitude: 1.4333,
    name: 'Rendlesham Forest incident',
    photos: null,
    xata: {
      createdAt: '2024-04-10T18:18:55.626Z',
      updatedAt: '2024-04-29T07:03:40.560Z',
      version: 3,
    },
  }
] as JSONData<EventsRecord>[]

const meta = {
  title: 'Layouts/Historical Events Timeline',
  component: HistoricalEventsTimeline,
  parameters: {
    layout: 'fullscreen',
    canvas: {
      backgroundColor: '#000000',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    chromatic: {
      delay: 500, // Allow time for 3D components to initialize
      pauseAnimationAtEnd: true,
    },
  },
  decorators: [
    ( Story ) => (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        overflow: 'hidden'
      }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Story />
        </Suspense>
      </div>
    )
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof HistoricalEventsTimeline>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    events: mockEvents
  },
  parameters: {
    chromatic: {
      delay: 1000 // Extra delay for initial load
    }
  }
}

export const Empty: Story = {
  args: {
    events: []
  }
} 