import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AssetPanel } from './AssetPanel'


const meta = {
  title: 'Mindmap/menus/mindmap-side-menu/AssetPanel',
  component: AssetPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AssetPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
