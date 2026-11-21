import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ImageBlockWidth } from './ImageBlockWidth'


const meta = {
  title: 'Mindmap/note/extensions/ImageBlock/components/ImageBlockWidth',
  component: ImageBlockWidth,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ImageBlockWidth>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
