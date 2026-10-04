import type {Meta, StoryObj} from '@storybook/react'
import {AnimatedGridPatternBackground} from './AnimatedGridPattern'

const meta = {
  title: 'Components/Backgrounds/AnimatedGridPattern',
  component: AnimatedGridPatternBackground,
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
} satisfies Meta<typeof AnimatedGridPatternBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DenseGrid: Story = {
  args: {
    numSquares: 120,
    maxOpacity: 0.7,
    duration: 3,
  },
}

export const SparseGrid: Story = {
  args: {
    numSquares: 20,
    maxOpacity: 0.4,
    duration: 6,
  },
}
