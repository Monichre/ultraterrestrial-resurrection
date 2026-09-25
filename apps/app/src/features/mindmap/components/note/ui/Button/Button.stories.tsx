import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Button } from './Button'


const meta = {
  title: 'Mindmap/note/ui/Button/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
