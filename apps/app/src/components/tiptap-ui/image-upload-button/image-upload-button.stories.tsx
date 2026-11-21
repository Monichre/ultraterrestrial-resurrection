import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {ImageUploadButton} from './image-upload-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/ImageUploadButton',
  component: ImageUploadButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ImageUploadButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TiptapStoryEditor>
      <ImageUploadButton />
    </TiptapStoryEditor>
  ),
}

export const WithText: Story = {
  render: () => (
    <TiptapStoryEditor>
      <ImageUploadButton text="Add Image" />
    </TiptapStoryEditor>
  ),
}

export const WithShortcut: Story = {
  render: () => (
    <TiptapStoryEditor>
      <ImageUploadButton showShortcut />
    </TiptapStoryEditor>
  ),
}
