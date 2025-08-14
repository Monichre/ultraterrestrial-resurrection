import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TourModeIntegration } from './tour-mode-integration'


const meta = {
  title: 'Mindmap/tours/tour-mode-integration',
  component: TourModeIntegration,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TourModeIntegration>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
