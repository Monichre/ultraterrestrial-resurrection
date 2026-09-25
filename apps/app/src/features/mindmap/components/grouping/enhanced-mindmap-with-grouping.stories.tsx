import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { EnhancedMindmapWithGrouping } from './enhanced-mindmap-with-grouping'


const meta = {
  title: 'Mindmap/grouping/enhanced-mindmap-with-grouping',
  component: EnhancedMindmapWithGrouping,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EnhancedMindmapWithGrouping>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
