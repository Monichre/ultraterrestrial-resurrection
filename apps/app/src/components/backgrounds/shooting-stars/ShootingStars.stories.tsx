import type {Meta, StoryObj} from '@storybook/react'
import {ShootingStars} from './ShootingStars'

const meta = {
  title: 'Components/Backgrounds/ShootingStars',
  component: ShootingStars,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative h-screen w-full overflow-hidden bg-black'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShootingStars>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FastStars: Story = {
  args: {
    minSpeed: 20,
    maxSpeed: 50,
    minDelay: 500,
    maxDelay: 2000,
  },
}

export const PurpleStars: Story = {
  args: {
    starColor: '#9E00FF',
    trailColor: '#2EB9DF',
  },
}
