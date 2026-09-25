import type {Meta, StoryObj} from '@storybook/react'
import {MatrixBackground} from './MatrixBackground'

const meta = {
  title: 'Components/Backgrounds/MatrixBackground',
  component: MatrixBackground,
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
} satisfies Meta<typeof MatrixBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GreenMatrix: Story = {
  args: {
    color: '#00FF00',
    fontSize: 16,
    speed: 1.5,
  },
}

export const CyanMatrix: Story = {
  args: {
    color: '#00FFFF',
    fontSize: 12,
    speed: 0.8,
  },
}

export const FastMatrix: Story = {
  args: {
    speed: 3,
  },
}
