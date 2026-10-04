import type {Meta, StoryObj} from '@storybook/react'

// import './sightings-timeline/SightingsTimeline.css' - Removed as this file doesn't exist

// Import GSAP plugins needed for the component
import {gsap} from 'gsap'
import {Draggable} from 'gsap-trial/dist/Draggable'
import {InertiaPlugin} from 'gsap-trial/dist/InertiaPlugin'

// Register plugins
gsap.registerPlugin(Draggable, InertiaPlugin)
import {SightingsTimeSeries} from '@/features/sightings/components/sightings-timeseries/SightingsTimeSeries'

const meta = {
  title: 'Features/Data Viz/Sightings Timeline',
  component: SightingsTimeSeries,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='bg-black min-h-[300px] p-8 flex items-center'>
        <div className='w-full'>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SightingsTimeSeries>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div className='bg-gray-900 min-h-[300px] p-8 flex items-center'>
        <div className='w-full'>
          <Story />
        </div>
      </div>
    ),
  ],
}

export const SpaceTheme: Story = {
  decorators: [
    (Story) => (
      <div
        className='min-h-[300px] p-8 flex items-center'
        style={{
          background: 'linear-gradient(to bottom, #090A0F, #2C3150)',
          boxShadow: 'inset 0 0 50px rgba(77, 99, 247, 0.3)',
        }}>
        <div className='w-full'>
          <Story />
        </div>
      </div>
    ),
  ],
}
