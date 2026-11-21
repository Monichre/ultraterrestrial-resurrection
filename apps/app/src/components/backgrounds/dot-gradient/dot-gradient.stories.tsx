import type {Meta, StoryObj} from '@storybook/react'
import {DotGradientBackground} from './dot-gradient'

const meta = {
  title: 'Components/Backgrounds/DotGradient',
  component: DotGradientBackground,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative h-screen w-full overflow-hidden'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DotGradientBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className='relative z-10 flex h-full items-center justify-center text-white'>
        <h1 className='text-4xl font-bold'>Dot Gradient Background</h1>
      </div>
    ),
  },
}
