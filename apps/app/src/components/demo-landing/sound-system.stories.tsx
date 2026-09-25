import type {Meta, StoryObj} from '@storybook/react'
import {SoundSystem} from './sound-system'

const meta = {
  title: 'Components/DemoLanding/SoundSystem',
  component: SoundSystem,
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
} satisfies Meta<typeof SoundSystem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentSection: 1,
  },
}

export const Section2: Story = {
  args: {
    currentSection: 2,
  },
}

export const Section3: Story = {
  args: {
    currentSection: 3,
  },
}
