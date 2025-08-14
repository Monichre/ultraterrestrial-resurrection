import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MindMapMessages } from './MindMapMessages'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/MindMapMessages',
  component: MindMapMessages,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MindMapMessages>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
