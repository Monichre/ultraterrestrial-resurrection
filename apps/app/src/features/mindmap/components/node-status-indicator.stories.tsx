import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LoadingIndicator } from './node-status-indicator'


const meta = {
  title: 'Mindmap/node-status-indicator',
  component: LoadingIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LoadingIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
