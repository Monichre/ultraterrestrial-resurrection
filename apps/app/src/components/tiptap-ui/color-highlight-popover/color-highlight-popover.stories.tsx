import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {ColorHighlightPopover} from './color-highlight-popover'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/ColorHighlightPopover',
  component: ColorHighlightPopover,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ColorHighlightPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TiptapStoryEditor>
      <ColorHighlightPopover />
    </TiptapStoryEditor>
  ),
}
