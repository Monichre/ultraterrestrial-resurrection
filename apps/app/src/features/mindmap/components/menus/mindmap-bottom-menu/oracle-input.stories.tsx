import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ToggleButton } from './oracle-input'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/oracle-input',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
