import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {ListButton} from './list-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/ListButton',
  component: ListButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ListButton>

export default meta
type Story = StoryObj<typeof meta>

export const BulletList: Story = {
  args: {type: 'bulletList'},
  render: (args) => (
    <TiptapStoryEditor>
      <ListButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const OrderedList: Story = {
  args: {type: 'orderedList'},
  render: (args) => (
    <TiptapStoryEditor>
      <ListButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const TaskList: Story = {
  args: {type: 'taskList'},
  render: (args) => (
    <TiptapStoryEditor>
      <ListButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const WithText: Story = {
  args: {type: 'bulletList', text: 'Bullet'},
  render: (args) => (
    <TiptapStoryEditor>
      <ListButton {...args} />
    </TiptapStoryEditor>
  ),
}
