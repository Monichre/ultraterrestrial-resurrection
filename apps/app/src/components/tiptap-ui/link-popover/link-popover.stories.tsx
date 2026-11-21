import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {LinkPopover} from './link-popover'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/LinkPopover',
  component: LinkPopover,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof LinkPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TiptapStoryEditor>
      <LinkPopover />
    </TiptapStoryEditor>
  ),
}
