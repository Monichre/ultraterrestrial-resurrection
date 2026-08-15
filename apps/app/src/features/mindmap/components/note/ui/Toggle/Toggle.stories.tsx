import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Toggle } from './Toggle'


const meta = {
  title: 'Mindmap/note/ui/Toggle/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
