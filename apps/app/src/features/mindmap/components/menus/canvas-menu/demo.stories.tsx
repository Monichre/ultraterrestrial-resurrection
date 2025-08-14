import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CanvasMenuDemo } from './demo'


const meta = {
  title: 'Mindmap/menus/canvas-menu/demo',
  component: CanvasMenuDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CanvasMenuDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
