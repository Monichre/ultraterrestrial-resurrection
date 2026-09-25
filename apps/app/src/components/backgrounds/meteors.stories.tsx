import type {Meta, StoryObj} from '@storybook/react'
import {Meteors} from './meteors'

const meta = {
  title: 'Components/Backgrounds/Meteors',
  component: Meteors,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative flex h-screen w-full items-center justify-center overflow-hidden bg-black'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Meteors>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    number: 20,
  },
}

export const ManyMeteors: Story = {
  args: {
    number: 50,
  },
}

export const FewMeteors: Story = {
  args: {
    number: 8,
  },
}
