import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CardStackUI } from './cards'


const meta = {
  title: 'Mindmap/cards/card-stack/cards',
  component: CardStackUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CardStackUI>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
