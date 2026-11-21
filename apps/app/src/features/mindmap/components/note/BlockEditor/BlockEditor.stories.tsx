import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BlockEditor } from './BlockEditor'


const meta = {
  title: 'Mindmap/note/BlockEditor/BlockEditor',
  component: BlockEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BlockEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
