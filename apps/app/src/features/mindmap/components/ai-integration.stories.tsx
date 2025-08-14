import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AIMindMapProvider } from './ai-integration'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for ai-integration (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/ai-integration',
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
