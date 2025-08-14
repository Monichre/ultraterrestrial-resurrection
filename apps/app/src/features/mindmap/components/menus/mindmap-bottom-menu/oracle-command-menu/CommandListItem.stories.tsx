import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CommandListItem } from './CommandListItem'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/oracle-command-menu/CommandListItem',
  component: CommandListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CommandListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
