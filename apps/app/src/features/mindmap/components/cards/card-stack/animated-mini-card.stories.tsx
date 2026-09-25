import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MINI_CARD_DEFAULT_HEIGHT } from './animated-mini-card'


const meta = {
  title: 'Mindmap/cards/card-stack/animated-mini-card',
  component: MINI_CARD_DEFAULT_HEIGHT,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MINI_CARD_DEFAULT_HEIGHT>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
