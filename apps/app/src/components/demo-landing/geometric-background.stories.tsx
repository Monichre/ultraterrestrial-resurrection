import type {Meta, StoryObj} from '@storybook/react'
import {GeometricBackground} from './geometric-background'

const meta = {
  title: 'Components/DemoLanding/GeometricBackground',
  component: GeometricBackground,
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
} satisfies Meta<typeof GeometricBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    scrollProgress: 0,
  },
}

export const MidScroll: Story = {
  args: {
    scrollProgress: 0.5,
  },
}

export const FullScroll: Story = {
  args: {
    scrollProgress: 1,
  },
}
