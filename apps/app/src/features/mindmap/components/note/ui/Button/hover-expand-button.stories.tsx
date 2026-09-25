import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { HoverExpandButton } from './hover-expand-button'


const meta = {
  title: 'Mindmap/note/ui/Button/hover-expand-button',
  component: HoverExpandButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof HoverExpandButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
