import type {Meta, StoryObj} from '@storybook/react'
import {StarsBackground, Star} from './stars-background'

const meta = {
  title: 'Components/Backgrounds/StarsBackground',
  component: StarsBackground,
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
} satisfies Meta<typeof StarsBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DenseStars: Story = {
  args: {
    starDensity: 0.0005,
    allStarsTwinkle: true,
  },
}

export const NoTwinkle: Story = {
  args: {
    allStarsTwinkle: false,
    twinkleProbability: 0,
  },
}

export const SingleStar: Story = {
  render: () => (
    <svg className='h-48 w-48'>
      <Star x={24} y={24} radius={2} opacity={0.8} twinkleSpeed={2} />
    </svg>
  ),
}
