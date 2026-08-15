import type {Meta, StoryObj} from '@storybook/react'
import {Grain} from './grain'

const meta = {
  title: 'Components/Backgrounds/Grain',
  component: Grain,
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
} satisfies Meta<typeof Grain>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    opacity: 0.5,
  },
}

export const Subtle: Story = {
  args: {
    opacity: 0.2,
  },
}

export const Heavy: Story = {
  args: {
    opacity: 0.8,
  },
}
