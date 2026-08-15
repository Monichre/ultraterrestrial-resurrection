import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Note } from './Note'


const meta = {
  title: 'Mindmap/note/Note',
  component: Note,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Note>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
