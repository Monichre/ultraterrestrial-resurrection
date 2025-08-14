import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TourEnhancedBottomMenu } from './tour-enhanced-bottom-menu'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/tour-enhanced-bottom-menu',
  component: TourEnhancedBottomMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TourEnhancedBottomMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
