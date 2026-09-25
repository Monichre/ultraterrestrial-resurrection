import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ContentTypePicker } from './ContentTypePicker'


const meta = {
  title: 'Mindmap/note/menus/TextMenu/components/ContentTypePicker',
  component: ContentTypePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ContentTypePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
