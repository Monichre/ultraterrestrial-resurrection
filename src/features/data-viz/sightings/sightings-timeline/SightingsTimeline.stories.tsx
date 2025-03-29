import type {Meta, StoryObj} from '@storybook/react'
import {SightingsTimeline} from './SightingsTimeline'
import './sightings-timeline/SightingsTimeline.css'

// Import GSAP plugins needed for the component
import 'gsap/dist/gsap'
import 'gsap/dist/Draggable'
import 'gsap/dist/InertiaPlugin'

const meta = {
  title: 'Features/Data Viz/Sightings Timeline',
  component: SightingsTimeline,
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
} satisfies Meta<typeof SightingsTimeline>

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
