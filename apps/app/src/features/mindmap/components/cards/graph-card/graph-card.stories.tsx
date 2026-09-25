import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { GraphCard } from './graph-card'


const meta = {
  title: 'Mindmap/cards/graph-card/graph-card',
  component: GraphCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof GraphCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
