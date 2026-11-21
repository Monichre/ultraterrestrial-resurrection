import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AnimatedCardWithRef } from './entity-card'

const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for entity-card (complex providers required)
  </div>
)


const meta = {
  title: 'Mindmap/cards/entity-card/entity-card',
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
