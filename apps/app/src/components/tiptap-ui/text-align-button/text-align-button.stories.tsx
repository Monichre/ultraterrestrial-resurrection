import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {TextAlignButton} from './text-align-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/TextAlignButton',
  component: TextAlignButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof TextAlignButton>

export default meta
type Story = StoryObj<typeof meta>

export const Left: Story = {
  args: {align: 'left'},
  render: (args) => (
    <TiptapStoryEditor>
      <TextAlignButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Center: Story = {
  args: {align: 'center'},
  render: (args) => (
    <TiptapStoryEditor>
      <TextAlignButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Right: Story = {
  args: {align: 'right'},
  render: (args) => (
    <TiptapStoryEditor>
      <TextAlignButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Justify: Story = {
  args: {align: 'justify'},
  render: (args) => (
    <TiptapStoryEditor>
      <TextAlignButton {...args} />
    </TiptapStoryEditor>
  ),
}
