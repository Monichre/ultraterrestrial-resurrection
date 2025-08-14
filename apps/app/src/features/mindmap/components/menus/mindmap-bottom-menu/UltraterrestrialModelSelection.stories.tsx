import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { UltraterrestrialModelSelection } from './UltraterrestrialModelSelection'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/UltraterrestrialModelSelection',
  component: UltraterrestrialModelSelection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof UltraterrestrialModelSelection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
