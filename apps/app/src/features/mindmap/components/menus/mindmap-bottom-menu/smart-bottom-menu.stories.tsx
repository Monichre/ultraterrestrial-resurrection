import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SmartBottomMenu } from './smart-bottom-menu'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for smart-bottom-menu (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/smart-bottom-menu',
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
