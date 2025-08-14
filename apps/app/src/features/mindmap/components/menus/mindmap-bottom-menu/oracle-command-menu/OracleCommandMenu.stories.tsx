import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { OracleCommandMenu } from './OracleCommandMenu'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/oracle-command-menu/OracleCommandMenu',
  component: OracleCommandMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OracleCommandMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
