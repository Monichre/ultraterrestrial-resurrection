import type {Meta, StoryObj} from '@storybook/react'
import {ThreadList} from './thread-list'

const meta = {
  title: 'Components/AssistantUI/ThreadList',
  component: ThreadList,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ThreadList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className='w-64 p-4'>
      <ThreadList />
    </div>
  ),
}
