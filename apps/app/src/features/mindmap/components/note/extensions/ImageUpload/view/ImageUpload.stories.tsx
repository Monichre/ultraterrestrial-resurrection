import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ImageUpload } from './ImageUpload'


const meta = {
  title: 'Mindmap/note/extensions/ImageUpload/view/ImageUpload',
  component: ImageUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ImageUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
