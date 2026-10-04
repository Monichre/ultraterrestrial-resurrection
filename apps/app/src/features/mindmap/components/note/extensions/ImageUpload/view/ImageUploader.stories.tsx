import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ImageUploader } from './ImageUploader'


const meta = {
  title: 'Mindmap/note/extensions/ImageUpload/view/ImageUploader',
  component: ImageUploader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ImageUploader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
