import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AiWriter } from './AiWriter'


const meta = {
  title: 'Mindmap/note/extensions/AiWriter/AiWriter',
  component: AiWriter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AiWriter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
