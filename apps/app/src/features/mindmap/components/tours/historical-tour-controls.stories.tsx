import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { HistoricalTourControls } from './historical-tour-controls'


const meta = {
  title: 'Mindmap/tours/historical-tour-controls',
  component: HistoricalTourControls,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof HistoricalTourControls>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
