import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ConnectedRecordsPanel } from './connected-records-panel'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for connected-records-panel (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/connected-records-panel',
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
