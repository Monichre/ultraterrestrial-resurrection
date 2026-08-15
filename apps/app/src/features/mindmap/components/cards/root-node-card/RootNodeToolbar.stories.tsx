import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RootNodeToolbar } from './RootNodeToolbar'


const meta = {
  title: 'Mindmap/cards/root-node-card/RootNodeToolbar',
  component: RootNodeToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof RootNodeToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
