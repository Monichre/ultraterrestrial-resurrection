import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Surface } from './Surface'


const meta = {
  title: 'Mindmap/note/ui/Surface',
  component: Surface,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
