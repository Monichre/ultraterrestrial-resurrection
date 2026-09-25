import type {Meta, StoryObj} from '@storybook/react'
import {FloatingElements} from './floating-elements'

const meta = {
  title: 'Components/DemoLanding/FloatingElements',
  component: FloatingElements,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 to-black'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FloatingElements>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
