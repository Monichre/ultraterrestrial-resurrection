import type {Meta, StoryObj} from '@storybook/react'
import {ScrollSystem} from './scroll-system'

const meta = {
  title: 'Components/DemoLanding/ScrollSystem',
  component: ScrollSystem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ScrollSystem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className='flex h-full items-center justify-center text-white'>
        <h1 className='text-4xl font-bold'>Scroll System Content</h1>
      </div>
    ),
  },
}
