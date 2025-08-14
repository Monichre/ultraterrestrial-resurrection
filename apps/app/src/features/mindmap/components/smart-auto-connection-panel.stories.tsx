import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SmartAutoConnectionPanel } from './smart-auto-connection-panel'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for smart-auto-connection-panel (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/smart-auto-connection-panel',
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
