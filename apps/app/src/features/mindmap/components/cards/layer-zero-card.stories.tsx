import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LazyerZeroCard } from './layer-zero-card'


const meta = {
  title: 'Mindmap/cards/layer-zero-card',
  component: LazyerZeroCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LazyerZeroCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
