import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {MarkButton} from './mark-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/MarkButton',
  component: MarkButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof MarkButton>

export default meta
type Story = StoryObj<typeof meta>

export const Bold: Story = {
  args: {type: 'bold'},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Italic: Story = {
  args: {type: 'italic'},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Underline: Story = {
  args: {type: 'underline'},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Strike: Story = {
  args: {type: 'strike'},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Code: Story = {
  args: {type: 'code'},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Superscript: Story = {
  args: {type: 'superscript'},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Subscript: Story = {
  args: {type: 'subscript'},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const WithShortcut: Story = {
  args: {type: 'bold', showShortcut: true},
  render: (args) => (
    <TiptapStoryEditor>
      <MarkButton {...args} />
    </TiptapStoryEditor>
  ),
}
