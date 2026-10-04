import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MiniCard } from './mini-card'


const meta = {
  title: 'Mindmap/cards/mini-card',
  component: MiniCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MiniCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
