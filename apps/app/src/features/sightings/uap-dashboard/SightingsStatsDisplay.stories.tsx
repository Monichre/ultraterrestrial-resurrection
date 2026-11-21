import type {Meta, StoryObj} from '@storybook/react'
import {SightingsStatsDisplay} from './sightings-stats-display'

// Mock statistics data for sightings
const mockStats = {
  sightings: {
    total: 1247,
    shapeDistribution: [
      {value: 'Lights', count: 423},
      {value: 'Triangle', count: 287},
      {value: 'Disc', count: 204},
      {value: 'Sphere', count: 175},
      {value: 'Cylinder', count: 89},
      {value: 'Oval', count: 69},
    ],
    locationData: [
      {value: 'New Jersey', count: 312},
      {value: 'California', count: 278},
      {value: 'Texas', count: 196},
      {value: 'New York', count: 187},
      {value: 'Florida', count: 143},
      {value: 'Washington', count: 131},
    ],
    timeseriesData: [
      {value: '2018-01-01', count: 145},
      {value: '2019-01-01', count: 189},
      {value: '2020-01-01', count: 267},
      {value: '2021-01-01', count: 282},
      {value: '2022-01-01', count: 301},
      {value: '2023-01-01', count: 350},
    ],
  },
}

// Mock statistics with fewer data points
const mockLimitedStats = {
  sightings: {
    total: 248,
    shapeDistribution: [
      {value: 'Lights', count: 124},
      {value: 'Triangle', count: 92},
      {value: 'Unknown', count: 32},
    ],
    locationData: [
      {value: 'New Jersey', count: 150},
      {value: 'New York', count: 98},
    ],
    timeseriesData: [
      {value: '2022-01-01', count: 98},
      {value: '2023-01-01', count: 150},
    ],
  },
}

const meta: Meta<typeof SightingsStatsDisplay> = {
  title: 'Features/UAP Dashboard/SightingsStatsDisplay',
  component: SightingsStatsDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-96 h-full bg-black p-4'>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SightingsStatsDisplay>

export const Default: Story = {
  args: {
    stats: mockStats,
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    stats: null,
    isLoading: true,
  },
}

export const LimitedData: Story = {
  args: {
    stats: mockLimitedStats,
    isLoading: false,
  },
}

export const NoData: Story = {
  args: {
    stats: {sightings: {total: 0}},
    isLoading: false,
  },
}

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className='w-full max-w-[320px] h-full bg-black p-4'>
        <Story />
      </div>
    ),
  ],
  args: {
    stats: mockStats,
    isLoading: false,
  },
}
