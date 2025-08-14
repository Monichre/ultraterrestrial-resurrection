import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CommandButton } from './CommandButton'


const meta = {
  title: 'Mindmap/note/extensions/SlashCommand/CommandButton',
  component: CommandButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CommandButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
