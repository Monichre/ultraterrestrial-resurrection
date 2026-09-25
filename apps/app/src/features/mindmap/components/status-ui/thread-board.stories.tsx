import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ThreadBoard } from './thread-board'


const meta = {
  title: 'Mindmap/status-ui/thread-board',
  component: ThreadBoard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ThreadBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
