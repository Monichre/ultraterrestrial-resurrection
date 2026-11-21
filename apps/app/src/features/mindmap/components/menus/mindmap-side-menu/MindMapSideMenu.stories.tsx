import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { MindMapSideMenu } from './MindMapSideMenu'


const meta = {
  title: 'Mindmap/menus/mindmap-side-menu/MindMapSideMenu',
  component: MindMapSideMenu,
  tags: ['autodocs'],
  // The toolbar reads the active record and flies the camera via React Flow.
  decorators: [(Story) => <ReactFlowProvider><Story /></ReactFlowProvider>],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MindMapSideMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
