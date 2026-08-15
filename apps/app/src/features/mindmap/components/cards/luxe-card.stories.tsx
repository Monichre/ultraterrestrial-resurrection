import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LuxeCard } from './luxe-card'


const meta = {
  title: 'Mindmap/cards/luxe-card',
  component: LuxeCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LuxeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
