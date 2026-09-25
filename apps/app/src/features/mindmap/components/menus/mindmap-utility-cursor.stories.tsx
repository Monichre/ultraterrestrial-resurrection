import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MindMapUtilityCursor } from './mindmap-utility-cursor'


const meta = {
  title: 'Mindmap/menus/mindmap-utility-cursor',
  component: MindMapUtilityCursor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MindMapUtilityCursor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
