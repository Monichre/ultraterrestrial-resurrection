import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ImageBlockView } from './ImageBlockView'


const meta = {
  title: 'Mindmap/note/extensions/ImageBlock/components/ImageBlockView',
  component: ImageBlockView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ImageBlockView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
