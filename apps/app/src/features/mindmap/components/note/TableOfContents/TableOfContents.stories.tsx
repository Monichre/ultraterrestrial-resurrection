import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TableOfContents } from './TableOfContents'


const meta = {
  title: 'Mindmap/note/TableOfContents/TableOfContents',
  component: TableOfContents,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TableOfContents>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
