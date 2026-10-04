import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ConnectionCard } from './connection-card'


const meta = {
  title: 'Mindmap/cards/connection-card/connection-card',
  component: ConnectionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ConnectionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
