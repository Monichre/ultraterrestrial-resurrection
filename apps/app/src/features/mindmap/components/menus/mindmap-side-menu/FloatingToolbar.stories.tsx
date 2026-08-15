import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { FloatingToolbar } from './FloatingToolbar'


const meta = {
  title: 'Mindmap/menus/mindmap-side-menu/FloatingToolbar',
  component: FloatingToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FloatingToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
