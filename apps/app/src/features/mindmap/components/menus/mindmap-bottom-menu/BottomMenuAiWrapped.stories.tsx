import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BottomMenuAiWrapped } from './BottomMenuAiWrapped'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for BottomMenuAiWrapped (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/BottomMenuAiWrapped',
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
