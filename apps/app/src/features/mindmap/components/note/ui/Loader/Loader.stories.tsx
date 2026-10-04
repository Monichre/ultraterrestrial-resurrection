import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Loader } from './Loader'


const meta = {
  title: 'Mindmap/note/ui/Loader/Loader',
  component: Loader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
