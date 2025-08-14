import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SmartGraph } from './smart-graph'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for smart-graph (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/smart-graph/smart-graph',
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
