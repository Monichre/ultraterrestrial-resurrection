import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LinkEditorPanel } from './LinkEditorPanel'


const meta = {
  title: 'Mindmap/note/panels/LinkEditorPanel/LinkEditorPanel',
  component: LinkEditorPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LinkEditorPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
