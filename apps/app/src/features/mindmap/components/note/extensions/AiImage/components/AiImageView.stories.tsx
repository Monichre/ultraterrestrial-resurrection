import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AiImageView } from './AiImageView'


const meta = {
  title: 'Mindmap/note/extensions/AiImage/components/AiImageView',
  component: AiImageView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AiImageView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
