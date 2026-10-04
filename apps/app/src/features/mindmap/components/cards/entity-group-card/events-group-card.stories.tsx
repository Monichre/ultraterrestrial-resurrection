import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { DragCards } from './events-group-card'


const meta = {
  title: 'Mindmap/cards/entity-group-card/events-group-card',
  component: DragCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof DragCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
