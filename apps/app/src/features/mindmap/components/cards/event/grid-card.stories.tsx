import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { GridCard } from './grid-card'


const meta = {
  title: 'Mindmap/cards/event/grid-card',
  component: GridCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof GridCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
