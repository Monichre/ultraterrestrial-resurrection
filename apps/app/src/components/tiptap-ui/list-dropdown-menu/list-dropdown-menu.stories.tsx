import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {ListDropdownMenu} from './list-dropdown-menu'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/ListDropdownMenu',
  component: ListDropdownMenu,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ListDropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TiptapStoryEditor>
      <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
    </TiptapStoryEditor>
  ),
}
