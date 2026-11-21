import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AIDropdown } from './AIDropdown'


const meta = {
  title: 'Mindmap/note/menus/TextMenu/components/AIDropdown',
  component: AIDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AIDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
