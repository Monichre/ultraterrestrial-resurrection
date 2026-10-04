import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {BlockquoteButton} from './blockquote-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/BlockquoteButton',
  component: BlockquoteButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof BlockquoteButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TiptapStoryEditor>
      <BlockquoteButton />
    </TiptapStoryEditor>
  ),
}

export const WithText: Story = {
  render: () => (
    <TiptapStoryEditor>
      <BlockquoteButton text="Quote" />
    </TiptapStoryEditor>
  ),
}

export const WithShortcut: Story = {
  render: () => (
    <TiptapStoryEditor>
      <BlockquoteButton showShortcut />
    </TiptapStoryEditor>
  ),
}
