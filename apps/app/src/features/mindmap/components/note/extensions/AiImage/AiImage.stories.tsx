import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AiImage } from './AiImage'


const meta = {
  title: 'Mindmap/note/extensions/AiImage/AiImage',
  component: AiImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AiImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
