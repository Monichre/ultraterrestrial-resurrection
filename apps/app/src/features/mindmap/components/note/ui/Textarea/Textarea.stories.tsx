import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Textarea } from './Textarea'


const meta = {
  title: 'Mindmap/note/ui/Textarea/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
