import type {Meta, StoryObj} from '@storybook/react'
import {Thread} from '@repo/ai/components'

const meta: Meta<typeof Thread> = {
  title: 'AI/Thread',
  component: Thread,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <div>First message in the thread</div>
        <div>Another message item</div>
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof Thread>

export const Default: Story = {}
