import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { FontSizePicker } from './FontSizePicker'


const meta = {
  title: 'Mindmap/note/menus/TextMenu/components/FontSizePicker',
  component: FontSizePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FontSizePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
