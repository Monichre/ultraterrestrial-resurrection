import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {HeadingDropdownMenu} from './heading-dropdown-menu'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/HeadingDropdownMenu',
  component: HeadingDropdownMenu,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof HeadingDropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TiptapStoryEditor>
      <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
    </TiptapStoryEditor>
  ),
}

export const AllLevels: Story = {
  render: () => (
    <TiptapStoryEditor>
      <HeadingDropdownMenu levels={[1, 2, 3, 4, 5, 6]} />
    </TiptapStoryEditor>
  ),
}
