import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { EditLinkPopover } from './EditLinkPopover'


const meta = {
  title: 'Mindmap/note/menus/TextMenu/components/EditLinkPopover',
  component: EditLinkPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EditLinkPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
