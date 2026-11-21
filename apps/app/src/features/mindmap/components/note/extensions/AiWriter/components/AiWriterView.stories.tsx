import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AiWriterView } from './AiWriterView'


const meta = {
  title: 'Mindmap/note/extensions/AiWriter/components/AiWriterView',
  component: AiWriterView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AiWriterView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
