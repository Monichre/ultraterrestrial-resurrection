import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AskAI } from './ask-ai'


const meta = {
  title: 'Mindmap/ask-ai',
  component: AskAI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AskAI>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
