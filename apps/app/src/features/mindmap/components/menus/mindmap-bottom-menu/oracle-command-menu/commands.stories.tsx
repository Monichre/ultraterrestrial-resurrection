import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { COMMANDS } from './commands'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/oracle-command-menu/commands',
  component: COMMANDS,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof COMMANDS>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
