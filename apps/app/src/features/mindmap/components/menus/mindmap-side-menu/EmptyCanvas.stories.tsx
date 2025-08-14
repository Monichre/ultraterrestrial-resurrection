import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { EmptyCanvas } from './EmptyCanvas'


const meta = {
  title: 'Mindmap/menus/mindmap-side-menu/EmptyCanvas',
  component: EmptyCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EmptyCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
