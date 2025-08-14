import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { HistoricalContextOverlay } from './historical-context-overlay'


const meta = {
  title: 'Mindmap/tours/historical-context-overlay',
  component: HistoricalContextOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof HistoricalContextOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
