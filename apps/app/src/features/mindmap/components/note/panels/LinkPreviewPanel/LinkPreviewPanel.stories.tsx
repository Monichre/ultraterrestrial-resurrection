import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LinkPreviewPanel } from './LinkPreviewPanel'


const meta = {
  title: 'Mindmap/note/panels/LinkPreviewPanel/LinkPreviewPanel',
  component: LinkPreviewPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LinkPreviewPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
