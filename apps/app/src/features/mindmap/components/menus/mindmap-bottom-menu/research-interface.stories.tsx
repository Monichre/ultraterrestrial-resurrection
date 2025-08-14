import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ResearchInterface } from './research-interface'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for research-interface (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/research-interface',
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
