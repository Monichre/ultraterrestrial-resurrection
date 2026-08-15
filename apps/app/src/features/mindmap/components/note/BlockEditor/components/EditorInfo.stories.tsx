import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { EditorInfo } from './EditorInfo'


const meta = {
  title: 'Mindmap/note/BlockEditor/components/EditorInfo',
  component: EditorInfo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EditorInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
