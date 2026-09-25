import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BonsaiCard } from './bonsai-card'


const meta = {
  title: 'Mindmap/cards/event/bonsai-card',
  component: BonsaiCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BonsaiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
