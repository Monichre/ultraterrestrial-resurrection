import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CloneChildNode } from './clone-node'


const meta = {
  title: 'Mindmap/clones/clone-node',
  component: CloneChildNode,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CloneChildNode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
