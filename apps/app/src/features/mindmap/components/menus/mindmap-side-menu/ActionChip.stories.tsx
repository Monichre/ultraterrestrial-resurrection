import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ActionChip } from './ActionChip'


const meta = {
  title: 'Mindmap/menus/mindmap-side-menu/ActionChip',
  component: ActionChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ActionChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
