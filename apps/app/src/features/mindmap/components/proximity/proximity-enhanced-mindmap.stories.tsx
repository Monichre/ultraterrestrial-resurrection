import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ProximityEnhancedMindmap } from './proximity-enhanced-mindmap'


const meta = {
  title: 'Mindmap/proximity/proximity-enhanced-mindmap',
  component: ProximityEnhancedMindmap,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ProximityEnhancedMindmap>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
