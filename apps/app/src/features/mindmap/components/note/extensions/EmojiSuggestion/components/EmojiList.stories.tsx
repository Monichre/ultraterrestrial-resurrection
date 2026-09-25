import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import EmojiList from './EmojiList'


const meta = {
  title: 'Mindmap/note/extensions/EmojiSuggestion/components/EmojiList',
  component: EmojiList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EmojiList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
