import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { EditorHeader } from './EditorHeader'


const meta = {
  title: 'Mindmap/note/BlockEditor/components/EditorHeader',
  component: EditorHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EditorHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
