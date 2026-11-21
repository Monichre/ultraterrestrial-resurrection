import type {Meta, StoryObj} from '@storybook/react'
import {CosmicBackground} from './cosmic-background'

const meta = {
  title: 'Components/DemoLanding/CosmicBackground',
  component: CosmicBackground,
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
} satisfies Meta<typeof CosmicBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
