import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MindMapAiChat } from './mindmap-ai-chat'


const meta = {
  title: 'Mindmap/menus/mindmap-ai-chat',
  component: MindMapAiChat,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MindMapAiChat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
