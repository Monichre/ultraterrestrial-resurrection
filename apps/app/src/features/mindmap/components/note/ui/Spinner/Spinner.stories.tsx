import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Spinner } from './Spinner'


const meta = {
  title: 'Mindmap/note/ui/Spinner/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
