import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LinkMenu } from './LinkMenu'


const meta = {
  title: 'Mindmap/note/menus/LinkMenu/LinkMenu',
  component: LinkMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LinkMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
