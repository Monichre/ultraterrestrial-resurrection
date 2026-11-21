import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ToolbarButton } from './ToolbarButton'


const meta = {
  title: 'Mindmap/menus/mindmap-side-menu/ToolbarButton',
  component: ToolbarButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ToolbarButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
