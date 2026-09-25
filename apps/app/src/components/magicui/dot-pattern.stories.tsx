import type {Meta, StoryObj} from '@storybook/react'
import {DotPattern} from './dot-pattern'

const meta = {
  title: 'Components/MagicUI/DotPattern',
  component: DotPattern,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof DotPattern>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className='relative w-full h-[400px] bg-neutral-950'>
      <DotPattern className='text-neutral-400' />
    </div>
  ),
}

export const Glow: Story = {
  render: () => (
    <div className='relative w-full h-[400px] bg-neutral-950'>
      <DotPattern glow className='text-blue-400' />
    </div>
  ),
}
