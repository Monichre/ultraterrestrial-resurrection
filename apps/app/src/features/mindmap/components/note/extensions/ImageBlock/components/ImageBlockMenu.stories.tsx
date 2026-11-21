import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ImageBlockMenu } from './ImageBlockMenu'


const meta = {
  title: 'Mindmap/note/extensions/ImageBlock/components/ImageBlockMenu',
  component: ImageBlockMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ImageBlockMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
