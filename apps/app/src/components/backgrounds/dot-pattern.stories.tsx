import type {Meta, StoryObj} from '@storybook/react'
import {DotPattern} from './dot-pattern'

const meta = {
  title: 'Components/Backgrounds/DotPattern',
  component: DotPattern,
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
} satisfies Meta<typeof DotPattern>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LargeDots: Story = {
  args: {
    width: 32,
    height: 32,
    cr: 2,
  },
}

export const SmallDots: Story = {
  args: {
    width: 10,
    height: 10,
    cr: 0.5,
  },
}
