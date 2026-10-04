import type {Meta, StoryObj} from '@storybook/react'
import {ShootingStarsBackground} from './shooting-stars-background'

const meta = {
  title: 'Components/Backgrounds/ShootingStarsBackground',
  component: ShootingStarsBackground,
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
} satisfies Meta<typeof ShootingStarsBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
