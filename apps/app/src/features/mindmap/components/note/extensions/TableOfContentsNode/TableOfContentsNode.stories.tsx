import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TableOfContentsNode } from './TableOfContentsNode'


const meta = {
  title: 'Mindmap/note/extensions/TableOfContentsNode/TableOfContentsNode',
  component: TableOfContentsNode,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TableOfContentsNode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
