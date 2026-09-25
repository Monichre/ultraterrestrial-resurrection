import type {Meta, StoryObj} from '@storybook/react'
import {Thread} from './thread'

const meta = {
  title: 'Components/AssistantUI/Thread',
  component: Thread,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof Thread>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className='w-full h-[600px]'>
      <Thread />
    </div>
  ),
}
