import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SpatialGroupingOverlay } from './spatial-grouping-overlay'


const meta = {
  title: 'Mindmap/grouping/spatial-grouping-overlay',
  component: SpatialGroupingOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SpatialGroupingOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
