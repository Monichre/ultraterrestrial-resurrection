import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Toolbar } from './Toolbar'


const meta = {
  title: 'Mindmap/note/ui/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
