import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RootNodeCard } from './root-node-card'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for root-node-card (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/cards/root-node-card/root-node-card',
  component: Placeholder,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Placeholder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
